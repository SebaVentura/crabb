import { apiRequest } from '../lib/apiClient'
import type {
  ApproveSocioSolicitudPayload,
  ObserveSocioSolicitudPayload,
  RejectSocioSolicitudPayload,
  SocioSolicitud,
  SocioSolicitudDetail,
  SocioSolicitudDuplicado,
  SocioSolicitudEstado,
  SocioSolicitudSummary,
  SocioSolicitudesFilters,
  SocioSolicitudesListResponse,
} from '../types/socioSolicitudes'

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

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const n = value.trim().toLowerCase()
    if (n === 'true' || n === '1') return true
    if (n === 'false' || n === '0') return false
  }
  return fallback
}

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined)
}

function normalizeEstado(value: unknown): SocioSolicitudEstado {
  const raw = asString(value).trim().toLowerCase()
  if (raw === 'observada') return 'observada'
  if (raw === 'aprobada') return 'aprobada'
  if (raw === 'rechazada') return 'rechazada'
  return 'pendiente'
}

function normalizeDuplicado(row: unknown): SocioSolicitudDuplicado {
  const source = asObject(row)
  const rawId = firstDefined(source.id, source.socio_id)
  const id =
    typeof rawId === 'number' || typeof rawId === 'string' ? rawId : undefined

  return {
    id,
    nombreApellido: asString(firstDefined(source.nombre_apellido, source.nombreApellido)) || undefined,
    dniCuit: asString(firstDefined(source.dni_cuit, source.dniCuit)) || undefined,
    denominacionTaller:
      asString(firstDefined(source.denominacion_taller, source.denominacionTaller)) || undefined,
    motivo: asString(firstDefined(source.motivo, source.reason)) || undefined,
  }
}

function normalizeSolicitud(row: unknown): SocioSolicitud {
  const source = asObject(row)
  const createdAt = asString(firstDefined(source.created_at, source.createdAt, source.fecha))
  const fecha = asString(firstDefined(source.fecha, source.created_at, source.createdAt))

  return {
    id: asNumber(firstDefined(source.id)),
    fecha: fecha || createdAt,
    createdAt: createdAt || fecha,
    nombreApellido: asString(firstDefined(source.nombre_apellido, source.nombreApellido)),
    denominacionTaller:
      asString(firstDefined(source.denominacion_taller, source.denominacionTaller)) || null,
    dniCuit: asString(firstDefined(source.dni_cuit, source.dniCuit)) || null,
    email: asString(source.email) || null,
    celular: asString(firstDefined(source.celular, source.telefono, source.phone)) || null,
    estado: normalizeEstado(source.estado),
    reviewedAt: asString(firstDefined(source.reviewed_at, source.reviewedAt)) || null,
    socioId: asNumber(firstDefined(source.socio_id, source.socioId)) || null,
    posibleDuplicado: asBoolean(
      firstDefined(source.posible_duplicado, source.posibleDuplicado, source.duplicado),
      false,
    ),
  }
}

function normalizeDetail(row: unknown): SocioSolicitudDetail {
  const base = normalizeSolicitud(row)
  const source = asObject(row)
  const duplicadosRaw = firstDefined(source.duplicados, source.possible_duplicates, source.duplicates)
  const duplicados = Array.isArray(duplicadosRaw) ? duplicadosRaw.map(normalizeDuplicado) : []
  const socioRaw = source.socio

  return {
    ...base,
    direccion: asString(source.direccion) || null,
    localidad: asString(source.localidad) || null,
    rubro: asString(source.rubro) || null,
    observaciones: asString(source.observaciones) || null,
    adminNotes: asString(firstDefined(source.admin_notes, source.adminNotes)) || null,
    rejectionReason: asString(firstDefined(source.rejection_reason, source.rejectionReason)) || null,
    socio: socioRaw && typeof socioRaw === 'object' ? (socioRaw as Record<string, unknown>) : null,
    duplicados,
  }
}

function normalizeSummary(response: unknown): SocioSolicitudSummary {
  const root = asObject(response)
  const data = asObject(firstDefined(root.data, response))

  return {
    total: asNumber(firstDefined(data.total, root.total)),
    pendientes: asNumber(firstDefined(data.pendientes, data.pending, root.pendientes)),
    observadas: asNumber(firstDefined(data.observadas, data.observed, root.observadas)),
    aprobadas: asNumber(firstDefined(data.aprobadas, data.approved, root.aprobadas)),
    rechazadas: asNumber(firstDefined(data.rechazadas, data.rejected, root.rechazadas)),
  }
}

function mapListResponse(response: unknown): SocioSolicitudesListResponse {
  const root = asObject(response)
  const rootData = asObject(root.data)
  const dataValue = firstDefined(root.data, root.items, rootData.data, rootData.items)

  const rows = Array.isArray(dataValue)
    ? dataValue
    : Array.isArray(asObject(dataValue).items)
      ? (asObject(dataValue).items as unknown[])
      : []

  const items = rows.map(normalizeSolicitud).filter((item) => item.id > 0)

  const meta = asObject(firstDefined(root.meta, rootData.meta))
  const paginationRaw = asObject(firstDefined(root.pagination, rootData.pagination, meta))

  const page = asNumber(
    firstDefined(paginationRaw.page, paginationRaw.current_page, meta.current_page, root.current_page),
    1,
  )
  const perPage = asNumber(
    firstDefined(paginationRaw.per_page, paginationRaw.perPage, meta.per_page, root.per_page),
    items.length || 15,
  )
  const total = asNumber(
    firstDefined(paginationRaw.total, meta.total, root.total, items.length),
    items.length,
  )
  const lastPage = asNumber(
    firstDefined(paginationRaw.last_page, paginationRaw.lastPage, meta.last_page),
    Math.max(1, Math.ceil(total / Math.max(perPage, 1))),
  )

  const hasPagination =
    paginationRaw.total !== undefined ||
    meta.total !== undefined ||
    root.total !== undefined ||
    paginationRaw.last_page !== undefined

  return {
    items,
    pagination: hasPagination
      ? {
          page,
          perPage,
          total,
          lastPage,
        }
      : items.length > 0
        ? { page: 1, perPage: items.length, total: items.length, lastPage: 1 }
        : null,
  }
}

function buildQuery(filters?: SocioSolicitudesFilters): string {
  const query = new URLSearchParams()
  if (filters?.search?.trim()) query.set('search', filters.search.trim())
  if (filters?.estado && filters.estado !== 'todas') query.set('estado', filters.estado)
  if (filters?.dateFrom?.trim()) query.set('date_from', filters.dateFrom.trim())
  if (filters?.dateTo?.trim()) query.set('date_to', filters.dateTo.trim())
  if (filters?.page) query.set('page', String(filters.page))
  if (filters?.perPage) query.set('per_page', String(filters.perPage))
  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}

function extractDetail(response: unknown): SocioSolicitudDetail {
  const root = asObject(response)
  const data = firstDefined(root.data, response)
  if (data && typeof data === 'object') return normalizeDetail(data)
  return normalizeDetail(root)
}

export const socioSolicitudesService = {
  async getSocioSolicitudes(filters?: SocioSolicitudesFilters): Promise<SocioSolicitudesListResponse> {
    const response = await apiRequest<unknown>(`/admin/socio-solicitudes${buildQuery(filters)}`)
    return mapListResponse(response)
  },

  async getSocioSolicitudesSummary(): Promise<SocioSolicitudSummary> {
    const response = await apiRequest<unknown>('/admin/socio-solicitudes/summary')
    return normalizeSummary(response)
  },

  async getSocioSolicitud(id: number): Promise<SocioSolicitudDetail> {
    const response = await apiRequest<unknown>(`/admin/socio-solicitudes/${id}`)
    return extractDetail(response)
  },

  async approveSocioSolicitud(
    id: number,
    payload?: ApproveSocioSolicitudPayload,
  ): Promise<{ message: string; detail: SocioSolicitudDetail }> {
    const response = await apiRequest<unknown>(`/admin/socio-solicitudes/${id}/approve`, {
      method: 'POST',
      body: payload ?? {},
    })
    const root = asObject(response)
    return {
      message: asString(root.message, 'Solicitud aprobada.'),
      detail: extractDetail(response),
    }
  },

  async rejectSocioSolicitud(
    id: number,
    payload?: RejectSocioSolicitudPayload,
  ): Promise<{ message: string; detail: SocioSolicitudDetail }> {
    const response = await apiRequest<unknown>(`/admin/socio-solicitudes/${id}/reject`, {
      method: 'POST',
      body: payload ?? {},
    })
    const root = asObject(response)
    return {
      message: asString(root.message, 'Solicitud rechazada.'),
      detail: extractDetail(response),
    }
  },

  async observeSocioSolicitud(
    id: number,
    payload: ObserveSocioSolicitudPayload,
  ): Promise<{ message: string; detail: SocioSolicitudDetail }> {
    const response = await apiRequest<unknown>(`/admin/socio-solicitudes/${id}/observe`, {
      method: 'PATCH',
      body: payload,
    })
    const root = asObject(response)
    return {
      message: asString(root.message, 'Solicitud marcada como observada.'),
      detail: extractDetail(response),
    }
  },
}
