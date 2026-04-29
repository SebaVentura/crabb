import { useMemo, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { filtrosDataTecnica, manualesPropios, resultadosTecnicos } from '../mocks/data-tecnica.mock'
import type { ResultadoTecnico } from '../types'

function textoCoincide(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

function itemCoincideBusquedaPrincipal(item: ResultadoTecnico, q: string) {
  if (q.trim() === '') return true
  const n = q.trim()
  if (textoCoincide(item.diagnostico, n)) return true
  if (textoCoincide(item.sintoma, n)) return true
  if (textoCoincide(item.codigo, n)) return true
  if (textoCoincide(item.sistema, n)) return true
  if (item.causas.some((c) => textoCoincide(c, n))) return true
  if (textoCoincide(item.solucion, n)) return true
  return false
}

export function DataTecnicaPage() {
  const [query, setQuery] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [sistema, setSistema] = useState('')
  const [filtroSintoma, setFiltroSintoma] = useState('')
  const [filtroCodigo, setFiltroCodigo] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [docAbierto, setDocAbierto] = useState(false)

  const hayCriteriosActivos = useMemo(() => {
    return (
      query.trim() !== '' ||
      marca !== '' ||
      modelo !== '' ||
      sistema !== '' ||
      filtroSintoma.trim() !== '' ||
      filtroCodigo.trim() !== ''
    )
  }, [query, marca, modelo, sistema, filtroSintoma, filtroCodigo])

  const resultados = useMemo(() => {
    if (!hayCriteriosActivos) return []

    return resultadosTecnicos.filter((item) => {
      if (!itemCoincideBusquedaPrincipal(item, query)) return false
      if (marca !== '' && item.marca !== marca) return false
      if (modelo !== '' && item.modelo !== modelo) return false
      if (sistema !== '' && item.sistema !== sistema) return false
      if (filtroSintoma.trim() !== '' && !textoCoincide(item.sintoma, filtroSintoma.trim())) return false
      if (filtroCodigo.trim() !== '' && !textoCoincide(item.codigo, filtroCodigo.trim())) return false
      return true
    })
  }, [hayCriteriosActivos, query, marca, modelo, sistema, filtroSintoma, filtroCodigo])

  const toggleExpanded = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Data Técnica</h1>
        <p className="mt-1 text-sm text-slate-600 md:text-base">
          Buscador técnico basado en fuentes propias CRABB
        </p>
        <p className="mt-2 text-xs text-slate-500">Consulta simulada · sin conexión a servidor</p>
      </header>

      <Card className="border-slate-200 shadow-md" title="Búsqueda">
        <label className="sr-only" htmlFor="busqueda-data-tecnica">
          Búsqueda principal
        </label>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <input
            id="busqueda-data-tecnica"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por falla, síntoma, código o sistema..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 md:py-3.5 md:text-lg"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-marca">
              Marca
            </label>
            <select
              id="filtro-marca"
              value={marca}
              onChange={(event) => setMarca(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Todas</option>
              {filtrosDataTecnica.marcas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-modelo">
              Modelo
            </label>
            <select
              id="filtro-modelo"
              value={modelo}
              onChange={(event) => setModelo(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Todos</option>
              {filtrosDataTecnica.modelos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-sistema">
              Sistema
            </label>
            <select
              id="filtro-sistema"
              value={sistema}
              onChange={(event) => setSistema(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">Todos</option>
              {filtrosDataTecnica.sistemas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-sintoma">
              Síntoma
            </label>
            <input
              id="filtro-sintoma"
              type="text"
              value={filtroSintoma}
              onChange={(event) => setFiltroSintoma(event.target.value)}
              placeholder="Filtrar por síntoma"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-codigo">
              Código
            </label>
            <input
              id="filtro-codigo"
              type="text"
              value={filtroCodigo}
              onChange={(event) => setFiltroCodigo(event.target.value)}
              placeholder="Ej. P0171"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </Card>

      {!hayCriteriosActivos ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center md:p-10">
          <p className="text-sm font-medium text-slate-800 md:text-base">Sin búsqueda activa</p>
          <p className="mt-2 text-sm text-slate-600">
            Ingresá términos en el buscador o combiná filtros para consultar la base técnica CRABB.
          </p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-6 text-center md:p-10">
          <p className="text-sm font-medium text-slate-900 md:text-base">Sin resultados en esta consulta</p>
          <p className="mt-2 text-sm text-slate-600">
            No hay coincidencias con los criterios seleccionados. Probá ampliar la búsqueda o relajar filtros.
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Resultados ({resultados.length})
          </h2>
          {resultados.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200 shadow-md md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 md:text-base">
                    {item.marca} {item.modelo} · <span className="font-mono text-slate-800">{item.codigo}</span>
                  </p>
                  <Badge tone="blue">{item.sistema}</Badge>
                </div>
              </div>

              <p className="mt-2 text-sm font-medium text-slate-800 md:mt-3">{item.sintoma}</p>
              <p className="mt-1 text-sm text-slate-700 md:text-base">
                <span className="font-medium text-slate-900">Diagnóstico probable: </span>
                {item.diagnostico}
              </p>

              <p className="mt-2 border-l-4 border-blue-500 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 md:mt-3 md:text-sm">
                Fuente: base técnica CRABB
              </p>

              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm md:mt-4 md:p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resumen</p>
                <p className="mt-1 text-slate-700">
                  {item.causas.slice(0, 2).join(' · ')}
                  {item.causas.length > 2 ? '…' : ''} — {item.solucion.length > 120 ? `${item.solucion.slice(0, 120)}…` : item.solucion}
                </p>
              </div>

              <button
                type="button"
                className="mt-3 text-sm font-semibold text-blue-700 transition duration-150 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:mt-4"
                onClick={() => toggleExpanded(item.id)}
                aria-expanded={expandedId === item.id}
              >
                {expandedId === item.id ? 'Ocultar detalle técnico' : 'Ver detalle técnico'}
              </button>

              {expandedId === item.id ? (
                <div className="mt-3 space-y-3 border-t border-slate-200 pt-3 text-sm md:mt-4 md:space-y-4 md:pt-4 md:text-base">
                  <div>
                    <p className="font-semibold text-slate-900">Posibles causas</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                      {item.causas.map((causa) => (
                        <li key={causa}>{causa}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Solución sugerida</p>
                    <p className="mt-1 text-slate-700">{item.solucion}</p>
                  </div>
                  <p className="border-l-4 border-blue-500 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 md:text-sm">
                    Fuente: base técnica CRABB
                  </p>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <Card className="border-slate-200 shadow-md">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left text-base font-semibold text-slate-900 transition duration-150 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:text-lg"
          onClick={() => setDocAbierto((o) => !o)}
          aria-expanded={docAbierto}
        >
          Documentación CRABB
          <span className="text-slate-400" aria-hidden>
            {docAbierto ? '−' : '+'}
          </span>
        </button>
        {docAbierto ? (
          <ul className="mt-3 list-disc space-y-2 border-t border-slate-100 pt-3 pl-5 text-sm text-slate-700 md:mt-4 md:pt-4 md:text-base">
            {manualesPropios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Card>
    </div>
  )
}
