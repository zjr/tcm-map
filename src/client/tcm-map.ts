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
 * - [ ] (deploy) add some basic credential for reseed
 * - [ ] (deploy) replace api call locations with some env defined host, see: https://vitejs.dev/guide/build.html#public-base-path
 * - [ ] (deploy) deploy to TCM’s page
 * - [ ] (deploy) trigger reseed on cron
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
				@media (min-width: 1024px) {
					& {
						height: 66vh;
					}
				}
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
	@state() nextBody: string | undefined = '';

	@state() bounds: google.maps.LatLngBounds | undefined;
	@state() filteredPins: PinTuple[] = [];

	@state() initLoading: boolean = true;

	async connectedCallback() {
		super.connectedCallback();

		const res = await fetch('http://localhost:3000/accounts/initial', {
			headers: { 'Content-Type': 'application/json' }
		});

		const data = await res.json();

		this.members = data.full;
		this.nextBody = data.next;

		this.initLoading = false;
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

		const { full, pins, next } = await res.json();

		this.members = full;
		this.nextBody = next;
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

	private _pagedMembers(
		e: CustomEvent<{ full: DetailAccount[]; next: string }>
	) {
		this.members.push(...e.detail.full);
		this.nextBody = e.detail.next;
	}
	pagedMembers = this._pagedMembers.bind(this);

	mapRef: Ref<MapElement> = createRef();

	render() {
		return html`
			<div
				id="root"
				class="flex h-[120vh] flex-col-reverse overflow-hidden lg:h-full lg:flex-row"
			>
				<div
					class="z-10 flex h-1/2 w-full flex-col bg-white font-sans shadow-2xl lg:h-full lg:w-[32rem]"
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
						.nextBody=${this.nextBody}
						@members-paged=${this.pagedMembers}
					></members-list>
				</div>
				<map-element
					${ref(this.mapRef)}
					.filteredPins=${this.filteredPins}
					@bounds-change=${this.getMembers.bind(this)}
					class="h-[50vh] flex-grow lg:h-full"
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
