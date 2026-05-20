import type { RubroSocio } from '../constants/rubros'

export type SocioParaRecomendar = {
  id: string
  nombreRazonSocial: string
  rubro: RubroSocio
  responsable?: string
  telefono?: string
  direccion?: string
  localidad?: string
}

export type FiltrosBusquedaColegas = {
  rubro: RubroSocio | ''
  nombre: string
  localidad: string
  telefono: string
  incluirMiRubro: boolean
}
