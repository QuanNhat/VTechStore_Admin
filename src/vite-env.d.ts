/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
