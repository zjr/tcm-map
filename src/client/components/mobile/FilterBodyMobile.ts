import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';

import FilterEvent from '../../events/FilterEvent';
import { IFilter, IFilterOption } from '../FilterControls';
import { filtersContext, FiltersContext } from '../../contexts/filtersContext';

@customElement('filter-body-mobile')
export default class FilterBodyMobile extends LitElement {
	@property()
	filter: IFilter = { value: '', label: '' };

	@consume({ context: filtersContext, subscribe: true })
	@property({ attribute: false })
	public filters?: FiltersContext;

	private renderFilterOptions(opt: IFilterOption) {
		const checked = this.filters?.[
			this.filter.value as keyof FiltersContext
		].has(opt.value);

		return html`
			<div class="flex items-center">
				<input
					name=${this.filter.value}
					id=${opt.value}
					value=${opt.value}
					type="checkbox"
					@click=${(e: Event) =>
						this.dispatchEvent(
							new FilterEvent({
								key: this.filter.value,
								val: opt.value,
								del: !(e.target as HTMLInputElement)?.checked
							})
						)}
					.checked=${checked}
					class="h-4 w-4 cursor-pointer rounded border-gray-300 text-tcmOrange-500 focus:ring-tcmOrange-500"
				/>
				<label
					for=${opt.value}
					class="ml-3 cursor-pointer whitespace-nowrap pr-6 text-sm capitalize text-gray-500"
				>
					${opt.label || opt.value}
				</label>
			</div>
		`;
	}

	render() {
		return html`
			<div class="pt-6">
				<div class="space-y-6">
					${this.filter.children}
					${this.filter.options?.map(this.renderFilterOptions.bind(this))}
				</div>
			</div>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-body-mobile': FilterBodyMobile;
	}
}
