import { ArrowRight, ArrowUpRight, Braces, FileText, LayoutGrid, LibraryBig, Mail, Network, Play, Puzzle, Share2, Workflow } from 'lucide-react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { docsPath } from '../lib/site'
import { useSite } from '../lib/use-site'
import { ProductVideoLink } from './media'
import { SiteLink } from './site-shell'

export function TeamCapabilities() {
  const { copy: { home }, locale } = useSite()
  const [selected, setSelected] = useState(0)
  const choices = useRef<(HTMLButtonElement | null)[]>([])
  const sharing = selected === 0
  const modes = [
    { title: home.share, body: home.shareBody, icon: Share2, screen: 'skills', alt: home.skillsAlt },
    { title: home.connect, body: home.connectBody, icon: Network, screen: 'connections', alt: home.connectionsAlt },
  ] as const
  const current = modes[selected] ?? modes[0]
  const resources = sharing
    ? [
      { name: home.previewSkills, icon: Workflow, tone: 'violet' },
      { name: home.capabilityKnowledge, icon: LibraryBig, tone: 'amber' },
      { name: home.capabilityPlugins, icon: Puzzle, tone: 'teal' },
      { name: home.previewApps, icon: LayoutGrid, tone: 'blue' },
    ]
    : [
      { name: home.capabilityMail, icon: Mail, tone: 'blue' },
      { name: home.capabilityDocuments, icon: FileText, tone: 'amber' },
      { name: 'MCP', icon: Braces, tone: 'teal' },
    ]

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    let next: number
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (selected + 1) % modes.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (selected + modes.length - 1) % modes.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = modes.length - 1
    else return
    event.preventDefault()
    choices.current[next]?.focus()
  }

  return (
    <section className="section team-section" aria-labelledby="team-title">
      <div className="container">
        <div className="team-heading">
          <h2 className="h2" id="team-title">{home.teamTitle}</h2>
          <p>{home.teamBody}</p>
        </div>
        <div className="capability-studio" data-mode={sharing ? 'share' : 'connect'}>
          <div className="studio-controls">
            <div className="studio-choices" role="tablist" aria-label={home.teamTitle} aria-orientation="vertical" onKeyDown={navigate}>
              {modes.map(({ title, body, icon: Icon }, index) => (
                <button key={title} type="button" role="tab" id={`capability-tab-${index}`}
                  aria-selected={selected === index} aria-controls="capability-panel" aria-label={title}
                  tabIndex={selected === index ? 0 : -1} className="studio-choice"
                  ref={(element) => { choices.current[index] = element }} onClick={() => setSelected(index)} onFocus={() => setSelected(index)}>
                  <span className="studio-choice-heading"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /><strong>{title}</strong><ArrowUpRight size={17} aria-hidden="true" /></span>
                  <span className="studio-choice-body">{body}</span>
                </button>
              ))}
            </div>
            <div className="studio-learn">
              {sharing
                ? <SiteLink page="cases" hash="capability-sharing" className="arrow-link">{home.workflowLink}<ArrowRight size={17} aria-hidden="true" /></SiteLink>
                : <a className="arrow-link" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}>{home.workflowLink}<ArrowUpRight size={17} aria-hidden="true" /></a>}
            </div>
          </div>
          <div className="studio-scene" id="capability-panel" role="tabpanel" aria-labelledby={`capability-tab-${selected}`}>
            <svg className="studio-route" key={`route-${current.screen}`} viewBox="0 0 800 560" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path d="M50 430H105Q135 430 135 400V160Q135 130 165 130H700" />
              <path className="studio-route-signal" pathLength="1" d="M50 430H105Q135 430 135 400V160Q135 130 165 130H700" />
            </svg>
            <div className="studio-product" key={current.screen}>
              <ProductVideoLink title={home.videoTitle} label={home.videoPlay} subtitle={home.videoNote} className="studio-screen">
                <img src={`/media/figma-${current.screen}.webp`} alt={current.alt} width="1440" height="900" loading="lazy" decoding="async" />
                <span className="studio-screen-action"><Play size={15} fill="currentColor" aria-hidden="true" />{home.videoPlay}</span>
              </ProductVideoLink>
            </div>
            <div className="studio-resource-fan" key={sharing ? 'capabilities' : 'tools'} aria-hidden="true">
              {resources.map(({ name, icon: Icon, tone }, index) => (
                <div className={`studio-resource studio-resource--${index}`} key={name}>
                  <span className="studio-resource-icon" data-tone={tone}><Icon size={26} strokeWidth={1.8} /></span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
