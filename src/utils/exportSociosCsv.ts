import type { Socio } from '../types/socios'

const CSV_HEADERS = [
  'Nro socio',
  'Nombre y apellido',
  'Denominación / taller',
  'DNI/CUIT',
  'Celular',
  'Emails',
  'Categoría',
  'Condición',
  'Estado',
  'Estado cuota',
  'Último pago',
  'Rubro',
  'Observaciones',
] as const

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`
  }

  return normalized
}

function cell(value: string | null | undefined): string {
  return escapeCsvCell(value ?? '')
}

function formatEmails(socio: Socio): string {
  if (socio.emails?.length) {
    return socio.emails.join('; ')
  }

  return socio.email ?? ''
}

function formatUltimoPago(socio: Socio): string {
  return socio.ultimoPago ?? socio.fechaUltimoPago ?? ''
}

function socioToRow(socio: Socio): string[] {
  return [
    cell(socio.nroSocio),
    cell(socio.nombreApellido),
    cell(socio.denominacionTaller || socio.nombreRazonSocial),
    cell(socio.dniCuit || socio.cuitODni),
    cell(socio.celular || socio.telefono),
    cell(formatEmails(socio)),
    cell(socio.categoria),
    cell(socio.condicion),
    cell(socio.estado),
    cell(socio.estadoCuota),
    cell(formatUltimoPago(socio)),
    cell(socio.rubro),
    cell(socio.observaciones),
  ]
}

function buildFilename(): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')

  return `socios-${yyyy}-${mm}-${dd}.csv`
}

export function exportSociosCsv(socios: Socio[]): void {
  const lines = [
    CSV_HEADERS.join(','),
    ...socios.map((socio) => socioToRow(socio).join(',')),
  ]

  const blob = new Blob([`\uFEFF${lines.join('\n')}`], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = buildFilename()
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
