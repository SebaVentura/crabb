import { MENSAJE_TEMPLATE } from '../constants'
import { formatMoneyArs } from './formatMoney'

type Params = {
  nombre: string
  mesAdeudado: string
  importeAdeudado: number
}

export function formatReminderMessage({ nombre, mesAdeudado, importeAdeudado }: Params): string {
  return MENSAJE_TEMPLATE.replace('{nombre}', nombre)
    .replace('{mesAdeudado}', mesAdeudado)
    .replace('{importe}', formatMoneyArs(importeAdeudado))
}
