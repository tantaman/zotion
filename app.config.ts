import {createApp} from 'vinxi';

export default createApp({
  routers: [
    {
      name: 'public',
      type: 'static',
      dir: './public',
      base: '/',
    },
    {
      name: 'client',
      type: 'spa',
      handler: './index.html',
      target: 'browser',
      plugins: () => [import('@vitejs/plugin-react').then(m => m.default())],
    },
    {
      name: 'api',
      type: 'http',
      handler: './server/api/pull.ts',
      base: '/api/pull',
    },
    {
      name: 'api',
      type: 'http',
      handler: './server/api/push.ts',
      base: '/api/push',
    },
    {
      name: 'api',
      type: 'http',
      handler: './server/api/auth.ts',
      base: '/api/auth',
    },
    {
      name: 'api',
      type: 'http',
      handler: './server/api/yjs.ts',
      base: '/api/yjs',
    },
  ],
});
