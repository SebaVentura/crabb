import type { CampaniaCobranza, CampaniaCobranzaId } from '../types'

type Props = {
  campanias: CampaniaCobranza[]
  selectedId: CampaniaCobranzaId
  disabled?: boolean
  onSelect: (id: CampaniaCobranzaId) => void
}

function isTemplateAprobado(campania: CampaniaCobranza): boolean {
  return campania.realSendEnabled === true || Boolean(campania.templateId)
}

export function CobranzasTemplateSelect({ campanias, selectedId, disabled, onSelect }: Props) {
  const selected = campanias.find((c) => c.id === selectedId) ?? campanias[0]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">1. Template de mensaje</h2>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="cobranzas-campania">
            Campaña
          </label>
          <select
            id="cobranzas-campania"
            value={selectedId}
            disabled={disabled}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
          >
            {campanias.map((campania) => (
              <option key={campania.id} value={campania.id}>
                {campania.label}
              </option>
            ))}
          </select>
        </div>

        {selected ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              {isTemplateAprobado(selected) ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-800">
                  Template aprobado
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                  Solo simulación
                </span>
              )}
              {selected.provider ? (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                  Provider: {selected.provider}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-slate-600">{selected.descripcion}</p>
            {selected.templateId ? (
              <p className="mt-1 text-xs text-slate-500">ID: {selected.templateId}</p>
            ) : null}
            {selected.requiredVariables && selected.requiredVariables.length > 0 ? (
              <p className="mt-1 text-xs text-slate-500">
                Variables: {selected.requiredVariables.join(', ')}
              </p>
            ) : null}
            {selected.disabledReason ? (
              <p className="mt-2 text-xs text-amber-800">{selected.disabledReason}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
