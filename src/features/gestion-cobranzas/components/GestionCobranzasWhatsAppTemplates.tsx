import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card } from '../../../components/ui/Card'
import { collectionsService } from '../../../services/collectionsService'
import type { WhatsAppMessageTemplate } from '../../../types/whatsapp'
import { WHATSAPP_TEMPLATE_VARIABLES } from '../../../types/whatsapp'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function renderPreview(body: string): string {
  const samples: Record<string, string> = {
    nombre: 'Juan Pérez',
    taller: 'Taller Ejemplo',
    periodo: 'Junio 2026',
    mesAdeudado: 'Junio 2026',
    importe: '$12.000',
    vencimiento: '15/06/2026',
    link_pago: 'https://crabb.example/pago',
  }

  let rendered = body
  for (const [key, value] of Object.entries(samples)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value)
    rendered = rendered.replaceAll(`{${key}}`, value)
  }

  return rendered
}

export function GestionCobranzasWhatsAppTemplates() {
  const [templates, setTemplates] = useState<WhatsAppMessageTemplate[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [draftName, setDraftName] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftActive, setDraftActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedId) ?? null,
    [templates, selectedId],
  )

  const loadTemplates = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const items = await collectionsService.getMessageTemplates()
      setTemplates(items)
      if (!selectedId && items[0]) {
        setSelectedId(items[0].id)
        setDraftName(items[0].name)
        setDraftBody(items[0].body)
        setDraftActive(items[0].active)
      }
    } catch {
      setLoadError('No se pudieron cargar los mensajes de WhatsApp.')
    } finally {
      setLoading(false)
    }
  }, [selectedId])

  useEffect(() => {
    void loadTemplates()
  }, [loadTemplates])

  useEffect(() => {
    if (!selectedTemplate) return
    setDraftName(selectedTemplate.name)
    setDraftBody(selectedTemplate.body)
    setDraftActive(selectedTemplate.active)
    setSaveState('idle')
    setSaveError(null)
  }, [selectedTemplate])

  const handleSave = async () => {
    if (!selectedTemplate) return

    setSaveState('saving')
    setSaveError(null)

    try {
      const updated = await collectionsService.updateMessageTemplate(selectedTemplate.id, {
        name: draftName.trim(),
        body: draftBody,
        active: draftActive,
      })

      setTemplates((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setSaveState('saved')
    } catch {
      setSaveState('error')
      setSaveError('No se pudo guardar el mensaje. Verificá permisos de administrador.')
    }
  }

  return (
    <Card className="border-slate-200 shadow-md" title="Mensajes de WhatsApp">
      {loading ? <p className="text-sm text-slate-600">Cargando templates…</p> : null}
      {loadError ? <p className="text-sm text-rose-700">{loadError}</p> : null}

      {!loading && !loadError ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp-template-select">
              Template
            </label>
            <select
              id="whatsapp-template-select"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp-template-name">
              Título / nombre
            </label>
            <input
              id="whatsapp-template-name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium text-slate-700" htmlFor="whatsapp-template-body">
              Cuerpo del mensaje
            </label>
            <textarea
              id="whatsapp-template-body"
              value={draftBody}
              onChange={(event) => setDraftBody(event.target.value)}
              rows={8}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draftActive}
                onChange={(event) => setDraftActive(event.target.checked)}
              />
              Template activo
            </label>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Variables disponibles</p>
              <p className="mt-1">
                {WHATSAPP_TEMPLATE_VARIABLES.map((variable) => `{{${variable}}}`).join(' · ')}
              </p>
              <p className="mt-2">
                También se aceptan variables con llaves simples del backend: {'{nombre}'}, {'{mesAdeudado}'}, {'{importe}'}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saveState === 'saving' || !selectedTemplate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {saveState === 'saving' ? 'Guardando…' : 'Guardar mensaje'}
              </button>
              {saveState === 'saved' ? <span className="text-sm text-emerald-700">Guardado</span> : null}
              {saveState === 'error' && saveError ? <span className="text-sm text-rose-700">{saveError}</span> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Preview</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
              {draftBody ? renderPreview(draftBody) : 'Escribí un mensaje para ver la vista previa.'}
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
