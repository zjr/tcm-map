import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import './SortControl.ts';
import './ActiveFilters.ts';
import './FilterControl.ts';
import './FilterDialogMobile.ts';

export interface IFilterOption {
	value: string;
	label?: string;
	checked?: boolean;
}

export interface IFilter {
	value: string;
	label: string;
	count?: number;
	options?: IFilterOption[];
	children?: TemplateResult;
}

@customElement('filter-controls')
export default class FilterControls extends LitElement {
	@property()
	filters: IFilter[] = [
		{
			value: 'location[]',
			label: 'Location',
			count: 1,
			children: html``
		},
		{
			value: 'industry[]',
			label: 'Industry',
			options: [
				{ value: 'arts' },
				{
					value: 'education',
					checked: true
				},
				{ value: 'environment' },
				{ value: 'health' },
				{ value: 'human rights' },
				{ value: 'human services' },
				{ value: 'info/communications' },
				{ value: 'public affairs' },
				{ value: 'public safety' },
				{ value: 'sports' }
			]
		},
		{
			value: 'type',
			label: 'Type',
			options: []
		}
	];

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
					<div class="mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
						<sort-control open="true"></sort-control>
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
				<active-filters></active-filters>
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
