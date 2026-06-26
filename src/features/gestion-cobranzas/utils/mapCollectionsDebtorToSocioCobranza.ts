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
  return {
    id: debtor.socioId,
    nombre: debtor.nombre || debtor.taller || 'Socio sin nombre',
    telefono: debtor.telefono,
    estadoCuota: mapEstadoCuota(debtor.estadoCuota),
    mesAdeudado: debtor.mesAdeudado || debtor.periodo,
    importeAdeudado: debtor.importe,
    activo: true,
    estadoEnvio: 'no_seleccionado',
  }
}
