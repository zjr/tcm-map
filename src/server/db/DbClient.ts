// noinspection SqlNoDataSourceInspection
import 'dotenv/config';

import {
	and,
	asc,
	desc,
	eq,
	ilike,
	inArray,
	InferInsertModel,
	isNotNull,
	or,
	sql
} from 'drizzle-orm';

import { db } from './database';
import { accounts } from './schema';

import type { PinTuple, SfOrgType } from '../salesforce/types';

export class DbClientError extends Error {
	constructor(name: string, message: string) {
		super(message);
		this.name = name || 'DbApiError';
	}
}

export class DbClient {
	private pinsSelect = {
		Id: accounts.Id,
		Name: accounts.Name,
		BillingLatitude: accounts.BillingLatitude,
		BillingLongitude: accounts.BillingLongitude
	};

	private getFullPinsStmt = db
		.select(this.pinsSelect)
		.from(accounts)
		.where(and(eq(accounts.TCM_Member__c, true), isNotNull(accounts.coords)))
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

	async getPinsFull() {
		const data = await this.getFullPinsStmt.execute();
		return this.compressPins(data);
	}

	private getInitialStmt = db
		.select()
		.from(accounts)
		.orderBy(asc(accounts.Name))
		.limit(101)
		.prepare('get_initial');

	async getTcmMembersInitial() {
		const full = await this.getInitialStmt.execute();

		let next;
		if (full.splice(100).length) {
			next = JSON.stringify({ sort: 'Name#ASC', offset: 100 });
		}

		return { full, ...(next && { next }) };
	}

	async getTcmMemberDetails(body: {
		sort?: string;
		search?: string;
		filters?: { [k in 'locations' | 'industries' | 'types']: string[] };
		bounds: { south: number; west: number; north: number; east: number };
		offset: number;
		newPins: boolean;
	}) {
		const { sort, search, filters, bounds, offset = 0, newPins } = body;

		const where = [];
		const whereBounds = [];
		const orderBy = [];

		if (bounds && bounds.east < 180) {
			const boundsX = [bounds.east, bounds.west];
			const boundsY = [bounds.north, bounds.south];

			whereBounds.push(sql`coords @ ST_MakeEnvelope(
				${Math.min(...boundsX)}, ${Math.min(...boundsY)},
				${Math.max(...boundsX)}, ${Math.max(...boundsY)},
			4326)`);
		}

		if (search) {
			where.push(ilike(accounts.Name, `%${search}%`));
		}

		if (filters?.industries.length) {
			where.push(
				or(
					inArray(accounts.Industry_1__c, filters.industries),
					inArray(accounts.Industry_2__c, filters.industries),
					inArray(accounts.Industry_3__c, filters.industries)
				)
			);
		}

		if (filters?.types.length) {
			for (const type of filters.types) {
				where.push(eq(accounts[type as SfOrgType], true));
			}
		}

		if (filters?.locations.length) {
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
			.where(and(...whereBounds, ...where))
			.orderBy(...orderBy)
			.limit(51)
			.offset(offset);

		let next;
		if (full.splice(50).length) {
			next = JSON.stringify({
				...body,
				offset: offset + 50,
				newPins: undefined
			});
		}

		let pins;
		if (newPins) {
			pins = this.compressPins(
				where.length
					? await db
							.select(this.pinsSelect)
							.from(accounts)
							.where(and(...where, isNotNull(accounts.coords)))
					: await this.getFullPinsStmt.execute()
			);
		}

		return {
			full,
			...(next && { next }),
			...(pins && { pins })
		};
	}
}

const dbClient = new DbClient();
export default dbClient;
