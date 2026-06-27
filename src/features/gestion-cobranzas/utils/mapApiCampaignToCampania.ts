import type { CollectionCampaign } from '../../../types/collectionsMessages'
import { CAMPANIAS_COBRANZA } from '../constants'
import type { CampaniaCobranza } from '../types'
import { formatProviderLabel, resolveLocalCampaignId } from './campaignKeyAliases'

export function mapApiCampaignToCampania(campaign: CollectionCampaign): CampaniaCobranza {
  const localId = resolveLocalCampaignId(campaign.key)
  const fallback = CAMPANIAS_COBRANZA.find((item) => item.id === localId || item.id === campaign.key)

  return {
    id: campaign.key,
    label: campaign.label || fallback?.label || campaign.key,
    descripcion: campaign.description || fallback?.descripcion || '',
    tono: campaign.tono || fallback?.tono || '—',
    template: campaign.simulationBody || fallback?.template || '',
    realSendEnabled: campaign.realSendEnabled,
    provider: formatProviderLabel(campaign.provider),
    templateId: campaign.templateId,
    requiredVariables: campaign.requiredVariables,
    disabledReason: campaign.disabledReason,
  }
}
