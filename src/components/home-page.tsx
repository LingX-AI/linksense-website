import { ArrowRight, ArrowUpRight, FileSpreadsheet, FileText, Play } from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails } from './visuals'

function ChapterHead({ id, number, title, body }: {
  id: string
  number: string
  title: string | [string, string]
  body: string
}) {
  return (
    <div className="chapter-head">
      <p className="chapter-number" aria-hidden="true">{number}</p>
      <h2 className="h2 chapter-title" id={id}>
        {typeof title === 'string' ? title : <>{title[0]}<br />{title[1]}</>}
      </h2>
      <p className="chapter-body">{body}</p>
    </div>
  )
}

function HomeHero() {
  const { copy } = useSite()
  const { home } = copy
  return (
    <section className="home-intro" aria-labelledby="home-title">
      <div className="container qclay-wrap">
        <h1 className="home-intro-title" id="home-title">
          <span>{home.titleOne}</span>{' '}
          <span>{home.titleTwo}</span>
        </h1>
        <div className="home-intro-meta">
          <div className="home-intro-brief">
            <p className="home-facts">
              <a href={productLinks.github}>{copy.footer.source}<ArrowUpRight size={13} aria-hidden="true" /></a>
              <span>{copy.hosting.linux}</span>
            </p>
            <p className="home-intro-copy">{home.introOne} {home.introTwo}</p>
          </div>
          <SiteLink page="hosting" className="pill-link">
            {home.hostingLink}<ArrowUpRight size={15} aria-hidden="true" />
          </SiteLink>
        </div>
      </div>
    </section>
  )
}

function FilmSection() {
  const { copy } = useSite()
  const home = copy.home
  return (
    <section className="home-reel" id="showreel" aria-labelledby="film-title">
      <div className="container qclay-wrap">
        <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film} label={home.play}
          subtitle={home.filmNote} className="film-link">
          <img src="/media/qclay-links.webp" alt="" width="1600" height="900" fetchPriority="high" decoding="async" />
          <span className="film-pill" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
        </MediaLink>
        <div className="reel-caption">
          <h2 id="film-title">{home.film}</h2>
          <p>{home.filmNote}</p>
        </div>
      </div>
    </section>
  )
}

function WorkspaceShowcase() {
  const { copy } = useSite()
  const { home, cases } = copy

  return (
    <section className="work-section" id="workspace" aria-labelledby="workspace-title">
      <div className="container qclay-wrap">
        <ChapterHead id="workspace-title" number="01" title={[home.overview, home.overviewResult]} body={home.overviewBody} />
        <figure className="workspace-frame">
          <Poster name="workspace-result" alt={home.workspaceAlt} />
          <figcaption><span>{home.example}</span><span>{cases.procurement}</span></figcaption>
        </figure>
        <div className="workspace-details">
          <div className="workspace-story">
            <p className="eyebrow">{home.exampleTask}</p>
            <h3>{cases.procurement}</h3>
            <p>{home.exampleInput}</p>
            <SiteLink page="cases" hash="procurement" className="pill-link">
              {home.workflowLink}<ArrowRight size={16} aria-hidden="true" />
            </SiteLink>
          </div>
          <div className="workspace-aside">
            <div id="deliverables">
              <p id="deliverables-title" className="eyebrow">{home.example}</p>
              <ul role="list" aria-labelledby="deliverables-title" className="file-list">
                <li><FileSpreadsheet size={18} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
                <li><FileText size={18} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
              </ul>
            </div>
            <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
              className="media-link">
              <Play size={14} fill="currentColor" aria-hidden="true" />{home.recording}<ArrowUpRight size={14} aria-hidden="true" />
            </MediaLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCasePreview() {
  const { copy } = useSite()

  return (
    <section className="work-section work-section--cases" aria-labelledby="scenarios-title">
      <div className="container qclay-wrap">
        <ChapterHead id="scenarios-title" number="02" title={copy.home.scenarios} body={copy.home.scenariosBody} />
        <div className="case-preview">
          <ol className="case-index">
            {getUseCases(copy.cases).map(({ id, audience, title, output }, index) => (
              <li key={id}>
                <SiteLink page="cases" hash={id} className="case-index-link">
                  <span className="case-index-number" aria-hidden="true">0{index + 1}</span>
                  <span className="case-index-copy">
                    <span className="case-index-audience">{audience}</span>
                    <strong>{title}</strong>
                    <span>{output}</span>
                  </span>
                  <ArrowUpRight size={21} strokeWidth={1.45} aria-hidden="true" />
                </SiteLink>
              </li>
            ))}
          </ol>
          <div className="case-preview-media">
            <SiteLink page="cases" hash="procurement" className="case-preview-primary" aria-label={copy.cases.procurement}>
              <Poster name="team-app" alt={copy.cases.appAlt} />
            </SiteLink>
            <SiteLink page="cases" hash="knowledge" className="case-preview-secondary" aria-label={copy.cases.knowledge}>
              <Poster name="workspace-result" alt={copy.home.workspaceAlt} />
            </SiteLink>
          </div>
        </div>
        <div className="section-action">
          <SiteLink page="cases" className="pill-link"><span>{copy.home.allCases}</span><ArrowRight size={16} aria-hidden="true" /></SiteLink>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const { copy, locale } = useSite()
  const home = copy.home

  return (
    <section className="work-section work-section--share" aria-labelledby="team-title">
      <div className="container qclay-wrap">
        <ChapterHead id="team-title" number="03" title={home.teamTitle} body={home.teamBody} />
        <div className="share-portfolio">
          <SiteLink page="cases" hash="capability-sharing" className="share-piece share-piece--primary"
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <Poster name="skills" alt={home.skillsAlt} preview="skills-preview" />
            <div className="share-piece-caption">
              <h3>{home.share}</h3>
              <p>{home.shareBody}</p>
              <ArrowRight size={20} aria-hidden="true" />
            </div>
          </SiteLink>
          <a className="share-piece share-piece--secondary" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" />
            <div className="share-piece-caption">
              <h3>{home.connect}</h3>
              <p>{home.connectBody}</p>
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

function OwnershipSection() {
  const { copy } = useSite()
  const home = copy.home
  return (
    <section className="work-section work-section--ownership" aria-labelledby="ownership-title">
      <div className="container qclay-wrap">
        <ChapterHead id="ownership-title" number="04" title={home.ownership} body={home.ownershipBody} />
        <GovernanceDetails />
        <div className="section-action">
          <SiteLink page="hosting" className="pill-link">{home.hostingLink}<ArrowRight size={16} aria-hidden="true" /></SiteLink>
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  const { copy } = useSite()
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="container qclay-wrap closing-inner">
        <h2 className="h2" id="closing-title">{copy.footer.titleOne}<br />{copy.footer.titleTwo}</h2>
        <div className="hero-actions">
          <a className="pill-link" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a className="pill-link" href={productLinks.github}>{copy.nav.github}<ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <HomeHero />
      <FilmSection />
      <WorkspaceShowcase />
      <UseCasePreview />
      <TeamSection />
      <OwnershipSection />
      <ClosingCta />
    </>
  )
}
