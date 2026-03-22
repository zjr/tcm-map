import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

export const conn = postgres();
export const db = drizzle(conn, { schema });
