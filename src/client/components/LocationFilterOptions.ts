import { html, LitElement } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';

import FilterEvent from '../events/FilterEvent';
import { regions } from '../constants/regions';
import { counties } from '../constants/counties';
import { FiltersContext, filtersContext } from '../contexts/filtersContext';

const locations = {
	regions,
	counties
};

@customElement('location-filter-options')
export default class LocationFilterOptions extends LitElement {
	@property()
	level: 'regions' | 'counties' = 'regions';

	@property()
	subFilter?: string;

	@consume({ context: filtersContext, subscribe: true })
	@property({ attribute: false })
	public filters?: FiltersContext;

	private renderOption(option: string) {
		const hash = `${this.level}#${option}`;
		const selected = this.filters?.locations.has(hash);

		return html`
			<li
				class="${!selected
					? 'hover:text-white hover:bg-tcmOrange-500'
					: 'text-gray-900'} relative cursor-pointer select-none py-3 pl-3.5 pr-9 text-sm
					text-gray-500 md:text-base md:text-gray-900"
				id="option-0"
				role="option"
				tabindex="-1"
				@click=${() =>
					this.dispatchEvent(
						new FilterEvent({ key: 'locations', val: hash, del: selected })
					)}
			>
				<span class="${selected ? 'font-semibold' : ''} block truncate"
					>${option}</span
				>
				<span
					class="${selected
						? 'text-tcmOrange-500'
						: 'text-transparent'} absolute inset-y-0 right-0 flex items-center pr-4"
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</li>
		`;
	}

	render() {
		let levelLocations = locations[this.level];

		if (this.subFilter) {
			const regexp = new RegExp(this.subFilter, 'i');
			levelLocations = levelLocations.filter(x => regexp.test(x));
		}

		return html`${levelLocations.map(this.renderOption.bind(this))} `;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'location-filter-options': LocationFilterOptions;
	}
}
