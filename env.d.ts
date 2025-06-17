/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SERVER: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
