import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Globe2, Menu, Moon, Sun, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import {
  defaultLocale, docsPath, locales, pageNames, productLinks, siteLocales,
} from '../lib/site'
import type { SiteLocale, SitePage } from '../lib/site'
import { colorSchemeKey, nextColorOverride, systemColorScheme } from '../lib/theme'
import { useSite } from '../lib/use-site'

const routeTargets = {
  home: '/{-$lang}',
  cases: '/{-$lang}/use-cases',
  hosting: '/{-$lang}/self-hosted',
} as const

export function SiteLink({ page, language, hash, children, ...props }: {
  page: SitePage
  language?: SiteLocale
  hash?: string | true
  children: ReactNode
} & Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'onFocus' | 'onBlur' | 'onPointerEnter' | 'onPointerLeave' | 'aria-label'>) {
  const { locale } = useSite()
  const lang = language ?? locale
  return (
    <Link
      to={routeTargets[page]}
      params={{ lang: lang === defaultLocale ? undefined : lang }}
      hash={hash}
      activeOptions={{ exact: true }}
      {...props}
    >{children}</Link>
  )
}

function Brand() {
  return (
    <>
      <img className="only-light brand-lockup" src="/brand/figma-lockup-light.svg" alt="LinkSense" width="120" height="29" />
      <img className="only-dark brand-lockup" src="/brand/figma-lockup-dark.svg" alt="LinkSense" width="120" height="29" />
    </>
  )
}

function ThemeToggle() {
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
    <button className="header-icon theme-toggle" type="button" onClick={toggle}>
      <span className="only-light"><Moon size={18} strokeWidth={1.65} aria-hidden="true" /><span className="sr-only">{copy.nav.darkMode}</span></span>
      <span className="only-dark"><Sun size={18} strokeWidth={1.65} aria-hidden="true" /><span className="sr-only">{copy.nav.lightMode}</span></span>
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
            hash
            className={language === locale ? 'language-current' : undefined}
            onClick={onSelect ? (event) => onSelect(event, language) : undefined}
          >
            {siteLocales[language].label}
            {language === locale && <Check size={15} aria-hidden="true" />}
          </SiteLink>
        </li>
      ))}
    </ul>
  )
}

function LanguagePicker() {
  const { copy, locale, page } = useSite()
  const disclosure = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const panel = disclosure.current
    if (!panel) return
    function dismiss(event: Event) {
      if (panel?.open && event.target instanceof Node && !panel.contains(event.target)) panel.open = false
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && panel?.open) {
        panel.open = false
        panel.querySelector('summary')?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('focusin', dismiss)
    panel.addEventListener('keydown', onKey)
    return () => {
      panel.open = false
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('focusin', dismiss)
      panel.removeEventListener('keydown', onKey)
    }
  }, [locale, page])

  return (
    <details className="language-picker" ref={disclosure}>
      <summary className="header-icon language-trigger" aria-label={`${copy.nav.language}: ${siteLocales[locale].label}`}>
        <Globe2 size={18} strokeWidth={1.65} aria-hidden="true" />
        <span aria-hidden="true">{locale.toUpperCase()}</span>
        <ChevronDown size={12} aria-hidden="true" />
      </summary>
      <div className="language-panel">
        <Languages onSelect={() => {
          if (disclosure.current) disclosure.current.open = false
          disclosure.current?.querySelector('summary')?.focus()
        }} />
      </div>
    </details>
  )
}

function NavigationDock() {
  const { copy, locale, page } = useSite()
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const selected = focused ?? hovered ?? (page === 'home' ? null : page)
  const items = [
    { id: 'cases', label: copy.nav.cases, page: 'cases' as const },
    { id: 'hosting', label: copy.nav.hosting, page: 'hosting' as const },
    { id: 'docs', label: copy.nav.docs, href: docsPath(locale) },
    { id: 'github', label: copy.nav.github, href: productLinks.github },
  ]

  return (
    <motion.nav
      layout={reducedMotion ? false : 'position'}
      transition={{ layout: reducedMotion ? { duration: 0 } : { duration: .42, ease: [.22, 1, .36, 1] } }}
      className="header-links"
      aria-label={copy.nav.primary}
      onPointerLeave={() => setHovered(null)}
    >
      {items.map((item) => {
        const content = <>
          {selected === item.id && <motion.span
            className="nav-highlight"
            layoutId="navigation-highlight"
            aria-hidden="true"
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 440, damping: 35 }}
          />}
          <span className="nav-label">{item.label}</span>
          {item.href && <ArrowUpRight aria-hidden="true" size={12} />}
        </>
        const events = {
          onPointerEnter: () => { setHovered(item.id); setFocused(null) },
          onFocus: () => { setFocused(item.id); setHovered(null) },
          onBlur: () => setFocused(null),
        }
        return item.page
          ? <SiteLink key={item.id} page={item.page} {...events}>{content}</SiteLink>
          : <a key={item.id} href={item.href} {...events}>{content}</a>
      })}
    </motion.nav>
  )
}

function Header() {
  const { copy, locale } = useSite()
  const dialog = useRef<HTMLDialogElement>(null)
  const scrollMarker = useRef<HTMLSpanElement>(null)
  const [condensed, setCondensed] = useState(false)
  const reducedMotion = useReducedMotion()
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: .42, ease: [.22, 1, .36, 1] as const }

  useEffect(() => {
    const marker = scrollMarker.current
    if (!marker) return
    // The marker belongs to the document, so the fixed header never moves its own threshold.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setCondensed(entry.boundingClientRect.top < 0)
    })
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  const close = () => dialog.current?.close()

  return (
    <>
      <span className="nav-scroll-marker" ref={scrollMarker} aria-hidden="true" />
      <motion.header
        className="site-header"
        data-condensed={condensed || undefined}
        animate={{ y: condensed ? -8 : 0 }}
        initial={false}
        transition={transition}
      >
        <motion.div layout={!reducedMotion} layoutDependency={condensed} transition={{ layout: transition }} className="container header-inner">
          <motion.div layout={reducedMotion ? false : 'position'} transition={{ layout: transition }} className="header-brand">
            <SiteLink page="home" className="site-brand" aria-label="LinkSense"><Brand /></SiteLink>
          </motion.div>
          <NavigationDock />
          <motion.div layout={reducedMotion ? false : 'position'} transition={{ layout: transition }} className="header-actions">
            <LanguagePicker />
            <ThemeToggle />
            <a href={productLinks.demo} className="btn btn--compact header-demo">
              {copy.nav.demo}<ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <button
              type="button"
              className="header-icon menu-button"
              aria-haspopup="dialog"
              aria-label={copy.nav.menu}
              onClick={() => dialog.current?.showModal()}
            >
              <Menu size={21} strokeWidth={1.65} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      </motion.header>
      <dialog
        className="mobile-menu"
        ref={dialog}
        aria-label={copy.nav.menu}
        onClick={(event) => { if (event.target === dialog.current) close() }}
      >
        <div className="mobile-menu-panel">
          <div className="mobile-menu-top">
            <SiteLink page="home" className="site-brand" aria-label="LinkSense" onClick={close}><Brand /></SiteLink>
            <button type="button" className="header-icon mobile-menu-close" onClick={close}>
              <X size={20} aria-hidden="true" /><span className="sr-only">{copy.nav.close}</span>
            </button>
          </div>
          <nav aria-label={copy.nav.primary} className="mobile-menu-nav">
            {pageNames.map((name) => (
              <SiteLink key={name} page={name} onClick={close}>
                {copy.nav[name]}<ArrowRight size={18} aria-hidden="true" />
              </SiteLink>
            ))}
          </nav>
          <div className="mobile-menu-meta">
            <a href={docsPath(locale)} onClick={close}>{copy.nav.docs}<ArrowUpRight size={15} aria-hidden="true" /></a>
            <a href={productLinks.github} onClick={close}>{copy.nav.github}<ArrowUpRight size={15} aria-hidden="true" /></a>
            <a href={productLinks.demo} className="btn" onClick={close}>{copy.nav.demo}<ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </dialog>
    </>
  )
}

function Footer() {
  const { copy, locale } = useSite()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <SiteLink page="home" aria-label="LinkSense"><Brand /></SiteLink>
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
  const { copy, locale, page } = useSite()

  useEffect(() => { document.documentElement.lang = siteLocales[locale].code }, [locale])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{copy.nav.skip}</a>
      <Header />
      <main id="main-content" className={`site-main${page === 'home' ? ' site-main--home' : ''}`} tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  )
}
