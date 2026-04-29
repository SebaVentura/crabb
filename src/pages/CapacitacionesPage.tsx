import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { calendarioAnual, proximasCapacitaciones, repositorioAnteriores } from '../mocks/capacitaciones.mock'

export function CapacitacionesPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Capacitaciones" subtitle="Agenda anual, inscripción mock y repositorio histórico." />

      <Card title="Calendario anual (por mes)">
        <ul className="grid gap-2 md:grid-cols-2">
          {calendarioAnual.map((item) => (
            <li key={item.mes} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm">
              <p className="font-medium text-slate-900">{item.mes}</p>
              <p className="text-slate-600">{item.actividad}</p>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Capacitaciones próximas">
          <ul className="space-y-2">
            {proximasCapacitaciones.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-900">{item.titulo}</p>
                <p className="text-slate-600">{item.fecha}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone="blue">{item.modalidad}</Badge>
                  <span className="text-slate-700">{item.costo}</span>
                </div>
                <button
                  type="button"
                  className="mt-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Inscripción mock
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Repositorio de capacitaciones anteriores">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {repositorioAnteriores.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
