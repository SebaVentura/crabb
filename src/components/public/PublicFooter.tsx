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

export function PublicFooter({ footer, socialLinks, linkGroups }: PublicFooterProps) {
  return (
    <footer className="rounded-t-[2rem] border-t border-slate-700/80 bg-slate-950 px-6 py-10 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-[1.1fr_2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-100">CRABB</p>
          <p className="mt-2 max-w-sm text-sm text-slate-400">{footer.description}</p>
          <p className="mt-4 text-xs text-slate-500">{footer.copyright}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{group.title}</h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <a href={link.url} className="text-sm text-slate-400 transition hover:text-slate-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {socialLinks.length > 0 ? (
        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2 border-t border-slate-800 pt-5">
          {socialLinks.map((item) => (
            <a
              key={item.platform}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
            >
              {item.platform}
            </a>
          ))}
        </div>
      ) : null}
    </footer>
  )
}
