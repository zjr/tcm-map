import 'dotenv/config';

import path from 'path';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import * as schema from './schema';

export const conn = postgres({ max: 1 });
export const mgDb = drizzle(conn, { schema });

async function run() {
	return await migrate(mgDb, {
		migrationsFolder: path.join(__dirname, 'drizzle/migrations')
	});
}

run()
	.then(console.log)
	.catch(console.error)
	.finally(async () => {
		await conn.end();
		process.exit();
	});
