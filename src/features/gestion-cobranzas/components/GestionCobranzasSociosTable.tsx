import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { LABEL_ESTADO_CUOTA, LABEL_ESTADO_ENVIO } from '../constants'
import type { SocioCobranza } from '../types'
import { formatMoneyArs } from '../utils/formatMoney'
import { formatPhone } from '../../../utils/formatPhone'

type Props = {
  members: SocioCobranza[]
  selectedIds: Set<string>
  busqueda: string
  filtroDeuda: string
  disabled: boolean
  onBusquedaChange: (value: string) => void
  onFiltroDeudaChange: (value: string) => void
  onToggle: (id: string) => void
  onSeleccionarTodos: () => void
  onDeseleccionarTodos: () => void
}

function badgeCuota(estado: SocioCobranza['estadoCuota']) {
  if (estado === 'moroso') return <Badge tone="red">{LABEL_ESTADO_CUOTA.moroso}</Badge>
  if (estado === 'vencido') return <Badge tone="yellow">{LABEL_ESTADO_CUOTA.vencido}</Badge>
  return <Badge tone="yellow">{LABEL_ESTADO_CUOTA.pendiente}</Badge>
}

function badgeEnvio(estado: SocioCobranza['estadoEnvio']) {
  if (estado === 'enviado') return <Badge tone="green">{LABEL_ESTADO_ENVIO.enviado}</Badge>
  if (estado === 'error') return <Badge tone="red">{LABEL_ESTADO_ENVIO.error}</Badge>
  if (estado === 'numero_invalido') return <Badge tone="red">{LABEL_ESTADO_ENVIO.numero_invalido}</Badge>
  if (estado === 'cancelado') return <Badge tone="gray">{LABEL_ESTADO_ENVIO.cancelado}</Badge>
  if (estado === 'pendiente_envio') return <Badge tone="blue">{LABEL_ESTADO_ENVIO.pendiente_envio}</Badge>
  return <Badge tone="gray">{LABEL_ESTADO_ENVIO.no_seleccionado}</Badge>
}

export function GestionCobranzasSociosTable({
  members,
  selectedIds,
  busqueda,
  filtroDeuda,
  disabled,
  onBusquedaChange,
  onFiltroDeudaChange,
  onToggle,
  onSeleccionarTodos,
  onDeseleccionarTodos,
}: Props) {
  const allSelected = members.length > 0 && members.every((m) => selectedIds.has(m.id))

  return (
    <Card className="border-slate-200 shadow-md" title={`Socios con deuda (${members.length})`}>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={onSeleccionarTodos}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:opacity-50"
          >
            Seleccionar todos
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDeseleccionarTodos}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:opacity-50"
          >
            Deseleccionar todos
          </button>
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 md:max-w-lg">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="buscar-cobranzas">
              Buscar socio
            </label>
            <input
              id="buscar-cobranzas"
              type="search"
              value={busqueda}
              disabled={disabled}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Nombre o apellido"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-deuda">
              Estado de deuda
            </label>
            <select
              id="filtro-deuda"
              value={filtroDeuda}
              disabled={disabled}
              onChange={(e) => onFiltroDeudaChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
            >
              <option value="">Todos</option>
              <option value="moroso">Moroso</option>
              <option value="vencido">Vencido</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-3 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  disabled={disabled || members.length === 0}
                  onChange={() => (allSelected ? onDeseleccionarTodos() : onSeleccionarTodos())}
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="pb-2 pr-3 font-medium">Socio</th>
              <th className="pb-2 pr-3 font-medium">Teléfono</th>
              <th className="pb-2 pr-3 font-medium">Estado de cuota</th>
              <th className="pb-2 pr-3 font-medium">Mes adeudado</th>
              <th className="pb-2 pr-3 font-medium">Importe</th>
              <th className="pb-2 font-medium">Estado del envío</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-600">
                  No hay socios que coincidan con los filtros.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                  <td className="py-3 pr-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(m.id)}
                      disabled={disabled}
                      onChange={() => onToggle(m.id)}
                      aria-label={`Seleccionar ${m.nombre}`}
                    />
                  </td>
                  <td className="py-3 pr-3 font-medium text-slate-900">{m.nombre}</td>
                  <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatPhone(m.telefono)}</td>
                  <td className="py-3 pr-3">{badgeCuota(m.estadoCuota)}</td>
                  <td className="py-3 pr-3 text-slate-700">{m.mesAdeudado}</td>
                  <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatMoneyArs(m.importeAdeudado)}</td>
                  <td className="py-3">{badgeEnvio(m.estadoEnvio)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
