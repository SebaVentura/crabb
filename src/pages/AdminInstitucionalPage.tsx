import { useEffect, useState } from 'react'
import { InstitutionalForm } from '../components/institucional/InstitutionalForm'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ApiError } from '../lib/apiClient'
import { createEmptyInstitutionalContent, institutionalService } from '../services/institutionalService'
import type { InstitutionalContent } from '../types/institutional'

const EMPTY_ADMIN_MESSAGE = 'No hay contenido institucional cargado. Guarda una primera version desde el panel.'

export function AdminInstitucionalPage() {
  const [content, setContent] = useState<InstitutionalContent>(createEmptyInstitutionalContent)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadContent = async () => {
      setIsLoading(true)
      setError(null)
      setEmptyMessage(null)

      try {
        const response = await institutionalService.getAdminInstitutionalContent()
        if (!active) return
        setContent(response)
      } catch (err) {
        if (!active) return

        if (err instanceof ApiError) {
          if (err.status === 404) {
            setContent(createEmptyInstitutionalContent())
            setEmptyMessage(EMPTY_ADMIN_MESSAGE)
          } else if (err.status === 401) {
            setError('Tu sesion expiro. Inicia sesion nuevamente.')
          } else if (err.status === 403) {
            setError('No tenes permisos para editar el contenido institucional.')
          } else {
            setError(err.message)
          }
        } else {
          setError('No se pudo cargar la configuracion institucional.')
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

  const handleSubmit = async (payload: InstitutionalContent) => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updated = await institutionalService.updateInstitutionalContent(payload)
      setContent(updated)
      setSuccessMessage('Contenido institucional actualizado correctamente.')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Tu sesion expiro. Inicia sesion nuevamente.')
        } else if (err.status === 403) {
          setError('No tenes permisos para guardar cambios institucionales.')
        } else {
          setError(err.message)
        }
      } else {
        setError('No se pudo guardar la configuracion institucional.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Contenido institucional"
        subtitle="Configuracion editable para la seccion Institucional visible en CRABB."
      />

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-md">
          Cargando configuracion institucional...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : null}

      {emptyMessage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">{emptyMessage}</div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      {!isLoading ? <InstitutionalForm initialValues={content} onSubmit={handleSubmit} isSaving={isSaving} /> : null}
    </div>
  )
}
