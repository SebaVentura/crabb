import { PublicFormPageLayout } from '../components/public/PublicFormPageLayout'
import { SocioAccountActivationForm } from '../components/socio-registration/SocioAccountActivationForm'
import { usePageMeta } from '../hooks/usePageMeta'

export function SocioAccountRegistrationPage() {
  usePageMeta(
    'Activar cuenta de socio | CRABB',
    'Creá tu cuenta de acceso si ya figurás en el padrón de socios de CRABB.',
  )

  return (
    <PublicFormPageLayout>
      <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
          Acceso socios
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Activar cuenta de socio
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Si ya sos socio de CRABB, creá tu usuario para ingresar al portal.
        </p>

        <div className="mt-8">
          <SocioAccountActivationForm />
        </div>
      </div>
    </PublicFormPageLayout>
  )
}
