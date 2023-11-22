import path from 'path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { database, conn } from './database';

async function run() {
	await migrate(database, {
		migrationsFolder: path.join(__dirname, './drizzle/migrations')
	});
	await conn.end();
}

run().then(console.log).catch(console.error);
