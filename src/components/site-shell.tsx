import { Link, useNavigate } from '@tanstack/react-router'
import { animate } from 'motion/react'
import { ArrowUpRight, Globe2, Moon, Sun } from 'lucide-react'
import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { headerShouldHide, routeLift, samePath } from '../lib/cuberto'
import {
  defaultLocale, docsPath, locales, pageNames, productLinks, siteLocales,
} from '../lib/site'
import type { SiteLocale, SitePage } from '../lib/site'
import { colorSchemeKey, nextColorOverride, systemColorScheme } from '../lib/theme'
import { useSite } from '../lib/use-site'
import { ElasticRule, REVEAL_EVENT } from './cuberto-motion'
import { ordinaryClick } from './media'

const routeTargets = {
  home: '/{-$lang}',
  cases: '/{-$lang}/use-cases',
  hosting: '/{-$lang}/self-hosted',
} as const

const menuId = 'site-menu'

const TransitionContext = createContext<{ go: (navigate: () => Promise<unknown>) => void } | null>(null)

function useRouteTransition() {
  return useContext(TransitionContext) ?? { go: (navigate: () => Promise<unknown>) => { void navigate() } }
}

function routeOptions(page: SitePage, lang: SiteLocale, hash?: string) {
  const params = { lang: lang === defaultLocale ? undefined : lang }
  switch (page) {
    case 'home': return { to: '/{-$lang}' as const, params, hash }
    case 'cases': return { to: '/{-$lang}/use-cases' as const, params, hash }
    case 'hosting': return { to: '/{-$lang}/self-hosted' as const, params, hash }
  }
}

/**
 * One app-level transition owner: the white sheet rises from the bottom while
 * the outgoing page lifts, the router swaps under it, then the sheet fades
 * away as the incoming page plays its entrance.
 */
function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const run = useCallback(async (navigate: () => Promise<unknown>) => {
    const overlayEl = overlay.current
    const backdropEl = backdrop.current
    const fillEl = fill.current
    if (!overlayEl || !backdropEl || !fillEl) {
      await navigate().catch(() => undefined)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await navigate().catch(() => undefined)
      document.getElementById('main-content')?.focus({ preventScroll: true })
      return
    }

    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const view = document.querySelector<HTMLElement>('.page-view')
    overlayEl.style.display = 'block'
    overlayEl.style.pointerEvents = 'auto'
    fillEl.style.opacity = '1'
    fillEl.style.transform = 'scaleY(0)'
    backdropEl.style.opacity = '0'
    root.dataset.cover = '1'
    root.style.overflow = 'hidden'

    const lift = view
      ? animate(view, { y: routeLift(window.innerWidth, window.innerHeight) }, {
        duration: 0.9, ease: [0.76, 0, 0.2, 1],
      })
      : undefined
    void animate(backdropEl, { opacity: 1 }, { duration: 0.5, ease: 'easeOut' })
    const cover = animate(fillEl, { scaleY: 1 }, { duration: 0.7, ease: [0.76, 0, 0.24, 1] })

    try {
      await cover
      await navigate()
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
      lift?.stop()
      if (view) view.style.transform = ''
      window.dispatchEvent(new Event(REVEAL_EVENT))
      document.getElementById('main-content')?.focus({ preventScroll: true })
      backdropEl.style.opacity = '0'
      overlayEl.style.pointerEvents = 'none'
      await animate(fillEl, { opacity: 0 }, { duration: 0.4, ease: 'easeOut' })
    } catch {
      // Keep the current page usable if navigation is rejected or cancelled.
      lift?.stop()
      if (view) view.style.transform = ''
      window.dispatchEvent(new Event(REVEAL_EVENT))
    } finally {
      overlayEl.style.display = 'none'
      overlayEl.style.pointerEvents = 'none'
      fillEl.style.opacity = '1'
      fillEl.style.transform = 'scaleY(0)'
      backdropEl.style.opacity = '0'
      delete root.dataset.cover
      root.style.overflow = previousOverflow
    }
  }, [])

  const go = useCallback((navigate: () => Promise<unknown>) => {
    if (busy.current) return
    busy.current = true
    void run(navigate).finally(() => { busy.current = false })
  }, [run])

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div className="route-cover" ref={overlay} aria-hidden="true">
        <div className="route-cover-backdrop" ref={backdrop} />
        <div className="route-cover-fill" ref={fill} />
      </div>
    </TransitionContext.Provider>
  )
}

export function SiteLink({ page, language, hash, children, ...props }: {
  page: SitePage
  language?: SiteLocale
  hash?: string
  children: ReactNode
} & Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'onFocus' | 'onPointerEnter' | 'onPointerLeave' | 'aria-label'>) {
  const { locale } = useSite()
  const navigate = useNavigate()
  const { go } = useRouteTransition()
  const userClick = props.onClick
  const lang = language ?? locale

  return (
    <Link
      to={routeTargets[page]}
      params={{ lang: lang === defaultLocale ? undefined : lang }}
      hash={hash}
      activeOptions={{ exact: true }}
      activeProps={{ 'aria-current': 'page' }}
      {...props}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        userClick?.(event)
        if (event.defaultPrevented || !ordinaryClick(event)) return
        const href = event.currentTarget.getAttribute('href')
        if (!href) return
        const target = new URL(href, window.location.href)
        if (target.origin !== window.location.origin) return
        if (samePath(
          { pathname: target.pathname, search: target.search },
          { pathname: window.location.pathname, search: window.location.search },
        )) return
        event.preventDefault()
        go(() => navigate(routeOptions(page, lang, hash)))
      }}
    >{children}</Link>
  )
}

function Brand({ tone = 'auto' }: { tone?: 'auto' | 'night' }) {
  if (tone === 'night') {
    return <img className="brand-lockup" src="/brand/linksense-lockup-dark.svg" alt="LinkSense" width="520" height="100" />
  }
  return (
    <>
      <img className="only-light brand-lockup" src="/brand/linksense-lockup-light.svg" alt="LinkSense" width="520" height="100" />
      <img className="only-dark brand-lockup" src="/brand/linksense-lockup-dark.svg" alt="LinkSense" width="393" height="76" />
    </>
  )
}

function ThemeToggle({ className }: { className?: string }) {
  const { copy } = useSite()

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (!meta) return
    function sync(event: StorageEvent) {
      if (meta && (event.key === colorSchemeKey || event.key === null)) {
        const mode = event.newValue
        meta.content = mode === 'light' || mode === 'dark' ? mode : 'light dark'
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function toggle() {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (!meta) return
    const next = nextColorOverride(meta.content, window.matchMedia(systemColorScheme).matches)
    meta.content = next ?? 'light dark'
    try {
      if (next) localStorage.setItem(colorSchemeKey, next)
      else localStorage.removeItem(colorSchemeKey)
    } catch {
      return
    }
  }

  return (
    <button className={`icon-btn theme-toggle${className ? ` ${className}` : ''}`} type="button" onClick={toggle}>
      <span className="only-light"><Moon size={17} strokeWidth={1.7} aria-hidden="true" /><span className="sr-only">{copy.nav.darkMode}</span></span>
      <span className="only-dark"><Sun size={17} strokeWidth={1.7} aria-hidden="true" /><span className="sr-only">{copy.nav.lightMode}</span></span>
    </button>
  )
}

function Languages({ onSelect }: { onSelect?: (event: MouseEvent<HTMLAnchorElement>, language: SiteLocale) => void }) {
  const { locale, page, copy } = useSite()
  return (
    <ul className="language-options" aria-label={copy.nav.language}>
      {locales.map((language) => (
        <li key={language} lang={siteLocales[language].code}>
          <SiteLink
            page={page}
            language={language}
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

function Header() {
  const { copy, locale } = useSite()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const header = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const toggleButton = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    toggleButton.current?.focus({ preventScroll: true })
  }, [])


  useEffect(() => {
    if (!open) return
    const first = menu.current?.querySelector<HTMLElement>('a, button')
    first?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close, open])

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        setHidden((current) => headerShouldHide({
          y,
          lastY,
          hidden: current,
          menuOpen: open,
          focusWithin: header.current?.contains(document.activeElement) ?? false,
        }))
        setScrolled((current) => (y > 10 ? true : current && y > 4))
        lastY = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  return (
    <header className="site-header" ref={header} data-hidden={hidden} data-scrolled={scrolled} data-open={open}>
      <div className="shell header-inner">
        <SiteLink page="home" className="site-brand" aria-label="LinkSense"><Brand /></SiteLink>
        <nav aria-label={copy.nav.primary} className="header-links">
          <SiteLink page="cases">{copy.nav.cases}</SiteLink>
          <SiteLink page="hosting">{copy.nav.hosting}</SiteLink>
          <a href={docsPath(locale)}>{copy.nav.docs}<ArrowUpRight aria-hidden="true" size={12} /></a>
          <a href={productLinks.github}>{copy.nav.github}<ArrowUpRight aria-hidden="true" size={12} /></a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="pill pill--small" href={productLinks.demo}>
            {copy.nav.demo}<ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <button
            type="button"
            ref={toggleButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? copy.nav.close : copy.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="menu-scrim" data-open={open} onClick={close} aria-hidden="true" />
      <div className="site-menu" id={menuId} ref={menu} data-open={open} inert={!open}>
        <div className="site-menu-panel">
          <nav aria-label={copy.nav.primary} className="site-menu-nav">
            {pageNames.map((name) => (
              <SiteLink key={name} page={name} onClick={close}>
                <span>{copy.nav[name]}</span><ArrowUpRight size={20} aria-hidden="true" />
              </SiteLink>
            ))}
          </nav>
          <div className="site-menu-meta">
            <a href={docsPath(locale)} onClick={close}>{copy.nav.docs}<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a href={productLinks.github} onClick={close}>{copy.nav.github}<ArrowUpRight size={13} aria-hidden="true" /></a>
            <a href={productLinks.contact} onClick={close}>{copy.nav.contact}<ArrowUpRight size={13} aria-hidden="true" /></a>
          </div>
          <div className="site-menu-foot">
            <a className="pill" href={productLinks.demo} onClick={close}>
              {copy.nav.demo}<ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <div className="site-menu-languages">
              <Globe2 size={15} aria-hidden="true" />
              <Languages onSelect={close} />
            </div>
            <ThemeToggle className="site-menu-theme" />
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const { copy, locale } = useSite()
  return (
    <footer className="site-footer">
      <div className="shell">
        <ElasticRule className="footer-rule" />
        <div className="footer-grid">
          <div className="footer-brand">
            <SiteLink page="home" className="site-brand" aria-label="LinkSense"><Brand tone="night" /></SiteLink>
            <p>{copy.footer.source}</p>
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
            <p><Globe2 size={14} aria-hidden="true" />{copy.nav.language}</p>
            <Languages />
          </div>
        </div>
        <div className="footer-base">
          <span>© {copy.footer.company}</span>
          <a href={productLinks.license}>{copy.footer.license}</a>
        </div>
      </div>
    </footer>
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { copy, locale } = useSite()

  useEffect(() => { document.documentElement.lang = siteLocales[locale].code }, [locale])

  return (
    <RouteTransitionProvider>
      <a className="skip-link" href="#main-content">{copy.nav.skip}</a>
      <Header />
      <div className="page-view">
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
      </div>
    </RouteTransitionProvider>
  )
}
