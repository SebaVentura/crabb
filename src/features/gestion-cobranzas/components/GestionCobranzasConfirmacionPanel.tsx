import { ADVERTENCIA_CONFIRMACION } from '../constants'
import { Card } from '../../../components/ui/Card'
import { GestionCobranzasMensajePreview } from './GestionCobranzasMensajePreview'

type Props = {
  seleccionados: number
  validos: number
  invalidos: number
  intervalMs: number
  ejemploPreview: string | null
  puedeConfirmar: boolean
  isSending: boolean
  onConfirmar: () => void
  onVolver: () => void
}

export function GestionCobranzasConfirmacionPanel({
  seleccionados,
  validos,
  invalidos,
  intervalMs,
  ejemploPreview,
  puedeConfirmar,
  isSending,
  onConfirmar,
  onVolver,
}: Props) {
  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50/50 shadow-md" title="Confirmar envío simulado">
        <div className="space-y-3 text-sm text-slate-700">
          <p>{ADVERTENCIA_CONFIRMACION}</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Socios seleccionados: {seleccionados}</li>
            <li>Teléfonos válidos: {validos}</li>
            <li>Teléfonos faltantes o inválidos: {invalidos}</li>
            <li>Intervalo entre mensajes simulados: {(intervalMs / 1000).toLocaleString('es-AR')} segundos</li>
          </ul>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!puedeConfirmar || isSending}
            onClick={onConfirmar}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Confirmar y comenzar envío
          </button>
          <button
            type="button"
            disabled={isSending}
            onClick={onVolver}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:opacity-50"
          >
            Volver
          </button>
        </div>
        {!puedeConfirmar ? (
          <p className="mt-3 text-sm text-rose-700">No hay teléfonos válidos entre los socios seleccionados.</p>
        ) : null}
      </Card>
      <GestionCobranzasMensajePreview ejemploRenderizado={ejemploPreview} />
    </div>
  )
}
