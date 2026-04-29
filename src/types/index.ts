export type NavItem = {
  label: string
  path: string
}

export type NotificationItem = {
  id: number
  title: string
  detail: string
  type: 'info' | 'warning'
}

export type CuotaEstado = 'al-dia' | 'vencida'

export type Capacitacion = {
  id: number
  titulo: string
  mes: string
  modalidad: 'Virtual' | 'Presencial'
  costo: string
  fecha: string
}

export type ResultadoTecnico = {
  id: number
  marca: string
  modelo: string
  sistema: string
  sintoma: string
  codigo: string
  diagnostico: string
  causas: string[]
  solucion: string
  fuente?: string
  notasTecnicas?: string
}
