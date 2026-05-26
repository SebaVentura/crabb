import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../lib/apiClient'
import {
  createEmptyInstitutionalContent,
  hasLandingContent,
  institutionalService,
} from '../services/institutionalService'
import type { ActionLink, InstitutionalContent, LandingSection } from '../types/institutional'

const CONTENT_UNAVAILABLE_MESSAGE = 'Contenido institucional no disponible por el momento.'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function ActionButton({ link, className }: { link: ActionLink; className: string }) {
  if (!link.url || !link.label) return null

  const isExternal = /^https?:\/\//i.test(link.url)

  if (isExternal) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    )
  }

  return (
    <Link to={link.url} className={className}>
      {link.label}
    </Link>
  )
}

function SectionList({ section }: { section: LandingSection }) {
  if (section.items.length === 0) return null

  return (
    <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
      {section.items.map((item, index) => (
        <li key={`${item}-${index}`} className="rounded-lg bg-slate-100 px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function LandingPage() {
  const [content, setContent] = useState<InstitutionalContent>(createEmptyInstitutionalContent)
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
        setContent(response)
      } catch (err) {
        if (!active) return

        if (err instanceof ApiError && err.status === 404) {
          setContent(createEmptyInstitutionalContent())
          setError(null)
        } else if (err instanceof ApiError) {
          setError(err.message)
        } else {
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
  const hasContent = hasLandingContent(content)
  const socialLinks = content.social_links.filter((link) => link.label && link.url)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-8 pb-24 md:px-6 md:py-12 md:pb-28">
        {isLoading ? (
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm text-slate-600">Cargando contenido...</p>
          </section>
        ) : null}

        {error ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm md:p-8">
            {error}
          </section>
        ) : null}

        {!isLoading && !error && !hasContent ? (
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm text-slate-700">{CONTENT_UNAVAILABLE_MESSAGE}</p>
          </section>
        ) : null}

        {!isLoading && !error && hasContent ? (
          <>
            <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 shadow-sm md:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  {landing.hero.badge ? (
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {landing.hero.badge}
                    </span>
                  ) : null}

                  <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 md:text-4xl">{landing.hero.title}</h1>
                  <p className="mt-2 text-lg font-medium text-blue-700 md:text-2xl">{landing.hero.subtitle}</p>
                  <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">{landing.hero.description}</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <ActionButton
                      link={landing.hero.primary_cta}
                      className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    />
                    <ActionButton
                      link={landing.hero.secondary_cta}
                      className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Servicios</h2>
              {landing.services.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {landing.services.map((service, index) => (
                    <article key={`${service.title}-${index}`} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-150 hover:shadow-md">
                      <h3 className="font-semibold text-slate-900">{service.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">Sin datos para mostrar.</p>
              )}
            </section>

            <section id="inscripcion" className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{landing.campaign.title}</h2>
              <p className="mt-3 text-sm text-slate-600 md:text-base">{landing.campaign.description}</p>
              <SectionList section={landing.campaign} />
              <div className="mt-4">
                <ActionButton
                  link={landing.campaign.cta}
                  className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700"
                />
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{landing.data_tecnica.title}</h2>
              <p className="mt-3 text-sm text-slate-600 md:text-base">{landing.data_tecnica.description}</p>
              <SectionList section={landing.data_tecnica} />
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{landing.capacitaciones.title}</h2>
              <p className="mt-3 text-sm text-slate-600 md:text-base">{landing.capacitaciones.description}</p>
              <SectionList section={landing.capacitaciones} />
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{landing.crabb_auxilio.title}</h2>
              <p className="mt-3 text-sm text-slate-600 md:text-base">{landing.crabb_auxilio.description}</p>
              <SectionList section={landing.crabb_auxilio} />
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{landing.opportunities.title}</h2>
              <p className="mt-3 text-sm text-slate-600 md:text-base">{landing.opportunities.description}</p>
              <SectionList section={landing.opportunities} />
            </section>

            <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">{landing.final_cta.title}</h2>
              <p className="mt-3 text-sm text-slate-200 md:text-base">{landing.final_cta.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ActionButton
                  link={landing.final_cta.primary_cta}
                  className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700"
                />
                <ActionButton
                  link={landing.final_cta.secondary_cta}
                  className="inline-flex rounded-xl border border-slate-400 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-slate-700"
                />
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">{content.contact.title}</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="space-y-3 text-sm text-slate-700 md:text-base">
                  {content.contact.address ? <p>{content.contact.address}</p> : null}
                  {content.contact.email ? <p>{content.contact.email}</p> : null}
                  {content.contact.phone ? <p>{content.contact.phone}</p> : null}
                  {content.contact.schedule ? <p>{content.contact.schedule}</p> : null}
                  <ActionButton
                    link={content.contact.whatsapp}
                    className="inline-flex rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:border-blue-300 hover:text-blue-700"
                  />
                </div>

                <div>
                  {socialLinks.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={`${social.label}-${index}`}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:border-blue-300 hover:text-blue-700"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">Sin redes sociales para mostrar.</p>
                  )}
                </div>
              </div>
            </section>

            <footer className="mt-6 border-t border-slate-200/80 pt-6 text-center">
              <p className="text-sm font-semibold text-slate-800">{content.footer.copyright}</p>
              <p className="mt-1 text-sm text-slate-500">{content.footer.description}</p>
            </footer>
          </>
        ) : null}
      </main>

      {content.contact.whatsapp.url ? (
        <a
          href={content.contact.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.contact.whatsapp.label || 'Abrir WhatsApp'}
          title={content.contact.whatsapp.label || 'Abrir WhatsApp'}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-150 hover:brightness-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:bottom-8 md:right-8"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      ) : null}
    </div>
  )
}
