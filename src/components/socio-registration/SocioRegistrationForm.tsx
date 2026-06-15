import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  SocioJoinRequestError,
  socioRegistrationService,
} from '../../services/socioRegistrationService'
import { normalizeDocument } from '../../utils/normalizeDocument'
import { FormValidationErrors } from './FormValidationErrors'

type JoinFormState = {
  nombre_apellido: string
  denominacion_taller: string
  dni_cuit: string
  celular: string
  email: string
  rubro: string
  direccion: string
  localidad: string
  observaciones: string
}

const initialState: JoinFormState = {
  nombre_apellido: '',
  denominacion_taller: '',
  dni_cuit: '',
  celular: '',
  email: '',
  rubro: '',
  direccion: '',
  localidad: '',
  observaciones: '',
}

const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20'

const labelClassName = 'text-sm font-medium text-slate-700'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function SocioRegistrationForm() {
  const [form, setForm] = useState<JoinFormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorKind, setErrorKind] = useState<SocioJoinRequestError['kind'] | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [successEstado, setSuccessEstado] = useState<string | null>(null)

  const updateField = (field: keyof JoinFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = (): string | null => {
    if (!form.nombre_apellido.trim()) return 'El nombre y apellido es obligatorio.'
    if (!form.dni_cuit.trim()) return 'El DNI o CUIT es obligatorio.'
    if (!form.email.trim()) return 'El email es obligatorio.'
    if (!isValidEmail(form.email.trim())) return 'Ingresá un email válido.'
    if (!form.celular.trim()) return 'El celular es obligatorio.'
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setErrorKind(null)
    setValidationErrors(undefined)

    const validationError = validate()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setSubmitting(true)

    try {
      const response = await socioRegistrationService.submitJoinRequest({
        nombre_apellido: form.nombre_apellido.trim(),
        dni_cuit: normalizeDocument(form.dni_cuit.trim()),
        email: form.email.trim(),
        celular: form.celular.trim(),
        denominacion_taller: form.denominacion_taller.trim() || undefined,
        rubro: form.rubro.trim() || undefined,
        direccion: form.direccion.trim() || undefined,
        localidad: form.localidad.trim() || undefined,
        observaciones: form.observaciones.trim() || undefined,
      })

      setSuccessMessage(
        response.message ||
          'Solicitud enviada correctamente. La administración de CRABB revisará tus datos.',
      )
      setSuccessEstado(response.data?.estado ?? null)
    } catch (error) {
      if (error instanceof SocioJoinRequestError) {
        setErrorKind(error.kind)
        setValidationErrors(error.validationErrors)
        setErrorMessage(error.message)
      } else if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('No se pudo enviar la solicitud. Intentá nuevamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (successMessage) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-slate-800 shadow-xl shadow-black/10">
        <h2 className="text-xl font-semibold text-emerald-900">Solicitud enviada</h2>
        <p className="mt-3 text-sm leading-7 text-emerald-900/90">{successMessage}</p>
        {successEstado ? (
          <p className="mt-2 text-sm text-emerald-800/85">
            Estado: <span className="font-medium">{successEstado}</span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Volver al inicio
          </Link>
          <Link
            to="/login"
            className="inline-flex rounded-lg border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <p>{errorMessage}</p>
          <FormValidationErrors errors={validationErrors} />
          {errorKind === 'socio_already_exists' ? (
            <Link
              to="/registro-socio"
              className="mt-2 inline-flex font-medium text-red-800 underline"
            >
              Activar cuenta de socio
            </Link>
          ) : null}
        </div>
      ) : null}

      <p className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">
        Completá el formulario para solicitar tu asociación a CRABB. La solicitud será revisada por
        la administración de CRABB.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClassName} htmlFor="nombre_apellido">
            Nombre y apellido *
          </label>
          <input
            id="nombre_apellido"
            className={inputClassName}
            value={form.nombre_apellido}
            onChange={(event) => updateField('nombre_apellido', event.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="dni_cuit">
            DNI o CUIT *
          </label>
          <input
            id="dni_cuit"
            className={inputClassName}
            value={form.dni_cuit}
            onChange={(event) => updateField('dni_cuit', event.target.value)}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="celular">
            Celular *
          </label>
          <input
            id="celular"
            className={inputClassName}
            value={form.celular}
            onChange={(event) => updateField('celular', event.target.value)}
            type="tel"
            autoComplete="tel"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClassName} htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            className={inputClassName}
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="denominacion_taller">
            Denominación del taller
          </label>
          <input
            id="denominacion_taller"
            className={inputClassName}
            value={form.denominacion_taller}
            onChange={(event) => updateField('denominacion_taller', event.target.value)}
            autoComplete="organization"
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="rubro">
            Rubro
          </label>
          <input
            id="rubro"
            className={inputClassName}
            value={form.rubro}
            onChange={(event) => updateField('rubro', event.target.value)}
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="direccion">
            Dirección
          </label>
          <input
            id="direccion"
            className={inputClassName}
            value={form.direccion}
            onChange={(event) => updateField('direccion', event.target.value)}
            autoComplete="street-address"
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="localidad">
            Localidad
          </label>
          <input
            id="localidad"
            className={inputClassName}
            value={form.localidad}
            onChange={(event) => updateField('localidad', event.target.value)}
            autoComplete="address-level2"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClassName} htmlFor="observaciones">
            Observaciones o mensaje
          </label>
          <textarea
            id="observaciones"
            className={`${inputClassName} min-h-[110px] resize-y`}
            value={form.observaciones}
            onChange={(event) => updateField('observaciones', event.target.value)}
            rows={4}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-gradient-to-r from-sky-400 to-sky-500 px-4 py-3 text-sm font-bold uppercase tracking-[0.06em] text-[#06213c] shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? 'Enviando solicitud...' : 'Enviar solicitud de asociación'}
      </button>

      <p className="text-center text-sm text-slate-500">
        ¿Ya figurás en el padrón?{' '}
        <Link to="/registro-socio" className="font-medium text-sky-700 hover:text-sky-900">
          Activar cuenta de socio
        </Link>
      </p>
    </form>
  )
}
