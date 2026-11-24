import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Globe2, Monitor, Moon, Sun, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import {
  defaultLocale, docsPath, locales, pageNames, productLinks, siteLocales,
} from '../lib/site'
import type { SiteLocale, SitePage } from '../lib/site'
import { colorSchemeContent, colorSchemeKey, themePreference, type ThemePreference } from '../lib/theme'
import { useSite } from '../lib/use-site'
import { ordinaryClick } from './media'

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
} & Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'onFocus' | 'onPointerEnter' | 'onPointerLeave' | 'aria-label' | 'aria-current'>) {
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

function ThemeSwitch() {
  const { copy } = useSite()
  const [theme, setTheme] = useState<ThemePreference>('system')

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (!meta) return
    const syncFromMeta = () => setTheme(themePreference(meta.content))
    syncFromMeta()
    function handleStorage(event: StorageEvent) {
      if (meta && (event.key === colorSchemeKey || event.key === null)) {
        meta.content = colorSchemeContent(themePreference(event.newValue))
        setTheme(themePreference(event.newValue))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function selectTheme(next: ThemePreference) {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (!meta) return
    meta.content = colorSchemeContent(next)
    setTheme(next)
    try {
      if (next === 'system') localStorage.removeItem(colorSchemeKey)
      else localStorage.setItem(colorSchemeKey, next)
    } catch {
      return
    }
  }

  const options: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
    { value: 'light', label: copy.nav.themeLight, Icon: Sun },
    { value: 'system', label: copy.nav.themeSystem, Icon: Monitor },
    { value: 'dark', label: copy.nav.themeDark, Icon: Moon },
  ]

  return (
    <fieldset className="menu-theme-switch">
      <legend>{copy.nav.theme}</legend>
      <div className="menu-theme-track" data-theme={theme}>
        <span className="menu-theme-thumb" aria-hidden="true" />
        {options.map(({ value, label, Icon }) => (
          <label className="menu-theme-option" key={value}>
            <input
              type="radio"
              name="color-scheme"
              value={value}
              checked={theme === value}
              onChange={() => selectTheme(value)}
            />
            <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
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

function MenuArtwork() {
  const { copy } = useSite()
  return (
    <figure className="menu-artwork">
      <img src="/media/qclay-links.webp" alt="" width="1600" height="900" loading="lazy" decoding="async" />
      <figcaption>{copy.footer.company}</figcaption>
    </figure>
  )
}

export function closeMenuOnOrdinaryClick(event: MouseEvent<HTMLAnchorElement>, close: () => void) {
  if (ordinaryClick(event)) close()
}

function Header() {
  const { copy, locale, page } = useSite()
  const dialog = useRef<HTMLDialogElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const pressedOutside = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => () => {
    if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current)
  }, [])

  function openMenu() {
    const panel = dialog.current
    if (!panel || panel.open) return
    setClosing(false)
    panel.showModal()
    setMenuOpen(true)
    panel.querySelector<HTMLButtonElement>('[data-menu-close]')?.focus()
  }

  function closeNow() {
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = undefined
    }
    setClosing(false)
    dialog.current?.close()
  }

  function requestClose() {
    const panel = dialog.current
    if (!panel?.open || closing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.close()
      return
    }
    setClosing(true)
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = undefined
      panel.close()
      setClosing(false)
    }, 340)
  }

  function isOutsideSheet(event: { clientX: number; clientY: number }) {
    const sheet = dialog.current?.querySelector<HTMLElement>('.menu-sheet')
    if (!sheet) return false
    const bounds = sheet.getBoundingClientRect()
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom
  }

  function closeMenuFrom(event: MouseEvent<HTMLAnchorElement>) {
    closeMenuOnOrdinaryClick(event, closeNow)
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <SiteLink page="home" className="site-brand" aria-label="LinkSense"><Brand /></SiteLink>
          <nav aria-label={copy.nav.primary} className="header-links">
            <SiteLink page="cases">{copy.nav.cases}</SiteLink>
            <SiteLink page="hosting">{copy.nav.hosting}</SiteLink>
            <a href={docsPath(locale)}>{copy.nav.docs}<ArrowUpRight aria-hidden="true" size={12} /></a>
          </nav>
          <div className="header-actions">
            <a href={productLinks.demo} className="pill-link header-demo" aria-label={copy.nav.demo}>
              <span className="pill-dot" aria-hidden="true" />
              <span className="header-demo-long">{copy.nav.demo}</span>
              <span className="header-demo-short">{copy.nav.demoShort}</span>
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <button
              type="button"
              className="menu-button"
              aria-haspopup="dialog"
              aria-controls="site-menu"
              aria-expanded={menuOpen}
              onClick={openMenu}
            >
              <span className="menu-button-label">{copy.nav.menu}</span>
              <span className="menu-strokes" aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </header>
      <dialog
        id="site-menu"
        ref={dialog}
        className="menu-dialog"
        aria-labelledby="site-menu-title"
        data-closing={closing ? 'true' : undefined}
        onCancel={(event) => { event.preventDefault(); requestClose() }}
        onClose={() => { setMenuOpen(false); setClosing(false) }}
        onPointerDown={(event) => { pressedOutside.current = isOutsideSheet(event) }}
        onPointerUp={(event) => {
          if (pressedOutside.current && isOutsideSheet(event)) requestClose()
          pressedOutside.current = false
        }}
      >
        <div className="menu-sheet">
          <h2 id="site-menu-title" className="sr-only">{copy.nav.menu}</h2>
          <div className="menu-sheet-head">
            <SiteLink page="home" className="site-brand" aria-label="LinkSense" onClick={closeMenuFrom}><Brand /></SiteLink>
            <button type="button" className="menu-close" data-menu-close onClick={requestClose}>
              <span>{copy.nav.close}</span><X size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <div className="menu-sheet-body">
            <div className="menu-utilities">
              <p className="menu-kicker">{copy.nav.primary}</p>
              <a href={docsPath(locale)} onClick={closeMenuFrom}>{copy.nav.docs}<ArrowUpRight size={13} aria-hidden="true" /></a>
              <a href={productLinks.github} onClick={closeMenuFrom}>{copy.nav.github}<ArrowUpRight size={13} aria-hidden="true" /></a>
              <a href={productLinks.demo} onClick={closeMenuFrom}>{copy.nav.demo}<ArrowUpRight size={13} aria-hidden="true" /></a>
              <ThemeSwitch />
              <div className="menu-language">
                <p><Globe2 size={14} aria-hidden="true" />{copy.nav.language}</p>
                <Languages onSelect={closeMenuFrom} />
              </div>
            </div>
          <MenuArtwork />
            <nav aria-label={copy.nav.primary} className="menu-primary">
              <ol>
                {pageNames.map((name, index) => (
                  <li key={name}>
                    <span className="menu-number" aria-hidden="true">0{index + 1}</span>
                    <SiteLink
                      page={name}
                      onClick={closeMenuFrom}
                      aria-current={page === name ? 'page' : undefined}
                    >
                      {copy.nav[name]}<ArrowUpRight size={24} strokeWidth={1.35} aria-hidden="true" />
                    </SiteLink>
                  </li>
                ))}
              </ol>
            </nav>
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
