import { SectionHeader } from '../components/ui/SectionHeader'
import { CuotasResumenCards } from '../features/cuotas-socios/components/CuotasResumenCards'
import { CuotasTable } from '../features/cuotas-socios/components/CuotasTable'
import { GenerarCuotasModal } from '../features/cuotas-socios/components/GenerarCuotasModal'
import { useAdminCuotas } from '../features/cuotas-socios/hooks/useAdminCuotas'
import {
  isPeriodoFilterDisabled,
  isPeriodoIgnoredForTipoTodas,
} from '../features/cuotas-socios/utils/resolveCuotasApiFilters'
import type { EstadoCuota } from '../types/cuotas'
import { ESTADO_CUOTA_LABELS } from '../types/cuotas'

export function AdminCuotasPage() {
  const cuotas = useAdminCuotas()
  const periodoDisabled = isPeriodoFilterDisabled(cuotas.tipo)
  const periodoIgnored = isPeriodoIgnoredForTipoTodas(cuotas.tipo, cuotas.periodo)

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader
          title="Cuotas de socios"
          subtitle="Gestión de cuotas, vencimientos y deuda de socios"
        />
        <button
          type="button"
          disabled={cuotas.isLoading}
          onClick={() => cuotas.setIsGenerarOpen(true)}
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Generar cuotas del mes
        </button>
      </div>

      {cuotas.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{cuotas.error}</div>
      ) : null}

      {cuotas.actionError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {cuotas.actionError}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => cuotas.setActionError(null)}
          >
            Cerrar
          </button>
        </div>
      ) : null}

      {cuotas.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-md">
          Cargando cuotas de socios…
        </div>
      ) : (
        <>
          <CuotasResumenCards resumen={cuotas.resumen} />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="buscar-cuotas">
                  Buscar socio
                </label>
                <input
                  id="buscar-cuotas"
                  type="search"
                  value={cuotas.search}
                  onChange={(e) => cuotas.setSearch(e.target.value)}
                  placeholder="Nombre, taller, DNI, teléfono…"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-periodo">
                  Período
                </label>
                <div className="flex gap-2">
                  <input
                    id="filtro-periodo"
                    type="text"
                    value={cuotas.periodo}
                    disabled={periodoDisabled}
                    onChange={(e) => cuotas.setPeriodo(e.target.value)}
                    placeholder="2026-06"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {cuotas.periodo.trim() && !periodoDisabled ? (
                    <button
                      type="button"
                      onClick={() => cuotas.setPeriodo('')}
                      className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Limpiar
                    </button>
                  ) : null}
                </div>
                {periodoDisabled ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Las cuotas iniciales usan período inicial-01 a inicial-08 y no dependen del mes
                    seleccionado.
                  </p>
                ) : periodoIgnored ? (
                  <p className="mt-1 text-xs text-amber-800">
                    Con Tipo: Todas, el período mensual no se aplica (ocultaría cuotas iniciales). Para
                    filtrar un mes, elegí Tipo: Mensuales. Para ver solo iniciales, elegí Tipo: Iniciales.
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Formato AAAA-MM. Solo aplica con Tipo: Mensuales.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-estado-cuota">
                  Estado
                </label>
                <select
                  id="filtro-estado-cuota"
                  value={cuotas.estado}
                  onChange={(e) => cuotas.setEstado(e.target.value as '' | EstadoCuota)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {(Object.keys(ESTADO_CUOTA_LABELS) as EstadoCuota[]).map((key) => (
                    <option key={key} value={key}>
                      {ESTADO_CUOTA_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-tipo-cuota">
                  Tipo
                </label>
                {/* Backend: tipo=inicial | mensual. Si mensual no está soportado aún, el filtro no rompe la UI. */}
                <select
                  id="filtro-tipo-cuota"
                  value={cuotas.tipo}
                  onChange={(e) =>
                    cuotas.setTipo(e.target.value as '' | 'inicial' | 'mensual')
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Todas</option>
                  <option value="mensual">Mensuales</option>
                  <option value="inicial">Iniciales</option>
                </select>
              </div>
            </div>

            {periodoIgnored ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                El período mensual puede ocultar cuotas iniciales. Para verlas, seleccioná Tipo: Iniciales
                o limpiá el período y usá Mensuales si querés filtrar por mes.
              </p>
            ) : null}
          </div>

          <CuotasTable
            cuotas={cuotas.cuotas}
            totalCount={cuotas.totalItems}
            isRefreshing={cuotas.isRefreshing}
            actionLoadingId={cuotas.actionLoadingId}
            onMarcarPagada={(id) => void cuotas.marcarPagada(id)}
            onAnular={(id) => void cuotas.anularCuota(id)}
          />

          {cuotas.lastPage > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-md">
              <p className="text-slate-600">
                Mostrando página {cuotas.currentPage} de {cuotas.lastPage} · {cuotas.totalItems} cuotas
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={cuotas.currentPage <= 1 || cuotas.isRefreshing}
                  onClick={() => cuotas.setCurrentPage((page) => Math.max(1, page - 1))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={cuotas.currentPage >= cuotas.lastPage || cuotas.isRefreshing}
                  onClick={() => cuotas.setCurrentPage((page) => Math.min(cuotas.lastPage, page + 1))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <GenerarCuotasModal
        isOpen={cuotas.isGenerarOpen}
        onClose={() => cuotas.setIsGenerarOpen(false)}
        onConfirm={cuotas.generarCuotas}
      />
    </div>
  )
}
