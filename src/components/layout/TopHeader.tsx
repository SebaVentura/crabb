import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

type TopHeaderProps = {
  title: string
}

export function TopHeader({ title }: TopHeaderProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    if (import.meta.env.DEV) {
      console.log('[AUTH][LOGOUT] Iniciando cierre de sesión desde TopHeader.')
    }
    navigate('/', { replace: true })
    await logout()
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white px-4 py-3 shadow-sm md:px-6">
      <div className="flex items-start justify-between gap-3 md:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            <span translate="no" className="notranslate">
              CRABB
            </span>{' '}
            App
          </p>
          <h1 className="text-lg font-semibold text-slate-900 md:text-xl">{title}</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="hidden shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 md:inline-flex"
        >
          Cerrar sesión
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 md:hidden"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
