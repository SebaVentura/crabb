export function isAdminRole(role?: string | null): boolean {
  const normalized = (role ?? '').trim().toLowerCase()
  return normalized === 'admin' || normalized === 'superadmin' || normalized === 'super_admin'
}
