import {
  createError,
  eventHandler,
  getHeaders,
  getQuery,
  readBody,
} from 'vinxi/http';
import {NodePgClient} from 'drizzle-orm/node-postgres';
import {
  ZQLDatabase,
  PushProcessor,
  DBConnection,
  Row,
  DBTransaction,
} from '@rocicorp/zero/pg';
import {schema} from '../../zero/schema.gen';
import * as mutators from '../../zero/mutators';
import {db} from '../db/db';
import {auth} from '../auth';

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
      await client.query('BEGIN');
      const ret = await cb(new DrizzleTransaction(client));
      await client.query('COMMIT');
      return ret;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
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
  'debug',
);

export default eventHandler(async event => {
  const query = getQuery(event);
  const body = await readBody(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  console.log('PUSH SESSION', session);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // TODO: I think this would be better
  // if we looked up the mutator(s) ourselves as we do
  // with custom queries.
  // Then call `z.transact(mutator)` to run it
  // this way we can pass extra args without constructing
  // all mutators
  // Would look like:
  // serverMutator(z);
  // function serverMutator(z) {
  //    outside tx code
  //    z.transact(sharedMutator);
  // }
  // TODO: we also need adapters for each thing
  // - drizzle
  // - kysely
  // - prisma
  // - node-pg
  // - postgres
  // So users do not have to wrap all their own

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
