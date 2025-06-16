import { createApp } from 'vinxi';

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
      plugins: () => [
        import('@vitejs/plugin-react').then(m => m.default()),
      ],
    },
  ],
});