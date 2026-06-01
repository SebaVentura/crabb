import { HISTORIAL_STORAGE_KEY } from '../constants'
import { mockHistorialInicial } from '../mocks/mockHistorial'
import { crearMockMembers } from '../mocks/mockMembers'
import type { CampanaHistorial, ResultadoEnvioMock, SocioCobranza } from '../types'
import { sendReminderMock } from './sendReminderMock'

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
  async listarCandidatos(): Promise<SocioCobranza[]> {
    await Promise.resolve()
    return crearMockMembers()
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
