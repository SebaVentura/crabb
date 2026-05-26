import { RUBROS_SOCIO, type RubroSocio } from '../../constants/rubros'
import type { FiltrosBusquedaColegas as FiltrosBusquedaColegasType } from '../../types/colegas'

type Props = {
  filtros: FiltrosBusquedaColegasType
  onChange: (filtros: FiltrosBusquedaColegasType) => void
}

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'

export function FiltrosBusquedaColegas({ filtros, onChange }: Props) {
  const set = (partial: Partial<FiltrosBusquedaColegasType>) => onChange({ ...filtros, ...partial })

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Ajustá los criterios para filtrar colegas por rubro, nombre, localidad o teléfono.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-rubro-colega">
            Rubro
          </label>
          <select
            id="filtro-rubro-colega"
            value={filtros.rubro}
            onChange={(ev) => set({ rubro: ev.target.value as RubroSocio | '' })}
            className={inputClass}
          >
            <option value="">Todos (según criterio de rubro)</option>
            {RUBROS_SOCIO.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-nombre-colega">
            Nombre / razón social
          </label>
          <input
            id="filtro-nombre-colega"
            type="search"
            value={filtros.nombre}
            onChange={(ev) => set({ nombre: ev.target.value })}
            placeholder="Ej. Mecánica, Gomería..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-localidad-colega">
            Localidad o zona
          </label>
          <input
            id="filtro-localidad-colega"
            type="search"
            value={filtros.localidad}
            onChange={(ev) => set({ localidad: ev.target.value })}
            placeholder="Ej. Bahía Blanca, Punta Alta..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-telefono-colega">
            Teléfono
          </label>
          <input
            id="filtro-telefono-colega"
            type="search"
            value={filtros.telefono}
            onChange={(ev) => set({ telefono: ev.target.value })}
            placeholder="Ej. 0291, 411..."
            className={inputClass}
            inputMode="tel"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
        <input
          type="checkbox"
          checked={filtros.incluirMiRubro}
          onChange={(ev) => set({ incluirMiRubro: ev.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
        />
        <span className="text-sm text-slate-700">
          <span className="font-medium text-slate-900">Incluir mi rubro / ver todos los rubros</span>
          <span className="mt-0.5 block text-slate-600">Al activarlo no se aplica exclusión por rubro.</span>
        </span>
      </label>
    </div>
  )
}
