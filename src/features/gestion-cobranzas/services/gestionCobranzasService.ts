import { sociosService, type SocioFilters } from '../../../services/sociosService'
import { HISTORIAL_STORAGE_KEY } from '../constants'
import { mockHistorialInicial } from '../mocks/mockHistorial'
import type { CampanaHistorial, ResultadoEnvioMock, SocioCobranza } from '../types'
import { mapSocioToSocioCobranza } from '../utils/mapSocioToSocioCobranza'
import { sendReminderMock } from './sendReminderMock'

export type ListarCandidatosParams = {
  search?: string
  estado_cuota?: string
}

const CANDIDATOS_PER_PAGE = 100

function readHistorialFromStorage(): CampanaHistorial[] {
  try {
    const raw = localStorage.getItem(HISTORIAL_STORAGE_KEY)
    if (!raw) return [...mockHistorialInicial]
    const parsed = JSON.parse(raw) as CampanaHistorial[]
    return Array.isArray(parsed) ? parsed : [...mockHistorialInicial]
  } catch {
    return [...mockHistorialInicial]
  }
}

function writeHistorialToStorage(entries: CampanaHistorial[]) {
  localStorage.setItem(HISTORIAL_STORAGE_KEY, JSON.stringify(entries.slice(0, 50)))
}

/** Recorre páginas de GET /socios cuando la API devuelve paginación. */
async function fetchSociosPaginados(baseFilters: SocioFilters) {
  const firstPage = await sociosService.getSocios({
    ...baseFilters,
    page: 1,
    per_page: CANDIDATOS_PER_PAGE,
  })

  const items = [...firstPage.items]

  if (firstPage.pagination && firstPage.pagination.lastPage > 1) {
    for (let page = 2; page <= firstPage.pagination.lastPage; page += 1) {
      const nextPage = await sociosService.getSocios({
        ...baseFilters,
        page,
        per_page: CANDIDATOS_PER_PAGE,
      })
      items.push(...nextPage.items)
    }
  }

  return items
}

export const gestionCobranzasService = {
  async listarCandidatos(params?: ListarCandidatosParams): Promise<SocioCobranza[]> {
    const search = params?.search?.trim()
    const estadoCuota = params?.estado_cuota?.trim()

    const socios = await fetchSociosPaginados({
      estado: 'activo',
      search: search || undefined,
      estado_cuota: estadoCuota || undefined,
    })

    return socios
      .map(mapSocioToSocioCobranza)
      .filter((item): item is SocioCobranza => item !== null)
  },

  async enviarRecordatorio(member: SocioCobranza, texto: string): Promise<ResultadoEnvioMock> {
    // TODO: reemplazar por POST /api/admin/cobranzas/campanias cuando exista backend.
    return sendReminderMock(member, texto)
  },

  async obtenerHistorial(): Promise<CampanaHistorial[]> {
    await Promise.resolve()
    return readHistorialFromStorage()
  },

  guardarEntradaHistorial(entry: CampanaHistorial): CampanaHistorial[] {
    const current = readHistorialFromStorage()
    const updated = [entry, ...current].slice(0, 50)
    writeHistorialToStorage(updated)
    return updated
  },
}
