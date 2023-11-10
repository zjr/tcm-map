// noinspection SqlNoDataSourceInspection

interface SFApiError {
	error: string;
	error_description: string;
}

interface SFRecord {
	// optional because we probably don't care about them, at least usually
	attributes?: {
		// ex: "Account"
		type: string;
		// Base resource URL
		url: string;
	};
}

interface BareAccount extends SFRecord {
	// ex: "0015G00001Uyc7lQAB"
	Id: string;
	// ex: "Project MORE Foundation"
	Name: string;
}

interface PartialAccount extends BareAccount {
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

interface SFApiResponse {
	dunno: string;
}

interface SFDescribeResponse {
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

interface SFApiQueryResponse<T = unknown> extends SFApiResponse {
	totalSize: number;
	done: boolean;
	nextRecordsUrl?: string;
	records: Array<T>;
}

interface SFApiOAuthResponse extends SFApiResponse {
	access_token: string;
	issued_at: string;
}

export class SFClient {
	host: string;
	token: string;

	restEndpoint: string;

	authorized: Promise<void>;

	constructor() {
		this.host = process.env.SF_HOST || 'https://childrennow.my.salesforce.com';
		this.token = '';

		this.restEndpoint = '/services/data/v59.0';

		this.authorized = this.authorize();
	}

	getUrl(pathname: string) {
		return new URL(pathname, this.host);
	}

	getRestUrl(pathname: string = '') {
		return new URL(this.restEndpoint + pathname, this.host);
	}

	getAuthorizationHeader(oauth: boolean = false) {
		return oauth
			? {
					Authorization: `Basic ${Buffer.from(
						[process.env.SF_CLIENT, process.env.SF_SECRET].join(':'),
						'utf-8'
					).toString('base64')}`
			  }
			: {
					Authorization: `Bearer ${this.token}`
			  };
	}

	get standardRestOptions() {
		return {
			headers: {
				Authorization: `Bearer ${this.token}`,
				Accept: 'application/json'
			}
		};
	}

	async authorize(force: boolean = false) {
		if (this.token && !force) return;

		const res = await fetch(
			`${this.host}/services/oauth2/token?grant_type=client_credentials`,
			{ method: 'POST', headers: this.getAuthorizationHeader(true) }
		);

		const json: SFApiError | SFApiOAuthResponse = await res.json();

		if ('error' in json) {
			throw new Error(
				json?.error_description || json?.error || 'unknown error'
			);
		}

		this.token = json.access_token;
	}

	async resHandler<T extends object>(res: Response) {
		const json: SFApiError | T = await res.json();

		if ('error' in json) {
			throw new Error(
				json?.error_description || json?.error || 'unknown error'
			);
		}

		return json;
	}

	async describeAccount() {
		const res = await fetch(
			this.getRestUrl('/sobjects/Account/describe'),
			this.standardRestOptions
		);

		return await this.resHandler<SFDescribeResponse>(res);
	}

	async paginateQuery<T>(data: SFApiQueryResponse<T>): Promise<Array<T>> {
		if (data.done || !data.nextRecordsUrl) return data.records;

		const res = await fetch(
			this.getUrl(data.nextRecordsUrl),
			this.standardRestOptions
		);

		const newData = await this.resHandler<SFApiQueryResponse<T>>(res);
		newData.records = data.records.concat(newData.records);

		return this.paginateQuery(newData);
	}

	async getTcmMembersFull() {
		const url = this.getRestUrl('/query');
		url.searchParams.set(
			'q',
			`
				SELECT
					Id, Name, BillingLatitude, BillingLongitude
				FROM
					Account
				WHERE
					TCM_Member__c = true and
					BillingLatitude <> null and
					BillingLongitude <> null and
					IsDeleted <> true
			`
		);

		const res = await fetch(url, this.standardRestOptions);
		const data = await this.resHandler<SFApiQueryResponse<PartialAccount>>(res);
		const allRecords = await this.paginateQuery<PartialAccount>(data);

		return allRecords.map(x => [
			x.Id,
			x.Name,
			x.BillingLatitude,
			x.BillingLongitude
		]);
	}

	async getTcmMemberDetails(ids: string[]) {
		const query = `
			SELECT
				Id,
				Name,
				BillingCity,
				BillingState,
				BillingLatitude,
				BillingLongitude,
				Website,
				npo02__MembershipJoinDate__c,
				Industry_1__c,
				Industry_2__c,
				Industry_3__c,
				Advocacy_org_type__c,
				Business_org_type__c,
				Faith_org_type__c,
				Government_org_type__c,
				Education_org_type__c,
				Nonprofit_org_type__c,
				Other_org_type__c,
				County__c,
				Region_2_0__c,
				Logo__c,
				Logo_Last_Confirmed__c
			FROM
				Account
			WHERE
				Id in ('${ids.join("', '")}')
			LIMIT 50
		`;

		const url = this.getRestUrl('/query');
		url.searchParams.set('q', query);

		const res = await fetch(url, this.standardRestOptions);
		const data = await this.resHandler<SFApiQueryResponse<DetailAccount>>(res);
		return await this.paginateQuery<DetailAccount>(data);
	}

	async getDistinctIndustries() {
		const url = this.getRestUrl('/query');
		url.searchParams.set(
			'q',
			`
				SELECT
					Industry_3__c, COUNT(Name)
				FROM
					Account
				WHERE
					TCM_Member__c = true and
					IsDeleted <> true
				GROUP BY
					Industry_3__c
			`
		);

		interface Distincties {
			attributes: {
				type: string;
			};
			Industry_3__c: string;
			expr0: number;
		}

		const res = await fetch(url, this.standardRestOptions);
		const data = await this.resHandler<SFApiQueryResponse<Distincties>>(res);
		const allData = await this.paginateQuery<Distincties>(data);

		return allData.map(x => x.Industry_3__c);
	}
}

const sfClient = new SFClient();
export default sfClient;

// (async () => {
// 	await sfClient.authorized;
// 	return await sfClient.getDistinctIndustries();
// })()
// 	.then(console.log)
// 	.catch(console.error);
