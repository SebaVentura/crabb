import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

type SitioWebModule = {
  id: string
  title: string
  description: string
  path?: string
  available?: boolean
}

const sitioWebModules: SitioWebModule[] = [
  {
    id: 'portada',
    title: 'Portada',
    description: 'Editar título principal, descripción, botones e imagen del inicio.',
    path: '/admin/sitio-web/portada',
    available: true,
  },
  {
    id: 'servicios',
    title: 'Servicios',
    description: 'Editar las tarjetas de servicios visibles en la landing pública.',
  },
  {
    id: 'programas-destacados',
    title: 'Programas destacados',
    description:
      'Editar campaña de inscripción, Data Técnica, Capacitaciones, CRABB Auxilio y Oportunidades.',
  },
  {
    id: 'contacto-redes',
    title: 'Contacto y redes',
    description: 'Editar dirección, email, teléfono, horarios y redes sociales.',
  },
  {
    id: 'footer',
    title: 'Footer',
    description: 'Editar información del pie de página, navegación y derechos reservados.',
  },
  {
    id: 'visibilidad',
    title: 'Visibilidad',
    description: 'Activar o desactivar secciones visibles en la landing pública.',
  },
]

export function AdminSitioWebPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Sitio Web"
        subtitle="Administrá el contenido visible de la landing pública de CRABB."
      />

      <Card className="border-slate-200 shadow-md">
        <p className="text-sm text-slate-600">
          Desde acá podés editar la web pública sin mezclarlo con el contenido institucional interno.
          La edición completa sigue disponible también en{' '}
          <span className="font-medium text-slate-800">Contenido institucional</span>.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sitioWebModules.map((module) => {
          if (module.available && module.path) {
            return (
              <Link
                key={module.id}
                to={module.path}
                className="group block text-left"
              >
                <Card className="h-full border-slate-200 shadow-md transition group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900">{module.title}</h3>
                    <Badge tone="green">Disponible</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{module.description}</p>
                </Card>
              </Link>
            )
          }

          return (
            <button
              key={module.id}
              type="button"
              disabled
              aria-disabled="true"
              className="group cursor-not-allowed text-left"
            >
              <Card className="h-full border-slate-200 shadow-md transition group-hover:border-slate-300">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">{module.title}</h3>
                  <Badge tone="yellow">Próximamente</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{module.description}</p>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
