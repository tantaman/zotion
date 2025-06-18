import {createError, eventHandler, toWebRequest} from 'vinxi/http';
import {NodePgClient} from 'drizzle-orm/node-postgres';
import {
  ZQLDatabase,
  DBConnection,
  Row,
  DBTransaction,
  handleMutations,
  CustomMutatorImpl,
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

const dbProvider = new ZQLDatabase(new DrizzleConnection(), schema);

export default eventHandler(async event => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return await handleMutations(
    async (transact, mutation) => {
      // Do pre-transaction stuff

      // Run the mutator
      const ret = await transact(
        dbProvider,
        mutation,
        async (tx, name, args) => {
          if (!isMutator(name)) {
            throw new Error(`Unknown mutator: ${name}`);
          }
          await (mutators[name] as CustomMutatorImpl<any>)(tx, args);
        },
      );

      // Do post-transaction stuff

      return ret;
    },
    toWebRequest(event),
    'debug',
  );
});

function isMutator(key: string): key is keyof typeof mutators {
  return key in mutators;
}
