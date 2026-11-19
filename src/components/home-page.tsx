import {
  ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileSpreadsheet, FileText, Globe2,
  Monitor, Play, Scale, Server, Share2, Star,
} from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails, Hero, SectionHead } from './visuals'

function HomeHero() {
  const { copy } = useSite()
  const { home, nav } = copy
  const rail = (
    <div className="container hero-rail">
      <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1">
        <li><a href="#workspace"><Monitor size={17} aria-hidden="true" />{home.work}</a></li>
        <li><a href="#deliverables"><FileSpreadsheet size={17} aria-hidden="true" />{home.files}</a></li>
        <li><a href="#team-title"><Share2 size={17} aria-hidden="true" />{home.share}</a></li>
        <li><SiteLink page="hosting"><Server size={17} aria-hidden="true" />{nav.hosting}</SiteLink></li>
      </ul>
    </div>
  )

  return (
    <Hero kind="home" intro={[home.introOne, home.introTwo]} title={[home.titleOne, home.titleTwo]} rail={rail}
      beforeTitle={
        <a className="hero-source" href={productLinks.github}>
          <Star size={15} fill="currentColor" aria-hidden="true" />{copy.footer.source}<ArrowUpRight size={13} aria-hidden="true" />
        </a>
      }>
      <div className="hero-action">
        <a className="btn" href={productLinks.demo}>
          <Globe2 size={17} aria-hidden="true" />{nav.demo}<ArrowUpRight className="btn-end" size={15} aria-hidden="true" />
        </a>
        <a className="hero-action-note" href="#workspace">{home.scroll}</a>
      </div>
      <div className="hero-action">
        <SiteLink page="hosting" className="btn btn--accent">{home.hostingLink}<ArrowRight className="btn-end" size={16} aria-hidden="true" /></SiteLink>
        <span className="hero-action-note">{copy.hosting.linux}</span>
      </div>
    </Hero>
  )
}

function WorkspaceShowcase() {
  const { copy } = useSite()
  const { home, cases } = copy

  return (
    <section className="section" id="workspace" aria-labelledby="workspace-title">
      <div className="container">
        <SectionHead id="workspace-title" title={[home.overview, home.overviewResult]} body={home.overviewBody} />
        <figure className="workspace-frame">
          <Poster name="workspace-result" alt={home.workspaceAlt} preview="workspace-teaser" playOnView />
        </figure>
        <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
          className="arrow-link mt-4">
          {home.recording}<ArrowRight size={16} aria-hidden="true" />
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
            <p className="text-sm text-muted">{home.example}</p>
            <ul aria-label={home.example} className="file-list">
              <li><FileSpreadsheet size={18} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
              <li><FileText size={18} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const { copy, locale } = useSite()
  const home = copy.home

  return (
    <section className="section section--soft" aria-labelledby="team-title">
      <div className="container">
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
    <section className="section" aria-labelledby="scenarios-title">
      <div className="container">
        <SectionHead id="scenarios-title" title={copy.home.scenarios} body={copy.home.scenariosBody} />
        <div className="scenario-grid">
          {getUseCases(copy.cases).map(({ id, audience, title, output }) => {
            const Icon = caseIcons[id]
            return (
              <article className="scenario-card" data-case={id} key={id}>
                <div className="scenario-top">
                  <span className="icon-tile" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></span>
                  <span className="chip">{audience}</span>
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
    <section className="section section--film" aria-labelledby="film-title">
      <div className="container film-grid">
        <div className="film-copy">
          <p className="eyebrow">{home.film}</p>
          <h2 className="h2" id="film-title">{home.reelOne}<br /><span className="text-accent">{home.reelTwo}</span></h2>
          <p>{home.filmNote}</p>
        </div>
        <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film} label={home.play}
          subtitle={home.filmNote} className="film-link">
          <img src="/media/reel.webp" alt="" width="1440" height="810" loading="lazy" decoding="async" />
          <span className="film-pill"><Play size={18} fill="currentColor" aria-hidden="true" />{home.play}</span>
        </MediaLink>
      </div>
    </section>
  )
}

function OwnershipSection() {
  const { copy } = useSite()
  const home = copy.home
  return (
    <section className="section section--soft" aria-labelledby="ownership-title">
      <div className="container">
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
      <div className="container closing-inner">
        <img src="/brand/linksense-icon.svg" alt="" className="closing-icon" width="64" height="64" loading="lazy" />
        <h2 className="h2" id="closing-title">{copy.footer.titleOne}<br /><span className="text-accent">{copy.footer.titleTwo}</span></h2>
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
      <WorkspaceShowcase />
      <UseCasePreview />
      <TeamSection />
      <FilmSection />
      <OwnershipSection />
      <ClosingCta />
    </>
  )
}
