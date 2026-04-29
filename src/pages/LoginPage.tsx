import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authMock } from '../app/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const logoCrabbUrl = `${import.meta.env.BASE_URL}logo-crabb.jpg`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    authMock.login()
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen min-h-dvh w-full items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <img
            src={logoCrabbUrl}
            alt="CRABB"
            className="mx-auto mb-5 h-16 w-auto max-w-[200px] object-contain"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Ingreso CRABB</h1>
          <p className="mt-2 text-sm text-slate-500">Acceso institucional (preview)</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            type="email"
            required
            placeholder="Email"
          />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            type="password"
            required
            placeholder="Contraseña"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
