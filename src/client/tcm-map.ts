import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { TwElement } from './shared/tailwind.element';

import './components/SearchControl.ts';
import './components/FiltersControls.ts';
import './components/TypePill.ts';

const secondsInAYear = 3.154e7;

const results = [
	{
		name: 'YMCA of the East Bay',
		startDate: 1698938838 - secondsInAYear * 2,
		type: 'health',
		typeLabel: 'Health',
		url: 'https://google.com',
		billingCity: 'Berkeley',
		billingState: 'CA'
	},
	{
		name: 'Urban Strategies Council',
		startDate: 1698938838 - secondsInAYear * 5,
		type: 'infoComm',
		typeLabel: 'Info/Communications',
		url: 'https://google.com',
		billingCity: 'Oakland',
		billingState: 'CA'
	},
	{
		name: 'Game Theory Academy',
		startDate: 1698938838 - secondsInAYear,
		type: 'education',
		typeLabel: 'Education',
		billingCity: 'Oakland',
		billingState: 'CA'
	},
	{
		name: 'San Francisco Unified School District',
		startDate: 1698938838 - secondsInAYear * 7,
		type: 'education',
		typeLabel: 'Education',
		url: 'https://google.com',
		billingCity: 'San Francisco',
		billingState: 'CA'
	},
	{
		name: 'Yolo CASA',
		startDate: 1698938838,
		type: 'health',
		typeLabel: 'Health',
		url: 'https://google.com',
		billingCity: 'Berkeley',
		billingState: 'CA'
	}
];

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('tcm-map')
export class TcmMap extends TwElement {
	render() {
		return html`
			<div class="space-x-4 bg-white font-sans">
				<search-control></search-control>
				<filter-controls></filter-controls>
				<div class="mx-4 divide-y divide-gray-100 border-b border-b-gray-100">
					${results.map(member => {
						const memberLink = member.url
							? [
									' • ',
									html`<a
										href=${member.url}
										class="text-tcmYellow-900 underline"
										>Visit Website</a
									>`
							  ]
							: null;

						return html`
							<div class="flex justify-between space-x-4 py-5">
								<div class="flex space-x-4">
									<img
										src="https://placehold.co/200"
										alt="placeholder"
										class="h-14 w-14 rounded-full"
									/>
									<div class="space-y-1.5">
										<p class="text-lg font-bold text-gray-800">
											${member.name}
										</p>
										<p class="text-gray-500">
											<span
												>Member since
												${new Date(member.startDate * 1000).getFullYear()}</span
											>${memberLink}
										</p>
									</div>
								</div>
								<div class="space-y-2 pt-[5px] text-right">
									<p class="text-gray-600">
										${member.billingCity}, ${member.billingState}
									</p>
									<type-pill .member=${member}></type-pill>
								</div>
							</div>
						`;
					})}
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'tcm-map': TcmMap;
	}
}
