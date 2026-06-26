import { collectionsMessagesService } from '../../../services/collectionsMessagesService'
import { HISTORIAL_STORAGE_KEY } from '../constants'
import { mockHistorialInicial } from '../mocks/mockHistorial'
import type { CampanaHistorial, ResultadoEnvioMock, SocioCobranza } from '../types'
import {
  mapCollectionsDebtorToSocioCobranza,
  mapFiltroDeudaToEstadoCuotaApi,
} from '../utils/mapCollectionsDebtorToSocioCobranza'
import { sendReminderMock } from './sendReminderMock'

export type ListarCandidatosParams = {
  search?: string
  estado_cuota?: string
}

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

export const gestionCobranzasService = {
  async listarCandidatos(params?: ListarCandidatosParams): Promise<SocioCobranza[]> {
    const debtors = await collectionsMessagesService.getDebtors({
      search: params?.search?.trim() || undefined,
      estado_cuota: mapFiltroDeudaToEstadoCuotaApi(params?.estado_cuota),
    })

    return debtors.map(mapCollectionsDebtorToSocioCobranza)
  },

  async enviarRecordatorio(member: SocioCobranza, texto: string): Promise<ResultadoEnvioMock> {
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
