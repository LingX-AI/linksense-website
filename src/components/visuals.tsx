import { ClipboardCheck, FileSpreadsheet, FileText, KeyRound, Layers3, Network, Server, Workflow } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSite } from '../lib/use-site'

export function Hero({ kind, title, intro, visual, rail, afterActions, children }: {
  kind: 'home' | 'cases' | 'hosting'
  title: [string, string]
  intro: [string, string]
  visual: ReactNode
  rail?: ReactNode
  afterActions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={`hero hero--${kind}`} aria-labelledby="page-title">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="h1 hero-title" id="page-title">
            {title[0]}{' '}<span>{title[1]}</span>
          </h1>
          <p className="lead hero-lead">{intro[0]} {intro[1]}</p>
          <div className="hero-actions">{children}</div>
          {afterActions}
        </div>
        <div className="hero-visual">{visual}</div>
      </div>
      {rail}
    </section>
  )
}

export function SectionHead({ id, title, body }: { id: string; title: ReactNode; body?: string }) {
  return (
    <div className={`section-head${body ? '' : ' section-head--solo'}`}>
      <h2 className="h2" id={id}>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  )
}

export function FileList() {
  const { copy: { home } } = useSite()
  return (
    <ul aria-label={home.example} className="file-list">
      <li><FileSpreadsheet className="file-icon file-icon--sheet" size={20} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
      <li><FileText className="file-icon" size={20} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
    </ul>
  )
}

export function DeploymentDiagram({ variant = 'compact' }: { variant?: 'compact' | 'overview' }) {
  const { copy: { hosting } } = useSite()
  if (variant === 'overview') {
    return (
      <div className="deployment-map" role="group" aria-label={hosting.deployment}>
        <div className="deployment-map-zone">
          <p className="deployment-map-label"><Server size={18} strokeWidth={1.6} aria-hidden="true" />{hosting.deployment}</p>
          <div className="deployment-map-topology">
            <div className="deployment-map-node">
              <span><Workflow size={23} strokeWidth={1.6} aria-hidden="true" /></span>
              <strong>{hosting.workers}</strong>
            </div>
            <svg className="deployment-map-connection" viewBox="0 0 80 24" fill="none" aria-hidden="true">
              <path d="M2 12H78M70 4L78 12L70 20" />
            </svg>
            <div className="deployment-map-node">
              <span><Layers3 size={23} strokeWidth={1.6} aria-hidden="true" /></span>
              <strong>{hosting.capabilities}</strong>
            </div>
          </div>
        </div>
        <span className="deployment-map-exit" aria-hidden="true" />
        <div className="deployment-map-model"><Network size={21} strokeWidth={1.6} aria-hidden="true" /><strong>{hosting.models}</strong></div>
      </div>
    )
  }
  return (
    <div className="hosting-diagram" role="group" aria-label={hosting.deployment}>
      <div className="deployment-zone">
        <p className="deployment-label"><Server size={18} strokeWidth={1.6} aria-hidden="true" />{hosting.deployment}</p>
        <div className="deployment-inner">
          <div><Workflow size={21} strokeWidth={1.6} aria-hidden="true" />{hosting.workers}</div>
          <div><Layers3 size={21} strokeWidth={1.6} aria-hidden="true" />{hosting.capabilities}</div>
        </div>
      </div>
      <span className="diagram-path" aria-hidden="true" />
      <div className="deployment-models"><Network size={19} strokeWidth={1.6} aria-hidden="true" />{hosting.models}</div>
    </div>
  )
}

export function GovernanceDetails() {
  const { copy: { hosting } } = useSite()
  const controls = [
    { icon: Network, title: hosting.model, body: hosting.modelBody },
    { icon: KeyRound, title: hosting.access, body: hosting.accessBody },
    { icon: ClipboardCheck, title: hosting.oversight, body: hosting.oversightBody },
  ]
  return (
    <dl className="governance-list">
      {controls.map(({ icon: Icon, title, body }) => (
        <div key={title}>
          <dt><Icon size={20} strokeWidth={1.6} aria-hidden="true" />{title}</dt>
          <dd>{body}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Deliverables() {
  const { copy } = useSite()
  return (
    <figure className="case-sample">
      <figcaption>{copy.home.example}</figcaption>
      <FileList />
    </figure>
  )
}
