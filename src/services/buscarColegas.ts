import { env } from '../config/env'
import { apiRequest } from '../lib/apiClient'
import type { FiltrosBusquedaColegas, SocioParaRecomendar } from '../types/colegas'

const COLEGAS_UNAVAILABLE_MESSAGE = 'Servicio de búsqueda no disponible por el momento.'

export function colegasBackendConfigurado() {
  return Boolean(env.colegasSearchEndpoint)
}

function buildSearchParams(filtros: FiltrosBusquedaColegas): URLSearchParams {
  const params = new URLSearchParams()
  if (filtros.rubro) params.set('rubro', filtros.rubro)
  if (filtros.nombre.trim()) params.set('nombre', filtros.nombre.trim())
  if (filtros.localidad.trim()) params.set('localidad', filtros.localidad.trim())
  if (filtros.telefono.trim()) params.set('telefono', filtros.telefono.trim())
  params.set('incluir_mi_rubro', filtros.incluirMiRubro ? '1' : '0')
  return params
}

/**
 * Búsqueda de colegas para recomendar.
 */
export async function buscarColegas(filtros: FiltrosBusquedaColegas): Promise<SocioParaRecomendar[]> {
  if (!env.colegasSearchEndpoint) {
    throw new Error(COLEGAS_UNAVAILABLE_MESSAGE)
  }

  const qs = buildSearchParams(filtros).toString()
  const endpoint = qs ? `${env.colegasSearchEndpoint}?${qs}` : env.colegasSearchEndpoint
  return apiRequest<SocioParaRecomendar[]>(endpoint)
}

export function filtrosBusquedaColegasIniciales(): FiltrosBusquedaColegas {
  return {
    rubro: '',
    nombre: '',
    localidad: '',
    telefono: '',
    incluirMiRubro: false,
  }
}
