export type SocioSolicitudEstado = 'pendiente' | 'observada' | 'aprobada' | 'rechazada'

export type SocioSolicitud = {
  id: number
  fecha: string
  createdAt: string
  nombreApellido: string
  denominacionTaller: string | null
  dniCuit: string | null
  email: string | null
  celular: string | null
  estado: SocioSolicitudEstado
  reviewedAt: string | null
  socioId: number | null
  posibleDuplicado: boolean
}

export type SocioSolicitudSummary = {
  total: number
  pendientes: number
  observadas: number
  aprobadas: number
  rechazadas: number
}

export type SocioSolicitudDuplicado = {
  id?: number | string
  nombreApellido?: string
  dniCuit?: string
  denominacionTaller?: string
  motivo?: string
}

export type SocioSolicitudDetail = SocioSolicitud & {
  direccion: string | null
  localidad: string | null
  rubro: string | null
  observaciones: string | null
  adminNotes: string | null
  rejectionReason: string | null
  socio: Record<string, unknown> | null
  duplicados: SocioSolicitudDuplicado[]
}

export type SocioSolicitudesFilters = {
  search?: string
  estado?: SocioSolicitudEstado | 'todas'
  dateFrom?: string
  dateTo?: string
  page?: number
  perPage?: number
}

export type SocioSolicitudesListResponse = {
  items: SocioSolicitud[]
  pagination: {
    page: number
    perPage: number
    total: number
    lastPage: number
  } | null
}

export type ApproveSocioSolicitudPayload = {
  admin_notes?: string
}

export type RejectSocioSolicitudPayload = {
  reason?: string
  admin_notes?: string
}

export type ObserveSocioSolicitudPayload = {
  admin_notes: string
}

export const ESTADO_SOLICITUD_LABELS: Record<SocioSolicitudEstado, string> = {
  pendiente: 'Pendiente',
  observada: 'Observada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

export const REJECT_REASON_OPTIONS = [
  'Datos incompletos',
  'Duplicado',
  'No corresponde',
  'Otro',
] as const
