export type PinTuple = [
	Id: string,
	Name: string,
	BillingLatitude: number,
	BillingLongitude: number
];

export interface SfApiError {
	error: string;
	error_description: string;
}

export interface SfQueryApiError {
	message: string;
	errorCode: string;
}

export interface SfRecord {
	// optional because we probably don't care about them, at least usually
	attributes?: {
		// ex: "Account"
		type: string;
		// Base resource URL
		url: string;
	};
}

export type SfOrgType =
	| 'Faith_org_type__c'
	| 'Advocacy_org_type__c'
	| 'Business_org_type__c'
	| 'Education_org_type__c'
	| 'Nonprofit_org_type__c'
	| 'Government_org_type__c'
	| 'Other_org_type__c';

export interface BareAccount extends SfRecord {
	// ex: "0015G00001Uyc7lQAB"
	Id: string;
	// ex: "Project MORE Foundation"
	Name: string;
}

export interface PartialAccount extends BareAccount {
	// ex: 37.3539663
	BillingLatitude: number;
	// ex: -121.9529992
	BillingLongitude: number;
}

export interface DetailAccount extends BareAccount {
	BillingCity?: string;
	BillingState?: string;
	Website?: string;
	PhotoUrl?: string;
	npo02__MembershipJoinDate__c?: string;
	Industry_1__c?: string;
	Industry_2__c?: string;
	Industry_3__c?: string;
	Advocacy_org_type__c?: boolean;
	Business_org_type__c?: boolean;
	Faith_org_type__c?: boolean;
	Government_org_type__c?: boolean;
	Education_org_type__c?: boolean;
	Nonprofit_org_type__c?: boolean;
	Other_org_type__c?: boolean;
	County__c?: string;
	Region_2_0__c?: string;
	Logo__c?: string;
	Logo_Last_Confirmed__c?: string;
}

export interface SfApiResponse {
	dunno: string;
}

export interface SfDescribeResponse {
	fields: Array<{
		name: string;
		label: string;
		defaultValue: unknown | null;
		inlineHelpText: string;
		type: string;
		custom: boolean;
	}>;
	urls: { [k: string]: string };
	searchable: boolean;
}

export interface SfApiQueryResponse<T = unknown> extends SfApiResponse {
	totalSize: number;
	done: boolean;
	nextRecordsUrl?: string;
	records: Array<T>;
}

export interface SfApiOAuthResponse extends SfApiResponse {
	access_token: string;
	issued_at: string;
}
