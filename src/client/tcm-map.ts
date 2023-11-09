import { html, PropertyValues } from 'lit';
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';

// @ts-ignore
import debounce from 'lodash.debounce';

import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import { TwElement } from './shared/tailwind.element';

import './components/SearchControl.ts';
import './components/FilterControls.ts';
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
 * - [ ] connect to salesforce api
 * - [ ] get lists
 * - [ ] filter lists
 * - [ ] search lists
 * - [ ] add caching
 * - [ ] affect map by filtering / searching
 * - [ ] prep for deployment
 */

const secondsInAYear = 3.154e7;

const results = [
	{
		name: 'YMCA of the East Bay',
		startDate: 1698938838 - secondsInAYear * 2,
		type: 'health',
		typeLabel: 'Health',
		url: 'https://google.com',
		billingCity: 'Berkeley',
		billingState: 'CA'
	},
	{
		name: 'Urban Strategies Council',
		startDate: 1698938838 - secondsInAYear * 5,
		type: 'infoComm',
		typeLabel: 'Info/Communications',
		url: 'https://google.com',
		billingCity: 'Oakland',
		billingState: 'CA'
	},
	{
		name: 'Game Theory Academy',
		startDate: 1698938838 - secondsInAYear,
		type: 'education',
		typeLabel: 'Education',
		billingCity: 'Oakland',
		billingState: 'CA'
	},
	{
		name: 'San Francisco Unified School District',
		startDate: 1698938838 - secondsInAYear * 7,
		type: 'education',
		typeLabel: 'Education',
		url: 'https://google.com',
		billingCity: 'San Francisco',
		billingState: 'CA'
	},
	{
		name: 'Yolo CASA',
		startDate: 1698938838,
		type: 'health',
		typeLabel: 'Health',
		url: 'https://google.com',
		billingCity: 'Berkeley',
		billingState: 'CA'
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
	mapRef: Ref<HTMLDivElement> = createRef();

	getNewResults(
		map: google.maps.Map,
		markers: google.maps.marker.AdvancedMarkerElement[]
	) {
		const boundedMarkers = [];
		for (let i = 0; i < markers.length && boundedMarkers.length < 20; i++) {
			if (map.getBounds()?.contains(markers[i].position!)) {
				boundedMarkers.push(markers[i]);
			}
		}

		// @ts-ignore
		const ids = boundedMarkers.map(x => x.attributes['data-id']);

		console.log(ids);
	}

	protected async firstUpdated(_changedProperties: PropertyValues) {
		super.firstUpdated(_changedProperties);

		const loader = new Loader({
			apiKey: 'AIzaSyBsSN0chGU2krx7HNvJTh6g0v3502TsByo',
			version: 'weekly'
		});

		await loader.load();
		const { Map, InfoWindow } = (await google.maps.importLibrary(
			'maps'
		)) as google.maps.MapsLibrary;
		const { AdvancedMarkerElement, PinElement } =
			(await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

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

			// markers can only be keyboard focusable when they have click listeners
			// open info window when marker is clicked
			marker.addListener('click', () => {
				infoWindow.setContent(name);
				infoWindow.open(map, marker);
			});

			marker.attributes['data-id'] = id;

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
			<div id="root" class="flex flex-row overflow-hidden">
				<div class="z-10 space-y-4 bg-white font-sans shadow-2xl">
					<search-control></search-control>
					<filter-controls class="block"></filter-controls>
					<div
						class="mx-4 divide-y divide-gray-100 border-b border-b-gray-100 sm:mx-6 lg:mx-8"
					>
						${results.map(member => {
							const memberLink = member.url
								? [
										' • ',
										html`<a
											href=${member.url}
											class="text-tcmYellow-900 underline"
											>Visit Website</a
										>`
								  ]
								: null;

							return html`
								<div class="flex justify-between space-x-4 py-5">
									<div class="flex space-x-4">
										<!--<img src="" alt="" class="h-14 w-14 rounded-full" />-->
										<div class="space-y-1.5">
											<p class="text-lg font-bold text-gray-800">
												${member.name}
											</p>
											<p class="text-gray-500">
												<span
													>Member since
													${new Date(
														member.startDate * 1000
													).getFullYear()}</span
												>${memberLink}
											</p>
										</div>
									</div>
									<div class="space-y-2 pt-[5px] text-right">
										<p class="text-gray-600">
											${member.billingCity}, ${member.billingState}
										</p>
										<type-pill .member=${member}></type-pill>
									</div>
								</div>
							`;
						})}
					</div>
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
