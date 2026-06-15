/**
 * Normaliza DNI/CUIT como string, sin convertir a número.
 * Quita puntos, guiones, espacios y cualquier carácter no numérico.
 */
export function normalizeDocument(value: string): string {
  return value.replace(/\D/g, '')
}
