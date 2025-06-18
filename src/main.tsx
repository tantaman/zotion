import React, {useCallback, useSyncExternalStore} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {authAtom} from './zero-setup';
import LoginPage from './LoginPage';
import {LoggedIn} from './LoggedIn';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Branch />
  </React.StrictMode>,
);

function Branch() {
  const auth = useSyncExternalStore(
    authAtom.onChange,
    useCallback(() => authAtom.value, []),
  );
  if (!auth) {
    return <LoginPage />;
  }
  return <LoggedIn userId={auth.id} />;
}
