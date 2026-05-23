import { useMemo, useState } from 'react'
import { ApiError } from '../../lib/apiClient'
import type { SocioPayload } from '../../services/sociosService'

type FieldErrors = Record<string, string>

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: SocioPayload) => Promise<void>
}

type FormState = {
  nro_socio: string
  nombre_apellido: string
  denominacion_taller: string
  dni_cuit: string
  rubro: string
  celular: string
  direccion: string
  localidad: string
  emails: string
  categoria: 'socio' | 'aportante'
  estado: 'activo' | 'inactivo'
  estado_cuota: 'no_definido' | 'al-dia' | 'moroso' | 'vencido' | 'pendiente'
  observaciones: string
}

function createDefaultState(): FormState {
  return {
    nro_socio: '',
    nombre_apellido: '',
    denominacion_taller: '',
    dni_cuit: '',
    rubro: '',
    celular: '',
    direccion: '',
    localidad: '',
    emails: '',
    categoria: 'socio',
    estado: 'activo',
    estado_cuota: 'no_definido',
    observaciones: '',
  }
}

function firstError(errors: string[] | undefined): string | undefined {
  if (!errors || errors.length === 0) return undefined
  return errors[0]
}

function mapValidationErrors(errors: Record<string, string[]> | undefined): FieldErrors {
  if (!errors) return {}
  return {
    nro_socio: firstError(errors.nro_socio) ?? '',
    nombre_apellido: firstError(errors.nombre_apellido) ?? '',
    denominacion_taller: firstError(errors.denominacion_taller) ?? '',
    dni_cuit: firstError(errors.dni_cuit) ?? '',
    rubro: firstError(errors.rubro) ?? '',
    celular: firstError(errors.celular) ?? '',
    direccion: firstError(errors.direccion) ?? '',
    localidad: firstError(errors.localidad) ?? '',
    emails: firstError(errors.emails) ?? firstError(errors['emails.0']) ?? '',
    categoria: firstError(errors.categoria) ?? '',
    estado: firstError(errors.estado) ?? '',
    estado_cuota: firstError(errors.estado_cuota) ?? '',
    observaciones: firstError(errors.observaciones) ?? '',
  }
}

export function SocioFormModal({ isOpen, onClose, onSubmit }: Props) {
  const [state, setState] = useState<FormState>(createDefaultState)
  const [isSaving, setIsSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return !isSaving && state.nombre_apellido.trim() !== ''
  }, [isSaving, state.nombre_apellido])

  if (!isOpen) return null

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSaving(true)
    setFieldErrors({})
    setGeneralError(null)

    const payload: SocioPayload = {
      nro_socio: state.nro_socio.trim(),
      nombre_apellido: state.nombre_apellido.trim(),
      denominacion_taller: state.denominacion_taller.trim(),
      dni_cuit: state.dni_cuit.trim(),
      rubro: state.rubro.trim(),
      celular: state.celular.trim(),
      direccion: state.direccion.trim(),
      localidad: state.localidad.trim(),
      emails: state.emails
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      categoria: state.categoria,
      estado: state.estado,
      estado_cuota: state.estado_cuota,
      observaciones: state.observaciones.trim(),
      ultimo_pago: null,
    }

    try {
      await onSubmit(payload)
      setState(createDefaultState())
      onClose()
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          setFieldErrors(mapValidationErrors(error.validationErrors))
          setGeneralError('Revisá los campos marcados para continuar.')
        } else if (error.status === 401) {
          setGeneralError('Tu sesión expiró. Iniciá sesión nuevamente.')
        } else {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('No se pudo crear el socio. Intentá nuevamente.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = (field: keyof FieldErrors) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 ${fieldErrors[field] ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-white'}`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div
        className="flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nuevo-socio-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 id="nuevo-socio-title" className="text-lg font-semibold text-slate-900">
            Nuevo socio
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Nro socio</label>
              <input className={inputClass('nro_socio')} value={state.nro_socio} onChange={(e) => setField('nro_socio', e.target.value)} />
              {fieldErrors.nro_socio ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.nro_socio}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">DNI/CUIT</label>
              <input className={inputClass('dni_cuit')} value={state.dni_cuit} onChange={(e) => setField('dni_cuit', e.target.value)} />
              {fieldErrors.dni_cuit ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.dni_cuit}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Nombre y apellido</label>
              <input className={inputClass('nombre_apellido')} value={state.nombre_apellido} onChange={(e) => setField('nombre_apellido', e.target.value)} />
              {fieldErrors.nombre_apellido ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.nombre_apellido}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Denominación taller</label>
              <input className={inputClass('denominacion_taller')} value={state.denominacion_taller} onChange={(e) => setField('denominacion_taller', e.target.value)} />
              {fieldErrors.denominacion_taller ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.denominacion_taller}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Rubro</label>
              <input className={inputClass('rubro')} value={state.rubro} onChange={(e) => setField('rubro', e.target.value)} />
              {fieldErrors.rubro ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.rubro}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Celular</label>
              <input className={inputClass('celular')} value={state.celular} onChange={(e) => setField('celular', e.target.value)} />
              {fieldErrors.celular ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.celular}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Dirección</label>
              <input className={inputClass('direccion')} value={state.direccion} onChange={(e) => setField('direccion', e.target.value)} />
              {fieldErrors.direccion ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.direccion}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Localidad</label>
              <input className={inputClass('localidad')} value={state.localidad} onChange={(e) => setField('localidad', e.target.value)} />
              {fieldErrors.localidad ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.localidad}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Emails (separados por coma)</label>
              <input className={inputClass('emails')} value={state.emails} onChange={(e) => setField('emails', e.target.value)} />
              {fieldErrors.emails ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.emails}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Categoría</label>
              <select className={inputClass('categoria')} value={state.categoria} onChange={(e) => setField('categoria', e.target.value as FormState['categoria'])}>
                <option value="socio">Socio</option>
                <option value="aportante">Aportante</option>
              </select>
              {fieldErrors.categoria ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.categoria}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Estado</label>
              <select className={inputClass('estado')} value={state.estado} onChange={(e) => setField('estado', e.target.value as FormState['estado'])}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              {fieldErrors.estado ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.estado}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Estado cuota</label>
              <select className={inputClass('estado_cuota')} value={state.estado_cuota} onChange={(e) => setField('estado_cuota', e.target.value as FormState['estado_cuota'])}>
                <option value="no_definido">No definido</option>
                <option value="pendiente">Pendiente</option>
                <option value="al-dia">Al día</option>
                <option value="moroso">Moroso</option>
                <option value="vencido">Vencido</option>
              </select>
              {fieldErrors.estado_cuota ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.estado_cuota}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Observaciones</label>
              <textarea className={inputClass('observaciones')} rows={3} value={state.observaciones} onChange={(e) => setField('observaciones', e.target.value)} />
              {fieldErrors.observaciones ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.observaciones}</p> : null}
            </div>
          </div>

          {generalError ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{generalError}</p> : null}
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
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
