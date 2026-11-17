import { Link, useRouter } from '@tanstack/react-router'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Globe2, Plus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import {
  defaultLocale, docsPath, locales, pageNames, productLinks, siteLocales,
} from '../lib/site'
import type { SiteLocale, SitePage } from '../lib/site'
import { useSite } from '../lib/use-site'
import { ordinaryClick } from './media'
import { MaskedLines } from './visuals'

const routeTargets = {
  home: '/{-$lang}',
  cases: '/{-$lang}/use-cases',
  hosting: '/{-$lang}/self-hosted',
} as const

export function SiteLink({ page, language, hash, viewTransition, children, ...props }: {
  page: SitePage
  language?: SiteLocale
  hash?: string
  viewTransition?: boolean
  children: ReactNode
} & Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'onFocus' | 'onPointerEnter' | 'onPointerLeave' | 'onPointerMove'>) {
  const { locale } = useSite()
  const lang = language ?? locale
  return (
    <Link
      to={routeTargets[page]}
      params={{ lang: lang === defaultLocale ? undefined : lang }}
      hash={hash}
      viewTransition={viewTransition}
      activeOptions={{ exact: true }}
      {...props}
    >{children}</Link>
  )
}

export function CircleArrow({ diagonal = false }: { diagonal?: boolean }) {
  const Icon = diagonal ? ArrowUpRight : ArrowRight
  return <span className="circle-arrow" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
}

function Brand() {
  return <img src="/brand/lockup-dark.svg" alt="LinkSense" width="122" height="33" />
}

function Languages({ compact = false, onSelect }: {
  compact?: boolean
  onSelect?: (event: MouseEvent<HTMLAnchorElement>, language: SiteLocale) => void
}) {
  const { locale, page, copy } = useSite()
  return (
    <ul className={compact ? 'flex flex-wrap items-center gap-x-4 gap-y-1' : 'language-options'} aria-label={copy.nav.language}>
      {locales.map((language) => (
        <li key={language} lang={siteLocales[language].code}>
          <SiteLink
            page={page}
            language={language}
            viewTransition={compact ? false : undefined}
            className={language === locale ? 'language-current' : undefined}
            onClick={onSelect ? (event) => onSelect(event, language) : undefined}
          >
            {siteLocales[language].label}
          </SiteLink>
        </li>
      ))}
    </ul>
  )
}

const menuArt = {
  home: '/media/signal.webp',
  cases: '/media/team-app.webp',
  hosting: '/media/connections.webp',
}

function setMenuOrigin(panel: HTMLDialogElement) {
  panel.closest<HTMLElement>('.site-shell')?.style.setProperty('--menu-origin-y', `${window.scrollY + window.innerHeight / 2}px`)
}

function Header() {
  const { copy, locale, page } = useSite()
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closingForNavigation = useRef(false)

  useEffect(() => router.subscribe('onRendered', ({ pathChanged, fromLocation, toLocation }) => {
    if (!pathChanged || !fromLocation) return
    const panel = dialog.current
    if (panel?.open) {
      // Reveal the committed route and use the destination's restored scroll position.
      closingForNavigation.current = true
      setMenuOrigin(panel)
      panel.close()
    }
    if (!toLocation.hash) {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
  }), [router])

  function dismissIfCurrent(event: MouseEvent<HTMLAnchorElement>, target: SitePage, language: SiteLocale = locale) {
    if (!ordinaryClick(event) || target !== page || language !== locale) return
    event.preventDefault()
    dialog.current?.close()
  }

  return (
    <>
      <header className="site-header">
        <SiteLink page="home" className="site-brand"><Brand /></SiteLink>
        <nav aria-label={copy.nav.primary} className="header-links">
          <SiteLink page="cases">{copy.nav.cases}</SiteLink>
          <SiteLink page="hosting">{copy.nav.hosting}</SiteLink>
          <a href={docsPath(locale)}>{copy.nav.docs}<ArrowUpRight aria-hidden="true" size={12} /></a>
        </nav>
        <div className="flex items-center gap-4 md:gap-6">
          <noscript><a href={docsPath(locale)} className="inline-flex min-h-11 items-center text-sm md:hidden">{copy.nav.docs}</a></noscript>
          <a href={productLinks.demo} className="header-demo">{copy.nav.demo}<ArrowUpRight aria-hidden="true" size={15} /></a>
          <button
            type="button"
            className="menu-trigger"
            ref={trigger}
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="main-menu"
            onClick={() => {
              const panel = dialog.current
              if (!panel || panel.open) return
              closingForNavigation.current = false
              panel.dataset.art = page
              setMenuOrigin(panel)
              panel.showModal()
              trigger.current?.setAttribute('aria-expanded', 'true')
              panel.querySelector<HTMLElement>('.menu-close')?.focus()
            }}
          >
            <span>{copy.nav.menu}</span><Plus size={23} strokeWidth={1.35} aria-hidden="true" />
          </button>
        </div>
      </header>
      <dialog
        id="main-menu"
        className="site-menu"
        ref={dialog}
        aria-label={copy.nav.menu}
        onClose={() => {
          if (dialog.current?.open) return
          trigger.current?.setAttribute('aria-expanded', 'false')
          if (!closingForNavigation.current) trigger.current?.focus({ preventScroll: true })
        }}
        onPointerLeave={() => { if (dialog.current) dialog.current.dataset.art = page }}
      >
        <div className="menu-scene site-gutter">
          <div className="menu-top flex items-center justify-between">
            <SiteLink page="home" viewTransition={false} onClick={(event) => dismissIfCurrent(event, 'home')}><Brand /></SiteLink>
            <button type="button" className="menu-trigger menu-close" onClick={() => dialog.current?.close()}>
              <span>{copy.nav.close}</span><X size={23} strokeWidth={1.35} aria-hidden="true" />
            </button>
          </div>
          <div className="menu-art" aria-hidden="true">
            {pageNames.map((name) => <img key={name} data-art={name} src={menuArt[name]} alt="" width="1152" height="648" loading="lazy" />)}
          </div>
          <div className="menu-content">
            <nav aria-label={copy.nav.primary} className="menu-nav"
              onPointerLeave={() => { if (dialog.current) dialog.current.dataset.art = page }}>
              {pageNames.map((name, index) => (
                <div className="menu-mask" key={name}>
                  <SiteLink
                    page={name}
                    className="menu-link"
                    viewTransition={false}
                    onClick={(event) => dismissIfCurrent(event, name)}
                    onPointerEnter={() => { if (dialog.current) dialog.current.dataset.art = name }}
                    onFocus={() => { if (dialog.current) dialog.current.dataset.art = name }}
                  >
                    <span className="menu-index" aria-hidden="true">0{index + 1}</span>
                    {copy.nav[name]}<ArrowDownRight className="menu-arrow" aria-hidden="true" strokeWidth={1} />
                  </SiteLink>
                </div>
              ))}
            </nav>
            <div className="menu-aside">
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                <a href={docsPath(locale)}>{copy.nav.docs} ↗</a>
                <a href={productLinks.github}>{copy.nav.github} ↗</a>
                <a href={productLinks.demo}>{copy.nav.demo} ↗</a>
              </div>
              <div className="mt-7 flex items-start gap-3">
                <Globe2 size={16} aria-hidden="true" className="mt-1 shrink-0" />
                <Languages compact onSelect={(event, language) => dismissIfCurrent(event, page, language)} />
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}

function Footer() {
  const { copy, locale } = useSite()
  return (
    <footer className="site-footer site-gutter">
      <div className="footer-feature">
        <MaskedLines as="h2" className="footer-title" lines={[copy.footer.titleOne, copy.footer.titleTwo]} />
        <a className="text-action w-fit self-end" href={productLinks.demo}>
          <span>{copy.nav.demo}</span><CircleArrow diagonal />
        </a>
      </div>
      <div className="footer-grid">
        <div className="space-y-5">
          <SiteLink page="home" className="inline-block"><Brand /></SiteLink>
          <p className="text-sm text-muted-inverse">{copy.footer.source}</p>
        </div>
        <nav className="footer-nav" aria-label={copy.nav.footer}>
          <SiteLink page="cases">{copy.nav.cases}</SiteLink>
          <SiteLink page="hosting">{copy.nav.hosting}</SiteLink>
          <a href={docsPath(locale)}>{copy.nav.docs}</a>
          <a href={productLinks.github}>{copy.nav.github}</a>
          <a href={productLinks.community}>{copy.footer.community}</a>
          <a href={productLinks.contact}>{copy.nav.contact}</a>
        </nav>
        <div className="footer-languages">
          <p><Globe2 size={16} aria-hidden="true" />{copy.nav.language}</p>
          <Languages />
        </div>
      </div>
      <div className="footer-base">
        <span>© {copy.footer.company}</span>
        <a href={productLinks.license}>{copy.footer.license}</a>
      </div>
    </footer>
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { copy, locale } = useSite()

  useEffect(() => {
    document.documentElement.dataset.ready = ''
    return () => { delete document.documentElement.dataset.ready }
  }, [])

  useEffect(() => { document.documentElement.lang = siteLocales[locale].code }, [locale])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{copy.nav.skip}</a>
      <Header />
      <div className="menu-displace">
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
