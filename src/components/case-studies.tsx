import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ClipboardList, FileSpreadsheet, FileText, Quote, Scale } from 'lucide-react'
import { getUseCases } from '../content'
import { productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import './case-studies.css'

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }
type CaseExample = ReturnType<typeof getUseCases>[number]

function CaseCopy({ example }: { example: CaseExample }) {
  const { copy: { cases } } = useSite()
  return (
    <div className="cases-copy">
      <h2 className="h2" id={`${example.id}-title`}>{example.title}</h2>
      <p>{example.body}</p>
      <div className="cases-outcome">
        <span><Check size={16} aria-hidden="true" />{cases.file}</span>
        <p>{example.output}</p>
      </div>
    </div>
  )
}

function ComparisonResult() {
  const { copy: { home } } = useSite()
  return (
    <div className="cases-comparison-stage">
      <figure className="cases-sheet cases-sheet--comparison">
        <figcaption className="cases-file-heading">
          <span className="cases-file-icon"><FileSpreadsheet size={22} strokeWidth={1.6} aria-hidden="true" /></span>
          <strong>{home.spreadsheet}</strong><small>XLSX</small>
        </figcaption>
        <table className="cases-comparison-table">
          <caption className="sr-only">{home.spreadsheet}</caption>
          <thead><tr><td /><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead>
          <tbody>
            <tr><th scope="row">{home.quoteLabel}</th><td>128k</td><td className="cases-cell-best">119.8k</td><td>135k</td></tr>
            <tr><th scope="row">{home.leadTimeLabel}</th><td>14</td><td>21</td><td className="cases-cell-best">10</td></tr>
          </tbody>
        </table>
        <p className="cases-example-label">{home.source}</p>
      </figure>
      <div className="cases-companion-file">
        <FileText size={22} strokeWidth={1.6} aria-hidden="true" />
        <strong>{home.report}</strong><small>DOCX</small>
      </div>
    </div>
  )
}

function BriefResult() {
  const { copy: { cases } } = useSite()
  return (
    <div className="cases-result-stage cases-result-stage--brief">
      <figure className="cases-sheet cases-sheet--brief">
        <figcaption className="cases-file-heading">
          <span className="cases-file-icon"><FileText size={22} strokeWidth={1.6} aria-hidden="true" /></span>
          <strong>{cases.briefFile}</strong><small>DOCX</small>
        </figcaption>
        <ul className="cases-brief-content">
          {[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((point) => (
            <li key={point}><Check size={17} aria-hidden="true" /><span>{point}</span></li>
          ))}
        </ul>
      </figure>
    </div>
  )
}

function KnowledgeResult() {
  const { copy: { cases } } = useSite()
  return (
    <div className="cases-result-stage cases-result-stage--knowledge">
      <figure className="cases-sheet cases-sheet--answer">
        <figcaption><Quote size={25} strokeWidth={1.5} aria-hidden="true" /><strong>{cases.question}</strong></figcaption>
        <blockquote>{cases.answer}</blockquote>
        <p className="cases-citation"><BookOpen size={18} aria-hidden="true" /><span>{cases.reference}</span></p>
      </figure>
    </div>
  )
}

export function CasesPage() {
  const { copy: { cases, nav } } = useSite()
  const examples = getUseCases(cases)
  const [procurement, reporting, knowledge] = examples
  return (
    <div className="cases-page">
      <section className="cases-hero hero--cases" aria-labelledby="page-title">
        <div className="container">
          <div className="cases-hero-copy">
            <h1 className="h1 cases-hero-title" id="page-title">{cases.titleOne}{' '}<span>{cases.titleTwo}</span></h1>
            <p>{cases.introOne}<br className="cases-intro-break" />{cases.introTwo}</p>
            <a className="btn" href={productLinks.demo}>{nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <nav className="cases-directory" aria-label={nav.cases}>
            {examples.map(({ id, audience, title }) => {
              const Icon = caseIcons[id]
              return (
                <a href={`#${id}`} key={id}>
                  <span className="cases-directory-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span><small>{audience}</small><strong>{title}</strong></span>
                  <ArrowDown size={17} aria-hidden="true" />
                </a>
              )
            })}
          </nav>
        </div>
      </section>

      <section className="cases-examples" id="examples" aria-label={nav.cases}>
        <div className="container">
          <article className="cases-feature" id="procurement" aria-labelledby="procurement-title">
            <CaseCopy example={procurement} />
            <ComparisonResult />
          </article>
          <div className="cases-pair">
            <article className="cases-study" id="reporting" aria-labelledby="reporting-title">
              <CaseCopy example={reporting} />
              <BriefResult />
            </article>
            <article className="cases-study" id="knowledge" aria-labelledby="knowledge-title">
              <CaseCopy example={knowledge} />
              <KnowledgeResult />
            </article>
          </div>
          <p className="cases-disclosure">{cases.examplesNote}</p>
        </div>
      </section>

      <section className="cases-handoff" id="capability-sharing" aria-labelledby="handoff-title">
        <div className="container">
          <div className="cases-handoff-inner">
            <div className="cases-handoff-copy">
              <h2 className="h2" id="handoff-title">{cases.handoff}</h2>
              <p>{cases.handoffBody}</p>
              <a className="arrow-link" href={productLinks.demo}>{nav.demo}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
            <figure className="cases-handoff-visual">
              <img src="/media/figma-apps.webp" alt={cases.appAlt} width="1440" height="900" loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  )
}
