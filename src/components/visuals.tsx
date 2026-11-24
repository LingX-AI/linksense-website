import {
  ArrowUpRight, ClipboardCheck, FileSpreadsheet, FileText, KeyRound, Layers3, Network, Server, Workflow,
} from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { useMotionAccent, type MotionAccentStep } from '../lib/motion-accent'
import { useSite } from '../lib/use-site'

const deliverableMotion: readonly MotionAccentStep[] = [
  { selector: '.sheet-spreadsheet', from: 'translate(10px, 6px)', duration: 0.4 },
  { selector: '.sheet-report', from: 'translate(-11px, -6px)', duration: 0.44, delay: 0.06 },
]

export function PageIntro({ kind, title, intro, source, children }: {
  kind: 'cases' | 'hosting'
  title: [string, string]
  intro: [string, string]
  source?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className={`page-intro page-intro--${kind}`}>
      <div className="container page-intro-grid">
        <div className="page-intro-main">
          {source && <div className="page-intro-source">{source}</div>}
          <h1 className="page-title">
            <span>{title[0]}</span>{' '}
            <span className="page-title-accent">{title[1]}</span>
          </h1>
          <p className="page-intro-body">{intro[0]} {intro[1]}</p>
        </div>
        {children && <div className="page-intro-actions">{children}</div>}
      </div>
    </section>
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
        <figcaption><Server size={17} strokeWidth={1.6} aria-hidden="true" />{hosting.deployment}</figcaption>
        <div className="deployment-inner">
          <div><Workflow size={21} strokeWidth={1.6} aria-hidden="true" />{hosting.workers}</div>
          <div><Layers3 size={21} strokeWidth={1.6} aria-hidden="true" />{hosting.capabilities}</div>
        </div>
        <span className="diagram-path" aria-hidden="true" />
        <div className="deployment-models"><Network size={17} strokeWidth={1.6} aria-hidden="true" />{hosting.models}</div>
      </figure>
      <dl className="governance-list">
        {controls.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <dt><Icon size={18} strokeWidth={1.6} aria-hidden="true" />{title}</dt>
            <dd>{body}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Deliverables() {
  const { copy } = useSite()
  const artRef = useRef<HTMLDivElement>(null)

  useMotionAccent(artRef, deliverableMotion)

  return (
    <div ref={artRef} className="deliverable-art" role="img" aria-label={`${copy.home.example}: ${copy.home.spreadsheet}, ${copy.home.report}`}>
      <div className="document-sheet sheet-spreadsheet" aria-hidden="true">
        <div className="sheet-label"><FileSpreadsheet size={15} /> .XLSX</div>
        <strong>{copy.home.spreadsheet}</strong>
        <div className="sheet-grid">
          {[['A', '124', '08'], ['B', '153', '12'], ['C', '131', '10']].map(([label, amount, days]) =>
            <div key={label}><span>{label}</span><span>{amount}</span><span>{days}</span></div>,
          )}
        </div>
      </div>
      <div className="document-sheet sheet-report" aria-hidden="true">
        <div className="sheet-label"><FileText size={15} /> .DOCX</div>
        <strong>{copy.home.report}</strong>
        <div className="sheet-text" />
        <div className="sheet-text" />
        <div className="sheet-text" />
        <ArrowUpRight size={15} className="sheet-corner" />
      </div>
      <small>{copy.home.example}</small>
    </div>
  )
}
