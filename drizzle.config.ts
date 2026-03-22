import type { Config } from 'drizzle-kit';

export default {
	out: './src/server/db/drizzle',
	schema: './src/server/db/schema.ts',
	driver: 'pg'
} satisfies Config;
