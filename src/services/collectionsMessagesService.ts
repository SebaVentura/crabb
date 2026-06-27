import { apiRequest } from '../lib/apiClient'
import type {
  CollectionCampaign,
  CollectionDebtor,
  CollectionMessagePreviewPayload,
  CollectionMessagePreviewResult,
  CollectionSendSelectedItemResult,
  CollectionSendSelectedPayload,
  CollectionSendSelectedResult,
  CollectionSendTestPayload,
  CollectionSendTestResult,
} from '../types/collectionsMessages'

type UnknownObject = Record<string, unknown>

function asObject(value: unknown): UnknownObject {
  if (value && typeof value === 'object') return value as UnknownObject
  return {}
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
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

function extractDataRoot(response: unknown): UnknownObject {
  const root = asObject(response)
  const data = root.data
  if (data && typeof data === 'object') return data as UnknownObject
  return root
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => asString(item)).filter(Boolean)
}

function normalizeTemplateVariables(value: unknown): Record<string, string> {
  if (Array.isArray(value)) {
    const entries = value
      .map((item, index) => {
        if (typeof item === 'string') return [`${index + 1}`, item] as const
        const row = asObject(item)
        const key = asString(firstDefined(row.key, row.name, index + 1))
        const val = asString(firstDefined(row.value, row.example))
        return [key, val] as const
      })
      .filter(([, val]) => val.length > 0)
    return Object.fromEntries(entries)
  }

  if (value && typeof value === 'object') {
    const row = value as Record<string, unknown>
    return Object.fromEntries(
      Object.entries(row).map(([key, val]) => [key, asString(val)]),
    )
  }

  return {}
}

function extractCampaignRows(response: unknown): unknown[] {
  const root = asObject(response)
  const data = extractDataRoot(response)

  const candidates = [
    root.data,
    root.campaigns,
    data,
    asObject(data).campaigns,
    asObject(data).items,
    response,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate
  }

  return []
}

function normalizeCampaign(row: unknown): CollectionCampaign | null {
  const source = asObject(row)
  const key = asString(firstDefined(source.key, source.id, source.campaign_key))
  if (!key) return null

  return {
    key,
    label: asString(firstDefined(source.label, source.name), key),
    description: asString(firstDefined(source.description, source.descripcion)),
    simulationBody: asString(
      firstDefined(source.simulation_body, source.simulationBody, source.template, source.body),
    ),
    realSendEnabled: asBoolean(
      firstDefined(source.real_send_enabled, source.realSendEnabled),
      false,
    ),
    provider: asString(firstDefined(source.provider)) || null,
    templateId: asString(firstDefined(source.template_id, source.templateId)) || null,
    requiredVariables: normalizeStringArray(
      firstDefined(source.required_variables, source.requiredVariables),
    ),
    disabledReason: asString(firstDefined(source.disabled_reason, source.disabledReason)) || null,
    tono: asString(source.tono) || undefined,
  }
}

function normalizeDebtor(row: unknown): CollectionDebtor | null {
  const source = asObject(row)
  const socioId = asString(firstDefined(source.socio_id, source.socioId, source.id))
  if (!socioId) return null

  return {
    socioId,
    nombre: asString(firstDefined(source.nombre, source.nombre_apellido, source.nombreSocio)),
    taller: asString(firstDefined(source.taller, source.denominacion_taller, source.denominacionTaller)),
    telefono: asString(firstDefined(source.telefono, source.celular, source.phone)),
    estadoCuota: asString(firstDefined(source.estado_cuota, source.estadoCuota, source.estado)),
    mesAdeudado: asString(firstDefined(source.mesAdeudado, source.mes_adeudado, source.periodo_label)),
    periodo: asString(source.periodo),
    importe: asNumber(firstDefined(source.importe, source.amount, source.monto), 0),
    importeFormateado: asString(
      firstDefined(source.importe_formateado, source.importeFormateado),
    ),
    vencimiento: asString(firstDefined(source.vencimiento, source.fecha_vencimiento)),
  }
}

function normalizePreview(response: unknown): CollectionMessagePreviewResult {
  const data = extractDataRoot(response)
  const realTemplateRaw = asObject(firstDefined(data.real_template, data.realTemplate))

  return {
    simulationMessage: asString(
      firstDefined(data.simulation_message, data.simulationMessage, data.renderedMessage),
    ),
    realTemplate: {
      templateId: asString(firstDefined(realTemplateRaw.template_id, realTemplateRaw.templateId)),
      templateVariables: normalizeTemplateVariables(
        firstDefined(realTemplateRaw.template_variables, realTemplateRaw.templateVariables),
      ),
      enabled: asBoolean(firstDefined(realTemplateRaw.enabled, data.enabled), false),
    },
    enabled: asBoolean(firstDefined(data.enabled, realTemplateRaw.enabled), false),
  }
}

function normalizeSendTest(response: unknown, dryRun: boolean): CollectionSendTestResult {
  const data = extractDataRoot(response)
  const ok = asBoolean(firstDefined(data.ok, data.success), true)

  return {
    ok,
    dryRun,
    message: asString(firstDefined(data.message, data.simulation_message)) || undefined,
    provider: asString(data.provider) || undefined,
    templateId: asString(firstDefined(data.template_id, data.templateId)) || undefined,
    phoneMasked: asString(firstDefined(data.phone_masked, data.phoneMasked)) || undefined,
    error: asString(firstDefined(data.error, data.message)) || undefined,
    raw: data,
  }
}

function normalizeSendSelectedItem(row: unknown): CollectionSendSelectedItemResult {
  const source = asObject(row)
  const socioId = asString(firstDefined(source.socio_id, source.socioId, source.id))

  return {
    socioId,
    ok: asBoolean(firstDefined(source.ok, source.success), false),
    status: asString(firstDefined(source.status, source.estado), 'unknown'),
    provider: asString(source.provider) || null,
    phoneMasked: asString(firstDefined(source.phone_masked, source.phoneMasked)) || null,
    error: asString(firstDefined(source.error, source.message)) || null,
  }
}

function normalizeSendSelected(response: unknown, dryRun: boolean): CollectionSendSelectedResult {
  const data = extractDataRoot(response)
  const resultsRaw = firstDefined(data.results, data.items, data.socios)
  const results = Array.isArray(resultsRaw) ? resultsRaw.map(normalizeSendSelectedItem) : []

  return {
    dryRun,
    results,
    raw: data,
  }
}

const DEBTORS_PER_PAGE = 100

async function fetchAllDebtors(params?: {
  search?: string
  estado_cuota?: string
}): Promise<CollectionDebtor[]> {
  const query = new URLSearchParams()
  if (params?.search?.trim()) query.set('search', params.search.trim())
  if (params?.estado_cuota?.trim()) query.set('estado_cuota', params.estado_cuota.trim())
  query.set('page', '1')
  query.set('per_page', String(DEBTORS_PER_PAGE))

  const first = await apiRequest<unknown>(`/admin/collections/debtors?${query.toString()}`)
  const firstData = extractDataRoot(first)
  const debtorsRaw = firstDefined(firstData.debtors, firstData.items)
  const debtors = Array.isArray(debtorsRaw)
    ? debtorsRaw.map(normalizeDebtor).filter((item): item is CollectionDebtor => item !== null)
    : []

  const pagination = asObject(firstDefined(firstData.pagination, firstData.meta))
  const lastPage = asNumber(
    firstDefined(pagination.last_page, pagination.lastPage, firstData.last_page),
    1,
  )

  if (lastPage <= 1) return debtors

  for (let page = 2; page <= lastPage; page += 1) {
    query.set('page', String(page))
    const next = await apiRequest<unknown>(`/admin/collections/debtors?${query.toString()}`)
    const nextData = extractDataRoot(next)
    const nextRaw = firstDefined(nextData.debtors, nextData.items)
    if (Array.isArray(nextRaw)) {
      for (const row of nextRaw) {
        const normalized = normalizeDebtor(row)
        if (normalized) debtors.push(normalized)
      }
    }
  }

  return debtors
}

export const collectionsMessagesService = {
  async getCampaigns(): Promise<CollectionCampaign[]> {
    const response = await apiRequest<unknown>('/admin/collections/messages/campaigns')
    const rows = extractCampaignRows(response)
    return rows.map(normalizeCampaign).filter((item): item is CollectionCampaign => item !== null)
  },

  async getDebtors(params?: { search?: string; estado_cuota?: string }): Promise<CollectionDebtor[]> {
    return fetchAllDebtors(params)
  },

  async previewMessage(
    payload: CollectionMessagePreviewPayload,
  ): Promise<CollectionMessagePreviewResult> {
    const response = await apiRequest<unknown>('/admin/collections/messages/preview', {
      method: 'POST',
      body: payload,
    })
    return normalizePreview(response)
  },

  async sendTest(payload: CollectionSendTestPayload): Promise<CollectionSendTestResult> {
    const dryRun = payload.dry_run === true
    const response = await apiRequest<unknown>('/admin/collections/messages/send-test', {
      method: 'POST',
      body: { ...payload, dry_run: dryRun },
    })
    return normalizeSendTest(response, dryRun)
  },

  async sendSelected(payload: CollectionSendSelectedPayload): Promise<CollectionSendSelectedResult> {
    const dryRun = payload.dry_run === true
    const response = await apiRequest<unknown>('/admin/collections/messages/send-selected', {
      method: 'POST',
      body: { ...payload, dry_run: dryRun },
    })
    return normalizeSendSelected(response, dryRun)
  },
}
