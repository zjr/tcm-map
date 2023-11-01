import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';

import './SortControl.ts';
import './ActiveFilters.ts';
import './FilterControl.ts';
import './FilterDialogMobile.ts';

import FilterControl from './FilterControl';

@customElement('filter-controls')
export default class FiltersControls extends TwElement {
	@property()
	filterOptions = [
		{
			value: 'location',
			label: 'Location',
			count: 1
		},
		{
			value: 'industry',
			label: 'Industry'
		},
		{
			value: 'type',
			label: 'Type'
		}
	];

	@property({ type: String })
	openDropdown: string = '';

	private _handleDropdownClick(e: Event) {
		const { value } = e.target as FilterControl;
		this.openDropdown = this.openDropdown === value ? '' : value;
	}

	render() {
		// Mobile filter dialog toggle, controls the 'mobileFiltersOpen' state.
		const mobileFilterDialogToggle = html`
			<button
				type="button"
				class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
			>
				Filters
			</button>
		`;

		return html`
			<filter-dialog-mobile></filter-dialog-mobile>
			<section aria-labelledby="filter-heading">
				<h2 id="filter-heading" class="sr-only">Filters</h2>
				<div class="border-b border-gray-200 bg-white pb-4">
					<div
						class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
					>
						<sort-control open="true"></sort-control>
						${mobileFilterDialogToggle}
						<div class="hidden sm:block">
							<div class="flow-root">
								<div
									@click=${this._handleDropdownClick}
									class="-mx-4 flex items-center divide-x divide-gray-200"
								>
									${this.filterOptions.map(
										option => html`
											<filter-control
												label=${option.label}
												count=${option.count}
												value=${option.value}
												?open=${this.openDropdown === option.value}
											></filter-control>
										`
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<active-filters></active-filters>
			</section>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-controls': FiltersControls;
	}
}
