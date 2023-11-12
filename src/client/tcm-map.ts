import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import FilterEvent from './events/FilterEvent';
import { TwElement } from './components/shared/tailwind.element';
import { DetailAccount } from '../server/salesforce/SfClient';

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
 * - [ ] style the google map's place pins
 * - [x] connect to salesforce api
 * - [x] get lists
 * - [ ] filter lists
 * - [ ] search lists
 * - [ ] add caching
 * - [ ] affect map by filtering / searching
 * - [ ] load initial set to replace `results` array
 * - [ ] prep for deployment
 */

const results = [
	{
		Id: '',
		Name: 'YMCA of the East Bay',
		npo02__MembershipJoinDate__c: '2014-08-07',
		Industry_1__c: 'Government & Public Sector',
		Website: 'https://google.com',
		BillingCity: 'Berkeley',
		BillingState: 'CA'
	},
	{
		Id: '',
		Name: 'Urban Strategies Council',
		npo02__MembershipJoinDate__c: '2012-08-07',
		Industry_1__c: 'Faith-based Groups',
		Website: 'https://google.com',
		BillingCity: 'Oakland',
		BillingState: 'CA'
	},
	{
		Id: '',
		Name: 'Game Theory Academy',
		npo02__MembershipJoinDate__c: '2011-08-07',
		Industry_1__c: 'Early Childhood',
		BillingCity: 'Oakland',
		BillingState: 'CA'
	},
	{
		Id: '',
		Name: 'San Francisco Unified School District',
		npo02__MembershipJoinDate__c: '2019-08-07',
		Industry_1__c: 'Other',
		Website: 'https://google.com',
		BillingCity: 'San Francisco',
		BillingState: 'CA'
	},
	{
		Id: '',
		Name: 'Yolo CASA',
		npo02__MembershipJoinDate__c: '2014-08-07',
		Industry_1__c: 'Philanthropy',
		Website: 'https://google.com',
		BillingCity: 'Berkeley',
		BillingState: 'CA'
	}
];

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

	@state() filters: { [k: string]: Set<string> } = {
		locations: new Set(),
		industries: new Set(),
		types: new Set()
	};

	private async setFilters({ detail: { key, val, del } }: FilterEvent) {
		this.filters[key][del ? 'delete' : 'add'](val);
		return await this.getMembers();
	}

	@state() sort: string = 'Name#ASC';

	private async setSort(e: CustomEvent<string>) {
		this.sort = e.detail;
		return await this.getMembers();
	}

	@state() members: DetailAccount[] = results;
	@state() memberIds: string[] = [];

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
					filters: this.filters
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
					<search-control class="mb-4"></search-control>
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
