import type { ActionLink, LandingHeroVisual } from '../../types/institutional'
import heroBlueprintCar from '../../assets/hero-blueprint-car.png'
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
      className="relative min-h-[720px] w-full overflow-hidden bg-[#06111f]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,0.16),transparent_36%),linear-gradient(180deg,#06111f_0%,#071527_58%,#06111f_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_18%_28%,rgba(186,230,253,0.24)_0_1px,transparent_1px),radial-gradient(circle_at_74%_32%,rgba(186,230,253,0.22)_0_1px,transparent_1px)] [background-size:140px_140px]"
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
        viewBox="0 0 1920 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M0 710H1920" stroke="rgba(148,163,184,0.22)" strokeDasharray="7 12" />
        <path d="M0 618H1920" stroke="rgba(148,163,184,0.18)" strokeDasharray="5 12" />
        <path d="M0 530H1920" stroke="rgba(148,163,184,0.14)" strokeDasharray="5 12" />
        <path
          d="M280 770C620 610 1040 588 1490 660"
          stroke="rgba(125,211,252,0.24)"
          strokeWidth="1.6"
          strokeDasharray="6 10"
        />
        <path
          d="M420 302C760 226 1080 232 1460 292"
          stroke="rgba(125,211,252,0.16)"
          strokeWidth="1.4"
          strokeDasharray="6 10"
        />
      </svg>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 lg:min-h-[620px] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div className="relative z-20 max-w-[680px]">
          <p className="inline-flex rounded-full border border-sky-300/35 bg-sky-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100">
            {badge || fallbackHeroContent.badge}
          </p>

          <h1 className="mt-7 text-5xl font-bold leading-[0.96] text-white sm:text-6xl lg:text-[4.9rem] xl:text-[5.35rem]">
            {titleLines.length > 0 ? (
              titleLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={`block whitespace-nowrap ${
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

        <div className="pointer-events-none relative hidden min-h-[500px] overflow-visible md:block lg:min-h-[580px]">
          <div
            aria-hidden="true"
            className="absolute right-[-180px] top-1/2 h-[520px] w-[620px] -translate-y-1/2 rounded-full bg-sky-300/20 blur-[120px] lg:right-[-260px]"
          />

          <img
            src={heroBlueprintCar}
            alt=""
            aria-hidden="true"
            className="absolute right-[-260px] top-1/2 w-[980px] max-w-none -translate-y-1/2 select-none opacity-95 mix-blend-screen drop-shadow-[0_0_42px_rgba(56,189,248,0.25)] md:right-[-360px] md:w-[1120px] lg:right-[-430px] lg:w-[1280px] xl:right-[-500px] xl:w-[1400px]"
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}