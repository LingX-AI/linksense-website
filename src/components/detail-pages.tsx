import { ArrowRight, ArrowUpRight, BookOpen, FileText, Server } from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { MaskedText, Reveal } from './cuberto-motion'
import { Deliverables, GovernanceDetails, Hero, SectionHead } from './visuals'

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases
  return (
    <>
      <Hero kind="cases" title={[cases.titleOne, cases.titleTwo]} intro={[cases.introOne, cases.introTwo]}>
        <a className="pill" href={productLinks.demo}>
          {copy.nav.demo}<ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </Hero>
      <section className="section cases" id="examples" aria-label={copy.nav.cases}>
        <div className="shell">
          <Reveal as="p" className="case-note">{cases.examplesNote}</Reveal>
          <div className="case-list">
            {getUseCases(cases).map((example, index) => (
              <article className="case-row" id={example.id} key={example.id}>
                <div className="case-copy">
                  <span className="case-index" aria-hidden="true">0{index + 1}</span>
                  <p className="case-eyebrow">{example.audience}</p>
                  <MaskedText as="h2" className="section-title case-title">{example.title}</MaskedText>
                  <Reveal as="p" className="case-body" delay={0.05}>{example.body}</Reveal>
                  <Reveal className="case-output" delay={0.1}>
                    <FileText size={19} strokeWidth={1.5} aria-hidden="true" />
                    <div><strong>{cases.file}</strong><p>{example.output}</p></div>
                  </Reveal>
                </div>
                <Reveal className={`case-art case-art--${example.id}`} distance={50}>
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
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="handoff on-night" id="capability-sharing" aria-labelledby="handoff-title">
        <div className="shell handoff-inner">
          <Reveal className="handoff-media" distance={40}>
            <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
          </Reveal>
          <div className="handoff-copy">
            <MaskedText as="h2" id="handoff-title" className="section-title">{cases.handoff}</MaskedText>
            <Reveal as="p" delay={0.1}>{cases.handoffBody}</Reveal>
            <Reveal delay={0.15}>
              <a className="pill pill--light" href={productLinks.demo}>
                {copy.nav.demo}<ArrowRight size={16} aria-hidden="true" />
              </a>
            </Reveal>
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
        <a className="pill" href="#profiles">{hosting.compare}<ArrowRight size={16} aria-hidden="true" /></a>
        <a className="pill pill--outline" href={productLinks.github}>
          {hosting.source}<ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </Hero>
      <section className="section" id="profiles">
        <div className="shell">
          <SectionHead id="profiles-title" title={hosting.compare} body={hosting.compareBody} />
          <div className="profile-grid">
            {profiles.map((item, index) => (
              <Reveal className={`profile-card${item.full ? ' profile-card--full' : ''}`} key={item.name} delay={index * 0.1} distance={50}>
                <span className="profile-index" aria-hidden="true">0{index + 1}</span>
                <p className="profile-name">{item.name}</p>
                <p className="profile-title">{item.title}</p>
                <p className="profile-body">{item.body}</p>
                <p className="profile-platform"><Server size={16} strokeWidth={1.5} aria-hidden="true" />{hosting.linux}</p>
                <a className="text-link" href={docsPath(locale, item.path)}>
                  {item.link}<ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="governance-section on-night" id="governance">
        <div className="shell">
          <MaskedText as="h2" id="governance-title" className="section-title">{hosting.governance}</MaskedText>
          <GovernanceDetails />
          <Reveal className="boundary" delay={0.1}>
            <h3>{hosting.boundaries}</h3>
            <p>{hosting.boundaryBody}</p>
            <a className="text-link" href={productLinks.security}>
              {hosting.security}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}
