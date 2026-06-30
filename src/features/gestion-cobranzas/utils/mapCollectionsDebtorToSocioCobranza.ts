import type { CollectionDebtor } from '../../../types/collectionsMessages'
import type { EstadoCuotaCobranza, SocioCobranza } from '../types'

function mapEstadoCuota(estado: string): EstadoCuotaCobranza {
  const normalized = estado.trim().toLowerCase()
  if (normalized.includes('moroso')) return 'moroso'
  if (normalized.includes('venc')) return 'vencido'
  return 'pendiente'
}

export function mapFiltroDeudaToEstadoCuotaApi(filtro?: string): string | undefined {
  const normalized = filtro?.trim().toLowerCase()
  if (!normalized) return undefined
  if (normalized === 'moroso' || normalized === 'vencido' || normalized === 'pendiente') {
    return normalized
  }
  return undefined
}

export function mapCollectionsDebtorToSocioCobranza(debtor: CollectionDebtor): SocioCobranza {
  const importeAdeudado =
    debtor.totalAdeudado && debtor.totalAdeudado > 0 ? debtor.totalAdeudado : debtor.importe

  return {
    id: debtor.socioId,
    nombre: debtor.nombre || debtor.taller || 'Socio sin nombre',
    taller: debtor.taller || undefined,
    telefono: debtor.telefono,
    estadoCuota: mapEstadoCuota(debtor.estadoCuota),
    mesAdeudado: debtor.mesAdeudado || debtor.periodo || debtor.conceptos || '—',
    importeAdeudado,
    cuotasPendientes: debtor.cuotasPendientes,
    conceptosDeuda: debtor.conceptos,
    activo: true,
    estadoEnvio: 'sin_enviar',
  }
}
