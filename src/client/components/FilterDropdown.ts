import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';
import { IFilter, IFilterOption } from './FilterControls';

@customElement('filter-dropdown')
export default class FilterButton extends TwElement {
	@property()
	filter: IFilter = { value: '', label: '' };

	@property({ type: Boolean })
	open: boolean = false;

	private renderFilterOptions(opt: IFilterOption) {
		return html`
			<div class="flex items-center">
				<input
					name=${this.filter.value}
					id=${opt.value}
					value=${opt.value}
					type="checkbox"
					?checked=${opt.checked}
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
				/>
				<label
					for=${opt.value}
					class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
				>
					${opt.label}
				</label>
			</div>
		`;
	}

	render() {
		const dropdownClasses = [
			'absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4',
			'shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
			this.open
				? 'transform scale-100 opacity-100 transition ease-out duration-100'
				: 'transform scale-95 opacity-0 transition ease-in duration-75 pointer-events-none'
		].join(' ');

		return html`
			<div class=${dropdownClasses}>
				<form class="space-y-4">
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
