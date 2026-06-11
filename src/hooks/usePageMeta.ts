import { useEffect } from 'react'

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    let metaTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = metaTag?.getAttribute('content') ?? null

    if (description) {
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('name', 'description')
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (description && metaTag) {
        if (previousDescription) {
          metaTag.setAttribute('content', previousDescription)
        } else {
          metaTag.remove()
        }
      }
    }
  }, [title, description])
}
