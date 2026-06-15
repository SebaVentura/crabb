const FIELD_LABELS: Record<string, string> = {
  nombre_apellido: 'Nombre y apellido',
  denominacion_taller: 'Denominación del taller',
  dni_cuit: 'DNI o CUIT',
  celular: 'Celular',
  email: 'Email',
  rubro: 'Rubro',
  direccion: 'Dirección',
  localidad: 'Localidad',
  observaciones: 'Observaciones',
  password: 'Contraseña',
  password_confirmation: 'Confirmar contraseña',
}

type FormValidationErrorsProps = {
  errors?: Record<string, string[]>
}

export function FormValidationErrors({ errors }: FormValidationErrorsProps) {
  if (!errors) return null

  const entries = Object.entries(errors).filter(([, messages]) => messages.length > 0)
  if (entries.length === 0) return null

  return (
    <ul className="space-y-1 text-sm text-red-700">
      {entries.map(([field, messages]) => (
        <li key={field}>
          <span className="font-medium">{FIELD_LABELS[field] ?? field}:</span>{' '}
          {messages.join(' ')}
        </li>
      ))}
    </ul>
  )
}
