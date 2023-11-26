import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('filter-head-mobile')
export default class FilterHeadMobile extends LitElement {
	@property()
	title: string = '';

	render() {
		return html`
			<strong class="-mx-2 -my-3 flow-root">
				<span
					class="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400"
				>
					<span class="font-medium text-gray-900">${this.title}</span>
					<span class="ml-6 flex items-center">
						<svg
							class="h-5 w-5 rotate-0 transform transition-transform duration-300 group-open:rotate-180"
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
				</span>
			</strong>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-head-mobile': FilterHeadMobile;
	}
}
