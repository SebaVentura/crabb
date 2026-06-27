/** IDs locales / legacy → campaign_key del backend. */
export const LOCAL_TO_API_CAMPAIGN_KEY: Record<string, string> = {
  cuota_pendiente: 'primer_aviso_cuenta',
  primer_aviso: 'primer_aviso_cuenta',
  first_notice: 'primer_aviso_cuenta',
  socio_moroso: 'segundo_aviso_moroso',
  ultimo_aviso: 'ultimo_aviso_administrativo',
  inicio_mes: 'inicio_mes',
}

export const API_TO_LOCAL_CAMPAIGN_KEY: Record<string, string> = {
  primer_aviso_cuenta: 'cuota_pendiente',
  segundo_aviso_moroso: 'socio_moroso',
  ultimo_aviso_administrativo: 'ultimo_aviso',
  inicio_mes: 'inicio_mes',
}

export function resolveApiCampaignKey(keyOrLocalId: string): string {
  return LOCAL_TO_API_CAMPAIGN_KEY[keyOrLocalId] ?? keyOrLocalId
}

export function resolveLocalCampaignId(apiKey: string): string {
  return API_TO_LOCAL_CAMPAIGN_KEY[apiKey] ?? apiKey
}

export function formatProviderLabel(provider: string | null | undefined): string | null {
  if (!provider) return null
  const trimmed = provider.trim()
  if (!trimmed) return null
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
