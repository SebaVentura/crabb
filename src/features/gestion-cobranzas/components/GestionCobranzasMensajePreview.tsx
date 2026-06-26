import { Card } from '../../../components/ui/Card'
import type { CollectionMessagePreviewResult } from '../../../types/collectionsMessages'
import type { CampaniaCobranza } from '../types'

type Props = {
  campania: CampaniaCobranza
  ejemploRenderizado: string | null
  messagePreview?: CollectionMessagePreviewResult | null
  isPreviewLoading?: boolean
  previewError?: string | null
}

export function GestionCobranzasMensajePreview({
  campania,
  ejemploRenderizado,
  messagePreview,
  isPreviewLoading,
  previewError,
}: Props) {
  const templateVariables = messagePreview?.realTemplate.templateVariables ?? {}
  const variableEntries = Object.entries(templateVariables)

  return (
    <Card className="border-slate-200 shadow-md" title="Vista previa del mensaje">
      <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">{campania.label}</p>
        <p className="mt-1 text-slate-600">{campania.descripcion}</p>
      </div>

      <p className="mb-4 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm text-blue-900">
        El envío real por WhatsApp usa plantillas aprobadas, no el texto libre editable.
      </p>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Texto editable (simulación)
          </p>
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{campania.template}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Ejemplo simulado</p>
          {isPreviewLoading ? (
            <p className="text-sm text-slate-500">Cargando vista previa…</p>
          ) : previewError ? (
            <p className="text-sm text-rose-700">{previewError}</p>
          ) : ejemploRenderizado ? (
            <p className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm text-slate-800">{ejemploRenderizado}</p>
          ) : (
            <p className="text-sm text-slate-500">Seleccioná al menos un socio para ver un ejemplo.</p>
          )}
        </div>

        {messagePreview ? (
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Template real (API)</p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="font-medium">Template ID:</span>{' '}
                {messagePreview.realTemplate.templateId || '—'}
              </li>
              <li>
                <span className="font-medium">Envío real habilitado:</span>{' '}
                {messagePreview.enabled ? 'Sí' : 'No'}
              </li>
            </ul>
            {variableEntries.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Variables del template</p>
                <ul className="mt-1 space-y-1">
                  {variableEntries.map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
