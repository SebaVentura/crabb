import type { ActionLink, LandingHeroVisual } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'

type HeroKpi = {
  label: string
  value: string
}

type PublicHeroProps = {
  badge: string
  title: string
  description: string
  primaryCta: ActionLink
  secondaryCta: ActionLink
  imageUrl: string
  imageAlt: string
  values?: string[]
  visual?: LandingHeroVisual
  kpis?: HeroKpi[]
}

const fallbackHeroContent = {
  badge: 'JUNTOS MOVEMOS MAS',
  title: 'Camara de Reparacion de Automotores de Bahia Blanca',
  description:
    'Representamos, acompanamos y fortalecemos a talleres, concesionarias, agencias y pymes vinculadas al ecosistema automotor regional.',
  values: ['Trabajo conjunto', 'Profesionalismo', 'Cercania', 'Compromiso regional'],
  visualTitle: 'Sector automotor regional',
  visualSubtitle: 'Representacion, gestion y formacion para empresas del ecosistema automotor.',
  visualModules: ['Representacion institucional', 'Gestion y asesoramiento', 'Capacitacion continua'],
  regionTag: 'Bahia Blanca y region',
}

export function PublicHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageUrl,
  imageAlt,
  values = [],
  visual,
  kpis = [],
}: PublicHeroProps) {
  const hasHeroImage = imageUrl.trim().length > 0
  const heroValues = values.length > 0 ? values : fallbackHeroContent.values
  const visualModules = visual?.items && visual.items.length > 0 ? visual.items : fallbackHeroContent.visualModules
  const visualTitle = visual?.title?.trim() || fallbackHeroContent.visualTitle
  const visualSubtitle = visual?.description?.trim() || fallbackHeroContent.visualSubtitle
  const regionTag = visual?.region_label?.trim() || fallbackHeroContent.regionTag

  const primaryLink: ActionLink = {
    ...primaryCta,
    label: primaryCta.label || 'Conocer la institucion',
    url: primaryCta.url || '/institucional',
  }

  const secondaryLink: ActionLink = {
    ...secondaryCta,
    label: secondaryCta.label || 'Ver servicios',
    url: secondaryCta.url || '#servicios',
  }

  return (
    <section id="inicio" className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
              {badge || fallbackHeroContent.badge}
            </p>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {title || fallbackHeroContent.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {description || fallbackHeroContent.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <PublicActionLink
                link={primaryLink}
                className="rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              />
              <PublicActionLink
                link={secondaryLink}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {heroValues.map((value) => (
                <article key={value} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5">
                  <p className="text-xs font-medium text-slate-700">{value}</p>
                </article>
              ))}
            </div>

            {kpis.length > 0 ? (
              <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {kpis.map((item) => (
                  <article key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="w-full lg:justify-self-end">
            {hasHeroImage ? (
              <article className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.2)] sm:p-5">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={imageUrl}
                    alt={imageAlt || 'Imagen institucional de CRABB'}
                    loading="lazy"
                    className="h-[320px] w-full object-cover sm:h-[400px]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent px-4 pb-4 pt-10 text-white sm:px-5 sm:pb-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">Vision institucional</p>
                    <p className="mt-1 text-sm font-medium leading-snug sm:text-base">{visualTitle}</p>
                  </div>
                </div>
              </article>
            ) : (
              <article className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.2)] sm:p-7">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60" aria-hidden="true" />
                <div className="absolute bottom-5 right-6 h-16 w-16 rounded-full border border-blue-200/70 bg-white/80" aria-hidden="true" />

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Vision institucional</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-900 sm:text-[1.75rem]">
                    {visualTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{visualSubtitle}</p>
                </div>

                <div className="relative mt-6 grid gap-3">
                  {visualModules.map((module) => (
                    <article key={module} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                        <p className="text-sm font-medium text-slate-700">{module}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="relative mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">{regionTag}</p>
                </div>
              </article>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
