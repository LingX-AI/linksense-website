import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { ArrowUpRight, Globe2, Menu, Moon, Sun, X } from 'lucide-react'
import {
  useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore,
} from 'react'
import type {
  ComponentProps, CSSProperties, MouseEvent, ReactNode, RefObject, SyntheticEvent, TransitionEvent,
} from 'react'
import {
  defaultLocale, docsPath, locales, pageNames, productLinks, siteLocales, sitePath,
} from '../lib/site'
import type { SiteLocale, SitePage } from '../lib/site'
import {
  isCompactScroll, isHomePathname, menuCloseDuration, menuPageOrigin, shouldAnimatePath,
} from '../lib/exo-navigation'
import { colorSchemeKey, nextColorOverride, systemColorScheme } from '../lib/theme'
import { useSite } from '../lib/use-site'

const routeTargets = {
  home: '/{-$lang}',
  cases: '/{-$lang}/use-cases',
  hosting: '/{-$lang}/self-hosted',
} as const

const menuId = 'exo-menu'
const menuArt = [
  { page: 'home', src: '/media/workspace.webp' },
  { page: 'cases', src: '/media/menu-use-cases.webp' },
  { page: 'hosting', src: '/media/menu-self-hosted.webp' },
] as const

type MenuPhase = 'closed' | 'open' | 'closing'

let reducedMotionList: MediaQueryList | undefined

function getReducedMotionList() {
  if (typeof window === 'undefined') return undefined
  reducedMotionList ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return reducedMotionList
}

function subscribeReducedMotion(onChange: () => void) {
  const list = getReducedMotionList()
  if (!list) return () => {}
  list.addEventListener('change', onChange)
  return () => list.removeEventListener('change', onChange)
}

function reducedMotionSnapshot() {
  return getReducedMotionList()?.matches ?? false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, reducedMotionSnapshot, () => false)
}

function supportsMenuClipTransition() {
  return typeof CSS !== 'undefined' && CSS.supports('clip-path', 'polygon(0% 0%, 100% 0%, 100% 110%, 0% 100%)')
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey
}

function desktopControlHasFocus() {
  const active = document.activeElement
  return active instanceof Element && Boolean(active.closest('[data-exo-hide-compact]'))
}

export function SiteLink({ page, language, hash, children, ...props }: {
  page: SitePage
  language?: SiteLocale
  hash?: string
  children: ReactNode
} & Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'onFocus' | 'onBlur' | 'onPointerEnter' | 'onPointerLeave' | 'aria-label' | 'style'>) {
  const { locale } = useSite()
  const pathname = useLocation({ select: (location) => location.pathname })
  const reducedMotion = usePrefersReducedMotion()
  const lang = language ?? locale
  const pathChanges = shouldAnimatePath(pathname, sitePath(page, lang))
  return (
    <Link
      to={routeTargets[page]}
      params={{ lang: lang === defaultLocale ? undefined : lang }}
      hash={hash}
      activeOptions={{ exact: true }}
      viewTransition={pathChanges && !reducedMotion}
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

function Header({ pageRef }: { pageRef: RefObject<HTMLDivElement | null> }) {
  const { copy, locale, page } = useSite()
  const pathname = useLocation({ select: (location) => location.pathname })
  const router = useRouter()
  const reducedMotion = usePrefersReducedMotion()
  const home = isHomePathname(pathname)
  const [compact, setCompact] = useState(false)
  const [narrow, setNarrow] = useState(false)
  const [phase, setPhaseState] = useState<MenuPhase>('closed')
  const [artPage, setArtPage] = useState<SitePage>(page)

  const phaseRef = useRef<MenuPhase>('closed')
  const restoreFocus = useRef(true)
  const closeTimer = useRef<number | null>(null)
  const resetFrame = useRef(0)
  const resetFrameInner = useRef(0)
  const focusFrame = useRef(0)
  const pageOrigin = useRef<number | null>(null)
  const desktopControlFocus = useRef(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  const setPhase = useCallback((next: MenuPhase) => {
    phaseRef.current = next
    setPhaseState(next)
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const cancelResetFrame = useCallback(() => {
    if (resetFrame.current) {
      window.cancelAnimationFrame(resetFrame.current)
      resetFrame.current = 0
    }
    if (resetFrameInner.current) {
      window.cancelAnimationFrame(resetFrameInner.current)
      resetFrameInner.current = 0
    }
  }, [])

  const cancelFocusFrame = useCallback(() => {
    if (focusFrame.current) {
      window.cancelAnimationFrame(focusFrame.current)
      focusFrame.current = 0
    }
  }, [])

  const focusSoon = useCallback((target: () => HTMLElement | null, allowed: () => boolean = () => true) => {
    cancelFocusFrame()
    focusFrame.current = window.requestAnimationFrame(() => {
      focusFrame.current = 0
      if (allowed()) target()?.focus({ preventScroll: true })
    })
  }, [cancelFocusFrame])

  const resetPageStylesSoon = useCallback((pageElement: HTMLDivElement | null) => {
    cancelResetFrame()
    if (!pageElement) return
    resetFrame.current = window.requestAnimationFrame(() => {
      resetFrame.current = 0
      resetFrameInner.current = window.requestAnimationFrame(() => {
        resetFrameInner.current = 0
        pageElement.style.transition = ''
        pageElement.style.transform = ''
        pageElement.style.transformOrigin = ''
      })
    })
  }, [cancelResetFrame])

  const finishClose = useCallback(() => {
    if (phaseRef.current !== 'closing') return
    clearCloseTimer()
    const element = dialog.current
    if (element?.open) element.close()
    const pageElement = pageRef.current
    pageElement?.classList.remove('exo-page--menu-shifted')
    pageOrigin.current = null
    resetPageStylesSoon(pageElement)
    if (stage.current) stage.current.inert = false
    setPhase('closed')
    if (restoreFocus.current) focusSoon(() => trigger.current)
    else cancelFocusFrame()
  }, [cancelFocusFrame, clearCloseTimer, focusSoon, pageRef, resetPageStylesSoon, setPhase])

  const closeImmediately = useCallback((returnFocus: boolean) => {
    cancelFocusFrame()
    const element = dialog.current
    if (phaseRef.current === 'closed' && !element?.open) return
    clearCloseTimer()
    if (element?.open) element.close()
    if (stage.current) stage.current.inert = false
    const pageElement = pageRef.current
    pageElement?.classList.remove('exo-page--menu-shifted')
    pageOrigin.current = null
    if (pageElement) {
      pageElement.style.transition = 'none'
      pageElement.style.transform = 'none'
      resetPageStylesSoon(pageElement)
    }
    setPhase('closed')
    if (returnFocus) focusSoon(() => trigger.current)
  }, [cancelFocusFrame, clearCloseTimer, focusSoon, pageRef, resetPageStylesSoon, setPhase])

  const openMenu = useCallback(() => {
    const element = dialog.current
    if (!element) return
    clearCloseTimer()
    cancelFocusFrame()
    cancelResetFrame()
    const pageElement = pageRef.current
    if (pageElement && !reducedMotion) {
      if (phaseRef.current === 'closed' || pageOrigin.current === null) {
        pageElement.style.transition = 'none'
        pageElement.style.transform = 'none'
        const rect = pageElement.getBoundingClientRect()
        // Re-express the viewport midpoint in page-box coordinates so long
        // home pages rotate around what the viewer actually sees.
        const originY = menuPageOrigin(rect.top, pageElement.offsetHeight, window.innerHeight)
        pageOrigin.current = originY
        pageElement.style.transformOrigin = `50% ${originY}px`
        void pageElement.offsetHeight
        pageElement.style.transition = ''
        pageElement.style.transform = ''
      }
      pageElement.classList.add('exo-page--menu-shifted')
    } else if (pageElement) {
      pageElement.classList.remove('exo-page--menu-shifted')
      pageElement.style.transition = ''
      pageElement.style.transform = ''
      pageElement.style.transformOrigin = ''
    }
    if (!element.open) {
      if (typeof element.showModal === 'function') element.showModal()
      else element.setAttribute('open', '')
      void element.offsetWidth
    }
    if (stage.current) stage.current.inert = false
    setArtPage(page)
    setPhase('open')
    focusSoon(() => closeButton.current, () => phaseRef.current === 'open')
  }, [cancelFocusFrame, cancelResetFrame, clearCloseTimer, focusSoon, page, pageRef, reducedMotion, setPhase])

  const requestClose = useCallback((returnFocus = true) => {
    const element = dialog.current
    if (!element?.open) {
      clearCloseTimer()
      setPhase('closed')
      if (returnFocus) focusSoon(() => trigger.current)
      else cancelFocusFrame()
      return
    }
    if (phaseRef.current === 'closing') return
    clearCloseTimer()
    cancelFocusFrame()
    restoreFocus.current = returnFocus
    setPhase('closing')
    pageRef.current?.classList.remove('exo-page--menu-shifted')
    if (stage.current) stage.current.inert = true
    const duration = menuCloseDuration(reducedMotion, supportsMenuClipTransition())
    if (duration === 0) {
      finishClose()
      return
    }
    closeTimer.current = window.setTimeout(finishClose, duration + 40)
  }, [cancelFocusFrame, clearCloseTimer, finishClose, focusSoon, pageRef, reducedMotion, setPhase])

  function handleDialogCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault()
    requestClose(true)
  }

  function handleDialogClose() {
    if (dialog.current?.open) return
    clearCloseTimer()
    const pageElement = pageRef.current
    pageElement?.classList.remove('exo-page--menu-shifted')
    pageOrigin.current = null
    resetPageStylesSoon(pageElement)
    if (stage.current) stage.current.inert = false
    if (phaseRef.current !== 'closed') setPhase('closed')
  }

  function handleDialogTransitionEnd(event: TransitionEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== 'clip-path') return
    if (phaseRef.current === 'closing') finishClose()
  }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 51.999rem)')
    const sync = () => {
      desktopControlFocus.current = desktopControlHasFocus()
      setNarrow(media.matches)
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      desktopControlFocus.current = desktopControlHasFocus()
      setCompact(isCompactScroll(window.scrollY, window.innerHeight))
    }
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useLayoutEffect(() => {
    if (!compact && !narrow) return
    if (!desktopControlFocus.current) return
    desktopControlFocus.current = false
    trigger.current?.focus({ preventScroll: true })
  }, [compact, narrow])

  useEffect(() => {
    const unsubscribe = router.subscribe('onResolved', (event) => {
      if (event.pathChanged) closeImmediately(false)
    })
    return unsubscribe
  }, [closeImmediately, router])

  useEffect(() => () => {
    clearCloseTimer()
    cancelResetFrame()
    cancelFocusFrame()
    const element = dialog.current
    if (element?.open) element.close()
    pageRef.current?.classList.remove('exo-page--menu-shifted')
    pageOrigin.current = null
  }, [cancelFocusFrame, cancelResetFrame, clearCloseTimer, pageRef])

  const navigateFromMenu = (event: MouseEvent<HTMLAnchorElement>, targetPage: SitePage) => {
    if (!isPlainClick(event)) return
    closeImmediately(!shouldAnimatePath(pathname, sitePath(targetPage, locale)))
  }

  const selectLanguage = (event: MouseEvent<HTMLAnchorElement>, language: SiteLocale) => {
    if (!isPlainClick(event)) return
    closeImmediately(!shouldAnimatePath(pathname, sitePath(page, language)))
  }

  const closeForExternal = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isPlainClick(event)) closeImmediately(false)
  }

  const overlay = home && !compact
  const className = [
    'site-header',
    'exo-header',
    home && 'exo-header--home',
    overlay && 'exo-header--overlay',
    compact && 'exo-header--compact',
  ].filter(Boolean).join(' ')

  return (
    <>
      <header className={className}>
        <div className="container header-inner exo-header-inner">
          <SiteLink page="home" className="site-brand exo-brand" aria-label="LinkSense"><Brand /></SiteLink>
          <nav aria-label={copy.nav.primary} className="header-links exo-header-links" data-exo-hide-compact>
            <SiteLink page="cases">{copy.nav.cases}</SiteLink>
            <SiteLink page="hosting">{copy.nav.hosting}</SiteLink>
            <a href={docsPath(locale)}>{copy.nav.docs}<ArrowUpRight aria-hidden="true" size={12} /></a>
            <a href={productLinks.github}>{copy.nav.github}<ArrowUpRight aria-hidden="true" size={12} /></a>
          </nav>
          <div className="header-actions exo-header-actions">
            <a className="btn btn--compact exo-cta" href={productLinks.demo} aria-label={copy.nav.demo} data-exo-hide-compact>
              <span className="hidden md:inline">{copy.nav.demo}</span>
              <span className="md:hidden">{copy.nav.demoShort}</span>
              <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <ThemeToggle />
            <button
              ref={trigger}
              type="button"
              className="header-icon menu-button exo-menu-trigger"
              aria-haspopup="dialog"
              aria-expanded={phase === 'open'}
              aria-controls={menuId}
              aria-label={copy.nav.menu}
              onClick={openMenu}
            >
              <Menu size={21} strokeWidth={1.65} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        id={menuId}
        ref={dialog}
        className={['exo-menu', phase === 'open' && 'is-open', phase === 'closing' && 'is-closing'].filter(Boolean).join(' ')}
        aria-label={copy.nav.menu}
        onCancel={handleDialogCancel}
        onClose={handleDialogClose}
        onTransitionEnd={handleDialogTransitionEnd}
        onClick={(event) => { if (event.target === dialog.current) requestClose(true) }}
      >
        <div className="exo-menu-stage" ref={stage}>
          <div className="exo-menu-top">
            <SiteLink page="home" className="exo-menu-brand" aria-label="LinkSense" onClick={(event) => navigateFromMenu(event, 'home')}>
              <Brand />
            </SiteLink>
            <button ref={closeButton} type="button" className="exo-menu-close" onClick={() => requestClose(true)}>
              <span>{copy.nav.close}</span><X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="exo-menu-body">
            <div className="exo-menu-art" aria-hidden="true">
              {menuArt.map(({ page: art, src }) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={artPage === art ? 'is-active' : undefined}
                  width="900"
                  height="1100"
                  decoding="async"
                />
              ))}
            </div>
            <nav aria-label={copy.nav.primary} className="exo-menu-nav">
              {pageNames.map((name, index) => (
                <SiteLink
                  key={name}
                  page={name}
                  className="exo-menu-link"
                  style={{ '--exo-index': index } as CSSProperties}
                  onClick={(event) => navigateFromMenu(event, name)}
                  onPointerEnter={() => setArtPage(name)}
                  onPointerLeave={() => setArtPage(page)}
                  onFocus={() => setArtPage(name)}
                  onBlur={() => setArtPage(page)}
                >
                  <span className="exo-menu-link-mask">
                    <span className="exo-menu-link-inner">{copy.nav[name]}</span>
                  </span>
                  <ArrowUpRight className="exo-menu-link-icon" size={22} aria-hidden="true" />
                </SiteLink>
              ))}
            </nav>
          </div>
          <div className="exo-menu-foot">
            <nav aria-label={copy.nav.footer} className="exo-menu-secondary">
              <a href={docsPath(locale)} onClick={closeForExternal}>{copy.nav.docs} ↗</a>
              <a href={productLinks.github} onClick={closeForExternal}>{copy.nav.github} ↗</a>
              <a href={productLinks.demo} onClick={closeForExternal}>{copy.nav.demo} ↗</a>
              <a href={productLinks.contact} onClick={closeForExternal}>{copy.nav.contact} ↗</a>
            </nav>
            <div className="exo-menu-languages">
              <Globe2 size={15} aria-hidden="true" />
              <Languages onSelect={selectLanguage} />
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
    <footer className="site-footer exo-footer">
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
  const router = useRouter()
  const pageRef = useRef<HTMLDivElement>(null)
  const historyNavigation = useRef(false)

  useEffect(() => { document.documentElement.lang = siteLocales[locale].code }, [locale])

  useEffect(() => {
    let resetTimer = 0
    const onPopState = () => {
      historyNavigation.current = true
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => { historyNavigation.current = false }, 5000)
    }
    const unsubscribe = router.subscribe('onResolved', (event) => {
      const fromHistory = historyNavigation.current
      historyNavigation.current = false
      window.clearTimeout(resetTimer)
      if (!event.pathChanged || fromHistory) return
      window.requestAnimationFrame(() => {
        document.getElementById('main-content')?.focus({ preventScroll: true })
      })
    })
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.clearTimeout(resetTimer)
      unsubscribe()
    }
  }, [router])

  return (
    <div className="site-shell exo-site">
      <a className="skip-link" href="#main-content">{copy.nav.skip}</a>
      <Header pageRef={pageRef} />
      <div className="exo-page-clip">
        <div className="exo-page" ref={pageRef}>
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
