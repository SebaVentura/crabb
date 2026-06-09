import type { NavItem } from '../../types'

const baseNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Institucional', path: '/institucional' },
  { label: 'Gestión de Socios', path: '/perfil' },
  { label: 'Data Técnica', path: '/data-tecnica' },
  { label: 'Capacitaciones', path: '/capacitaciones' },
]

export function getNavItems(role?: string): NavItem[] {
  const normalizedRole = (role ?? '').toLowerCase()
  const isAdmin = normalizedRole === 'admin' || normalizedRole === 'superadmin'

  if (!isAdmin) return baseNavItems

  return [
    ...baseNavItems,
    { label: 'Sitio Web', path: '/admin/sitio-web' },
    { label: 'Contenido institucional', path: '/admin' },
    { label: 'Cuotas de socios', path: '/admin/cuotas' },
    { label: 'Gestión de cobranzas', path: '/admin/gestion-cobranzas' },
  ]
}
