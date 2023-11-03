import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';

import './FilterButton.ts';
import './FilterDropdown.ts';

@customElement('filter-control')
export default class FilterControl extends TwElement {
	@property()
	value: string = '';

	@property()
	label: string = 'Label';

	@property()
	count: number = 0;

	@property({ type: Boolean })
	open: boolean = false;

	render() {
		return html`
			<div class="relative inline-block px-4 text-left">
				<filter-button
					@click=${() =>
						this.dispatchEvent(
							new CustomEvent('open-dropdown', {
								detail: { value: this.value }
							})
						)}
					label=${this.label}
					count=${this.count}
				></filter-button>
				<filter-dropdown
					?open=${this.open}
					optionPath=${this.value}
				></filter-dropdown>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-control': FilterControl;
	}
}
