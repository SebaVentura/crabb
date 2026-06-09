import { apiRequest } from '../lib/apiClient'
import type {
  CuotaSocio,
  CuotasFilters,
  CuotasListResponse,
  CuotasResumen,
  EstadoCuota,
  GenerarCuotasPayload,
} from '../types/cuotas'

type UnknownObject = Record<string, unknown>

function asObject(value: unknown): UnknownObject {
  if (value && typeof value === 'object') return value as UnknownObject
  return {}
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined)
}

function normalizeEstadoCuota(value: string): EstadoCuota {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'pagada' || normalized === 'pagado') return 'pagada'
  if (normalized === 'vencida' || normalized === 'vencido') return 'vencida'
  if (normalized === 'anulada' || normalized === 'anulado') return 'anulada'
  return 'pendiente'
}

function normalizeCuota(row: unknown): CuotaSocio {
  const source = asObject(row)
  const socio = asObject(firstDefined(source.socio, source.member, source.socio_data))

  const nombreSocio = asString(
    firstDefined(
      source.nombreSocio,
      source.nombre_socio,
      source.socioNombre,
      source.socio_nombre,
      socio.nombreApellido,
      socio.nombre_apellido,
      socio.nombre,
    ),
  )

  const denominacionTaller = asString(
    firstDefined(
      source.denominacionTaller,
      source.denominacion_taller,
      socio.denominacionTaller,
      socio.denominacion_taller,
    ),
  )

  const telefono = asString(
    firstDefined(source.telefono, source.celular, socio.celular, socio.telefono),
  )

  return {
    id: asString(firstDefined(source.id, source.cuota_id)),
    socioId: asString(firstDefined(source.socioId, source.socio_id, socio.id)),
    nombreSocio,
    denominacionTaller,
    telefono,
    periodo: asString(firstDefined(source.periodo, source.period)),
    concepto: asString(source.concepto),
    importe: asNumber(firstDefined(source.importe, source.monto, source.amount), 0),
    fechaVencimiento: asString(
      firstDefined(source.fechaVencimiento, source.fecha_vencimiento, source.vencimiento),
    ),
    estado: normalizeEstadoCuota(asString(firstDefined(source.estado, source.status), 'pendiente')),
  }
}

function mapListResponse(response: unknown): CuotasListResponse {
  const root = asObject(response)
  const rootData = asObject(root.data)
  const dataValue = firstDefined(root.data, root.items, rootData.data)

  const rows = Array.isArray(dataValue) ? dataValue : []
  const items = rows.map(normalizeCuota)

  const meta = asObject(firstDefined(root.meta, rootData.meta))
  const pagination = asObject(firstDefined(root.pagination, rootData.pagination))

  const pageSource = firstDefined(root.current_page, root.page, meta.current_page, pagination.page)
  const perPageSource = firstDefined(
    root.per_page,
    root.perPage,
    meta.per_page,
    pagination.per_page,
    pagination.perPage,
  )
  const totalSource = firstDefined(root.total, meta.total, pagination.total)
  const lastPageSource = firstDefined(root.last_page, meta.last_page, pagination.last_page)

  const hasPagination =
    pageSource !== undefined ||
    perPageSource !== undefined ||
    totalSource !== undefined ||
    lastPageSource !== undefined ||
    root.meta !== undefined ||
    root.pagination !== undefined

  if (!hasPagination) {
    return { items, pagination: null }
  }

  const total = asNumber(totalSource, items.length)
  const page = asNumber(pageSource, 1)
  const perPage = asNumber(perPageSource, items.length || 1)
  const inferredLastPage = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1
  const lastPage = asNumber(lastPageSource, inferredLastPage)

  return {
    items,
    pagination: { page, perPage, total, lastPage },
  }
}

function mapResumen(response: unknown): CuotasResumen {
  const raw = asObject(response)
  const root = asObject(firstDefined(raw.data, response))

  return {
    totalCuotas: asNumber(firstDefined(root.totalCuotas, root.total_cuotas, root.total), 0),
    pendientes: asNumber(firstDefined(root.pendientes, root.pendiente), 0),
    vencidas: asNumber(firstDefined(root.vencidas, root.vencida), 0),
    pagadas: asNumber(firstDefined(root.pagadas, root.pagada), 0),
    importePendiente: asNumber(
      firstDefined(root.importePendiente, root.importe_pendiente, root.monto_pendiente),
      0,
    ),
  }
}

function buildQuery(params?: CuotasFilters): string {
  if (!params) return ''

  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.periodo?.trim()) query.set('periodo', params.periodo.trim())
  if (params.estado?.trim()) query.set('estado', params.estado.trim())
  if (params.page) query.set('page', String(params.page))
  if (params.per_page) query.set('per_page', String(params.per_page))

  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}

export const cuotasService = {
  async getCuotas(params?: CuotasFilters): Promise<CuotasListResponse> {
    const response = await apiRequest<unknown>(`/admin/cuotas${buildQuery(params)}`)
    return mapListResponse(response)
  },

  async getResumen(): Promise<CuotasResumen> {
    const response = await apiRequest<unknown>('/admin/cuotas/resumen')
    return mapResumen(response)
  },

  async getDeudores(params?: Pick<CuotasFilters, 'search' | 'periodo' | 'page' | 'per_page'>): Promise<CuotasListResponse> {
    const response = await apiRequest<unknown>(`/admin/cuotas/deudores${buildQuery(params)}`)
    return mapListResponse(response)
  },

  async generarCuotas(payload: GenerarCuotasPayload): Promise<unknown> {
    return apiRequest<unknown>('/admin/cuotas/generar', {
      method: 'POST',
      body: payload,
    })
  },

  async marcarPagada(cuotaId: string): Promise<CuotaSocio> {
    const response = await apiRequest<unknown>(`/admin/cuotas/${cuotaId}/marcar-pagada`, {
      method: 'PATCH',
    })
    const root = asObject(response)
    const data = firstDefined(root.data, response)
    return normalizeCuota(data)
  },

  async anularCuota(cuotaId: string): Promise<CuotaSocio> {
    const response = await apiRequest<unknown>(`/admin/cuotas/${cuotaId}/anular`, {
      method: 'PATCH',
    })
    const root = asObject(response)
    const data = firstDefined(root.data, response)
    return normalizeCuota(data)
  },
}
