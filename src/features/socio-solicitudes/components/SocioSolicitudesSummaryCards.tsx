import { Card } from '../../../components/ui/Card'
import type { SocioSolicitudSummary } from '../../../types/socioSolicitudes'

type Props = {
  summary: SocioSolicitudSummary
}

export function SocioSolicitudesSummaryCards({ summary }: Props) {
  const cards = [
    ['Total', String(summary.total)],
    ['Pendientes', String(summary.pendientes)],
    ['Observadas', String(summary.observadas)],
    ['Aprobadas', String(summary.aprobadas)],
    ['Rechazadas', String(summary.rechazadas)],
  ] as const

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map(([label, value]) => (
        <Card key={label} className="border-slate-200 shadow-md">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-bold text-slate-900 md:text-xl">{value}</p>
        </Card>
      ))}
    </div>
  )
}
