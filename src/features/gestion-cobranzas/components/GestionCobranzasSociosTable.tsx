import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { LABEL_ESTADO_CUOTA, LABEL_ESTADO_ENVIO } from '../constants'
import type { SocioCobranza } from '../types'
import { formatMoneyArs } from '../utils/formatMoney'
import { hasValidWhatsappPhone } from '../utils/phoneUtils'

const PAGE_SIZE = 25

export type FiltroDestinatarios = 'todos' | 'con_telefono' | 'sin_telefono' | 'seleccionados'

type Props = {
  members: SocioCobranza[]
  selectedIds: Set<string>
  busqueda: string
  filtroDeuda: string
  filtroDestinatarios: FiltroDestinatarios
  disabled: boolean
  isSearching?: boolean
  searchError?: string | null
  onBusquedaChange: (value: string) => void
  onFiltroDeudaChange: (value: string) => void
  onFiltroDestinatariosChange: (value: FiltroDestinatarios) => void
  onToggle: (id: string) => void
  onSeleccionarPagina: (pageMembers: SocioCobranza[]) => void
  onDeseleccionarPagina: (pageMembers: SocioCobranza[]) => void
  onSeleccionarTodosFiltrados: (filteredValidMembers: SocioCobranza[]) => void
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
  if (estado === 'sin_telefono_valido') return <Badge tone="red">{LABEL_ESTADO_ENVIO.sin_telefono_valido}</Badge>
  if (estado === 'enviando') return <Badge tone="blue">{LABEL_ESTADO_ENVIO.enviando}</Badge>
  if (estado === 'seleccionado') return <Badge tone="blue">{LABEL_ESTADO_ENVIO.seleccionado}</Badge>
  return <Badge tone="gray">{LABEL_ESTADO_ENVIO.sin_enviar}</Badge>
}

function filterMembers(members: SocioCobranza[], filtro: FiltroDestinatarios, selectedIds: Set<string>) {
  return members.filter((member) => {
    const phone = hasValidWhatsappPhone(member.telefono)
    if (filtro === 'con_telefono') return phone.valido
    if (filtro === 'sin_telefono') return !phone.valido
    if (filtro === 'seleccionados') return selectedIds.has(member.id)
    return true
  })
}

export function GestionCobranzasSociosTable({
  members,
  selectedIds,
  busqueda,
  filtroDeuda,
  filtroDestinatarios,
  disabled,
  isSearching = false,
  searchError = null,
  onBusquedaChange,
  onFiltroDeudaChange,
  onFiltroDestinatariosChange,
  onToggle,
  onSeleccionarPagina,
  onDeseleccionarPagina,
  onSeleccionarTodosFiltrados,
  onDeseleccionarTodos,
}: Props) {
  const [page, setPage] = useState(1)

  const filteredMembers = useMemo(
    () => filterMembers(members, filtroDestinatarios, selectedIds),
    [members, filtroDestinatarios, selectedIds],
  )

  useEffect(() => {
    setPage(1)
  }, [busqueda, filtroDeuda, filtroDestinatarios, members.length])

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const pageMembers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredMembers.slice(start, start + PAGE_SIZE)
  }, [filteredMembers, safePage])

  const pageValidMembers = pageMembers.filter((m) => hasValidWhatsappPhone(m.telefono).valido)
  const allPageValidSelected =
    pageValidMembers.length > 0 && pageValidMembers.every((member) => selectedIds.has(member.id))

  const rangeStart = filteredMembers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeEnd = filteredMembers.length === 0 ? 0 : Math.min(safePage * PAGE_SIZE, filteredMembers.length)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Card className="border-0 shadow-none" title={`2. Destinatarios (${members.length} con deuda)`}>
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || pageValidMembers.length === 0}
              onClick={() =>
                allPageValidSelected
                  ? onDeseleccionarPagina(pageMembers)
                  : onSeleccionarPagina(pageValidMembers)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {allPageValidSelected ? 'Deseleccionar página' : 'Seleccionar página (con teléfono)'}
            </button>
            <button
              type="button"
              disabled={disabled || filteredMembers.length === 0}
              onClick={() =>
                onSeleccionarTodosFiltrados(
                  filteredMembers.filter((m) => hasValidWhatsappPhone(m.telefono).valido),
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Seleccionar filtrados con teléfono
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onDeseleccionarTodos}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Deseleccionar todos
            </button>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="buscar-cobranzas">
                Buscar
              </label>
              <input
                id="buscar-cobranzas"
                type="search"
                value={busqueda}
                disabled={disabled}
                onChange={(e) => onBusquedaChange(e.target.value)}
                placeholder="Nombre, taller, teléfono…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-deuda">
                Deuda
              </label>
              <select
                id="filtro-deuda"
                value={filtroDeuda}
                disabled={disabled}
                onChange={(e) => onFiltroDeudaChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              >
                <option value="">Todos</option>
                <option value="moroso">Moroso</option>
                <option value="vencido">Vencido</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-destinatarios">
                Mostrar
              </label>
              <select
                id="filtro-destinatarios"
                value={filtroDestinatarios}
                disabled={disabled}
                onChange={(e) => onFiltroDestinatariosChange(e.target.value as FiltroDestinatarios)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              >
                <option value="todos">Todos</option>
                <option value="con_telefono">Con teléfono válido</option>
                <option value="sin_telefono">Sin teléfono</option>
                <option value="seleccionados">Seleccionados</option>
              </select>
            </div>
          </div>
        </div>

        {searchError ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {searchError}
          </div>
        ) : null}

        <div className="relative overflow-x-auto">
          {isSearching ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/70 text-sm text-slate-600">
              Buscando…
            </div>
          ) : null}
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-3 font-medium" />
                <th className="pb-2 pr-3 font-medium">Socio</th>
                <th className="pb-2 pr-3 font-medium">Teléfono</th>
                <th className="pb-2 pr-3 font-medium">Cuota</th>
                <th className="pb-2 pr-3 font-medium">Mes</th>
                <th className="pb-2 pr-3 font-medium">Importe</th>
                <th className="pb-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pageMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-600">
                    No hay socios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                pageMembers.map((m) => {
                  const phone = hasValidWhatsappPhone(m.telefono)
                  const canSelect = phone.valido && !disabled
                  return (
                    <tr key={m.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(m.id)}
                          disabled={!canSelect}
                          onChange={() => onToggle(m.id)}
                          aria-label={`Seleccionar ${m.nombre}`}
                          title={!phone.valido ? 'Sin teléfono válido' : undefined}
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-slate-900">{m.nombre}</p>
                        {m.taller ? <p className="text-xs text-slate-500">{m.taller}</p> : null}
                      </td>
                      <td className="py-3 pr-3 text-slate-700">
                        {phone.display}
                        {phone.ambiguo ? (
                          <p className="text-xs text-amber-700">Varios números detectados</p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-3">{badgeCuota(m.estadoCuota)}</td>
                      <td className="py-3 pr-3 text-slate-700">{m.mesAdeudado}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">
                        {formatMoneyArs(m.importeAdeudado)}
                      </td>
                      <td className="py-3">
                        {badgeEnvio(m.estadoEnvio)}
                        {m.errorEnvio ? <p className="mt-1 text-xs text-rose-600">{m.errorEnvio}</p> : null}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Mostrando {rangeStart}-{rangeEnd} de {filteredMembers.length} socios
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={disabled || safePage <= 1}
                onClick={() => setPage((c) => Math.max(1, c - 1))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página {safePage} de {totalPages}
              </span>
              <button
                type="button"
                disabled={disabled || safePage >= totalPages}
                onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        ) : null}
      </Card>
    </section>
  )
}
