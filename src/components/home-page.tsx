import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'

function HomeCursor() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return

    const cursor = document.createElement('div')
    cursor.className = 'exo-cursor'
    cursor.setAttribute('aria-hidden', 'true')
    document.body.appendChild(cursor)

    let frame = 0
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0
    let positioned = false

    function render() {
      frame = 0
      x += (targetX - x) * .18
      y += (targetY - y) * .18
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      if (Math.abs(targetX - x) > .1 || Math.abs(targetY - y) > .1) {
        frame = requestAnimationFrame(render)
      }
    }

    function move(event: PointerEvent) {
      if (!positioned) {
        x = targetX = event.clientX
        y = targetY = event.clientY
        positioned = true
      } else {
        targetX = event.clientX
        targetY = event.clientY
      }
      if (!frame) frame = requestAnimationFrame(render)
    }

    function hide() {
      delete cursor.dataset.visible
    }

    function over(event: PointerEvent) {
      const origin = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-exo-cursor]')
        : null
      if (!origin) {
        hide()
        return
      }
      cursor.textContent = origin.dataset.exoCursor ?? ''
      cursor.dataset.visible = 'true'
      targetX = event.clientX
      targetY = event.clientY
      if (!positioned) {
        x = targetX
        y = targetY
        positioned = true
      }
      if (!frame) frame = requestAnimationFrame(render)
    }

    function out(event: PointerEvent) {
      const origin = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-exo-cursor]')
        : null
      if (!origin) return
      const next = event.relatedTarget instanceof Element
        ? event.relatedTarget.closest<HTMLElement>('[data-exo-cursor]')
        : null
      if (next !== origin) hide()
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, true)
    document.addEventListener('pointerout', out, true)
    window.addEventListener('scroll', hide, { passive: true })
    window.addEventListener('blur', hide)

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over, true)
      document.removeEventListener('pointerout', out, true)
      window.removeEventListener('scroll', hide)
      window.removeEventListener('blur', hide)
      if (frame) cancelAnimationFrame(frame)
      cursor.remove()
    }
  }, [])

  return null
}

function HomeHero() {
  const { copy } = useSite()
  const { home, nav } = copy
  const hero = useRef<HTMLElement>(null)

  useEffect(() => {
    const host = hero.current
    if (!host || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const surface: HTMLElement = host

    let frame = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    function render() {
      frame = 0
      currentX += (targetX - currentX) * .12
      currentY += (targetY - currentY) * .12
      surface.style.setProperty('--exo-hero-x', `${currentX.toFixed(2)}px`)
      surface.style.setProperty('--exo-hero-y', `${currentY.toFixed(2)}px`)
      if (Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05) {
        frame = requestAnimationFrame(render)
      }
    }

    function move(event: PointerEvent) {
      const bounds = surface.getBoundingClientRect()
      targetX = ((event.clientX - bounds.left) / bounds.width - .5) * -18
      targetY = ((event.clientY - bounds.top) / bounds.height - .5) * -12
      if (!frame) frame = requestAnimationFrame(render)
    }

    function leave() {
      targetX = 0
      targetY = 0
      if (!frame) frame = requestAnimationFrame(render)
    }

    surface.addEventListener('pointermove', move)
    surface.addEventListener('pointerleave', leave)
    return () => {
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerleave', leave)
      if (frame) cancelAnimationFrame(frame)
      surface.style.removeProperty('--exo-hero-x')
      surface.style.removeProperty('--exo-hero-y')
    }
  }, [])

  return (
    <section className="exo-home-hero" aria-labelledby="home-title" ref={hero}>
      <div className="exo-hero-media" aria-hidden="true">
        <img className="exo-hero-img" src="/media/exoape-hero.webp" alt="" width="1620" height="1000"
          fetchPriority="high" decoding="async" />
      </div>
      <div className="exo-hero-scrim" aria-hidden="true" />
      <div className="exo-frame exo-hero-layout">
        <div className="exo-hero-main">
          <h1 className="exo-hero-title" id="home-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.titleOne}</span></span>
            <span className="exo-mask"><span className="exo-mask-in">{home.titleTwo}</span></span>
          </h1>
          <div className="exo-hero-support">
            <p className="exo-hero-intro">
              <span className="exo-mask"><span className="exo-mask-in">{home.introOne}</span></span>
            </p>
            <div className="exo-hero-actions">
              <a className="exo-hero-link" href={productLinks.demo}>
                {nav.demo}<ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <SiteLink page="hosting" className="exo-hero-link">
                {home.hostingLink}<ArrowUpRight size={14} aria-hidden="true" />
              </SiteLink>
            </div>
          </div>
        </div>
      </div>
      <a className="exo-scroll-cue" href="#workspace">
        <span>{home.scroll}</span>
        <span className="exo-scroll-cue-line" aria-hidden="true" />
        <ArrowDown size={13} aria-hidden="true" />
      </a>
    </section>
  )
}

function SelectedWork() {
  const { copy } = useSite()
  const { home } = copy

  return (
    <section className="exo-work" id="workspace" aria-labelledby="workspace-title">
      <div className="exo-frame exo-work-intro">
        <div className="exo-work-heading">
          <p className="exo-label">{copy.nav.cases}</p>
          <h2 className="exo-work-title" id="workspace-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.overview}</span></span>
            <span className="exo-mask"><span className="exo-mask-in">{home.overviewResult}</span></span>
          </h2>
        </div>
        <p className="exo-work-lede">{home.overviewBody}</p>
      </div>

      <div className="exo-frame exo-feature-field">
        <article className="exo-feature exo-feature--run" data-exo-cursor={home.view}>
          <SiteLink page="cases" hash="procurement" className="exo-feature-link">
            <div className="exo-feature-media">
              <Poster name="workspace" alt="" preview="workspace-teaser" playOnView />
            </div>
            <div className="exo-feature-caption">
              <span className="exo-feature-index" aria-hidden="true">01</span>
              <div className="exo-feature-copy">
                <h3><span className="exo-mask"><span className="exo-mask-in">{home.work}</span></span></h3>
                <p>{home.workBody}</p>
              </div>
              <ArrowUpRight className="exo-feature-arrow" size={22} aria-hidden="true" />
            </div>
          </SiteLink>
        </article>

        <article className="exo-feature exo-feature--deliverables" data-exo-cursor={home.view}>
          <SiteLink page="cases" hash="procurement" className="exo-feature-link">
            <div className="exo-feature-media exo-feature-media--float">
              <img src="/media/workspace-result.webp" alt="" width="1440" height="684" loading="lazy" decoding="async" />
            </div>
            <div className="exo-feature-caption">
              <span className="exo-feature-index" aria-hidden="true">02</span>
              <div className="exo-feature-copy">
                <h3 id="deliverables"><span className="exo-mask"><span className="exo-mask-in">{home.files}</span></span></h3>
                <p>{home.filesBody}</p>
              </div>
              <ArrowUpRight className="exo-feature-arrow" size={22} aria-hidden="true" />
            </div>
          </SiteLink>
        </article>

        <article className="exo-feature exo-feature--share" data-exo-cursor={home.view}>
          <SiteLink page="cases" hash="capability-sharing" className="exo-feature-link"
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <div className="exo-feature-media">
              <Poster name="skills" alt="" preview="skills-preview" />
            </div>
            <div className="exo-feature-caption">
              <span className="exo-feature-index" aria-hidden="true">03</span>
              <div className="exo-feature-copy">
                <h3 id="team-title"><span className="exo-mask"><span className="exo-mask-in">{home.share}</span></span></h3>
                <p>{home.shareBody}</p>
              </div>
              <ArrowUpRight className="exo-feature-arrow" size={22} aria-hidden="true" />
            </div>
          </SiteLink>
        </article>
      </div>

      <div className="exo-frame exo-work-foot">
        <SiteLink page="cases" className="exo-work-more">
          <span>{home.allCases}</span>
          <ArrowUpRight size={30} aria-hidden="true" />
        </SiteLink>
      </div>
    </section>
  )
}

function FilmReel() {
  const { copy } = useSite()
  const home = copy.home

  return (
    <section className="exo-reel" aria-labelledby="film-title">
      <div className="exo-reel-track">
        <div className="exo-reel-stage">
          <div className="exo-reel-atmosphere" aria-hidden="true">
            <img src="/media/exoape-hero.webp" alt="" width="1620" height="1000" loading="lazy" decoding="async" />
          </div>
          <p className="exo-label exo-reel-label">{home.film}</p>
          <p className="exo-reel-note">{home.filmNote}</p>
          <h2 className="exo-reel-title" id="film-title">
            <span className="exo-reel-line exo-reel-line--one">
              <span className="exo-mask"><span className="exo-mask-in">{home.reelOne}</span></span>
            </span>
            <span className="exo-reel-line exo-reel-line--two">
              <span className="exo-mask"><span className="exo-mask-in">{home.reelTwo}</span></span>
            </span>
          </h2>
          <div className="exo-reel-media">
            <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film}
              label={home.play} subtitle={home.filmNote} className="exo-reel-link">
              <img className="exo-reel-poster" src="/media/reel.webp" alt="" width="1440" height="810" loading="lazy" decoding="async" />
              <span className="exo-reel-shade" aria-hidden="true" />
              <span className="exo-reel-play"><Play size={16} fill="currentColor" aria-hidden="true" />{home.play}</span>
            </MediaLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  const { copy } = useSite()
  const { home, nav } = copy

  return (
    <section className="exo-closing" aria-labelledby="closing-title">
      <div className="exo-closing-bg" aria-hidden="true">
        <img src="/media/signal.webp" alt="" width="1620" height="1000" loading="lazy" decoding="async" />
      </div>
      <div className="exo-frame exo-closing-inner">
        <p className="exo-label exo-closing-label">{copy.footer.source}</p>
        <h2 className="exo-closing-title" id="closing-title">
          <span className="exo-mask"><span className="exo-mask-in">{copy.footer.titleOne}</span></span>
          <span className="exo-mask"><span className="exo-mask-in">{copy.footer.titleTwo}</span></span>
        </h2>
        <div className="exo-closing-actions">
          <a className="exo-closing-link" href={productLinks.demo}>
            {nav.demo}<ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="exo-closing-link exo-closing-link--quiet" href={productLinks.github}>
            {nav.github}<ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <SiteLink page="hosting" className="exo-closing-link exo-closing-link--quiet">
            {home.hostingLink}<ArrowUpRight size={16} aria-hidden="true" />
          </SiteLink>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <div className="exo-home">
      <HomeCursor />
      <HomeHero />
      <SelectedWork />
      <FilmReel />
      <ClosingCta />
    </div>
  )
}
