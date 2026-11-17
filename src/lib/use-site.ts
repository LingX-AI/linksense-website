import { useLocation } from '@tanstack/react-router'
import { getCopy } from '../content'
import { localeFromPath, pageFromPath } from './site'

export function useSite() {
  const path = useLocation({ select: (location) => location.pathname })
  const locale = localeFromPath(path)
  return { locale, page: pageFromPath(path), copy: getCopy(locale) }
}
