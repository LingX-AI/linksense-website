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
  // Read the copy from the rendered <h1>, independent of <title> metadata,
  // line-mask markup and attribute order.
  const renderedHeading = (html) => (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
  const locales = [
    ['', 'en-US', 'AI agents for teams.', 'On your infrastructure.', 'a real task.', 'on your terms.'],
    ['/zh', 'zh-CN', '团队 Agent 工作台', '部署和权限，你做主', '具体的事开始。', '由你决定。'],
    ['/es', 'es-ES', 'Agentes para tu equipo.', 'En tu infraestructura.', 'una tarea real.', 'a tu manera.'],
    ['/pt', 'pt-BR', 'Agentes para sua equipe.', 'Na sua infraestrutura.', 'uma tarefa real.', 'seu jeito.'],
    ['/fr', 'fr-FR', 'Des agents pour l’équipe.', 'Sur votre infrastructure.', 'une tâche réelle.', 'à votre façon.'],
    ['/ja', 'ja-JP', 'チームのための AI エージェント。', '自社の環境で運用。', '始めよう。', '自分たちで決める。'],
  ]
  for (const [prefix, locale, homeOne, homeTwo, cases, hosting] of locales) {
    const docs = locale === 'en-US' ? 'https://linksense.org/doc/' : `https://linksense.org/doc/${locale}/`
    for (const [suffix, heading] of [['', homeTwo], ['/use-cases', cases], ['/self-hosted', hosting]]) {
      const path = (prefix + suffix) || '/'
      const response = await request(path)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      const h1 = renderedHeading(html)
      assert.ok(html.includes(`<html lang="${locale}"`), path)
      assert.ok(h1.includes(heading), `SSR heading missing on ${path}`)
      assert.ok(html.includes(`href="${docs}"`), `Documentation link missing on ${path}`)
      assert.ok(html.includes('name="description"'), path)
      assert.ok(html.includes('name="color-scheme" content="light dark"'), `System theme default missing on ${path}`)
      assert.ok(html.includes('exo-menu-trigger'), `Menu trigger missing on ${path}`)
      assert.ok(!html.includes('header-links'), `Conventional header row returned on ${path}`)
      assert.ok(/class="exo-intro"[^>]*aria-hidden="true"/.test(html), `First-visit curtain missing on ${path}`)
      assert.ok(html.includes('exo-intro-glyph'), `Brand glyph missing from the curtain on ${path}`)
      assert.ok(html.includes('linksense-intro-seen'), `First-visit session boot script missing on ${path}`)
      if (!process.env.VITE_SITE_URL) assert.ok(html.includes('noindex, nofollow'), path)
      if (!suffix) {
        assert.ok(h1.includes(homeOne) && h1.includes(homeTwo), `Localized hero heading missing on ${path}`)
        assert.ok(html.includes('class="exo-home-hero"'), `Hero surface missing on ${path}`)
        assert.ok(html.includes('class="exo-mask-in"'), `Masked hero line missing on ${path}`)
        assert.ok(html.includes('src="/media/exoape-hero.webp"'), `Hero art reference missing on ${path}`)
        assert.ok(/class="exo-hero-img"[^>]*width="1620"[^>]*height="1000"/.test(html), `Hero art dimensions missing on ${path}`)
        assert.ok(/fetchpriority="high"/i.test(html), `Hero fetch priority missing on ${path}`)
        assert.ok(html.includes('WorkBuddy') && html.includes('ChatGPT Enterprise'), `Product positioning missing on ${path}`)
        for (const still of ['workspace-result', 'skills', 'connections', 'team-app', 'reel']) {
          assert.ok(html.includes(`src="/media/${still}.webp"`), `Homepage still ${still} missing on ${path}`)
        }
        assert.ok(html.includes('href="/media/product-demo.mp4"'), `Workspace demo fallback missing on ${path}`)
        assert.ok(html.includes('href="/media/linksense-intro-v6.mp4"'), `Film fallback missing on ${path}`)
        for (const anchor of ['#workspace', '#deliverables', '#team-title']) {
          assert.ok(html.includes(`href="${anchor}"`), `Homepage rail anchor ${anchor} missing on ${path}`)
        }
        for (const anchor of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(html.includes(`href="${prefix}/use-cases#${anchor}"`), `Localized use case missing on ${path}`)
        }
        const story = ['id="workspace"', 'id="deliverables"', 'id="team-title"', 'id="film-title"', 'id="scenarios-title"', 'id="ownership-title"'].map((name) => html.indexOf(name))
        assert.ok(story.every((position, index) => position >= 0 && (!index || position > story[index - 1])), `Homepage story order is wrong on ${path}`)
      }
      if (suffix === '/use-cases') {
        for (const anchor of ['examples', 'procurement', 'reporting', 'knowledge', 'capability-sharing']) {
          assert.ok(html.includes(`id="${anchor}"`), `Linked example is missing on ${path}`)
        }
        for (const kind of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(html.includes(`exo-detail-story--${kind}`), `Editorial story ${kind} missing on ${path}`)
          assert.ok(html.includes(`exo-detail-visual--${kind}`), `Editorial visual ${kind} missing on ${path}`)
        }
        assert.ok(html.includes('exo-detail--handoff') && html.includes('src="/media/team-app.webp"'), `Sharing feature missing on ${path}`)
      }
      if (suffix === '/self-hosted') {
        for (const anchor of ['profiles', 'governance']) {
          assert.ok(html.includes(`id="${anchor}"`), `Hosting anchor ${anchor} missing on ${path}`)
        }
        for (const profile of ['core', 'full']) {
          assert.ok(html.includes(`exo-detail-profile--${profile}`), `Profile ${profile} missing on ${path}`)
          assert.ok(html.includes(`href="${docs}deploy/${profile}/"`), `Deployment guide for ${profile} missing on ${path}`)
        }
        assert.ok(html.includes('exo-detail--governance') && html.includes('class="hosting-diagram"'), `Governance spread missing on ${path}`)
        assert.ok(html.includes('exo-detail-boundary'), `Security boundary missing on ${path}`)
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
  const film = await fetch(`${origin}/media/linksense-intro-v6.mp4`, {
    headers: { Range: 'bytes=0-255' }, signal: AbortSignal.timeout(5000),
  })
  assert.equal(film.status, 206)
  assert.equal((await film.arrayBuffer()).byteLength, 256)
  const heroArt = await request('/media/exoape-hero.webp')
  assert.equal(heroArt.status, 200, 'The supplied /media/exoape-hero.webp art is missing.')
  assert.equal(heroArt.headers.get('content-type'), 'image/webp')
  console.log('18 localized pages verified in SSR HTML; homepage, editorial detail layouts, anchors, assets, media fallbacks, redirects and 404 checks passed.')
} finally {
  server.kill()
  await closed
}
