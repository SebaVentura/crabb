import { Card } from '../../../components/ui/Card'
import type { ResumenCampana, SendProgress, SocioCobranza } from '../types'

type Props = {
  campaniaLabel: string
  progress: SendProgress
  currentMember: SocioCobranza | null
  nextSendInMs: number
  isCancelled: boolean
  onCancelar: () => void
}

export function GestionCobranzasProgresoPanel({
  campaniaLabel,
  progress,
  currentMember,
  nextSendInMs,
  isCancelled,
  onCancelar,
}: Props) {
  const pct = progress.total > 0 ? Math.round(((progress.enviados + progress.errores + progress.cancelados) / progress.total) * 100) : 0

  return (
    <Card className="border-blue-200 bg-blue-50/30 shadow-md" title="Envío en progreso">
      <div className="space-y-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Simulación de recordatorios en curso</p>
        <p>Campaña: {campaniaLabel}</p>
        {currentMember ? <p>Enviando mensaje a: {currentMember.nombre}</p> : null}
        <p>Enviados: {progress.enviados} / {progress.total}</p>
        <p>Pendientes: {progress.pendientes}</p>
        <p>Errores: {progress.errores}</p>
        <p>Cancelados: {progress.cancelados}</p>
        {nextSendInMs > 0 ? (
          <p>Próximo envío en {(nextSendInMs / 1000).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} segundos</p>
        ) : null}
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        {isCancelled ? <p className="text-amber-700">Cancelando envío…</p> : null}
      </div>
      <button
        type="button"
        onClick={onCancelar}
        disabled={isCancelled}
        className="mt-4 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition duration-150 hover:bg-rose-50 disabled:opacity-50"
      >
        Cancelar envío
      </button>
    </Card>
  )
}

export function GestionCobranzasResumenFinal({
  resumen,
  isSending,
  onVerHistorial,
  onNuevoEnvio,
}: {
  resumen: ResumenCampana
  isSending: boolean
  onVerHistorial: () => void
  onNuevoEnvio: () => void
}) {
  const fecha = new Date(resumen.fechaFin).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <Card className="border-emerald-200 bg-emerald-50/40 shadow-md" title="Resumen del envío simulado">
      <ul className="space-y-1 text-sm text-slate-700">
        <li>Campaña ejecutada: {resumen.campaniaLabel}</li>
        <li>Total seleccionados: {resumen.seleccionados}</li>
        <li>Enviados correctamente: {resumen.enviados}</li>
        <li>Con error: {resumen.errores}</li>
        <li>Cancelados: {resumen.cancelados}</li>
        <li>Teléfonos inválidos: {resumen.invalidos}</li>
        <li>Finalizado: {fecha}</li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onVerHistorial}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition duration-150 hover:bg-blue-50"
        >
          Ver historial
        </button>
        <button
          type="button"
          disabled={isSending}
          onClick={onNuevoEnvio}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Nuevo envío
        </button>
      </div>
    </Card>
  )
}
