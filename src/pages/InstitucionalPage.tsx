import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ApiError } from '../lib/apiClient'
import {
  createEmptyInstitutionalContent,
  institutionalService,
} from '../services/institutionalService'
import type { InstitutionalContent } from '../types/institutional'

const SECTION_UPDATING_MESSAGE = 'Esta seccion sera actualizada desde el panel administrativo.'
const AUTHORITIES_EMPTY_MESSAGE = 'Todavia no hay autoridades publicadas.'
const BENEFITS_EMPTY_MESSAGE = 'Proximamente se informaran los beneficios disponibles para socios.'
const CHANNELS_EMPTY_MESSAGE = 'Los canales oficiales seran publicados proximamente.'

function hasContactData(content: InstitutionalContent): boolean {
  return Boolean(content.contact.address || content.contact.email || content.contact.phone || content.contact.hours)
}

function hasVisibleMembersSummary(content: InstitutionalContent): boolean {
  if (!content.visibility.show_members_summary) return false
  const members = content.institutional_page.members_summary
  if (!members) return false
  return members.total > 0 || Boolean(members.label.trim())
}

function hasVisibleFeesSummary(content: InstitutionalContent): boolean {
  if (!content.visibility.show_fees_summary) return false
  const fees = content.institutional_page.fees_summary
  if (!fees) return false
  return Boolean(fees.title.trim() || fees.description.trim())
}

export function InstitucionalPage() {
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
          setError('No se pudo cargar el contenido institucional.')
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

  const section = content.institutional_page
  const visibleSocialLinks = content.social_links.filter((item) => item.platform && item.url)

  return (
    <div className="space-y-4">
      <SectionHeader title={section.title || 'Institucional'} subtitle={section.description || ''} />

      {isLoading ? (
        <Card className="border-slate-200 shadow-md" title="Carga">
          <p className="text-sm text-slate-700">Cargando contenido institucional...</p>
        </Card>
      ) : null}

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      {!isLoading && !error ? (
        <div className="grid gap-4 md:grid-cols-2">
          {content.visibility.show_authorities ? (
            <Card className="border-slate-200 shadow-md" title="Autoridades">
              {section.authorities.length > 0 ? (
                <ul className="space-y-3">
                  {section.authorities.map((authority, index) => (
                    <li key={`${authority.role}-${authority.name}-${index}`} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{authority.role}</p>
                      <p className="text-sm font-semibold text-slate-900">{authority.name}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">{AUTHORITIES_EMPTY_MESSAGE}</p>
              )}
            </Card>
          ) : null}

          {hasVisibleMembersSummary(content) ? (
            <Card className="border-slate-200 shadow-md" title="Socios">
              <p className="text-3xl font-bold text-slate-900">{section.members_summary?.total ?? 0}</p>
              <p className="mt-1 text-sm text-slate-600">{section.members_summary?.label || ''}</p>
            </Card>
          ) : null}

          {content.visibility.show_objectives ? (
            <Card className="border-slate-200 shadow-md" title="Objetivos">
              {section.objectives.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {section.objectives.map((objective, index) => (
                    <li key={`${objective}-${index}`}>{objective}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">{SECTION_UPDATING_MESSAGE}</p>
              )}
            </Card>
          ) : null}

          {hasVisibleFeesSummary(content) ? (
            <Card className="border-slate-200 shadow-md" title="Cuotas y pagos">
              <p className="text-base font-semibold text-slate-900">{section.fees_summary?.title || ''}</p>
              <p className="mt-1 text-sm text-slate-600">{section.fees_summary?.description || ''}</p>
            </Card>
          ) : null}

          {content.visibility.show_benefits ? (
            <Card className="border-slate-200 shadow-md md:col-span-2" title="Beneficios">
              {section.benefits.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {section.benefits.map((benefit, index) => (
                    <li key={`${benefit}-${index}`}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">{BENEFITS_EMPTY_MESSAGE}</p>
              )}
            </Card>
          ) : null}

          {content.visibility.show_contact ? (
            <Card className="border-slate-200 shadow-md" title="Contacto institucional">
              {hasContactData(content) ? (
                <div className="space-y-2 text-sm text-slate-700">
                  {content.contact.address ? <p>{content.contact.address}</p> : null}
                  {content.contact.email ? <p>{content.contact.email}</p> : null}
                  {content.contact.phone ? <p>{content.contact.phone}</p> : null}
                  {content.contact.hours ? <p>{content.contact.hours}</p> : null}
                </div>
              ) : (
                <p className="text-sm text-slate-600">{SECTION_UPDATING_MESSAGE}</p>
              )}
            </Card>
          ) : null}

          {content.visibility.show_social_links ? (
            <Card className="border-slate-200 shadow-md" title="Canales oficiales">
              {visibleSocialLinks.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-700">
                  {visibleSocialLinks.map((item, index) => (
                    <li key={`${item.platform}-${index}`}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:underline">
                        {item.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600">{CHANNELS_EMPTY_MESSAGE}</p>
              )}
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
