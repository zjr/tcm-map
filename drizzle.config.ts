import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	out: './.drizzle/migrations',
	schema: './src/server/db/schema.ts',
	driver: 'pg'
} satisfies Config;
