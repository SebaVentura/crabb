export const HISTORIAL_STORAGE_KEY = 'crabb_gestion_cobranzas_historial_v1'

export const INTERVALO_ENVIO_MS = 1500

export const COUNTDOWN_TICK_MS = 100

export const TIPO_RECORDATORIO = 'Cuota pendiente'

export const BANNER_SIMULACION = 'Modo simulación · no se enviarán mensajes reales'

export const MENSAJE_TEMPLATE =
  'Hola {nombre}, te recordamos que registrás una cuota pendiente correspondiente a {mesAdeudado} por {importe}. Podés regularizarla por los medios habituales de CRABB. Si ya realizaste el pago, por favor desestimá este mensaje.'

export const ADVERTENCIA_CONFIRMACION =
  'Esta acción simulará el envío de recordatorios a los socios seleccionados. Revisá la información antes de continuar.'

export const LABEL_ESTADO_CUOTA: Record<string, string> = {
  moroso: 'Moroso',
  vencido: 'Vencido',
  pendiente: 'Pendiente',
}

export const LABEL_ESTADO_ENVIO: Record<string, string> = {
  no_seleccionado: 'No seleccionado',
  pendiente_envio: 'Pendiente de envío',
  enviado: 'Enviado',
  error: 'Error',
  numero_invalido: 'Número inválido',
  cancelado: 'Cancelado',
}
