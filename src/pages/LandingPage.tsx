import { useEffect, useState } from 'react'
import heroBlueprintCar from '../assets/hero-blueprint-car.png'
import { AssociationSection } from '../components/public/AssociationSection'
import { ContactCommunitySection } from '../components/public/ContactCommunitySection'
import { InstitutionalServicesSection } from '../components/public/InstitutionalServicesSection'
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

const TRAINING_EXTERNAL_URL = 'https://faatra.org.ar/capacitaciones/snit'

export function LandingPage() {
  const [content, setContent] = useState<InstitutionalContent | null>(null)
  const [isLoadingInstitutionalContent, setIsLoadingInstitutionalContent] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      setIsLoadingInstitutionalContent(true)
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
        if (active) {
          setIsLoadingInstitutionalContent(false)
        }
      }
    }

    void loadContent()

    return () => {
      active = false
    }
  }, [])

  const publicNavItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Institucional', href: '/institucional' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Capacitaciones', href: TRAINING_EXTERNAL_URL },
    { label: 'Data Técnica', href: '/data-tecnica' },
    { label: 'Contacto', href: '#contacto' },
  ]

  if (!content) {
    return (
      <main className="min-h-screen w-full overflow-x-hidden bg-[#06111f]">
        <PublicHeader navItems={publicNavItems} />

        <div className="relative isolate overflow-hidden bg-[#06111f] text-white">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_84%_16%,rgba(59,130,246,0.1),transparent_34%),radial-gradient(circle_at_50%_74%,rgba(14,165,233,0.08),transparent_40%),linear-gradient(180deg,#06111f_0%,#071527_34%,#071b33_62%,#06111f_100%)]"
            aria-hidden="true"
          />

          <section
            id="servicios"
            aria-busy={isLoadingInstitutionalContent}
            className="relative z-10 mx-auto min-h-[360px] w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-8"
          >
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 text-sm text-sky-100/78">
              Cargando servicios...
            </div>
          </section>
        </div>
      </main>
    )
  }

  const landing = content.landing
  const configuredImageUrl = landing.hero.image_url?.trim() ?? ''
  const shouldUseDefaultImage =
    !configuredImageUrl || configuredImageUrl === '/media/hero-crabb.jpg'
  const effectiveHeroImageUrl = shouldUseDefaultImage ? heroBlueprintCar : configuredImageUrl
  const heroImageAlt =
    landing.hero.image_alt?.trim() || 'Representación del ecosistema automotor de CRABB'
  const socialLinks = content.social_links.filter((link) => link.platform && link.url)
  const visibleContact = content.visibility.show_contact
  const visibleSocialLinks = content.visibility.show_social_links

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
        navItems={publicNavItems}
      />

      <div className="relative isolate overflow-hidden bg-[#06111f] text-white">
        {/* Fondo global único para Hero + Servicios + Destacados */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_84%_16%,rgba(59,130,246,0.1),transparent_34%),radial-gradient(circle_at_50%_74%,rgba(14,165,233,0.08),transparent_40%),linear-gradient(180deg,#06111f_0%,#071527_34%,#071b33_62%,#06111f_100%)]"
          aria-hidden="true"
        />

        {/* Grilla técnica única. No repetir dentro de secciones hijas. */}
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

          <div className="relative">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[min(900px,100vh)] bg-[radial-gradient(ellipse_70%_50%_at_75%_40%,rgba(56,189,248,0.07),transparent_70%)]"
              aria-hidden="true"
            />

            <PublicHero
              badge={landing.hero.badge}
              title={landing.hero.title}
              description={landing.hero.description}
              primaryCta={landing.hero.primary_cta}
              secondaryCta={landing.hero.secondary_cta}
              imageUrl={effectiveHeroImageUrl}
              fallbackImageUrl={heroBlueprintCar}
              imageAlt={heroImageAlt}
              isDefaultBlueprintImage={shouldUseDefaultImage}
              values={landing.hero.values ?? []}
              visual={landing.hero.visual}
              kpis={heroKpis}
            />
          </div>

          <InstitutionalServicesSection />

          <AssociationSection />
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
        contact={content.contact}
        socialLinks={socialLinks}
        linkGroups={institutionalPreviewFooterLinkGroups}
      />
    </main>
  )
}