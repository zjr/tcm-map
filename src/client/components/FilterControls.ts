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
			children: html`
				<fieldset class="space-y-4">
					<legend class="text-sm text-gray-500">Filter by Location</legend>
					<div class="flex space-x-6 px-1 py-0.5">
						${[
							{ level: 'cities', checked: true },
							{ level: 'counties', checked: false },
							{ level: 'regions', checked: false }
						].map(
							({ level, checked }) => html`
								<span class="flex flex-row items-center space-x-1.5">
									<input
										class="m-0 h-4 w-4 cursor-pointer border-0 text-tcmOrange-500 ring-1 ring-gray-400 checked:ring-tcmOrange-500 focus:ring-tcmOrange-500"
										type="radio"
										name="locationType"
										id=${level}
										?checked=${checked}
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
							class="w-full border-0 bg-white py-3 pl-3 pr-12 text-sm text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-black ring-opacity-10 focus:ring-2 focus:ring-inset focus:ring-tcmOrange-500 sm:text-sm sm:leading-6"
							role="combobox"
							aria-controls="options"
							aria-expanded="true"
							placeholder="Search for a location…"
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
						class="max-h-60 w-full overflow-auto bg-white py-1 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
						id="options"
						role="listbox"
					>
						${[
							{ name: 'Leslie Alexander', selected: false },
							{ name: 'Leslie Alexander', selected: false },
							{ name: 'Leslie Alexander', selected: false },
							{ name: 'Leslie Alexander', selected: false },
							{ name: 'Leslie Alexander', selected: true },
							{ name: 'Leslie Alexander', selected: false }
						].map(
							option => html`
								<!--
								Combobox option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.
								Active: "text-white bg-indigo-600", Not Active: "text-gray-900"
							-->
								<li
									class="${!option.selected
										? 'hover:text-white hover:bg-tcmOrange-500'
										: ''} relative cursor-default select-none py-3 pl-3.5 pr-9 text-gray-900"
									id="option-0"
									role="option"
									tabindex="-1"
								>
									<span
										class="${option.selected
											? 'font-semibold'
											: ''} block truncate"
										>${option.name}</span
									>
									<span
										class="${option.selected
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
							`
						)}
					</ul>
				</fieldset>
			`
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
