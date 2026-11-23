import {
  ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileText, Layers3, Scale, Server, Star, Workflow,
} from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { Deliverables, GovernanceDetails, Hero, SectionHead } from './visuals'

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases
  return (
    <>
      <Hero
        kind="cases"
        title={[cases.titleOne, cases.titleTwo]}
        intro={[cases.introOne, cases.introTwo]}
        source={(
          <a className="bit-source detail-source-chip" href="#examples">
            <FileText size={15} aria-hidden="true" />
            <span>{cases.examplesNote}</span>
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        )}
      >
        <a className="btn" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </Hero>
      <section className="section" id="examples" aria-label={copy.nav.cases}>
        <div className="container">
          <div className="detail-case-list">
            {getUseCases(cases).map((example) => {
              const Icon = caseIcons[example.id]
              return (
                <article className={`bit-stage detail-case detail-case--${example.id}`} id={example.id} key={example.id}>
                  <div className="detail-case-copy">
                    <div className="detail-case-head">
                      <span className="detail-case-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.6} /></span>
                      <span className="chip detail-audience">{example.audience}</span>
                    </div>
                    <h2 className="h2">{example.title}</h2>
                    <p className="detail-case-body">{example.body}</p>
                    <div className="detail-output">
                      <FileText size={19} strokeWidth={1.5} aria-hidden="true" />
                      <div><strong>{cases.file}</strong><p>{example.output}</p></div>
                    </div>
                  </div>
                  <div className={`bit-stage-panel detail-inspector detail-inspector--${example.id}`}>
                    <div className="detail-inspector-bar">
                      <FileText size={15} aria-hidden="true" />
                      <span>{cases.file}</span>
                    </div>
                    {example.id === 'procurement' ? (
                      <div className="detail-inspector-body"><Deliverables /></div>
                    ) : example.id === 'reporting' ? (
                      <div className="detail-inspector-body detail-brief">
                        <p className="detail-brief-title"><ClipboardList size={18} aria-hidden="true" />{cases.briefFile}</p>
                        <ol className="detail-brief-points">
                          {[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((line, index) => (
                            <li key={line}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{line}</li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <div className="detail-inspector-body detail-reference">
                        <p className="detail-reference-question">{cases.question}</p>
                        <p className="detail-reference-answer">{cases.answer}</p>
                        <p className="detail-reference-source"><BookOpen size={15} aria-hidden="true" />{cases.reference}</p>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
      <section className="section" id="capability-sharing" aria-labelledby="handoff-title">
        <div className="container">
          <div className="bit-stage detail-sharing-stage">
            <div className="detail-sharing-copy">
              <h2 className="h2" id="handoff-title">{cases.handoff}</h2>
              <p>{cases.handoffBody}</p>
              <a className="btn detail-stage-cta" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="bit-stage-panel detail-sharing-window">
              <div className="detail-window-bar">
                <img src="/brand/linksense-icon.svg" alt="" width="20" height="20" />
                <span>{copy.home.share}</span>
              </div>
              <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function HostingPage() {
  const { copy, locale } = useSite()
  const hosting = copy.hosting
  const profiles = [
    { name: 'Core', icon: Workflow, title: hosting.core, body: hosting.coreBody, link: hosting.coreDocs, path: 'deploy/core/', full: false },
    { name: 'Full', icon: Layers3, title: hosting.full, body: hosting.fullBody, link: hosting.fullDocs, path: 'deploy/full/', full: true },
  ]
  return (
    <>
      <Hero
        kind="hosting"
        title={[hosting.titleOne, hosting.titleTwo]}
        intro={[hosting.introOne, hosting.introTwo]}
        source={(
          <a className="bit-source detail-source-chip" href={productLinks.github}>
            <Star size={15} aria-hidden="true" />
            <span>{hosting.source}</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      >
        <a className="btn" href="#profiles">{hosting.compare}<ArrowRight size={17} aria-hidden="true" /></a>
      </Hero>
      <section className="section" id="profiles" aria-labelledby="profiles-title">
        <div className="container">
          <SectionHead id="profiles-title" title={hosting.compare} body={hosting.compareBody} />
          <div className="bit-stage detail-compare">
            {profiles.map(({ name, icon: Icon, title, body, link, path, full }) => (
              <article className={`bit-stage-panel detail-profile${full ? ' detail-profile--full' : ''}`} key={name}>
                <div className="detail-profile-head">
                  <span className="detail-profile-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.6} /></span>
                  <h3 className="detail-profile-name">{name}</h3>
                </div>
                <p className="detail-profile-title">{title}</p>
                <p className="detail-profile-body">{body}</p>
                <p className="detail-profile-platform"><Server size={16} strokeWidth={1.5} aria-hidden="true" />{hosting.linux}</p>
                <a className="bit-window-link detail-profile-link" href={docsPath(locale, path)}>{link}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="governance" aria-labelledby="governance-title">
        <div className="container">
          <div className="bit-stage detail-governance">
            <h2 className="h2" id="governance-title">{hosting.governance}</h2>
            <GovernanceDetails />
            <div className="boundary detail-boundary">
              <h3>{hosting.boundaries}</h3>
              <p>{hosting.boundaryBody}</p>
              <a className="arrow-link" href={productLinks.security}>{hosting.security}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
