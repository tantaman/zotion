import {eventHandler, readBody} from 'vinxi/http';
import {drizzle} from 'drizzle-orm/node-postgres';
import '../shared/env';
import {NamedQuery, TransformRequestMessage} from '@rocicorp/zero';
import * as queries from '../zero/queries';
const db = drizzle(process.env.PG_URL!);

export default eventHandler(async event => {
  const transformRequest: TransformRequestMessage = await readBody(event);

  return [
    'transformed',
    transformRequest[1].map(req => {
      const name = req.name;
      if (!isSharedQuery(name)) {
        throw new Error(`Unknown query: ${name}`);
      }

      return {
        id: req.id,
        name: req.name,
        ast: (queries[name] as NamedQuery<any, any>)(...req.args).ast,
      };
    }),
  ];
});

function isSharedQuery(key: string): key is keyof typeof queries {
  return key in queries;
}
