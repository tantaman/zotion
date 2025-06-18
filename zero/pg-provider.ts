import {NodePgClient} from 'drizzle-orm/node-postgres';
import {ZQLDatabase, DBConnection, Row, DBTransaction} from '@rocicorp/zero/pg';
import {schema} from './schema';

// CUT: this is annoying. How can we make this easier?
class DrizzleConnection implements DBConnection<NodePgClient> {
  readonly #client: NodePgClient;
  constructor(client: NodePgClient) {
    this.#client = client;
  }

  async transaction<T>(
    cb: (tx: DBTransaction<NodePgClient>) => Promise<T>,
  ): Promise<T> {
    const client = this.#client;
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

export function zeroNodePg(client: NodePgClient) {
  return new ZQLDatabase(new DrizzleConnection(client), schema);
}
