import type { ActionLink } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'
import { PublicSectionHeader } from './PublicSectionHeader'

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

function SectionIcon({ keyName }: { keyName: string }) {
  if (keyName === 'campana') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 12L12 5L20 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 11.5V18.5H18V11.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M5 17L10.5 11.5L14 15L19 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10H19.8V11.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 20H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function FeaturedSectionsGrid({ sections }: FeaturedSectionsGridProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#06111f] px-6 py-24 sm:py-28 lg:px-8">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto max-w-7xl">
        <PublicSectionHeader
          centered
          eyebrow="DESTACADOS"
          title="Programas activos para impulsar al sector"
          description="Cada bloque conecta gestion institucional con acciones concretas en el territorio."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {sections.map((section, index) => {
            const cardClass = index < 3 ? 'xl:col-span-2' : index === 4 ? 'xl:col-span-4' : 'xl:col-span-2'

            return (
              <article
                key={section.key}
                className={`${cardClass} rounded-2xl border border-sky-300/25 bg-slate-900/65 p-6 shadow-[0_24px_55px_-36px_rgba(6,17,31,1)] backdrop-blur-sm`}
              >
                <p className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-300/35 bg-sky-400/10 text-sky-200">
                  <SectionIcon keyName={section.key} />
                </p>

                <h3 className="mt-4 text-xl font-semibold text-slate-100">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{section.description}</p>

                {section.items.length > 0 ? (
                  <ul className="mt-5 space-y-2">
                    {section.items.slice(0, 3).map((item, itemIndex) => (
                      <li
                        key={`${section.key}-${itemIndex}`}
                        className="rounded-md border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 transition hover:text-sky-200">
                  <PublicActionLink link={section.cta} className="text-inherit" />
                  <span>&rarr;</span>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-sky-300/25 bg-slate-900/60 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-semibold text-slate-100">Necesitas ayuda o mas informacion?</p>
            <p className="mt-1 text-sm text-slate-300">Nuestro equipo esta para acompanarte.</p>
          </div>
          <a
            href="#contacto"
            className="rounded-md border border-sky-300/40 bg-sky-400/15 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-200/60 hover:bg-sky-400/25"
          >
            Contactanos
          </a>
        </div>
      </div>
    </section>
  )
}
