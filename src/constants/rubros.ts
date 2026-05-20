export const RUBROS_SOCIO = [
  'Mecánica general',
  'Electricidad del automotor',
  'Chapa y pintura',
  'Gomería',
  'Repuestos',
  'Lubricentro',
  'Aire acondicionado',
  'Inyección electrónica',
  'Taller integral',
  'Otro',
] as const

export type RubroSocio = (typeof RUBROS_SOCIO)[number]
