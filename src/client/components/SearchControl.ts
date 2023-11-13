import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('search-control')
export class SearchControl extends LitElement {
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	private _onChange(e: InputEvent) {
		if (!e.target || !('value' in e.target)) return;
		this.dispatchEvent(
			new CustomEvent('set-search', {
				detail: e.target.value,
				bubbles: true,
				composed: true
			})
		);
	}

	render() {
		return html`
			<div class="px-4 pt-4 sm:px-6 lg:px-8">
				<label
					for="member-search"
					class="block max-w-xs text-sm font-medium leading-6 text-gray-900"
					>Search members by name</label
				>
				<div class="relative mt-2 max-w-xs shadow-sm">
					<input
						@input=${this._onChange.bind(this)}
						type="search"
						name="member-search"
						id="member-search"
						class="peer block w-full border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-tcmOrange-500 sm:text-sm sm:leading-6"
						placeholder="Susan Appleseed"
					/>
					<div
						class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 peer-focus:text-gray-600"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="h-5 w-5"
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
