import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { isAdminRole } from '../../utils/adminAccess'

const adminModuleLinks = [
  { title: 'Gestión de socios', description: 'Padrón, importación y administración del padrón', path: '/perfil' },
  { title: 'Cuotas de socios', description: 'Generación y seguimiento de cuotas', path: '/admin/cuotas' },
  { title: 'Gestión de cobranzas', description: 'Recordatorios y mensajes de cobranza', path: '/admin/gestion-cobranzas' },
  { title: 'Contenido institucional', description: 'Edición del contenido público institucional', path: '/admin/institucional' },
]

const adminQuickLinks = [
  { label: 'Gestión de socios', path: '/perfil' },
  { label: 'Cuotas', path: '/admin/cuotas' },
  { label: 'Cobranzas', path: '/admin/gestion-cobranzas' },
  { label: 'Institucional admin', path: '/admin/institucional' },
]

function DashboardModuleCard({
  title,
  description,
  to,
}: {
  title: string
  description: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-150 hover:border-blue-200/80 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:p-6"
    >
      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-4 text-sm font-semibold text-blue-700">Abrir módulo →</p>
    </Link>
  )
}

export function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <p className="text-xs uppercase tracking-wide text-slate-400">Panel administrador</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 md:text-2xl">
          Bienvenido, {user?.name ?? 'Administrador'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Accedé a las herramientas internas de administración de socios, cuotas y cobranzas.
        </p>
      </header>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-2">
          {adminQuickLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition duration-150 hover:border-blue-200/80 hover:bg-blue-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Administración</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {adminModuleLinks.map((card) => (
            <DashboardModuleCard key={card.path} title={card.title} description={card.description} to={card.path} />
          ))}
        </div>
      </div>

      <Card className="border-slate-200 shadow-md" title="Rol activo">
        <p className="text-sm text-slate-700">
          Sesión con permisos de <span className="font-semibold">{isAdminRole(user?.role) ? user?.role : 'admin'}</span>.
        </p>
      </Card>
    </div>
  )
}
