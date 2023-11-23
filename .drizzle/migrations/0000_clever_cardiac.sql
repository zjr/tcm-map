CREATE TABLE IF NOT EXISTS "accounts" (
	"Id" varchar(30) PRIMARY KEY NOT NULL,
	"Name" varchar(256),
	"BillingLatitude" double precision,
	"BillingLongitude" double precision,
	"BillingCity" varchar(128),
	"BillingState" varchar(32),
	"npo02__MembershipJoinDate__c" varchar(16),
	"Website" text,
	"Industry_1__c" varchar(64),
	"Industry_2__c" varchar(64),
	"Industry_3__c" varchar(64),
	"Faith_org_type__c" boolean,
	"Advocacy_org_type__c" boolean,
	"Business_org_type__c" boolean,
	"Education_org_type__c" boolean,
	"Nonprofit_org_type__c" boolean,
	"Government_org_type__c" boolean,
	"Other_org_type__c" boolean,
	"County__c" varchar(32),
	"Region_2_0__c" varchar(32),
	"Logo__c" varchar(64),
	"Logo_Last_Confirmed__c" varchar(64)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "accounts" ("Name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "join_idx" ON "accounts" ("npo02__MembershipJoinDate__c");