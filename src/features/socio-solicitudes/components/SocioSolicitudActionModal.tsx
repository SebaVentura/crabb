import { useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import type { SocioSolicitud } from '../../../types/socioSolicitudes'
import { REJECT_REASON_OPTIONS } from '../../../types/socioSolicitudes'

export type ActionModalMode = 'approve' | 'reject' | 'observe' | null

type Props = {
  mode: ActionModalMode
  solicitud: SocioSolicitud | null
  isSaving: boolean
  onClose: () => void
  onApprove: (adminNotes: string) => Promise<boolean>
  onReject: (payload: { reason: string; adminNotes: string }) => Promise<boolean>
  onObserve: (adminNotes: string) => Promise<boolean>
}

const APPROVE_MESSAGE =
  'Esta acción incorporará la solicitud al padrón de socios o la vinculará con un socio existente. No se creará una cuenta de usuario automáticamente.'

export function SocioSolicitudActionModal({
  mode,
  solicitud,
  isSaving,
  onClose,
  onApprove,
  onReject,
  onObserve,
}: Props) {
  const [adminNotes, setAdminNotes] = useState('')
  const [reason, setReason] = useState<string>(REJECT_REASON_OPTIONS[0])
  const [customReason, setCustomReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!mode || !solicitud) return null

  const title =
    mode === 'approve' ? 'Aprobar solicitud' : mode === 'reject' ? 'Rechazar solicitud' : 'Observar solicitud'

  const handleSubmit = async () => {
    setError(null)
    try {
      if (mode === 'observe' && !adminNotes.trim()) {
        setError('La nota administrativa es obligatoria.')
        return
      }

      let ok = false
      if (mode === 'approve') {
        ok = await onApprove(adminNotes)
      } else if (mode === 'reject') {
        const finalReason = reason === 'Otro' ? customReason.trim() : reason
        ok = await onReject({ reason: finalReason, adminNotes })
      } else {
        ok = await onObserve(adminNotes)
      }

      if (ok) onClose()
    } catch (err) {
      if (err instanceof ApiError) setError(err.message)
      else setError('No se pudo completar la acción.')
    }
  }

  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900'

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
            onClick={onClose}
            disabled={isSaving}
          >
            Cerrar
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5">
          <p className="text-sm text-slate-700">
            <span className="font-medium">{solicitud.nombreApellido}</span>
            {solicitud.dniCuit ? ` · ${solicitud.dniCuit}` : ''}
          </p>

          {mode === 'approve' ? (
            <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
              {APPROVE_MESSAGE}
            </p>
          ) : null}

          {mode === 'reject' ? (
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="reject-reason">
                  Motivo
                </label>
                <select
                  id="reject-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={inputClass}
                >
                  {REJECT_REASON_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {reason === 'Otro' ? (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="reject-custom">
                    Detalle del motivo
                  </label>
                  <input
                    id="reject-custom"
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className={inputClass}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="admin-notes">
              Notas administrativas {mode === 'observe' ? '(obligatorio)' : '(opcional)'}
            </label>
            <textarea
              id="admin-notes"
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className={inputClass}
            />
          </div>

          {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSaving ? 'Guardando…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
