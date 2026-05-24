import { env } from '../config/env'
import { apiRequest } from '../lib/apiClient'

export type UserRole = 'admin' | 'socio' | (string & {})

export type AuthUser = {
  id: number | string
  name: string
  email: string
  role: UserRole
}

export type LoginPayload = {
  email: string
  password: string
}

type LoginResponse = {
  token?: string
  access_token?: string
  user?: unknown
  data?: {
    user?: unknown
  }
}

type MeResponse =
  | {
      user?: unknown
      data?: {
        user?: unknown
      }
    }
  | unknown

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toStringOrEmpty(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function extractUserCandidate(value: unknown): unknown {
  if (!isRecord(value)) return value
  if ('user' in value && value.user !== undefined) return value.user
  if (isRecord(value.data) && 'user' in value.data && value.data.user !== undefined) return value.data.user
  return value
}

export function normalizeUser(raw: unknown): AuthUser | null {
  const candidate = extractUserCandidate(raw)
  if (!isRecord(candidate)) return null

  const id = candidate.id
  if (typeof id !== 'string' && typeof id !== 'number') return null

  const name = toStringOrEmpty(candidate.name)
  const email = toStringOrEmpty(candidate.email)
  const roleRaw = toStringOrEmpty(candidate.role).trim().toLowerCase()

  return {
    id,
    name,
    email,
    role: (roleRaw || 'socio') as UserRole,
  }
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
    const endpoint = env.authLoginEndpoint

    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGIN][REQ]', { email: payload.email, hasPassword: Boolean(payload.password) })
    }

    const response = await apiRequest<LoginResponse>(endpoint, {
      method: 'POST',
      body: { ...payload, device_name: 'frontend-web' },
    })

    const user = normalizeUser(response)

    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGIN][USER]', {
        id: user?.id ?? null,
        email: user?.email ?? null,
        role: user?.role ?? null,
      })
    }

    return {
      token: extractToken(response),
      user: user ?? undefined,
    }
  },

  async getCurrentUser(token?: string): Promise<AuthUser> {
    const endpoint = env.authMeEndpoint

    if (import.meta.env.DEV) {
      console.log('[AUTH][ME][REQ]')
    }

    const response = await apiRequest<MeResponse>(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    const user = normalizeUser(response)

    if (!user) {
      throw new Error('La respuesta de /auth/me no incluye un usuario válido.')
    }

    if (import.meta.env.DEV) {
      console.log('[AUTH][ME][USER]', { id: user.id, email: user.email, role: user.role })
    }

    return user
  },

  async logout(): Promise<void> {
    const endpoint = env.authLogoutEndpoint

    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGOUT]')
    }

    await apiRequest<void>(endpoint, { method: 'POST' })
  },
}
