import {createError, eventHandler, readBody} from 'vinxi/http';
import '../../shared/env';
import {NamedQuery, TransformRequestMessage, ast} from '@rocicorp/zero';
import * as queries from '../../zero/queries';
import {schema} from '../../zero/schema.gen';
import {auth} from '../auth';

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

  const transformRequest: TransformRequestMessage = await readBody(event);

  return [
    'transformed',
    transformRequest[1].map(req => {
      const name = req.name;
      if (!isQuery(name)) {
        throw new Error(`Unknown query: ${name}`);
      }

      return {
        id: req.id,
        name: req.name,
        ast: ast(schema, (queries[name] as NamedQuery<any, any>)(...req.args)),
      };
    }),
  ];
});

function isQuery(key: string): key is keyof typeof queries {
  return key in queries;
}
