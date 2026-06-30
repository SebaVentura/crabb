import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import type { CuotaSocio, EstadoCuota } from '../../../types/cuotas'
import { ESTADO_CUOTA_LABELS } from '../../../types/cuotas'
import { formatMoneyArs } from '../../gestion-cobranzas/utils/formatMoney'
import { formatPhone } from '../../../utils/formatPhone'

type Props = {
  cuotas: CuotaSocio[]
  totalCount?: number
  isRefreshing: boolean
  actionLoadingId: string | null
  onMarcarPagada: (id: string) => void
  onAnular: (id: string) => void
}

function badgeEstado(estado: EstadoCuota) {
  if (estado === 'pagada') return <Badge tone="green">{ESTADO_CUOTA_LABELS.pagada}</Badge>
  if (estado === 'vencida') return <Badge tone="yellow">{ESTADO_CUOTA_LABELS.vencida}</Badge>
  if (estado === 'anulada') return <Badge tone="gray">{ESTADO_CUOTA_LABELS.anulada}</Badge>
  return <Badge tone="blue">{ESTADO_CUOTA_LABELS.pendiente}</Badge>
}

function formatFecha(value: string) {
  if (!value) return '-'
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-AR')
}

function formatPeriodo(periodo: string, esInicial: boolean) {
  if (!periodo) return '—'
  if (esInicial || /^inicial-\d{2}$/i.test(periodo)) return periodo
  const match = periodo.match(/^(\d{4})-(\d{2})$/)
  if (!match) return periodo
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1)
  if (Number.isNaN(date.getTime())) return periodo
  return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

function isCuotaInicial(cuota: CuotaSocio): boolean {
  const tipo = cuota.tipo?.trim().toLowerCase() ?? ''
  return tipo === 'inicial'
}

export function CuotasTable({
  cuotas,
  totalCount,
  isRefreshing,
  actionLoadingId,
  onMarcarPagada,
  onAnular,
}: Props) {
  const countLabel = totalCount && totalCount > cuotas.length ? totalCount : cuotas.length

  return (
    <Card className="border-slate-200 shadow-md" title={`Cuotas (${countLabel})`}>
      <div className="relative overflow-x-auto">
        {isRefreshing ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 text-sm text-slate-600">
            Actualizando…
          </div>
        ) : null}

        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-3 font-medium">Socio</th>
              <th className="pb-2 pr-3 font-medium">Taller</th>
              <th className="pb-2 pr-3 font-medium">Teléfono</th>
              <th className="pb-2 pr-3 font-medium">Período</th>
              <th className="pb-2 pr-3 font-medium">Concepto</th>
              <th className="pb-2 pr-3 font-medium">Importe</th>
              <th className="pb-2 pr-3 font-medium">Vencimiento</th>
              <th className="pb-2 pr-3 font-medium">Estado</th>
              <th className="pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-600">
                  No hay cuotas que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              cuotas.map((cuota) => {
                const esInicial = isCuotaInicial(cuota)
                const isRowLoading = actionLoadingId === cuota.id
                const canAct = cuota.estado === 'pendiente' || cuota.estado === 'vencida'

                return (
                  <tr key={cuota.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                    <td className="py-3 pr-3 font-medium text-slate-900">{cuota.nombreSocio || '-'}</td>
                    <td className="py-3 pr-3 text-slate-700">{cuota.denominacionTaller || '-'}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatPhone(cuota.telefono)}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">
                      {formatPeriodo(cuota.periodo, esInicial)}
                    </td>
                    <td className="py-3 pr-3 text-slate-700">
                      <span>{cuota.concepto || '—'}</span>
                      {esInicial ? (
                        <span className="ml-2 inline-flex">
                          <Badge tone="blue">Inicial</Badge>
                        </span>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatMoneyArs(cuota.importe)}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatFecha(cuota.fechaVencimiento)}</td>
                    <td className="py-3 pr-3">{badgeEstado(cuota.estado)}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={!canAct || isRowLoading}
                          onClick={() => onMarcarPagada(cuota.id)}
                          className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition duration-150 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRowLoading ? 'Procesando…' : 'Marcar pagada'}
                        </button>
                        <button
                          type="button"
                          disabled={!canAct || isRowLoading}
                          onClick={() => onAnular(cuota.id)}
                          className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition duration-150 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Anular
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
