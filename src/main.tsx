import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {schema, id_of} from '../zero/schema';
import {Zero} from '@rocicorp/zero';
import {ZeroProvider} from '@rocicorp/zero/react';
import * as mutators from '../zero/mutators';

const zero = new Zero({
  logLevel: 'info',
  server: window.location.protocol + '//' + window.location.host,
  userID: '1',
  schema,
  mutators,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ZeroProvider zero={zero}>
      <App workspaceId={id_of<'Workspace'>('1')} userId={id_of<'User'>('1')} />
    </ZeroProvider>
  </React.StrictMode>,
);
