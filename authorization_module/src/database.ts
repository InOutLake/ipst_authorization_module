import { Database } from './types';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'db',
    host: 'localhost',
    user: 'postgres',
    port: 5434,
    max: 10
  })
});

export const db = new Kysely<Database>({
  dialect
});
