import '../../shared/env';
import {drizzle} from 'drizzle-orm/node-postgres';
export const db = drizzle(process.env.PG_URL!);
