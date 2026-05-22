import { env } from '../config/env'
import { apiRequest } from '../lib/apiClient'

export type AuthUser = {
  id: number | string
  name?: string
  email?: string
  role?: string
}

export type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  token?: string
  access_token?: string
  user?: AuthUser
}

function endpointOrThrow(endpoint: string | undefined, envName: string): string {
  if (!endpoint) {
    throw new Error(`Falta configurar ${envName}. Endpoint pendiente de contrato backend.`)
  }
  return endpoint
}

function extractToken(response: LoginResponse): string {
  const token = response.token ?? response.access_token
  if (!token) {
    throw new Error('La respuesta de login no incluye token.')
  }
  return token
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ token: string; user?: AuthUser }> {
    const endpoint = endpointOrThrow(env.authLoginEndpoint, 'VITE_AUTH_LOGIN_ENDPOINT')

    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGIN][REQ]', { email: payload.email, hasPassword: Boolean(payload.password) })
    }

    const response = await apiRequest<LoginResponse>(endpoint, {
      method: 'POST',
      body: { ...payload, device_name: 'frontend-web' },
    })

    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGIN][RES]', { hasToken: Boolean(response.token ?? response.access_token), user: response.user })
    }

    return {
      token: extractToken(response),
      user: response.user,
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const endpoint = endpointOrThrow(env.authMeEndpoint, 'VITE_AUTH_ME_ENDPOINT')

    if (import.meta.env.DEV) {
      console.log('[AUTH][ME][REQ]')
    }

    const user = await apiRequest<AuthUser>(endpoint)

    if (import.meta.env.DEV) {
      console.log('[AUTH][ME][RES]', { id: user.id, email: user.email, role: user.role })
    }

    return user
  },

  async logout(): Promise<void> {
    if (!env.authLogoutEndpoint) return

    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGOUT]')
    }

    await apiRequest<void>(env.authLogoutEndpoint, { method: 'POST' })
  },
}
