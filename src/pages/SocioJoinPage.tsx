import { PublicFormPageLayout } from '../components/public/PublicFormPageLayout'
import { SocioRegistrationForm } from '../components/socio-registration/SocioRegistrationForm'
import { usePageMeta } from '../hooks/usePageMeta'

export function SocioJoinPage() {
  usePageMeta(
    'Asociarme a CRABB',
    'Solicitá tu asociación a CRABB - Cámara de Reparación de Automotores de Bahía Blanca.',
  )

  return (
    <PublicFormPageLayout>
      <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
          Asociación
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Solicitud de asociación
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Completá tus datos para iniciar el proceso de incorporación a CRABB.
        </p>

        <div className="mt-8">
          <SocioRegistrationForm />
        </div>
      </div>
    </PublicFormPageLayout>
  )
}
