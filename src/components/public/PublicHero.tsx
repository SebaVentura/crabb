import { useEffect, useState } from 'react'
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
  fallbackImageUrl: string
  imageAlt: string
  values?: string[]
  visual?: LandingHeroVisual
  kpis?: HeroKpi[]
}

const LEGACY_HERO_BADGES = ['CAMARA REGIONAL AUTOMOTOR', 'CÁMARA REGIONAL AUTOMOTOR'] as const

const LEGACY_HERO_TITLES = [
  'Cámara Regional Automotor de Bahía Blanca',
  'Camara Regional Automotor de Bahia Blanca',
] as const

const CANONICAL_HERO_BADGE = 'CÁMARA DE REPARACIÓN DE AUTOMOTORES'
const CANONICAL_HERO_TITLE = 'Cámara de Reparación de Automotores de Bahía Blanca'

const REFERENCE_TITLE_LINES = [
  'Cámara de Reparación',
  'de Automotores',
  'de Bahía Blanca',
] as const

const fallbackHeroContent = {
  badge: CANONICAL_HERO_BADGE,
  description:
    'Representamos, acompañamos y fortalecemos al sector automotor regional, promoviendo la profesionalización, la innovación y el desarrollo sostenible.',
}

const fallbackHeroImageAlt = 'Representación del ecosistema automotor de CRABB'

function normalizeHeroText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function isLegacyHeroBadge(value: string): boolean {
  const normalized = normalizeHeroText(value)
  return LEGACY_HERO_BADGES.some((legacy) => normalizeHeroText(legacy) === normalized)
}

function isLegacyHeroTitle(value: string): boolean {
  const normalized = normalizeHeroText(value)
  return LEGACY_HERO_TITLES.some((legacy) => normalizeHeroText(legacy) === normalized)
}

function resolveHeroBadge(badge: string): string {
  const trimmed = badge.trim()
  if (!trimmed || isLegacyHeroBadge(trimmed)) {
    return CANONICAL_HERO_BADGE
  }

  return trimmed
}

export function PublicHero({
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  imageUrl,
  fallbackImageUrl,
  imageAlt,
}: PublicHeroProps) {
  const [displayedImageUrl, setDisplayedImageUrl] = useState(imageUrl)
  const [imageFailed, setImageFailed] = useState(false)
  const resolvedImageAlt = imageAlt.trim() || fallbackHeroImageAlt
  const showHeroImage = !imageFailed && displayedImageUrl.trim().length > 0

  useEffect(() => {
    setDisplayedImageUrl(imageUrl)
    setImageFailed(false)
  }, [imageUrl])

  const handleImageError = () => {
    if (displayedImageUrl !== fallbackImageUrl) {
      setDisplayedImageUrl(fallbackImageUrl)
      return
    }

    setImageFailed(true)
  }
  const resolvedBadge = resolveHeroBadge(badge)
  const normalizedTitle = normalizeHeroText(title)

  const useReferenceTitle =
    normalizedTitle.length === 0 || normalizedTitle === 'crabb' || isLegacyHeroTitle(title)

  const titleLines = useReferenceTitle
    ? [...REFERENCE_TITLE_LINES]
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
        <div className="relative z-20 grid items-center gap-8 lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <div className="min-w-0 max-w-[660px]">
            <p className="inline-flex rounded-full border border-sky-300/35 bg-sky-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100">
              {resolvedBadge || fallbackHeroContent.badge}
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
                <span className="block text-white">{CANONICAL_HERO_TITLE}</span>
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

          {showHeroImage ? (
            <div className="relative mx-auto w-full min-w-0 max-w-[min(100%,520px)] lg:mx-0 lg:max-w-none lg:justify-self-end">
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="h-[70%] w-[70%] rounded-full bg-sky-400/10 blur-3xl" />
              </div>

              <img
                src={displayedImageUrl}
                alt={resolvedImageAlt}
                loading="eager"
                decoding="async"
                className="relative mx-auto h-auto w-full max-w-full object-contain drop-shadow-[0_28px_56px_rgba(56,189,248,0.2)] max-h-[240px] sm:max-h-[300px] md:max-h-[360px] lg:max-h-[min(520px,72vh)] lg:ml-auto lg:mr-0"
                onError={handleImageError}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}