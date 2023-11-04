import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';
import { IFilter } from './FilterControls';

import './FilterButton.ts';
import './FilterDropdown.ts';

@customElement('filter-control')
export default class FilterControl extends TwElement {
	@property()
	filter: IFilter = { value: '', label: '' };

	@property({ type: Boolean })
	open: boolean = false;

	render() {
		return html`
			<div class="relative inline-block px-4 text-left">
				<filter-button
					@click=${() =>
						this.dispatchEvent(
							new CustomEvent('open-dropdown', {
								detail: { value: this.filter.value }
							})
						)}
					label=${this.filter.label}
					count=${this.filter.count}
				></filter-button>
				<filter-dropdown ?open=${this.open} .filter=${this.filter}>
				</filter-dropdown>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-control': FilterControl;
	}
}
