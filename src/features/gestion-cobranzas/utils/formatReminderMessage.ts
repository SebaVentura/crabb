import { formatMoneyArs } from './formatMoney'

type Params = {
  nombre: string
  mesAdeudado: string
  importeAdeudado: number
}

export function formatReminderMessage(
  { nombre, mesAdeudado, importeAdeudado }: Params,
  template: string,
): string {
  return template
    .replace('{nombre}', nombre)
    .replace('{mesAdeudado}', mesAdeudado)
    .replace('{importe}', formatMoneyArs(importeAdeudado))
}
