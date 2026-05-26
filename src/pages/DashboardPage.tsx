import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'

const moduleLinks = [
  { title: 'Institucional', description: 'Información institucional de la entidad', path: '/institucional' },
  { title: 'Gestión de Socios', description: 'Padrón, estado y administración de socios', path: '/perfil' },
  { title: 'Data Técnica', description: 'Consulta de información técnica y recursos externos', path: '/data-tecnica' },
  { title: 'Capacitaciones', description: 'Oferta y cronograma de actividades formativas', path: '/capacitaciones' },
]

const quickActionLinks = [
  { label: 'Institucional', path: '/institucional' },
  { label: 'Gestión de Socios', path: '/perfil' },
  { label: 'Data Técnica', path: '/data-tecnica' },
  { label: 'Capacitaciones', path: '/capacitaciones' },
  { label: 'Buscar colegas', path: '/colegas' },
]

function DashboardInstitutionalHeader() {
  const [logoMissing, setLogoMissing] = useState(false)
  const logoCrabbUrl = `${import.meta.env.BASE_URL}logo-crabb.jpg`

  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:h-16 sm:w-16">
          {!logoMissing ? (
            <img
              src={logoCrabbUrl}
              alt=""
              width={64}
              height={64}
              decoding="async"
              className="max-h-full max-w-full object-contain"
              onError={() => setLogoMissing(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-900 text-center text-[10px] font-black leading-tight tracking-tighter text-white sm:text-xs"
              aria-hidden
            >
              <span translate="no" className="notranslate">
                CRABB
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold leading-tight text-slate-900 md:text-2xl">
            <span translate="no" className="notranslate">
              CRABB
            </span>
          </h1>
          <p className="text-sm font-medium leading-tight text-blue-600">Seccional Bahía Blanca</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Panel institucional de socios</p>
        </div>
      </div>
    </header>
  )
}

function DashboardQuotaCard({ className = '' }: { className?: string }) {
  return (
    <Card className={`border-slate-200 shadow-md ${className}`} title="Indicadores administrativos">
      <p className="text-sm text-slate-700">
        Los indicadores administrativos se habilitarán cuando estén conectados a datos reales.
      </p>
    </Card>
  )
}

function DashboardQuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Accesos rápidos</h2>
      <div className="flex flex-wrap gap-2">
        {quickActionLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition duration-150 hover:border-blue-200/80 hover:bg-blue-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

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

export function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_min(18rem,34%)] lg:gap-x-8 lg:gap-y-6">
      <div className="lg:col-span-2">
        <DashboardInstitutionalHeader />
      </div>

      <div className="flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-start-2">
        <DashboardQuickActions />

        <div className="min-w-0">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Módulos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {moduleLinks.map((card) => (
              <DashboardModuleCard
                key={card.path}
                title={card.title}
                description={card.description}
                to={card.path}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 lg:col-start-2 lg:row-start-2 lg:flex lg:flex-col lg:gap-6 lg:self-start">
        <DashboardQuotaCard />
      </div>
    </div>
  )
}
