import type { NavItem } from '../../types'
import { isAdminRole } from '../../utils/adminAccess'

const mainNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Institucional', path: '/institucional' },
  { label: 'Buscar colegas', path: '/colegas' },
  { label: 'Data Técnica', path: '/data-tecnica' },
  { label: 'Capacitaciones', path: '/capacitaciones' },
]

const adminNavItems: NavItem[] = [
  { label: 'Gestión de socios', path: '/perfil' },
  { label: 'Solicitudes de socios', path: '/admin/solicitudes-socios' },
  { label: 'Cuotas de socios', path: '/admin/cuotas' },
  { label: 'Gestión de cobranzas', path: '/admin/gestion-cobranzas' },
  { label: 'Sitio Web', path: '/admin/sitio-web' },
  { label: 'Contenido institucional', path: '/admin/institucional' },
]

export function getMainNavItems(role?: string): NavItem[] {
  if (isAdminRole(role)) {
    return mainNavItems.filter((item) => item.path !== '/colegas')
  }

  return mainNavItems
}

export function getAdminNavItems(role?: string): NavItem[] {
  return isAdminRole(role) ? adminNavItems : []
}

export function getNavItems(role?: string): NavItem[] {
  return [...getMainNavItems(role), ...getAdminNavItems(role)]
}
