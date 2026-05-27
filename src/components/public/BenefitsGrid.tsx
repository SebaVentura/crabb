import type { ActionLink, LandingService } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'
import { PublicSectionHeader } from './PublicSectionHeader'

type ServiceWithAction = LandingService & {
  cta: ActionLink
  icon: 'representacion' | 'capacitacion' | 'data' | 'red'
}

type BenefitsGridProps = {
  services: ServiceWithAction[]
}

function Icon({ kind }: { kind: ServiceWithAction['icon'] }) {
  if (kind === 'representacion') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <circle cx="8" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4.5 17.5V16C4.5 14.3 5.8 13 7.5 13H8.5C10.2 13 11.5 14.3 11.5 16V17.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12.5 17.5V16C12.5 14.3 13.8 13 15.5 13H16.5C18.2 13 19.5 14.3 19.5 16V17.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (kind === 'capacitacion') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M3 9L12 4L21 9L12 14L3 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path
          d="M7 11.2V15.1C7 16.5 9.3 18 12 18C14.7 18 17 16.5 17 15.1V11.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M21 9V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  if (kind === 'data') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 18V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 18H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M7 14L10.2 10.8L13.3 13.2L18 8.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="8.5" r="1.1" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M8.6 12C10 13.6 11 14.4 12 15.1C13 14.4 14 13.6 15.4 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12L7.8 7.7C8.8 6.7 10.4 6.7 11.4 7.7L12 8.3L12.6 7.7C13.6 6.7 15.2 6.7 16.2 7.7L20.5 12L16.2 16.3C15.2 17.3 13.6 17.3 12.6 16.3L12 15.7L11.4 16.3C10.4 17.3 8.8 17.3 7.8 16.3L3.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BenefitsGrid({ services }: BenefitsGridProps) {
  return (
    <section id="servicios" className="w-full bg-slate-50 px-6 py-24 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PublicSectionHeader
          tone="dark"
          eyebrow="SERVICIOS"
          title="Representacion sectorial con enfoque operativo"
          description="Acompanamos a concesionarias, agencias y pymes del ecosistema automotor con soporte institucional y herramientas concretas."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.28)]"
            >
              <p className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700">
                <Icon kind={service.icon} />
              </p>
              <h3 className="mt-5 text-xl font-semibold leading-tight text-slate-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-500">
                <PublicActionLink link={service.cta} className="text-inherit" />
                <span className="transition group-hover:translate-x-0.5">&rarr;</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
