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

  const benefitCards = landing.services.slice(0, 4).map((service, index) => {
    const cardConfig = [
      { icon: 'representacion' as const, cta: { label: 'Ver institucional', url: '/institucional' } },
      { icon: 'capacitacion' as const, cta: { label: 'Ver capacitaciones', url: '#capacitaciones' } },
      { icon: 'data' as const, cta: { label: 'Explorar data tecnica', url: '#data-tecnica' } },
      { icon: 'red' as const, cta: { label: 'Contactar a CRABB', url: '#contacto' } },
    ]

    return {
      ...service,
      icon: cardConfig[index]?.icon ?? 'representacion',
      cta: cardConfig[index]?.cta ?? { label: 'Ver mas', url: '#servicios' },
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
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50">
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

      {error ? (
        <section className="mx-auto mb-5 mt-5 w-full max-w-7xl rounded-xl border border-amber-300/50 bg-amber-100/80 px-4 py-4 text-sm text-amber-900 md:px-8">
          Contenido cargado con fallback visual temporal. Detalle tecnico: {error}
        </section>
      ) : null}

      {isLoading ? (
        <section className="mx-auto mb-5 mt-5 w-full max-w-7xl px-4 md:px-8" aria-label="Cargando contenido institucional">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600/70" aria-hidden="true" />
            <span className="h-2.5 w-28 rounded-full bg-slate-200" aria-hidden="true" />
            <span className="h-2.5 w-16 rounded-full bg-slate-100" aria-hidden="true" />
          </div>
        </section>
      ) : null}

      <PublicHero
        badge={landing.hero.badge}
        title={landing.hero.title}
        description={landing.hero.description}
        primaryCta={landing.hero.primary_cta}
        secondaryCta={landing.hero.secondary_cta}
        kpis={heroKpis}
      />

      <BenefitsGrid services={benefitCards} />
      <FeaturedSectionsGrid sections={featuredSections} />

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
