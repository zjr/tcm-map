import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { TwElement } from './shared/tailwind.element.js';

import './components/tcm-map-search.ts';
import './components/tcm-map-filters.ts';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('tcm-map')
export class TcmMap extends TwElement {
	render() {
		return html`
			<div class="space-x-4 font-sans">
				<tcm-map-search></tcm-map-search>
				<tcm-map-filters></tcm-map-filters>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'tcm-map': TcmMap;
	}
}
