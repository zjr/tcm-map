import { customElement } from 'lit/decorators.js';
import { TwElement } from '../shared/tailwind.element.js';
import { html } from 'lit';

import './SortControl.ts';
import './FilterButton.ts';
import './FilterDialogMobile.ts';

@customElement('filter-controls')
export default class FiltersControls extends TwElement {
	render() {
		return html`
			<div>
				<filter-dialog-mobile></filter-dialog-mobile>

				<!-- Filters -->
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
										<div class="relative inline-block px-4 text-left">
											<filter-button label="Location" count="1"></filter-button>

											<!--
												'Category' dropdown, show/hide based on dropdown state.

												Entering: "transition ease-out duration-100"
													From: "transform opacity-0 scale-95"
													To: "transform opacity-100 scale-100"
												Leaving: "transition ease-in duration-75"
													From: "transform opacity-100 scale-100"
													To: "transform opacity-0 scale-95"
											-->
											<div
												class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
											>
												<form class="space-y-4">
													<div class="flex items-center">
														<input
															id="filter-category-0"
															name="category[]"
															value="new-arrivals"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-category-0"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>All New Arrivals</label
														>
													</div>
													<div class="flex items-center">
														<input
															id="filter-category-1"
															name="category[]"
															value="tees"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-category-1"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>Tees</label
														>
													</div>
													<div class="flex items-center">
														<input
															id="filter-category-2"
															name="category[]"
															value="objects"
															type="checkbox"
															checked
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-category-2"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>Objects</label
														>
													</div>
												</form>
											</div>
										</div>
										<div class="relative inline-block px-4 text-left">
											<filter-button label="Industry"></filter-button>

											<!--
												'Color' dropdown, show/hide based on dropdown state.

												Entering: "transition ease-out duration-100"
													From: "transform opacity-0 scale-95"
													To: "transform opacity-100 scale-100"
												Leaving: "transition ease-in duration-75"
													From: "transform opacity-100 scale-100"
													To: "transform opacity-0 scale-95"
											-->
											<div
												class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
											>
												<form class="space-y-4">
													<div class="flex items-center">
														<input
															id="filter-color-0"
															name="color[]"
															value="white"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-color-0"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>White</label
														>
													</div>
													<div class="flex items-center">
														<input
															id="filter-color-1"
															name="color[]"
															value="beige"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-color-1"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>Beige</label
														>
													</div>
													<div class="flex items-center">
														<input
															id="filter-color-2"
															name="color[]"
															value="blue"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-color-2"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>Blue</label
														>
													</div>
												</form>
											</div>
										</div>
										<div class="relative inline-block px-4 text-left">
											<filter-button label="Type"></filter-button>

											<!--
												'Sizes' dropdown, show/hide based on dropdown state.

												Entering: "transition ease-out duration-100"
													From: "transform opacity-0 scale-95"
													To: "transform opacity-100 scale-100"
												Leaving: "transition ease-in duration-75"
													From: "transform opacity-100 scale-100"
													To: "transform opacity-0 scale-95"
											-->
											<div
												class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
											>
												<form class="space-y-4">
													<div class="flex items-center">
														<input
															id="filter-sizes-0"
															name="sizes[]"
															value="s"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-sizes-0"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>S</label
														>
													</div>
													<div class="flex items-center">
														<input
															id="filter-sizes-1"
															name="sizes[]"
															value="m"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-sizes-1"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>M</label
														>
													</div>
													<div class="flex items-center">
														<input
															id="filter-sizes-2"
															name="sizes[]"
															value="l"
															type="checkbox"
															class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
														<label
															for="filter-sizes-2"
															class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
															>L</label
														>
													</div>
												</form>
											</div>
										</div>
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
