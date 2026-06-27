import { ADVERTENCIA_CONFIRMACION } from '../constants'
import { Card } from '../../../components/ui/Card'
import type {
  CollectionMessagePreviewResult,
  CollectionSendSelectedResult,
} from '../../../types/collectionsMessages'
import type { CampaniaCobranza } from '../types'
import { GestionCobranzasDryRunPanel } from './GestionCobranzasDryRunPanel'
import { GestionCobranzasMensajePreview } from './GestionCobranzasMensajePreview'

type Props = {
  campania: CampaniaCobranza
  seleccionados: number
  validos: number
  invalidos: number
  intervalMs: number
  ejemploPreview: string | null
  messagePreview?: CollectionMessagePreviewResult | null
  puedeConfirmar: boolean
  realSendEnabled: boolean
  isSending: boolean
  isDryRunLoading: boolean
  dryRunError: string | null
  dryRunResult: CollectionSendSelectedResult | null
  onValidarDryRun: () => void
  onConfirmar: () => void
  onVolver: () => void
}

export function GestionCobranzasConfirmacionPanel({
  campania,
  seleccionados,
  validos,
  invalidos,
  intervalMs,
  ejemploPreview,
  messagePreview,
  puedeConfirmar,
  realSendEnabled,
  isSending,
  isDryRunLoading,
  dryRunError,
  dryRunResult,
  onValidarDryRun,
  onConfirmar,
  onVolver,
}: Props) {
  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50/50 shadow-md" title="Confirmar envío simulado">
        <div className="space-y-3 text-sm text-slate-700">
          <p>{ADVERTENCIA_CONFIRMACION}</p>
          {!realSendEnabled ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
              El envío real por WhatsApp está deshabilitado para esta campaña. Solo podés continuar con la simulación local.
            </p>
          ) : null}
          <div className="rounded-xl border border-amber-100 bg-white/80 p-3">
            <p className="font-medium text-slate-900">Campaña seleccionada: {campania.label}</p>
            <p className="mt-1 text-slate-600">{campania.descripcion}</p>
          </div>
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
            Confirmar y comenzar envío simulado
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

      <GestionCobranzasDryRunPanel
        result={dryRunResult}
        isLoading={isDryRunLoading}
        error={dryRunError}
        realSendEnabled={realSendEnabled}
        disabled={seleccionados === 0 || isSending}
        onValidar={onValidarDryRun}
      />

      <GestionCobranzasMensajePreview
        campania={campania}
        ejemploRenderizado={ejemploPreview}
        messagePreview={messagePreview}
        previewEsLocal={!realSendEnabled}
      />
    </div>
  )
}
