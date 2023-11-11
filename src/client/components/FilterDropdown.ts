import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from './shared/tailwind.element';
import { IFilter, IFilterOption } from './FilterControls';

@customElement('filter-dropdown')
export default class FilterButton extends TwElement {
	@property()
	filter: IFilter = { value: '', label: '' };

	@property({ type: Boolean })
	open: boolean | null = null;

	private renderFilterOptions(opt: IFilterOption) {
		return html`
			<div class="flex items-center">
				<input
					name=${this.filter.value}
					id=${opt.value}
					value=${opt.value}
					type="checkbox"
					?checked=${opt.checked}
					class="h-4 w-4 cursor-pointer rounded border-gray-300 text-tcmOrange-500 focus:ring-tcmOrange-500"
				/>
				<label
					for=${opt.value}
					class="ml-3 cursor-pointer whitespace-nowrap pr-6 text-sm font-medium capitalize text-gray-900"
				>
					${opt.label || opt.value}
				</label>
			</div>
		`;
	}

	render() {
		const dropdownClasses = [
			'absolute right-0 z-10 mt-2 origin-top-right bg-gray-50 p-4 scale-0 opacity-0',
			'shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
			this.open === null ? '' : this.open ? 'animate-pop' : 'animate-hide'
		].join(' ');

		return html`
			<div class=${dropdownClasses}>
				<form class="space-y-4">
					${this.filter.children}
					${this.filter.options?.map(this.renderFilterOptions.bind(this))}
				</form>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-dropdown': FilterButton;
	}
}
