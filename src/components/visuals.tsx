import { ArrowDown, ArrowUpRight, FileSpreadsheet, FileText } from 'lucide-react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useSite } from '../lib/use-site'

export function MaskedLines({ as: Element, className, id, lines, enter = false }: {
  as: 'h1' | 'h2' | 'p'
  className?: string
  id?: string
  lines: readonly string[]
  enter?: boolean
}) {
  const target = useRef<HTMLElement | null>(null)
  const visible = useInView(target, { once: true, margin: '0px 0px -12% 0px' })

  return (
    <Element
      ref={(node) => { target.current = node }}
      className={className}
      id={id}
      data-line-reveal={enter || visible ? '' : undefined}
    >
      {lines.map((line) => <span className="line-mask" key={line}><span>{line}</span></span>)}
    </Element>
  )
}

export function Hero({ kind, title, intro, children, target }: {
  kind: 'home' | 'cases' | 'hosting'
  title: [string, string]
  intro: [string, string]
  children?: ReactNode
  target?: string
}) {
  const { copy } = useSite()
  const targetLabel = kind === 'cases' ? copy.nav.cases : copy.hosting.compare
  return (
    <section className={`hero hero--${kind}`}>
      <div className="hero-canvas" aria-hidden="true">
        <img
          src="/media/signal.webp"
          alt=""
          width="1620"
          height="1000"
          fetchPriority={kind === 'home' ? 'high' : 'auto'}
          decoding="async"
        />
      </div>
      <div className="hero-content site-gutter">
        <MaskedLines as="h1" className="hero-title" lines={title} enter />
        <MaskedLines as="p" className="hero-intro" lines={intro} enter />
        <div className="hero-bottom">
          {target && <a className="down-link" href={`#${target}`} aria-label={targetLabel}>
            <ArrowDown size={22} strokeWidth={1.35} aria-hidden="true" />
          </a>}
          <div className="hero-actions">{children}</div>
        </div>
        {kind === 'home' && <p className="hero-note">{copy.footer.source}</p>}
      </div>
    </section>
  )
}

export function Deliverables() {
  const { copy } = useSite()
  return (
    <div className="deliverable-art" role="img" aria-label={`${copy.home.example}: ${copy.home.spreadsheet}, ${copy.home.report}`}>
      <div className="document-sheet sheet-spreadsheet" aria-hidden="true">
        <div className="sheet-label"><FileSpreadsheet size={20} /> .XLSX</div>
        <strong>{copy.home.spreadsheet}</strong>
        <div className="sheet-grid">
          {[['A', '124', '08'], ['B', '153', '12'], ['C', '131', '10']].map(([label, amount, days]) =>
            <div key={label}><span>{label}</span><span>{amount}</span><span>{days}</span></div>,
          )}
        </div>
      </div>
      <div className="document-sheet sheet-report" aria-hidden="true">
        <div className="sheet-label"><FileText size={20} /> .DOCX</div>
        <strong>{copy.home.report}</strong>
        <div className="sheet-text" />
        <div className="sheet-text" />
        <div className="sheet-text" />
        <ArrowUpRight size={20} className="sheet-corner" />
      </div>
      <small>{copy.home.example}</small>
    </div>
  )
}
