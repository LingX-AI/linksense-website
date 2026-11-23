import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileSpreadsheet, FileText,
  Monitor, Play, Scale, Server, Share2,
} from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails, SectionHead } from './visuals'

function HomeHero() {
  const { copy } = useSite()
  const { home } = copy
  return (
    <section className="container qclay-wrap qclay-hero" aria-labelledby="home-title">
      <div className="qclay-hero-heading">
        <h1 className="h1 qclay-title" id="home-title">
          <span className="block">{home.titleOne}</span>{' '}
          <span className="block">{home.titleTwo}</span>
        </h1>
        <a className="qclay-index" href="#showreel">
          <span className="qclay-index-orbit" aria-hidden="true"><ArrowDown size={34} strokeWidth={1.4} /></span>
          <span>{home.film}</span>
        </a>
      </div>
      <div className="qclay-hero-meta">
        <p className="text-pretty">{home.introOne} {home.introTwo}</p>
        <div className="qclay-hero-links flex flex-wrap items-center gap-x-5 gap-y-1">
          <a className="qclay-source inline-flex min-h-11 items-center gap-2" href={productLinks.github}>
            <img src="/brand/linksense-icon.svg" alt="" width="23" height="23" className="shrink-0" />
            {copy.footer.source}<ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <SiteLink page="hosting" className="btn btn--secondary btn--compact">
            {home.hostingLink}<ArrowUpRight size={14} aria-hidden="true" />
          </SiteLink>
        </div>
      </div>
    </section>
  )
}

function WorkspaceShowcase() {
  const { copy } = useSite()
  const { home, cases, nav } = copy

  return (
    <section className="section" id="workspace" aria-labelledby="workspace-title">
      <div className="container qclay-wrap">
        <SectionHead id="workspace-title" title={[home.overview, home.overviewResult]} body={home.overviewBody} />
        <figure className="workspace-frame">
          <Poster name="workspace-result" alt={home.workspaceAlt} />
        </figure>
        <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
          className="arrow-link mt-4">
          <Play size={14} fill="currentColor" aria-hidden="true" />{home.recording}
        </MediaLink>
        <div className="workspace-details">
          <div>
            <p className="text-sm text-muted">{home.exampleTask}</p>
            <h3>{cases.procurement}</h3>
            <p>{home.exampleInput}</p>
            <SiteLink page="cases" hash="procurement" className="arrow-link">
              {home.workflowLink}<ArrowRight size={16} aria-hidden="true" />
            </SiteLink>
          </div>
          <div id="deliverables">
            <p id="deliverables-title" className="text-sm text-muted">{home.example}</p>
            <ul role="list" aria-labelledby="deliverables-title" className="file-list">
              <li><FileSpreadsheet size={18} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
              <li><FileText size={18} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
            </ul>
          </div>
        </div>
        <ul role="list" className="qclay-rail flex flex-wrap items-center gap-x-7 gap-y-1">
          <li><a href="#workspace"><Monitor size={16} aria-hidden="true" />{home.work}</a></li>
          <li><a href="#deliverables"><FileSpreadsheet size={16} aria-hidden="true" />{home.files}</a></li>
          <li><a href="#team-title"><Share2 size={16} aria-hidden="true" />{home.share}</a></li>
          <li><SiteLink page="hosting"><Server size={16} aria-hidden="true" />{nav.hosting}</SiteLink></li>
        </ul>
      </div>
    </section>
  )
}

function TeamSection() {
  const { copy, locale } = useSite()
  const home = copy.home

  return (
    <section className="section" aria-labelledby="team-title">
      <div className="container qclay-wrap">
        <SectionHead id="team-title" title={home.teamTitle} body={home.teamBody} />
        <div className="feature-list">
          <SiteLink page="cases" hash="capability-sharing" className="feature-row"
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <div className="feature-media">
              <Poster name="skills" alt={home.skillsAlt} preview="skills-preview" />
            </div>
            <div className="feature-caption">
              <h3>{home.share}</h3>
              <p>{home.shareBody}</p>
              <ArrowRight size={20} aria-hidden="true" />
            </div>
          </SiteLink>
          <a className="feature-row feature-row--connect" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <div className="feature-media">
              <Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" />
            </div>
            <div className="feature-caption">
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

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

function UseCasePreview() {
  const { copy } = useSite()

  return (
    <section className="section qclay-cases" aria-labelledby="scenarios-title">
      <div className="container qclay-wrap">
        <SectionHead id="scenarios-title" title={copy.home.scenarios} body={copy.home.scenariosBody} />
        <div className="scenario-grid">
          {getUseCases(copy.cases).map(({ id, audience, title, output }) => {
            const Icon = caseIcons[id]
            return (
              <article className="scenario-card" data-case={id} key={id}>
                <div className="scenario-top">
                  <span className="chip">{audience}</span>
                  <span className="icon-tile" aria-hidden="true"><Icon size={28} strokeWidth={1.4} /></span>
                </div>
                <h3><SiteLink page="cases" hash={id}>{title}<ArrowUpRight size={18} aria-hidden="true" /></SiteLink></h3>
                <p className="scenario-output">{output}</p>
              </article>
            )
          })}
        </div>
        <div className="section-action">
          <SiteLink page="cases" className="arrow-link"><span>{copy.home.allCases}</span><ArrowRight size={16} aria-hidden="true" /></SiteLink>
        </div>
      </div>
    </section>
  )
}

function FilmSection() {
  const { copy } = useSite()
  const home = copy.home
  return (
    <section className="container qclay-wrap qclay-reel" id="showreel" aria-labelledby="film-title">
      <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film} label={home.play}
        subtitle={home.filmNote} className="film-link">
        <img src="/media/qclay-reel.svg" alt="" width="1440" height="810" fetchPriority="high" decoding="async" />
        <span className="film-pill" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
      </MediaLink>
      <div className="qclay-reel-caption flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
        <h2 id="film-title">{home.film}</h2>
        <p>{home.filmNote}</p>
      </div>
    </section>
  )
}

function OwnershipSection() {
  const { copy } = useSite()
  const home = copy.home
  return (
    <section className="section section--soft" aria-labelledby="ownership-title">
      <div className="container qclay-wrap">
        <SectionHead id="ownership-title" title={home.ownership} body={home.ownershipBody} />
        <GovernanceDetails />
        <div className="section-action">
          <SiteLink page="hosting" className="btn btn--secondary">{home.hostingLink}<ArrowRight size={16} aria-hidden="true" /></SiteLink>
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
        <img src="/brand/linksense-icon.svg" alt="" className="closing-icon" width="64" height="64" loading="lazy" />
        <h2 className="h2" id="closing-title">{copy.footer.titleOne}<br />{copy.footer.titleTwo}</h2>
        <div className="hero-actions">
          <a className="btn" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
          <a className="btn btn--secondary" href={productLinks.github}>{copy.nav.github}<ArrowUpRight size={15} aria-hidden="true" /></a>
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
