import {createError, eventHandler, toWebRequest} from 'vinxi/http';
import {handleMutations, CustomMutatorImpl} from '@rocicorp/zero/pg';
import * as mutators from '../../zero/mutators';
import {db} from '../db/db';
import {auth} from '../auth';
import {zeroNodePg} from '../../zero/pg-provider';

const dbProvider = zeroNodePg(db.$client);
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

  return await handleMutations(async (transact, _mutation) => {
    // Do pre-transaction stuff

    // Run the mutator
    const ret = await transact(dbProvider, async (tx, name, args) => {
      if (!isMutator(name)) {
        console.error(`Unknown mutator: ${name}. Skipping the mutation.`);
        return;
      }
      await (mutators[name] as CustomMutatorImpl<any>)(tx, args);
    });

    // Do post-transaction stuff

    return ret;
  }, toWebRequest(event));
});

function isMutator(key: string): key is keyof typeof mutators {
  return key in mutators;
}
