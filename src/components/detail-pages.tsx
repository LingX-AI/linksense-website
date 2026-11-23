import { ArrowRight, ArrowUpRight, BookOpen, FileText, Server, Share2, ShieldCheck } from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { Deliverables, GovernanceDetails, Hero, SectionHead } from './visuals'

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases
  return (
    <>
      <Hero
        kind="cases"
        title={[cases.titleOne, cases.titleTwo]}
        intro={[cases.introOne, cases.introTwo]}
        index={{ href: '#examples', label: cases.file }}
      >
        <a className="pill-link" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </Hero>
      <section className="case-work" id="examples" aria-labelledby="examples-title">
        <div className="container qclay-wrap">
          <div className="case-work-intro">
            <p className="chapter-number" aria-hidden="true">01</p>
            <div>
              <p className="eyebrow">{copy.nav.cases}</p>
              <h2 className="h2" id="examples-title">{copy.nav.cases}</h2>
              <p>{cases.examplesNote}</p>
            </div>
          </div>
          <div className="case-stories">
            {getUseCases(cases).map((example, index) => (
              <article className={`case-story case-story--${example.id}`} id={example.id} data-case={example.id} key={example.id}>
                <div className="case-story-head">
                  <div className="case-story-title">
                    <p className="case-ordinal" aria-hidden="true">0{index + 1}</p>
                    <div>
                      <p className="case-eyebrow">{example.audience}</p>
                      <h2 className="h2">{example.title}</h2>
                    </div>
                  </div>
                  <div className="case-story-copy">
                    <p>{example.body}</p>
                    <div className="case-output">
                      <FileText size={19} strokeWidth={1.5} aria-hidden="true" />
                      <div><strong>{cases.file}</strong><p>{example.output}</p></div>
                    </div>
                  </div>
                </div>
                <div className="case-story-media">
                  {example.id === 'procurement' && (
                    <figure className="case-photo">
                      <img src="/media/workspace.webp" alt={copy.home.workspaceAlt} width="1152" height="548" loading="lazy" decoding="async" />
                      <figcaption>{cases.examplesNote}</figcaption>
                    </figure>
                  )}
                  <div className={`case-stage case-stage--${example.id}`} data-art={example.id}>
                    <span className="case-stage-orbit" aria-hidden="true" />
                    {example.id === 'procurement' ? <Deliverables />
                      : example.id === 'reporting' ? (
                        <div className="paper-brief">
                          <FileText size={26} strokeWidth={1.4} aria-hidden="true" />
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="case-handoff" id="capability-sharing" aria-labelledby="handoff-title">
        <div className="container qclay-wrap">
          <div className="handoff-head">
            <p className="chapter-number" aria-hidden="true">04</p>
            <div>
              <p className="eyebrow">{copy.home.share}</p>
              <h2 className="h2" id="handoff-title">{cases.handoff}</h2>
            </div>
            <div className="handoff-copy">
              <p>{cases.handoffBody}</p>
              <a className="pill-link" href={productLinks.demo}>{copy.nav.demo}<ArrowRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="handoff-media">
            <figure className="handoff-primary">
              <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
            </figure>
            <figure className="handoff-secondary">
              <img src="/media/skills.webp" alt={copy.home.skillsAlt} width="1152" height="548" loading="lazy" decoding="async" />
            </figure>
            <span className="handoff-mark" aria-hidden="true"><Share2 size={24} strokeWidth={1.5} /></span>
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
    { name: 'Core', tone: 'core', title: hosting.core, body: hosting.coreBody, link: hosting.coreDocs, path: 'deploy/core/' },
    { name: 'Full', tone: 'full', title: hosting.full, body: hosting.fullBody, link: hosting.fullDocs, path: 'deploy/full/' },
  ]
  return (
    <>
      <Hero
        kind="hosting"
        title={[hosting.titleOne, hosting.titleTwo]}
        intro={[hosting.introOne, hosting.introTwo]}
        index={{ href: '#profiles', label: hosting.compare }}
      >
        <a className="pill-link" href={productLinks.github}>{hosting.source}<ArrowUpRight size={15} aria-hidden="true" /></a>
      </Hero>
      <section className="service-section" id="profiles" aria-labelledby="profiles-title">
        <div className="container qclay-wrap">
          <SectionHead id="profiles-title" title={hosting.compare} body={hosting.compareBody} />
          <div className="service-chapters">
            {profiles.map((item, index) => (
              <article className={`service-chapter service-chapter--${item.tone}`} data-profile={item.tone} key={item.name}>
                <p className="service-number" aria-hidden="true">0{index + 1}</p>
                <div className="service-name-block">
                  <p className="profile-name">{item.name}</p>
                  <div className="service-graphic" aria-hidden="true"><span /></div>
                </div>
                <div className="service-copy">
                  <h3 className="profile-title">{item.title}</h3>
                  <p className="profile-body">{item.body}</p>
                </div>
                <div className="service-foot">
                  <p className="profile-platform"><Server size={16} strokeWidth={1.5} aria-hidden="true" />{hosting.linux}</p>
                  <a className="pill-link" href={docsPath(locale, item.path)}>{item.link}<ArrowUpRight size={16} aria-hidden="true" /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="service-governance" id="governance" aria-labelledby="governance-title">
        <div className="container qclay-wrap">
          <div className="service-governance-head">
            <p className="chapter-number" aria-hidden="true">03</p>
            <h2 className="h2" id="governance-title">{hosting.governance}</h2>
            <span className="governance-rule" aria-hidden="true" />
          </div>
          <GovernanceDetails />
        </div>
      </section>
      <section className="boundary-section" id="boundaries" aria-labelledby="boundaries-title">
        <div className="container qclay-wrap boundary-spread">
          <div className="boundary-aside" aria-hidden="true"><ShieldCheck size={72} strokeWidth={1.15} /></div>
          <div className="boundary-body">
            <h2 className="h2" id="boundaries-title">{hosting.boundaries}</h2>
            <p>{hosting.boundaryBody}</p>
            <a className="pill-link" href={productLinks.security}>{hosting.security}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
