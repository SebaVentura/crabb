import { getCampaniaById } from '../constants'
import type { CampaniaCobranza } from '../types'
import { resolveApiCampaignKey, resolveLocalCampaignId } from './campaignKeyAliases'

export function campaniaIdsMatch(a: string, b: string): boolean {
  return (
    a === b ||
    resolveApiCampaignKey(a) === resolveApiCampaignKey(b) ||
    resolveLocalCampaignId(a) === resolveLocalCampaignId(b)
  )
}

export function findCampaniaById(campanias: CampaniaCobranza[], id: string): CampaniaCobranza | undefined {
  const direct = campanias.find((campania) => campania.id === id)
  if (direct) return direct

  const apiKey = resolveApiCampaignKey(id)
  const byApiKey = campanias.find(
    (campania) => campania.id === apiKey || resolveApiCampaignKey(campania.id) === apiKey,
  )
  if (byApiKey) return byApiKey

  const localId = resolveLocalCampaignId(id)
  return campanias.find(
    (campania) => campania.id === localId || resolveLocalCampaignId(campania.id) === localId,
  )
}

export function resolveCampaniaById(campanias: CampaniaCobranza[], id: string): CampaniaCobranza {
  return findCampaniaById(campanias, id) ?? getCampaniaById(resolveLocalCampaignId(id))
}
