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
  // TODO: reemplazar esta configuracion local por datos administrables desde Superadmin.
  const heroContent = {
    eyebrow: 'JUNTOS MOVEMOS MAS',
    title: 'Cámara de Reparación de Automotores de Bahía Blanca',
    description:
      'Representamos, acompañamos y fortalecemos a talleres, concesionarias, agencias y pymes vinculadas al ecosistema automotor regional.',
    values: ['Trabajo conjunto', 'Profesionalismo', 'Cercanía', 'Compromiso regional'],
    visualTitle: 'Sector automotor regional',
    visualSubtitle: 'Representación, gestión y formación para empresas del ecosistema automotor.',
    visualModules: [
      'Representación institucional',
      'Gestión y asesoramiento',
      'Capacitación continua',
    ],
    regionTag: 'Bahía Blanca y región',
  }

  const primaryLink: ActionLink = {
    ...primaryCta,
    label: 'Conocer la institución',
    url: primaryCta.url || '/institucional',
  }

  const secondaryLink: ActionLink = {
    ...secondaryCta,
    label: 'Ver servicios',
    url: secondaryCta.url || '#servicios',
  }

  return (
    <section id="inicio" className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">
              {heroContent.eyebrow}
            </p>

            <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {heroContent.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {heroContent.description}
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
              {heroContent.values.map((value) => (
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
            <article className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.2)] sm:p-7">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/60" aria-hidden="true" />
              <div className="absolute bottom-5 right-6 h-16 w-16 rounded-full border border-blue-200/70 bg-white/80" aria-hidden="true" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Visión institucional</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-900 sm:text-[1.75rem]">
                  {heroContent.visualTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{heroContent.visualSubtitle}</p>
              </div>

              <div className="relative mt-6 grid gap-3">
                {heroContent.visualModules.map((module) => (
                  <article key={module} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                      <p className="text-sm font-medium text-slate-700">{module}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="relative mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">{heroContent.regionTag}</p>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  )
}
