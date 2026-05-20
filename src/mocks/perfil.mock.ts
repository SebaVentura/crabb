import type { RubroSocio } from '../constants/rubros'

/** Socio de sesión simulado (preview). Reemplazar por datos de API/auth. */
export const sesionSocioMock = {
  socioId: 's02',
  nombre: 'Juan Pérez',
  taller: 'JP Mecánica Integral',
  rubro: 'Taller integral' as RubroSocio,
  email: 'juan.perez@crabb.local',
  estadoCuota: 'vencida',
  beneficiosActivos: ['Descuento 20% en capacitaciones', 'Acceso a manuales CRABB'],
}

export const historialPagos = [
  { periodo: 'Enero 2026', estado: 'Pagado', monto: '$12.000' },
  { periodo: 'Febrero 2026', estado: 'Pagado', monto: '$12.000' },
  { periodo: 'Marzo 2026', estado: 'Pendiente', monto: '$12.000' },
]
