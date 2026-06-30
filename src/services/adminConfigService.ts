import { apiRequest } from '../lib/apiClient'
import type { InitialFeePreview } from '../types/socioSolicitudes'

type UnknownObject = Record<string, unknown>

/** Endpoint principal del backend para configuración de cuota inicial de membresía. */
export const INITIAL_MEMBERSHIP_FEE_ENDPOINT = '/admin/settings/initial-membership-fee'

/** Fallbacks legacy; solo se consultan si el endpoint principal no responde. */
const FALLBACK_CONFIG_ENDPOINTS = [
  '/admin/config/initial-fee',
  '/admin/settings/initial-fee',
] as const

function asObject(value: unknown): UnknownObject {
  if (value && typeof value === 'object') return value as UnknownObject
  return {}
}

function asNumberOrNull(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined)
}

/**
 * Normaliza la respuesta de configuración.
 * Contrato: { ok, data: { amount, feesCount|fees_count, total } }
 */
function parseInitialFeePreview(response: unknown): InitialFeePreview | null {
  const root = asObject(response)
  const data = asObject(firstDefined(root.data, response))

  const initialFeeAmount = asNumberOrNull(
    firstDefined(data.amount, data.initialFeeAmount, data.initial_fee_amount, root.amount),
  )
  const initialFeesCount = asNumberOrNull(
    firstDefined(data.feesCount, data.fees_count, data.initialFeesCount, data.initial_fees_count, root.feesCount),
  )
  const initialFeesTotal = asNumberOrNull(
    firstDefined(data.total, data.initialFeesTotal, data.initial_fees_total, root.total),
  )

  if (initialFeeAmount === null && initialFeesCount === null && initialFeesTotal === null) {
    return null
  }

  return {
    initialFeeAmount,
    initialFeesCount: initialFeesCount ?? 8,
    initialFeesTotal,
  }
}

/**
 * Lee configuración de cuota inicial.
 * Principal: GET /admin/settings/initial-membership-fee
 */
export async function getInitialFeeConfig(): Promise<InitialFeePreview | null> {
  try {
    const response = await apiRequest<unknown>(INITIAL_MEMBERSHIP_FEE_ENDPOINT)
    const parsed = parseInitialFeePreview(response)
    if (parsed) return parsed
  } catch {
    // Endpoint principal no disponible: probar fallbacks legacy.
  }

  for (const endpoint of FALLBACK_CONFIG_ENDPOINTS) {
    try {
      const response = await apiRequest<unknown>(endpoint)
      const parsed = parseInitialFeePreview(response)
      if (parsed) return parsed
    } catch {
      // Siguiente candidato.
    }
  }

  return null
}
