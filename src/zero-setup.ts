import {Zero} from '@rocicorp/zero';
import {Atom} from '../shared/atom';
import {schema, Schema, UserId} from '../zero/schema';
import * as mutators from '../zero/mutators';

import {getSession} from './auth/authClient';

const {data: session, error} = await getSession();

export const zeroAtom = new Atom<Zero<Schema>>();
export const authAtom = new Atom<{id: UserId} | undefined>();

if (error) {
  console.error('Error fetching session:', error);
}
if (session) {
  console.log('Session fetched successfully:', session);
  authAtom.value = {
    ...session.user,
    id: session.user.id as UserId,
  };
}

authAtom.onChange(auth => {
  zeroAtom.value = new Zero({
    logLevel: 'info',
    server: window.location.protocol + '//' + window.location.host,
    userID: auth?.id ?? 'anon',
    schema,
    mutators,
  });
});
