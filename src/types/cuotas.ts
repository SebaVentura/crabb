export type EstadoCuota = 'pendiente' | 'vencida' | 'pagada' | 'anulada'

export type CuotaSocio = {
  id: string
  socioId: string
  nombreSocio: string
  denominacionTaller: string
  telefono: string
  periodo: string
  concepto: string
  importe: number
  fechaVencimiento: string
  estado: EstadoCuota
}

export type CuotasResumen = {
  totalCuotas: number
  pendientes: number
  vencidas: number
  pagadas: number
  importePendiente: number
}

export type CuotasListResponse = {
  items: CuotaSocio[]
  pagination: {
    page: number
    perPage: number
    total: number
    lastPage: number
  } | null
}

export type CuotasFilters = {
  search?: string
  periodo?: string
  estado?: EstadoCuota | ''
  page?: number
  per_page?: number
}

export type GenerarCuotasPayload = {
  periodo: string
  concepto: string
  importe: number
  fecha_vencimiento: string
}

export const ESTADO_CUOTA_LABELS: Record<EstadoCuota, string> = {
  pendiente: 'Pendiente',
  vencida: 'Vencida',
  pagada: 'Pagada',
  anulada: 'Anulada',
}
