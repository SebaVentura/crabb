import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImportPadronExcelPanel } from '../components/socios/ImportPadronExcelPanel'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../lib/apiClient'
import { sociosService } from '../services/sociosService'
import type { CategoriaSocio, EstadoCuotaSocio, EstadoSocio, Socio } from '../types/socios'

function formatFecha(iso: string) {
  if (!iso) return '-'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function badgeEstado(estado: EstadoSocio) {
  return estado === 'activo' ? <Badge tone="green">Activo</Badge> : <Badge tone="gray">Inactivo</Badge>
}

function badgeCuota(estadoCuota: EstadoCuotaSocio) {
  if (estadoCuota === 'al-dia') return <Badge tone="green">Al dia</Badge>
  if (estadoCuota === 'moroso') return <Badge tone="red">Moroso</Badge>
  if (estadoCuota === 'vencido') return <Badge tone="yellow">Vencido</Badge>
  return <Badge tone="yellow">Pendiente</Badge>
}

function badgeCategoria(categoria: CategoriaSocio | undefined) {
  if (categoria === 'aportante') return <Badge tone="blue">Aportante</Badge>
  return <Badge tone="gray">Socio</Badge>
}

export function PerfilSocioPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [socios, setSocios] = useState<Socio[]>([])
  const [totalSocios, setTotalSocios] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<'' | CategoriaSocio>('')
  const [filtroEstado, setFiltroEstado] = useState<'' | EstadoSocio>('')
  const [filtroEstadoCuota, setFiltroEstadoCuota] = useState<'' | EstadoCuotaSocio>('')

  const loadSocios = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await sociosService.getSocios({
        search,
        categoria: filtroCategoria || undefined,
        estado: filtroEstado || undefined,
        estado_cuota: filtroEstadoCuota || undefined,
        per_page: 500,
      })

      setSocios(response.data)
      setTotalSocios(response.total)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          setLoadError('No se pudo cargar el listado por filtros invalidos (422).')
        } else {
          setLoadError(error.message)
        }
      } else {
        setLoadError('No se pudo cargar el listado de socios.')
      }
      setSocios([])
      setTotalSocios(0)
    } finally {
      setIsLoading(false)
    }
  }, [search, filtroCategoria, filtroEstado, filtroEstadoCuota])

  useEffect(() => {
    void loadSocios()
  }, [loadSocios])

  const indicadores = useMemo(() => {
    const activos = socios.filter((s) => s.estado === 'activo').length
    const categoriaSocio = socios.filter((s) => (s.categoria ?? 'socio') === 'socio').length
    const categoriaAportante = socios.filter((s) => s.categoria === 'aportante').length

    return {
      total: totalSocios || socios.length,
      activos,
      categoriaSocio,
      categoriaAportante,
    }
  }, [socios, totalSocios])

  const handleImport = useCallback(
    async (file: File) => {
      const summary = await sociosService.importSociosExcel(file)
      await loadSocios()
      return summary
    },
    [loadSocios],
  )

  return (
    <div className="space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestion de Socios</h1>
        <p className="mt-1 text-sm text-slate-600 md:text-base">Administracion del padron y estado de socios</p>
        <p className="mt-2 text-xs text-slate-500">Datos reales · API CRABB</p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {(
          [
            ['Total socios', indicadores.total],
            ['Activos', indicadores.activos],
            ['Socios', indicadores.categoriaSocio],
            ['Aportantes', indicadores.categoriaAportante],
            ['Estado de cuota', 'Pendiente'],
          ] as const
        ).map(([label, value]) => (
          <Card key={label} className="border-slate-200 shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </Card>
        ))}
      </div>

      {isAdmin ? <ImportPadronExcelPanel onImport={handleImport} /> : null}

      <Card className="border-slate-200 shadow-md" title="Filtros y busqueda">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="buscar-socio">
              Buscar
            </label>
            <input
              id="buscar-socio"
              type="search"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              placeholder="Nombre, CUIT/DNI, email o telefono"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-categoria">
              Categoria
            </label>
            <select
              id="filtro-categoria"
              value={filtroCategoria}
              onChange={(ev) => setFiltroCategoria(ev.target.value as '' | CategoriaSocio)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              <option value="socio">Socio</option>
              <option value="aportante">Aportante</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-estado">
              Estado
            </label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(ev) => setFiltroEstado(ev.target.value as '' | EstadoSocio)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
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
              value={filtroEstadoCuota}
              onChange={(ev) => setFiltroEstadoCuota(ev.target.value as '' | EstadoCuotaSocio)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="al-dia">Al dia</option>
              <option value="moroso">Moroso</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-md">
          Cargando socios...
        </div>
      ) : null}

      {loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{loadError}</div>
      ) : null}

      {!isLoading && !loadError && socios.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
          Todavía no hay socios cargados. Importá un padrón Excel para comenzar.
        </div>
      ) : null}

      {!isLoading && !loadError && socios.length > 0 ? (
        <>
          <div className="space-y-3 md:hidden">
            {socios.map((socio) => (
              <Card key={socio.id} className="border-slate-200 shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{socio.nombreRazonSocial}</p>
                    <p className="text-xs text-slate-600">{socio.cuitODni || '-'}</p>
                    <p className="mt-1 text-xs text-slate-600">{socio.telefono || '-'}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {badgeEstado(socio.estado)}
                    {badgeCategoria(socio.categoria)}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">{badgeCuota(socio.estadoCuota)}</div>
                <p className="mt-2 text-xs text-slate-600">Ultimo pago: {formatFecha(socio.fechaUltimoPago)}</p>
              </Card>
            ))}
          </div>

          <Card className="hidden border-slate-200 shadow-md md:block" title={`Socios (${socios.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-2 pr-3 font-medium">Socio</th>
                    <th className="pb-2 pr-3 font-medium">Categoria</th>
                    <th className="pb-2 pr-3 font-medium">CUIT/DNI</th>
                    <th className="pb-2 pr-3 font-medium">Telefono</th>
                    <th className="pb-2 pr-3 font-medium">Estado</th>
                    <th className="pb-2 pr-3 font-medium">Cuota</th>
                    <th className="pb-2 pr-3 font-medium">Ultimo pago</th>
                    <th className="pb-2 pr-3 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {socios.map((socio) => (
                    <tr key={socio.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                      <td className="max-w-[230px] py-3 pr-3 font-medium text-slate-900">{socio.nombreRazonSocial}</td>
                      <td className="py-3 pr-3">{badgeCategoria(socio.categoria)}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{socio.cuitODni || '-'}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{socio.telefono || '-'}</td>
                      <td className="py-3 pr-3">{badgeEstado(socio.estado)}</td>
                      <td className="py-3 pr-3">{badgeCuota(socio.estadoCuota)}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatFecha(socio.fechaUltimoPago)}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{socio.email || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  )
}
