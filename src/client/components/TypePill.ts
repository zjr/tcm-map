import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('type-pill')
export default class TypePill extends LitElement {
	@property({ type: Object })
	member: { type: string; typeLabel: string } | null = null;

	render() {
		if (this.member === null) return nothing;

		let colorClasses;

		switch (this.member.type) {
			case 'education':
				colorClasses = 'text-tcmOrange-500 bg-tcmOrange-500 ring-tcmOrange-500';
				break;
			case 'infoComm':
				colorClasses = 'text-tcmTeal-800 bg-teal-500 ring-tcmTeal-500';
				break;
			case 'health':
			default:
				colorClasses = 'bg-sky-600 text-sky-600 ring-sky-600';
		}

		return html`
			<span
				class="${colorClasses} inline-block rounded-full bg-opacity-10 px-2 py-1 text-xs font-medium ring-1 ring-opacity-30"
				>${this.member.typeLabel}</span
			>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		this.setAttribute('style', 'display: inline-block');
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'type-pill': TypePill;
	}
}
