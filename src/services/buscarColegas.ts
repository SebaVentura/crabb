import { apiRequest } from '../lib/apiClient'
import type { Colega, ColegasListResponse, FiltrosBusquedaColegas } from '../types/colegas'

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

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined)
}

function normalizeColega(source: unknown): Colega {
  const row = asObject(source)
  const taller = asString(firstDefined(row.denominacionTaller, row.denominacion_taller))
  const nombre = asString(firstDefined(row.nombreApellido, row.nombre_apellido, row.responsable))

  return {
    id: asString(firstDefined(row.id, row.socio_id), crypto.randomUUID()),
    nroSocio: asString(firstDefined(row.nroSocio, row.nro_socio)) || undefined,
    nombreRazonSocial: asString(
      firstDefined(row.nombreRazonSocial, row.nombre_razon_social, taller, nombre),
    ),
    nombreApellido: nombre || null,
    denominacionTaller: taller || null,
    rubro: asString(row.rubro, 'Sin rubro'),
    responsable: asString(row.responsable) || undefined,
    telefono: asString(firstDefined(row.telefono, row.celular)) || undefined,
    direccion: asString(row.direccion) || undefined,
    localidad: asString(row.localidad) || undefined,
  }
}

function buildSearchParams(filtros: FiltrosBusquedaColegas): URLSearchParams {
  const params = new URLSearchParams()

  if (filtros.rubro) params.set('rubro', filtros.rubro)
  if (filtros.nombre.trim()) params.set('nombre', filtros.nombre.trim())
  if (filtros.localidad.trim()) params.set('localidad', filtros.localidad.trim())
  if (filtros.telefono.trim()) params.set('telefono', filtros.telefono.trim())
  params.set('page', String(filtros.page || 1))
  params.set('per_page', '20')

  return params
}

export function colegasBackendConfigurado() {
  return true
}

export async function buscarColegas(filtros: FiltrosBusquedaColegas): Promise<ColegasListResponse> {
  const qs = buildSearchParams(filtros).toString()
  const endpoint = qs ? `/socios/colegas?${qs}` : '/socios/colegas'
  const response = await apiRequest<unknown>(endpoint)
  const root = asObject(response)
  const dataValue = firstDefined(root.data, response)
  const rows = Array.isArray(dataValue) ? dataValue : []
  const meta = asObject(root.meta)

  const page = Number(meta.current_page ?? 1)
  const perPage = Number(meta.per_page ?? (rows.length || 20))
  const total = Number(meta.total ?? rows.length)
  const lastPage = Number(meta.last_page ?? 1)

  return {
    items: rows.map(normalizeColega),
    pagination: {
      page,
      perPage,
      total,
      lastPage,
    },
  }
}

export function filtrosBusquedaColegasIniciales(): FiltrosBusquedaColegas {
  return {
    rubro: '',
    nombre: '',
    localidad: '',
    telefono: '',
    incluirMiRubro: false,
    page: 1,
  }
}
