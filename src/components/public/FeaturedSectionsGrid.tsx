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

function CheckIcon({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const strokeColor = tone === 'dark' ? 'currentColor' : 'currentColor'

  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M4 10.5L8 14.5L16 6.5" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionEyebrow({ tone }: { tone: FeaturedItemTone }) {
  return (
    <span
      className={
        tone === 'primary'
          ? 'inline-flex rounded-full border border-cyan-400/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sky-100'
          : 'inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-blue-700'
      }
    >
      {tone === 'primary' ? 'Acceso prioritario' : 'Programa activo'}
    </span>
  )
}

function isUnsafePublicHref(href?: string) {
  if (!href) return true

  const normalized = href.trim().toLowerCase()
  return normalized.includes('admin') || normalized.includes('/login') || normalized.includes('/#/admin')
}

function getSafePublicHref(href: string | undefined, fallbackHref: string) {
  return isUnsafePublicHref(href) ? fallbackHref : href
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
  const secondaryGridClass =
    secondaryItems.length <= 1
      ? 'grid-cols-1'
      : secondaryItems.length === 2
        ? 'grid-cols-1 sm:grid-cols-2 mx-auto max-w-4xl'
        : secondaryItems.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl'
          : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-2'

  return (
    <section className="w-full bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-700">DESTACADOS</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
            Programas activos para impulsar al sector
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
            Cada bloque conecta gestión institucional con acciones concretas para socios, talleres y empresas del
            ecosistema automotor regional.
          </p>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <article className="relative overflow-hidden rounded-[2rem] bg-[#0f2747] text-white shadow-[0_28px_60px_-36px_rgba(15,39,71,0.8)] lg:col-span-5">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-white/10 bg-white/5" aria-hidden="true" />
            <div className="absolute bottom-6 right-6 h-24 w-24 rounded-full border border-blue-300/20 bg-blue-400/10" aria-hidden="true" />
            <div className="flex h-full flex-col p-7 sm:p-8 lg:p-9">
              <SectionEyebrow tone="primary" />

              <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sky-100 shadow-[0_16px_30px_-20px_rgba(255,255,255,0.35)]">
                <SectionIcon keyName={primaryItem.key} />
              </div>

              <div className="mt-7 max-w-xl">
                <h3 className="text-2xl font-semibold leading-tight text-white sm:text-[2rem]">{primaryItem.title}</h3>
                <p className="mt-4 text-sm leading-7 text-sky-100/90 sm:text-base">{primaryItem.description}</p>
              </div>

              <ul className="mt-7 space-y-3">
                {primaryItem.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sky-50/90">
                    <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-100 ring-1 ring-white/15" aria-hidden="true">
                      <CheckIcon tone="dark" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <PublicActionLink
                  link={{
                    ...primaryItem.cta,
                    url: getSafePublicHref(primaryItem.cta.url, '/contacto') ?? '/contacto',
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-[#0f2747] transition duration-200 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2747]"
                />
              </div>
            </div>
          </article>

          <div className="lg:col-span-7">
            <div className={`grid gap-6 ${secondaryGridClass}`}>
              {secondaryItems.map((section) => (
                <article
                  key={section.key}
                  className="group flex h-full min-h-[280px] flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.22)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_48px_-30px_rgba(15,23,42,0.28)]"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                    <SectionIcon keyName={section.key} />
                  </div>

                  <div className="mt-5">
                    <SectionEyebrow tone="secondary" />
                    <h3 className="mt-4 text-lg font-semibold leading-tight text-slate-900 md:text-xl">{section.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{section.description}</p>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {section.items.map((item) => (
                      <li key={`${section.key}-${item}`} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100" aria-hidden="true">
                          <CheckIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <PublicActionLink
                      link={{
                        ...section.cta,
                        url: getSafePublicHref(section.cta.url, section.key === 'data-tecnica' ? '/data-tecnica' : section.key === 'capacitaciones' ? '/capacitaciones' : '/contacto') ?? '/contacto',
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800 transition duration-200 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    />
                    <span className="ml-2 inline-flex text-sky-700 transition duration-200 group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-blue-950/5 bg-white shadow-[0_18px_40px_-30px_rgba(15,39,71,0.22)]">
          <div className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Atención institucional</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">¿Necesitás ayuda o más información?</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Nuestro equipo está para acompañarte y orientarte según tu necesidad.
              </p>
            </div>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Contactanos →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
