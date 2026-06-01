export type PhoneValidation = {
  valido: boolean
  motivo?: string
}

export function validatePhone(telefono: string): PhoneValidation {
  const trimmed = telefono.trim()
  if (!trimmed) {
    return { valido: false, motivo: 'Teléfono faltante' }
  }

  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 8) {
    return { valido: false, motivo: 'Número inválido' }
  }

  if (digits.length <= 4) {
    return { valido: false, motivo: 'Número inválido' }
  }

  return { valido: true }
}
