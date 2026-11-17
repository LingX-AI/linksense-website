import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCopy } from '../content'
import { pageHead } from './head'
import { docsPath, locales, localeFromPath, pageFromPath, publicSiteOrigin, sitePath } from './site'

describe('localized routes and copy', () => {
  it.each(locales)('keeps page identity when switching to %s and uses the corresponding documentation', (locale) => {
    const expected = locale === 'en' ? '' : `/${locale}`
    expect(sitePath('home', locale)).toBe(expected || '/')
    expect(sitePath('cases', locale)).toBe(`${expected}/use-cases`)
    const hosting = sitePath('hosting', locale)
    expect(localeFromPath(hosting)).toBe(locale)
    expect(pageFromPath(hosting)).toBe('hosting')
    expect(new URL(docsPath(locale, 'deploy/full/')).hostname).toBe('linksense.org')
    expect(docsPath(locale)).toMatch(/^https:\/\/linksense\.org\/doc\/([a-z]{2}-[A-Z]{2}\/)?$/)
  })

  it('falls back to English for missing or unsupported languages without affecting other requests', () => {
    expect(localeFromPath('/not-a-language/use-cases')).toBe('en')
    expect(getCopy('zh').nav.cases).toBe('使用场景')
    expect(getCopy('unsupported').nav.cases).toBe('Use cases')
    expect(getCopy('ja').nav.cases).toBe('活用例')
    expect(getCopy(undefined).nav.cases).toBe('Use cases')
  })

  it('provides every copy group and key in every language', () => {
    const expectedKeys = Object.entries(getCopy('en')).map(([group, messages]) =>
      [group, Object.keys(messages).sort()],
    )
    for (const locale of locales) {
      const groups = Object.entries(getCopy(locale))
      expect(groups.map(([group, messages]) => [group, Object.keys(messages).sort()])).toEqual(expectedKeys)
      expect(groups.flatMap(([, messages]) => Object.values(messages)).every((message) => message.trim())).toBe(true)
    }
  })
})

describe('search and sharing metadata', () => {
  afterEach(() => vi.unstubAllEnvs())

  it.each([undefined, 'bad-url', 'http://example.com', 'https://example.com/site', 'https://example.com/?q=x'])(
    'does not enable indexing with a missing or invalid origin (%s)', (origin) => {
      vi.stubEnv('VITE_SITE_URL', origin)
      expect(publicSiteOrigin(origin)).toBeUndefined()
      const head = pageHead('cases', 'en')
      expect(head.meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow' })
      expect(head.links).toEqual([])
    },
  )

  it('produces canonical and alternate URLs for the same localized page on the configured origin', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.com')
    const head = pageHead('hosting', 'fr')
    expect(head.meta).toContainEqual({ title: 'Auto-hébergement | LinkSense' })
    expect(head.meta).toContainEqual({ property: 'og:image', content: 'https://example.com/media/social.jpg' })
    expect(head.links).toContainEqual({ rel: 'canonical', href: 'https://example.com/fr/self-hosted' })
    expect(head.links).toContainEqual({ rel: 'alternate', hrefLang: 'x-default', href: 'https://example.com/self-hosted' })
    expect(head.links.filter((link) => link.rel === 'alternate')).toHaveLength(7)
  })
})
