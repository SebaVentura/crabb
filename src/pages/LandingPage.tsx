import { Link } from 'react-router-dom'
import { WHATSAPP_BOT_URL } from '../constants/whatsappBot'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function LandingPage() {
  const logoCrabbUrl = `${import.meta.env.BASE_URL}logo-crabb.jpg`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-8 pb-24 md:px-6 md:py-12 md:pb-28">
        <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Nueva etapa digital
              </span>
              <h1 className="text-2xl font-bold leading-tight md:text-4xl">
                <span translate="no" className="notranslate text-slate-900">
                  CRABB
                </span>
                <br />
                <span className="text-blue-600">Seccional Bahía Blanca</span>
                <br />
                <span className="font-medium text-slate-700">Se moderniza</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
                Plataforma digital para la gestión de socios, capacitación técnica y generación de nuevas
                oportunidades de trabajo para talleres de la ciudad y la región.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Ingresar a la plataforma
                </Link>
                <a
                  href={WHATSAPP_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Quiero sumarme
                </a>
              </div>
            </div>
            <div className="mx-auto rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm md:mx-0">
              <img
                src={logoCrabbUrl}
                alt="CRABB Seccional Bahía Blanca"
                className="h-28 w-auto max-w-[240px] object-contain md:h-32"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Más beneficios para socios y adherentes</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-150 hover:shadow-md">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">GS</span>
              <h3 className="font-semibold text-slate-900">Gestión de socios y cuotas</h3>
              <p className="mt-1 text-sm text-slate-600">
                Acceso a información institucional, estado de cuota y comunicaciones.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-150 hover:shadow-md">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">CA</span>
              <h3 className="font-semibold text-slate-900">Capacitaciones</h3>
              <p className="mt-1 text-sm text-slate-600">Calendario, inscripción y contenidos técnicos.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-150 hover:shadow-md">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">DT</span>
              <h3 className="font-semibold text-slate-900">Data Técnica</h3>
              <p className="mt-1 text-sm text-slate-600">Consulta de fallas, códigos OBD y documentación.</p>
            </article>
            <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-150 hover:shadow-md">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">RS</span>
              <h3 className="font-semibold text-slate-900">Red de servicios</h3>
              <p className="mt-1 text-sm text-slate-600">Sistema de derivación de trabajos para prestadores.</p>
            </article>
          </div>
        </section>

        <section id="inscripcion" className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Campaña de inscripción para Bahía Blanca y la zona
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            <span translate="no" className="notranslate">
              CRABB Seccional Bahía Blanca
            </span>{' '}
            abre una nueva etapa de incorporación de socios y adherentes, invitando a talleres, grúas y prestadores
            a sumarse a una red moderna y organizada.
          </p>
          <a
            href={WHATSAPP_BOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700"
          >
            Sumarme como socio o adherente
          </a>
        </section>

        <section className="mt-6 rounded-3xl border-2 border-blue-200/80 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            Data Técnica: una herramienta de trabajo para talleres
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Espacio de consulta pensado para talleres que se inician y del sector medio.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li className="rounded-lg bg-blue-50 px-3 py-2">Códigos OBD</li>
            <li className="rounded-lg bg-blue-50 px-3 py-2">Diagnóstico de fallas</li>
            <li className="rounded-lg bg-blue-50 px-3 py-2">Soluciones prácticas</li>
            <li className="rounded-lg bg-blue-50 px-3 py-2">Documentación técnica</li>
            <li className="rounded-lg bg-blue-50 px-3 py-2 sm:col-span-2">Experiencia real</li>
          </ul>
          <p className="mt-4 text-sm font-medium text-slate-700">
            Una base técnica construida desde la experiencia del sector.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Futuras capacitaciones</h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Formación en diagnóstico, gestión y nuevas tecnologías.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {['Diagnóstico electrónico inicial', 'Uso de scanner OBD', 'Gestión del taller', 'Servicios rápidos'].map((item) => (
              <article key={item} className="rounded-2xl border border-blue-200/70 bg-white p-6 shadow-sm transition duration-150 hover:shadow-md">
                <h3 className="font-semibold text-slate-900">{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
            <span translate="no" className="notranslate">
              CRABB Seccional Bahía Blanca
            </span>
            {' '}Auxilio
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            <span translate="no" className="notranslate">
              CRABB Seccional Bahía Blanca
            </span>{' '}
            Auxilio será la futura red de servicios de asistencia automotor de la cámara.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li className="rounded-lg bg-white px-3 py-2">Remolques</li>
            <li className="rounded-lg bg-white px-3 py-2">Cambio de batería</li>
            <li className="rounded-lg bg-white px-3 py-2">Reparaciones rápidas</li>
            <li className="rounded-lg bg-white px-3 py-2">Auxilios mecánicos</li>
            <li className="rounded-lg bg-white px-3 py-2 sm:col-span-2">Derivación de trabajos</li>
          </ul>
          <p className="mt-4 text-sm font-medium text-slate-700">
            Una nueva oportunidad de trabajo para aprovechar tiempos ociosos dentro del taller.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Nuevas oportunidades para talleres adheridos</h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            La app permitirá recibir trabajos, generar ingresos adicionales y optimizar tiempos del taller.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Sumate a la nueva etapa de{' '}
            <span translate="no" className="notranslate">
              CRABB Seccional Bahía Blanca
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-200 md:text-base">
            Una cámara más moderna, conectada y preparada para el sector automotor.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700"
            >
              Ingresar a la plataforma
            </Link>
            <a
              href={WHATSAPP_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl border border-slate-400 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-slate-700"
            >
              Solicitar inscripción
            </a>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Contacto e información institucional</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-sm text-slate-700 md:text-base">
              <p>
                <span className="font-semibold text-slate-900">Dirección:</span> Bahía Blanca, Buenos Aires
              </p>
              <p>
                <span className="font-semibold text-slate-900">Email:</span> contacto@crabb.com.ar
              </p>
              <p>
                <span className="font-semibold text-slate-900">Teléfono:</span> (0291) 000-0000
              </p>
              <p>
                <span className="font-semibold text-slate-900">Horarios:</span> Lunes a Viernes de 8 a 17 hs
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Redes sociales</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:border-blue-300 hover:text-blue-700"
                >
                  Facebook{' '}
                  <span translate="no" className="notranslate">
                    CRABB Seccional Bahía Blanca
                  </span>
                </a>
                <a
                  href="#"
                  className="inline-flex rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:border-blue-300 hover:text-blue-700"
                >
                  Instagram{' '}
                  <span translate="no" className="notranslate">
                    CRABB Seccional Bahía Blanca
                  </span>
                </a>
                <a
                  href={WHATSAPP_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-150 hover:border-blue-300 hover:text-blue-700"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-6 border-t border-slate-200/80 pt-6 text-center">
          <p className="text-sm font-semibold text-slate-800">
            &copy;{' '}
            <span translate="no" className="notranslate">
              CRABB Seccional Bahía Blanca
            </span>
          </p>
          <p className="mt-1 text-sm text-slate-500">Plataforma institucional en desarrollo</p>
        </footer>
      </main>

      <a
        href={WHATSAPP_BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir bot de WhatsApp CRABB"
        title="Abrir bot de WhatsApp CRABB"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-150 hover:brightness-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:bottom-8 md:right-8"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  )
}
