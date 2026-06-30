export type CampaniaCobranzaId = string

export type CampaniaCobranza = {
  id: CampaniaCobranzaId
  label: string
  descripcion: string
  tono: string
  template: string
  realSendEnabled?: boolean
  provider?: string | null
  templateId?: string | null
  requiredVariables?: string[]
  disabledReason?: string | null
}

export type EstadoCuotaCobranza = 'moroso' | 'vencido' | 'pendiente'

export type EstadoEnvioFila =
  | 'sin_enviar'
  | 'seleccionado'
  | 'enviando'
  | 'enviado'
  | 'error'
  | 'sin_telefono_valido'

/** Alias operativo para estado de envío por socio */
export type DebtorSendStatus = EstadoEnvioFila

export type FaseCobranzas = 'inicial' | 'enviando' | 'resumen' | 'historial'

export type EstadoFinalCampana = 'Finalizado' | 'Cancelado' | 'Con errores'

export type SocioCobranza = {
  id: string
  nombre: string
  taller?: string
  telefono: string
  estadoCuota: EstadoCuotaCobranza
  mesAdeudado: string
  importeAdeudado: number
  cuotasPendientes?: number
  conceptosDeuda?: string
  activo: boolean
  estadoEnvio: EstadoEnvioFila
  errorEnvio?: string | null
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
  omitidos: number
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
