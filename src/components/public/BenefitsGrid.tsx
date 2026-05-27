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
  if (kind === 'capacitacion') {
    return <span className="text-lg" aria-hidden="true">▣</span>
  }

  if (kind === 'data') {
    return <span className="text-lg" aria-hidden="true">◫</span>
  }

  if (kind === 'red') {
    return <span className="text-lg" aria-hidden="true">◎</span>
  }

  return <span className="text-lg" aria-hidden="true">◇</span>
}

export function BenefitsGrid({ services }: BenefitsGridProps) {
  return (
    <section id="servicios" className="rounded-[2rem] border border-slate-700/80 bg-slate-900/70 px-6 py-10 md:px-10 md:py-12">
      <PublicSectionHeader
        eyebrow="Servicios"
        title="Representacion sectorial con enfoque operativo"
        description="Acompanamos a concesionarias, agencias y pymes del ecosistema automotor con soporte institucional y herramientas concretas."
      />

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.title}
            className="rounded-2xl border border-slate-200/10 bg-white p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,1)]"
          >
            <p className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-slate-100 text-slate-700">
              <Icon kind={service.icon} />
            </p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
            <div className="mt-4">
              <PublicActionLink
                link={service.cta}
                className="text-sm font-semibold text-sky-700 transition hover:text-sky-500"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
