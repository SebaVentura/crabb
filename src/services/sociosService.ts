import { apiRequest } from '../lib/apiClient'
import type { Socio } from '../types/socios'

export type SocioFilters = {
  search?: string
  categoria?: string
  estado?: string
  estado_cuota?: string
  page?: number
  per_page?: number
}

export type SocioPayload = Partial<{
  nombre_razon_social: string
  cuit_o_dni: string
  telefono: string
  email: string
  direccion: string
  localidad: string
  categoria: string
  estado: string
  estado_cuota: string
  fecha_alta: string
  fecha_ultimo_pago: string
  monto_cuota: number
  observaciones: string
}>

export type ImportSociosSummary = {
  leidos: number
  creados: number
  actualizados: number
  omitidos: number
  errores: string[]
}

export type SociosListResponse = {
  data: Socio[]
  total: number
  currentPage: number
  lastPage: number
  perPage: number
}

type UnknownObject = Record<string, unknown>

function asObject(value: unknown): UnknownObject {
  if (value && typeof value === 'object') {
    return value as UnknownObject
  }
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

function normalizeEstado(estado: string): Socio['estado'] {
  return estado === 'inactivo' ? 'inactivo' : 'activo'
}

function normalizeEstadoCuota(estado: string): Socio['estadoCuota'] {
  if (estado === 'al-dia') return 'al-dia'
  if (estado === 'moroso') return 'moroso'
  if (estado === 'vencido') return 'vencido'
  if (estado === 'pendiente') return 'pendiente'
  return 'pendiente'
}

function normalizeCategoria(categoria: string): Socio['categoria'] {
  if (categoria === 'aportante') return 'aportante'
  if (categoria === 'socio') return 'socio'
  return 'socio'
}

function normalizeSocio(row: unknown): Socio {
  const source = asObject(row)

  return {
    id: asString(firstDefined(source.id, source.socio_id), crypto.randomUUID()),
    nombreRazonSocial: asString(
      firstDefined(
        source.nombreRazonSocial,
        source.nombre_razon_social,
        source.nombre,
        source.razon_social,
      ),
    ),
    cuitODni: asString(firstDefined(source.cuitODni, source.cuit_o_dni, source.cuit, source.dni)),
    telefono: asString(source.telefono),
    email: asString(source.email),
    direccion: asString(source.direccion),
    localidad: asString(source.localidad),
    categoria: normalizeCategoria(asString(source.categoria, 'socio')),
    estado: normalizeEstado(asString(source.estado, 'activo')),
    estadoCuota: normalizeEstadoCuota(
      asString(firstDefined(source.estadoCuota, source.estado_cuota), 'pendiente'),
    ),
    fechaAlta: asString(firstDefined(source.fechaAlta, source.fecha_alta)),
    fechaUltimoPago: asString(firstDefined(source.fechaUltimoPago, source.fecha_ultimo_pago)),
    montoCuota: asNumber(firstDefined(source.montoCuota, source.monto_cuota), 0),
    observaciones: asString(source.observaciones),
  }
}

function toCreatePayload(payload: SocioPayload): SocioPayload {
  return payload
}

function mapListResponse(response: unknown): SociosListResponse {
  const root = asObject(response)
  const dataValue = firstDefined(root.data, root.items)

  const rows = Array.isArray(dataValue) ? dataValue : []
  const data = rows.map(normalizeSocio)

  const meta = asObject(root.meta)
  const total = asNumber(firstDefined(root.total, meta.total), data.length)
  const currentPage = asNumber(firstDefined(root.current_page, meta.current_page), 1)
  const lastPage = asNumber(firstDefined(root.last_page, meta.last_page), 1)
  const perPage = asNumber(firstDefined(root.per_page, meta.per_page), data.length || 1)

  return {
    data,
    total,
    currentPage,
    lastPage,
    perPage,
  }
}

function mapImportSummary(response: unknown): ImportSociosSummary {
  const root = asObject(response)
  const erroresRaw = firstDefined(root.errores, root.errors)
  const errores = Array.isArray(erroresRaw)
    ? erroresRaw.map((item) => asString(item)).filter(Boolean)
    : []

  return {
    leidos: asNumber(firstDefined(root.leidos, root.read, root.total), 0),
    creados: asNumber(firstDefined(root.creados, root.created), 0),
    actualizados: asNumber(firstDefined(root.actualizados, root.updated), 0),
    omitidos: asNumber(firstDefined(root.omitidos, root.skipped), 0),
    errores,
  }
}

function buildQuery(params?: SocioFilters): string {
  if (!params) return ''

  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.categoria?.trim()) query.set('categoria', params.categoria.trim())
  if (params.estado?.trim()) query.set('estado', params.estado.trim())
  if (params.estado_cuota?.trim()) query.set('estado_cuota', params.estado_cuota.trim())
  if (params.page) query.set('page', String(params.page))
  if (params.per_page) query.set('per_page', String(params.per_page))

  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}

export const sociosService = {
  async getSocios(params?: SocioFilters): Promise<SociosListResponse> {
    const response = await apiRequest<unknown>(`/socios${buildQuery(params)}`)
    return mapListResponse(response)
  },

  async getSocio(id: string): Promise<Socio> {
    const response = await apiRequest<unknown>(`/socios/${id}`)
    const root = asObject(response)
    return normalizeSocio(firstDefined(root.data, response))
  },

  async createSocio(payload: SocioPayload): Promise<Socio> {
    const response = await apiRequest<unknown>('/socios', {
      method: 'POST',
      body: toCreatePayload(payload),
    })
    const root = asObject(response)
    return normalizeSocio(firstDefined(root.data, response))
  },

  async updateSocio(id: string, payload: SocioPayload): Promise<Socio> {
    const response = await apiRequest<unknown>(`/socios/${id}`, {
      method: 'PUT',
      body: payload,
    })
    const root = asObject(response)
    return normalizeSocio(firstDefined(root.data, response))
  },

  async deleteSocio(id: string): Promise<void> {
    await apiRequest<void>(`/socios/${id}`, { method: 'DELETE' })
  },

  async importSociosExcel(file: File): Promise<ImportSociosSummary> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiRequest<unknown>('/socios/import', {
      method: 'POST',
      body: formData,
    })

    return mapImportSummary(response)
  },
}
