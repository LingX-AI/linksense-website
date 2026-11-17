import { Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent, ReactNode } from 'react'
import { useSite } from '../lib/use-site'

export function ordinaryClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function placeCue(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return
  const target = event.currentTarget
  const { left, top, width, height } = target.getBoundingClientRect()
  const x = Math.max(0, Math.min(100, (event.clientX - left) / width * 100))
  const y = Math.max(0, Math.min(100, (event.clientY - top) / height * 100))
  target.style.setProperty('--cue-x', `${x}%`)
  target.style.setProperty('--cue-y', `${y}%`)
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

export function Poster({ name, alt, preview, eager }: {
  name: string
  alt: string
  preview?: string
  eager?: boolean
}) {
  const clip = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = clip.current
    if (!video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pause = () => video.pause()
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) pause()
    })
    observer.observe(video)
    reduced.addEventListener('change', pause)
    document.addEventListener('visibilitychange', pause)
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', pause)
      document.removeEventListener('visibilitychange', pause)
      pause()
    }
  }, [])
  return (
    <div className="poster-stack">
      <img src={`/media/${name}.webp`} alt={alt} className="poster-still" width="1152" height="548" loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {preview && <video ref={clip} aria-hidden="true" tabIndex={-1} src={`/media/${preview}.mp4`}
        preload="none" muted loop playsInline className="poster-preview"
        onPlaying={({ currentTarget }) => { currentTarget.dataset.playing = '' }}
        onPause={({ currentTarget }) => { delete currentTarget.dataset.playing }}
        onError={({ currentTarget }) => { delete currentTarget.dataset.playing }} />}
    </div>
  )
}

export function MediaLink({ source, poster, title, label = title, subtitle, className, children, preview = false }: {
  source: string
  poster: string
  title: string
  label?: string
  subtitle?: string
  className: string
  children: ReactNode
  preview?: boolean
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
    if (preview) event.currentTarget.querySelector('video')?.pause()
    setFailed(false)
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
      <a href={source} ref={trigger} className={className} aria-label={label} onClick={open}
        onPointerMove={placeCue} onPointerEnter={preview ? hoverPreview : undefined}
        onPointerLeave={preview ? stopPreview : undefined}>
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
            <div><p className="text-base">{title}</p>{subtitle && <p className="mt-1 text-sm text-muted-inverse">{subtitle}</p>}</div>
            <button className="menu-trigger" onClick={close} type="button"><span>{copy.nav.close}</span><X size={23} aria-hidden="true" /></button>
          </div>
          <video ref={video} preload="none" controls playsInline poster={poster} aria-label={title} onError={() => setFailed(true)} />
          {failed && <p className="mt-3 text-sm" role="status">{copy.home.loadError} <a className="underline" href={source}>{copy.home.openVideo}</a></p>}
        </div>
      </dialog>
    </>
  )
}

export function MediaCue({ label, play = false }: { label: string; play?: boolean }) {
  return (
    <span className="media-cue" aria-hidden="true">
      {play && <Play size={17} fill="currentColor" strokeWidth={1.25} />}
      <span>{label}</span>
    </span>
  )
}
