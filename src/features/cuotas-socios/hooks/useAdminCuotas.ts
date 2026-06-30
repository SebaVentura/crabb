import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { cuotasService } from '../../../services/cuotasService'
import type { CuotaSocio, CuotasResumen, EstadoCuota, GenerarCuotasPayload } from '../../../types/cuotas'
import { resolveCuotasApiFilters } from '../utils/resolveCuotasApiFilters'

const PER_PAGE = 50

function emptyResumen(): CuotasResumen {
  return {
    totalCuotas: 0,
    pendientes: 0,
    vencidas: 0,
    pagadas: 0,
    importePendiente: 0,
  }
}

export function useAdminCuotas() {
  const [cuotas, setCuotas] = useState<CuotaSocio[]>([])
  const [resumen, setResumen] = useState<CuotasResumen>(emptyResumen)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [estado, setEstado] = useState<'' | EstadoCuota>('')
  const [tipo, setTipo] = useState<'' | 'inicial' | 'mensual'>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [lastPage, setLastPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [isGenerarOpen, setIsGenerarOpen] = useState(false)
  const skipPageResetRef = useRef(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => window.clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    if (skipPageResetRef.current) {
      skipPageResetRef.current = false
      return
    }
    setCurrentPage(1)
  }, [debouncedSearch, periodo, estado, tipo])

  const apiFilters = useMemo(
    () =>
      resolveCuotasApiFilters({
        search: debouncedSearch,
        periodo,
        estado,
        tipo,
        page: currentPage,
        per_page: PER_PAGE,
      }),
    [currentPage, debouncedSearch, estado, periodo, tipo],
  )

  const loadData = useCallback(
    async (options?: { showTableLoading?: boolean }) => {
      if (options?.showTableLoading) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      try {
        const [listResponse, resumenResponse] = await Promise.all([
          cuotasService.getCuotas(apiFilters),
          cuotasService.getResumen(),
        ])

        setCuotas(listResponse.items)
        setResumen(resumenResponse)

        if (listResponse.pagination) {
          setTotalItems(listResponse.pagination.total)
          setLastPage(listResponse.pagination.lastPage)
        } else {
          setTotalItems(listResponse.items.length)
          setLastPage(1)
        }
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'No se pudieron cargar las cuotas de socios.'
        setError(message)
        setCuotas([])
        setResumen(emptyResumen())
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [apiFilters],
  )

  useEffect(() => {
    void loadData()
  }, [loadData])

  const marcarPagada = useCallback(
    async (cuotaId: string) => {
      setActionError(null)
      setActionLoadingId(cuotaId)
      try {
        await cuotasService.marcarPagada(cuotaId)
        await loadData({ showTableLoading: true })
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'No se pudo marcar la cuota como pagada.'
        setActionError(message)
      } finally {
        setActionLoadingId(null)
      }
    },
    [loadData],
  )

  const anularCuota = useCallback(
    async (cuotaId: string) => {
      setActionError(null)
      setActionLoadingId(cuotaId)
      try {
        await cuotasService.anularCuota(cuotaId)
        await loadData({ showTableLoading: true })
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'No se pudo anular la cuota.'
        setActionError(message)
      } finally {
        setActionLoadingId(null)
      }
    },
    [loadData],
  )

  const generarCuotas = useCallback(
    async (payload: GenerarCuotasPayload) => {
      setActionError(null)
      try {
        await cuotasService.generarCuotas(payload)
        setIsGenerarOpen(false)
        setCurrentPage(1)
        await loadData({ showTableLoading: true })
      } catch (err) {
        if (err instanceof ApiError) {
          throw err
        }
        throw new ApiError('No se pudieron generar las cuotas del mes.', 500)
      }
    },
    [loadData],
  )

  return {
    cuotas,
    resumen,
    search,
    setSearch,
    periodo,
    setPeriodo,
    estado,
    setEstado,
    tipo,
    setTipo,
    apiFilters,
    currentPage,
    setCurrentPage,
    totalItems,
    lastPage,
    perPage: PER_PAGE,
    isLoading,
    isRefreshing,
    error,
    actionError,
    setActionError,
    actionLoadingId,
    isGenerarOpen,
    setIsGenerarOpen,
    marcarPagada,
    anularCuota,
    generarCuotas,
  }
}
