import { AdminDashboard } from '../components/dashboard/AdminDashboard'
import { SocioDashboard } from '../components/dashboard/SocioDashboard'
import { useAuth } from '../hooks/useAuth'
import { isAdminRole } from '../utils/adminAccess'

export function DashboardPage() {
  const { user } = useAuth()

  if (isAdminRole(user?.role)) {
    return <AdminDashboard />
  }

  return <SocioDashboard />
}
