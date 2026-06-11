import { LegalPageHeader, LegalSection } from '../components/public/LegalContent'
import { LegalPageLayout } from '../components/public/LegalPageLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const LAST_UPDATED = '11 de junio de 2026'
const CONTACT_EMAIL = 'crabbiahblanca@gmail.com'

export function TermsPage() {
  usePageMeta(
    'Condiciones del servicio | CRABB',
    'Condiciones de uso del sitio web y canales digitales de CRABB - Cámara de Reparación de Automotores de Bahía Blanca.',
  )

  return (
    <LegalPageLayout>
      <article>
        <LegalPageHeader
          title="Condiciones del servicio"
          subtitle="CRABB - Cámara de Reparación de Automotores de Bahía Blanca"
          lastUpdated={LAST_UPDATED}
        />

        <div className="mt-10">
          <LegalSection title="Uso del sitio">
            <p>
              El acceso y uso del sitio web de CRABB implica la aceptación de estas condiciones. El
              sitio tiene fines institucionales y de información para socios, potenciales socios y
              visitantes interesados en la actividad de la cámara.
            </p>
            <p>
              El usuario se compromete a utilizar el sitio de manera responsable, sin intentar
              afectar su funcionamiento ni acceder a áreas o información no autorizadas.
            </p>
          </LegalSection>

          <LegalSection title="Uso de canales digitales y WhatsApp">
            <p>
              CRABB puede ofrecer comunicación a través de WhatsApp y otros canales digitales para
              consultas, avisos institucionales, recordatorios y gestión administrativa.
            </p>
            <p>
              El uso de estos canales debe realizarse con fines legítimos y respetuosos. CRABB puede
              moderar, limitar o interrumpir comunicaciones que resulten abusivas, fraudulentas o
              contrarias a su finalidad institucional.
            </p>
          </LegalSection>

          <LegalSection title="Información institucional">
            <p>
              La información publicada en el sitio tiene carácter orientativo e institucional. CRABB
              procura mantenerla actualizada, pero no garantiza que todo el contenido refleje
              cambios inmediatos en programas, servicios o disposiciones externas.
            </p>
          </LegalSection>

          <LegalSection title="Gestión de socios y comunicaciones">
            <p>
              Las funcionalidades vinculadas a socios, cuotas, cobranzas y comunicaciones
              institucionales están destinadas a usuarios autorizados y al cumplimiento de los fines
              de la cámara.
            </p>
            <p>
              El acceso a áreas restringidas requiere credenciales válidas. El usuario es
              responsable de resguardar sus datos de acceso y de notificar cualquier uso no
              autorizado.
            </p>
          </LegalSection>

          <LegalSection title="Limitación de responsabilidad">
            <p>
              CRABB no será responsable por interrupciones temporales del sitio, fallas de
              conectividad, errores de terceros proveedores o daños indirectos derivados del uso de
              la información publicada, dentro de los límites permitidos por la normativa aplicable.
            </p>
          </LegalSection>

          <LegalSection title="Modificaciones">
            <p>
              CRABB puede actualizar estas condiciones cuando sea necesario. Las modificaciones
              entrarán en vigencia desde su publicación en el sitio. Se recomienda revisar esta
              página periódicamente.
            </p>
          </LegalSection>

          <LegalSection title="Contacto">
            <p>
              Para consultas sobre estas condiciones puede escribir a{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-sky-200 underline decoration-sky-200/40 underline-offset-2 transition hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p>
              CRABB - Cámara de Reparación de Automotores de Bahía Blanca
              <br />
              Bahía Blanca, Buenos Aires, Argentina
            </p>
          </LegalSection>
        </div>
      </article>
    </LegalPageLayout>
  )
}
