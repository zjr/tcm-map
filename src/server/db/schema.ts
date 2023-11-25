import { sql } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core/indexes';
import {
	pgTable,
	varchar,
	doublePrecision,
	text,
	boolean,
	customType
} from 'drizzle-orm/pg-core';

export interface Point {
	lat: number;
	lng: number;
}

const pointType = customType<{ data: Point; driverData: string }>({
	dataType() {
		return 'geometry(POINT,4326)';
	},
	toDriver(value: Point): string {
		return `SRID=4326;POINT(${value.lng} ${value.lat})`;
	},
	fromDriver(value): Point {
		const matches = value.match(/POINT\((?<lng>[\d.-]+) (?<lat>[\d.-]+)\)/);
		const { lat, lng } = matches?.groups ?? {};
		return { lat: parseFloat(String(lat)), lng: parseFloat(String(lng)) };
	}
});

export const accounts = pgTable(
	'accounts',
	{
		Id: varchar('Id', { length: 30 }).primaryKey(),
		Name: varchar('Name', { length: 256 }),
		BillingLatitude: doublePrecision('BillingLatitude'),
		BillingLongitude: doublePrecision('BillingLongitude'),

		BillingCity: varchar('BillingCity', { length: 128 }),
		BillingState: varchar('BillingState', { length: 32 }),

		coords: pointType('coords'),

		npo02__MembershipJoinDate__c: varchar('npo02__MembershipJoinDate__c', {
			length: 16
		}),

		Website: text('Website'),

		Industry_1__c: varchar('Industry_1__c', { length: 64 }),
		Industry_2__c: varchar('Industry_2__c', { length: 64 }),
		Industry_3__c: varchar('Industry_3__c', { length: 64 }),

		// "types"
		Faith_org_type__c: boolean('Faith_org_type__c'),
		Advocacy_org_type__c: boolean('Advocacy_org_type__c'),
		Business_org_type__c: boolean('Business_org_type__c'),
		Education_org_type__c: boolean('Education_org_type__c'),
		Nonprofit_org_type__c: boolean('Nonprofit_org_type__c'),
		Government_org_type__c: boolean('Government_org_type__c'),
		Other_org_type__c: boolean('Other_org_type__c'),

		County__c: varchar('County__c', { length: 32 }),
		Region_2_0__c: varchar('Region_2_0__c', { length: 32 }),

		Logo__c: varchar('Logo__c', { length: 64 }),
		Logo_Last_Confirmed__c: varchar('Logo_Last_Confirmed__c', { length: 64 }),

		TCM_Member__c: boolean('TCM_Member__c')
	},
	table => ({
		nameIdxAsc: index('name_idx').on(table.Name).asc().nullsLast(),
		nameIdxDesc: index('name_idx').on(table.Name).desc().nullsLast(),
		joinDateIdxAsc: index('join_idx')
			.on(table.npo02__MembershipJoinDate__c)
			.asc()
			.nullsLast(),
		joinDateIdxDesc: index('join_idx')
			.on(table.npo02__MembershipJoinDate__c)
			.desc()
			.nullsLast(),
		coordsIndex: index('coords_idx')
			.on(table.coords)
			.using(sql`GIST`)
	})
);
