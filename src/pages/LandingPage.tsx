import { useEffect, useState } from 'react'
import { BenefitsGrid } from '../components/public/BenefitsGrid'
import { ContactCommunitySection } from '../components/public/ContactCommunitySection'
import {
  FeaturedSectionsGrid,
  type FeaturedSection,
} from '../components/public/FeaturedSectionsGrid'
import { PublicFooter } from '../components/public/PublicFooter'
import { PublicHeader } from '../components/public/PublicHeader'
import { PublicHero } from '../components/public/PublicHero'
import {
  getInstitutionalContentWithFallback,
  institutionalPreviewFooterLinkGroups,
} from '../features/institutional/institutionalPreviewData'
import { ApiError } from '../lib/apiClient'
import { institutionalService } from '../services/institutionalService'
import type { InstitutionalContent } from '../types/institutional'

export function LandingPage() {
  const [content, setContent] = useState<InstitutionalContent>(() =>
    getInstitutionalContentWithFallback(null),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await institutionalService.getInstitutionalContent()
        if (!active) return
        setContent(getInstitutionalContentWithFallback(response))
      } catch (err) {
        if (!active) return

        if (err instanceof ApiError && err.status === 404) {
          setContent(getInstitutionalContentWithFallback(null))
          setError(null)
        } else if (err instanceof ApiError) {
          setContent(getInstitutionalContentWithFallback(null))
          setError(err.message)
        } else {
          setContent(getInstitutionalContentWithFallback(null))
          setError('No se pudo cargar el contenido de la landing.')
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadContent()

    return () => {
      active = false
    }
  }, [])

  const landing = content.landing
  const socialLinks = content.social_links.filter((link) => link.platform && link.url)
  const visibleContact = content.visibility.show_contact
  const visibleSocialLinks = content.visibility.show_social_links

  const serviceFallbackByIndex = [
    { icon: 'representacion' as const, cta: { label: 'Ver institucional', url: '/institucional' } },
    { icon: 'capacitacion' as const, cta: { label: 'Ver capacitaciones', url: '/capacitaciones' } },
    { icon: 'data' as const, cta: { label: 'Explorar data tecnica', url: '/data-tecnica' } },
    { icon: 'red' as const, cta: { label: 'Contactar a CRABB', url: '/contacto' } },
  ]

  const isUnsafePublicHref = (href?: string | null) => {
    if (!href) return true

    const normalized = href.trim().toLowerCase()

    return (
      normalized.includes('admin') ||
      normalized.includes('/#/admin') ||
      normalized.includes('/admin') ||
      normalized.includes('login')
    )
  }

  const sortedVisibleServices = [...landing.services]
    .filter((service) => service.visible !== false)
    .sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
      return aOrder - bOrder
    })

  const benefitCards = sortedVisibleServices.slice(0, 4).map((service, index) => {
    const fallbackConfig = serviceFallbackByIndex[index]
    const safeHref = isUnsafePublicHref(service.cta_href)
      ? fallbackConfig?.cta.url
      : service.cta_href

    return {
      ...service,
      icon: service.icon ?? fallbackConfig?.icon ?? 'representacion',
      cta: {
        label: service.cta_label || fallbackConfig?.cta.label || 'Ver mas',
        url: safeHref || fallbackConfig?.cta.url || '/institucional',
      },
    }
  })

  const featuredSections: FeaturedSection[] = [
    {
      key: 'campana',
      title: landing.campaign.title,
      description: landing.campaign.description,
      items: landing.campaign.items,
      cta: landing.campaign.cta,
    },
    {
      key: 'data-tecnica',
      title: landing.data_tecnica.title,
      description: landing.data_tecnica.description,
      items: landing.data_tecnica.items,
      cta: { label: 'Data tecnica', url: '#data-tecnica' },
    },
    {
      key: 'capacitaciones',
      title: landing.capacitaciones.title,
      description: landing.capacitaciones.description,
      items: landing.capacitaciones.items,
      cta: { label: 'Capacitaciones', url: '#capacitaciones' },
    },
    {
      key: 'auxilio',
      title: landing.crabb_auxilio.title,
      description: landing.crabb_auxilio.description,
      items: landing.crabb_auxilio.items,
      cta: { label: 'CRABB Auxilio', url: '#contacto' },
    },
    {
      key: 'opportunities',
      title: landing.opportunities.title,
      description: landing.opportunities.description,
      items: landing.opportunities.items,
      cta: { label: 'Oportunidades', url: '#contacto' },
    },
  ]

  const heroKpis = []

  if (content.visibility.show_members_summary && content.institutional_page.members_summary) {
    heroKpis.push({
      label: content.institutional_page.members_summary.label || 'Socios',
      value: String(content.institutional_page.members_summary.total),
    })
  }

  if (content.visibility.show_fees_summary && content.institutional_page.fees_summary) {
    heroKpis.push({
      label: content.institutional_page.fees_summary.title || 'Cuotas',
      value: content.institutional_page.fees_summary.description,
    })
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#06111f]">
      <PublicHeader
        navItems={[
          { label: 'Inicio', href: '#inicio' },
          { label: 'Institucional', href: '/institucional' },
          { label: 'Servicios', href: '#servicios' },
          { label: 'Capacitaciones', href: '/capacitaciones' },
          { label: 'Data Técnica', href: '/data-tecnica' },
          { label: 'Contacto', href: '#contacto' },
        ]}
      />

      <div className="relative isolate overflow-hidden bg-[#06111f] text-white">
        {/* Fondo global único para Hero + Servicios + Destacados */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_84%_16%,rgba(59,130,246,0.1),transparent_34%),radial-gradient(circle_at_50%_74%,rgba(14,165,233,0.08),transparent_40%),linear-gradient(180deg,#06111f_0%,#071527_34%,#071b33_62%,#06111f_100%)]"
          aria-hidden="true"
        />

        {/* Grilla técnica única. No repetir esta grilla dentro de PublicHero, BenefitsGrid ni FeaturedSectionsGrid. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:48px_48px]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {error ? (
            <section className="mx-auto mb-5 mt-5 w-full max-w-7xl px-4 md:px-8">
              <div className="rounded-xl border border-amber-300/45 bg-amber-100/90 px-4 py-4 text-sm text-amber-950 shadow-lg shadow-black/10">
                Contenido cargado con fallback visual temporal. Detalle tecnico: {error}
              </div>
            </section>
          ) : null}

          {isLoading ? (
            <section
              className="mx-auto mb-5 mt-5 w-full max-w-7xl px-4 md:px-8"
              aria-label="Cargando contenido institucional"
            >
              <div className="flex items-center gap-3 rounded-full border border-white/14 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm">
                <span
                  className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-300/80"
                  aria-hidden="true"
                />
                <span className="h-2.5 w-28 rounded-full bg-white/18" aria-hidden="true" />
                <span className="h-2.5 w-16 rounded-full bg-white/10" aria-hidden="true" />
              </div>
            </section>
          ) : null}

          <PublicHero
            badge={landing.hero.badge}
            title={landing.hero.title}
            description={landing.hero.description}
            primaryCta={landing.hero.primary_cta}
            secondaryCta={landing.hero.secondary_cta}
            imageUrl={landing.hero.image_url ?? ''}
            imageAlt={landing.hero.image_alt ?? 'Imagen institucional de CRABB'}
            values={landing.hero.values ?? []}
            visual={landing.hero.visual}
            kpis={heroKpis}
          />

          <BenefitsGrid services={benefitCards} />

          <FeaturedSectionsGrid sections={featuredSections} />
        </div>
      </div>

      <ContactCommunitySection
        contact={content.contact}
        socialLinks={socialLinks}
        finalCta={landing.final_cta}
        showContact={visibleContact}
        showSocialLinks={visibleSocialLinks}
      />

      <PublicFooter
        footer={content.footer}
        socialLinks={socialLinks}
        linkGroups={institutionalPreviewFooterLinkGroups}
      />
    </main>
  )
}