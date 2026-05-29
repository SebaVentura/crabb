export type EstadoSocio = 'activo' | 'inactivo'

export type EstadoCuotaSocio = 'al-dia' | 'moroso' | 'vencido' | 'pendiente' | 'no_definido'

export type CategoriaSocio = 'socio' | 'adherente' | 'aportante'

export type CondicionSocio = 'socio' | 'adherente' | 'aportante'

export type Socio = {
  id: string
  nroSocio?: string
  nombreApellido?: string
  denominacionTaller?: string
  nombreRazonSocial: string
  dniCuit?: string
  cuitODni: string
  celular?: string
  telefono: string
  emails?: string[]
  ultimoPago?: string | null
  email: string
  direccion: string
  localidad: string
  rubro?: string
  categoria?: CategoriaSocio
  condicion?: CondicionSocio
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
