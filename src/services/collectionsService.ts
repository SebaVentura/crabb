import { apiRequest } from '../lib/apiClient'
import type { WhatsAppMessageTemplate } from '../types/whatsapp'

type UnknownObject = Record<string, unknown>

function asObject(value: unknown): UnknownObject {
  if (value && typeof value === 'object') {
    return value as UnknownObject
  }
  return {}
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1') return true
    if (normalized === 'false' || normalized === '0') return false
  }
  return fallback
}

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined)
}

function normalizeTemplate(source: unknown): WhatsAppMessageTemplate {
  const row = asObject(source)

  const variablesRaw = row.variables
  const variables = Array.isArray(variablesRaw)
    ? variablesRaw.map((item) => asString(item)).filter(Boolean)
    : []

  return {
    id: asString(firstDefined(row.id, row.frontend_id)),
    key: asString(row.key),
    name: asString(firstDefined(row.name, row.label)),
    body: asString(firstDefined(row.body, row.template)),
    active: asBoolean(row.active, true),
    tono: asString(row.tono),
    descripcion: asString(firstDefined(row.descripcion, row.description)),
    variables,
  }
}

export type CollectionSummary = {
  totalActivos: number
  sociosConDeuda: number
  simulationMode: boolean
  campaigns: Array<{
    id: string
    key: string
    label: string
    descripcion: string
    tono: string
    template: string
  }>
}

export type CollectionPreviewResult = {
  renderedMessage: string
  campaignId: string
}

export const collectionsService = {
  async getSummary(): Promise<CollectionSummary> {
    const response = await apiRequest<unknown>('/admin/collections/summary')
    const root = asObject(response)
    const data = asObject(firstDefined(root.data, response))

    const campaignsRaw = data.campaigns
    const campaigns = Array.isArray(campaignsRaw)
      ? campaignsRaw.map((item) => {
          const row = asObject(item)
          return {
            id: asString(row.id),
            key: asString(row.key),
            label: asString(row.label),
            descripcion: asString(row.descripcion),
            tono: asString(row.tono),
            template: asString(row.template),
          }
        })
      : []

    return {
      totalActivos: Number(data.totalActivos ?? 0),
      sociosConDeuda: Number(data.sociosConDeuda ?? 0),
      simulationMode: asBoolean(data.simulationMode, true),
      campaigns,
    }
  },

  async getMessageTemplates(): Promise<WhatsAppMessageTemplate[]> {
    const response = await apiRequest<unknown>('/admin/collections/message-templates')
    const root = asObject(response)
    const data = firstDefined(root.data, response)
    const rows = Array.isArray(data) ? data : []

    return rows.map(normalizeTemplate)
  },

  async updateMessageTemplate(
    id: string,
    payload: Partial<Pick<WhatsAppMessageTemplate, 'name' | 'body' | 'active'>>,
  ): Promise<WhatsAppMessageTemplate> {
    const response = await apiRequest<unknown>(`/admin/collections/message-templates/${id}`, {
      method: 'PUT',
      body: payload,
    })
    const root = asObject(response)
    const data = firstDefined(root.data, response)

    return normalizeTemplate(data)
  },

  async previewMessage(campaignId: string, socioId?: number | string): Promise<CollectionPreviewResult> {
    const response = await apiRequest<unknown>('/admin/collections/preview', {
      method: 'POST',
      body: {
        campaign_id: campaignId,
        socio_id: socioId ?? undefined,
      },
    })
    const root = asObject(response)
    const data = asObject(firstDefined(root.data, response))

    return {
      renderedMessage: asString(data.renderedMessage),
      campaignId: asString(firstDefined(data.campaignId, campaignId)),
    }
  },
}
