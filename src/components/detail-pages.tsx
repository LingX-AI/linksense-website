import { ArrowUpRight, BookOpen, FileText, Layers3, Network, Server, Workflow } from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { CircleArrow } from './site-shell'
import { Deliverables, Hero, MaskedLines } from './visuals'

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases
  return (
    <>
      <Hero kind="cases" title={[cases.titleOne, cases.titleTwo]} intro={[cases.introOne, cases.introTwo]} target="examples">
        <a className="primary-action" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </Hero>
      <section className="case-section site-gutter" id="examples" aria-label={copy.nav.cases}>
        <p className="case-examples-note">{cases.examplesNote}</p>
        {getUseCases(cases).map((example) => (
          <article className="case-row" id={example.id} key={example.id}>
            <div className="case-text">
              <p className="case-kicker">{example.audience}</p>
              <MaskedLines as="h2" className="detail-heading" lines={[example.title]} />
              <p>{example.body}</p>
              <div className="case-output"><FileText size={20} strokeWidth={1.5} aria-hidden="true" /><div><strong>{cases.file}</strong><p>{example.output}</p></div></div>
            </div>
            <div className={`case-art case-art--${example.id}`}>
              {example.id === 'procurement' ? <Deliverables />
                : example.id === 'reporting' ? (
                  <div className="paper-brief" aria-hidden="true">
                    <FileText size={29} strokeWidth={1.4} />
                    <strong>{cases.briefFile}</strong>
                    <ol>{[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((line) => <li key={line}>{line}</li>)}</ol>
                  </div>
                ) : (
                  <div className="source-note">
                    <BookOpen size={28} strokeWidth={1.4} aria-hidden="true" />
                    <strong>{cases.question}</strong>
                    <p>{cases.answer}</p>
                    <span>{cases.reference}</span>
                  </div>
                )}
            </div>
          </article>
        ))}
      </section>
      <section className="case-handoff site-gutter" id="capability-sharing">
        <div className="handoff-image">
          <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
        </div>
        <div className="handoff-text">
          <MaskedLines as="h2" className="detail-heading" lines={[cases.handoff]} />
          <p>{cases.handoffBody}</p>
          <a className="text-action mt-7 w-fit" href={productLinks.demo}><span>{copy.nav.demo}</span><CircleArrow diagonal /></a>
        </div>
      </section>
    </>
  )
}

function HostingDiagram() {
  const { copy } = useSite()
  const hosting = copy.hosting
  return (
    <figure className="hosting-diagram">
      <figcaption><Server size={20} strokeWidth={1.5} aria-hidden="true" />{hosting.deployment}</figcaption>
      <div className="deployment-inner">
        <div><Workflow size={21} strokeWidth={1.5} aria-hidden="true" />{hosting.workers}</div>
        <div><Layers3 size={21} strokeWidth={1.5} aria-hidden="true" />{hosting.capabilities}</div>
      </div>
      <span className="diagram-path" aria-hidden="true" />
      <div className="deployment-models"><Network size={21} strokeWidth={1.5} aria-hidden="true" />{hosting.models}</div>
    </figure>
  )
}

export function HostingPage() {
  const { copy, locale } = useSite()
  const hosting = copy.hosting
  const profiles = [
    { name: 'Core', title: hosting.core, body: hosting.coreBody, link: hosting.coreDocs, path: 'deploy/core/' },
    { name: 'Full', title: hosting.full, body: hosting.fullBody, link: hosting.fullDocs, path: 'deploy/full/' },
  ]
  return (
    <>
      <Hero kind="hosting" title={[hosting.titleOne, hosting.titleTwo]} intro={[hosting.introOne, hosting.introTwo]} target="profiles">
        <a className="primary-action" href="#profiles">{hosting.compare}<ArrowUpRight size={17} aria-hidden="true" /></a>
        <a className="hero-secondary" href={productLinks.github}>{hosting.source}<ArrowUpRight size={15} aria-hidden="true" /></a>
      </Hero>
      <section className="hosting-profiles site-gutter" id="profiles">
        <div className="editorial-intro">
          <MaskedLines as="h2" className="section-title" lines={[hosting.compare]} />
          <p>{hosting.compareBody}</p>
        </div>
        <div className="profile-grid">
          {profiles.map((item) => (
            <article className="profile" key={item.name}>
              <h3>{item.name}</h3>
              <p className="profile-title">{item.title}</p>
              <p className="profile-body">{item.body}</p>
              <p className="profile-platform"><Server size={18} strokeWidth={1.5} aria-hidden="true" />{hosting.linux}</p>
              <a className="text-action w-fit" href={docsPath(locale, item.path)}><span>{item.link}</span><CircleArrow diagonal /></a>
            </article>
          ))}
        </div>
      </section>
      <section className="hosting-governance site-gutter" id="governance">
        <MaskedLines as="h2" className="section-title" lines={[hosting.governance]} />
        <div className="governance-grid">
          <dl>
            <div><dt>{hosting.model}</dt><dd>{hosting.modelBody}</dd></div>
            <div><dt>{hosting.access}</dt><dd>{hosting.accessBody}</dd></div>
            <div><dt>{hosting.oversight}</dt><dd>{hosting.oversightBody}</dd></div>
          </dl>
          <HostingDiagram />
        </div>
        <div className="boundary">
          <h3>{hosting.boundaries}</h3>
          <p>{hosting.boundaryBody}</p>
          <a className="text-action w-fit" href={productLinks.security}><span>{hosting.security}</span><CircleArrow diagonal /></a>
        </div>
      </section>
    </>
  )
}
