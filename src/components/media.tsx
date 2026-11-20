import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { useSite } from '../lib/use-site'

export function ordinaryClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

export function Poster({ name, alt, priority = false }: {
  name: string
  alt: string
  priority?: boolean
}) {
  return (
    <div className="poster-stack">
      <img src={`/media/${name}.webp`} alt={alt} className="poster-still" width="1440" height="900"
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
    </div>
  )
}

export function ProductVideoLink({ title, label = title, subtitle, className, children }: {
  title: string
  label?: string
  subtitle?: string
  className: string
  children: ReactNode
}) {
  const { copy: { home, nav } } = useSite()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLAnchorElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const source = '/media/linksense-product-intro.mp4'
  const poster = '/media/linksense-product-poster.webp'

  useEffect(() => {
    const media = video.current
    const pauseWhenHidden = () => { if (document.hidden) media?.pause() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => {
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      media?.pause()
    }
  }, [])

  function close() {
    video.current?.pause()
    dialog.current?.close()
  }

  function open(event: MouseEvent<HTMLAnchorElement>) {
    const panel = dialog.current
    const media = video.current
    if (!ordinaryClick(event) || !panel?.showModal || !media) return
    event.preventDefault()
    if (panel.open) return
    setFailed(false)
    if (media.getAttribute('src') !== source || media.error) {
      media.src = source
      media.load()
    } else if (media.readyState > 0) {
      media.currentTime = 0
    }
    panel.showModal()
    panel.querySelector<HTMLElement>('button')?.focus()
    void media.play().catch(() => {
      if (media.error && panel.open) setFailed(true)
    })
  }

  return (
    <>
      <a href={source} ref={trigger} className={className} aria-label={label} aria-haspopup="dialog" onClick={open}>
        {children}
      </a>
      <dialog
        className="film-dialog product-video-dialog"
        ref={dialog}
        aria-label={title}
        onClick={(event) => { if (event.target === dialog.current) close() }}
        onCancel={() => video.current?.pause()}
        onClose={() => {
          video.current?.pause()
          if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true })
        }}
      >
        <div className="film-window">
          <div className="film-top">
            <div><p>{title}</p>{subtitle && <p className="film-muted">{subtitle}</p>}</div>
            <button className="header-icon film-close" onClick={close} type="button"><X size={20} aria-hidden="true" /><span className="sr-only">{nav.close}</span></button>
          </div>
          <video ref={video} className="product-intro-video" poster={poster} controls playsInline loop preload="none"
            width="1280" height="720" aria-label={title} onError={() => setFailed(true)} />
          {failed && <p className="film-muted" role="status">{home.videoError} <a href={source}>{home.videoOpen}</a></p>}
        </div>
      </dialog>
    </>
  )
}
