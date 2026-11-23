import { ArrowDown, ArrowUpRight, ClipboardCheck, FileSpreadsheet, FileText, KeyRound, Layers3, Network, Server, Workflow } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSite } from '../lib/use-site'

export function Hero({ kind, title, intro, index, children }: {
  kind: 'cases' | 'hosting'
  title: [string, string]
  intro: [string, string]
  index?: { href: string; label: string }
  children?: ReactNode
}) {
  return (
    <section className={`hero hero--${kind}`} aria-labelledby={`${kind}-title`}>
      <div className="container qclay-wrap qclay-detail-hero">
        <div className="qclay-hero-heading qclay-detail-heading">
          <h1 className="h1 qclay-title qclay-detail-title" id={`${kind}-title`}>
            <span className="block">{title[0]}</span>{' '}
            <span className="block text-accent">{title[1]}</span>
          </h1>
          {index && (
            <a className="qclay-index" href={index.href}>
              <span className="qclay-index-orbit" aria-hidden="true"><ArrowDown size={34} strokeWidth={1.4} /></span>
              <span>{index.label}</span>
            </a>
          )}
        </div>
        <div className="qclay-hero-meta qclay-detail-meta">
          <p className="lead">{intro[0]} {intro[1]}</p>
          <div className="hero-actions qclay-detail-actions">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function SectionHead({ id, title, body }: { id?: string; title: string | [string, string]; body: string }) {
  return (
    <div className="section-head">
      <h2 className="h2" id={id}>
        {typeof title === 'string' ? title : <>{title[0]}<br />{title[1]}</>}
      </h2>
      <p>{body}</p>
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
    <div className="governance-grid">
      <figure className="hosting-diagram">
        <figcaption><Server size={18} strokeWidth={1.6} aria-hidden="true" />{hosting.deployment}</figcaption>
        <div className="deployment-inner">
          <div><Workflow size={22} strokeWidth={1.6} aria-hidden="true" />{hosting.workers}</div>
          <div><Layers3 size={22} strokeWidth={1.6} aria-hidden="true" />{hosting.capabilities}</div>
        </div>
        <span className="diagram-path" aria-hidden="true" />
        <div className="deployment-models"><Network size={18} strokeWidth={1.6} aria-hidden="true" />{hosting.models}</div>
      </figure>
      <dl className="governance-list">
        {controls.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <dt><Icon size={19} strokeWidth={1.6} aria-hidden="true" />{title}</dt>
            <dd>{body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Deliverables() {
  const { copy } = useSite()
  return (
    <div className="deliverable-art" role="img" aria-label={`${copy.home.example}: ${copy.home.spreadsheet}, ${copy.home.report}`}>
      <div className="document-sheet sheet-spreadsheet" aria-hidden="true">
        <div className="sheet-label"><FileSpreadsheet size={16} /> .XLSX</div>
        <strong>{copy.home.spreadsheet}</strong>
        <div className="sheet-grid">
          {[['A', '124', '08'], ['B', '153', '12'], ['C', '131', '10']].map(([label, amount, days]) =>
            <div key={label}><span>{label}</span><span>{amount}</span><span>{days}</span></div>,
          )}
        </div>
      </div>
      <div className="document-sheet sheet-report" aria-hidden="true">
        <div className="sheet-label"><FileText size={16} /> .DOCX</div>
        <strong>{copy.home.report}</strong>
        <div className="sheet-text" />
        <div className="sheet-text" />
        <div className="sheet-text" />
        <ArrowUpRight size={16} className="sheet-corner" />
      </div>
      <small>{copy.home.example}</small>
    </div>
  )
}
