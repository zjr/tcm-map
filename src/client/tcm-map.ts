import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { TwElement } from './shared/tailwind.element.js';

import './components/SearchControl.ts';
import './components/FiltersControls.ts';

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
				<search-control></search-control>
				<filter-controls></filter-controls>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'tcm-map': TcmMap;
	}
}
