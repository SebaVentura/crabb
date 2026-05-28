import type { ActionLink } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'

export type FeaturedSection = {
  key: string
  title: string
  description: string
  items: string[]
  cta: ActionLink
}

type FeaturedSectionsGridProps = {
  sections: FeaturedSection[]
}

type FeaturedItemTone = 'primary' | 'secondary'

type FeaturedItemPresentation = {
  key: string
  title: string
  description: string
  items: string[]
  cta: ActionLink
  tone: FeaturedItemTone
}

const featuredItemDefinitions = [
  {
    key: 'campana',
    title: 'Campaña de inscripción',
    description: 'Nuevos cupos para empresas y profesionales vinculados al ecosistema automotor regional.',
    items: ['Alta institucional simplificada', 'Acompañamiento en el proceso', 'Agenda inicial de beneficios'],
    cta: { label: 'Iniciar inscripción', url: '#contacto' },
    tone: 'primary' as const,
  },
  {
    key: 'data-tecnica',
    title: 'Data Técnica',
    description: 'Compendio técnico y regulatorio para acompañar decisiones operativas en tiempo real.',
    items: ['Boletines normativos', 'Fichas técnicas del sector', 'Alertas de actualización'],
    cta: { label: 'Data técnica', url: '#data-tecnica' },
    tone: 'secondary' as const,
  },
  {
    key: 'capacitaciones',
    title: 'Capacitaciones',
    description: 'Cronograma anual con foco en profesionalización y actualización continua.',
    items: ['Talleres de gestión comercial', 'Formación legal y tributaria', 'Entrenamientos operativos'],
    cta: { label: 'Capacitaciones', url: '#capacitaciones' },
    tone: 'secondary' as const,
  },
  {
    key: 'auxilio',
    title: 'CRABB Auxilio',
    description: 'Canal de acompañamiento para dudas operativas frecuentes y casos urgentes del sector.',
    items: ['Asesoramiento inicial', 'Derivación especializada', 'Seguimiento de casos'],
    cta: { label: 'CRABB Auxilio', url: '#contacto' },
    tone: 'secondary' as const,
  },
  {
    key: 'opportunities',
    title: 'Nuevas Oportunidades',
    description: 'Espacio para detectar alianzas, iniciativas y proyectos de crecimiento regional.',
    items: ['Rondas de negocios', 'Nuevos convenios', 'Networking sectorial'],
    cta: { label: 'Oportunidades', url: '#contacto' },
    tone: 'secondary' as const,
  },
] satisfies Array<FeaturedItemPresentation>

function SectionIcon({ keyName }: { keyName: string }) {
  if (keyName === 'campana') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 12L12 5L20 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11.5V18.5H18V11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14H14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (keyName === 'data-tecnica') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M5 19V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M10 19V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15 19V12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M20 19V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (keyName === 'capacitaciones') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M3 9L12 4L21 9L12 14L3 9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M7 11.5V15.1C7 16.5 9.3 18 12 18C14.7 18 17 16.5 17 15.1V11.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (keyName === 'auxilio') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M12 20L4 12L8 8L12 12L16 8L20 12L12 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M12 7V4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M5 17L10.5 11.5L14 15L19 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10H19.8V11.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 20H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function FeaturedSectionsGrid({ sections }: FeaturedSectionsGridProps) {
  // TODO: reemplazar esta configuracion local por datos administrables desde Superadmin.
  const featuredItems: FeaturedItemPresentation[] = featuredItemDefinitions.map((definition) => {
    const section = sections.find((candidate) => candidate.key === definition.key)

    return {
      key: definition.key,
      title: section?.title?.trim() ? section.title : definition.title,
      description: section?.description?.trim() ? section.description : definition.description,
      items: section?.items?.length ? section.items.slice(0, 3) : definition.items,
      cta: section?.cta ?? definition.cta,
      tone: definition.tone,
    }
  })

  const primaryItem = featuredItems[0]
  const secondaryItems = featuredItems.slice(1)

  return (
    <section className="w-full bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">DESTACADOS</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
              Programas activos para impulsar al sector
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base lg:max-w-md lg:text-right">
              Cada bloque conecta gestion institucional con acciones concretas para socios, talleres y empresas del
              ecosistema automotor regional.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <article className="relative overflow-hidden rounded-[1.75rem] bg-[#0f2747] text-white shadow-[0_28px_60px_-34px_rgba(15,39,71,0.85)] lg:col-span-5">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10 bg-white/5" aria-hidden="true" />
            <div className="absolute bottom-6 right-6 h-20 w-20 rounded-full border border-blue-300/20 bg-blue-400/10" aria-hidden="true" />
            <div className="flex h-full flex-col p-7 sm:p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-blue-100">
                <SectionIcon keyName={primaryItem.key} />
              </div>

              <div className="mt-6 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200/80">Acceso prioritario</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">{primaryItem.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">{primaryItem.description}</p>
              </div>

              <ul className="mt-6 space-y-3">
                {primaryItem.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-100/95">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-blue-100" aria-hidden="true">
                      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none">
                        <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <PublicActionLink
                  link={primaryItem.cta}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-[#0f2747] transition hover:bg-blue-50"
                />
              </div>
            </div>
          </article>

          <div className="lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2">
              {secondaryItems.map((section) => (
                <article
                  key={section.key}
                  className="group flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                    <SectionIcon keyName={section.key} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{section.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.description}</p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <li
                        key={`${section.key}-${item}`}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4">
                    <PublicActionLink
                      link={section.cta}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:text-blue-800"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-blue-950/5 bg-[#0f2747] shadow-[0_24px_50px_-34px_rgba(15,39,71,0.75)]">
          <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Atencion institucional</p>
              <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">Necesitas ayuda o mas informacion?</p>
              <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
                Nuestro equipo esta para acompanarte y orientarte segun tu necesidad.
              </p>
            </div>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f2747] transition hover:bg-blue-50"
            >
              Contactanos
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
