import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { cuotaDashboard, dashboardCards, notifications, quickActions } from '../mocks/dashboard.mock'

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
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
            <span translate="no" className="notranslate">
              CRABB
            </span>
          </h1>
          <p className="text-sm text-slate-600">Delegación Bahía Blanca</p>
          <p className="mt-1 text-sm text-slate-500">Panel institucional de socios</p>
        </div>
      </div>
    </header>
  )
}

function DashboardQuotaCard({ className = '' }: { className?: string }) {
  const vencida = cuotaDashboard.estado === 'vencida'

  return (
    <Card className={`border-slate-200 shadow-md ${className}`} title="Estado de cuota">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={vencida ? 'red' : 'gray'}>{vencida ? 'Vencida' : 'Al día'}</Badge>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">
        {cuotaDashboard.moneda} ${cuotaDashboard.montoCuota}
      </p>
      <p className="mt-1 text-sm text-slate-600">Vencimiento: {cuotaDashboard.vencimiento}</p>
      <button
        type="button"
        disabled
        className="mt-4 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition duration-150"
      >
        Pagar cuota (Próximamente)
      </button>
    </Card>
  )
}

function DashboardQuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Accesos rápidos</h2>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((item) => (
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

function DashboardNotificationsCard({ className = '' }: { className?: string }) {
  return (
    <Card className={`shadow-md ${className}`} title="Notificaciones">
      <ul className="space-y-2">
        {notifications.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border p-3 text-sm ${
              item.type === 'warning'
                ? 'border-rose-200 bg-rose-50/80'
                : 'border-blue-200 bg-blue-50/60'
            }`}
          >
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-slate-600">{item.detail}</p>
          </li>
        ))}
      </ul>
    </Card>
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
            {dashboardCards.map((card) => (
              <DashboardModuleCard
                key={card.path}
                title={card.title}
                description={card.description}
                to={card.path}
              />
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <DashboardNotificationsCard />
        </div>
      </div>

      <div className="hidden min-w-0 lg:col-start-2 lg:row-start-2 lg:flex lg:flex-col lg:gap-6 lg:self-start">
        <DashboardQuotaCard />
        <DashboardNotificationsCard />
      </div>
    </div>
  )
}
