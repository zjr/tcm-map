import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element.js';

import './FilterButton.ts';
import './FilterDropdown.ts';

@customElement('filter-control')
export default class FilterControl extends TwElement {
	@property()
	label: string = 'Label';

	@property()
	count: number = 0;

	render() {
		return html`
			<div class="relative inline-block px-4 text-left">
				<filter-button label=${this.label} count=${this.count}></filter-button>
				<filter-dropdown></filter-dropdown>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-control': FilterControl;
	}
}
