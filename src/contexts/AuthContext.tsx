import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError, setApiAuthTokenResolver, setApiUnauthorizedHandler } from '../lib/apiClient'
import { authService, type AuthUser, type LoginPayload } from '../services/authService'

const SESSION_TOKEN_KEY = 'crabb_auth_token'

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshCurrentUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readPersistedToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY)
}

function persistToken(token: string | null) {
  if (token) {
    localStorage.setItem(SESSION_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(SESSION_TOKEN_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readPersistedToken())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    persistToken(null)
  }, [])

  const refreshCurrentUser = useCallback(async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authService.login(payload)
    setToken(result.token)
    persistToken(result.token)

    if (result.user) {
      setUser(result.user)
      return
    }

    try {
      await refreshCurrentUser()
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setUser(null)
        return
      }
      throw error
    }
  }, [refreshCurrentUser])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearSession()
    }
  }, [clearSession])

  useEffect(() => {
    setApiAuthTokenResolver(() => token)
  }, [token])

  useEffect(() => {
    setApiUnauthorizedHandler(clearSession)
    return () => setApiUnauthorizedHandler(null)
  }, [clearSession])

  useEffect(() => {
    let active = true

    if (!token) {
      setIsInitializing(false)
      return () => {
        active = false
      }
    }

    if (import.meta.env.DEV) {
      console.log('[AUTH][ME][REQ] Hidratando sesión desde token persistido.')
    }

    refreshCurrentUser()
      .catch(() => {
        if (import.meta.env.DEV) {
          console.log('[AUTH][ME][RES] Error al hidratar sesión, limpiando token.')
        }
        if (active) clearSession()
      })
      .finally(() => {
        if (active) setIsInitializing(false)
      })

    return () => {
      active = false
    }
  }, [token, clearSession, refreshCurrentUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isInitializing,
      isLoading: isInitializing,
      login,
      logout,
      refreshCurrentUser,
    }),
    [token, user, isInitializing, login, logout, refreshCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
