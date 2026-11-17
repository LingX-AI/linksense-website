import { getCopy } from '../content'
import { locales, publicSiteOrigin, siteLocales, sitePath } from './site'
import type { SiteLocale, SitePage } from './site'

export function pageHead(page: SitePage, locale: SiteLocale) {
  const copy = getCopy(locale)
  const title = page === 'home'
    ? `LinkSense — ${copy.home.titleOne} ${copy.home.titleTwo}`
    : `${copy.nav[page]} | LinkSense`
  const description = copy[page].description
  const origin = publicSiteOrigin(import.meta.env.VITE_SITE_URL)
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:site_name', content: 'LinkSense' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:locale', content: siteLocales[locale].code.replace('-', '_') },
      ...(origin ? [
        { property: 'og:url', content: origin + sitePath(page, locale) },
        { property: 'og:image', content: `${origin}/media/social.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ] : [{ name: 'robots', content: 'noindex, nofollow' }]),
    ],
    links: origin ? [
      { rel: 'canonical', href: origin + sitePath(page, locale) },
      ...locales.map((language) => ({
        rel: 'alternate', hrefLang: siteLocales[language].code, href: origin + sitePath(page, language),
      })),
      { rel: 'alternate', hrefLang: 'x-default', href: origin + sitePath(page, 'en') },
    ] : [],
  }
}
