import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ApiError } from '../lib/apiClient'
import {
  createEmptyInstitutionalContent,
  hasInstitutionalPageContent,
  institutionalService,
} from '../services/institutionalService'
import type { InstitutionalContent } from '../types/institutional'

const CONTENT_UNAVAILABLE_MESSAGE = 'Contenido institucional no disponible por el momento.'

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
  const hasContent = hasInstitutionalPageContent(content)

  return (
    <div className="space-y-4">
      <SectionHeader title={section.title || 'Institucional'} subtitle={section.description || ''} />

      {isLoading ? (
        <Card className="border-slate-200 shadow-md" title="Carga">
          <p className="text-sm text-slate-700">Cargando contenido institucional...</p>
        </Card>
      ) : null}

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      {!isLoading && !error && !hasContent ? (
        <Card className="border-slate-200 shadow-md" title="Institucional">
          <p className="text-sm text-slate-700">{CONTENT_UNAVAILABLE_MESSAGE}</p>
        </Card>
      ) : null}

      {!isLoading && !error && hasContent ? (
        <div className="grid gap-4 md:grid-cols-2">
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
              <p className="text-sm text-slate-600">Sin datos para mostrar.</p>
            )}
          </Card>

          <Card className="border-slate-200 shadow-md" title="Socios">
            <p className="text-3xl font-bold text-slate-900">{section.members_summary.total}</p>
            <p className="mt-1 text-sm text-slate-600">{section.members_summary.label}</p>
          </Card>

          <Card className="border-slate-200 shadow-md" title="Objetivos">
            {section.objectives.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                {section.objectives.map((objective, index) => (
                  <li key={`${objective}-${index}`}>{objective}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">Sin datos para mostrar.</p>
            )}
          </Card>

          <Card className="border-slate-200 shadow-md" title="Cuotas y pagos">
            <p className="text-base font-semibold text-slate-900">{section.fees_summary.title}</p>
            <p className="mt-1 text-sm text-slate-600">{section.fees_summary.description}</p>
          </Card>

          <Card className="border-slate-200 shadow-md md:col-span-2" title="Beneficios">
            {section.benefits.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
                {section.benefits.map((benefit, index) => (
                  <li key={`${benefit}-${index}`}>{benefit}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">Sin datos para mostrar.</p>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  )
}
