import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { useSite } from '../lib/use-site'

export function ordinaryClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
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
    void clip.play().catch(() => { if (clip.error && panel.open) setFailed(true) })
  }

  function close() {
    video.current?.pause()
    dialog.current?.close()
  }

  return (
    <>
      <a href={source} className={className} aria-label={label} onClick={open}>
        {children}
      </a>
      <dialog
        className="film-dialog"
        ref={dialog}
        aria-label={title}
        onCancel={() => video.current?.pause()}
        onClose={() => { video.current?.pause() }}
      >
        <div className="film-window">
          <div className="film-top">
            <div><p>{title}</p>{subtitle && <p className="film-muted">{subtitle}</p>}</div>
            <button className="film-close" onClick={close} type="button" autoFocus><span>{copy.nav.close}</span><X size={22} aria-hidden="true" /></button>
          </div>
          <video ref={video} preload="none" controls playsInline aria-label={title} onError={() => setFailed(true)} />
          {failed && <p className="film-muted mt-3" role="status">{copy.home.loadError} <a className="underline" href={source}>{copy.home.openVideo}</a></p>}
        </div>
      </dialog>
    </>
  )
}
