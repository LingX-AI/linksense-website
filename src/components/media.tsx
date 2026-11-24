import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent, ReactNode, RefObject } from 'react'
import { useSite } from '../lib/use-site'

export function ordinaryClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function hoverPreview(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return
  const target = event.currentTarget
  const clip = target.querySelector('video')
  if (clip) void clip.play().then(() => {
    if (!target.isConnected || !target.matches(':hover') || document.hidden) clip.pause()
  }).catch(() => { /* The poster remains when a preview cannot play. */ })
}

export function stopPreview(event: PointerEvent<HTMLElement>) {
  event.currentTarget.querySelector('video')?.pause()
}

export function Poster({ name, alt, preview, playOnView = false, className }: {
  name: string
  alt: string
  preview?: string
  playOnView?: boolean
  className?: string
}) {
  const clip = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = clip.current
    if (!video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const threshold = playOnView ? 0.5 : 0
    let visible = false
    function sync() {
      if (!video) return
      if (!visible || reduced.matches || document.hidden) {
        video.pause()
      } else if (playOnView && video.paused && !video.ended) {
        video.muted = true
        void video.play().catch(() => undefined)
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && entry.intersectionRatio >= threshold
      sync()
    }, { threshold })
    observer.observe(video)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      video.pause()
    }
  }, [playOnView])
  return (
    <div className={`poster-stack${className ? ` ${className}` : ''}`}>
      <img src={`/media/${name}.webp`} alt={alt} className="poster-still" width="1152" height="548" loading="lazy" decoding="async" />
      {preview && <video ref={clip} aria-hidden="true" tabIndex={-1} src={`/media/${preview}.mp4`}
        width="1152" height="548" preload="none" muted loop={!playOnView} playsInline className="poster-preview"
        onPlaying={({ currentTarget }) => { currentTarget.dataset.playing = '' }}
        onPause={({ currentTarget }) => { delete currentTarget.dataset.playing }}
        onEnded={({ currentTarget }) => { delete currentTarget.dataset.playing }}
        onError={({ currentTarget }) => { delete currentTarget.dataset.playing }} />}
    </div>
  )
}

function useFilmDialog(source: string, poster: string) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLAnchorElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const media = video.current
    const pause = () => { if (document.hidden) media?.pause() }
    document.addEventListener('visibilitychange', pause)
    return () => {
      document.removeEventListener('visibilitychange', pause)
      media?.pause()
    }
  }, [])

  function open(event: MouseEvent<HTMLAnchorElement>) {
    const panel = dialog.current
    const clip = video.current
    if (!ordinaryClick(event) || !panel?.showModal || !clip) return
    event.preventDefault()
    if (panel.open) return
    setFailed(false)
    clip.poster = poster
    if (!clip.hasAttribute('src') || clip.error) clip.src = source
    else if (clip.readyState > 0) clip.currentTime = 0
    panel.showModal()
    panel.querySelector<HTMLElement>('button')?.focus()
    void clip.play().catch(() => { if (clip.error && panel.open) setFailed(true) })
  }

  function close() {
    video.current?.pause()
    dialog.current?.close()
  }

  return { dialog, trigger, video, failed, setFailed, open, close }
}

function FilmDialog({ dialog, trigger, video, failed, title, subtitle, source, close, onFail }: {
  dialog: RefObject<HTMLDialogElement | null>
  trigger: RefObject<HTMLAnchorElement | null>
  video: RefObject<HTMLVideoElement | null>
  failed: boolean
  title: string
  subtitle?: string
  source: string
  close: () => void
  onFail: () => void
}) {
  const { copy } = useSite()
  return (
    <dialog
      className="film-dialog"
      ref={dialog}
      aria-label={title}
      onCancel={() => video.current?.pause()}
      onClose={() => {
        video.current?.pause()
        if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true })
      }}
    >
      <div className="film-window">
        <div className="film-top">
          <div><p>{title}</p>{subtitle && <p className="film-muted">{subtitle}</p>}</div>
          <button className="film-close" onClick={close} type="button">
            <span>{copy.nav.close}</span><X size={22} aria-hidden="true" />
          </button>
        </div>
        <video ref={video} preload="none" controls playsInline aria-label={title} onError={onFail} />
        {failed && <p className="film-muted film-error" role="status">{copy.home.loadError} <a href={source}>{copy.home.openVideo}</a></p>}
      </div>
    </dialog>
  )
}

export function MediaLink({ source, poster, title, label = title, subtitle, className, children }: {
  source: string
  poster: string
  title: string
  label?: string
  subtitle?: string
  className: string
  children: ReactNode
}) {
  const { dialog, trigger, video, failed, setFailed, open, close } = useFilmDialog(source, poster)
  return (
    <>
      <a href={source} ref={trigger} className={className} aria-label={label} onClick={open}>
        {children}
      </a>
      <FilmDialog dialog={dialog} trigger={trigger} video={video} failed={failed}
        title={title} subtitle={subtitle} source={source} close={close} onFail={() => setFailed(true)} />
    </>
  )
}

/**
 * Autoplaying muted reel with a crop entrance, inner parallax and an explicit
 * dialog for the full film. Reduced motion keeps the poster and the play link.
 */
export function Showreel({ source, poster, title, label, subtitle }: {
  source: string
  poster: string
  title: string
  label: string
  subtitle?: string
}) {
  const { copy } = useSite()
  const { dialog, trigger, video, failed, setFailed, open, close } = useFilmDialog(source, poster)
  const frame = useRef<HTMLDivElement>(null)
  const crop = useRef<HTMLDivElement>(null)
  const inline = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  const parallax = useTransform(scrollYProgress, [0, 1], ['-1.4%', '1.4%'])

  useEffect(() => {
    const video = inline.current
    const shell = crop.current
    if (!video || !shell) return
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false

    function sync() {
      if (!video) return
      if (!visible || reducedQuery.matches || document.hidden) {
        video.pause()
        return
      }
      video.muted = true
      void video.play().catch(() => undefined)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && entry.intersectionRatio >= 0.35
      sync()
    }, { threshold: [0.35, 0.55] })
    observer.observe(shell)
    reducedQuery.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      reducedQuery.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      video.pause()
    }
  }, [])

  useEffect(() => {
    const shell = crop.current
    if (!shell) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    shell.style.clipPath = 'inset(5% 10% round var(--radius-card))'
    shell.style.transform = 'scale(.9)'
    shell.style.opacity = '0'
    const reveal = () => {
      shell.style.clipPath = 'inset(0% 0% round var(--radius-card))'
      shell.style.transform = 'scale(1)'
      shell.style.opacity = '1'
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      reveal()
    }, { threshold: 0.1 })
    observer.observe(shell)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="showreel" ref={frame}>
      <div className="showreel-crop" ref={crop}>
        <a className="showreel-link" href={source} ref={trigger} onClick={open} aria-label={label}>
          <motion.div className="showreel-inner" style={{ y: reduced ? 0 : parallax }}>
            <video className="showreel-video" ref={inline} src={source} poster={poster}
              muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />
          </motion.div>
          <span className="showreel-play" aria-hidden="true">{label}</span>
        </a>
      </div>
      <p className="showreel-caption">
        <span>{title}</span>
        {subtitle && <span>{subtitle}</span>}
        <span className="showreel-open">{copy.home.play}</span>
      </p>
      <FilmDialog dialog={dialog} trigger={trigger} video={video} failed={failed}
        title={title} subtitle={subtitle} source={source} close={close} onFail={() => setFailed(true)} />
    </div>
  )
}
