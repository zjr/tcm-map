import { html, LitElement } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';

import { IFilter } from '../FilterControls';
import { FiltersContext, filtersContext } from '../../contexts/filtersContext';

import './FilterControlMobile.ts';

@customElement('filter-dialog-mobile')
export default class FilterDialogMobile extends LitElement {
	@property({ type: Boolean })
	open: boolean = false;

	private _emitCloseMenu() {
		this.dispatchEvent(new Event('close-menu', { bubbles: true }));
	}
	emitCloseMenu = this._emitCloseMenu.bind(this);

	@consume({ context: filtersContext, subscribe: true })
	@property({ attribute: false })
	public filters?: FiltersContext;

	@property({ attribute: false })
	filterOptions: IFilter[] = [];

	render() {
		const containerClasses = [
			'relative z-40 sm:hidden',
			this.open ? 'pointer-events-auto' : 'pointer-events-none'
		].join(' ');

		const menuBackdropClasses = [
			'fixed inset-0 bg-black bg-opacity-25',
			'transition-opacity ease-linear duration-300',
			this.open ? 'opacity-100' : 'opacity-0'
		].join(' ');

		const menuClasses = [
			'relative ml-auto flex h-full w-full max-w-xs flex-col bg-white',
			'pt-4 shadow-xl transition ease-in-out duration-300 transform',
			this.open ? 'translate-x-0' : 'translate-x-full'
		].join(' ');

		const closeButton = html`
			<button
				@click=${this.emitCloseMenu}
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
		`;

		const filterControls = this.filterOptions.map(
			opt =>
				html`<filter-control-mobile .filter=${opt}></filter-control-mobile>`
		);

		return html`
			<div class=${containerClasses} role="dialog" aria-modal="true">
				<div class=${menuBackdropClasses}></div>
				<div class="fixed inset-0 z-40 flex" @click=${this.emitCloseMenu}>
					<div class=${menuClasses} @click=${(e: Event) => e.stopPropagation()}>
						<div class="flex items-center justify-between px-4">
							<h2 class="text-lg font-medium text-gray-900">Filters</h2>
							${closeButton}
						</div>
						<form class="mt-4 overflow-y-scroll overscroll-y-contain">
							${filterControls}
						</form>
					</div>
				</div>
			</div>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-dialog-mobile': FilterDialogMobile;
	}
}
