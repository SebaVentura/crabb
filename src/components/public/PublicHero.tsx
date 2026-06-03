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
  badge: 'CÁMARA REGIONAL AUTOMOTOR',
  description:
    'Representamos, acompañamos y fortalecemos al sector automotor regional, promoviendo la profesionalización, la innovación y el desarrollo sostenible.',
}

export function PublicHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PublicHeroProps) {
  const normalizedTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

  const useReferenceTitle =
    normalizedTitle.length === 0 ||
    normalizedTitle === 'crabb' ||
    normalizedTitle.includes('camara regional automotor')

  const titleLines = useReferenceTitle
    ? ['Cámara Regional', 'Automotor de', 'Bahía Blanca']
    : title
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

  const primaryLink: ActionLink = {
    ...primaryCta,
    label: primaryCta.label || 'CONOCÉ NUESTROS SERVICIOS',
    url: primaryCta.url || '#servicios',
  }

  const secondaryLink: ActionLink = {
    ...secondaryCta,
    label: secondaryCta.label || 'CONTACTANOS',
    url: secondaryCta.url || '#contacto',
  }

  return (
    <section
      id="inicio"
      className="relative min-h-[650px] w-full overflow-hidden bg-transparent text-white"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:min-h-[600px] lg:px-8 lg:py-18">
        <div className="relative z-20 max-w-[660px]">
          <p className="inline-flex rounded-full border border-sky-300/35 bg-sky-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100">
            {badge || fallbackHeroContent.badge}
          </p>

          <h1 className="mt-7 text-5xl font-bold leading-[0.96] text-white sm:text-6xl lg:text-[4.65rem] xl:text-[5.1rem]">
            {titleLines.length > 0 ? (
              titleLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={`block ${
                    index === 2
                      ? 'text-sky-300 [text-shadow:0_0_24px_rgba(56,189,248,0.45)]'
                      : ''
                  }`}
                >
                  {line}
                </span>
              ))
            ) : (
              <span className="block text-white">Cámara Regional Automotor</span>
            )}
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
            {description || fallbackHeroContent.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <PublicActionLink
              link={primaryLink}
              className="rounded-md bg-sky-300 px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[#06213c] shadow-[0_18px_45px_rgba(56,189,248,0.22)] transition hover:bg-sky-200"
            />

            <PublicActionLink
              link={secondaryLink}
              className="rounded-md border border-white/35 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:border-sky-300/60 hover:bg-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}