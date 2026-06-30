import type { CuotasFilters, EstadoCuota } from '../../../types/cuotas'

export type CuotasUiFilters = {
  search?: string
  periodo?: string
  estado?: EstadoCuota | ''
  tipo?: 'inicial' | 'mensual' | ''
  page?: number
  per_page?: number
}

/**
 * Maps UI filter state to API query params (cuotasService.buildQuery).
 *
 * - tipo=inicial → tipo only; periodo is never sent (inicial-01…08 are not monthly).
 * - tipo=mensual → tipo + periodo when set.
 * - tipo=todas → search/estado only; periodo is omitted so initial fees are not hidden.
 */
export function resolveCuotasApiFilters(ui: CuotasUiFilters): CuotasFilters {
  const api: CuotasFilters = {
    search: ui.search?.trim() || undefined,
    estado: ui.estado || undefined,
    page: ui.page,
    per_page: ui.per_page,
  }

  if (ui.tipo === 'inicial') {
    api.tipo = 'inicial'
    return api
  }

  if (ui.tipo === 'mensual') {
    api.tipo = 'mensual'
    if (ui.periodo?.trim()) {
      api.periodo = ui.periodo.trim()
    }
    return api
  }

  return api
}

export function isPeriodoFilterDisabled(tipo: '' | 'inicial' | 'mensual'): boolean {
  return tipo === 'inicial'
}

export function isPeriodoIgnoredForTipoTodas(
  tipo: '' | 'inicial' | 'mensual',
  periodo: string,
): boolean {
  return tipo === '' && Boolean(periodo.trim())
}
