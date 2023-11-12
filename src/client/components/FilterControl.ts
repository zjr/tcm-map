import { html } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';

import { IFilter } from './FilterControls';
import { TwElement } from './shared/tailwind.element';
import { FiltersContext, filtersContext } from '../contexts/filtersContext';

import './FilterButton.ts';
import './FilterDropdown.ts';

@customElement('filter-control')
export default class FilterControl extends TwElement {
	@property()
	filter: IFilter = { value: '', label: '' };

	@property({ type: Boolean })
	open: boolean = false;

	@consume({ context: filtersContext, subscribe: true })
	@property({ attribute: false })
	public filters?: FiltersContext;

	render() {
		const count =
			this.filters?.[this.filter.value as keyof FiltersContext]?.size;

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
					count=${count}
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
