import { customElement } from 'lit/decorators.js';
import { TwElement } from '../shared/tailwind.element';
import { html } from 'lit';

@customElement('sort-control')
export default class SortControl extends TwElement {
	render() {
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

				<!--
					Dropdown menu, show/hide based on menu state.

					Entering: "transition ease-out duration-100"
						From: "transform opacity-0 scale-95"
						To: "transform opacity-100 scale-100"
					Leaving: "transition ease-in duration-75"
						From: "transform opacity-100 scale-100"
						To: "transform opacity-0 scale-95"
				-->
				<div
					class="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1"
				>
					<div class="py-1" role="none">
						<!--
							Active: "bg-gray-100", Not Active: ""

							Selected: "font-medium text-gray-900", Not Selected: "text-gray-500"
						-->
						<a
							href="#"
							class="block px-4 py-2 text-sm font-medium text-gray-900"
							role="menuitem"
							tabindex="-1"
							id="menu-item-0"
							>Most Popular</a
						>
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-500"
							role="menuitem"
							tabindex="-1"
							id="menu-item-1"
							>Best Rating</a
						>
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-500"
							role="menuitem"
							tabindex="-1"
							id="menu-item-2"
							>Newest</a
						>
					</div>
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
