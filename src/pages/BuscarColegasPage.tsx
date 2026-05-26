import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiltrosBusquedaColegas } from '../components/colegas/FiltrosBusquedaColegas'
import { TablaColegas } from '../components/colegas/TablaColegas'
import { Card } from '../components/ui/Card'
import { buscarColegas, colegasBackendConfigurado, filtrosBusquedaColegasIniciales } from '../services/buscarColegas'
import type { FiltrosBusquedaColegas as FiltrosType, SocioParaRecomendar } from '../types/colegas'

const COLEGAS_UNAVAILABLE_MESSAGE = 'Servicio de búsqueda no disponible por el momento.'

export function BuscarColegasPage() {
  const [filtros, setFiltros] = useState<FiltrosType>(filtrosBusquedaColegasIniciales)
  const [resultados, setResultados] = useState<SocioParaRecomendar[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    if (!colegasBackendConfigurado()) {
      setResultados([])
      setError(COLEGAS_UNAVAILABLE_MESSAGE)
      setCargando(false)
      return () => {
        cancelado = true
      }
    }

    setCargando(true)
    setError(null)
    buscarColegas(filtros)
      .then((lista) => {
        if (!cancelado) setResultados(lista)
      })
      .catch((e: unknown) => {
        if (!cancelado) {
          setResultados([])
          setError(e instanceof Error ? e.message : 'No se pudo cargar el directorio de colegas.')
        }
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [filtros])

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Buscar colegas para recomendar
            </h1>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              Directorio entre socios. Solo se muestran datos públicos de contacto para recomendaciones.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {colegasBackendConfigurado() ? 'Consulta conectada a API' : COLEGAS_UNAVAILABLE_MESSAGE}
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
        <FiltrosBusquedaColegas filtros={filtros} onChange={setFiltros} />
      </Card>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section aria-live="polite">
        <TablaColegas resultados={resultados} cargando={cargando} />
      </section>
    </div>
  )
}
