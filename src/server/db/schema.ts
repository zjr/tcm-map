import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	Id: varchar('Id', { length: 30 }),
	Name: varchar('Name', { length: 256 })
});
