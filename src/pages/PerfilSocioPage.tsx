import { useCallback, useEffect, useMemo, useState } from 'react'
import { ImportPadronExcelPanel } from '../components/socios/ImportPadronExcelPanel'
import { SocioFormModal } from '../components/socios/SocioFormModal'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../lib/apiClient'
import { sociosService, type SocioPayload } from '../services/sociosService'
import { isAdminRole } from '../utils/adminAccess'
import type { CategoriaSocio, CondicionSocio, EstadoCuotaSocio, EstadoSocio, Socio } from '../types/socios'
import { exportSociosCsv } from '../utils/exportSociosCsv'
import { formatPhone } from '../utils/formatPhone'

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
  if (estadoCuota === 'no_definido') return <Badge tone="gray">No definido</Badge>
  return <Badge tone="yellow">Pendiente</Badge>
}

function badgeCondicion(condicion: CondicionSocio | undefined, categoria: CategoriaSocio | undefined) {
  const normalized = condicion ?? categoria ?? 'socio'
  if (normalized === 'adherente') return <Badge tone="yellow">Adherente</Badge>
  if (normalized === 'aportante') return <Badge tone="blue">Aportante</Badge>
  return <Badge tone="gray">Socio</Badge>
}

function displaySocioName(socio: Socio) {
  return socio.nombreApellido || socio.denominacionTaller || socio.nombreRazonSocial || '-'
}

const CATEGORIA_LABELS: Record<CategoriaSocio, string> = {
  socio: 'Socio',
  adherente: 'Adherente',
  aportante: 'Aportante',
}

const CONDICION_LABELS: Record<CondicionSocio, string> = {
  socio: 'Socio',
  adherente: 'Adherente',
  aportante: 'Aportante',
}

const ESTADO_LABELS: Record<EstadoSocio, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
}

const ESTADO_CUOTA_LABELS: Record<EstadoCuotaSocio, string> = {
  'al-dia': 'Al día',
  moroso: 'Moroso',
  vencido: 'Vencido',
  pendiente: 'Pendiente',
  no_definido: 'No definido',
}

export function PerfilSocioPage() {
  const { user } = useAuth()
  const isAdminUser = isAdminRole(user?.role)

  const [socios, setSocios] = useState<Socio[]>([])
  const [totalSocios, setTotalSocios] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showImportPanel, setShowImportPanel] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<'' | CategoriaSocio>('')
  const [filtroCondicion, setFiltroCondicion] = useState<'' | CondicionSocio>('')
  const [filtroEstado, setFiltroEstado] = useState<'' | EstadoSocio>('')
  const [filtroEstadoCuota, setFiltroEstadoCuota] = useState<'' | EstadoCuotaSocio>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [isServerPagination, setIsServerPagination] = useState(false)

  const hasFiltersApplied =
    search.trim() !== '' ||
    filtroCategoria !== '' ||
    filtroCondicion !== '' ||
    filtroEstado !== '' ||
    filtroEstadoCuota !== ''

  const hasPendingSearch = searchInput.trim() !== search

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = []

    if (search.trim()) {
      labels.push(`Búsqueda: "${search.trim()}"`)
    }
    if (filtroCategoria) {
      labels.push(`Categoría: ${CATEGORIA_LABELS[filtroCategoria]}`)
    }
    if (filtroCondicion) {
      labels.push(`Condición: ${CONDICION_LABELS[filtroCondicion]}`)
    }
    if (filtroEstado) {
      labels.push(`Estado: ${ESTADO_LABELS[filtroEstado]}`)
    }
    if (filtroEstadoCuota) {
      labels.push(`Estado de cuota: ${ESTADO_CUOTA_LABELS[filtroEstadoCuota]}`)
    }

    return labels
  }, [search, filtroCategoria, filtroCondicion, filtroEstado, filtroEstadoCuota])

  const loadSocios = useCallback(async (options?: { page?: number; perPage?: number }) => {
    const requestedPage = Math.max(1, options?.page ?? currentPage)
    const requestedPerPage = Math.max(1, options?.perPage ?? perPage)

    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await sociosService.getSocios({
        search,
        categoria: filtroCategoria || undefined,
        condicion: filtroCondicion || undefined,
        estado: filtroEstado || undefined,
        estado_cuota: filtroEstadoCuota || undefined,
        page: requestedPage,
        per_page: requestedPerPage,
      })

      if (response.pagination) {
        setIsServerPagination(true)
        setSocios(response.items)
        setTotalSocios(response.pagination.total)
        setCurrentPage(response.pagination.page)
        setLastPage(Math.max(1, response.pagination.lastPage))
        setPerPage(response.pagination.perPage)
        return {
          visibleItems: response.items.length,
          page: response.pagination.page,
        }
      }

      setIsServerPagination(false)
      const localTotal = response.items.length
      const calculatedLastPage = Math.max(1, Math.ceil(localTotal / requestedPerPage))
      const safePage = Math.min(requestedPage, calculatedLastPage)
      const start = (safePage - 1) * requestedPerPage
      const end = start + requestedPerPage
      const pageItems = response.items.slice(start, end)

      setSocios(pageItems)
      setTotalSocios(localTotal)
      setCurrentPage(safePage)
      setLastPage(calculatedLastPage)
      setPerPage(requestedPerPage)

      return {
        visibleItems: pageItems.length,
        page: safePage,
      }
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
      setCurrentPage(1)
      setLastPage(1)
      return {
        visibleItems: 0,
        page: 1,
      }
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, perPage, search, filtroCategoria, filtroCondicion, filtroEstado, filtroEstadoCuota])

  useEffect(() => {
    void loadSocios({ page: currentPage, perPage })
  }, [loadSocios, currentPage, perPage])

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[SOCIOS][AUTH]', {
        email: user?.email ?? null,
        role: user?.role ?? null,
        isAdminUser,
      })
    }
  }, [user?.email, user?.role, isAdminUser])

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
      const result = await sociosService.importSociosExcel(file)
      await loadSocios({ page: currentPage, perPage })
      setSuccessMessage(result.message || 'Padrón importado correctamente. Listado actualizado.')
      return result
    },
    [currentPage, loadSocios, perPage],
  )

  const handleSaveSocio = useCallback(
    async (payload: SocioPayload) => {
      if (editingSocio) {
        await sociosService.updateSocio(editingSocio.id, payload)
        setSuccessMessage('Socio actualizado correctamente. Listado actualizado.')
      } else {
        await sociosService.createSocio(payload)
        setSuccessMessage('Socio creado correctamente. Listado actualizado.')
      }

      await loadSocios({ page: currentPage, perPage })
      setEditingSocio(null)
    },
    [currentPage, editingSocio, loadSocios, perPage],
  )

  const handleDeleteSocio = useCallback(
    async (socio: Socio) => {
      const socioName = displaySocioName(socio)
      const confirmMessage = `¿Seguro que querés eliminar este socio? Esta acción no se puede deshacer.\n\nSocio: ${socioName}`
      if (!window.confirm(confirmMessage)) return

      setIsDeletingId(socio.id)
      setLoadError(null)
      setSuccessMessage(null)

      try {
        await sociosService.deleteSocio(socio.id)

        const refreshed = await loadSocios({ page: currentPage, perPage })
        if (refreshed.visibleItems === 0 && refreshed.page > 1) {
          await loadSocios({ page: refreshed.page - 1, perPage })
        }

        setSuccessMessage('Socio eliminado correctamente. Listado actualizado.')
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 404) {
            setLoadError('No se pudo eliminar el socio porque el endpoint DELETE todavía no está disponible o el socio no existe.')
          } else {
            setLoadError(error.message)
          }
        } else {
          setLoadError('No se pudo eliminar el socio. Intentá nuevamente.')
        }
      } finally {
        setIsDeletingId(null)
      }
    },
    [currentPage, loadSocios, perPage],
  )

  const handleSearch = () => {
    setCurrentPage(1)
    setSearch(searchInput.trim())
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setFiltroCategoria('')
    setFiltroCondicion('')
    setFiltroEstado('')
    setFiltroEstadoCuota('')
    setCurrentPage(1)
  }

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    setLoadError(null)
    setSuccessMessage(null)

    try {
      const items = await sociosService.getAllSocios({
        search: search.trim() || undefined,
        categoria: filtroCategoria || undefined,
        condicion: filtroCondicion || undefined,
        estado: filtroEstado || undefined,
        estado_cuota: filtroEstadoCuota || undefined,
      })

      if (items.length === 0) {
        setLoadError('No hay socios para exportar con los filtros aplicados.')
        return
      }

      exportSociosCsv(items)
      setSuccessMessage(`Se exportaron ${items.length} socios en CSV.`)
    } catch (error) {
      if (error instanceof ApiError) {
        setLoadError(error.message)
      } else {
        setLoadError('No se pudo exportar el listado de socios.')
      }
    } finally {
      setIsExporting(false)
    }
  }, [search, filtroCategoria, filtroCondicion, filtroEstado, filtroEstadoCuota])

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(lastPage, prev + 1))
  }

  const openCreateModal = () => {
    setEditingSocio(null)
    setIsFormOpen(true)
  }

  const openEditModal = (socio: Socio) => {
    setEditingSocio(socio)
    setIsFormOpen(true)
  }

  const closeFormModal = () => {
    setIsFormOpen(false)
    setEditingSocio(null)
  }

  return (
    <div className="min-w-0 max-w-full space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Gestión de Socios</h1>
        <p className="mt-1 text-sm text-slate-600 md:text-base">Administración del padrón y estado de socios</p>
        <p className="mt-2 text-xs text-slate-500">Datos reales · API CRABB</p>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

      {isAdminUser ? (
        <Card className="border-slate-200 shadow-md" title="Acciones">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50"
              onClick={() => setShowImportPanel((prev) => !prev)}
            >
              Importar padrón Excel
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => {
                void handleExport()
              }}
              disabled={isExporting}
            >
              {isExporting ? 'Exportando...' : 'Exportar socios'}
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700"
              onClick={openCreateModal}
            >
              Nuevo socio
            </button>
          </div>

          {showImportPanel ? <div className="mt-4"><ImportPadronExcelPanel onImport={handleImport} /></div> : null}
        </Card>
      ) : null}

      {import.meta.env.DEV && user && !user.role ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Usuario autenticado sin role. La acción de importar se oculta por seguridad.
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      <Card className="max-w-full border-slate-200 shadow-md" title="Filtros y búsqueda">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="buscar-socio">
              Buscar
            </label>
            <input
              id="buscar-socio"
              type="search"
              value={searchInput}
              onChange={(ev) => setSearchInput(ev.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault()
                  handleSearch()
                }
              }}
              placeholder="Nombre, denominación, Nro socio, DNI/CUIT o email"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-categoria">
              Categoría
            </label>
            <select
              id="filtro-categoria"
              value={filtroCategoria}
              onChange={(ev) => {
                setFiltroCategoria(ev.target.value as '' | CategoriaSocio)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              <option value="socio">Socio</option>
              <option value="adherente">Adherente</option>
              <option value="aportante">Aportante</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="filtro-condicion">
              Condición
            </label>
            <select
              id="filtro-condicion"
              value={filtroCondicion}
              onChange={(ev) => {
                setFiltroCondicion(ev.target.value as '' | CondicionSocio)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              <option value="socio">Socio</option>
              <option value="adherente">Adherente</option>
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
              onChange={(ev) => {
                setFiltroEstado(ev.target.value as '' | EstadoSocio)
                setCurrentPage(1)
              }}
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
              onChange={(ev) => {
                setFiltroEstadoCuota(ev.target.value as '' | EstadoCuotaSocio)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="no_definido">No definido</option>
              <option value="al-dia">Al día</option>
              <option value="moroso">Moroso</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700"
            onClick={handleSearch}
          >
            Buscar
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50"
            onClick={clearFilters}
            disabled={!hasFiltersApplied && !hasPendingSearch}
          >
            Limpiar filtros
          </button>
          <p className="text-xs text-slate-500">
            Mostrando {socios.length} de {totalSocios} socios {isServerPagination ? '(paginación API)' : '(paginación local temporal)'}.
          </p>
        </div>

        {hasPendingSearch ? (
          <p className="mt-3 text-xs text-amber-700">
            Hay texto en búsqueda que todavía no se aplicó. Presioná Buscar para filtrar.
          </p>
        ) : null}

        {activeFilterLabels.length > 0 ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Filtros activos</p>
              <button
                type="button"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            </div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {activeFilterLabels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
          {hasFiltersApplied ? (
            <>
              <p>No se encontraron resultados para la búsqueda aplicada.</p>
              <p className="mt-1">Probá ajustar filtros o limpiar la búsqueda.</p>
            </>
          ) : (
            <>
              <p>Todavía no hay socios cargados.</p>
              <p className="mt-1">Importá un padrón Excel o cargá un socio manualmente para comenzar.</p>
            </>
          )}
        </div>
      ) : null}

      {!isLoading && !loadError && socios.length > 0 ? (
        <>
          <div className="space-y-3 md:hidden">
            {socios.map((socio) => (
              <Card key={socio.id} className="border-slate-200 shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{displaySocioName(socio)}</p>
                    <p className="text-xs text-slate-600">Nro: {socio.nroSocio || '-'}</p>
                    <p className="text-xs text-slate-600">{socio.dniCuit || socio.cuitODni || '-'}</p>
                    <p className="mt-1 text-xs text-slate-600">{formatPhone(socio.celular || socio.telefono)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {badgeEstado(socio.estado)}
                    {badgeCondicion(socio.condicion, socio.categoria)}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">{badgeCuota(socio.estadoCuota)}</div>
                <p className="mt-2 text-xs text-slate-600">Ultimo pago: {formatFecha(socio.fechaUltimoPago)}</p>
                {isAdminUser ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50"
                      onClick={() => openEditModal(socio)}
                      disabled={isDeletingId === socio.id}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition duration-150 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => {
                        void handleDeleteSocio(socio)
                      }}
                      disabled={isDeletingId === socio.id}
                    >
                      {isDeletingId === socio.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>

          <Card className="hidden w-full min-w-0 max-w-full border-slate-200 shadow-md md:block" title={`Socios (${socios.length})`}>
            <div className="w-full min-w-0 max-w-full overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
              <table className="w-max min-w-[1240px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-2 pr-3 font-medium">Nro socio</th>
                    <th className="pb-2 pr-3 font-medium">Socio / Titular</th>
                    <th className="pb-2 pr-3 font-medium">Denominación / Taller</th>
                    <th className="pb-2 pr-3 font-medium">Condición</th>
                    <th className="pb-2 pr-3 font-medium">CUIT/DNI</th>
                    <th className="pb-2 pr-3 font-medium">Telefono</th>
                    <th className="pb-2 pr-3 font-medium">Estado</th>
                    <th className="pb-2 pr-3 font-medium">Cuota</th>
                    <th className="pb-2 pr-3 font-medium">Ultimo pago</th>
                    <th className="pb-2 pr-3 font-medium">Email</th>
                    {isAdminUser ? (
                      <th className="sticky right-0 z-30 bg-white pb-2 pr-3 text-right font-medium shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">
                        Acciones
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {socios.map((socio) => (
                    <tr key={socio.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{socio.nroSocio || '-'}</td>
                      <td className="max-w-[260px] py-3 pr-3 font-medium text-slate-900">{displaySocioName(socio)}</td>
                      <td className="max-w-[260px] py-3 pr-3 text-slate-700">{socio.denominacionTaller || socio.nombreRazonSocial || '-'}</td>
                      <td className="py-3 pr-3">{badgeCondicion(socio.condicion, socio.categoria)}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{socio.dniCuit || socio.cuitODni || '-'}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatPhone(socio.celular || socio.telefono)}</td>
                      <td className="py-3 pr-3">{badgeEstado(socio.estado)}</td>
                      <td className="py-3 pr-3">{badgeCuota(socio.estadoCuota)}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatFecha(socio.fechaUltimoPago)}</td>
                      <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{socio.email || '-'}</td>
                      {isAdminUser ? (
                        <td className="sticky right-0 z-20 whitespace-nowrap bg-white py-3 pr-3 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">
                          <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50"
                            onClick={() => openEditModal(socio)}
                            disabled={isDeletingId === socio.id}
                          >
                            Editar
                          </button>
                            <button
                              type="button"
                              className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition duration-150 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                              onClick={() => {
                                void handleDeleteSocio(socio)
                              }}
                              disabled={isDeletingId === socio.id}
                            >
                              {isDeletingId === socio.id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border-slate-200 shadow-md" title="Paginación">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1 || isLoading}
              >
                Anterior
              </button>

              <p className="text-sm text-slate-700">
                Página {currentPage} de {lastPage}
              </p>

              <button
                type="button"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={goToNextPage}
                disabled={currentPage >= lastPage || isLoading}
              >
                Siguiente
              </button>

              <label className="ml-2 text-sm text-slate-700" htmlFor="per-page">
                Por página
              </label>
              <select
                id="per-page"
                value={perPage}
                onChange={(event) => {
                  const nextPerPage = Number(event.target.value)
                  setPerPage(nextPerPage)
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
                disabled={isLoading}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </Card>
        </>
      ) : null}

      <SocioFormModal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        onSubmit={handleSaveSocio}
        initialValues={editingSocio}
        title={editingSocio ? 'Editar socio' : 'Nuevo socio'}
        submitLabel={editingSocio ? 'Guardar cambios' : 'Guardar'}
      />
    </div>
  )
}
