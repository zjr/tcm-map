import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';

@customElement('filter-dropdown')
export default class FilterButton extends TwElement {
	@property()
	optionPath: string = 'option[]';

	@property()
	options: { value: string; label: string; checked?: boolean }[] = [
		{
			value: 'health',
			label: 'Health'
		},
		{
			value: 'education',
			label: 'Education',
			checked: true
		},
		{
			value: 'info',
			label: 'Info/Communication'
		}
	];

	render() {
		const optionEls = this.options.map(
			opt => html`
				<div class="flex items-center">
					<input
						id="filter-category-0"
						name=${this.optionPath}
						value=${opt.value}
						type="checkbox"
						?checked=${opt.checked}
						class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					/>
					<label
						for="filter-category-0"
						class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
					>
						${opt.label}
					</label>
				</div>
			`
		);

		return html`
			<!--
				'Category' dropdown, show/hide based on dropdown state.

				Entering: "transition ease-out duration-100"
					From: "transform opacity-0 scale-95"
					To: "transform opacity-100 scale-100"
				Leaving: "transition ease-in duration-75"
					From: "transform opacity-100 scale-100"
					To: "transform opacity-0 scale-95"
			-->
			<div
				class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
			>
				<form class="space-y-4">${optionEls}</form>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-dropdown': FilterButton;
	}
}
