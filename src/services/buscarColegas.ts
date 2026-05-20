import { directorioColegasPorId } from '../mocks/colegasDirectorio.mock'
import { sesionSocioMock } from '../mocks/perfil.mock'
import { sociosMockInicial } from '../mocks/socios.mock'
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

/**
 * Búsqueda de colegas para recomendar.
 * TODO: reemplazar cuerpo por fetch('/api/colegas?...') cuando exista backend.
 */
export async function buscarColegas(filtros: FiltrosBusquedaColegas): Promise<SocioParaRecomendar[]> {
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
