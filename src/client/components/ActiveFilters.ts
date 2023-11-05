import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { TwElement } from '../shared/tailwind.element';
import { IFilter, IFilterOption } from './FilterControls';

@customElement('active-filters')
export default class ActiveFilters extends TwElement {
	@property()
	filters: IFilter[] | null = null;

	private emitUnsetFilterEvent(e: Event) {
		if (e.target instanceof HTMLButtonElement) {
			this.dispatchEvent(
				new CustomEvent('clear-filter', {
					detail: { name: e.target.name, value: e.target.value }
				})
			);
		}
	}

	private renderFilterButton(opt: IFilterOption) {
		const label = opt.label || opt.value;
		const noLabel = !opt.label;

		return html`
			<span
				class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
			>
				<span class=${noLabel ? 'capitalize' : nothing}>${label}</span>
				<button
					name=${opt.filterName}
					value=${opt.value}
					@click=${this.emitUnsetFilterEvent}
					type="button"
					class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
				>
					<span class="sr-only">Remove filter for ${label}</span>
					<svg
						class="pointer-events-none h-2 w-2"
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
		`;
	}

	render() {
		const activeFilters = this.filters?.reduce(
			(acc: IFilterOption[], filter) => {
				if (!filter.options?.length) return acc;
				return [
					...acc,
					...filter.options.filter(option => {
						option.filterName = filter.value;
						return option.checked;
					})
				];
			},
			[]
		);

		return html`
			<div class="bg-gray-100">
				<div class="mx-auto px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
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
							${activeFilters?.length
								? activeFilters.map(f => this.renderFilterButton(f))
								: html`<p class="text-sm text-gray-400">None</p>`}
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'active-filters': ActiveFilters;
	}
}
