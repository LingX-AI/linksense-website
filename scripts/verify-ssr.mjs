import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const entry = fileURLToPath(new URL('../.output/server/index.mjs', import.meta.url))
await access(entry).catch(() => { throw new Error('Run pnpm build before pnpm test:ssr.') })
const server = spawn(process.execPath, [entry], {
  env: { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: '0', NITRO_UNIX_SOCKET: '', TEST: '' },
  stdio: ['ignore', 'pipe', 'inherit'],
})
const closed = once(server, 'close')

try {
  let timer
  const origin = await new Promise((resolve, reject) => {
    let output = ''
    timer = setTimeout(() => reject(new Error('The built server did not bind a loopback port.')), 8000)
    server.stdout.setEncoding('utf8').on('data', (chunk) => {
      output = (output + chunk).slice(-2048)
      const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)
      if (address) resolve(address[0])
    })
    void closed.then(([code]) => reject(new Error(`The built server exited (${code}).`)), reject)
  }).finally(() => clearTimeout(timer))

  const request = (path) => fetch(`${origin}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(5000) })
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const attributePattern = (name, value) => `${escape(name)}="${escape(value)}"(?=\\s|/?>)`
  const hasAttribute = (tag, name, value) => new RegExp(`(?:^|\\s)${attributePattern(name, value)}`).test(tag)
  const tagWith = (html, name, attributes) =>
    (html.match(new RegExp(`<${name}(?=\\s|/?>)[^>]*>`, 'g')) ?? []).find((tag) =>
      Object.entries(attributes).every(([attribute, value]) => hasAttribute(tag, attribute, value)))
  const idPosition = (html, id) =>
    html.search(new RegExp(`<[a-z][\\w-]*\\b[^>]*\\s${attributePattern('id', id)}[^>]*>`))
  const locales = [
    ['', 'en-US', 'On your infrastructure.', 'a real task.', 'on your terms.'],
    ['/zh', 'zh-CN', '部署和权限，你做主', '具体的事开始。', '由你决定。'],
    ['/es', 'es-ES', 'En tu infraestructura.', 'una tarea real.', 'a tu manera.'],
    ['/pt', 'pt-BR', 'Na sua infraestrutura.', 'uma tarefa real.', 'seu jeito.'],
    ['/fr', 'fr-FR', 'Sur votre infrastructure.', 'une tâche réelle.', 'à votre façon.'],
    ['/ja', 'ja-JP', '自社の環境で運用。', '始めよう。', '自分たちで決める。'],
  ]
  for (const [prefix, locale, home, cases, hosting] of locales) {
    const docs = locale === 'en-US' ? 'https://linksense.org/doc/' : `https://linksense.org/doc/${locale}/`
    for (const [suffix, heading] of [['', home], ['/use-cases', cases], ['/self-hosted', hosting]]) {
      const path = (prefix + suffix) || '/'
      const response = await request(path)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      const title = html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1] ?? ''
      assert.ok(html.includes(`<html lang="${locale}"`), path)
      assert.ok(title.includes(heading), `SSR heading missing on ${path}`)
      assert.ok(html.includes(`href="${docs}"`), `Documentation link missing on ${path}`)
      assert.ok(html.includes('name="description"'), path)
      assert.ok(html.includes('name="color-scheme" content="light dark"'), `System theme default missing on ${path}`)
      if (!process.env.VITE_SITE_URL) assert.ok(html.includes('noindex, nofollow'), path)
      if (!suffix) {
        assert.ok(html.includes('WorkBuddy') && html.includes('ChatGPT Enterprise'), `Product positioning missing on ${path}`)
        assert.ok(tagWith(html, 'h2', { id: 'film-title' }), `Product film heading missing on ${path}`)
        assert.ok(tagWith(html, 'a', { href: '/media/linksense-intro-v6.mp4' }), `Product film fallback missing on ${path}`)
        assert.ok(tagWith(html, 'img', { src: '/media/qclay-reel.svg', alt: '' }), `Decorative product film cover missing on ${path}`)
        assert.ok(tagWith(html, 'img', { src: '/media/workspace-result.webp' }), `Workspace still missing on ${path}`)
        assert.ok(tagWith(html, 'a', { href: '/media/product-demo.mp4' }), `Workspace demo fallback missing on ${path}`)
        assert.ok(!html.includes('workspace-teaser.mp4'), `Autoplay workspace teaser still referenced on ${path}`)
        const deliverables = new RegExp(
          `<p\\b[^>]*\\s${attributePattern('id', 'deliverables-title')}[^>]*>([\\s\\S]*?)<\\/p>\\s*` +
          `<ul\\b[^>]*\\s${attributePattern('aria-labelledby', 'deliverables-title')}[^>]*>`,
        ).exec(html)
        assert.ok(deliverables?.[1].replace(/<[^>]+>/g, '').trim(), `Deliverables list label missing on ${path}`)
        for (const anchor of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(tagWith(html, 'a', { href: `${prefix}/use-cases#${anchor}` }), `Localized use case missing on ${path}`)
        }
        const story = ['film-title', 'workspace', 'scenarios-title', 'team-title', 'ownership-title'].map((id) => idPosition(html, id))
        assert.ok(story.every((position, index) => position >= 0 && (!index || position > story[index - 1])), `Homepage story order is wrong on ${path}`)
      }
      if (suffix === '/use-cases') {
        for (const anchor of ['procurement', 'reporting', 'knowledge', 'capability-sharing']) {
          assert.ok(html.includes(`id="${anchor}"`), `Linked example is missing on ${path}`)
        }
        assert.ok(tagWith(html, 'a', { href: '#examples' }), `Use case index target missing on ${path}`)
        assert.ok(tagWith(html, 'section', { id: 'examples' }), `Use case examples section missing on ${path}`)
        for (const anchor of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(tagWith(html, 'article', { id: anchor, 'data-case': anchor }), `Use case story ${anchor} missing on ${path}`)
          assert.ok(tagWith(html, 'div', { 'data-art': anchor }), `Use case stage ${anchor} missing on ${path}`)
        }
        assert.ok(tagWith(html, 'section', { id: 'capability-sharing' }), `Capability sharing section missing on ${path}`)
        assert.ok(tagWith(html, 'h2', { id: 'handoff-title' }), `Capability sharing heading missing on ${path}`)
        assert.ok(tagWith(html, 'img', { src: '/media/team-app.webp' }), `Sharing app screen missing on ${path}`)
        assert.ok(tagWith(html, 'img', { src: '/media/skills.webp' }), `Sharing skills screen missing on ${path}`)
        assert.ok(tagWith(html, 'a', { href: 'https://explore.linksense.org/' }), `Demo link missing on ${path}`)
        const layout = ['examples-title', 'procurement', 'reporting', 'knowledge', 'handoff-title'].map((id) => idPosition(html, id))
        assert.ok(layout.every((position, index) => position >= 0 && (!index || position > layout[index - 1])), `Use case story order is wrong on ${path}`)
      }
      if (suffix === '/self-hosted') {
        assert.ok(tagWith(html, 'a', { href: '#profiles' }), `Hosting index target missing on ${path}`)
        assert.ok(tagWith(html, 'section', { id: 'profiles' }), `Hosting profiles section missing on ${path}`)
        assert.ok(tagWith(html, 'article', { 'data-profile': 'core' }), `Core profile missing on ${path}`)
        assert.ok(tagWith(html, 'article', { 'data-profile': 'full' }), `Full profile missing on ${path}`)
        for (const profile of ['core', 'full']) {
          assert.ok(tagWith(html, 'a', { href: `${docs}deploy/${profile}/` }), `Localized ${profile} deployment guide missing on ${path}`)
        }
        assert.ok(tagWith(html, 'section', { id: 'governance' }), `Governance section missing on ${path}`)
        assert.ok(tagWith(html, 'h2', { id: 'governance-title' }), `Governance heading missing on ${path}`)
        assert.ok(html.includes('class="hosting-diagram"'), `Governance illustration missing on ${path}`)
        assert.ok(tagWith(html, 'section', { id: 'boundaries' }), `Boundary section missing on ${path}`)
        assert.ok(tagWith(html, 'h2', { id: 'boundaries-title' }), `Boundary heading missing on ${path}`)
        assert.ok(tagWith(html, 'a', { href: 'https://github.com/LingX-AI/LinkSense/security/policy' }), `Security link missing on ${path}`)
        assert.ok(tagWith(html, 'a', { href: 'https://github.com/LingX-AI/LinkSense' }), `Source link missing on ${path}`)
        const layout = ['profiles-title', 'governance-title', 'boundaries-title'].map((id) => idPosition(html, id))
        assert.ok(layout.every((position, index) => position >= 0 && (!index || position > layout[index - 1])), `Hosting chapter order is wrong on ${path}`)
      }
    }
  }
  const alias = await request('/en/use-cases')
  assert.equal(alias.status, 308)
  assert.equal(alias.headers.get('location'), '/use-cases')
  const invalid = await request('/unavailable/use-cases')
  assert.equal(invalid.status, 404)
  assert.ok((await invalid.text()).includes('Page not found'))
  assert.equal((await request('/doc/deploy/core')).status, 404)

  const brandArt = await request('/media/social.jpg')
  assert.equal(brandArt.status, 200)
  assert.equal(brandArt.headers.get('content-type'), 'image/jpeg')
  const filmCoverArt = await request('/media/qclay-reel.svg')
  assert.equal(filmCoverArt.status, 200)
  assert.equal(filmCoverArt.headers.get('content-type'), 'image/svg+xml')
  const film = await fetch(`${origin}/media/linksense-intro-v6.mp4`, {
    headers: { Range: 'bytes=0-255' }, signal: AbortSignal.timeout(5000),
  })
  assert.equal(film.status, 206)
  assert.equal((await film.arrayBuffer()).byteLength, 256)
  console.log('18 localized pages verified in SSR HTML; film-first homepage story, detail-page headers and chapters, media fallbacks, decorative film SVG, example links, redirect, 404, social image, and video range request passed.')
} finally {
  server.kill()
  await closed
}
