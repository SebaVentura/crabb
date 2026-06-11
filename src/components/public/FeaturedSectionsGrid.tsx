import type { ActionLink } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'

const TRAINING_EXTERNAL_URL = 'https://faatra.org.ar/capacitaciones/snit'

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
    description:
      'Nuevos cupos para empresas y profesionales vinculados al ecosistema automotor regional.',
    items: [
      'Alta institucional simplificada',
      'Acompañamiento en el proceso',
      'Agenda inicial de beneficios',
    ],
    cta: { label: 'Iniciar inscripción', url: '#contacto' },
    tone: 'primary' as const,
  },
  {
    key: 'data-tecnica',
    title: 'Data Técnica',
    description:
      'Compendio técnico y regulatorio para acompañar decisiones operativas en tiempo real.',
    items: [
      'Boletines normativos',
      'Fichas técnicas del sector',
      'Alertas de actualización',
    ],
    cta: { label: 'Data técnica', url: '#data-tecnica' },
    tone: 'secondary' as const,
  },
  {
    key: 'capacitaciones',
    title: 'Capacitaciones',
    description:
      'Cronograma anual con foco en profesionalización y actualización continua.',
    items: [
      'Talleres de gestión comercial',
      'Formación legal y tributaria',
      'Entrenamientos operativos',
    ],
    cta: { label: 'Capacitaciones', url: TRAINING_EXTERNAL_URL },
    tone: 'secondary' as const,
  },
  {
    key: 'auxilio',
    title: 'CRABB Auxilio',
    description:
      'Canal de acompañamiento para dudas operativas frecuentes y casos urgentes del sector.',
    items: [
      'Asesoramiento inicial',
      'Derivación especializada',
      'Seguimiento de casos',
    ],
    cta: { label: 'CRABB Auxilio', url: '#contacto' },
    tone: 'secondary' as const,
  },
  {
    key: 'opportunities',
    title: 'Nuevas Oportunidades',
    description:
      'Espacio para detectar alianzas, iniciativas y proyectos de crecimiento regional.',
    items: ['Rondas de negocios', 'Nuevos convenios', 'Networking sectorial'],
    cta: { label: 'Oportunidades', url: '#contacto' },
    tone: 'secondary' as const,
  },
] satisfies FeaturedItemPresentation[]

function SectionIcon({ keyName }: { keyName: string }) {
  if (keyName === 'campana') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M4 12L12 5L20 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 11.5V18.5H18V11.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 14H14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
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
        <path
          d="M3 9L12 4L21 9L12 14L3 9Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M7 11.5V15.1C7 16.5 9.3 18 12 18C14.7 18 17 16.5 17 15.1V11.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (keyName === 'auxilio') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 20L4 12L8 8L12 12L16 8L20 12L12 20Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M12 7V4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M5 17L10.5 11.5L14 15L19 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 10H19.8V11.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 20H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path
        d="M4 10.5L8 14.5L16 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function mergeFeaturedSections(sections: FeaturedSection[]): FeaturedItemPresentation[] {
  return featuredItemDefinitions.map((definition) => {
    const dynamicSection = sections.find((section) => section.key === definition.key)

    return {
      ...definition,
      title: dynamicSection?.title || definition.title,
      description: dynamicSection?.description || definition.description,
      items: dynamicSection?.items?.length ? dynamicSection.items : definition.items,
      cta: dynamicSection?.cta || definition.cta,
    }
  })
}

export function FeaturedSectionsGrid({ sections }: FeaturedSectionsGridProps) {
  const items = mergeFeaturedSections(sections)
  const primaryItem = items.find((item) => item.tone === 'primary') ?? items[0]
  const secondaryItems = items.filter((item) => item.key !== primaryItem.key)

  return (
    <section className="relative w-full overflow-hidden bg-transparent px-6 py-16 text-white sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-9 bg-sky-300/45" />
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-sky-200">
              Destacados
            </p>
            <span className="h-px w-9 bg-sky-300/45" />
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Programas activos para impulsar al sector
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-sky-100/78 sm:text-base">
            Cada bloque conecta gestión institucional con acciones concretas para socios,
            talleres y empresas del ecosistema automotor regional.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="group relative overflow-hidden rounded-[1.4rem] border border-sky-300/45 bg-gradient-to-br from-sky-300/16 via-blue-300/10 to-white/[0.055] p-5 text-white shadow-[0_26px_55px_-32px_rgba(2,12,31,0.8)] ring-1 ring-sky-300/25 backdrop-blur-md md:p-6 lg:col-span-1">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex rounded-full border border-sky-200/30 bg-sky-300/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-100">
                  Acceso prioritario
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-200/25 bg-sky-300/12 text-sky-100">
                  <SectionIcon keyName={primaryItem.key} />
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-semibold leading-tight text-white">
                {primaryItem.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-sky-100/76">
                {primaryItem.description}
              </p>

              <ul className="mt-6 space-y-3">
                {primaryItem.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-sky-50/84">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20">
                      <CheckIcon />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <PublicActionLink
                  link={primaryItem.cta}
                  className="inline-flex w-full justify-center rounded-full bg-sky-300 px-5 py-3 text-sm font-bold text-[#06213c] shadow-[0_18px_38px_rgba(56,189,248,0.18)] transition hover:bg-sky-200"
                />
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {secondaryItems.map((item) => (
              <article
                key={item.key}
                className="group relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-5 text-white shadow-[0_18px_44px_-34px_rgba(2,12,31,0.85)] ring-1 ring-white/[0.045] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-sky-200/25 hover:bg-white/[0.08]"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-100/72">
                      Programa activo
                    </span>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-200/16 bg-sky-300/8 text-sky-100">
                      <SectionIcon keyName={item.key} />
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold leading-tight text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-sky-100/68">
                    {item.description}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {item.items.map((listItem) => (
                      <li
                        key={listItem}
                        className="flex items-start gap-3 text-sm text-sky-50/76"
                      >
                        <span className="mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-sky-300/10 text-sky-100">
                          <CheckIcon />
                        </span>
                        <span>{listItem}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <PublicActionLink
                      link={item.cta}
                      className="inline-flex items-center rounded-full border border-sky-200/16 bg-white/[0.035] px-4 py-2 text-xs font-bold text-sky-100 transition hover:border-sky-200/35 hover:bg-sky-300/10 hover:text-white"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}