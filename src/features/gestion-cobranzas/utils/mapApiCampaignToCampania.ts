import type { CollectionCampaign } from '../../../types/collectionsMessages'
import { CAMPANIAS_COBRANZA } from '../constants'
import type { CampaniaCobranza } from '../types'

export function mapApiCampaignToCampania(campaign: CollectionCampaign): CampaniaCobranza {
  const fallback = CAMPANIAS_COBRANZA.find((item) => item.id === campaign.key)

  return {
    id: campaign.key,
    label: campaign.label,
    descripcion: campaign.description || fallback?.descripcion || '',
    tono: campaign.tono || fallback?.tono || '—',
    template: campaign.simulationBody || fallback?.template || '',
    realSendEnabled: campaign.realSendEnabled,
    provider: campaign.provider,
    templateId: campaign.templateId,
    requiredVariables: campaign.requiredVariables,
    disabledReason: campaign.disabledReason,
  }
}
