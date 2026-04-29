import type { Capacitacion } from '../types'

export const calendarioAnual = [
  { mes: 'Enero', actividad: 'Actualización de diagnóstico electrónico' },
  { mes: 'Febrero', actividad: 'Gestión de taller y costos' },
  { mes: 'Marzo', actividad: 'Sistemas de frenos ABS' },
  { mes: 'Abril', actividad: 'Inyección diésel common rail' },
  { mes: 'Mayo', actividad: 'Electrónica automotriz avanzada' },
  { mes: 'Junio', actividad: 'Atención al cliente para talleres' },
]

export const proximasCapacitaciones: Capacitacion[] = [
  {
    id: 1,
    titulo: 'Diagnóstico de fallas eléctricas',
    mes: 'Mayo',
    modalidad: 'Presencial',
    costo: '$25.000',
    fecha: '15/05/2026',
  },
  {
    id: 2,
    titulo: 'Escáner y lectura de códigos',
    mes: 'Junio',
    modalidad: 'Virtual',
    costo: '$18.000',
    fecha: '03/06/2026',
  },
]

export const repositorioAnteriores = [
  'Mantenimiento preventivo integral (2025)',
  'Diagnóstico rápido en vehículos modernos (2025)',
  'Normativa y seguridad en talleres (2024)',
]
