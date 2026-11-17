import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { SiteLink, SiteShell } from '../components/site-shell'
import { siteLocales } from '../lib/site'
import { useSite } from '../lib/use-site'
import stylesheet from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#0a0e17' },
      { title: 'LinkSense' },
    ],
    links: [
      { rel: 'stylesheet', href: stylesheet },
      { rel: 'icon', type: 'image/svg+xml', href: '/brand/icon.svg' },
      { rel: 'preload', as: 'font', href: '/fonts/Inter-Latin.woff2', type: 'font/woff2', crossOrigin: 'anonymous' },
    ],
  }),
  shellComponent: RootDocument,
  component: () => <SiteShell><Outlet /></SiteShell>,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})

function RootDocument({ children }: { children: ReactNode }) {
  const { locale } = useSite()
  return (
    <html lang={siteLocales[locale].code}>
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  )
}

function NotFoundPage() {
  const { copy } = useSite()
  return (
    <div className="site-gutter grid min-h-[70svh] content-center gap-5 bg-ink pt-24 text-white">
      <h1 className="text-5xl font-medium tracking-tight">{copy.error.title}</h1>
      <p>{copy.error.body}</p>
      <SiteLink page="home" className="w-fit underline underline-offset-6">{copy.error.back}</SiteLink>
    </div>
  )
}

function ErrorPage() {
  const { copy } = useSite()
  const router = useRouter()
  return (
    <main className="site-gutter grid min-h-[70svh] content-center gap-5 bg-ink text-white">
      <h1 className="text-5xl font-medium tracking-tight">{copy.error.unexpected}</h1>
      <button className="w-fit underline underline-offset-6" type="button" onClick={() => void router.invalidate()}>
        {copy.error.retry}
      </button>
    </main>
  )
}
