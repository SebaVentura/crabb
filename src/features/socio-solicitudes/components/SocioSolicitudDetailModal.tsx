import { Badge } from '../../../components/ui/Badge'
import type { SocioSolicitudDetail, SocioSolicitudEstado } from '../../../types/socioSolicitudes'
import { ESTADO_SOLICITUD_LABELS } from '../../../types/socioSolicitudes'

type Props = {
  isOpen: boolean
  detail: SocioSolicitudDetail | null
  isLoading: boolean
  error: string | null
  actionLoadingId: number | null
  onClose: () => void
  onAprobar: () => void
  onObservar: () => void
  onRechazar: () => void
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

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800">{value?.trim() ? value : '—'}</dd>
    </div>
  )
}

export function SocioSolicitudDetailModal({
  isOpen,
  detail,
  isLoading,
  error,
  actionLoadingId,
  onClose,
  onAprobar,
  onObservar,
  onRechazar,
}: Props) {
  if (!isOpen) return null

  const busy = detail ? actionLoadingId === detail.id : false
  const reviewable = detail ? canReview(detail.estado) : false

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 className="text-lg font-semibold text-slate-900">Detalle de solicitud</h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {isLoading ? <p className="text-sm text-slate-600">Cargando detalle…</p> : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}

          {detail && !isLoading ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {badgeEstado(detail.estado)}
                {detail.posibleDuplicado ? <Badge tone="yellow">Posible duplicado</Badge> : null}
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Nombre y apellido" value={detail.nombreApellido} />
                <DetailRow label="Taller / Denominación" value={detail.denominacionTaller} />
                <DetailRow label="DNI/CUIT" value={detail.dniCuit} />
                <DetailRow label="Email" value={detail.email} />
                <DetailRow label="Teléfono" value={detail.celular} />
                <DetailRow label="Dirección" value={detail.direccion} />
                <DetailRow label="Localidad" value={detail.localidad} />
                <DetailRow label="Rubro" value={detail.rubro} />
                <DetailRow label="Observaciones del solicitante" value={detail.observaciones} />
                <DetailRow label="Notas administrativas" value={detail.adminNotes} />
                <DetailRow label="Motivo de rechazo" value={detail.rejectionReason} />
                <DetailRow
                  label="Socio vinculado"
                  value={detail.socioId ? `ID ${detail.socioId}` : null}
                />
              </dl>

              {detail.duplicados.length > 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-semibold text-amber-900">Posibles duplicados</p>
                  <ul className="mt-2 space-y-2 text-sm text-amber-900">
                    {detail.duplicados.map((dup, index) => (
                      <li key={`${dup.id ?? index}`}>
                        {dup.nombreApellido ?? 'Socio'}
                        {dup.dniCuit ? ` · ${dup.dniCuit}` : ''}
                        {dup.denominacionTaller ? ` · ${dup.denominacionTaller}` : ''}
                        {dup.motivo ? ` — ${dup.motivo}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {detail && reviewable ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-4 py-3 sm:px-5">
            <button
              type="button"
              disabled={busy}
              onClick={onAprobar}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
            >
              Aprobar
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onObservar}
              className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
            >
              Observar
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onRechazar}
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
            >
              Rechazar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
