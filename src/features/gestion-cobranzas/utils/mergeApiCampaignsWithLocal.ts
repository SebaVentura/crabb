import type { CollectionCampaign } from '../../../types/collectionsMessages'
import { CAMPANIAS_COBRANZA } from '../constants'
import type { CampaniaCobranza } from '../types'
import { formatProviderLabel, resolveApiCampaignKey, resolveLocalCampaignId } from './campaignKeyAliases'

function mergeOne(local: (typeof CAMPANIAS_COBRANZA)[number], api?: CollectionCampaign): CampaniaCobranza {
  const apiKey = resolveApiCampaignKey(local.id)

  if (!api) {
    return {
      id: apiKey,
      label: local.label,
      descripcion: local.descripcion,
      tono: local.tono,
      template: local.template,
      realSendEnabled: false,
      provider: null,
      templateId: null,
      requiredVariables: [],
      disabledReason: null,
    }
  }

  return {
    id: api.key,
    label: api.label || local.label,
    descripcion: api.description || local.descripcion,
    tono: api.tono || local.tono,
    template: api.simulationBody || local.template,
    realSendEnabled: api.realSendEnabled,
    provider: formatProviderLabel(api.provider),
    templateId: api.templateId,
    requiredVariables: api.requiredVariables,
    disabledReason: api.disabledReason,
  }
}

/**
 * Combina plantillas locales con metadata del backend (real_send_enabled, provider, template_id).
 * Preserva orden y textos locales; usa campaign_key del API como id canónico.
 */
export function mergeApiCampaignsWithLocal(apiCampaigns: CollectionCampaign[]): CampaniaCobranza[] {
  const apiByKey = new Map(apiCampaigns.map((campaign) => [campaign.key, campaign]))

  const merged = CAMPANIAS_COBRANZA.map((local) => {
    const apiKey = resolveApiCampaignKey(local.id)
    return mergeOne(local, apiByKey.get(apiKey))
  })

  for (const api of apiCampaigns) {
    const localId = resolveLocalCampaignId(api.key)
    const alreadyIncluded = CAMPANIAS_COBRANZA.some(
      (local) => resolveApiCampaignKey(local.id) === api.key || local.id === localId,
    )
    if (!alreadyIncluded) {
      merged.push(mergeOne(
        {
          id: api.key,
          label: api.label,
          descripcion: api.description,
          tono: api.tono ?? '—',
          template: api.simulationBody,
        },
        api,
      ))
    }
  }

  return merged
}

export function pickDefaultCampaignId(campanias: CampaniaCobranza[], currentId: string): string {
  if (campanias.some((item) => item.id === currentId)) {
    return currentId
  }

  const resolvedCurrent = resolveApiCampaignKey(currentId)
  const byResolved = campanias.find((item) => item.id === resolvedCurrent)
  if (byResolved) return byResolved.id

  const enabled = campanias.find((item) => item.realSendEnabled)
  if (enabled) return enabled.id

  return campanias[0]?.id ?? currentId
}
