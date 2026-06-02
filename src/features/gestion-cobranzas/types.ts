export type CampaniaCobranzaId = 'inicio_mes' | 'cuota_pendiente' | 'socio_moroso' | 'ultimo_aviso'

export type CampaniaCobranza = {
  id: CampaniaCobranzaId
  label: string
  descripcion: string
  tono: string
  template: string
}

export type EstadoCuotaCobranza = 'moroso' | 'vencido' | 'pendiente'

export type EstadoEnvioFila =
  | 'no_seleccionado'
  | 'pendiente_envio'
  | 'enviado'
  | 'error'
  | 'numero_invalido'
  | 'cancelado'

export type FaseCobranzas = 'inicial' | 'confirmacion' | 'enviando' | 'finalizado' | 'historial'

export type EstadoFinalCampana = 'Finalizado' | 'Cancelado' | 'Con errores'

export type SocioCobranza = {
  id: string
  nombre: string
  telefono: string
  estadoCuota: EstadoCuotaCobranza
  mesAdeudado: string
  importeAdeudado: number
  activo: boolean
  estadoEnvio: EstadoEnvioFila
}

export type LogEntry = {
  id: string
  timestamp: string
  mensaje: string
}

export type SendProgress = {
  total: number
  enviados: number
  pendientes: number
  errores: number
  cancelados: number
  invalidos: number
}

export type ResumenCampana = {
  campaniaLabel: string
  seleccionados: number
  enviados: number
  errores: number
  cancelados: number
  invalidos: number
  fechaFin: string
}

export type CampanaHistorial = {
  id: string
  fechaInicio: string
  fechaFin: string | null
  tipoRecordatorio: string
  adminNombre: string
  adminEmail: string
  seleccionados: number
  enviados: number
  errores: number
  cancelados: number
  invalidos: number
  estadoFinal: EstadoFinalCampana
}

export type ResultadoEnvioMock = {
  ok: boolean
  error?: string
}
