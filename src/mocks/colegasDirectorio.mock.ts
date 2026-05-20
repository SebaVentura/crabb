import type { RubroSocio } from '../constants/rubros'

/** Rubro y responsable públicos por id de socio (directorio para recomendaciones). */
export const directorioColegasPorId: Record<
  string,
  { rubro: RubroSocio; responsable?: string }
> = {
  s01: { rubro: 'Mecánica general', responsable: 'Roberto Díaz' },
  s02: { rubro: 'Taller integral', responsable: 'Juan Pérez' },
  s03: { rubro: 'Taller integral', responsable: 'Equipo Oeste' },
  s04: { rubro: 'Electricidad del automotor', responsable: 'Laura Méndez' },
  s05: { rubro: 'Mecánica general', responsable: 'María González' },
  s06: { rubro: 'Lubricentro' },
  s07: { rubro: 'Mecánica general', responsable: 'Carlos Núñez' },
  s08: { rubro: 'Mecánica general', responsable: 'Carlos Ruiz' },
  s09: { rubro: 'Taller integral', responsable: 'Gerencia Norte' },
  s10: { rubro: 'Repuestos', responsable: 'Atención al público' },
  s11: { rubro: 'Mecánica general', responsable: 'Lucía Fernández' },
  s12: { rubro: 'Inyección electrónica', responsable: 'Técnico diagnóstico' },
  s13: { rubro: 'Gomería', responsable: 'El Tío' },
  s14: { rubro: 'Otro', responsable: 'Hidráulica BB' },
  s15: { rubro: 'Mecánica general', responsable: 'Roberto Sánchez' },
  s16: { rubro: 'Chapa y pintura' },
  s17: { rubro: 'Aire acondicionado', responsable: 'Elevadores BB' },
  s18: { rubro: 'Mecánica general', responsable: 'Ana Martínez' },
}
