import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiltrosBusquedaColegas } from '../components/colegas/FiltrosBusquedaColegas'
import { TablaColegas } from '../components/colegas/TablaColegas'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { buscarColegas, filtrosBusquedaColegasIniciales } from '../services/buscarColegas'
import type { Colega, FiltrosBusquedaColegas as FiltrosType } from '../types/colegas'

export function BuscarColegasPage() {
  const { user } = useAuth()
  const [filtros, setFiltros] = useState<FiltrosType>(filtrosBusquedaColegasIniciales)
  const [resultados, setResultados] = useState<Colega[]>([])
  const [pagination, setPagination] = useState({ page: 1, lastPage: 1, total: 0 })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    const filtrosEfectivos: FiltrosType = {
      ...filtros,
      rubro: (filtros.incluirMiRubro && user?.socio?.rubro ? user.socio.rubro : filtros.rubro) as FiltrosType['rubro'],
    }

    setCargando(true)
    setError(null)

    buscarColegas(filtrosEfectivos)
      .then((response) => {
        if (cancelado) return
        setResultados(response.items)
        setPagination({
          page: response.pagination?.page ?? 1,
          lastPage: response.pagination?.lastPage ?? 1,
          total: response.pagination?.total ?? response.items.length,
        })
      })
      .catch((e: unknown) => {
        if (cancelado) return
        setResultados([])
        setError(e instanceof Error ? e.message : 'No se pudo cargar el directorio de colegas.')
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [filtros, user?.socio?.rubro])

  const handleFiltrosChange = (next: FiltrosType) => {
    setFiltros({ ...next, page: 1 })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Buscar colegas</h1>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              Directorio entre socios activos. Solo se muestran datos públicos de contacto.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition duration-150 hover:border-blue-200/80 hover:bg-blue-50"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <Card className="border-slate-200 shadow-md" title="Filtros de búsqueda">
        <FiltrosBusquedaColegas filtros={filtros} onChange={handleFiltrosChange} />
      </Card>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section aria-live="polite">
        <TablaColegas resultados={resultados} cargando={cargando} />
      </section>

      {!cargando && pagination.lastPage > 1 ? (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <span>
            Página {pagination.page} de {pagination.lastPage} · {pagination.total} colegas
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setFiltros((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.lastPage}
              onClick={() => setFiltros((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
