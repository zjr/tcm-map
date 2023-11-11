import { LitElement, CSSResultGroup, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import tailwindStyles from './tailwind.css?inline';

@customElement('tw-element')
export class TwElement extends LitElement {
	static styles = unsafeCSS(tailwindStyles) as CSSResultGroup;

	protected render() {
		return html` <div>Content</div> `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'tw-element': LitElement;
	}
}
