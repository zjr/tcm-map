import { customElement, property } from 'lit/decorators.js';
import { TwElement } from '../shared/tailwind.element.js';
import { html } from 'lit';

import './SortControl.ts';
import './FilterControl.ts';
import './FilterDialogMobile.ts';

@customElement('filter-controls')
export default class FiltersControls extends TwElement {
	@property()
	filterOptions = [
		{
			label: 'Location',
			count: 1
		},
		{
			label: 'Industry'
		},
		{
			label: 'Type'
		}
	];

	render() {
		return html`
			<div>
				<filter-dialog-mobile></filter-dialog-mobile>

				<section aria-labelledby="filter-heading">
					<h2 id="filter-heading" class="sr-only">Filters</h2>
					<div class="border-b border-gray-200 bg-white pb-4">
						<div
							class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
						>
							<sort-control></sort-control>

							<!-- Mobile filter dialog toggle, controls the 'mobileFiltersOpen' state. -->
							<button
								type="button"
								class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
							>
								Filters
							</button>

							<div class="hidden sm:block">
								<div class="flow-root">
									<div class="-mx-4 flex items-center divide-x divide-gray-200">
										${this.filterOptions.map(
											option => html`
												<filter-control
													label=${option.label}
													count=${option.count}
												></filter-control>
											`
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Active filters row -->
					<div class="bg-gray-100">
						<div
							class="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8"
						>
							<h3 class="text-sm font-medium text-gray-500">
								Filters
								<span class="sr-only">, active</span>
							</h3>

							<div
								aria-hidden="true"
								class="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
							></div>

							<div class="mt-2 sm:ml-4 sm:mt-0">
								<div class="-m-1 flex flex-wrap items-center">
									<span
										class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
									>
										<span>Objects</span>
										<button
											type="button"
											class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
										>
											<span class="sr-only">Remove filter for Objects</span>
											<svg
												class="h-2 w-2"
												stroke="currentColor"
												fill="none"
												viewBox="0 0 8 8"
											>
												<path
													stroke-linecap="round"
													stroke-width="1.5"
													d="M1 1l6 6m0-6L1 7"
												/>
											</svg>
										</button>
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-controls': FiltersControls;
	}
}
