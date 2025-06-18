import {useCallback, useSyncExternalStore} from 'react';
import {zeroAtom} from './zero-setup';
import {ZeroProvider} from '@rocicorp/zero/react';
import App from './App';
import {id, UserId, WorkspaceId} from '../zero/schema';

const workspaceId: WorkspaceId = id('1');
export function LoggedIn({userId}: {userId: UserId}) {
  const z = useSyncExternalStore(
    zeroAtom.onChange,
    useCallback(() => zeroAtom.value, []),
  );
  if (!z) return null;

  return (
    <ZeroProvider zero={z}>
      <App workspaceId={workspaceId} userId={userId} />
    </ZeroProvider>
  );
}
