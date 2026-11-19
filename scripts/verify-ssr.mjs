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
        assert.ok(html.includes('src="/media/workspace-result.webp"'), `Workspace still missing on ${path}`)
        for (const anchor of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(html.includes(`href="${prefix}/use-cases#${anchor}"`), `Localized use case missing on ${path}`)
        }
        const story = ['id="workspace"', 'id="scenarios-title"', 'id="team-title"', 'id="ownership-title"'].map((name) => html.indexOf(name))
        assert.ok(story.every((position, index) => position >= 0 && (!index || position > story[index - 1])), `Homepage story order is wrong on ${path}`)
      }
      if (suffix === '/use-cases') {
        for (const anchor of ['procurement', 'reporting', 'knowledge', 'capability-sharing']) {
          assert.ok(html.includes(`id="${anchor}"`), `Linked example is missing on ${path}`)
        }
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
  console.log('18 localized pages verified in SSR HTML; homepage story, example links, redirect, 404, social image, and video range request passed.')
} finally {
  server.kill()
  await closed
}
