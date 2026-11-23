import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Globe2, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
  hash?: string
  children: ReactNode
} & Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'onFocus' | 'onPointerEnter' | 'onPointerLeave' | 'aria-label'>) {
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
      <img className="only-light brand-lockup" src="/brand/linksense-lockup-light.svg" alt="LinkSense" width="520" height="100" />
      <img className="only-dark brand-lockup" src="/brand/linksense-lockup-dark.svg" alt="LinkSense" width="393" height="76" />
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
  const dialog = useRef<HTMLDialogElement>(null)

  const close = () => dialog.current?.close()

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <SiteLink page="home" className="site-brand" aria-label="LinkSense"><Brand /></SiteLink>
          <nav aria-label={copy.nav.primary} className="header-links">
            <SiteLink page="cases">{copy.nav.cases}</SiteLink>
            <SiteLink page="hosting">{copy.nav.hosting}</SiteLink>
            <a href={docsPath(locale)}>{copy.nav.docs}<ArrowUpRight aria-hidden="true" size={12} /></a>
            <a href={productLinks.github}>{copy.nav.github}<ArrowUpRight aria-hidden="true" size={12} /></a>
          </nav>
          <div className="header-actions">
            <a href={productLinks.demo} className="btn btn--accent btn--compact" aria-label={copy.nav.demo}>
              <span className="hidden md:inline">{copy.nav.demo}</span>
              <span className="md:hidden">{copy.nav.demoShort}</span>
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <ThemeToggle />
            <button
              type="button"
              className="header-icon menu-button"
              aria-haspopup="dialog"
              aria-label={copy.nav.menu}
              onClick={() => dialog.current?.showModal()}
            >
              <Menu size={21} strokeWidth={1.65} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        className="mobile-menu"
        ref={dialog}
        aria-label={copy.nav.menu}
        onClick={(event) => { if (event.target === dialog.current) close() }}
      >
        <div className="mobile-menu-panel">
          <div className="mobile-menu-top">
            <SiteLink page="home" className="site-brand" aria-label="LinkSense" onClick={close}><Brand /></SiteLink>
            <button type="button" className="mobile-menu-close" onClick={close}>
              <span>{copy.nav.close}</span><X size={22} aria-hidden="true" />
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
            <a href={docsPath(locale)} onClick={close}>{copy.nav.docs} ↗</a>
            <a href={productLinks.github} onClick={close}>{copy.nav.github} ↗</a>
            <a href={productLinks.demo} onClick={close}>{copy.nav.demo} ↗</a>
            <div className="flex items-start gap-2 pt-1">
              <Globe2 size={15} aria-hidden="true" className="mt-2 shrink-0" />
              <Languages onSelect={close} />
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
  const { copy, locale } = useSite()

  useEffect(() => { document.documentElement.lang = siteLocales[locale].code }, [locale])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">{copy.nav.skip}</a>
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  )
}
