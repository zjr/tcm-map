import {
	pgTable,
	varchar,
	doublePrecision,
	text,
	boolean
} from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	Id: varchar('Id', { length: 30 }),
	Name: varchar('Name', { length: 256 }),
	BillingLatitude: doublePrecision('BillingLatitude'),
	BillingLongitude: doublePrecision('BillingLongitude'),
	Website: text('Website'),
	npo02__MembershipJoinDate__c: varchar('npo02__MembershipJoinDate__c', {
		length: 16
	}),
	Industry_1__c: varchar('Industry_1__c', { length: 64 }),
	Industry_2__c: varchar('Industry_2__c', { length: 64 }),
	Industry_3__c: varchar('Industry_3__c', { length: 64 }),
	Advocacy_org_type__c: boolean('Advocacy_org_type__c'),
	Business_org_type__c: boolean('Business_org_type__c'),
	Faith_org_type__c: boolean('Faith_org_type__c'),
	Government_org_type__c: boolean('Government_org_type__c'),
	Education_org_type__c: boolean('Education_org_type__c'),
	Nonprofit_org_type__c: boolean('Nonprofit_org_type__c'),
	Other_org_type__c: boolean('Other_org_type__c'),
	County__c: varchar('County__c', { length: 32 }),
	Region_2_0__c: varchar('Region_2_0__c', { length: 32 }),
	Logo__c: varchar('Logo__c', { length: 64 }),
	Logo_Last_Confirmed__c: varchar('Logo_Last_Confirmed__c', { length: 64 })
});
