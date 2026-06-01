import { Card } from '../../../components/ui/Card'
import type { CampanaHistorial } from '../types'

type Props = {
  totalActivos: number
  sociosConDeuda: number
  seleccionados: number
  ultimoEnvio: CampanaHistorial | null
}

function formatFecha(iso: string | null) {
  if (!iso) return 'Sin registros'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export function GestionCobranzasResumenCards({ totalActivos, sociosConDeuda, seleccionados, ultimoEnvio }: Props) {
  const cards = [
    ['Total de socios activos', String(totalActivos)],
    ['Socios con deuda', String(sociosConDeuda)],
    ['Socios seleccionados', String(seleccionados)],
    ['Último envío realizado', formatFecha(ultimoEnvio?.fechaFin ?? null)],
  ] as const

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map(([label, value]) => (
        <Card key={label} className="border-slate-200 shadow-md">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-bold text-slate-900 md:text-xl">{value}</p>
        </Card>
      ))}
    </div>
  )
}
