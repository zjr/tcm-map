import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { industries, industryLabels } from '../constants/industries';

@customElement('type-pill')
export default class TypePill extends LitElement {
	@property({ type: String })
	industry: string | null = null;

	@property()
	industryLabels = industryLabels;

	@property()
	industries = industries;

	render() {
		if (!this.industry) return nothing;

		const colorClasses = [
			'text-tcmOrange-500 bg-tcmOrange-500 ring-tcmOrange-500',
			'bg-pink-600 text-pink-600 ring-pink-700',
			'bg-fuchsia-600 text-fuchsia-600 ring-fuchsia-700',
			'text-tcmTeal-800 bg-teal-500 ring-tcmTeal-800',
			'bg-violet-600 text-violet-600 ring-violet-700',
			'bg-sky-600 text-sky-600 ring-sky-700',
			'bg-emerald-600 text-emerald-600 ring-emerald-700',
			'bg-cyan-600 text-cyan-600 ring-cyan-700',
			'bg-rose-600 text-rose-600 ring-rose-700',
			'bg-indigo-600 text-indigo-600 ring-indigo-700'
		];

		const industryIdx = this.industries.indexOf(this.industry);
		const industryLabel = this.industryLabels[this.industry] || this.industry;
		const colorClass = colorClasses[industryIdx % colorClasses.length];

		return html`
			<span
				class="${colorClass} inline-block w-max rounded-full bg-opacity-10 px-1.5 py-0.5 text-xs font-medium ring-1 ring-opacity-30 md:px-2 md:py-1"
				>${industryLabel}</span
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
