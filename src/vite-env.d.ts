/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_AUTH_LOGIN_ENDPOINT?: string
  readonly VITE_AUTH_ME_ENDPOINT?: string
  readonly VITE_AUTH_LOGOUT_ENDPOINT?: string
  readonly VITE_COLEGAS_SEARCH_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
