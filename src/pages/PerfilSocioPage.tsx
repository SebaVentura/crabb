import { useMemo, useState, type ReactNode } from 'react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { calcularIndicadoresSocios, sociosMockInicial } from '../mocks/socios.mock'
import type { EstadoCuotaSocio, EstadoSocio, Socio } from '../types/socios'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function formatFecha(iso: string) {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function formatMonto(n: number) {
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

function badgeEstado(estado: EstadoSocio) {
  return estado === 'activo' ? <Badge tone="green">Activo</Badge> : <Badge tone="gray">Inactivo</Badge>
}

function badgeCuota(c: EstadoCuotaSocio) {
  if (c === 'al-dia') return <Badge tone="green">Al día</Badge>
  if (c === 'moroso') return <Badge tone="red">Moroso</Badge>
  return <Badge tone="yellow">Vencido</Badge>
}

function labelCuota(c: EstadoCuotaSocio) {
  if (c === 'al-dia') return 'Al día'
  if (c === 'moroso') return 'Moroso'
  return 'Vencido'
}

type FormDraft = {
  nombreRazonSocial: string
  cuitODni: string
  telefono: string
  email: string
  direccion: string
  localidad: string
  estado: EstadoSocio
  estadoCuota: EstadoCuotaSocio
  fechaAlta: string
  fechaUltimoPago: string
  montoCuota: string
  observaciones: string
}

function socioToDraft(s: Socio): FormDraft {
  return {
    nombreRazonSocial: s.nombreRazonSocial,
    cuitODni: s.cuitODni,
    telefono: s.telefono,
    email: s.email,
    direccion: s.direccion,
    localidad: s.localidad,
    estado: s.estado,
    estadoCuota: s.estadoCuota,
    fechaAlta: s.fechaAlta,
    fechaUltimoPago: s.fechaUltimoPago,
    montoCuota: String(s.montoCuota),
    observaciones: s.observaciones,
  }
}

function emptyDraft(): FormDraft {
  const hoy = new Date().toISOString().slice(0, 10)
  return {
    nombreRazonSocial: '',
    cuitODni: '',
    telefono: '',
    email: '',
    direccion: '',
    localidad: '',
    estado: 'activo',
    estadoCuota: 'al-dia',
    fechaAlta: hoy,
    fechaUltimoPago: hoy,
    montoCuota: '12000',
    observaciones: '',
  }
}

function validateDraft(d: FormDraft): Record<string, string> {
  const e: Record<string, string> = {}
  if (!d.nombreRazonSocial.trim()) e.nombreRazonSocial = 'Ingresá el nombre o razón social.'
  if (!d.cuitODni.trim()) e.cuitODni = 'Ingresá CUIT o DNI.'
  if (!d.email.trim()) e.email = 'Ingresá un email.'
  else if (!EMAIL_RE.test(d.email.trim())) e.email = 'Email con formato inválido.'
  const m = Number(d.montoCuota)
  if (d.montoCuota.trim() === '' || Number.isNaN(m) || m < 0) e.montoCuota = 'Monto de cuota numérico válido.'
  return e
}

function draftToSocioPartial(d: FormDraft): Omit<Socio, 'id'> {
  return {
    nombreRazonSocial: d.nombreRazonSocial.trim(),
    cuitODni: d.cuitODni.trim(),
    telefono: d.telefono.trim(),
    email: d.email.trim(),
    direccion: d.direccion.trim(),
    localidad: d.localidad.trim(),
    estado: d.estado,
    estadoCuota: d.estadoCuota,
    fechaAlta: d.fechaAlta,
    fechaUltimoPago: d.fechaUltimoPago,
    montoCuota: Number(d.montoCuota),
    observaciones: d.observaciones.trim(),
  }
}

function ModalShell({
  title,
  children,
  onClose,
  wide,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 transition duration-150 hover:bg-slate-100"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">{children}</div>
      </div>
    </div>
  )
}

function DetalleLista({ socio }: { socio: Socio }) {
  const rows: [string, string][] = [
    ['Nombre / Razón social', socio.nombreRazonSocial],
    ['CUIT / DNI', socio.cuitODni],
    ['Teléfono', socio.telefono],
    ['Email', socio.email],
    ['Dirección', socio.direccion],
    ['Localidad', socio.localidad],
    ['Estado', socio.estado === 'activo' ? 'Activo' : 'Inactivo'],
    ['Estado de cuota', labelCuota(socio.estadoCuota)],
    ['Fecha de alta', formatFecha(socio.fechaAlta)],
    ['Último pago', formatFecha(socio.fechaUltimoPago)],
    ['Monto de cuota', formatMonto(socio.montoCuota)],
    ['Observaciones', socio.observaciones || '—'],
  ]
  return (
    <dl className="space-y-3 text-sm">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="font-medium text-slate-500">{k}</dt>
          <dd className="mt-0.5 text-slate-900">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function PerfilSocioPage() {
  const [socios, setSocios] = useState<Socio[]>(() => sociosMockInicial.map((s) => ({ ...s })))
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'' | EstadoSocio>('')
  const [filtroCuota, setFiltroCuota] = useState<'' | EstadoCuotaSocio>('')

  const [detalle, setDetalle] = useState<Socio | null>(null)
  const [formMode, setFormMode] = useState<'cerrado' | 'crear' | 'editar'>('cerrado')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [draft, setDraft] = useState<FormDraft>(emptyDraft)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [bajaSocio, setBajaSocio] = useState<Socio | null>(null)

  const indicadores = useMemo(() => calcularIndicadoresSocios(socios), [socios])

  const sociosFiltrados = useMemo(() => {
    const q = norm(busqueda)
    return socios.filter((s) => {
      if (filtroEstado && s.estado !== filtroEstado) return false
      if (filtroCuota && s.estadoCuota !== filtroCuota) return false
      if (!q) return true
      const blob = norm(
        `${s.nombreRazonSocial} ${s.cuitODni} ${s.email} ${s.telefono}`.replace(/\s+/g, ' '),
      )
      return blob.includes(q)
    })
  }, [socios, busqueda, filtroEstado, filtroCuota])

  const abrirCrear = () => {
    setDraft(emptyDraft())
    setFormErrors({})
    setEditandoId(null)
    setFormMode('crear')
  }

  const abrirEditar = (s: Socio) => {
    setDraft(socioToDraft(s))
    setFormErrors({})
    setEditandoId(s.id)
    setFormMode('editar')
  }

  const cerrarForm = () => {
    setFormMode('cerrado')
    setEditandoId(null)
    setFormErrors({})
  }

  const guardarForm = () => {
    const errs = validateDraft(draft)
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return
    const data = draftToSocioPartial(draft)
    if (formMode === 'crear') {
      const nuevo: Socio = { id: crypto.randomUUID(), ...data }
      setSocios((prev) => [...prev, nuevo])
    } else if (formMode === 'editar' && editandoId) {
      setSocios((prev) => prev.map((s) => (s.id === editandoId ? { ...s, ...data } : s)))
    }
    cerrarForm()
  }

  const confirmarBaja = () => {
    if (!bajaSocio) return
    setSocios((prev) =>
      prev.map((s) => (s.id === bajaSocio.id ? { ...s, estado: 'inactivo' as const } : s)),
    )
    setBajaSocio(null)
    setDetalle((d) => (d?.id === bajaSocio.id ? { ...d, estado: 'inactivo' } : d))
  }

  const fieldClass = (err?: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 ${err ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300 bg-white'}`

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestión de Socios</h1>
        <p className="mt-1 text-sm text-slate-600 md:text-base">Administración del padrón, cuotas y estado de socios</p>
        <p className="mt-2 text-xs text-slate-500">Datos simulados · sin servidor</p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {(
          [
            ['Total socios', indicadores.totalSocios],
            ['Activos', indicadores.sociosActivos],
            ['Al día', indicadores.sociosAlDia],
            ['Con morosidad', indicadores.sociosMorosos],
            ['Pagaron este mes', indicadores.pagosAlDiaMesActual],
          ] as const
        ).map(([label, value]) => (
          <Card key={label} className="border-slate-200 shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-md" title="Acciones y búsqueda">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <button
            type="button"
            onClick={abrirCrear}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Nuevo socio
          </button>
          <div className="min-w-0 flex-1 md:max-w-md">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="buscar-socio">
              Buscar
            </label>
            <input
              id="buscar-socio"
              type="search"
              value={busqueda}
              onChange={(ev) => setBusqueda(ev.target.value)}
              placeholder="Nombre, CUIT/DNI, email o teléfono"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-estado">
                Estado
              </label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(ev) => setFiltroEstado(ev.target.value as '' | EstadoSocio)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition duration-150"
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-cuota">
                Estado de cuota
              </label>
              <select
                id="filtro-cuota"
                value={filtroCuota}
                onChange={(ev) => setFiltroCuota(ev.target.value as '' | EstadoCuotaSocio)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition duration-150"
              >
                <option value="">Todos</option>
                <option value="al-dia">Al día</option>
                <option value="moroso">Moroso</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="md:hidden space-y-3">
        {sociosFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
            No hay socios que coincidan con los filtros.
          </div>
        ) : (
          sociosFiltrados.map((s) => (
            <Card key={s.id} className="border-slate-200 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{s.nombreRazonSocial}</p>
                  <p className="text-xs text-slate-600">{s.cuitODni}</p>
                  <p className="mt-1 text-xs text-slate-600">{s.telefono}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">{badgeEstado(s.estado)}</div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">{badgeCuota(s.estadoCuota)}</div>
              <p className="mt-2 text-xs text-slate-600">Último pago: {formatFecha(s.fechaUltimoPago)}</p>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50"
                  onClick={() => setDetalle(s)}
                >
                  Ver
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 transition duration-150 hover:bg-blue-100"
                  onClick={() => abrirEditar(s)}
                >
                  Editar
                </button>
                {s.estado === 'activo' ? (
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 transition duration-150 hover:bg-rose-100"
                    onClick={() => setBajaSocio(s)}
                  >
                    Dar de baja
                  </button>
                ) : null}
              </div>
            </Card>
          ))
        )}
      </div>

      <Card className="hidden border-slate-200 shadow-md md:block" title={`Socios (${sociosFiltrados.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-3 font-medium">Socio</th>
                <th className="pb-2 pr-3 font-medium">CUIT/DNI</th>
                <th className="pb-2 pr-3 font-medium">Teléfono</th>
                <th className="pb-2 pr-3 font-medium">Estado</th>
                <th className="pb-2 pr-3 font-medium">Cuota</th>
                <th className="pb-2 pr-3 font-medium">Último pago</th>
                <th className="pb-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sociosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-600">
                    No hay socios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                sociosFiltrados.map((s) => (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                    <td className="max-w-[200px] py-3 pr-3 font-medium text-slate-900">
                      <span className="line-clamp-2">{s.nombreRazonSocial}</span>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{s.cuitODni}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{s.telefono}</td>
                    <td className="py-3 pr-3">{badgeEstado(s.estado)}</td>
                    <td className="py-3 pr-3">{badgeCuota(s.estadoCuota)}</td>
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatFecha(s.fechaUltimoPago)}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 transition duration-150 hover:bg-blue-50"
                          onClick={() => setDetalle(s)}
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-100"
                          onClick={() => abrirEditar(s)}
                        >
                          Editar
                        </button>
                        {s.estado === 'activo' ? (
                          <button
                            type="button"
                            className="rounded-md px-2 py-1 text-xs font-semibold text-rose-700 transition duration-150 hover:bg-rose-50"
                            onClick={() => setBajaSocio(s)}
                          >
                            Dar de baja
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {detalle ? (
        <ModalShell title="Detalle del socio" onClose={() => setDetalle(null)}>
          <DetalleLista socio={detalle} />
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-50"
              onClick={() => setDetalle(null)}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700"
              onClick={() => {
                const s = detalle
                setDetalle(null)
                abrirEditar(s)
              }}
            >
              Editar
            </button>
          </div>
        </ModalShell>
      ) : null}

      {formMode !== 'cerrado' ? (
        <ModalShell
          title={formMode === 'crear' ? 'Nuevo socio' : 'Editar socio'}
          onClose={cerrarForm}
          wide
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-nombre">
                Nombre / Razón social *
              </label>
              <input
                id="f-nombre"
                className={fieldClass(formErrors.nombreRazonSocial)}
                value={draft.nombreRazonSocial}
                onChange={(ev) => setDraft((d) => ({ ...d, nombreRazonSocial: ev.target.value }))}
              />
              {formErrors.nombreRazonSocial ? (
                <p className="mt-1 text-xs text-rose-600">{formErrors.nombreRazonSocial}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-cuit">
                CUIT / DNI *
              </label>
              <input
                id="f-cuit"
                className={fieldClass(formErrors.cuitODni)}
                value={draft.cuitODni}
                onChange={(ev) => setDraft((d) => ({ ...d, cuitODni: ev.target.value }))}
              />
              {formErrors.cuitODni ? <p className="mt-1 text-xs text-rose-600">{formErrors.cuitODni}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-tel">
                Teléfono
              </label>
              <input
                id="f-tel"
                className={fieldClass()}
                value={draft.telefono}
                onChange={(ev) => setDraft((d) => ({ ...d, telefono: ev.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-email">
                Email *
              </label>
              <input
                id="f-email"
                type="email"
                className={fieldClass(formErrors.email)}
                value={draft.email}
                onChange={(ev) => setDraft((d) => ({ ...d, email: ev.target.value }))}
              />
              {formErrors.email ? <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-dir">
                Dirección
              </label>
              <input
                id="f-dir"
                className={fieldClass()}
                value={draft.direccion}
                onChange={(ev) => setDraft((d) => ({ ...d, direccion: ev.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-loc">
                Localidad
              </label>
              <input
                id="f-loc"
                className={fieldClass()}
                value={draft.localidad}
                onChange={(ev) => setDraft((d) => ({ ...d, localidad: ev.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-monto">
                Monto de cuota (ARS) *
              </label>
              <input
                id="f-monto"
                type="number"
                min={0}
                step={100}
                className={fieldClass(formErrors.montoCuota)}
                value={draft.montoCuota}
                onChange={(ev) => setDraft((d) => ({ ...d, montoCuota: ev.target.value }))}
              />
              {formErrors.montoCuota ? <p className="mt-1 text-xs text-rose-600">{formErrors.montoCuota}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-estado">
                Estado
              </label>
              <select
                id="f-estado"
                className={fieldClass()}
                value={draft.estado}
                onChange={(ev) => setDraft((d) => ({ ...d, estado: ev.target.value as EstadoSocio }))}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-cuota">
                Estado de cuota
              </label>
              <select
                id="f-cuota"
                className={fieldClass()}
                value={draft.estadoCuota}
                onChange={(ev) => setDraft((d) => ({ ...d, estadoCuota: ev.target.value as EstadoCuotaSocio }))}
              >
                <option value="al-dia">Al día</option>
                <option value="moroso">Moroso</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-alta">
                Fecha de alta
              </label>
              <input
                id="f-alta"
                type="date"
                className={fieldClass()}
                value={draft.fechaAlta}
                onChange={(ev) => setDraft((d) => ({ ...d, fechaAlta: ev.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-pago">
                Último pago
              </label>
              <input
                id="f-pago"
                type="date"
                className={fieldClass()}
                value={draft.fechaUltimoPago}
                onChange={(ev) => setDraft((d) => ({ ...d, fechaUltimoPago: ev.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="f-obs">
                Observaciones
              </label>
              <textarea
                id="f-obs"
                rows={3}
                className={fieldClass()}
                value={draft.observaciones}
                onChange={(ev) => setDraft((d) => ({ ...d, observaciones: ev.target.value }))}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-50"
              onClick={cerrarForm}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700"
              onClick={guardarForm}
            >
              Guardar
            </button>
          </div>
        </ModalShell>
      ) : null}

      {bajaSocio ? (
        <ModalShell title="Dar de baja" onClose={() => setBajaSocio(null)}>
          <p className="text-sm text-slate-700">¿Dar de baja a este socio?</p>
          <p className="mt-2 font-medium text-slate-900">{bajaSocio.nombreRazonSocial}</p>
          <p className="text-xs text-slate-600">{bajaSocio.cuitODni}</p>
          <p className="mt-3 text-xs text-slate-500">El socio pasará a estado inactivo (baja lógica).</p>
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-50"
              onClick={() => setBajaSocio(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-rose-700"
              onClick={confirmarBaja}
            >
              Confirmar baja
            </button>
          </div>
        </ModalShell>
      ) : null}
    </div>
  )
}
