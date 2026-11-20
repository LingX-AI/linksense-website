import { ArrowDownRight, ArrowRight, Check, FileSpreadsheet, FileText, Maximize2, Pause, Play, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { useSite } from '../lib/use-site'
import { ProductVideoLink } from './media'
import { WorkspaceDemo } from './workspace-demo'
import type { WorkspaceDemoHandle } from './workspace-demo'

function followPointer(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 68rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
  const scene = event.currentTarget
  if (scene.dataset.running !== 'true') return
  const bounds = scene.getBoundingClientRect()
  scene.style.setProperty('--scene-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 10}px`)
  scene.style.setProperty('--scene-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 6}px`)
}

function resetPointer(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty('--scene-x')
  event.currentTarget.style.removeProperty('--scene-y')
}

export function HeroWorkspace() {
  const { copy: { home, nav } } = useSite()
  const scene = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const fullDemo = useRef<WorkspaceDemoHandle>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [active, setActive] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [paused, setPaused] = useState(false)
  const [obscured, setObscured] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [phase, setPhase] = useState<'request' | 'working' | 'files'>('request')

  useEffect(() => {
    const element = scene.current
    if (!element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const sync = () => {
      setMotionAllowed(!reduced.matches)
      setReducedMotion(reduced.matches)
      setPageVisible(!document.hidden)
      setActive(visible && !document.hidden)
      if (reduced.matches || !visible || document.hidden) {
        element.style.removeProperty('--scene-x')
        element.style.removeProperty('--scene-y')
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting && entry.intersectionRatio >= .15
      sync()
    }, { threshold: .15 })
    observer.observe(element)
    const modalObserver = new MutationObserver(() => setObscured(!!document.querySelector('dialog[open]')))
    modalObserver.observe(document.body, { attributes: true, attributeFilter: ['open'], subtree: true })
    reduced.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      observer.disconnect()
      modalObserver.disconnect()
      reduced.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  function openDemo(file?: 'sheet' | 'brief') {
    const panel = dialog.current
    if (!panel?.showModal || panel.open) return
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panel.showModal()
    setDemoOpen(true)
    if (file) fullDemo.current?.openFile(file)
    else fullDemo.current?.replay()
    panel.querySelector<HTMLElement>('.film-close')?.focus()
  }

  const running = active && !paused && !obscured
  return (
    <div ref={scene} className="hero-workspace" data-motion={motionAllowed ? 'ready' : undefined} data-phase={phase}
      data-running={running ? 'true' : 'false'} onPointerMove={followPointer} onPointerLeave={resetPointer}>
      <div className="hero-task-note">
        <p>{home.exampleTask}</p>
        <span className="stage-task-text">{home.previewTask}</span>
        <ArrowRight size={19} strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="hero-product">
        <div className="workspace-float">
          <figure className="workspace-frame">
            <div className="stage-screen">
              <WorkspaceDemo playing={running} reducedMotion={reducedMotion} loop onPhaseChange={setPhase} />
            </div>
            <figcaption className="workspace-bar">
              <button className="stage-expand" type="button" onClick={() => openDemo()} aria-label={home.interactiveOpen} title={home.interactiveOpen}>
                <Maximize2 size={15} aria-hidden="true" />
              </button>
              <ProductVideoLink title={home.videoTitle} label={home.videoPlay} subtitle={home.videoNote} className="workspace-watch">
                <span className="workspace-play-mark"><Play size={8} strokeWidth={1.6} fill="currentColor" aria-hidden="true" /></span>
                <span>{home.recording}</span>
                <span className="workspace-watch-time" aria-hidden="true">00:28</span>
              </ProductVideoLink>
              {motionAllowed && <button type="button" className="stage-motion-toggle" aria-label={paused ? home.motionPlay : home.motionPause}
                title={paused ? home.motionPlay : home.motionPause} aria-pressed={paused} onClick={() => {
                  setPaused(!paused)
                  scene.current?.style.removeProperty('--scene-x')
                  scene.current?.style.removeProperty('--scene-y')
                }}>
                {paused ? <Play size={13} fill="currentColor" aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
              </button>}
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="hero-results" role="group" aria-label={home.example}>
        <p className="hero-results-label">{home.example}</p>
        <div className="hero-output hero-output--sheet">
          <button type="button" onClick={() => openDemo('sheet')} aria-label={`${home.view}: ${home.previewSpreadsheet}`} className="hero-document hero-document--sheet">
            <span className="hero-document-type"><FileSpreadsheet size={20} strokeWidth={1.5} aria-hidden="true" />XLSX</span>
            <strong>{home.previewSpreadsheet}</strong>
            <ArrowDownRight className="hero-document-arrow" size={18} aria-hidden="true" />
            <span className="stage-file-ready" aria-hidden="true"><Check size={11} strokeWidth={2.2} /></span>
          </button>
        </div>
        <div className="hero-output hero-output--brief">
          <button type="button" onClick={() => openDemo('brief')} aria-label={`${home.view}: ${home.previewReport}`} className="hero-document hero-document--brief">
            <span className="hero-document-type"><FileText size={20} strokeWidth={1.5} aria-hidden="true" />PDF</span>
            <strong>{home.previewReport}</strong>
            <ArrowDownRight className="hero-document-arrow" size={18} aria-hidden="true" />
            <span className="stage-file-ready" aria-hidden="true"><Check size={11} strokeWidth={2.2} /></span>
          </button>
        </div>
      </div>
      <dialog ref={dialog} className="film-dialog workspace-demo-dialog" aria-label={home.interactiveTitle}
        onClick={(event) => { if (event.target === dialog.current) dialog.current?.close() }}
        onClose={() => { setDemoOpen(false); returnFocus.current?.focus({ preventScroll: true }) }}>
        <div className="film-window">
          <div className="film-top">
            <div><p>{home.interactiveTitle}</p><p className="film-muted">{home.interactiveNote}</p></div>
            <button className="header-icon film-close" onClick={() => dialog.current?.close()} type="button"><X size={20} aria-hidden="true" /><span className="sr-only">{nav.close}</span></button>
          </div>
          <WorkspaceDemo ref={fullDemo} playing={demoOpen && pageVisible} reducedMotion={reducedMotion} />
        </div>
      </dialog>
    </div>
  )
}
