import { MENSAJE_TEMPLATE } from '../constants'
import { Card } from '../../../components/ui/Card'

type Props = {
  ejemploRenderizado: string | null
}

export function GestionCobranzasMensajePreview({ ejemploRenderizado }: Props) {
  return (
    <Card className="border-slate-200 shadow-md" title="Vista previa del mensaje">
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Texto del recordatorio</p>
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{MENSAJE_TEMPLATE}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Ejemplo simulado</p>
          {ejemploRenderizado ? (
            <p className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-sm text-slate-800">{ejemploRenderizado}</p>
          ) : (
            <p className="text-sm text-slate-500">Seleccioná al menos un socio con teléfono válido para ver un ejemplo.</p>
          )}
        </div>
      </div>
    </Card>
  )
}
