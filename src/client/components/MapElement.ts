import { html, LitElement, PropertyValues } from 'lit';
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { customElement, property, state } from 'lit/decorators.js';

import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import debounce from 'lodash-es/debounce';

import clusterRenderer from '../utils/clusterRenderer';
import type { PinTuple } from '../../server/salesforce/types';

type AMElement = google.maps.marker.AdvancedMarkerElement;
type Location = {
	id: string;
	name: string;
	position: {
		lat: number;
		lng: number;
	};
};

@customElement('map-element')
export default class MapElement extends LitElement {
	mapRef: Ref<HTMLDivElement> = createRef();

	@state() map: google.maps.Map | undefined = undefined;

	@state() mapLocked: boolean = false;
	@state() autoPanning: boolean = false;

	@state() allMarkers: AMElement[] = [];
	@state() markerCluster: MarkerClusterer | undefined = undefined;
	@state() infoWindow: google.maps.InfoWindow | undefined = undefined;
	@state() AMElement:
		| typeof google.maps.marker.AdvancedMarkerElement
		| undefined = undefined;

	@property() filteredPins: PinTuple[] | undefined;

	private async getNewResults(markers: AMElement[]) {
		if (this.autoPanning) return;

		const ids = [];

		// TODO: this could tell the map to unlock if there's no IDs?
		for (let i = 0; i < markers.length && ids.length < 500; i++) {
			if (this.map!.getBounds()?.contains(markers[i].position!)) {
				ids.push(markers[i].getAttribute('data-id'));
			}
		}

		this.dispatchEvent(new CustomEvent('bounds-change', { detail: { ids } }));
	}

	private async makeClusterer(markers: AMElement[]): Promise<MarkerClusterer> {
		return new MarkerClusterer({
			markers,
			map: this.map,
			// @ts-ignore
			algorithmOptions: { radius: 120 },
			renderer: { render: clusterRenderer }
		});
	}

	private mapDatumToLocation(datum: PinTuple): Location {
		return {
			id: datum[0],
			name: datum[1],
			position: {
				lat: datum[2],
				lng: datum[3]
			}
		};
	}

	private domParser = new DOMParser();

	private makeMarker(
		bounds: google.maps.LatLngBounds,
		{ id, name, position }: Location
	): AMElement {
		bounds!.extend(position);

		// A marker with a custom inline SVG.
		const pinSvgString =
			'<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39 21C39 35.284 24 43.5 24 43.5C24 43.5 9 35.284 9 21C9 17.0218 10.5804 13.2064 13.3934 10.3934C16.2064 7.58035 20.0218 6 24 6C27.9782 6 31.7936 7.58035 34.6066 10.3934C37.4196 13.2064 39 17.0218 39 21Z" fill="#F05C26" stroke="#F05C26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 21C30 22.5913 29.3679 24.1174 28.2426 25.2426C27.1174 26.3679 25.5913 27 24 27C22.4087 27 20.8826 26.3679 19.7574 25.2426C18.6321 24.1174 18 22.5913 18 21C18 19.4087 18.6321 17.8826 19.7574 16.7574C20.8826 15.6321 22.4087 15 24 15C25.5913 15 27.1174 15.6321 28.2426 16.7574C29.3679 17.8826 30 19.4087 30 21Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

		const pinSvg = this.domParser.parseFromString(
			pinSvgString,
			'image/svg+xml'
		).documentElement;

		// const pinGlyph = new PinElement();
		const marker = new this.AMElement!({
			position,
			// content: pinGlyph.element
			content: pinSvg,
			collisionBehavior: google.maps.CollisionBehavior.REQUIRED
		});

		// markers can only be keyboard-focusable when they have click listeners
		// open info window when marker is clicked
		marker.addListener('click', () => {
			this.infoWindow!.setContent(name);
			this.infoWindow!.open(this.map, marker);
		});

		marker.setAttribute('data-id', id);

		return marker;
	}

	private async makeMarkers(data: PinTuple[]): Promise<AMElement[]> {
		const locations = data.map(this.mapDatumToLocation);
		const bounds = new google.maps.LatLngBounds();
		const markers = locations.map(this.makeMarker.bind(this, bounds));

		if (this.markerCluster) {
			this.markerCluster.clearMarkers();
			this.markerCluster.addMarkers(markers);
		} else {
			this.markerCluster = await this.makeClusterer(markers);
		}

		if (bounds && !this.mapLocked) {
			this.autoPanning = true; // so we don't lock map

			this.map?.fitBounds(bounds);

			const idleListener = this.map?.addListener('idle', () => {
				this.autoPanning = false;
				idleListener?.remove();
			});
		}

		return markers;
	}

	private setMapLocked(lock: boolean = true) {
		if (!this.autoPanning) this.mapLocked = lock;
	}

	protected async firstUpdated(_changedProperties: PropertyValues) {
		super.firstUpdated(_changedProperties);

		const apiKey = import.meta.env.VITE_MAPS_API_KEY;
		if (!apiKey) throw new Error('no api key');
		const loader = new Loader({ apiKey, version: 'weekly' });

		const { Map, InfoWindow } = await loader.importLibrary('maps');
		const { AdvancedMarkerElement } = await loader.importLibrary('marker');

		this.AMElement = AdvancedMarkerElement;

		this.map = new Map(this.mapRef.value!, {
			mapId: 'tcm-map',
			zoom: 6,
			center: { lat: 37, lng: -119 },
			gestureHandling: 'cooperative'
		});

		this.infoWindow = new InfoWindow({ content: '', disableAutoPan: true });

		const res = await fetch('http://localhost:3000/accounts');
		const data = (await res.json()) as PinTuple[];
		this.allMarkers = await this.makeMarkers(data);

		// lock the map on user input, until they filter out all the markers
		this.map.addListener('drag', this.setMapLocked.bind(this));
		this.map.addListener('zoom_changed', this.setMapLocked.bind(this));

		this.map.addListener(
			'bounds_changed',
			debounce(this.getNewResults.bind(this, this.allMarkers), 350)
		);
	}

	async willUpdate(changedProperties: PropertyValues<this>) {
		if (!changedProperties.has('filteredPins') || !this.map) return;

		if (this.filteredPins && this.filteredPins.length > 0) {
			await this.makeMarkers(this.filteredPins);
		} else {
			console.log(this.filteredPins, this.filteredPins?.length);
			this.markerCluster?.clearMarkers();
		}
	}

	render() {
		return html`
			<div id="map" class="h-full w-full" ${ref(this.mapRef)}></div>
			<div id="mapPin"></div>
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
