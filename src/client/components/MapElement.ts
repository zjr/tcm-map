import { html, LitElement, PropertyValues } from 'lit';
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { customElement, property, state } from 'lit/decorators.js';

import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer, MarkerUtils } from '@googlemaps/markerclusterer';

import debounce from 'lodash-es/debounce';
import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

import type { PinTuple } from '../../server/salesforce/types';

@customElement('map-element')
export default class MapElement extends LitElement {
	mapRef: Ref<HTMLDivElement> = createRef();

	@state() map: google.maps.Map | undefined = undefined;
	@state() allMarkers: AdvancedMarkerElement[] = [];
	@state() markerCluster: MarkerClusterer | undefined = undefined;
	@state() infoWindow: google.maps.InfoWindow | undefined = undefined;
	@state() AMElement:
		| typeof google.maps.marker.AdvancedMarkerElement
		| undefined = undefined;

	@property() filteredPins: PinTuple[] | undefined;

	private async getNewResults(markers: AdvancedMarkerElement[]) {
		const ids = [];

		for (let i = 0; i < markers.length && ids.length < 500; i++) {
			if (this.map!.getBounds()?.contains(markers[i].position!)) {
				ids.push(markers[i].getAttribute('data-id'));
			}
		}

		this.dispatchEvent(new CustomEvent('bounds-change', { detail: { ids } }));
	}

	private async makeMarkers(
		data?: PinTuple[]
	): Promise<AdvancedMarkerElement[]> {
		let bounds: google.maps.LatLngBounds | undefined;
		let markers;

		if (data) {
			const locations = data.map(x => ({
				id: x[0],
				name: x[1],
				position: {
					lat: x[2],
					lng: x[3]
				}
			}));

			bounds = new google.maps.LatLngBounds();

			markers = locations.map(({ id, name, position }) => {
				bounds!.extend(position);

				const parser = new DOMParser();

				// A marker with a custom inline SVG.
				const pinSvgString =
					'<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39 21C39 35.284 24 43.5 24 43.5C24 43.5 9 35.284 9 21C9 17.0218 10.5804 13.2064 13.3934 10.3934C16.2064 7.58035 20.0218 6 24 6C27.9782 6 31.7936 7.58035 34.6066 10.3934C37.4196 13.2064 39 17.0218 39 21Z" fill="#F05C26" stroke="#F05C26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 21C30 22.5913 29.3679 24.1174 28.2426 25.2426C27.1174 26.3679 25.5913 27 24 27C22.4087 27 20.8826 26.3679 19.7574 25.2426C18.6321 24.1174 18 22.5913 18 21C18 19.4087 18.6321 17.8826 19.7574 16.7574C20.8826 15.6321 22.4087 15 24 15C25.5913 15 27.1174 15.6321 28.2426 16.7574C29.3679 17.8826 30 19.4087 30 21Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

				const pinSvg = parser.parseFromString(
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
			});
		} else {
			markers = this.allMarkers;
		}

		if (this.markerCluster) {
			this.markerCluster.clearMarkers();
			this.markerCluster.addMarkers(markers);
		} else {
			// Add a marker clusterer to manage the markers.
			this.markerCluster = new MarkerClusterer({
				map: this.map,
				markers,
				// @ts-ignore
				algorithmOptions: { radius: 120 },
				renderer: {
					render({ count, position }, stats, map) {
						// change size if this cluster has more markers than the mean cluster
						const size =
							count > Math.max(10, stats.clusters.markers.mean) ? 65 : 50;

						// create svg literal with fill color
						const svg = `
						 <svg fill="#f05c26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="${size}" height="${size}">
								<circle cx="120" cy="120" opacity=".8" r="70" />
								<circle cx="120" cy="120" opacity=".5" r="100" />
								<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
						 </svg>
					`;

						const title = `Cluster of ${count} markers`;

						// adjust zIndex to be above other markers
						const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;

						if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
							// create cluster SVG element
							const parser = new DOMParser();
							const svgEl = parser.parseFromString(
								svg,
								'image/svg+xml'
							).documentElement;

							svgEl.setAttribute('transform', 'translate(0 25)');

							const clusterOptions = {
								map,
								position,
								zIndex,
								title,
								content: svgEl
							};

							return new google.maps.marker.AdvancedMarkerElement(
								clusterOptions
							);
						}

						const clusterOptions = {
							position,
							zIndex,
							title,
							icon: {
								url: `data:image/svg+xml;base64,${btoa(svg)}`,
								anchor: new google.maps.Point(25, 25)
							}
						};

						return new google.maps.Marker(clusterOptions);
					}
				}
			});
		}

		if (bounds) this.map?.fitBounds(bounds);

		return markers;
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

		const { AdvancedMarkerElement } = (await loader.importLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		this.AMElement = AdvancedMarkerElement;

		this.map = new Map(this.mapRef.value!, {
			center: { lat: 37, lng: -119 },
			zoom: 6,
			mapId: 'tcm-map'
		});

		this.infoWindow = new InfoWindow({
			content: '',
			disableAutoPan: true
		});

		const res = await fetch('http://localhost:3000/accounts');
		const data = (await res.json()) as PinTuple[];
		this.allMarkers = await this.makeMarkers(data);

		this.map.addListener(
			'bounds_changed',
			debounce(this.getNewResults.bind(this, this.allMarkers), 350)
		);
	}

	async willUpdate(changedProperties: PropertyValues<this>) {
		if (!changedProperties.has('filteredPins') || !this.map) return;

		if (!this.filteredPins || this.filteredPins.length <= 0) {
			await this.makeMarkers();
		} else {
			await this.makeMarkers(this.filteredPins);
		}
	}

	render() {
		return html`
			<div class="h-full w-full" id="map" ${ref(this.mapRef)}></div>
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
