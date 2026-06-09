import { Card } from '../../../components/ui/Card'
import type { CuotasResumen } from '../../../types/cuotas'
import { formatMoneyArs } from '../../gestion-cobranzas/utils/formatMoney'

type Props = {
  resumen: CuotasResumen
}

export function CuotasResumenCards({ resumen }: Props) {
  const cards = [
    ['Total cuotas', String(resumen.totalCuotas)],
    ['Pendientes', String(resumen.pendientes)],
    ['Vencidas', String(resumen.vencidas)],
    ['Pagadas', String(resumen.pagadas)],
    ['Importe pendiente', formatMoneyArs(resumen.importePendiente)],
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
