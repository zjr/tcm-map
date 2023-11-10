import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('sort-control')
export default class SortControl extends LitElement {
	@property({ type: String })
	sort: string = 'Name_ASC';

	@property()
	sortOptions: { value: string; label: string }[] = [
		{ value: 'Name#ASC', label: 'A - Z' },
		{ value: 'Name#DESC', label: 'Z - A' },
		{ value: 'npo02__MembershipJoinDate__c#ASC', label: 'Oldest' },
		{ value: 'npo02__MembershipJoinDate__c#DESC', label: 'Newest' }
	];

	@state()
	protected _open: boolean | null = null;

	private _close(e: Event) {
		if (
			this._open !== null &&
			e.target instanceof HTMLElement &&
			!e.target.closest('sort-control')
		) {
			this._open = false;
		}
	}

	close = this._close.bind(this);

	protected root: Element | null = null;

	connectedCallback() {
		super.connectedCallback();
		this.root = this.closest('#root');
		this.root?.addEventListener('click', this.close);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.root?.removeEventListener('click', this.close);
	}

	render() {
		const optionEls = this.sortOptions.map((opt, idx) => {
			const optionClasses = [
				'text-sm hover:bg-gray-100',
				opt.value === this.sort ? 'font-medium text-gray-900' : 'text-gray-500'
			].join(' ');

			return html`
				<li
					class=${optionClasses}
					role="menuitem"
					tabindex="-1"
					id="menu-item-${idx}"
				>
					<button
						class="block w-full px-4 py-2 text-left"
						@click=${() => {
							this._open = false;
							return this.dispatchEvent(
								new CustomEvent('set-sort', {
									detail: opt.value,
									bubbles: true
								})
							);
						}}
					>
						${opt.label}
					</button>
				</li>
			`;
		});

		// I am not sure Tailwind was a great fit!
		const dropdownClasses = [
			'absolute left-0 z-10 mt-2 w-40 origin-top-left',
			'bg-white shadow-2xl ring-1 ring-black ring-opacity-5',
			'focus:outline-none opacity-0 scale-0',
			this._open === null ? '' : this._open ? 'animate-pop' : 'animate-hide'
		].join(' ');

		return html`
			<div class="relative inline-block text-left">
				<div>
					<button
						type="button"
						class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
						id="menu-button"
						aria-expanded="false"
						aria-haspopup="true"
						@click=${() => (this._open = !this._open)}
					>
						Sort
						<svg
							class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
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
					</button>
				</div>
				<div
					class=${dropdownClasses}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="menu-button"
					tabindex="-1"
				>
					<ul class="py-1" role="none">
						${optionEls}
					</ul>
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
		'sort-control': SortControl;
	}
}
