import { css, html, PropertyValues } from 'lit';
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';

import debounce from 'lodash-es/debounce';

import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import { TwElement } from './shared/tailwind.element';

import './components/SearchControl.ts';
import './components/FilterControls.ts';
import './components/TypePill.ts';
import './components/MembersList.ts';

import { DetailAccount } from '../server/salesforce/SFClient';

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

	mapRef: Ref<HTMLDivElement> = createRef();

	@property()
	members: DetailAccount[] = results;

	async getNewResults(
		map: google.maps.Map,
		markers: google.maps.marker.AdvancedMarkerElement[]
	) {
		const ids = [];

		for (let i = 0; i < markers.length && ids.length < 500; i++) {
			if (map.getBounds()?.contains(markers[i].position!)) {
				ids.push(markers[i].getAttribute('data-id'));
			}
		}

		const res = await fetch('http://localhost:3000/accounts/details', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ids })
		});

		this.members = await res.json();
	}

	protected async firstUpdated(_changedProperties: PropertyValues) {
		super.firstUpdated(_changedProperties);

		const loader = new Loader({
			apiKey: 'AIzaSyBsSN0chGU2krx7HNvJTh6g0v3502TsByo',
			version: 'weekly'
		});

		const { Map, InfoWindow } = (await loader.importLibrary(
			'maps'
		)) as google.maps.MapsLibrary;

		const { AdvancedMarkerElement, PinElement } = (await loader.importLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		const map = new Map(this.mapRef.value!, {
			center: { lat: 37.775, lng: -122.419 },
			zoom: 10,
			mapId: 'tcm-map'
		});

		const res = await fetch('http://localhost:3000/accounts');
		const data = (await res.json()) as [string, string, number, number][];
		const locations = data.map(x => ({
			id: x[0],
			name: x[1],
			position: {
				lat: x[2],
				lng: x[3]
			}
		}));

		const infoWindow = new InfoWindow({
			content: '',
			disableAutoPan: true
		});

		// Create an array of alphabetical characters used to label the markers.
		const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		// Add some markers to the map.
		const markers = locations.map(({ id, name, position }, i) => {
			const label = labels[i % labels.length];

			const pinGlyph = new PinElement({
				glyph: label,
				glyphColor: 'white'
			});

			const marker = new AdvancedMarkerElement({
				position,
				content: pinGlyph.element
			});

			// markers can only be keyboard-focusable when they have click listeners
			// open info window when marker is clicked
			marker.addListener('click', () => {
				infoWindow.setContent(name);
				infoWindow.open(map, marker);
			});

			marker.setAttribute('data-id', id);

			return marker;
		});

		// Add a marker clusterer to manage the markers.
		new MarkerClusterer({ markers, map });

		map.addListener(
			'bounds_changed',
			debounce(this.getNewResults.bind(this, map, markers), 350)
		);
	}

	render() {
		return html`
			<div id="root" class="flex h-full flex-row overflow-hidden">
				<div
					class="z-10 flex w-full flex-col bg-white font-sans shadow-2xl sm:w-[32rem]"
				>
					<search-control class="mb-4"></search-control>
					<filter-controls></filter-controls>
					<members-list
						class="h-full overflow-y-scroll"
						.members=${this.members}
					></members-list>
				</div>
				<div class="flex-grow" id="map" ${ref(this.mapRef)}></div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'tcm-map': TcmMap;
	}
}
