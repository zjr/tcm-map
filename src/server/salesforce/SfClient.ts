// noinspection SqlNoDataSourceInspection

interface SfApiError {
	error: string;
	error_description: string;
}

interface SfQueryApiError {
	message: string;
	errorCode: string;
}

interface SfRecord {
	// optional because we probably don't care about them, at least usually
	attributes?: {
		// ex: "Account"
		type: string;
		// Base resource URL
		url: string;
	};
}

interface BareAccount extends SfRecord {
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

interface SfApiResponse {
	dunno: string;
}

interface SfDescribeResponse {
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

interface SfApiQueryResponse<T = unknown> extends SfApiResponse {
	totalSize: number;
	done: boolean;
	nextRecordsUrl?: string;
	records: Array<T>;
}

interface SfApiOAuthResponse extends SfApiResponse {
	access_token: string;
	issued_at: string;
}

export class SfClientError extends Error {
	constructor(name: string, message: string) {
		super(message);
		this.name = name || 'SfApiError';
	}
}

export class SfClient {
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

		const json: SfApiError | SfApiOAuthResponse = await res.json();

		if ('error' in json) {
			throw new Error(
				json?.error_description || json?.error || 'unknown error'
			);
		}

		this.token = json.access_token;
	}

	async paginateQuery<T>(data: SfApiQueryResponse<T>): Promise<Array<T>> {
		if (data.done || !data.nextRecordsUrl) return data.records;

		const newData = await this.fetcher<SfApiQueryResponse<T>>(
			this.getUrl(data.nextRecordsUrl)
		);

		newData.records = data.records.concat(newData.records);

		return this.paginateQuery(newData);
	}

	async resHandler<T extends object>(res: Response) {
		let json: T | SfApiError | SfQueryApiError[];

		try {
			json = await res.json();
		} catch (e) {
			console.error(res.status, res.statusText);
			throw e;
		}

		if ('error' in json) {
			throw new SfClientError(json.error, json.error_description || json.error);
		}

		if (Array.isArray(json)) {
			throw new SfClientError(
				json[0].errorCode || 'SfQueryApiError',
				json[0].message || json[0].errorCode || json.toString()
			);
		}

		return json;
	}

	async handleAuthRetry<T>(
		e: Error | unknown,
		retries: number,
		cb: () => Promise<T>
	) {
		if (retries < 1 && (e as Error)?.name !== 'INVALID_SESSION_ID') {
			throw e;
		}
		await this.authorize(true);
		return cb();
	}

	async fetcher<T extends object>(
		url: RequestInfo | URL,
		opts: RequestInit = this.standardRestOptions,
		retries: number = 1
	): Promise<T> {
		try {
			const res = await fetch(url, opts);
			return await this.resHandler<T>(res);
		} catch (e) {
			return await this.handleAuthRetry(e, retries, () =>
				this.fetcher<T>(url, opts, --retries)
			);
		}
	}

	async queryFetcher<T extends object>(
		url: RequestInfo | URL,
		opts: RequestInit = this.standardRestOptions,
		retries: number = 1
	): Promise<Array<T>> {
		try {
			const res = await fetch(url, opts);
			const data = await this.resHandler<SfApiQueryResponse<T>>(res);
			return await this.paginateQuery(data);
		} catch (e) {
			return await this.handleAuthRetry(e, retries, () =>
				this.queryFetcher<T>(url, opts, --retries)
			);
		}
	}

	async describeAccount() {
		return await this.fetcher<SfDescribeResponse>(
			this.getRestUrl('/sobjects/Account/describe')
		);
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

		const data = await this.queryFetcher<PartialAccount>(url);

		return data.map(x => [x.Id, x.Name, x.BillingLatitude, x.BillingLongitude]);
	}

	async getTcmMemberDetails({
		ids,
		sort,
		filters
	}: {
		ids: string[];
		sort?: string;
		filters: { [k in 'locations' | 'industries' | 'types']: string[] };
	}) {
		let query = `
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
		`;

		if (filters.industries.length) {
			const industryList = filters.industries.join("', '");
			query += `
				AND (
					Industry_1__c IN ('${industryList}') OR
					Industry_2__c IN ('${industryList}') OR
					Industry_3__c IN ('${industryList}')
				)
			`;
		}

		if (filters.types.length) {
			for (const type of filters.types) {
				query += `
					AND ${type} = true
				`;
			}
		}

		if (filters.locations.length) {
			const locFilters: { [k: string]: string[] } = {
				regions: [],
				counties: []
			};

			for (const hash of filters.locations) {
				const [field, location] = hash.split('#');
				locFilters[field]?.push(location);
			}

			if (locFilters.regions.length) {
				query += `AND Region_2_0__c in ('${locFilters.regions.join("', '")}')`;
			}
			if (locFilters.counties.length) {
				query += `AND County__c in ('${locFilters.counties.join("', '")}')`;
			}
		}

		if (sort) {
			query += `
				ORDER BY ${sort.split('#').join(' ')}
			`;
		}

		query += `
			LIMIT 50
		`;

		const url = this.getRestUrl('/query');
		url.searchParams.set('q', query);

		return await this.queryFetcher<DetailAccount>(url);
	}

	// async getDistinctIndustries() {
	// 	const url = this.getRestUrl('/query');
	// 	url.searchParams.set(
	// 		'q',
	// 		`
	// 			SELECT
	// 				Industry_3__c, COUNT(Name)
	// 			FROM
	// 				Account
	// 			WHERE
	// 				TCM_Member__c = true and
	// 				IsDeleted <> true
	// 			GROUP BY
	// 				Industry_3__c
	// 		`
	// 	);
	//
	// 	interface Distincts {
	// 		attributes: {
	// 			type: string;
	// 		};
	// 		Industry_3__c: string;
	// 		expr0: number;
	// 	}
	//
	// 	const data = await this.queryFetcher<Distincts>(url);
	//
	// 	return data.map(x => x.Industry_3__c);
	// }

	// async getDistinctCounties() {
	// 	const url = this.getRestUrl('/query');
	// 	url.searchParams.set(
	// 		'q',
	// 		`
	// 			SELECT County__c
	// 			FROM Account
	// 			WHERE County__c <> NULL
	// 				AND TCM_Member__c = true
	// 				AND IsDeleted <> true
	// 		`
	// 	);
	//
	// 	interface Distincts {
	// 		attributes: {
	// 			type: string;
	// 		};
	// 		County__c: string;
	// 		expr0: number;
	// 	}
	//
	// 	const counties = new Set();
	// 	const data = await this.queryFetcher<Distincts>(url);
	// 	data.forEach(x => counties.add(x.County__c));
	//
	// 	return counties.values();
	// }

	// async getDistinctRegions() {
	// 	const url = this.getRestUrl('/query');
	// 	url.searchParams.set(
	// 		'q',
	// 		`
	// 			SELECT
	// 				Region_2_0__c
	// 			FROM
	// 				Account
	// 			WHERE
	// 				Region_2_0__C <> NULL AND
	// 				TCM_Member__c = true AND
	// 				IsDeleted <> true
	// 		`
	// 	);
	//
	// 	interface Distincts {
	// 		attributes: {
	// 			type: string;
	// 		};
	// 		Region_2_0__c: string;
	// 		expr0: number;
	// 	}
	//
	// 	const regions = new Set();
	// 	const data = await this.queryFetcher<Distincts>(url);
	// 	data.forEach(x => regions.add(x.Region_2_0__c));
	//
	// 	return regions.values();
	// }
}

const sfClient = new SfClient();
export default sfClient;

// (async () => {
// 	await sfClient.authorized;
// 	return await sfClient.getDistinctCounties();
// })()
// 	.then(console.log)
// 	.catch(console.error);
