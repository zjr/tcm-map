import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './FilterHeadMobile.ts';
import './FilterBodyMobile.ts';
import { IFilter } from '../FilterControls';

@customElement('filter-control-mobile')
export default class FilterControlMobile extends LitElement {
	@property()
	filter: IFilter = { value: '', label: '' };

	render() {
		return html`
			<details class="group border-t border-gray-200 px-4 py-6" open>
				<summary class="sticky top-0 z-10 block cursor-pointer bg-white">
					<filter-head-mobile title=${this.filter.label}></filter-head-mobile>
				</summary>
				<filter-body-mobile .filter=${this.filter}></filter-body-mobile>
			</details>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'filter-control-mobile': FilterControlMobile;
	}
}
