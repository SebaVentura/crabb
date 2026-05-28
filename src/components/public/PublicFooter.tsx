import type { ActionLink, FooterContent, SocialLink } from '../../types/institutional'

type FooterLinkGroup = {
  title: string
  links: ActionLink[]
}

type PublicFooterProps = {
  footer: FooterContent
  socialLinks: SocialLink[]
  linkGroups: FooterLinkGroup[]
}

export function PublicFooter({ footer, socialLinks }: PublicFooterProps) {
  // TODO: reemplazar esta configuracion local por datos administrables desde Superadmin.
  const footerConfig = {
    brand: 'CRABB',
    description: 'Cámara de Reparación de Automotores de Bahía Blanca',
    summary: footer.description?.trim() || 'Representación institucional del ecosistema automotor regional.',
    contact: {
      email: 'info@crabb.com',
      phone: '+54 291 400-0000',
      location: 'Bahía Blanca, Buenos Aires',
    },
    navLinks: [
      { label: 'Inicio', url: '#inicio' },
      { label: 'Institucional', url: '/institucional' },
      { label: 'Servicios', url: '#servicios' },
      { label: 'Capacitaciones', url: '/capacitaciones' },
      { label: 'Data Técnica', url: '/data-tecnica' },
      { label: 'Contacto', url: '#contacto' },
    ] satisfies ActionLink[],
    socials: [
      {
        label: 'Instagram',
        href: socialLinks.find((link) => link.platform.toLowerCase().includes('instagram'))?.url || '#',
      },
      {
        label: 'Facebook',
        href: socialLinks.find((link) => link.platform.toLowerCase().includes('facebook'))?.url || '#',
      },
      {
        label: 'LinkedIn',
        href: socialLinks.find((link) => link.platform.toLowerCase().includes('linkedin'))?.url || '#',
      },
    ],
  }

  return (
    <footer className="w-full border-t border-slate-200 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr_0.85fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">{footerConfig.brand}</p>
            <p className="mt-3 max-w-md text-sm font-medium text-slate-800">{footerConfig.description}</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">{footerConfig.summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Navegación</h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {footerConfig.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    className="text-sm text-slate-700 transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contacto</h4>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <a
                  href={`mailto:${footerConfig.contact.email}`}
                  className="transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {footerConfig.contact.email}
                </a>
              </p>
              <p>{footerConfig.contact.location}</p>
              <p>
                <a
                  href={`tel:${footerConfig.contact.phone}`}
                  className="transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {footerConfig.contact.phone}
                </a>
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {footerConfig.socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={`Abrir ${item.label}`}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5">
          <p className="text-xs text-slate-500">{footer.copyright || '© CRABB. Todos los derechos reservados.'}</p>
        </div>
      </div>
    </footer>
  )
}
