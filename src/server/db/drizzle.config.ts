import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
	out: './drizzle',
	schema: './schema.ts',
	driver: 'pg'
} satisfies Config;
