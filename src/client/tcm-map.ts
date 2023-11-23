import { css, html } from 'lit';
import { provide } from '@lit/context';
import { customElement, state } from 'lit/decorators.js';

import debounce from 'lodash-es/debounce';

import FilterEvent from './events/FilterEvent';
import { TwElement } from './components/shared/tailwind.element';
import { DetailAccount } from '../server/salesforce/types';
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
 * - [ ] affect map by filtering / searching (establish og list, filter it)
 * - [x] add caching
 * - [x] load initial set to replace `results` array
 * - [x] prep for deployment
 * - [ ] deploy
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
			return await this.getMembers();
		}
	}

	@state() search?: string;

	private async setSearch(e: CustomEvent<string>) {
		this.search = e.detail;
		return await this.getMembers();
	}

	@state() sort: string = 'Name#ASC';

	private async setSort(e: CustomEvent<string>) {
		this.sort = e.detail;
		return await this.getMembers();
	}

	@state() members: DetailAccount[] = [];
	@state() memberIds: string[] = [];

	async connectedCallback() {
		super.connectedCallback();

		const res = await fetch('http://localhost:3000/accounts/initial', {
			headers: { 'Content-Type': 'application/json' }
		});

		this.members = await res.json();
	}

	private async getMembers(e?: CustomEvent<{ ids: string[] }>) {
		if (e && !Array.isArray(e.detail.ids)) return;

		if (e?.detail?.ids) {
			this.memberIds = e.detail.ids;
		}

		const res = await fetch('http://localhost:3000/accounts/details', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(
				{
					ids: this.memberIds,
					sort: this.sort,
					filters: this.filters,
					search: this.search
				},
				(_, v) => (v instanceof Set ? [...v] : v)
			)
		});

		this.members = await res.json();
	}

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
					<members-list
						class="h-full overflow-y-scroll"
						.members=${this.members}
					></members-list>
				</div>
				<map-element
					class="flex-grow"
					@bounds-change=${this.getMembers.bind(this)}
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
