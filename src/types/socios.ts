export type EstadoSocio = 'activo' | 'inactivo'

export type EstadoCuotaSocio = 'al-dia' | 'moroso' | 'vencido'

export type Socio = {
  id: string
  nombreRazonSocial: string
  cuitODni: string
  telefono: string
  email: string
  direccion: string
  localidad: string
  estado: EstadoSocio
  estadoCuota: EstadoCuotaSocio
  fechaAlta: string
  fechaUltimoPago: string
  montoCuota: number
  observaciones: string
}

export type IndicadoresSocios = {
  totalSocios: number
  sociosActivos: number
  sociosAlDia: number
  sociosMorosos: number
  pagosAlDiaMesActual: number
}
