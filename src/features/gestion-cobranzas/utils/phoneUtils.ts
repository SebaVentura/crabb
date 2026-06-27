export type WhatsappPhoneValidation = {
  valido: boolean
  ambiguo: boolean
  motivo?: string
  normalizado: string
  display: string
}

/** Toma el primer número si hay varios separados por //, ; o , */
export function extractPrimaryPhone(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const parts = trimmed.split(/\s*\/\/\s*|[;,]\s*/).map((p) => p.trim()).filter(Boolean)
  return parts[0] ?? trimmed
}

export function normalizePhoneDigits(raw: string): string {
  const primary = extractPrimaryPhone(raw)
  const hasPlus = primary.trimStart().startsWith('+')
  const digits = primary.replace(/\D/g, '')
  return hasPlus ? `+${digits}` : digits
}

export function normalizePhoneForDisplay(raw: string): string {
  const primary = extractPrimaryPhone(raw)
  if (!primary) return 'Sin teléfono válido'

  const digits = primary.replace(/\D/g, '')
  if (digits.length < 8) return 'Sin teléfono válido'

  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits.startsWith('54')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 8)}-${digits.slice(8)}`
  }
  if (digits.length === 13 && digits.startsWith('54')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  return primary
}

export function hasValidWhatsappPhone(raw: string): WhatsappPhoneValidation {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { valido: false, ambiguo: false, motivo: 'Teléfono faltante', normalizado: '', display: 'Sin teléfono válido' }
  }

  const ambiguo = /\s*\/\/\s*|[;,]/.test(trimmed) && trimmed.split(/\s*\/\/\s*|[;,]\s*/).filter(Boolean).length > 1
  const primary = extractPrimaryPhone(trimmed)
  const digits = primary.replace(/\D/g, '')

  if (digits.length < 8) {
    return {
      valido: false,
      ambiguo,
      motivo: 'Número demasiado corto',
      normalizado: digits,
      display: 'Sin teléfono válido',
    }
  }

  // Argentina: 8–13 dígitos razonables (local, con 9, con 54)
  if (digits.length > 15) {
    return {
      valido: false,
      ambiguo,
      motivo: 'Número demasiado largo',
      normalizado: digits,
      display: normalizePhoneForDisplay(primary),
    }
  }

  return {
    valido: true,
    ambiguo,
    normalizado: digits,
    display: normalizePhoneForDisplay(primary),
  }
}

/** @deprecated Usar hasValidWhatsappPhone */
export function validatePhone(telefono: string): { valido: boolean; motivo?: string } {
  const result = hasValidWhatsappPhone(telefono)
  return { valido: result.valido, motivo: result.motivo }
}
