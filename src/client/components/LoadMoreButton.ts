import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

const baseURL = import.meta.env.VITE_BASE_URL;

@customElement('load-more-button')
export default class LoadMoreButton extends LitElement {
	@property({ attribute: false })
	nextBody: string | undefined;

	@state()
	loading: boolean = false;

	loadMore = this._loadMore.bind(this);
	private async _loadMore() {
		if (!this.nextBody) return;

		this.loading = true;

		const res = await fetch(new URL(`/accounts/filtered`, baseURL), {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: this.nextBody
		});
		const data = await res.json();

		this.dispatchEvent(
			new CustomEvent('members-paged', { detail: data, bubbles: true })
		);

		this.loading = false;
	}

	render() {
		return html`
			<button
				@click=${this.loadMore}
				?disabled=${!this.nextBody}
				class="mx-auto my-4 inline-flex items-center gap-x-1.5 rounded-md bg-tcmOrange-500 px-3 py-2 text-sm font-semibold tracking-wide text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tcmOrange-500 disabled:cursor-auto disabled:bg-gray-300"
			>
				${this.loading ? 'Loading…' : 'Load more'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="${this.loading ? 'animate-spin' : ''} -mr-0.5 h-5 w-5"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		`;
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'load-more-button': LoadMoreButton;
	}
}
