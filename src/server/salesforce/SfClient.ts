// noinspection SqlNoDataSourceInspection
import 'dotenv/config';

import {
	and,
	asc,
	desc,
	eq,
	inArray,
	InferInsertModel,
	isNotNull,
	like,
	or,
	sql
} from 'drizzle-orm';

import { db } from '../db/database';
import { accounts } from '../db/schema';

import type {
	DetailAccount,
	PinTuple,
	SfApiError,
	SfApiOAuthResponse,
	SfApiQueryResponse,
	SfDescribeResponse,
	SfOrgType,
	SfQueryApiError
} from './types';

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

	private authorized: boolean = false;

	constructor() {
		this.host = process.env.SF_HOST || 'https://childrennow.my.salesforce.com';
		this.token = '';
		this.restEndpoint = '/services/data/v59.0';
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
		this.authorized = true;
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
		if (!this.authorized) {
			await this.authorize(true);
			return this.fetcher(url);
		}

		try {
			const res = await fetch(url, opts);
			return await this.resHandler<T>(res);
		} catch (e) {
			return await this.handleAuthRetry(e, retries, () =>
				this.fetcher<T>(url, void 0, --retries)
			);
		}
	}

	async queryFetcher<T extends object>(
		url: RequestInfo | URL,
		opts: RequestInit = this.standardRestOptions,
		retries: number = 1
	): Promise<Array<T>> {
		if (!this.authorized) {
			await this.authorize(true);
			return this.queryFetcher(url);
		}

		try {
			const res = await fetch(url, opts);
			const data = await this.resHandler<SfApiQueryResponse<T>>(res);
			return await this.paginateQuery(data);
		} catch (e) {
			return await this.handleAuthRetry(e, retries, () =>
				this.queryFetcher<T>(url, void 0, --retries)
			);
		}
	}

	async describeAccount() {
		return await this.fetcher<SfDescribeResponse>(
			this.getRestUrl('/sobjects/Account/describe')
		);
	}

	async reseedDatabase() {
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
				Logo_Last_Confirmed__c,
				TCM_Member__c
			FROM
				Account
			WHERE
				TCM_Member__c = true and
				IsDeleted <> true
		`;

		const url = this.getRestUrl('/query');
		url.searchParams.set('q', query);

		const data = await this.queryFetcher<DetailAccount>(url);

		for (const account of data) {
			delete account.attributes;
			await db.insert(accounts).values(account).onConflictDoUpdate({
				target: accounts.Id,
				set: account
			});
		}
	}

	private pinsSelect = {
		Id: accounts.Id,
		Name: accounts.Name,
		BillingLatitude: accounts.BillingLatitude,
		BillingLongitude: accounts.BillingLongitude
	};

	private getMembersFullStmt = db
		.select(this.pinsSelect)
		.from(accounts)
		.where(
			and(
				eq(accounts.TCM_Member__c, true),
				isNotNull(accounts.BillingLatitude),
				isNotNull(accounts.BillingLongitude)
			)
		)
		.prepare('get_members_full');

	private compressPins(data: InferInsertModel<typeof accounts>[]): PinTuple[] {
		return data
			.filter(x => {
				return x.Id && x.Name && x.BillingLatitude && x.BillingLongitude;
			})
			.map(
				x => [x.Id, x.Name, x.BillingLatitude, x.BillingLongitude] as PinTuple
			);
	}

	async getTcmMembersFull() {
		const data = await this.getMembersFullStmt.execute();
		return this.compressPins(data);
	}

	private getInitialStmt = db
		.select()
		.from(accounts)
		.orderBy(asc(accounts.Name))
		.limit(100)
		.prepare('get_initial');

	async getTcmMembersInitial() {
		return this.getInitialStmt.execute();
	}

	async getTcmMemberDetails({
		ids,
		sort,
		search,
		filters
	}: {
		ids: string[];
		sort?: string;
		search: string;
		filters: { [k in 'locations' | 'industries' | 'types']: string[] };
	}) {
		const where = [];
		const orderBy = [];

		let whereIds;

		if (ids?.length) {
			whereIds = inArray(accounts.Id, ids);
		}

		if (search) {
			where.push(like(accounts.Name, `%${search}%`));
		}

		if (filters.industries.length) {
			where.push(
				or(
					inArray(accounts.Industry_1__c, filters.industries),
					inArray(accounts.Industry_2__c, filters.industries),
					inArray(accounts.Industry_3__c, filters.industries)
				)
			);
		}

		if (filters.types.length) {
			for (const type of filters.types) {
				where.push(eq(accounts[type as SfOrgType], true));
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
				where.push(inArray(accounts.Region_2_0__c, locFilters.regions));
			}

			if (locFilters.counties.length) {
				where.push(inArray(accounts.County__c, locFilters.counties));
			}
		}

		if (sort) {
			const [field, direction] = sort.split('#');
			const directionFn = direction === 'ASC' ? asc : desc;
			orderBy.push(directionFn(sql.raw(`"${field}"`)));
		}

		const full = await db
			.select()
			.from(accounts)
			.where(and(whereIds, ...where))
			.orderBy(...orderBy)
			.limit(50);

		const pins = where.length
			? await db
					.select(this.pinsSelect)
					.from(accounts)
					.where(and(...where))
					.orderBy(...orderBy)
			: [];

		return { full, pins: this.compressPins(pins) };
	}
}

const sfClient = new SfClient();
export default sfClient;
