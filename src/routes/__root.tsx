import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { SiteLink, SiteShell } from '../components/site-shell'
import { siteLocales } from '../lib/site'
import { colorSchemeKey } from '../lib/theme'
import { useSite } from '../lib/use-site'
import stylesheet from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'LinkSense' },
    ],
    links: [
      { rel: 'stylesheet', href: stylesheet },
      { rel: 'icon', type: 'image/svg+xml', href: '/brand/linksense-icon.svg' },
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
      <head>
        <meta name="color-scheme" content="light dark" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{
          __html: `try{const mode=localStorage.getItem('${colorSchemeKey}');if(mode==='light'||mode==='dark')document.querySelector('meta[name="color-scheme"]').content=mode}catch{}`,
        }} />
        <HeadContent />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  )
}

function NotFoundPage() {
  const { copy } = useSite()
  return (
    <div className="container flex min-h-[70svh] flex-col justify-center gap-5 py-16">
      <h1 className="h2">{copy.error.title}</h1>
      <p className="lead">{copy.error.body}</p>
      <SiteLink page="home" className="arrow-link w-fit">{copy.error.back}</SiteLink>
    </div>
  )
}

function ErrorPage() {
  const { copy } = useSite()
  const router = useRouter()
  return (
    <div className="container flex min-h-[70svh] flex-col justify-center gap-5 py-16">
      <h1 className="h2">{copy.error.unexpected}</h1>
      <button className="arrow-link w-fit" type="button" onClick={() => void router.invalidate()}>
        {copy.error.retry}
      </button>
    </div>
  )
}
