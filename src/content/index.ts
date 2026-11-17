import { createInstance } from 'i18next'
import { defaultLocale, isSiteLocale, type SiteLocale } from '../lib/site'
import { en, type SiteCopy } from './en'
import { es } from './es'
import { pt } from './pt'
import { fr } from './fr'
import { ja } from './ja'
import { zh } from './zh'

export const siteCopy: Record<SiteLocale, SiteCopy> = { en, zh, es, pt, fr, ja }

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: { site: SiteCopy } }
  }
}

// Fixed languages per request: a shared mutable current language would leak
// between simultaneous server renders.
const i18n = createInstance()
void i18n.init({
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  initAsync: false,
  resources: Object.fromEntries(
    Object.entries(siteCopy).map(([locale, site]) => [locale, { translation: { site } }]),
  ),
})

export function getCopy(locale: unknown): SiteCopy {
  return i18n.getFixedT(isSiteLocale(locale) ? locale : defaultLocale)('site', { returnObjects: true })
}

export function getUseCases(copy: SiteCopy['cases']) {
  return [
    { id: 'procurement', audience: copy.teams, title: copy.procurement, body: copy.procurementBody, output: copy.procurementOutput },
    { id: 'reporting', audience: copy.operations, title: copy.brief, body: copy.briefBody, output: copy.briefOutput },
    { id: 'knowledge', audience: copy.enablement, title: copy.knowledge, body: copy.knowledgeBody, output: copy.knowledgeOutput },
  ] as const
}
