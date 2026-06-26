export type CollectionCampaign = {
  key: string
  label: string
  description: string
  simulationBody: string
  realSendEnabled: boolean
  provider: string | null
  templateId: string | null
  requiredVariables: string[]
  disabledReason: string | null
  tono?: string
}

export type CollectionDebtor = {
  socioId: string
  nombre: string
  taller: string
  telefono: string
  estadoCuota: string
  mesAdeudado: string
  periodo: string
  importe: number
  importeFormateado: string
  vencimiento: string
}

export type CollectionMessagePreviewPayload = {
  campaign_key: string
  socio_id: number | string
}

export type CollectionRealTemplatePreview = {
  templateId: string
  templateVariables: Record<string, string>
  enabled: boolean
}

export type CollectionMessagePreviewResult = {
  simulationMessage: string
  realTemplate: CollectionRealTemplatePreview
  enabled: boolean
}

export type CollectionSendTestPayload = {
  phone: string
  campaign_key: string
  params: Record<string, string>
  dry_run?: boolean
}

export type CollectionSendTestResult = {
  ok: boolean
  dryRun: boolean
  message?: string
  provider?: string
  templateId?: string
  phoneMasked?: string
  error?: string
  raw?: unknown
}

export type CollectionSendSelectedPayload = {
  campaign_key: string
  socio_ids: Array<number | string>
  dry_run?: boolean
}

export type CollectionSendSelectedItemResult = {
  socioId: string
  ok: boolean
  status: string
  provider: string | null
  phoneMasked: string | null
  error: string | null
}

export type CollectionSendSelectedResult = {
  dryRun: boolean
  results: CollectionSendSelectedItemResult[]
  raw?: unknown
}
