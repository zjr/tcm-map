interface SFApiError {
	error: string;
	error_description: string;
}

interface SFRecord {
	attributes: {
		// ex: "Account"
		type: string;
		// Base resource URL
		url: string;
	};
}

interface SFApiResponse {
	dunno: string;
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

		return await this.resHandler<SFApiResponse>(res);
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
		interface PartialAccount extends SFRecord {
			// ex: "0015G00001Uyc7lQAB"
			Id: string;
			// ex: "Project MORE Foundation"
			Name: string;
			// ex: 37.3539663
			BillingLatitude: number;
			// ex: -121.9529992
			BillingLongitude: number;
		}

		const url = this.getRestUrl('/query');
		// noinspection SqlNoDataSourceInspection
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
				 	 BillingLongitude <> null
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
}

export default new SFClient();
