import { Link } from 'react-router-dom'
import type { ActionLink } from '../../types/institutional'

type PublicActionLinkProps = {
  link: ActionLink
  className: string
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

function isAnchor(url: string): boolean {
  return url.startsWith('#')
}

export function PublicActionLink({ link, className }: PublicActionLinkProps) {
  if (!link.label || !link.url) return null

  if (isExternalUrl(link.url)) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    )
  }

  if (isAnchor(link.url)) {
    return (
      <a href={link.url} className={className}>
        {link.label}
      </a>
    )
  }

  return (
    <Link to={link.url} className={className}>
      {link.label}
    </Link>
  )
}
