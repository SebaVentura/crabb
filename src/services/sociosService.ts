import { apiRequest } from '../lib/apiClient'
import type { CondicionSocio, Socio } from '../types/socios'

export type SocioFilters = {
  search?: string
  categoria?: string
  condicion?: string
  estado?: string
  estado_cuota?: string
  page?: number
  per_page?: number
  perPage?: number
}

export type SocioPayload = Partial<{
  nro_socio: string
  nombre_apellido: string
  denominacion_taller: string
  direccion: string
  celular: string
  emails: string[]
  ultimo_pago: string | null
  dni_cuit: string
  rubro: string
  observaciones: string
  categoria: 'socio' | 'adherente' | 'aportante'
  condicion: 'socio' | 'adherente' | 'aportante'
  estado: 'activo' | 'inactivo'
  estado_cuota: 'no_definido' | 'al-dia' | 'moroso' | 'vencido' | 'pendiente'
  localidad: string

  // Compatibilidad temporal con contratos previos.
  nombre_razon_social: string
  cuit_o_dni: string
  telefono: string
  email: string
  fecha_alta: string
  fecha_ultimo_pago: string
  monto_cuota: number
}>

export type ImportSociosSummary = {
  leidos: number
  creados: number
  actualizados: number
  omitidos: number
  errores: string[]
}

export type ImportSociosResult = {
  ok: boolean
  message: string
  code?: string
  summary?: ImportSociosSummary
  errors: string[]
  debug_id?: string
}

export type SociosListResponse = {
  items: Socio[]
  pagination: {
    page: number
    perPage: number
    total: number
    lastPage: number
  } | null
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

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'ok') return true
    if (normalized === 'false' || normalized === '0') return false
  }
  return fallback
}

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined)
}

function normalizeMembershipValue(value: string): string {
  return value.trim().toLowerCase()
}

function normalizeEstado(estado: string): Socio['estado'] {
  return estado === 'inactivo' ? 'inactivo' : 'activo'
}

function normalizeEstadoCuota(estado: string): Socio['estadoCuota'] {
  if (estado === 'al-dia') return 'al-dia'
  if (estado === 'moroso') return 'moroso'
  if (estado === 'vencido') return 'vencido'
  if (estado === 'pendiente') return 'pendiente'
  if (estado === 'no_definido') return 'no_definido'
  return 'no_definido'
}

function normalizeCategoria(categoria: string): NonNullable<Socio['categoria']> {
  const normalized = normalizeMembershipValue(categoria)
  if (normalized === 'adherente') return 'adherente'
  if (normalized === 'aportante') return 'aportante'
  return 'socio'
}

function normalizeCondicion(condicion: string): CondicionSocio {
  const normalized = normalizeMembershipValue(condicion)
  if (normalized === 'adherente') return 'adherente'
  if (normalized === 'aportante') return 'aportante'
  return 'socio'
}

function normalizeSocio(row: unknown): Socio {
  const source = asObject(row)

  const emailsRaw = firstDefined(source.emails, source.correos)
  const emails = Array.isArray(emailsRaw)
    ? emailsRaw.map((item) => asString(item)).filter(Boolean)
    : []

  const nombreApellido = asString(
    firstDefined(
      source.nombreApellido,
      source.nombre_apellido,
      source.nombreRazonSocial,
      source.nombre_razon_social,
      source.nombre,
      source.razon_social,
    ),
  )

  const denominacionTaller = asString(
    firstDefined(source.denominacionTaller, source.denominacion_taller),
  )

  const dniCuit = asString(firstDefined(source.dniCuit, source.dni_cuit, source.cuitODni, source.cuit_o_dni, source.cuit, source.dni))
  const celular = asString(firstDefined(source.celular, source.telefono))
  const ultimoPago = asString(firstDefined(source.ultimoPago, source.ultimo_pago, source.fechaUltimoPago, source.fecha_ultimo_pago))
  const nombreRazonSocial = denominacionTaller || nombreApellido
  const emailPrincipal = asString(firstDefined(source.email, emails[0]))

  const categoriaRaw = asString(source.categoria)
  const condicionRaw = asString(
    firstDefined(source.condicion, source.condicion_socio, source.condicionSocio, categoriaRaw),
  )
  const categoria = normalizeCategoria(categoriaRaw || condicionRaw)

  return {
    id: asString(firstDefined(source.id, source.socio_id), crypto.randomUUID()),
    nroSocio: asString(firstDefined(source.nroSocio, source.nro_socio)),
    nombreApellido,
    denominacionTaller,
    nombreRazonSocial,
    dniCuit,
    cuitODni: dniCuit,
    celular,
    telefono: celular,
    emails,
    ultimoPago: ultimoPago || null,
    email: emailPrincipal,
    direccion: asString(source.direccion),
    localidad: asString(source.localidad),
    rubro: asString(source.rubro),
    categoria,
    condicion: normalizeCondicion(condicionRaw || categoria || 'socio'),
    estado: normalizeEstado(asString(source.estado, 'activo')),
    estadoCuota: normalizeEstadoCuota(
      asString(firstDefined(source.estadoCuota, source.estado_cuota), 'no_definido'),
    ),
    fechaAlta: asString(firstDefined(source.fechaAlta, source.fecha_alta)),
    fechaUltimoPago: ultimoPago,
    montoCuota: asNumber(firstDefined(source.montoCuota, source.monto_cuota), 0),
    observaciones: asString(source.observaciones),
  }
}

function toCreatePayload(payload: SocioPayload): SocioPayload {
  return payload
}

function mapListResponse(response: unknown): SociosListResponse {
  const root = asObject(response)
  const rootData = asObject(root.data)
  const dataValue = firstDefined(root.data, root.items, rootData.data)

  const rows = Array.isArray(dataValue) ? dataValue : []
  const items = rows.map(normalizeSocio)

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
    root.pagination !== undefined ||
    root.links !== undefined

  if (!hasPagination) {
    return {
      items,
      pagination: null,
    }
  }

  const total = asNumber(totalSource, items.length)
  const page = asNumber(pageSource, 1)
  const perPage = asNumber(perPageSource, items.length || 1)
  const inferredLastPage = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1
  const lastPage = asNumber(lastPageSource, inferredLastPage)

  return {
    items,
    pagination: {
      page,
      perPage,
      total,
      lastPage,
    },
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

function mapImportResult(response: unknown): ImportSociosResult {
  const root = asObject(response)

  const summarySource = firstDefined(root.summary, root.resumen)
  const summaryObject = asObject(summarySource)
  const hasSummary =
    summarySource !== undefined ||
    root.leidos !== undefined ||
    root.creados !== undefined ||
    root.actualizados !== undefined ||
    root.omitidos !== undefined ||
    root.errores !== undefined

  const mappedSummary = mapImportSummary(summarySource ?? response)
  const summary = hasSummary
    ? {
        ...mappedSummary,
        errores: Array.isArray(summaryObject.errores) || Array.isArray(summaryObject.errors)
          ? mappedSummary.errores
          : [],
      }
    : undefined

  const errorsRaw = firstDefined(root.errors, root.errores)
  const errors = Array.isArray(errorsRaw)
    ? errorsRaw.map((item) => asString(item)).filter(Boolean)
    : []

  return {
    ok: asBoolean(firstDefined(root.ok, root.success), true),
    message: asString(firstDefined(root.message, root.mensaje), ''),
    code: asString(root.code) || undefined,
    summary,
    errors,
    debug_id: asString(root.debug_id) || undefined,
  }
}

function buildQuery(params?: SocioFilters): string {
  if (!params) return ''

  const query = new URLSearchParams()
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.categoria?.trim()) query.set('categoria', params.categoria.trim())
  if (params.condicion?.trim()) query.set('condicion', params.condicion.trim())
  if (params.estado?.trim()) query.set('estado', params.estado.trim())
  if (params.estado_cuota?.trim()) query.set('estado_cuota', params.estado_cuota.trim())
  if (params.page) query.set('page', String(params.page))
  const perPage = params.perPage ?? params.per_page
  if (perPage) query.set('per_page', String(perPage))

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

  async deleteSocio(id: number | string): Promise<void> {
    await apiRequest<void>(`/socios/${id}`, { method: 'DELETE' })
  },

  async importSociosExcel(file: File): Promise<ImportSociosResult> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiRequest<unknown>('/socios/import', {
      method: 'POST',
      body: formData,
    })

    return mapImportResult(response)
  },
}
