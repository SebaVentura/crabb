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
        ? 'grid-cols-1 sm:grid-cols-2'
        : secondaryItems.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2'

  return (
    <section className="relative w-full overflow-hidden bg-slate-100 pb-12 sm:pb-14 lg:pb-16">
      <div className="relative overflow-hidden bg-[#0b1f3a] pb-14 pt-14 sm:pb-18 sm:pt-16 lg:pb-24 lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.2),transparent_38%),radial-gradient(circle_at_82%_0%,rgba(96,165,250,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:46px_46px]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12 2xl:px-16">
          <header className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">DESTACADOS</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">
            Programas activos para impulsar al sector
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">
              Cada bloque conecta gestión institucional con acciones concretas para socios, talleres y empresas del
              ecosistema automotor regional.
            </p>
          </header>
        </div>
      </div>

      <div className="relative mx-auto mt-0 w-full max-w-[1500px] px-5 sm:-mt-14 sm:px-8 lg:-mt-16 lg:px-12 2xl:px-16">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6 xl:gap-7">
          <article className="relative overflow-hidden self-start rounded-[1.6rem] border border-slate-200/70 bg-gradient-to-br from-[#103057] to-[#0f2747] text-white shadow-[0_24px_55px_-34px_rgba(8,22,43,0.88)] lg:col-span-5">
            <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full border border-white/15 bg-white/8" aria-hidden="true" />
            <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-blue-300/12 blur-xl" aria-hidden="true" />

            <div className="flex flex-col p-5 sm:p-6 lg:p-7">
              <SectionEyebrow tone="primary" />

              <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-sky-100">
                <SectionIcon keyName={primaryItem.key} />
              </div>

              <div className="mt-4 max-w-2xl">
                <h3 className="text-xl font-semibold leading-tight text-white sm:text-2xl">{primaryItem.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-sky-100/95 sm:text-[0.97rem]">{primaryItem.description}</p>
              </div>

              <ul className="mt-4 space-y-2.5">
                {primaryItem.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-sky-50/95">
                    <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/12 text-sky-100 ring-1 ring-white/20" aria-hidden="true">
                      <CheckIcon tone="dark" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-1">
                <PublicActionLink
                  link={{
                    ...primaryItem.cta,
                    url: getSafePublicHref(primaryItem.cta.url, '/contacto') ?? '/contacto',
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#0f2747] transition duration-200 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2747]"
                />
              </div>
            </div>
          </article>

          <div className="lg:col-span-7">
            <div className={`grid gap-5 sm:gap-6 ${secondaryGridClass}`}>
              {secondaryItems.map((section) => (
                <article
                  key={section.key}
                  className="group flex h-full min-h-[255px] flex-col rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.26)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_20px_40px_-28px_rgba(15,23,42,0.28)] sm:p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <SectionIcon keyName={section.key} />
                  </div>

                  <div className="mt-4">
                    <SectionEyebrow tone="secondary" />
                    <h3 className="mt-3 text-lg font-semibold leading-tight text-slate-900">{section.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-slate-600">{section.description}</p>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {section.items.map((item) => (
                      <li key={`${section.key}-${item}`} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100" aria-hidden="true">
                          <CheckIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <PublicActionLink
                      link={{
                        ...section.cta,
                        url: getSafePublicHref(section.cta.url, section.key === 'data-tecnica' ? '/data-tecnica' : section.key === 'capacitaciones' ? '/capacitaciones' : '/contacto') ?? '/contacto',
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 transition duration-200 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
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

        <div className="mt-6 overflow-hidden rounded-[1.2rem] border border-blue-100 bg-gradient-to-r from-[#edf4ff] via-[#f7fbff] to-[#eef6ff] shadow-[0_10px_24px_-22px_rgba(15,39,71,0.45)] sm:mt-7">
          <div className="flex flex-col gap-3 px-5 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-blue-700">Atención institucional</p>
              <p className="mt-1.5 text-base font-semibold text-slate-900 sm:text-lg">¿Necesitás ayuda o más información?</p>
              <p className="mt-1.5 text-sm text-slate-600">Nuestro equipo está para acompañarte y orientarte según tu necesidad.</p>
            </div>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Contactanos →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
