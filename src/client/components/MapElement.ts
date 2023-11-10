import { html, LitElement, PropertyValues } from 'lit';
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { customElement } from 'lit/decorators.js';

import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import debounce from 'lodash-es/debounce';

@customElement('map-element')
export default class MapElement extends LitElement {
	mapRef: Ref<HTMLDivElement> = createRef();

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

		this.dispatchEvent(new CustomEvent('bounds-change', { detail: { ids } }));
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
			<div class="h-full w-full" id="map" ${ref(this.mapRef)}></div>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'map-element': MapElement;
	}
}
