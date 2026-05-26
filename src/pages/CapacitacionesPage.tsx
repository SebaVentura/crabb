import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

export function CapacitacionesPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Capacitaciones" subtitle="Oferta formativa institucional." />

      <Card className="border-slate-200 shadow-md" title="Disponibilidad">
        <p className="text-sm text-slate-700">No hay capacitaciones disponibles en este momento.</p>
      </Card>
    </div>
  )
}
