import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { DetailAccount } from '../../server/salesforce/types';

function sanitizeUrl(input?: string): string | undefined {
	if (!input) return;

	try {
		const url = new URL(input);
		return url.toString();
	} catch {
		return /^https?:\/\//.test(input)
			? undefined
			: sanitizeUrl('https://' + input);
	}
}

@customElement('member-element')
export default class MemberElement extends LitElement {
	@property()
	member: DetailAccount | null = null;

	render() {
		if (!this.member) return nothing;

		const memberLoc = [
			this.member.BillingCity,
			this.member.BillingState
		].filter(Boolean);

		const url = sanitizeUrl(this.member.Website);
		let urlEl = null;

		if (url) {
			urlEl = [
				' • ',
				html`<a
					target="_blank"
					rel="noreferrer nofollow"
					href=${url}
					class="text-tcmYellow-900 underline"
					>Visit Website</a
				>`
			];
		}

		const memberIndustryPills = [
			this.member.Industry_1__c,
			this.member.Industry_2__c,
			this.member.Industry_3__c
		].map(industry =>
			industry ? html` <type-pill industry=${industry}></type-pill> ` : null
		);

		return html`
			<div class="flex justify-between gap-4 py-5">
				<div class="flex">
					<!--<img src="" alt="" class="h-14 w-14 rounded-full" />-->
					<div class="flex flex-col justify-between gap-2.5">
						<p
							class="-mt-px mb-px text-base font-bold leading-6 text-gray-800 md:mb-0 md:mt-0.5 md:text-lg md:leading-5"
						>
							${this.member.Name}
						</p>
						<p class="py-[3px] text-sm text-gray-500 md:text-base">
							${this.member.npo02__MembershipJoinDate__c
								? html`<span
										>Member since
										${new Date(
											this.member.npo02__MembershipJoinDate__c
										).getFullYear()}</span
								  >`
								: nothing}
							${urlEl}
						</p>
					</div>
				</div>
				<div
					class="flex flex-col items-end justify-between gap-2 pt-0.5 md:gap-3 md:pt-px"
				>
					<p
						class="w-max max-w-[20ch] text-right text-sm text-gray-600 md:my-0 md:text-base"
					>
						${memberLoc.length ? memberLoc.join(', ') : nothing}
					</p>
					<div class="mb-0.5 flex flex-wrap justify-end gap-2">
						${memberIndustryPills}
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
		'member-element': MemberElement;
	}
}
