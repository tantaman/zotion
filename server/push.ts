import {eventHandler, getQuery, readBody} from 'vinxi/http';
import '../shared/env';
import {drizzle, NodePgClient} from 'drizzle-orm/node-postgres';

import {
  ZQLDatabase,
  PushProcessor,
  DBConnection,
  Row,
  DBTransaction,
} from '@rocicorp/zero/pg';
import {schema} from '../zero/schema.gen';
import * as mutators from '../zero/mutators';

const db = drizzle(process.env.PG_URL!);
const client = db.$client;

// CUT: this is annoying. How can we make this easier?
class DrizzleConnection implements DBConnection<NodePgClient> {
  async query(query: string, args: unknown[]): Promise<Iterable<Row>> {
    return (await client.query(query, args)).rows;
  }

  async transaction<T>(
    cb: (tx: DBTransaction<NodePgClient>) => Promise<T>,
  ): Promise<T> {
    try {
      client.query('BEGIN');
      return await cb(new DrizzleTransaction(client));
    } catch (e) {
      client.query('ROLLBACK');
      throw new Error(`Failed to begin transaction: ${e}`);
    }
  }
}

class DrizzleTransaction implements DBTransaction<NodePgClient> {
  readonly #tx: NodePgClient;
  constructor(tx: NodePgClient) {
    this.#tx = tx;
  }

  async query(query: string, args: unknown[]): Promise<Iterable<Row>> {
    return (await this.#tx.query(query, args)).rows;
  }

  get wrappedTransaction() {
    return this.#tx;
  }
}

const processor = new PushProcessor(
  new ZQLDatabase(new DrizzleConnection(), schema),
);

export default eventHandler(async event => {
  const query = getQuery(event);
  const body = await readBody(event);

  return await processor.process(
    mutators,
    // CUT: technically our query record type should be wider to allow arrays of values
    /*
    type QueryValue = string | number | undefined | null | boolean | Array<QueryValue> | Record<string, any>;
    type QueryObject = Record<string, QueryValue | QueryValue[]>;
    */
    query as Record<string, string>,
    body,
  );
});
