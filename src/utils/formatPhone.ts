const SCIENTIFIC_NOTATION_REGEX = /^[+-]?\d+(?:\.\d+)?e[+-]?\d+$/i

export function formatPhone(value: unknown): string {
  if (value === null || value === undefined) return '-'

  const raw = String(value).trim()
  if (!raw) return '-'

  // Scientific notation usually comes from Excel import parsing.
  // Frontend only signals the issue; canonical fix belongs in backend/importer.
  if (SCIENTIFIC_NOTATION_REGEX.test(raw)) {
    return `${raw} (revisar importador)`
  }

  return raw
}
