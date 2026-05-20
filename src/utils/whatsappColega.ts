/**
 * Normaliza teléfono argentino (ej. 0291 456-7890) a dígitos para wa.me.
 * Asume móvil/fijo Bahía Blanca si no trae código de país.
 */
export function normalizarTelefonoWhatsApp(telefono: string): string | null {
  const digits = telefono.replace(/\D/g, '')
  if (digits.length < 8) return null

  if (digits.startsWith('549') && digits.length >= 12) return digits
  if (digits.startsWith('54') && digits.length >= 11) return digits

  if (digits.startsWith('0')) {
    const sinCero = digits.slice(1)
    if (sinCero.length >= 10) return `54${sinCero}`
    if (sinCero.length >= 8) return `549${sinCero}`
  }

  if (digits.length === 10 && digits.startsWith('29')) return `54${digits}`
  if (digits.length >= 8 && digits.length <= 11) return `549${digits}`

  return digits.length >= 10 ? digits : null
}

export function enlaceWhatsAppColega(
  telefono: string,
  mensaje?: string,
): string | null {
  const numero = normalizarTelefonoWhatsApp(telefono)
  if (!numero) return null

  const base = `https://wa.me/${numero}`
  if (!mensaje?.trim()) return base

  return `${base}?text=${encodeURIComponent(mensaje.trim())}`
}
