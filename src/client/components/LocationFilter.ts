import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './LocationFilterOptions.ts';

type levelOptions = 'regions' | 'counties';

@customElement('location-filter')
export default class LocationFilter extends LitElement {
	@state()
	level: levelOptions = 'regions';

	@state()
	private _locationFilter: string = '';

	private _setLocationFilter(e: InputEvent) {
		if (e.target instanceof HTMLInputElement) {
			this._locationFilter = e.target.value;
		}
	}

	render() {
		return html`
			<fieldset class="min-w-[16rem] space-y-4">
				<legend class="hidden text-sm text-gray-500 md:mb-4 md:block">
					Filter by Location
				</legend>
				<div class="!mt-0 flex space-x-6 px-1 py-0.5">
					${(['regions', 'counties'] as levelOptions[]).map(
						level => html`
							<span
								class="flex flex-row items-center space-x-1.5"
								@click=${() => {
									if (this.level !== level) {
										this.level = level;
										this._locationFilter = '';
									}
								}}
							>
								<input
									class="m-0 h-4 w-4 cursor-pointer border-0 text-tcmOrange-500 ring-1 ring-gray-400 checked:ring-tcmOrange-500 focus:ring-tcmOrange-500"
									type="radio"
									name="locationType"
									id=${level}
									.checked=${level === this.level}
								/>
								<label
									class="cursor-pointer text-sm capitalize text-gray-800"
									for=${level}
									>${level}</label
								>
							</span>
						`
					)}
				</div>
				<div class="relative">
					<input
						id="combobox"
						type="text"
						class="w-full border-0 bg-white py-3 pl-3 pr-12 text-sm text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-tcmOrange-500 sm:text-sm sm:leading-6"
						role="combobox"
						aria-controls="options"
						aria-expanded="true"
						placeholder="Search for a location…"
						@input=${this._setLocationFilter.bind(this)}
						.value=${this._locationFilter}
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
					>
						<svg
							class="h-5 w-5 text-gray-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<ul
					class="max-h-56 w-full overflow-auto bg-white py-1 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:max-h-60"
					id="options"
					role="listbox"
				>
					<location-filter-options
						.level=${this.level}
						.subFilter=${this._locationFilter}
					></location-filter-options>
				</ul>
			</fieldset>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'location-filter': LocationFilter;
	}
}
