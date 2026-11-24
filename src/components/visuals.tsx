import {
  ArrowUpRight, ClipboardCheck, FileSpreadsheet, FileText, KeyRound, Layers3, Network, Server, Workflow,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useSite } from '../lib/use-site'
import { MaskedText, Reveal } from './cuberto-motion'

export function Hero({ kind, title, intro, children, details }: {
  kind: 'home' | 'cases' | 'hosting'
  title: [string, string]
  intro: [string, string]
  children?: ReactNode
  details?: ReactNode
}) {
  return (
    <section className={`hero hero--${kind}`}>
      <div className="shell hero-inner">
        <MaskedText as="h1" className="hero-title" enter>
          <span className="hero-line">{title[0]}</span>{' '}
          <span className="hero-line">{title[1]}</span>
        </MaskedText>
        <MaskedText as="p" className="hero-lead" enter delay={0.1}>{intro[0]} {intro[1]}</MaskedText>
        {children && <Reveal className="hero-actions" enter delay={0.4} distance={24}>{children}</Reveal>}
        {details && <Reveal className="hero-details" enter delay={0.55} distance={18}>{details}</Reveal>}
      </div>
    </section>
  )
}

export function SectionHead({ id, label, title, body, children, className }: {
  id?: string
  label?: string
  title: string | [string, string]
  body?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`section-head${label ? '' : ' section-head--full'}${className ? ` ${className}` : ''}`}>
      {label && <p className="label section-label">{label}</p>}
      <div className="section-head-main">
        <MaskedText as="h2" className="section-title" id={id}>
          {typeof title === 'string' ? title : <>{title[0]}<br />{title[1]}</>}
        </MaskedText>
        {body && <Reveal as="p" className="section-body" delay={0.1}>{body}</Reveal>}
        {children}
      </div>
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
    <div className="governance">
      <Reveal className="governance-figure" distance={40}>
        <figure className="hosting-diagram">
          <figcaption><Server size={18} strokeWidth={1.6} aria-hidden="true" />{hosting.deployment}</figcaption>
          <div className="deployment-inner">
            <div><Workflow size={22} strokeWidth={1.5} aria-hidden="true" />{hosting.workers}</div>
            <div><Layers3 size={22} strokeWidth={1.5} aria-hidden="true" />{hosting.capabilities}</div>
          </div>
          <span className="diagram-path" aria-hidden="true" />
          <div className="deployment-models"><Network size={18} strokeWidth={1.5} aria-hidden="true" />{hosting.models}</div>
        </figure>
      </Reveal>
      <dl className="governance-list">
        {controls.map(({ icon: Icon, title, body }, index) => (
          <Reveal as="div" className="governance-item" key={title} delay={index * 0.1} distance={40}>
            <dt><Icon size={19} strokeWidth={1.5} aria-hidden="true" />{title}</dt>
            <dd>{body}</dd>
          </Reveal>
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
