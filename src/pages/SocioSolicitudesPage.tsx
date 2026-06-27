import { useMemo, useState } from 'react'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SocioSolicitudActionModal, type ActionModalMode } from '../features/socio-solicitudes/components/SocioSolicitudActionModal'
import { SocioSolicitudDetailModal } from '../features/socio-solicitudes/components/SocioSolicitudDetailModal'
import { SocioSolicitudesSummaryCards } from '../features/socio-solicitudes/components/SocioSolicitudesSummaryCards'
import { SocioSolicitudesTable } from '../features/socio-solicitudes/components/SocioSolicitudesTable'
import { useSocioSolicitudesAdmin } from '../features/socio-solicitudes/hooks/useSocioSolicitudesAdmin'
import type { SocioSolicitud, SocioSolicitudEstado } from '../types/socioSolicitudes'

const ESTADOS: Array<{ value: SocioSolicitudEstado | 'todas'; label: string }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'observada', label: 'Observadas' },
  { value: 'aprobada', label: 'Aprobadas' },
  { value: 'rechazada', label: 'Rechazadas' },
]

export function SocioSolicitudesPage() {
  const admin = useSocioSolicitudesAdmin()
  const [actionMode, setActionMode] = useState<ActionModalMode>(null)
  const [actionTarget, setActionTarget] = useState<SocioSolicitud | null>(null)

  const contextualEmpty = useMemo(() => {
    if (admin.appliedFilters.estado === 'pendiente' && admin.summary.pendientes === 0) {
      return 'No hay solicitudes pendientes.'
    }
    return null
  }, [admin.appliedFilters.estado, admin.summary.pendientes])

  const openAction = (mode: ActionModalMode, item: SocioSolicitud) => {
    setActionTarget(item)
    setActionMode(mode)
  }

  const closeAction = () => {
    setActionMode(null)
    setActionTarget(null)
  }

  const actionSaving = actionTarget ? admin.actionLoadingId === actionTarget.id : false

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Solicitudes de socios"
        subtitle="Revisión de altas y pedidos de asociación antes de incorporarlos al padrón oficial."
      />

      {admin.loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {admin.loadError}
        </div>
      ) : null}

      {admin.successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          {admin.successMessage}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => admin.setSuccessMessage(null)}
          >
            Cerrar
          </button>
        </div>
      ) : null}

      {admin.actionError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {admin.actionError}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => admin.setActionError(null)}
          >
            Cerrar
          </button>
        </div>
      ) : null}

      {admin.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-md">
          Cargando solicitudes de socios…
        </div>
      ) : (
        <>
          <SocioSolicitudesSummaryCards summary={admin.summary} />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
            <div className="grid gap-3 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-buscar-solicitudes">
                  Buscar
                </label>
                <input
                  id="filtro-buscar-solicitudes"
                  type="search"
                  value={admin.draftFilters.search}
                  onChange={(e) =>
                    admin.setDraftFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Nombre, taller, DNI/CUIT, email o teléfono…"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-estado-solicitudes">
                  Estado
                </label>
                <select
                  id="filtro-estado-solicitudes"
                  value={admin.draftFilters.estado}
                  onChange={(e) =>
                    admin.setDraftFilters((prev) => ({
                      ...prev,
                      estado: e.target.value as SocioSolicitudEstado | 'todas',
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  {ESTADOS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-desde">
                    Desde
                  </label>
                  <input
                    id="filtro-desde"
                    type="date"
                    value={admin.draftFilters.dateFrom}
                    onChange={(e) =>
                      admin.setDraftFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-hasta">
                    Hasta
                  </label>
                  <input
                    id="filtro-hasta"
                    type="date"
                    value={admin.draftFilters.dateTo}
                    onChange={(e) =>
                      admin.setDraftFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={admin.buscar}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={admin.limpiarFiltros}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {contextualEmpty && admin.items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-md">
              {contextualEmpty}
            </div>
          ) : (
            <SocioSolicitudesTable
              items={admin.items}
              isRefreshing={admin.isRefreshing}
              actionLoadingId={admin.actionLoadingId}
              onVer={admin.openDetail}
              onAprobar={(item) => openAction('approve', item)}
              onObservar={(item) => openAction('observe', item)}
              onRechazar={(item) => openAction('reject', item)}
            />
          )}

          {admin.pagination.total > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-md">
              <p className="text-slate-600">
                Mostrando página {admin.pagination.page} de {admin.pagination.lastPage} ·{' '}
                {admin.pagination.total} solicitudes
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={admin.pagination.page <= 1 || admin.isRefreshing}
                  onClick={() => admin.goToPage(Math.max(1, admin.pagination.page - 1))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={admin.pagination.page >= admin.pagination.lastPage || admin.isRefreshing}
                  onClick={() =>
                    admin.goToPage(Math.min(admin.pagination.lastPage, admin.pagination.page + 1))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <SocioSolicitudDetailModal
        isOpen={admin.detailId !== null}
        detail={admin.detail}
        isLoading={admin.isDetailLoading}
        error={admin.detailError}
        actionLoadingId={admin.actionLoadingId}
        onClose={admin.closeDetail}
        onAprobar={() => admin.detail && openAction('approve', admin.detail)}
        onObservar={() => admin.detail && openAction('observe', admin.detail)}
        onRechazar={() => admin.detail && openAction('reject', admin.detail)}
      />

      <SocioSolicitudActionModal
        key={`${actionMode ?? 'none'}-${actionTarget?.id ?? 'none'}`}
        mode={actionMode}
        solicitud={actionTarget}
        isSaving={actionSaving}
        onClose={closeAction}
        onApprove={async (notes) => {
          if (!actionTarget) return false
          const ok = await admin.approve(actionTarget.id, notes)
          if (ok) {
            admin.setSuccessMessage(
              'Solicitud aprobada. El socio ya puede activar su cuenta desde Registro de socio.',
            )
          }
          return ok
        }}
        onReject={async ({ reason, adminNotes }) => {
          if (!actionTarget) return false
          return admin.reject(actionTarget.id, { reason, adminNotes })
        }}
        onObserve={async (notes) => {
          if (!actionTarget) return false
          return admin.observe(actionTarget.id, notes)
        }}
      />
    </div>
  )
}
