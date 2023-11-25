import { css, html, nothing } from 'lit';
import { provide } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';
import { ref, Ref, createRef } from 'lit/directives/ref.js';

import debounce from 'lodash-es/debounce';

import FilterEvent from './events/FilterEvent';
import MapElement from './components/MapElement';
import { TwElement } from './components/shared/tailwind.element';
import { DetailAccount, PinTuple } from '../server/salesforce/types';
import { FiltersContext, filtersContext } from './contexts/filtersContext';

import './components/SearchControl.ts';
import './components/FilterControls.ts';
import './components/MembersList.ts';
import './components/MapElement.ts';
import './components/TypePill.ts';

/**
 * TODO:
 * - [x] style the sort dropdown
 * - [x] add auto-close to sort dropdown
 * - [x] add state to the active filter bar
 * - [x] add a 'no filters' state the filter bar
 * - [x] drop the photos, at least for v1
 * - [x] email Nima/TCM about "type"
 * - [x] add the google map
 * - [x] connect to salesforce api
 * - [x] get lists
 * - [x] filter with industry
 * - [x] filter with type
 * - [x] filter with locations
 * - [x] search lists
 * - [x] style the google map's place pins
 * - [x] affect map by filtering / searching (establish og list, filter it)
 * - [x] move map to contain elements after filtering
 * - [x] add caching
 * - [x] load initial set to replace `results` array
 * - [x] prep for deployment
 * - [x] map jerks you around after it's been bounded
 * - [x] map doesn't include all the items that it should in full after filter
 * - [x] move map out if you filter w/o points in view
 * - [ ] mobile UI
 * - [ ] add pagination
 * - [ ] add some basic credential for reseed
 * - [ ] replace api call locations with some env defined host, see: https://vitejs.dev/guide/build.html#public-base-path
 * - [ ] deploy
 * - [ ] trigger reseed on cron
 */

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('tcm-map')
export class TcmMap extends TwElement {
	static styles = [
		super.styles,
		css`
			:host {
				display: block;
				height: 66vh;
			}
		`
	];

	@provide({ context: filtersContext })
	filters: FiltersContext = {
		locations: new Set(),
		industries: new Set(),
		types: new Set()
	};

	private async setFilters({ detail: { key, val, del } }: FilterEvent) {
		if (Object.keys(this.filters).includes(key)) {
			this.filters[key as keyof FiltersContext][del ? 'delete' : 'add'](val);
			this.filters = { ...this.filters };
			return await this.getMembers(null, true);
		}
	}

	@state() search?: string;

	private async setSearch(e: CustomEvent<string>) {
		this.search = e.detail;
		return await this.getMembers(null, true);
	}

	@state() sort: string = 'Name#ASC';

	private async setSort(e: CustomEvent<string>) {
		this.sort = e.detail;
		return await this.getMembers(null, true);
	}

	@state() members: DetailAccount[] = [];
	@state() memberIds: string[] = [];
	@state() filteredPins: PinTuple[] = [];
	@state() bounds: google.maps.LatLngBounds | undefined;

	@state() initLoading: boolean = true;

	async connectedCallback() {
		super.connectedCallback();

		const res = await fetch('http://localhost:3000/accounts/initial', {
			headers: { 'Content-Type': 'application/json' }
		});

		this.initLoading = false;
		this.members = await res.json();
	}

	private async getMembers(
		e?: CustomEvent<{ bounds: google.maps.LatLngBounds }> | null,
		newPins: boolean = false
	) {
		if (e?.detail.bounds) this.bounds = e.detail.bounds;

		const res = await fetch('http://localhost:3000/accounts/filtered', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					newPins,
					bounds: this.bounds,
					sort: this.sort,
					search: this.search,
					filters: this.filters
				},
				(_, v) => (v instanceof Set ? [...v] : v)
			)
		});

		const { full, pins } = await res.json();

		this.members = full;
		if (newPins) this.filteredPins = pins;

		// no members in map bounds, but there are pins: rebound map;
		// but don't if running because of bounds update (i.e., user input)
		if (
			!this.members?.length &&
			this.filteredPins.length &&
			!e?.detail.bounds
		) {
			this.bounds = undefined;
			this.mapRef.value?.unlockAndReBound(this.filteredPins);
		}
	}

	mapRef: Ref<MapElement> = createRef();

	render() {
		return html`
			<div id="root" class="flex h-full flex-row overflow-hidden">
				<div
					class="z-10 flex w-full flex-col bg-white font-sans shadow-2xl sm:w-[32rem]"
				>
					<search-control
						@set-search=${debounce(this.setSearch.bind(this), 350)}
						class="mb-4"
					></search-control>
					<filter-controls
						sort=${this.sort}
						@set-sort=${this.setSort.bind(this)}
						@filter-event=${this.setFilters.bind(this)}
					></filter-controls>
					${this.initLoading ? html`<p>Loading…</p>` : nothing}
					<members-list
						class="h-full overflow-y-scroll"
						.members=${this.members}
					></members-list>
				</div>
				<map-element
					${ref(this.mapRef)}
					.filteredPins=${this.filteredPins}
					@bounds-change=${this.getMembers.bind(this)}
					class="flex-grow"
				></map-element>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'tcm-map': TcmMap;
	}
}
