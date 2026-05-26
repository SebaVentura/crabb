import { Card } from '../components/ui/Card'
import { SectionHeader } from '../components/ui/SectionHeader'

export function InstitucionalPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Institucional" subtitle="Información institucional en actualización." />

      <Card className="border-slate-200 shadow-md" title="Estado de sección">
        <p className="text-sm text-slate-700">Esta sección se encuentra en actualización hasta disponer de datos reales desde API.</p>
      </Card>
    </div>
  )
}
