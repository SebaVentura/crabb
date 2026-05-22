function normalizeBaseUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function readOptionalEnv(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized ? normalized : undefined
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? ''),
  authLoginEndpoint: readOptionalEnv(import.meta.env.VITE_AUTH_LOGIN_ENDPOINT),
  authMeEndpoint: readOptionalEnv(import.meta.env.VITE_AUTH_ME_ENDPOINT),
  authLogoutEndpoint: readOptionalEnv(import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT),
  colegasSearchEndpoint: readOptionalEnv(import.meta.env.VITE_COLEGAS_SEARCH_ENDPOINT),
}

export function ensureEnv(): void {
  if (!env.apiBaseUrl) {
    throw new Error('Falta VITE_API_BASE_URL en variables de entorno.')
  }
}
