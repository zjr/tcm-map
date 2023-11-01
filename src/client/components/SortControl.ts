import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';

@customElement('sort-control')
export default class SortControl extends TwElement {
	@property()
	sortOptions: { value: string; label: string; active?: boolean }[] = [
		{ value: 'name_asc', label: 'A - Z', active: true },
		{ value: 'name_desc', label: 'Z - A' },
		{ value: 'memberSince_asc', label: 'Oldest' },
		{ value: 'memberSince_desc', label: 'Newest' }
	];

	@state()
	protected _open = false;

	render() {
		const optionEls = this.sortOptions.map((opt, idx) => {
			const optionClasses = [
				'block px-4 py-2 text-sm  hover:bg-gray-100',
				opt.active ? 'font-medium text-gray-900' : 'text-gray-500'
			].join(' ');

			return html`
				<a
					href="#sort=${opt.value}"
					class=${optionClasses}
					role="menuitem"
					tabindex="-1"
					id="menu-item-${idx}"
					>${opt.label}</a
				>
			`;
		});

		// I am not sure Tailwind was a great fit!
		const dropdownClasses = [
			'absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md',
			'bg-white shadow-2xl ring-1 ring-black ring-opacity-5',
			'focus:outline-none',
			this._open
				? 'transform scale-100 opacity-100 transition ease-out duration-100'
				: 'transform scale-95 opacity-0 transition ease-in duration-75'
		].join(' ');

		return html`
			<!-- Sorts -->
			<div class="relative inline-block text-left">
				<div>
					<button
						type="button"
						class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
						id="menu-button"
						aria-expanded="false"
						aria-haspopup="true"
						@click=${() => (this._open = !this._open)}
					>
						Sort
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
				</div>
				<div
					class=${dropdownClasses}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1"
				>
					<div class="py-1" role="none">${optionEls}</div>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'sort-control': SortControl;
	}
}
