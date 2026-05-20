import type { NotificationItem } from '../types'

export const dashboardCards = [
  { title: 'Institucional', description: 'Autoridades, objetivos y socios', path: '/institucional' },
  { title: 'Gestión de Socios', description: 'Padrón, cuotas y estado de socios', path: '/perfil' },
  { title: 'Data Técnica', description: 'Búsqueda de fallas y fichas', path: '/data-tecnica' },
  { title: 'Capacitaciones', description: 'Agenda anual y cursos activos', path: '/capacitaciones' },
]

export const cuotaDashboard = {
  estado: 'vencida' as const,
  montoCuota: '12.000',
  moneda: 'ARS',
  vencimiento: '10/05/2026',
}

export const quickActions = [
  { label: 'Institucional', path: '/institucional' },
  { label: 'Gestión de Socios', path: '/perfil' },
  { label: 'Data Técnica', path: '/data-tecnica' },
  { label: 'Capacitaciones', path: '/capacitaciones' },
  { label: 'Buscar colegas', path: '/colegas' },
]

export const notifications: NotificationItem[] = [
  { id: 1, title: 'Asamblea mensual', detail: 'Jueves 20:00 hs en sede CRABB', type: 'info' },
  { id: 2, title: 'Cuota de abril', detail: 'Vence el 10/05/2026', type: 'warning' },
]
