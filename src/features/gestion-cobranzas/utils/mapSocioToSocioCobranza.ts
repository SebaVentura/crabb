import type { Socio } from '../../../types/socios'
import type { EstadoCuotaCobranza, SocioCobranza } from '../types'

const ESTADOS_CUOTA_COBRANZAS: EstadoCuotaCobranza[] = ['moroso', 'vencido', 'pendiente']

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export function formatMesAdeudado(ultimoPago: string | null | undefined): string {
  const value = ultimoPago?.trim()
  if (!value) return 'Período pendiente'

  const isoMatch = value.match(/^(\d{4})-(\d{2})/)
  if (isoMatch) {
    const monthIndex = Number(isoMatch[2]) - 1
    if (monthIndex >= 0 && monthIndex < MESES.length) {
      return `${MESES[monthIndex]} ${isoMatch[1]}`
    }
  }

  return 'Período pendiente'
}

function isEstadoCuotaCobranzas(value: Socio['estadoCuota']): value is EstadoCuotaCobranza {
  return ESTADOS_CUOTA_COBRANZAS.includes(value as EstadoCuotaCobranza)
}

export function mapSocioToSocioCobranza(socio: Socio): SocioCobranza | null {
  if (socio.estado !== 'activo') return null
  if (socio.estadoCuota === 'al-dia' || socio.estadoCuota === 'no_definido') return null
  if (!isEstadoCuotaCobranzas(socio.estadoCuota)) return null

  return {
    id: socio.id,
    nombre: socio.nombreApellido || socio.denominacionTaller || 'Socio sin nombre',
    telefono: socio.celular || socio.telefono || '',
    estadoCuota: socio.estadoCuota,
    mesAdeudado: formatMesAdeudado(socio.ultimoPago ?? socio.fechaUltimoPago),
    importeAdeudado: socio.montoCuota > 0 ? socio.montoCuota : 0,
    activo: true,
    estadoEnvio: 'no_seleccionado',
  }
}
