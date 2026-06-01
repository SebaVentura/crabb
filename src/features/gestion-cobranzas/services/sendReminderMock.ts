import type { ResultadoEnvioMock, SocioCobranza } from '../types'
import { validatePhone } from '../utils/validatePhone'

export async function sendReminderMock(
  member: SocioCobranza,
  _texto: string,
): Promise<ResultadoEnvioMock> {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))

  const phoneCheck = validatePhone(member.telefono)
  if (!phoneCheck.valido) {
    return { ok: false, error: phoneCheck.motivo ?? 'Teléfono inválido' }
  }

  if (Math.random() < 0.08) {
    return { ok: false, error: 'No se pudo completar el envío simulado' }
  }

  return { ok: true }
}
