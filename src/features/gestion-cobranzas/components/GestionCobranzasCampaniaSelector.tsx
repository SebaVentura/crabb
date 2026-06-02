import type { CampaniaCobranza, CampaniaCobranzaId } from '../types'

type Props = {
  campanias: CampaniaCobranza[]
  selectedId: CampaniaCobranzaId
  disabled?: boolean
  onSelect: (id: CampaniaCobranzaId) => void
}

export function GestionCobranzasCampaniaSelector({ campanias, selectedId, disabled, onSelect }: Props) {
  return (
    <section aria-labelledby="campania-cobranza-title">
      <h2 id="campania-cobranza-title" className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Campaña de cobranza
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {campanias.map((campania) => {
          const selected = campania.id === selectedId
          return (
            <button
              key={campania.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(campania.id)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-slate-900">{campania.label}</p>
                {selected ? (
                  <span className="shrink-0 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Seleccionada
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-slate-600">{campania.descripcion}</p>
              <p className="mt-2 text-xs text-slate-500">Tono: {campania.tono}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
