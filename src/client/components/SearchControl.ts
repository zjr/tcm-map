import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element.js';

@customElement('search-control')
export class SearchControl extends TwElement {
	render() {
		return html`
			<div>
				<label
					for="member-search"
					class="block text-sm font-medium leading-6 text-gray-900"
					>Search members by name</label
				>
				<div class="relative mt-2 rounded-md shadow-sm">
					<input
						type="text"
						name="member-search"
						id="member-search"
						class="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						placeholder="Susan Appleseed"
					/>
					<div
						class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-5 w-5 text-gray-400"
						>
							<path
								fill-rule="evenodd"
								d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'search-control': SearchControl;
	}
}
