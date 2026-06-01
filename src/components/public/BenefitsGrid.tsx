import type { ActionLink, LandingService } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'
import { PublicSectionHeader } from './PublicSectionHeader'

type ServiceWithAction = LandingService & {
  cta?: ActionLink
  icon?: 'representacion' | 'capacitacion' | 'data' | 'red'
}

type BenefitsGridProps = {
  services: ServiceWithAction[]
}

function Icon({ kind }: { kind: ServiceWithAction['icon'] }) {
  if (kind === 'representacion') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4 9.5L12 5L20 9.5V18H4V9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 18V13.5H16V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 9.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M10 9.5V13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 9.5V13.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === 'capacitacion') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4 9.5L12 5L20 9.5L12 14L4 9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M7 11V15.2C7 16.6 9.2 18 12 18C14.8 18 17 16.6 17 15.2V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === 'data') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4 18V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 18H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7.5 14.5L10.5 11.5L13.2 13.8L17.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17.5" cy="9.5" r="1" fill="currentColor" />
      </svg>
    )
  }

  if (kind === 'red') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <circle cx="6" cy="12" r="1.6" fill="currentColor" />
        <circle cx="12" cy="7" r="1.6" fill="currentColor" />
        <circle cx="18" cy="12" r="1.6" fill="currentColor" />
        <circle cx="12" cy="17" r="1.6" fill="currentColor" />
        <path d="M7.2 11.2L10.8 8.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M13.2 8.3L16.8 11.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.2 12.8L10.8 15.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M13.2 15.7L16.8 12.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M6 9.5L12 5.5L18 9.5V18H6V9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 18V12.8H15V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function BenefitsGrid({ services }: BenefitsGridProps) {
  const fallbackServices = [
    { label: 'Ver institucional', href: '/institucional' },
    { label: 'Ver capacitaciones', href: '/capacitaciones' },
    { label: 'Explorar data tecnica', href: '/data-tecnica' },
    { label: 'Contactar a CRABB', href: '/contacto' },
  ]

  const isUnsafePublicHref = (href?: string | null) => {
    if (!href) return true

    const normalized = href.trim().toLowerCase()
    return (
      normalized.includes('admin') ||
      normalized.includes('/#/admin') ||
      normalized.includes('/admin') ||
      normalized.includes('login')
    )
  }

  const gridColumnsClass =
    services.length === 1
      ? 'mx-auto max-w-xl grid-cols-1'
      : services.length === 2
        ? 'mx-auto max-w-4xl grid-cols-1 sm:grid-cols-2'
        : services.length === 3
          ? 'mx-auto max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'

  return (
    <section id="servicios" className="w-full bg-slate-50 px-6 py-24 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PublicSectionHeader
          tone="dark"
          eyebrow="SERVICIOS"
          title="Representacion sectorial con enfoque operativo"
          description="Acompanamos a concesionarias, agencias y pymes del ecosistema automotor con soporte institucional y herramientas concretas."
          centered
          className="mx-auto max-w-3xl"
        />

        <div className={`mt-14 grid gap-7 ${gridColumnsClass}`}>
          {services.map((service, index) => {
            const fallbackCta = fallbackServices[index] ?? fallbackServices[0]
            const ctaHref = isUnsafePublicHref(service.cta?.url) ? fallbackCta.href : service.cta?.url
            const cta = service.cta?.label || service.cta?.url
              ? {
                  label: service.cta?.label || fallbackCta.label,
                  url: ctaHref || fallbackCta.href,
                }
              : { label: fallbackCta.label, url: fallbackCta.href }

            return (
            <article
              key={service.title}
              className="group flex min-h-[340px] h-full flex-col rounded-[2rem] border border-blue-100/80 bg-white p-9 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_60px_-30px_rgba(15,23,42,0.3)]"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex flex-col items-start">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-sky-100 bg-sky-50 text-sky-700 shadow-[0_14px_28px_-18px_rgba(14,165,233,0.45)]">
                    <Icon kind={service.icon} />
                  </div>
                  <h3 className="mt-7 text-[1.1rem] font-semibold leading-tight text-slate-900 sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-sm leading-7 text-slate-600">
                    {service.description}
                  </p>
                </div>

                <div className="mt-auto pt-7">
                  <PublicActionLink
                    link={cta}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition duration-200 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                  />
                  <span className="ml-1 inline-flex text-sky-700 transition duration-200 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </div>
              </div>
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
