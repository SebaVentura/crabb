export type WhatsAppMessageTemplate = {
  id: string
  key: string
  name: string
  body: string
  active: boolean
  tono: string
  descripcion: string
  variables: string[]
}

export const WHATSAPP_TEMPLATE_VARIABLES = [
  'nombre',
  'taller',
  'periodo',
  'importe',
  'vencimiento',
  'link_pago',
  'mesAdeudado',
] as const

export type WhatsAppTemplateVariable = (typeof WHATSAPP_TEMPLATE_VARIABLES)[number]
