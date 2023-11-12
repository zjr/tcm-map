import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { DetailAccount } from '../../server/salesforce/SfClient';

@customElement('member-element')
export default class MemberElement extends LitElement {
	@property()
	member: DetailAccount | null = null;

	render() {
		if (!this.member) return nothing;

		const memberLink = this.member.Website
			? [
					' • ',
					html`<a
						href=${this.member.Website}
						class="text-tcmYellow-900 underline"
						>Visit Website</a
					>`
			  ]
			: null;

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
						<p class="text-lg font-bold leading-5 text-gray-800">
							${this.member.Name}
						</p>
						<p class="py-[3px] text-gray-500">
							${this.member.npo02__MembershipJoinDate__c
								? html`<span
										>Member since
										${new Date(
											this.member.npo02__MembershipJoinDate__c
										).getFullYear()}</span
								  >`
								: nothing}
							${memberLink}
						</p>
					</div>
				</div>
				<div class="flex flex-col items-end justify-between gap-3 pt-px">
					<p class="w-max max-w-[20ch] text-right text-gray-600">
						${this.member.BillingCity}, ${this.member.BillingState}
					</p>
					<div class="flex flex-wrap justify-end gap-2">
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
