import type { CuotaSocio, EstadoCuota } from '../../../types/cuotas'
import type { EstadoCuotaCobranza, SocioCobranza } from '../types'
import { formatMesAdeudado } from './mapSocioToSocioCobranza'

function mapEstadoCuotaToCobranza(estado: EstadoCuota): EstadoCuotaCobranza {
  if (estado === 'vencida') return 'vencido'
  return 'pendiente'
}

export function mapFiltroDeudaToEstadoCuota(filtro?: string): EstadoCuota | undefined {
  const normalized = filtro?.trim().toLowerCase()
  if (!normalized) return undefined
  if (normalized === 'vencido' || normalized === 'moroso') return 'vencida'
  if (normalized === 'pendiente') return 'pendiente'
  return undefined
}

function comparePeriodo(a: string, b: string): number {
  return b.localeCompare(a)
}

/**
 * Agrupa cuotas de deudores por socio para evitar filas duplicadas en cobranzas.
 */
export function aggregateCuotasToSociosCobranza(cuotas: CuotaSocio[]): SocioCobranza[] {
  const bySocio = new Map<string, CuotaSocio[]>()

  for (const cuota of cuotas) {
    if (!cuota.socioId) continue
    const current = bySocio.get(cuota.socioId) ?? []
    current.push(cuota)
    bySocio.set(cuota.socioId, current)
  }

  return Array.from(bySocio.entries()).map(([socioId, rows]) => {
    const sortedRows = [...rows].sort((a, b) => comparePeriodo(a.periodo, b.periodo))
    const primary = sortedRows.find((row) => row.estado === 'vencida') ?? sortedRows[0]
    const hasVencida = sortedRows.some((row) => row.estado === 'vencida')
    const importeAdeudado = sortedRows.reduce((total, row) => total + row.importe, 0)
    const periodos = sortedRows.map((row) => row.periodo).filter(Boolean)

    return {
      id: socioId,
      nombre: primary.nombreSocio || primary.denominacionTaller || 'Socio sin nombre',
      telefono: primary.telefono || '',
      estadoCuota: hasVencida ? 'vencido' : mapEstadoCuotaToCobranza(primary.estado),
      mesAdeudado:
        periodos.length > 1
          ? `${formatMesAdeudado(periodos[0])} (+${periodos.length - 1})`
          : formatMesAdeudado(primary.periodo),
      importeAdeudado,
      activo: true,
      estadoEnvio: 'sin_enviar',
    }
  })
}
