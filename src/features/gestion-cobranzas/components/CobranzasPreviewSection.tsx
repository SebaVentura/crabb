import type { CollectionMessagePreviewResult } from '../../../types/collectionsMessages'
import type { CampaniaCobranza, SocioCobranza } from '../types'

type Props = {
  campania: CampaniaCobranza
  socio: SocioCobranza | null
  socioFueraDeFiltro?: boolean
  previewText: string | null
  messagePreview: CollectionMessagePreviewResult | null
  isLoading: boolean
  error: string | null
  esSimulacion: boolean
}

export function CobranzasPreviewSection({
  campania,
  socio,
  socioFueraDeFiltro = false,
  previewText,
  messagePreview,
  isLoading,
  error,
  esSimulacion,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">3. Vista previa</h2>
      <p className="mt-2 text-sm text-slate-600">
        El envío real usa templates aprobados por Zavu. La vista previa muestra cómo se completan las variables para el
        socio seleccionado.
      </p>

      {!socio ? (
        <p className="mt-4 text-sm text-slate-500">Seleccioná un socio para ver la vista previa.</p>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Socio:</span> {socio.nombre}
            {socio.taller ? ` · ${socio.taller}` : ''}
          </p>
          {socioFueraDeFiltro ? (
            <p className="text-xs text-amber-800">
              Este socio sigue seleccionado para el envío aunque no coincida con el filtro de búsqueda
              actual.
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-slate-500">Cargando vista previa…</p>
          ) : error ? (
            <p className="text-sm text-rose-700">{error}</p>
          ) : previewText ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-sm leading-relaxed text-slate-800">
              {previewText}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No hay vista previa disponible.</p>
          )}

          {!esSimulacion && messagePreview?.realTemplate.templateId ? (
            <details className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <summary className="cursor-pointer font-medium text-slate-700">Detalle del template</summary>
              <ul className="mt-2 space-y-1">
                <li>Template: {messagePreview.realTemplate.templateId}</li>
                <li>Provider: {campania.provider ?? '—'}</li>
                {Object.entries(messagePreview.realTemplate.templateVariables).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          {esSimulacion ? (
            <details className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <summary className="cursor-pointer font-medium text-slate-700">Texto de simulación de campaña</summary>
              <p className="mt-2 whitespace-pre-wrap">{campania.template}</p>
            </details>
          ) : null}
        </div>
      )}
    </section>
  )
}
