import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent, ReactNode } from 'react'
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

export function Poster({ name, alt, preview, priority = false }: {
  name: string
  alt: string
  preview?: string
  priority?: boolean
}) {
  const clip = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = clip.current
    if (!video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    function sync() {
      if (!visible || reduced.matches || document.hidden) video?.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      sync()
    })
    observer.observe(video)
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      video.pause()
    }
  }, [])
  return (
    <div className="poster-stack">
      <img src={`/media/${name}.webp`} alt={alt} className="poster-still" width="1152" height="548"
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
      {preview && <video ref={clip} aria-hidden="true" tabIndex={-1} src={`/media/${preview}.mp4`}
        width="1152" height="548" preload="none" muted loop playsInline className="poster-preview"
        onPlaying={({ currentTarget }) => { currentTarget.dataset.playing = '' }}
        onPause={({ currentTarget }) => { delete currentTarget.dataset.playing }}
        onError={({ currentTarget }) => { delete currentTarget.dataset.playing }} />}
    </div>
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
  const { copy } = useSite()
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

  return (
    <>
      <a href={source} ref={trigger} className={className} aria-label={label} onClick={open}>
        {children}
      </a>
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
            <button className="film-close" onClick={close} type="button"><span>{copy.nav.close}</span><X size={22} aria-hidden="true" /></button>
          </div>
          <video ref={video} preload="none" controls playsInline aria-label={title} onError={() => setFailed(true)} />
          {failed && <p className="film-muted mt-3" role="status">{copy.home.loadError} <a className="underline" href={source}>{copy.home.openVideo}</a></p>}
        </div>
      </dialog>
    </>
  )
}
