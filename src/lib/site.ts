export const siteLocales = {
  en: { code: 'en-US', label: 'English' },
  zh: { code: 'zh-CN', label: '简体中文' },
  es: { code: 'es-ES', label: 'Español' },
  pt: { code: 'pt-BR', label: 'Português (Brasil)' },
  fr: { code: 'fr-FR', label: 'Français' },
  ja: { code: 'ja-JP', label: '日本語' },
} as const

export type SiteLocale = keyof typeof siteLocales
export const defaultLocale: SiteLocale = 'en'
export const locales = Object.keys(siteLocales).filter(isSiteLocale)

export const pages = {
  home: '/',
  cases: '/use-cases',
  hosting: '/self-hosted',
} as const

export type SitePage = keyof typeof pages
export const pageNames = ['home', 'cases', 'hosting'] as const

export const productLinks = {
  demo: 'https://explore.linksense.org/',
  github: 'https://github.com/LingX-AI/LinkSense',
  community: 'https://github.com/LingX-AI/LinkSense/discussions',
  license: 'https://github.com/LingX-AI/LinkSense/blob/main/LICENSE',
  security: 'https://github.com/LingX-AI/LinkSense/security/policy',
  contact: 'mailto:hello@linksense.org',
}

export function isSiteLocale(value: unknown): value is SiteLocale {
  return typeof value === 'string' && Object.hasOwn(siteLocales, value)
}

export function localeFromPath(pathname: string): SiteLocale {
  const segment = pathname.split('/')[1]
  return isSiteLocale(segment) ? segment : defaultLocale
}

export function pageFromPath(pathname: string): SitePage {
  const segment = pathname.split('/').filter(Boolean).at(-1)
  return segment === 'use-cases' ? 'cases' : segment === 'self-hosted' ? 'hosting' : 'home'
}

export function sitePath(page: SitePage, locale: SiteLocale): string {
  if (locale === defaultLocale) return pages[page]
  return page === 'home' ? `/${locale}` : `/${locale}${pages[page]}`
}

export function docsPath(locale: SiteLocale, suffix = ''): string {
  const prefix = locale === defaultLocale ? '' : `${siteLocales[locale].code}/`
  return `https://linksense.org/doc/${prefix}${suffix}`
}

export function publicSiteOrigin(value: string | undefined): string | undefined {
  if (!value) return
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && url.href === `${url.origin}/`) return url.origin
  } catch {
    // Local and misconfigured builds stay noindex.
  }
}
