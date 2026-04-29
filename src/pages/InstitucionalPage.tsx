import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'
import { autoridades, beneficios, objetivos, sociosResumen } from '../mocks/institucional.mock'

export function InstitucionalPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Institucional" subtitle="Información institucional y estado general de socios." />

      <div className="grid gap-3 md:grid-cols-2">
        <Card title="Autoridades">
          <ul className="space-y-2 text-sm text-slate-700">
            {autoridades.map((item) => (
              <li key={item.cargo} className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                <span>{item.cargo}</span>
                <span className="font-medium text-slate-900">{item.nombre}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Objetivos CRABB">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {objetivos.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Socios">
          <p className="text-2xl font-semibold text-slate-900">{sociosResumen.activos}</p>
          <p className="text-sm text-slate-600">Activos actualmente</p>
        </Card>
        <Card title="Cuotas y pagos">
          <Badge tone="red">3 cuotas vencidas</Badge>
          <p className="mt-2 text-sm text-slate-600">Seguimiento interno para cobranzas.</p>
        </Card>
        <Card title="Beneficios">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {beneficios.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
