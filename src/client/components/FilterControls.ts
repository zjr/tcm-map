import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { typeLabels, types } from '../constants/types';
import { industries, industryLabels } from '../constants/industries';

import './SortControl.ts';
import './ActiveFilters.ts';
import './FilterControl.ts';
import './LocationFilter.ts';
import './mobile/FilterDialogMobile.ts';

export interface IFilterOption {
	value: string;
	label?: string;
	checked?: boolean;
	filterName?: string; // the filter option's parent name
}

export interface IFilter {
	value: string;
	label: string;
	options?: IFilterOption[];
	children?: TemplateResult;
}

@customElement('filter-controls')
export default class FilterControls extends LitElement {
	@property({ type: String })
	sort: string = 'Name#ASC';

	@property()
	filters: IFilter[] = [
		{
			value: 'locations',
			label: 'Location',
			children: html`<location-filter></location-filter>`
		},
		{
			value: 'industries',
			label: 'Industry',
			options: industries.map(i => ({
				value: i,
				label: industryLabels[i]
			}))
		},
		{
			value: 'types',
			label: 'Type',
			options: types.map(i => ({
				value: i,
				label: typeLabels[i]
			}))
		}
	];

	private _handleClearFilter(e: CustomEvent) {
		const newFilters = [...this.filters];

		const filter = newFilters.find(f => f.value === e.detail.name);
		const option = filter?.options?.find(opt => opt.value === e.detail.value);

		if (!option) return;

		option.checked = false;
		this.filters = newFilters;
	}

	handleClearFilter = this._handleClearFilter.bind(this);

	@state()
	private _openDropdown: string = '';

	private _handleDropdownClick(e: CustomEvent) {
		const value = e.detail.value;
		this._openDropdown = this._openDropdown === value ? '' : value;
	}

	private _closeDropdown(e: Event) {
		if (
			e.target instanceof HTMLElement &&
			!e.target.closest('filter-control')
		) {
			this._openDropdown = '';
		}
	}

	closeDropdown = this._closeDropdown.bind(this);

	connectedCallback() {
		super.connectedCallback();
		this.parentElement?.addEventListener('click', this.closeDropdown);
	}

	disconnectedCallback() {
		this.parentElement?.removeEventListener('click', this.closeDropdown);
		super.disconnectedCallback();
	}

	@state() openMobileMenu: boolean = false;
	private _toggleMobileMenu() {
		this.openMobileMenu = !this.openMobileMenu;
	}
	toggleMobileMenu = this._toggleMobileMenu.bind(this);

	render() {
		// Mobile filter dialog toggle, controls the 'mobileFiltersOpen' state.
		const mobileFilterDialogToggle = html`
			<button
				@click=${this.toggleMobileMenu}
				type="button"
				class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
			>
				Filters
			</button>
		`;

		return html`
			<filter-dialog-mobile
				?open=${this.openMobileMenu}
				.filterOptions=${this.filters}
				@close-menu=${this.toggleMobileMenu}
			></filter-dialog-mobile>
			<section aria-labelledby="filter-heading">
				<h2 id="filter-heading" class="sr-only">Filters</h2>
				<div class="border-b border-gray-200 bg-white pb-4">
					<div class="mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
						<sort-control sort=${this.sort}></sort-control>
						${mobileFilterDialogToggle}
						<div class="hidden sm:block">
							<div class="flow-root">
								<div class="-mx-4 flex items-center divide-x divide-gray-200">
									${this.filters.map(
										filter => html`
											<filter-control
												@open-dropdown=${this._handleDropdownClick}
												?open=${this._openDropdown === filter.value}
												.filter=${filter}
											>
											</filter-control>
										`
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<active-filters
					@clear-filter=${this.handleClearFilter}
				></active-filters>
			</section>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-controls': FilterControls;
	}
}
