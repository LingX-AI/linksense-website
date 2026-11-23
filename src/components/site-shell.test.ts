import { createElement } from 'react'
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import type { SiteLocale, SitePage } from '../lib/site'
import { SiteShell } from './site-shell'

const state = vi.hoisted(() => ({
  locale: 'en' as SiteLocale,
  page: 'home' as SitePage,
  pathname: '/',
}))

vi.mock('../lib/use-site', async () => {
  const { getCopy } = await import('../content')
  return {
    useSite: () => ({
      locale: state.locale,
      page: state.page,
      copy: getCopy(state.locale),
    }),
  }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, className }: { children?: ReactNode; className?: string }) =>
    createElement('a', { className, href: '#' }, children),
  useLocation: ({ select }: { select: (location: { pathname: string }) => unknown }) =>
    select({ pathname: state.pathname }),
  useRouter: () => ({ subscribe: () => () => {} }),
}))

function renderShell() {
  return renderToStaticMarkup(createElement(SiteShell, null, createElement('p', null, 'Body')))
}

describe('site chrome', () => {
  it('keeps the first viewport free of a conventional navigation row', () => {
    const html = renderShell()
    const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1] ?? ''

    expect(header).toContain('site-brand')
    expect(header).toContain('exo-menu-trigger')
    expect((header.match(/<a\b/g) ?? [])).toHaveLength(1)
    expect((header.match(/<button\b/g) ?? [])).toHaveLength(1)
    expect(header).not.toContain('header-links')
    expect(header).not.toContain('language-options')
    expect(header).not.toContain('theme-toggle')
    expect(header).not.toContain('exo-cta')
    expect(header).not.toContain('data-exo-hide-compact')
    expect(header).not.toContain('menu-button')
  })

  it('keeps primary pages, utilities and language choices in the dialog', () => {
    const html = renderShell()
    const dialog = html.match(/<dialog\b[^>]*id="exo-menu"[\s\S]*?<\/dialog>/)?.[0] ?? ''

    expect(dialog).toContain('exo-menu-nav')
    expect(dialog).toContain('exo-menu-secondary')
    expect(dialog).toContain('language-options')
    expect(dialog).toContain('theme-toggle')
    expect(dialog).toContain('exo-menu-art')
  })

  it('renders the first-visit curtain as inert decorative markup', () => {
    const html = renderShell()
    const intro = html.match(/<div class="exo-intro"[\s\S]*?<\/div>/)?.[0] ?? ''

    expect(intro).toContain('aria-hidden="true"')
    expect(intro).toContain('exo-intro-glyph')
    expect(intro).not.toContain('<a ')
    expect(intro).not.toContain('<button')
  })

  it('keeps page, fragment and language fallbacks in the footer', () => {
    const html = renderShell()
    const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] ?? ''

    expect(footer).toContain('footer-nav')
    expect(footer).toContain('language-options')
    expect(footer).toContain('theme-toggle')
    expect(footer).toContain('href="#workspace"')
    expect(footer).toContain('href="#deliverables"')
    expect(footer).toContain('href="#team-title"')
  })
})
