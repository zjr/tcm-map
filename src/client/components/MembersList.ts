import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { DetailAccount } from '../../server/salesforce/SFClient';

import './MemberElement.ts';

@customElement('members-list')
export default class MembersList extends LitElement {
	@property()
	members: DetailAccount[] = [];

	render() {
		return html`
			<div class="px-4 sm:px-6 lg:px-8">
				<ul
					class="mb-4 divide-y-2 divide-dashed divide-gray-200 border-b-2 border-dashed border-b-gray-200 [&>*]:block"
				>
					${this.members.map(
						member => html`<member-element .member=${member}></member-element>`
					)}
				</ul>
			</div>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'members-list': MembersList;
	}
}
