import {
  ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileText, Scale, Server,
} from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { Deliverables, GovernanceDetails, Hero } from './visuals'

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

function StoryVisual({ id }: { id: 'procurement' | 'reporting' | 'knowledge' }) {
  const { copy } = useSite()
  const { cases, home } = copy

  if (id === 'procurement') {
    return (
      <div className="exo-detail-visual exo-detail-visual--procurement">
        <figure className="exo-detail-shot exo-detail-shot--wide">
          <img src="/media/workspace-result.webp" alt={home.workspaceAlt} width="1440" height="684"
            loading="lazy" decoding="async" />
        </figure>
        <div className="exo-detail-inset">
          <Deliverables />
        </div>
      </div>
    )
  }

  if (id === 'reporting') {
    return (
      <div className="exo-detail-visual exo-detail-visual--reporting">
        <figure className="exo-detail-shot exo-detail-shot--tall">
          <img src="/media/connections.webp" alt={home.connectionsAlt} width="1152" height="548"
            loading="lazy" decoding="async" />
        </figure>
        <div className="exo-detail-paper" aria-hidden="true">
          <div className="paper-brief">
            <FileText size={26} strokeWidth={1.4} />
            <strong>{cases.briefFile}</strong>
            <ol>{[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((line) => <li key={line}>{line}</li>)}</ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="exo-detail-visual exo-detail-visual--knowledge">
      <div className="exo-detail-source">
        <div className="source-note">
          <BookOpen size={26} strokeWidth={1.4} aria-hidden="true" />
          <strong>{cases.question}</strong>
          <p>{cases.answer}</p>
          <span>{cases.reference}</span>
        </div>
      </div>
      <figure className="exo-detail-shot exo-detail-shot--wide">
        <img src="/media/skills.webp" alt={home.skillsAlt} width="1152" height="548"
          loading="lazy" decoding="async" />
      </figure>
    </div>
  )
}

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases
  const home = copy.home

  return (
    <>
      <Hero kind="cases" title={[cases.titleOne, cases.titleTwo]} intro={[cases.introOne, cases.introTwo]}>
        <a className="btn" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
      </Hero>

      <section className="exo-detail exo-detail--cases" id="examples" aria-labelledby="examples-title">
        <div className="exo-detail-frame">
          <header className="exo-detail-lede">
            <div>
              <p className="exo-detail-label">01 / {copy.nav.cases}</p>
              <h2 className="exo-detail-display" id="examples-title">{home.scenarios}</h2>
            </div>
            <p className="exo-detail-note">{cases.examplesNote}</p>
          </header>

          <div className="exo-detail-stories">
            {getUseCases(cases).map((example, index) => {
              const Icon = caseIcons[example.id]
              return (
                <article className={`exo-detail-story exo-detail-story--${example.id}`} id={example.id} key={example.id}>
                  <header className="exo-detail-story-head">
                    <p className="exo-detail-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                    <p className="exo-detail-label">
                      <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                      {example.audience}
                    </p>
                    <h3 className="exo-detail-story-title" id={`${example.id}-title`}>{example.title}</h3>
                    <p className="exo-detail-story-body">{example.body}</p>
                    <div className="exo-detail-output">
                      <p className="exo-detail-label">{cases.file}</p>
                      <p>{example.output}</p>
                    </div>
                  </header>
                  <StoryVisual id={example.id} />
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="exo-detail exo-detail--handoff" id="capability-sharing" aria-labelledby="handoff-title">
        <div className="exo-detail-frame exo-detail-handoff">
          <div className="exo-detail-handoff-media">
            <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548"
              loading="lazy" decoding="async" />
          </div>
          <div className="exo-detail-handoff-copy">
            <p className="exo-detail-number" aria-hidden="true">04</p>
            <p className="exo-detail-label">{home.share}</p>
            <h2 className="exo-detail-display" id="handoff-title">{cases.handoff}</h2>
            <p className="exo-detail-handoff-body">{cases.handoffBody}</p>
            <a className="exo-detail-cta" href={productLinks.demo}>
              {copy.nav.demo}<ArrowRight size={16} aria-hidden="true" />
            </a>
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

      <section className="exo-detail exo-detail--profiles" id="profiles" aria-labelledby="profiles-title">
        <div className="exo-detail-frame">
          <header className="exo-detail-lede exo-detail-lede--split">
            <div>
              <p className="exo-detail-label">01 / {hosting.deployment}</p>
              <h2 className="exo-detail-display" id="profiles-title">{hosting.compare}</h2>
            </div>
            <p className="exo-detail-note">{hosting.compareBody}</p>
          </header>

          <div className="exo-detail-profiles">
            {profiles.map((item, index) => (
              <article className={`exo-detail-profile exo-detail-profile--${item.full ? 'full' : 'core'}`} key={item.name}>
                <div className="exo-detail-profile-head">
                  <p className="exo-detail-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                  <p className="exo-detail-profile-name">{item.name}</p>
                  <p className="exo-detail-profile-title">{item.title}</p>
                </div>
                <p className="exo-detail-profile-body">{item.body}</p>
                <div className="exo-detail-profile-foot">
                  <p className="exo-detail-platform"><Server size={16} strokeWidth={1.5} aria-hidden="true" />{hosting.linux}</p>
                  <a className="exo-detail-link" href={docsPath(locale, item.path)}>
                    {item.link}<ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                  <span className="exo-detail-path" aria-hidden="true">{item.path}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="exo-detail exo-detail--governance" id="governance" aria-labelledby="governance-title">
        <img className="exo-detail-governance-bg" src="/media/signal.webp" alt="" aria-hidden="true"
          width="1620" height="1000" loading="lazy" decoding="async" />
        <div className="exo-detail-governance-scrim" aria-hidden="true" />
        <div className="exo-detail-frame exo-detail-governance">
          <header className="exo-detail-lede exo-detail-lede--night">
            <div>
              <p className="exo-detail-label">02 / {hosting.deployment}</p>
              <h2 className="exo-detail-display" id="governance-title">{hosting.governance}</h2>
            </div>
          </header>

          <div className="exo-detail-governance-grid">
            <GovernanceDetails />
          </div>

          <div className="exo-detail-boundary">
            <h3>{hosting.boundaries}</h3>
            <div>
              <p>{hosting.boundaryBody}</p>
              <a className="exo-detail-link" href={productLinks.security}>
                {hosting.security}<ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
