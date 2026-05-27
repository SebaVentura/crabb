import type { ActionLink } from '../../types/institutional'
import { BlueprintBackground } from './BlueprintBackground'
import { BlueprintCar } from './BlueprintCar'
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

export function PublicHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  kpis = [],
}: PublicHeroProps) {
  return (
    <section id="inicio" className="relative min-h-[680px] w-full overflow-hidden bg-[#06111f]">
      <BlueprintBackground />

      <div className="pointer-events-none absolute right-[-4%] top-1/2 hidden w-[56%] -translate-y-1/2 opacity-65 [filter:drop-shadow(0_0_30px_rgba(125,211,252,0.18))] lg:block xl:w-[52%]">
        <BlueprintCar />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-sky-300/50 bg-slate-950/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
            {badge}
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.06] text-white md:text-6xl xl:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 md:text-xl">{description}</p>

          <div className="mt-9 flex flex-wrap gap-4">
            <PublicActionLink
              link={primaryCta}
              className="rounded-md bg-sky-500 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            />
            <PublicActionLink
              link={secondaryCta}
              className="rounded-md border border-slate-500 bg-slate-900/40 px-7 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-300"
            />
          </div>
        </div>

        {kpis.length > 0 ? (
          <aside className="self-end justify-self-start lg:justify-self-end">
            <div className="grid gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/75 p-4 backdrop-blur">
              {kpis.map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2.5">
                  <p className="text-lg font-semibold text-slate-100">{item.value}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                </article>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  )
}
