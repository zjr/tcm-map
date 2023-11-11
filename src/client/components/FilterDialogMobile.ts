import { customElement } from 'lit/decorators.js';
import { TwElement } from './shared/tailwind.element';
import { html } from 'lit';

@customElement('filter-dialog-mobile')
export default class FilterDialogMobile extends TwElement {
	render() {
		return html`
			<!--
				Mobile filter dialog

				Off-canvas filters for mobile, show/hide based on off-canvas filters state.
			-->
			<div class="relative z-40 sm:hidden" role="dialog" aria-modal="true">
				<!--
					Off-canvas menu backdrop, show/hide based on off-canvas menu state.

					Entering: "transition-opacity ease-linear duration-300"
						From: "opacity-0"
						To: "opacity-100"
					Leaving: "transition-opacity ease-linear duration-300"
						From: "opacity-100"
						To: "opacity-0"
				-->
				<div class="fixed inset-0 bg-black bg-opacity-25"></div>

				<div class="fixed inset-0 z-40 flex">
					<!--
						Off-canvas menu, show/hide based on off-canvas menu state.

						Entering: "transition ease-in-out duration-300 transform"
							From: "translate-x-full"
							To: "translate-x-0"
						Leaving: "transition ease-in-out duration-300 transform"
							From: "translate-x-0"
							To: "translate-x-full"
					-->
					<div
						class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl"
					>
						<div class="flex items-center justify-between px-4">
							<h2 class="text-lg font-medium text-gray-900">Filters</h2>
							<button
								type="button"
								class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
							>
								<span class="sr-only">Close menu</span>
								<svg
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<!-- Filters -->
						<form class="mt-4">
							<div class="border-t border-gray-200 px-4 py-6">
								<h3 class="-mx-2 -my-3 flow-root">
									<!-- Expand/collapse section button -->
									<button
										type="button"
										class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400"
										aria-controls="filter-section-0"
										aria-expanded="false"
									>
										<span class="font-medium text-gray-900">Category</span>
										<span class="ml-6 flex items-center">
											<!--
                    Expand/collapse icon, toggle classes based on section open state.

                    Open: "-rotate-180", Closed: "rotate-0"
                  -->
											<svg
												class="h-5 w-5 rotate-0 transform"
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
										</span>
									</button>
								</h3>
								<!-- Filter section, show/hide based on section state. -->
								<div class="pt-6" id="filter-section-0">
									<div class="space-y-6">
										<div class="flex items-center">
											<input
												id="filter-mobile-category-0"
												name="category[]"
												value="new-arrivals"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-category-0"
												class="ml-3 text-sm text-gray-500"
												>All New Arrivals</label
											>
										</div>
										<div class="flex items-center">
											<input
												id="filter-mobile-category-1"
												name="category[]"
												value="tees"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-category-1"
												class="ml-3 text-sm text-gray-500"
												>Tees</label
											>
										</div>
										<div class="flex items-center">
											<input
												id="filter-mobile-category-2"
												name="category[]"
												value="objects"
												type="checkbox"
												checked
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-category-2"
												class="ml-3 text-sm text-gray-500"
												>Objects</label
											>
										</div>
									</div>
								</div>
							</div>
							<div class="border-t border-gray-200 px-4 py-6">
								<h3 class="-mx-2 -my-3 flow-root">
									<!-- Expand/collapse section button -->
									<button
										type="button"
										class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400"
										aria-controls="filter-section-1"
										aria-expanded="false"
									>
										<span class="font-medium text-gray-900">Color</span>
										<span class="ml-6 flex items-center">
											<!--
                    Expand/collapse icon, toggle classes based on section open state.

                    Open: "-rotate-180", Closed: "rotate-0"
                  -->
											<svg
												class="h-5 w-5 rotate-0 transform"
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
										</span>
									</button>
								</h3>
								<!-- Filter section, show/hide based on section state. -->
								<div class="pt-6" id="filter-section-1">
									<div class="space-y-6">
										<div class="flex items-center">
											<input
												id="filter-mobile-color-0"
												name="color[]"
												value="white"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-color-0"
												class="ml-3 text-sm text-gray-500"
												>White</label
											>
										</div>
										<div class="flex items-center">
											<input
												id="filter-mobile-color-1"
												name="color[]"
												value="beige"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-color-1"
												class="ml-3 text-sm text-gray-500"
												>Beige</label
											>
										</div>
										<div class="flex items-center">
											<input
												id="filter-mobile-color-2"
												name="color[]"
												value="blue"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-color-2"
												class="ml-3 text-sm text-gray-500"
												>Blue</label
											>
										</div>
									</div>
								</div>
							</div>
							<div class="border-t border-gray-200 px-4 py-6">
								<h3 class="-mx-2 -my-3 flow-root">
									<!-- Expand/collapse section button -->
									<button
										type="button"
										class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400"
										aria-controls="filter-section-2"
										aria-expanded="false"
									>
										<span class="font-medium text-gray-900">Sizes</span>
										<span class="ml-6 flex items-center">
											<!--
                    Expand/collapse icon, toggle classes based on section open state.

                    Open: "-rotate-180", Closed: "rotate-0"
                  -->
											<svg
												class="h-5 w-5 rotate-0 transform"
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
										</span>
									</button>
								</h3>
								<!-- Filter section, show/hide based on section state. -->
								<div class="pt-6" id="filter-section-2">
									<div class="space-y-6">
										<div class="flex items-center">
											<input
												id="filter-mobile-sizes-0"
												name="sizes[]"
												value="s"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-sizes-0"
												class="ml-3 text-sm text-gray-500"
												>S</label
											>
										</div>
										<div class="flex items-center">
											<input
												id="filter-mobile-sizes-1"
												name="sizes[]"
												value="m"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-sizes-1"
												class="ml-3 text-sm text-gray-500"
												>M</label
											>
										</div>
										<div class="flex items-center">
											<input
												id="filter-mobile-sizes-2"
												name="sizes[]"
												value="l"
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												for="filter-mobile-sizes-2"
												class="ml-3 text-sm text-gray-500"
												>L</label
											>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-dialog-mobile': FilterDialogMobile;
	}
}
