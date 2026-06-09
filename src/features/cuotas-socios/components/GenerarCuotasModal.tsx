import { useEffect, useMemo, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import type { GenerarCuotasPayload } from '../../../types/cuotas'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: GenerarCuotasPayload) => Promise<void>
}

type FormState = {
  periodo: string
  concepto: string
  importe: string
  fecha_vencimiento: string
}

function currentPeriodo(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

function defaultConcepto(periodo: string): string {
  const match = periodo.match(/^(\d{4})-(\d{2})$/)
  if (!match) return 'Cuota mensual'
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1)
  if (Number.isNaN(date.getTime())) return 'Cuota mensual'
  const label = date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  return `Cuota ${label}`
}

function defaultVencimiento(periodo: string): string {
  const match = periodo.match(/^(\d{4})-(\d{2})$/)
  if (!match) return ''
  let year = Number(match[1])
  let month = Number(match[2]) + 1
  if (month > 12) {
    month = 1
    year += 1
  }
  return `${year}-${String(month).padStart(2, '0')}-10`
}

function createInitialState(): FormState {
  const periodo = currentPeriodo()
  return {
    periodo,
    concepto: defaultConcepto(periodo),
    importe: '',
    fecha_vencimiento: defaultVencimiento(periodo),
  }
}

export function GenerarCuotasModal({ isOpen, onClose, onConfirm }: Props) {
  const [state, setState] = useState<FormState>(createInitialState)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setState(createInitialState())
      setError(null)
    }
  }, [isOpen])

  const canSubmit = useMemo(() => {
    const importe = Number(state.importe)
    return (
      /^\d{4}-\d{2}$/.test(state.periodo.trim()) &&
      state.concepto.trim().length > 0 &&
      Number.isFinite(importe) &&
      importe > 0 &&
      state.fecha_vencimiento.trim().length > 0
    )
  }, [state])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!canSubmit || isSaving) return
    setIsSaving(true)
    setError(null)

    try {
      await onConfirm({
        periodo: state.periodo.trim(),
        concepto: state.concepto.trim(),
        importe: Number(state.importe),
        fecha_vencimiento: state.fecha_vencimiento,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('No se pudieron generar las cuotas del mes.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div
        className="flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="generar-cuotas-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 id="generar-cuotas-title" className="text-lg font-semibold text-slate-900">
            Generar cuotas del mes
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 transition duration-150 hover:bg-slate-100"
            onClick={onClose}
            disabled={isSaving}
          >
            Cerrar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="cuota-periodo">
                Período
              </label>
              <input
                id="cuota-periodo"
                type="text"
                placeholder="2026-06"
                className={inputClass}
                value={state.periodo}
                onChange={(e) => {
                  const periodo = e.target.value
                  setState((prev) => ({
                    ...prev,
                    periodo,
                    concepto: prev.concepto === defaultConcepto(prev.periodo) ? defaultConcepto(periodo) : prev.concepto,
                    fecha_vencimiento:
                      prev.fecha_vencimiento === defaultVencimiento(prev.periodo)
                        ? defaultVencimiento(periodo)
                        : prev.fecha_vencimiento,
                  }))
                }}
              />
              <p className="mt-1 text-xs text-slate-500">Formato AAAA-MM, por ejemplo 2026-06.</p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="cuota-concepto">
                Concepto
              </label>
              <input
                id="cuota-concepto"
                type="text"
                className={inputClass}
                value={state.concepto}
                onChange={(e) => setState((prev) => ({ ...prev, concepto: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="cuota-importe">
                Importe
              </label>
              <input
                id="cuota-importe"
                type="number"
                min="1"
                step="1"
                className={inputClass}
                value={state.importe}
                onChange={(e) => setState((prev) => ({ ...prev, importe: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="cuota-vencimiento">
                Fecha de vencimiento
              </label>
              <input
                id="cuota-vencimiento"
                type="date"
                className={inputClass}
                value={state.fecha_vencimiento}
                onChange={(e) => setState((prev) => ({ ...prev, fecha_vencimiento: e.target.value }))}
              />
            </div>
          </div>

          {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-50"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit || isSaving}
          >
            {isSaving ? 'Generando…' : 'Confirmar generación'}
          </button>
        </div>
      </div>
    </div>
  )
}
