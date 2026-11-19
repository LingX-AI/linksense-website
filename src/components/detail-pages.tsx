import { ArrowRight, ArrowUpRight, BookOpen, FileText, Server } from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { Deliverables, GovernanceDetails, Hero, SectionHead } from './visuals'

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases
  return (
    <>
      <Hero kind="cases" title={[cases.titleOne, cases.titleTwo]} intro={[cases.introOne, cases.introTwo]}>
        <a className="btn" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </Hero>
      <section className="section" id="examples" aria-label={copy.nav.cases}>
        <div className="container">
          <p className="case-note">{cases.examplesNote}</p>
          {getUseCases(cases).map((example) => (
            <article className="case-row" id={example.id} key={example.id}>
              <div className="case-copy">
                <p className="case-eyebrow">{example.audience}</p>
                <h2 className="h2">{example.title}</h2>
                <p>{example.body}</p>
                <div className="case-output"><FileText size={19} strokeWidth={1.5} aria-hidden="true" /><div><strong>{cases.file}</strong><p>{example.output}</p></div></div>
              </div>
              <div className={`case-art case-art--${example.id}`}>
                {example.id === 'procurement' ? <Deliverables />
                  : example.id === 'reporting' ? (
                    <div className="paper-brief" aria-hidden="true">
                      <FileText size={26} strokeWidth={1.4} />
                      <strong>{cases.briefFile}</strong>
                      <ol>{[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((line) => <li key={line}>{line}</li>)}</ol>
                    </div>
                  ) : (
                    <div className="source-note">
                      <BookOpen size={26} strokeWidth={1.4} aria-hidden="true" />
                      <strong>{cases.question}</strong>
                      <p>{cases.answer}</p>
                      <span>{cases.reference}</span>
                    </div>
                  )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section--soft" id="capability-sharing" aria-labelledby="handoff-title">
        <div className="container handoff">
          <div className="handoff-image">
            <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
          </div>
          <div>
            <h2 className="h2" id="handoff-title">{cases.handoff}</h2>
            <p className="handoff-body">{cases.handoffBody}</p>
            <a className="arrow-link" href={productLinks.demo}>{copy.nav.demo}<ArrowRight size={16} aria-hidden="true" /></a>
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
    { name: 'Core', title: hosting.core, body: hosting.coreBody, link: hosting.coreDocs, path: 'deploy/core/', full: false },
    { name: 'Full', title: hosting.full, body: hosting.fullBody, link: hosting.fullDocs, path: 'deploy/full/', full: true },
  ]
  return (
    <>
      <Hero kind="hosting" title={[hosting.titleOne, hosting.titleTwo]} intro={[hosting.introOne, hosting.introTwo]}>
        <a className="btn" href="#profiles">{hosting.compare}<ArrowRight size={17} aria-hidden="true" /></a>
        <a className="btn btn--secondary" href={productLinks.github}>{hosting.source}<ArrowUpRight size={15} aria-hidden="true" /></a>
      </Hero>
      <section className="section" id="profiles">
        <div className="container">
          <SectionHead id="profiles-title" title={hosting.compare} body={hosting.compareBody} />
          <div className="profile-grid">
            {profiles.map((item) => (
              <article className={`profile-card${item.full ? ' profile-card--full' : ''}`} key={item.name}>
                <p className="profile-name">{item.name}</p>
                <p className="profile-title">{item.title}</p>
                <p className="profile-body">{item.body}</p>
                <p className="profile-platform"><Server size={16} strokeWidth={1.5} aria-hidden="true" />{hosting.linux}</p>
                <a className="arrow-link" href={docsPath(locale, item.path)}>{item.link}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft" id="governance">
        <div className="container">
          <div className="section-head">
            <h2 className="h2" id="governance-title">{hosting.governance}</h2>
          </div>
          <GovernanceDetails />
          <div className="boundary">
            <h3>{hosting.boundaries}</h3>
            <p>{hosting.boundaryBody}</p>
            <a className="arrow-link" href={productLinks.security}>{hosting.security}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
