import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { getInitialFeeConfig } from '../../../services/adminConfigService'
import { socioSolicitudesService } from '../../../services/socioSolicitudesService'
import type {
  InitialFeePreview,
  SocioSolicitud,
  SocioSolicitudDetail,
  SocioSolicitudEstado,
  SocioSolicitudSummary,
  SocioSolicitudesFilters,
} from '../../../types/socioSolicitudes'
import { buildApproveSuccessMessage } from '../utils/approveMessages'

const DEFAULT_SUMMARY: SocioSolicitudSummary = {
  total: 0,
  pendientes: 0,
  observadas: 0,
  aprobadas: 0,
  rechazadas: 0,
}

const DEFAULT_PER_PAGE = 15

export type SocioSolicitudesDraftFilters = {
  search: string
  estado: SocioSolicitudEstado | 'todas'
  dateFrom: string
  dateTo: string
}

const EMPTY_DRAFT: SocioSolicitudesDraftFilters = {
  search: '',
  estado: 'todas',
  dateFrom: '',
  dateTo: '',
}

export function useSocioSolicitudesAdmin() {
  const [summary, setSummary] = useState<SocioSolicitudSummary>(DEFAULT_SUMMARY)
  const [items, setItems] = useState<SocioSolicitud[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: DEFAULT_PER_PAGE,
    lastPage: 1,
    total: 0,
  })
  const [appliedFilters, setAppliedFilters] = useState<SocioSolicitudesDraftFilters>(EMPTY_DRAFT)
  const [draftFilters, setDraftFilters] = useState<SocioSolicitudesDraftFilters>(EMPTY_DRAFT)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [detailId, setDetailId] = useState<number | null>(null)
  const [detail, setDetail] = useState<SocioSolicitudDetail | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [initialFeePreview, setInitialFeePreview] = useState<InitialFeePreview | null>(null)

  const resolvedInitialFeePreview = useMemo<InitialFeePreview>(() => {
    if (initialFeePreview) return initialFeePreview

    const fromSummary: InitialFeePreview = {
      initialFeeAmount: summary.initialFeeAmount ?? null,
      initialFeesCount: summary.initialFeesCount ?? 8,
      initialFeesTotal: summary.initialFeesTotal ?? null,
    }

    if (
      fromSummary.initialFeeAmount !== null ||
      fromSummary.initialFeesTotal !== null ||
      summary.initialFeesCount !== null
    ) {
      return fromSummary
    }

    return { initialFeeAmount: null, initialFeesCount: 8, initialFeesTotal: null }
  }, [initialFeePreview, summary])

  const buildApiFilters = useCallback(
    (targetPage: number): SocioSolicitudesFilters => ({
      search: appliedFilters.search.trim() || undefined,
      estado: appliedFilters.estado,
      dateFrom: appliedFilters.dateFrom.trim() || undefined,
      dateTo: appliedFilters.dateTo.trim() || undefined,
      page: targetPage,
      perPage: DEFAULT_PER_PAGE,
    }),
    [appliedFilters],
  )

  const loadList = useCallback(
    async (targetPage: number, options?: { silent?: boolean }) => {
      if (options?.silent) setIsRefreshing(true)
      else setIsLoading(true)
      setLoadError(null)

      try {
        const [summaryData, listData] = await Promise.all([
          socioSolicitudesService.getSocioSolicitudesSummary(),
          socioSolicitudesService.getSocioSolicitudes(buildApiFilters(targetPage)),
        ])
        setSummary(summaryData)
        setItems(listData.items)
        setPagination({
          page: listData.pagination?.page ?? targetPage,
          perPage: listData.pagination?.perPage ?? DEFAULT_PER_PAGE,
          lastPage: listData.pagination?.lastPage ?? 1,
          total: listData.pagination?.total ?? listData.items.length,
        })

        if (
          summaryData.initialFeeAmount != null ||
          summaryData.initialFeesCount != null ||
          summaryData.initialFeesTotal != null
        ) {
          setInitialFeePreview({
            initialFeeAmount: summaryData.initialFeeAmount ?? null,
            initialFeesCount: summaryData.initialFeesCount ?? 8,
            initialFeesTotal: summaryData.initialFeesTotal ?? null,
          })
        }
      } catch {
        setLoadError('No se pudieron cargar las solicitudes de socios.')
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [buildApiFilters],
  )

  const loadDetail = useCallback(async (id: number) => {
    setIsDetailLoading(true)
    setDetailError(null)
    try {
      const data = await socioSolicitudesService.getSocioSolicitud(id)
      setDetail(data)
    } catch {
      setDetailError('No se pudo cargar el detalle de la solicitud.')
      setDetail(null)
    } finally {
      setIsDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadList(page)
  }, [loadList, page])

  useEffect(() => {
    let active = true
    void getInitialFeeConfig().then((config) => {
      if (active && config) setInitialFeePreview(config)
    })
    return () => {
      active = false
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await loadList(page, { silent: true })
    if (detailId) await loadDetail(detailId)
  }, [detailId, loadDetail, loadList, page])

  const openDetail = useCallback(
    (id: number) => {
      setDetailId(id)
      void loadDetail(id)
    },
    [loadDetail],
  )

  const closeDetail = useCallback(() => {
    setDetailId(null)
    setDetail(null)
    setDetailError(null)
  }, [])

  const buscar = useCallback(() => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }, [draftFilters])

  const limpiarFiltros = useCallback(() => {
    setDraftFilters(EMPTY_DRAFT)
    setAppliedFilters(EMPTY_DRAFT)
    setPage(1)
  }, [])

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage)
  }, [])

  const runAction = useCallback(
    async (id: number, action: () => Promise<{ message: string; detail: SocioSolicitudDetail }>) => {
      setActionLoadingId(id)
      setActionError(null)
      try {
        const result = await action()
        setSuccessMessage(result.message)
        setDetail(result.detail)
        await refreshAll()
        return true
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          setActionError(error.message)
        } else {
          setActionError('No se pudo completar la acción.')
        }
        return false
      } finally {
        setActionLoadingId(null)
      }
    },
    [refreshAll],
  )

  const approve = useCallback(
    async (id: number, adminNotes?: string) => {
      setActionLoadingId(id)
      setActionError(null)
      try {
        const result = await socioSolicitudesService.approveSocioSolicitud(id, {
          admin_notes: adminNotes?.trim() || undefined,
        })
        setSuccessMessage(buildApproveSuccessMessage(result))
        setDetail(result.detail)
        if (
          result.initialFeeAmount != null ||
          result.initialFeesTotal != null ||
          result.initialFeesGenerated != null
        ) {
          setInitialFeePreview({
            initialFeeAmount: result.initialFeeAmount,
            initialFeesCount: result.initialFeesTotalExpected ?? result.initialFeesGenerated ?? 8,
            initialFeesTotal: result.initialFeesTotal,
          })
        }
        await refreshAll()
        return true
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          setActionError(error.message)
        } else {
          setActionError('No se pudo aprobar la solicitud.')
        }
        return false
      } finally {
        setActionLoadingId(null)
      }
    },
    [refreshAll],
  )

  const reject = useCallback(
    (id: number, payload: { reason?: string; adminNotes?: string }) =>
      runAction(id, () =>
        socioSolicitudesService.rejectSocioSolicitud(id, {
          reason: payload.reason?.trim() || undefined,
          admin_notes: payload.adminNotes?.trim() || undefined,
        }),
      ),
    [runAction],
  )

  const observe = useCallback(
    (id: number, adminNotes: string) =>
      runAction(id, () =>
        socioSolicitudesService.observeSocioSolicitud(id, { admin_notes: adminNotes.trim() }),
      ),
    [runAction],
  )

  return {
    summary,
    items,
    pagination,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    isLoading,
    isRefreshing,
    loadError,
    successMessage,
    setSuccessMessage,
    actionError,
    setActionError,
    actionLoadingId,
    detailId,
    detail,
    isDetailLoading,
    detailError,
    openDetail,
    closeDetail,
    buscar,
    limpiarFiltros,
    goToPage,
    approve,
    reject,
    observe,
    initialFeePreview: resolvedInitialFeePreview,
  }
}
