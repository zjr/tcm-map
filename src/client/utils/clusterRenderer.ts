import {
	Cluster,
	ClusterStats,
	MarkerUtils
} from '@googlemaps/markerclusterer';

import Marker = google.maps.Marker;
import AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement;

export default function clusterRenderer(
	cluster: Cluster,
	stats: ClusterStats,
	map: google.maps.Map
): Marker | AdvancedMarkerElement {
	const { count, position } = cluster;

	// change size if this cluster has more markers than the mean cluster
	const size = count > Math.max(10, stats.clusters.markers.mean) ? 65 : 50;

	// create svg literal with fill color
	const svg = `
		<svg fill="#f05c26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="${size}" height="${size}">
			<circle cx="120" cy="120" opacity=".8" r="70" />
			<circle cx="120" cy="120" opacity=".5" r="100" />
			<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
 		</svg>`;

	const title = `Cluster of ${count} markers`;

	// adjust zIndex to be above other markers
	const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;

	if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
		// create cluster SVG element
		const parser = new DOMParser();
		const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;

		svgEl.setAttribute('transform', 'translate(0 25)');

		const clusterOptions = {
			map,
			position,
			zIndex,
			title,
			content: svgEl
		};

		return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
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
