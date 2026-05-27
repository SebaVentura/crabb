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

export function FeaturedSectionsGrid({ sections }: FeaturedSectionsGridProps) {
  return (
    <section className="rounded-[2rem] border border-slate-700/80 bg-slate-900 px-6 py-10 md:px-10 md:py-12">
      <PublicSectionHeader
        centered
        eyebrow="Destacados"
        title="Programas activos para impulsar al sector"
        description="Cada bloque conecta gestion institucional con acciones concretas en el territorio."
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <article key={section.key} className="rounded-2xl border border-sky-200/20 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold text-slate-100">{section.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{section.description}</p>

            {section.items.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {section.items.slice(0, 3).map((item, index) => (
                  <li
                    key={`${section.key}-${index}`}
                    className="rounded-md border border-slate-700/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-4">
              <PublicActionLink
                link={section.cta}
                className="text-sm font-semibold text-sky-300 transition hover:text-sky-200"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
