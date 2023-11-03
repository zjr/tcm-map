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

	@property({ type: Boolean })
	open: boolean = false;

	render() {
		const optionEls = this.options.map(
			opt => html`
				<div class="flex items-center">
					<input
						id=${opt.value}
						name=${this.optionPath}
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
			`
		);

		const dropdownClasses = [
			'absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4',
			'shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
			this.open
				? 'transform scale-100 opacity-100 transition ease-out duration-100'
				: 'transform scale-95 opacity-0 transition ease-in duration-75 pointer-events-none'
		].join(' ');

		return html`
			<div class=${dropdownClasses}>
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
