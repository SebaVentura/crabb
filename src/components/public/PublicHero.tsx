import type { ActionLink } from '../../types/institutional'
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
  kpis?: HeroKpi[]
}

export function PublicHero({ primaryCta, secondaryCta, kpis = [] }: PublicHeroProps) {
  const eyebrowText = 'Juntos movemos mas'
  const headingText = 'Camara de Reparacion de Automotores de Bahia Blanca'
  const descriptionText =
    'Representamos, acompanamos y fortalecemos a talleres, concesionarias, agencias y pymes vinculadas al ecosistema automotor regional.'

  // TODO: reemplazar esta configuracion local por datos administrables desde Superadmin.
  const heroVisual: {
    imageSrc: string | null
    alt: string
    caption: string
  } = {
    imageSrc: null,
    alt: 'Imagen institucional CRABB',
    caption: 'Representacion institucional del sector automotor',
  }

  // TODO: reemplazar microvalores por contenido configurable desde Superadmin.
  const institutionalValues = [
    'Trabajo conjunto',
    'Profesionalismo',
    'Cercania',
    'Compromiso regional',
  ]

  // TODO: reemplazar highlights por contenido configurable desde Superadmin.
  const heroHighlights = [
    'Representacion institucional',
    'Gestion y asesoramiento',
    'Capacitacion continua',
  ]

  const primaryLink: ActionLink = {
    ...primaryCta,
    label: 'Conocer la institucion',
    url: primaryCta.url || '/institucional',
  }

  const secondaryLink: ActionLink = {
    ...secondaryCta,
    label: 'Ver servicios',
    url: secondaryCta.url || '#servicios',
  }

  return (
    <section id="inicio" className="w-full bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,460px)] lg:gap-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
              {eyebrowText}
            </p>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {headingText}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {descriptionText}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <PublicActionLink
                link={primaryLink}
                className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              />
              <PublicActionLink
                link={secondaryLink}
                className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {institutionalValues.map((value) => (
                <article key={value} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                  <div className="mb-1 h-1.5 w-8 rounded-full bg-sky-500/60" aria-hidden="true" />
                  <p className="text-xs font-medium text-slate-700">{value}</p>
                </article>
              ))}
            </div>

            {kpis.length > 0 ? (
              <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {kpis.map((item) => (
                  <article key={item.label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="w-full lg:justify-self-end">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_50px_-30px_rgba(15,23,42,0.24)]">
              <div className="flex h-[280px] items-center justify-center bg-slate-100 p-5 sm:h-[330px] lg:h-[390px]">
                {heroVisual.imageSrc ? (
                  <img
                    src={heroVisual.imageSrc}
                    alt={heroVisual.alt}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center text-sm font-medium text-slate-500">
                    Imagen institucional configurable
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 bg-white px-5 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{heroVisual.caption}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {heroHighlights.map((highlight) => (
                    <div key={highlight} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}
