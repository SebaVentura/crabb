import { Link } from 'react-router-dom'

export function LandingPage() {
  const logoCrabbUrl = `${import.meta.env.BASE_URL}logo-crabb.jpg`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
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
                  href="#inscripcion"
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
          <button
            type="button"
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700"
          >
            Sumarme como socio o adherente
          </button>
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
            <button
              type="button"
              className="inline-flex rounded-xl border border-slate-400 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-slate-700"
            >
              Solicitar inscripción
            </button>
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
                  href="#"
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
    </div>
  )
}
