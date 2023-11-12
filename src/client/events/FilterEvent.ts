export interface FilterEventDetail {
	key: string;
	val: string;
	del?: boolean;
}

export default class FilterEvent extends CustomEvent<FilterEventDetail> {
	constructor(detail: FilterEventDetail) {
		super('filter-event', { detail, bubbles: true, composed: true });
	}
}
