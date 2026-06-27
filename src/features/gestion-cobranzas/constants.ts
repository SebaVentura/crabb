import type { CampaniaCobranza, CampaniaCobranzaId } from './types'

export const HISTORIAL_STORAGE_KEY = 'crabb_gestion_cobranzas_historial_v1'

export const INTERVALO_ENVIO_MS = 1500

export const COUNTDOWN_TICK_MS = 100

export const CAMPANIA_DEFAULT_ID: CampaniaCobranzaId = 'cuota_pendiente'

export const CAMPANIAS_COBRANZA: CampaniaCobranza[] = [
  {
    id: 'inicio_mes',
    label: 'Recordatorio de inicio de mes',
    descripcion: 'Para recordar a los socios que ya se encuentra disponible la cuota del mes.',
    tono: 'Amable / preventivo',
    template:
      'Hola {nombre}, te recordamos que ya se encuentra disponible la cuota correspondiente a {mesAdeudado} por {importe}. Podés regularizarla por los medios habituales de CRABB. Muchas gracias.',
  },
  {
    id: 'cuota_pendiente',
    label: 'Primer aviso de cuota pendiente',
    descripcion: 'Para socios que registran una cuota pendiente reciente.',
    tono: 'Claro / cordial',
    template:
      'Hola {nombre}, te recordamos que registrás una cuota pendiente correspondiente a {mesAdeudado} por {importe}. Podés regularizarla por los medios habituales de CRABB. Si ya realizaste el pago, por favor desestimá este mensaje.',
  },
  {
    id: 'socio_moroso',
    label: 'Segundo aviso a socios morosos',
    descripcion: 'Para socios con deuda vencida o acumulada.',
    tono: 'Más firme, pero respetuoso',
    template:
      'Hola {nombre}, desde CRABB registramos una deuda pendiente correspondiente a {mesAdeudado} por {importe}. Te solicitamos regularizar la situación a la brevedad por los medios habituales. Si ya realizaste el pago, por favor informalo para actualizar el registro.',
  },
  {
    id: 'ultimo_aviso',
    label: 'Último aviso antes de gestión administrativa',
    descripcion: 'Para casos que requieren una advertencia formal antes de revisión administrativa.',
    tono: 'Formal',
    template:
      'Hola {nombre}, desde CRABB te informamos que continúa pendiente la regularización de la cuota correspondiente a {mesAdeudado} por {importe}. Te pedimos regularizar la situación a la brevedad para evitar gestiones administrativas posteriores.',
  },
]

export function getCampaniaById(id: CampaniaCobranzaId): CampaniaCobranza {
  return CAMPANIAS_COBRANZA.find((c) => c.id === id) ?? CAMPANIAS_COBRANZA[1] ?? CAMPANIAS_COBRANZA[0]
}

export const BANNER_SIMULACION = 'Modo simulación · no se enviarán mensajes reales'

export const ADVERTENCIA_CONFIRMACION =
  'Esta acción simulará el envío de recordatorios a los socios seleccionados. Revisá la información antes de continuar.'

export const LABEL_ESTADO_CUOTA: Record<string, string> = {
  moroso: 'Moroso',
  vencido: 'Vencido',
  pendiente: 'Pendiente',
}

export const LABEL_ESTADO_ENVIO: Record<string, string> = {
  sin_enviar: 'Sin enviar',
  seleccionado: 'Seleccionado',
  enviando: 'Enviando',
  enviado: 'Enviado',
  error: 'Error',
  sin_telefono_valido: 'Sin teléfono válido',
}
