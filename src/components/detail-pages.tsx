import {
  ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileText, Layers3, Scale, Server, ShieldCheck, Star, Workflow,
} from 'lucide-react'
import { getDeploymentProfiles, getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { Deliverables, GovernanceDetails, PageIntro } from './visuals'

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

function CaseArtifact({ id }: { id: 'procurement' | 'reporting' | 'knowledge' }) {
  const { copy } = useSite()
  const cases = copy.cases

  if (id === 'procurement') {
    return (
      <div className="artifact-body artifact-body--flush">
        <Deliverables />
      </div>
    )
  }

  if (id === 'reporting') {
    return (
      <div className="artifact-body">
        <div className="brief-document">
          <div className="brief-document-head">
            <span><ClipboardList size={16} aria-hidden="true" />{cases.briefFile}</span>
            <span className="mono-label">DOCX</span>
          </div>
          <ol className="brief-points">
            {[cases.briefPointOne, cases.briefPointTwo, cases.briefPointThree].map((line, index) => (
              <li key={line}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{line}</strong>
                <i aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="artifact-body">
      <div className="qa-thread">
        <div className="qa-turn">
          <span className="qa-mark" aria-hidden="true">Q</span>
          <p>{cases.question}</p>
        </div>
        <div className="qa-turn qa-turn--answer">
          <span className="qa-mark" aria-hidden="true">A</span>
          <p>{cases.answer}</p>
        </div>
        <p className="qa-source"><BookOpen size={14} aria-hidden="true" />{cases.reference}</p>
      </div>
    </div>
  )
}

function CaseCatalog() {
  const { copy } = useSite()
  const cases = copy.cases
  const useCases = getUseCases(cases)

  return (
    <section className="container catalog-section" id="examples" aria-label={copy.nav.cases}>
      <div className="catalog-layout">
        <aside className="catalog-rail">
          <p className="mono-label">{copy.nav.cases}</p>
          <ol className="catalog-index">
            {useCases.map(({ id, audience, title }, index) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{title}<small>{audience}</small></span>
                </a>
              </li>
            ))}
          </ol>
          <p className="catalog-note">{cases.examplesNote}</p>
        </aside>
        <div className="catalog-list">
          {useCases.map(({ id, audience, title, body, output }, index) => {
            const Icon = caseIcons[id]
            return (
              <article className={`case-entry case-entry--${id}`} id={id} key={id}>
                <div className="case-entry-copy">
                  <div className="case-entry-head">
                    <span className="case-entry-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="chip">{audience}</span>
                    <span className="case-entry-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.5} /></span>
                  </div>
                  <h2>{title}</h2>
                  <p>{body}</p>
                  <div className="case-output">
                    <span className="mono-label">{cases.file}</span>
                    <p>{output}</p>
                  </div>
                </div>
                <div className={`case-artifact case-artifact--${id}`} role="group" aria-label={`${cases.file}: ${title}`}>
                  <div className="artifact-bar">
                    <FileText size={13} aria-hidden="true" />
                    <span>{cases.file}</span>
                    <span className="artifact-bar-meta">{cases.examplesNote}</span>
                  </div>
                  <CaseArtifact id={id} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SharingSection() {
  const { copy } = useSite()
  const cases = copy.cases
  return (
    <section className="container sharing-section" id="capability-sharing" aria-labelledby="handoff-title">
      <div className="sharing-panel">
        <div className="sharing-copy">
          <p className="mono-label">{copy.home.share}</p>
          <h2 id="handoff-title">{cases.handoff}</h2>
          <p>{cases.handoffBody}</p>
          <a className="btn btn--accent" href={productLinks.demo}>
            {copy.nav.demo}<ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="sharing-media">
          <div className="artifact-bar">
            <img src="/brand/linksense-icon.svg" alt="" width="16" height="16" />
            <span>{copy.home.share}</span>
          </div>
          <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  )
}

export function CasesPage() {
  const { copy } = useSite()
  const cases = copy.cases

  return (
    <>
      <PageIntro
        kind="cases"
        title={[cases.titleOne, cases.titleTwo]}
        intro={[cases.introOne, cases.introTwo]}
        source={(
          <a className="source-chip" href="#examples">
            <FileText size={13} aria-hidden="true" />
            <span>{cases.examplesNote}</span>
            <ArrowRight size={12} aria-hidden="true" />
          </a>
        )}
      >
        <a className="btn btn--accent" href={productLinks.demo}>
          {copy.nav.demo}<ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </PageIntro>
      <CaseCatalog />
      <SharingSection />
    </>
  )
}

function DeploymentProfile({ profile }: { profile: ReturnType<typeof getDeploymentProfiles>[number] }) {
  const { copy, locale } = useSite()
  const Icon = profile.full ? Layers3 : Workflow

  return (
    <article
      className={`profile-card${profile.full ? ' profile-card--full' : ''}`}
      id={profile.id}
      aria-labelledby={`profile-${profile.id}-title`}
    >
      <div className="profile-card-head">
        <span className="profile-name">{profile.name}</span>
        <span className="profile-icon" aria-hidden="true"><Icon size={19} strokeWidth={1.6} /></span>
      </div>
      <h3 id={`profile-${profile.id}-title`}>{profile.title}</h3>
      <p>{profile.body}</p>
      <p className="profile-platform"><Server size={15} strokeWidth={1.5} aria-hidden="true" />{copy.hosting.linux}</p>
      <a className="profile-link" href={docsPath(locale, profile.path)}>
        {profile.docs}<ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </article>
  )
}

export function HostingPage() {
  const { copy } = useSite()
  const hosting = copy.hosting
  const profiles = getDeploymentProfiles(hosting)

  return (
    <>
      <PageIntro
        kind="hosting"
        title={[hosting.titleOne, hosting.titleTwo]}
        intro={[hosting.introOne, hosting.introTwo]}
        source={(
          <a className="source-chip" href={productLinks.github}>
            <Star size={13} aria-hidden="true" />
            <span>{hosting.source}</span>
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        )}
      >
        <a className="btn btn--accent" href="#profiles">{hosting.compare}<ArrowRight size={15} aria-hidden="true" /></a>
      </PageIntro>
      <section className="container docs-section" aria-label={hosting.compare}>
        <div className="docs-layout">
          <aside className="docs-rail">
            <p className="mono-label">{hosting.contents}</p>
            <nav aria-label={hosting.contents}>
              <a href="#profiles"><span>01</span>{hosting.compare}</a>
              <a href="#governance"><span>02</span>{hosting.governance}</a>
              <a href="#boundaries"><span>03</span>{hosting.boundaries}</a>
            </nav>
            <div className="docs-rail-note">
              <p><Server size={14} aria-hidden="true" />{hosting.linux}</p>
              <p>{hosting.compareBody}</p>
            </div>
            <a className="text-link" href={productLinks.github}>{hosting.source}<ArrowUpRight size={13} aria-hidden="true" /></a>
          </aside>
          <div className="docs-content">
            <section className="docs-block" id="profiles" aria-labelledby="profiles-title">
              <div className="docs-heading">
                <p className="mono-label">01 / {hosting.deployment}</p>
                <h2 id="profiles-title">{hosting.compare}</h2>
                <p>{hosting.compareBody}</p>
              </div>
              <div className="profile-grid">
                {profiles.map((profile) => <DeploymentProfile profile={profile} key={profile.id} />)}
              </div>
            </section>
            <section className="docs-block" id="governance" aria-labelledby="governance-title">
              <div className="docs-heading">
                <p className="mono-label">02 / {hosting.deployment}</p>
                <h2 id="governance-title">{hosting.governance}</h2>
              </div>
              <div className="governance-workbench">
                <GovernanceDetails />
              </div>
            </section>
            <section className="docs-block" id="boundaries" aria-labelledby="boundaries-title">
              <div className="boundary-panel">
                <div>
                  <p className="mono-label">03 / {hosting.boundaries}</p>
                  <h2 id="boundaries-title">{hosting.boundaries}</h2>
                  <p>{hosting.boundaryBody}</p>
                  <a className="text-link" href={productLinks.security}>
                    {hosting.security}<ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
                <span className="boundary-icon" aria-hidden="true"><ShieldCheck size={30} strokeWidth={1.3} /></span>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
