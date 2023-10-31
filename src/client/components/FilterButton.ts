import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element.js';

@customElement('filter-button')
export default class FilterButton extends TwElement {
	@property()
	label: string = 'Label';

	@property()
	count: number = 0;

	render() {
		const countDisplay =
			this.count > 0
				? html`
						<span
							class="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700"
							>${this.count}</span
						>
				  `
				: '';

		return html`
			<button
				type="button"
				class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
				aria-expanded="false"
			>
				<span>${this.label}</span>
				${countDisplay}
				<svg
					class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-button': FilterButton;
	}
}
