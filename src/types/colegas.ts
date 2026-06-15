import type { RubroSocio } from '../constants/rubros'

export type Colega = {
  id: string
  nroSocio?: string
  nombreRazonSocial: string
  nombreApellido?: string | null
  denominacionTaller?: string | null
  rubro: RubroSocio | string
  responsable?: string
  telefono?: string
  direccion?: string
  localidad?: string
}

/** @deprecated Use Colega */
export type SocioParaRecomendar = Colega

export type ColegasListResponse = {
  items: Colega[]
  pagination: {
    page: number
    perPage: number
    total: number
    lastPage: number
  } | null
}

export type FiltrosBusquedaColegas = {
  rubro: RubroSocio | ''
  nombre: string
  localidad: string
  telefono: string
  incluirMiRubro: boolean
  page: number
}
