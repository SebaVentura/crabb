import { directorioColegasPorId } from '../mocks/colegasDirectorio.mock'
import { sesionSocioMock } from '../mocks/perfil.mock'
import { sociosMockInicial } from '../mocks/socios.mock'
import { env } from '../config/env'
import { apiRequest } from '../lib/apiClient'
import type { FiltrosBusquedaColegas, SocioParaRecomendar } from '../types/colegas'
import type { Socio } from '../types/socios'

function norm(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function textoCoincide(haystack: string, needle: string) {
  if (!needle.trim()) return true
  return norm(haystack).includes(norm(needle))
}

function socioAParaRecomendar(s: Socio): SocioParaRecomendar | null {
  const extra = directorioColegasPorId[s.id]
  if (!extra) return null

  return {
    id: s.id,
    nombreRazonSocial: s.nombreRazonSocial,
    rubro: extra.rubro,
    responsable: extra.responsable,
    telefono: s.telefono.trim() || undefined,
    direccion: s.direccion.trim() || undefined,
    localidad: s.localidad.trim() || undefined,
  }
}

function filtrarLocal(filtros: FiltrosBusquedaColegas): SocioParaRecomendar[] {
  const rubroSesion = sesionSocioMock.rubro
  const socioIdSesion = sesionSocioMock.socioId

  return sociosMockInicial
    .filter((s) => s.estado === 'activo' && s.id !== socioIdSesion)
    .map(socioAParaRecomendar)
    .filter((s): s is SocioParaRecomendar => s !== null)
    .filter((s) => {
      if (!filtros.incluirMiRubro && filtros.rubro === '' && s.rubro === rubroSesion) {
        return false
      }
      if (filtros.rubro !== '' && s.rubro !== filtros.rubro) return false
      if (!textoCoincide(s.nombreRazonSocial, filtros.nombre)) return false
      if (filtros.localidad.trim() !== '') {
        const zona = [s.localidad, s.direccion].filter(Boolean).join(' ')
        if (!textoCoincide(zona, filtros.localidad)) return false
      }
      if (filtros.telefono.trim() !== '') {
        const tel = s.telefono ?? ''
        const coincideTexto = textoCoincide(tel, filtros.telefono)
        const coincideDigitos = textoCoincide(
          tel.replace(/\D/g, ''),
          filtros.telefono.replace(/\D/g, ''),
        )
        if (!coincideTexto && !coincideDigitos) return false
      }
      return true
    })
}

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
 * TODO: reemplazar cuerpo por fetch('/api/colegas?...') cuando exista backend.
 */
export async function buscarColegas(filtros: FiltrosBusquedaColegas): Promise<SocioParaRecomendar[]> {
  if (env.colegasSearchEndpoint) {
    const qs = buildSearchParams(filtros).toString()
    const endpoint = qs ? `${env.colegasSearchEndpoint}?${qs}` : env.colegasSearchEndpoint
    return apiRequest<SocioParaRecomendar[]>(endpoint)
  }

  await Promise.resolve()
  return filtrarLocal(filtros)
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
