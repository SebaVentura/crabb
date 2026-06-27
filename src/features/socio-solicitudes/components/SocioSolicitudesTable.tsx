import { Badge } from '../../../components/ui/Badge'
import type { SocioSolicitud, SocioSolicitudEstado } from '../../../types/socioSolicitudes'
import { ESTADO_SOLICITUD_LABELS } from '../../../types/socioSolicitudes'

type Props = {
  items: SocioSolicitud[]
  isRefreshing: boolean
  actionLoadingId: number | null
  onVer: (id: number) => void
  onAprobar: (item: SocioSolicitud) => void
  onObservar: (item: SocioSolicitud) => void
  onRechazar: (item: SocioSolicitud) => void
}

function formatFecha(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function badgeEstado(estado: SocioSolicitudEstado) {
  if (estado === 'aprobada') return <Badge tone="green">{ESTADO_SOLICITUD_LABELS.aprobada}</Badge>
  if (estado === 'rechazada') return <Badge tone="red">{ESTADO_SOLICITUD_LABELS.rechazada}</Badge>
  if (estado === 'observada') return <Badge tone="yellow">{ESTADO_SOLICITUD_LABELS.observada}</Badge>
  return <Badge tone="blue">{ESTADO_SOLICITUD_LABELS.pendiente}</Badge>
}

function canReview(estado: SocioSolicitudEstado): boolean {
  return estado === 'pendiente' || estado === 'observada'
}

export function SocioSolicitudesTable({
  items,
  isRefreshing,
  actionLoadingId,
  onVer,
  onAprobar,
  onObservar,
  onRechazar,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-md">
        No hay solicitudes de socios para revisar.
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-md">
      {isRefreshing ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 text-sm text-slate-600">
          Actualizando…
        </div>
      ) : null}
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Solicitante</th>
            <th className="px-4 py-3 font-medium">Taller / Denominación</th>
            <th className="px-4 py-3 font-medium">DNI/CUIT</th>
            <th className="px-4 py-3 font-medium">Teléfono</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Duplicado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const busy = actionLoadingId === item.id
            const reviewable = canReview(item.estado)
            return (
              <tr key={item.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatFecha(item.fecha)}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{item.nombreApellido || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{item.denominacionTaller || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{item.dniCuit || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{item.celular || '—'}</td>
                <td className="px-4 py-3 text-slate-700">{item.email || '—'}</td>
                <td className="px-4 py-3">{badgeEstado(item.estado)}</td>
                <td className="px-4 py-3">
                  {item.posibleDuplicado ? (
                    <Badge tone="yellow">Posible</Badge>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onVer(item.id)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Ver
                    </button>
                    {reviewable ? (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onAprobar(item)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onObservar(item)}
                          className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                        >
                          Observar
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onRechazar(item)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
