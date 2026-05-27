import type { InstitutionalContact, LandingFinalCta, SocialLink } from '../../types/institutional'
import { PublicActionLink } from './PublicActionLink'
import { PublicSectionHeader } from './PublicSectionHeader'

type ContactCommunitySectionProps = {
  contact: InstitutionalContact
  socialLinks: SocialLink[]
  finalCta: LandingFinalCta
  showContact: boolean
  showSocialLinks: boolean
}

export function ContactCommunitySection({
  contact,
  socialLinks,
  finalCta,
  showContact,
  showSocialLinks,
}: ContactCommunitySectionProps) {
  return (
    <section id="contacto" className="rounded-[2rem] border border-slate-700/80 bg-slate-900 px-6 py-10 md:px-10 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <PublicSectionHeader eyebrow="Comunidad" title="Contacto institucional" description={finalCta.description} />

          {showContact ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Direccion</p>
                <p className="mt-2">{contact.address}</p>
              </article>
              <article className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Email</p>
                <p className="mt-2">{contact.email}</p>
              </article>
              <article className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Telefono</p>
                <p className="mt-2">{contact.phone}</p>
              </article>
              <article className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Horarios</p>
                <p className="mt-2">{contact.hours}</p>
              </article>
            </div>
          ) : null}

          {showSocialLinks ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 transition hover:border-sky-300"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-sky-300/20 bg-slate-950/60 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">CTA final</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{finalCta.title}</h3>
          <div className="mt-6 grid gap-3">
            <PublicActionLink
              link={finalCta.primary_cta}
              className="rounded-md bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            />
            <PublicActionLink
              link={finalCta.secondary_cta}
              className="rounded-md border border-slate-500 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-300"
            />
          </div>
        </aside>
      </div>
    </section>
  )
}
