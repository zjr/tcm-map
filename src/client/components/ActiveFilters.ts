import { html, nothing } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';

import FilterEvent from '../events/FilterEvent';
import { TwElement } from './shared/tailwind.element';
import { IFilterOption } from './FilterControls';
import { typeLabels } from '../constants/types';
import { industryLabels } from '../constants/industries';
import { FiltersContext, filtersContext } from '../contexts/filtersContext';

const labels: { [k0: string]: { [k1: string]: string } } = {
	types: typeLabels,
	industries: industryLabels
};

@customElement('active-filters')
export default class ActiveFilters extends TwElement {
	@consume({ context: filtersContext, subscribe: true })
	@property({ attribute: false })
	public filters?: FiltersContext;

	private emitUnsetFilterEvent(e: Event) {
		if (!(e.target instanceof HTMLButtonElement)) return;

		this.dispatchEvent(
			new FilterEvent({ key: e.target.name, val: e.target.value, del: true })
		);
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

	getActiveFilters(): IFilterOption[] {
		if (!this.filters) return [];

		return Object.entries(this.filters).reduce(
			(acc: IFilterOption[], entry) => {
				const [name, filter]: [string, Set<string>] = entry;
				return [
					...acc,
					...Array.from(filter).reduce(
						(acc2: IFilterOption[], value: string) => [
							...acc2,
							{
								filterName: name,
								value: value,
								label: labels[name]?.[value] || value.split('#').pop()
							}
						],
						[]
					)
				];
			},
			[]
		);
	}

	render() {
		const activeFilters = this.getActiveFilters();

		return html`
			<div class="bg-gray-100">
				<div class="mx-auto flex items-center px-4 py-3 sm:px-6 lg:px-8">
					<h3 class="text-sm font-medium text-gray-500">
						<span class="sr-only">Active </span>
						Filters
					</h3>

					<div aria-hidden="true" class="ml-4 block h-5 w-px bg-gray-300"></div>

					<div class="ml-4 mt-0">
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
