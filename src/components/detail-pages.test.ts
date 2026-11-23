import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { getCopy, getUseCases } from '../content'
import { docsPath, locales, productLinks, type SiteLocale } from '../lib/site'
import { CasesPage, HostingPage } from './detail-pages'

const state = vi.hoisted(() => ({ locale: 'en' as SiteLocale }))

vi.mock('../lib/use-site', async () => {
  const { getCopy: readCopy } = await import('../content')
  return {
    useSite: () => ({
      locale: state.locale,
      page: 'cases',
      copy: readCopy(state.locale),
    }),
  }
})

function render(page: 'cases' | 'hosting', locale: SiteLocale) {
  state.locale = locale
  return renderToStaticMarkup(createElement(page === 'cases' ? CasesPage : HostingPage))
}


describe('detail page bodies keep their editorial anchors and real content', () => {
  it.each(locales)('renders the use-case story anchors in %s', (locale) => {
    const html = render('cases', locale)
    const cases = getCopy(locale).cases

    for (const id of ['examples', 'procurement', 'reporting', 'knowledge', 'capability-sharing']) {
      expect(html).toContain(`id="${id}"`)
    }
    for (const id of ['examples-title', 'procurement-title', 'reporting-title', 'knowledge-title', 'handoff-title']) {
      expect(html).toContain(`id="${id}"`)
    }
    expect(html).toContain('aria-labelledby="examples-title"')
    expect(html).toContain('aria-labelledby="handoff-title"')
    expect(html).toContain(cases.examplesNote)
    for (const item of getUseCases(cases)) {
      expect(html).toContain(item.title)
      expect(html).toContain(item.body)
      expect(html).toContain(item.output)
    }
    expect(html).toContain(cases.briefFile)
    expect(html).toContain(cases.briefPointOne)
    expect(html).toContain(cases.briefPointTwo)
    expect(html).toContain(cases.briefPointThree)
    expect(html).toContain(cases.question)
    expect(html).toContain(cases.answer)
    expect(html).toContain(cases.reference)
    expect(html).toContain(cases.handoff)
    expect(html).toContain(cases.handoffBody)
    expect(html).toContain(productLinks.demo)
    expect(html).toContain('/media/workspace-result.webp')
    expect(html).toContain('/media/connections.webp')
    expect(html).toContain('/media/skills.webp')
    expect(html).toContain('/media/team-app.webp')
    expect(html).toContain('exo-page-hero-media--cases')
    expect(html).toContain('class="exo-detail-paper" aria-hidden="true"')
    expect(html).toContain(getCopy(locale).home.workspaceAlt)
    expect(html).toContain(getCopy(locale).home.connectionsAlt)
    expect(html).toContain(getCopy(locale).home.skillsAlt)
    expect(html).toContain(cases.appAlt)
  })

  it.each(locales)('renders the self-hosting spread and deployment links in %s', (locale) => {
    const html = render('hosting', locale)
    const hosting = getCopy(locale).hosting

    expect(html).toContain('aria-labelledby="profiles-title"')
    expect(html).toContain('aria-labelledby="governance-title"')
    for (const id of ['profiles', 'governance']) expect(html).toContain(`id="${id}"`)
    for (const id of ['profiles-title', 'governance-title']) expect(html).toContain(`id="${id}"`)

    expect(html).toContain(hosting.compare)
    expect(html).toContain(hosting.compareBody)
    expect(html).toContain(hosting.core)
    expect(html).toContain(hosting.coreBody)
    expect(html).toContain(hosting.full)
    expect(html).toContain(hosting.fullBody)
    expect(html).toContain(docsPath(locale, 'deploy/core/'))
    expect(html).toContain(docsPath(locale, 'deploy/full/'))
    expect(html).toContain('deploy/core/')
    expect(html).toContain('deploy/full/')
    expect(html).toContain(hosting.model)
    expect(html).toContain(hosting.modelBody)
    expect(html).toContain(hosting.access)
    expect(html).toContain(hosting.accessBody)
    expect(html).toContain(hosting.oversight)
    expect(html).toContain(hosting.oversightBody)
    expect(html).toContain(hosting.boundaries)
    expect(html).toContain(hosting.boundaryBody)
    expect(html).toContain(productLinks.security)
    expect(html).toContain(productLinks.github)
    expect(html).toContain('/media/signal.webp')
    expect(html).toContain('class="exo-detail-governance-bg" src="/media/signal.webp" alt="" aria-hidden="true"')
    expect(html).toContain('exo-page-hero-media--hosting')
  })
})
