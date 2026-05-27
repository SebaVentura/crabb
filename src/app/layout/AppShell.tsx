import { Outlet, useLocation } from 'react-router-dom'
import { TopHeader } from '../../components/layout/TopHeader'
import { BottomNav } from '../../components/navigation/BottomNav'
import { Sidebar } from '../../components/navigation/Sidebar'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/institucional': 'Institucional',
  '/capacitaciones': 'Capacitaciones',
  '/data-tecnica': 'Data Técnica',
  '/perfil': 'Gestión de Socios',
  '/colegas': 'Buscar colegas',
  '/admin': 'Administración',
  '/admin/institucional': 'Contenido institucional',
}

export function AppShell() {
  const location = useLocation()
  const title = titles[location.pathname] ?? 'CRABB'

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <TopHeader title={title} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
