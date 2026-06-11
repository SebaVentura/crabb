import { Link } from 'react-router-dom'
import { LegalPageHeader, LegalSection } from '../components/public/LegalContent'
import { LegalPageLayout } from '../components/public/LegalPageLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const LAST_UPDATED = '11 de junio de 2026'
const CONTACT_EMAIL = 'crabbiahblanca@gmail.com'

export function PrivacyPolicyPage() {
  usePageMeta(
    'Política de privacidad | CRABB',
    'Política de privacidad de CRABB - Cámara de Reparación de Automotores de Bahía Blanca.',
  )

  return (
    <LegalPageLayout>
      <article>
        <LegalPageHeader
          title="Política de privacidad"
          subtitle="CRABB - Cámara de Reparación de Automotores de Bahía Blanca"
          lastUpdated={LAST_UPDATED}
        />

        <div className="mt-10">
          <LegalSection title="Responsable del tratamiento">
            <p>
              El responsable del tratamiento de los datos personales es CRABB - Cámara de Reparación
              de Automotores de Bahía Blanca, con domicilio en Bahía Blanca, Provincia de Buenos
              Aires, Argentina.
            </p>
            <p>
              Para consultas relacionadas con privacidad puede escribir a{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Datos que podemos recopilar">
            <p>
              CRABB utiliza los datos personales provistos por socios, potenciales socios y usuarios
              del sitio con fines institucionales, administrativos, de comunicación, gestión de
              socios, gestión de cuotas, cobranzas, consultas y prestación de servicios vinculados a
              la actividad de la cámara.
            </p>
            <p>La información puede incluir, entre otros:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Nombre y apellido</li>
              <li>DNI o CUIT</li>
              <li>Teléfono y correo electrónico</li>
              <li>Taller o empresa</li>
              <li>Estado societario y estado de cuotas</li>
              <li>Mensajes enviados por canales digitales</li>
              <li>Comprobantes o datos administrativos relacionados</li>
            </ul>
          </LegalSection>

          <LegalSection title="Finalidades del tratamiento">
            <p>Los datos personales se utilizan para:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Gestionar la relación institucional con socios y adherentes</li>
              <li>Administrar cuotas, cobranzas y comunicaciones asociadas</li>
              <li>Responder consultas y brindar información institucional</li>
              <li>Enviar avisos, recordatorios y comunicaciones operativas</li>
              <li>Mejorar la experiencia de uso del sitio y los canales digitales</li>
              <li>Cumplir obligaciones legales, administrativas y contables</li>
            </ul>
          </LegalSection>

          <LegalSection title="Uso de WhatsApp y Meta">
            <p>
              CRABB puede utilizar WhatsApp y servicios de Meta (Facebook) para comunicaciones
              institucionales, recordatorios y gestión de consultas, conforme a las políticas de
              dichas plataformas.
            </p>
            <p>
              Al interactuar por estos canales, el usuario acepta que parte de la información
              intercambiada pueda ser procesada por Meta como proveedor tecnológico, además del
              tratamiento realizado por CRABB para fines institucionales y administrativos.
            </p>
          </LegalSection>

          <LegalSection title="Gestión de socios, cuotas, cobranzas y comunicaciones institucionales">
            <p>
              Los datos vinculados a la condición de socio, estado de cuotas, historial de
              cobranzas y comunicaciones institucionales se utilizan exclusivamente para la
              administración interna de la cámara y el cumplimiento de sus fines estatutarios.
            </p>
            <p>
              CRABB no vende datos personales ni los comercializa con terceros ajenos a la
              prestación de servicios necesarios para su operación.
            </p>
          </LegalSection>

          <LegalSection title="Conservación de datos">
            <p>
              Los datos se conservan durante el tiempo necesario para cumplir las finalidades
              indicadas y mientras exista una relación activa con el titular, así como el plazo
              adicional que resulte exigible por obligaciones legales, administrativas, contables o
              societarias.
            </p>
          </LegalSection>

          <LegalSection title="Proveedores tecnológicos">
            <p>
              CRABB puede apoyarse en proveedores tecnológicos para hosting, correo electrónico,
              mensajería, almacenamiento y herramientas de gestión. Estos proveedores actúan como
              encargados del tratamiento y deben garantizar medidas de seguridad acordes a la
              naturaleza de la información tratada.
            </p>
          </LegalSection>

          <LegalSection title="Derechos del titular de datos">
            <p>
              De acuerdo con la normativa aplicable, los titulares de datos pueden solicitar
              acceso, rectificación, actualización o supresión de su información, así como oponerse
              al tratamiento o solicitar su limitación, cuando corresponda.
            </p>
          </LegalSection>

          <LegalSection title="Solicitud de acceso, rectificación o eliminación">
            <p>
              Para ejercer sus derechos, puede enviar un correo a{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>{' '}
              o consultar la página de{' '}
              <Link
                to="/eliminacion-de-datos"
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                eliminación de datos
              </Link>
              .
            </p>
            <p>
              CRABB revisará la solicitud y responderá por el mismo medio dentro de un plazo
              razonable.
            </p>
          </LegalSection>

          <LegalSection title="Contacto">
            <p>
              CRABB - Cámara de Reparación de Automotores de Bahía Blanca
              <br />
              Bahía Blanca, Buenos Aires, Argentina
              <br />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </LegalSection>
        </div>
      </article>
    </LegalPageLayout>
  )
}
