import { LegalPageHeader, LegalSection } from '../components/public/LegalContent'
import { LegalPageLayout } from '../components/public/LegalPageLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const LAST_UPDATED = '11 de junio de 2026'
const DELETION_EMAIL = 'amorosijavier@gmail.com'
const INSTITUTIONAL_EMAIL = 'crabbiahblanca@gmail.com'

export function DataDeletionPage() {
  usePageMeta(
    'Eliminación de datos | CRABB',
    'Instrucciones para solicitar la eliminación de datos personales en CRABB - Cámara de Reparación de Automotores de Bahía Blanca.',
  )

  return (
    <LegalPageLayout>
      <article>
        <LegalPageHeader
          title="Eliminación de datos de usuario"
          subtitle="CRABB - Cámara de Reparación de Automotores de Bahía Blanca"
          lastUpdated={LAST_UPDATED}
        />

        <div className="mt-10">
          <LegalSection title="Cómo solicitar la eliminación">
            <p>
              Si desea solicitar la eliminación de sus datos personales tratados por CRABB, puede
              hacerlo enviando un correo electrónico a{' '}
              <a
                href={`mailto:${DELETION_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {DELETION_EMAIL}
              </a>{' '}
              o al contacto institucional{' '}
              <a
                href={`mailto:${INSTITUTIONAL_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {INSTITUTIONAL_EMAIL}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Información a incluir en la solicitud">
            <p>Se recomienda utilizar el siguiente asunto:</p>
            <p className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-sm text-sky-100">
              Solicitud de eliminación de datos - CRABB
            </p>
            <p>En el cuerpo del mensaje, incluya:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Nombre y apellido</li>
              <li>DNI o CUIT, si corresponde</li>
              <li>Teléfono o correo electrónico asociado a su relación con CRABB</li>
              <li>Breve descripción de los datos que desea eliminar</li>
            </ul>
          </LegalSection>

          <LegalSection title="Proceso de revisión">
            <p>
              CRABB revisará la solicitud y responderá por el mismo medio de contacto utilizado
              para enviarla, dentro de un plazo razonable.
            </p>
            <p>
              En algunos casos, CRABB podrá solicitar información adicional para verificar la
              identidad del solicitante y tramitar el pedido de forma segura.
            </p>
          </LegalSection>

          <LegalSection title="Conservación de datos">
            <p>
              Algunos datos podrían conservarse aun después de una solicitud de eliminación si
              existe una obligación legal, administrativa, contable o societaria que lo exija, o si
              resulta necesario para la defensa de derechos de CRABB o de terceros, dentro de los
              límites permitidos por la normativa aplicable.
            </p>
          </LegalSection>

          <LegalSection title="Contacto">
            <p>
              Correo para solicitudes de eliminación:{' '}
              <a
                href={`mailto:${DELETION_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {DELETION_EMAIL}
              </a>
            </p>
            <p>
              Contacto institucional:{' '}
              <a
                href={`mailto:${INSTITUTIONAL_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {INSTITUTIONAL_EMAIL}
              </a>
            </p>
          </LegalSection>
        </div>
      </article>
    </LegalPageLayout>
  )
}
