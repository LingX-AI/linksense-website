import { ArrowRight, ArrowUpRight, BookOpen, Check, ClipboardList, FileSpreadsheet, FileText, Quote, Scale } from 'lucide-react'
import { useState } from 'react'
import { getUseCases } from '../content'
import { useSite } from '../lib/use-site'
import { SiteLink } from './site-shell'

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

function ComparisonPaper() {
  const { copy: { home } } = useSite()
  return (
    <figure className="task-paper task-paper--comparison">
      <figcaption><FileSpreadsheet size={22} strokeWidth={1.5} aria-hidden="true" /><strong>{home.spreadsheet}</strong><span>XLSX</span></figcaption>
      <table className="task-comparison">
        <thead><tr><td /><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead>
        <tbody>
          <tr><th scope="row">{home.quoteLabel}</th><td>128k</td><td className="task-cell-highlight">119.8k</td><td>135k</td></tr>
          <tr><th scope="row">{home.leadTimeLabel}</th><td>14</td><td>21</td><td className="task-cell-highlight">10</td></tr>
        </tbody>
      </table>
      <div className="task-companion"><FileText size={18} strokeWidth={1.5} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></div>
      <p className="task-paper-note">{home.source}</p>
    </figure>
  )
}

function BriefPaper() {
  const { copy: { cases } } = useSite()
  return (
    <figure className="task-paper task-paper--brief">
      <figcaption><FileText size={22} strokeWidth={1.5} aria-hidden="true" /><strong>{cases.briefFile}</strong><span>DOCX</span></figcaption>
      <ol className="task-brief-sections">
        {[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((point, index) => (
          <li key={point}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><strong>{point}</strong><Check size={15} aria-hidden="true" /></li>
        ))}
      </ol>
    </figure>
  )
}

function AnswerPaper() {
  const { copy: { cases } } = useSite()
  return (
    <figure className="task-paper task-paper--answer">
      <Quote size={27} strokeWidth={1.5} className="task-quote-mark" aria-hidden="true" />
      <figcaption><strong>{cases.question}</strong></figcaption>
      <blockquote>{cases.answer}</blockquote>
      <div className="task-citation"><BookOpen size={16} aria-hidden="true" /><span>{cases.reference}</span><ArrowUpRight size={14} aria-hidden="true" /></div>
    </figure>
  )
}

export function ScenarioDeck() {
  const { copy: { home, cases } } = useSite()
  const [selected, setSelected] = useState('procurement')
  return (
    <section className="section scenario-section" aria-labelledby="scenarios-title">
      <div className="container">
        <div className="task-heading">
          <div className="task-heading-copy">
            <h2 className="h2" id="scenarios-title">{home.scenarios}</h2>
            <p>{home.scenariosBody}</p>
          </div>
          <SiteLink page="cases" className="arrow-link">{home.allCases}<ArrowRight size={16} aria-hidden="true" /></SiteLink>
        </div>
        <div className="task-deck" data-selected={selected}>
          {getUseCases(cases).map(({ id, title, output }) => {
            const Icon = caseIcons[id]
            const active = selected === id
            return (
              <article className={`task-folio task-folio--${id}`} data-selected={active} key={id}>
                <h3><button className="task-pick" type="button" aria-pressed={active} onClick={() => setSelected(id)} onFocus={() => setSelected(id)}>
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" /><span>{title}</span><span className="task-pick-indicator" aria-hidden="true"><Check size={14} /></span>
                </button></h3>
                <div className="task-artifact">
                  {id === 'procurement' ? <ComparisonPaper /> : id === 'reporting' ? <BriefPaper /> : <AnswerPaper />}
                </div>
                <div className="task-folio-foot">
                  <p>{output}</p>
                  <SiteLink page="cases" hash={id} className="task-workflow">{home.workflowLink}<ArrowUpRight size={17} aria-hidden="true" /></SiteLink>
                </div>
              </article>
            )
          })}
        </div>
        <p className="task-example-note">{cases.examplesNote}</p>
      </div>
    </section>
  )
}
