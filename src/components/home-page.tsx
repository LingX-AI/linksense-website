import {
  ArrowDown, ArrowRight, ArrowUpRight, FileSpreadsheet, FileText, Play,
} from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails } from './visuals'

function HomeHero() {
  const { copy } = useSite()
  const { home, nav } = copy

  return (
    <section className="exo-home-hero" aria-labelledby="home-title">
      <div className="exo-hero-media" aria-hidden="true">
        <img className="exo-hero-img" src="/media/exoape-hero.webp" alt="" width="1620" height="1000"
          fetchPriority="high" decoding="async" />
      </div>
      <div className="exo-hero-scrim" aria-hidden="true" />
      <div className="exo-frame exo-hero-layout">
        <div className="exo-hero-main">
          <h1 className="exo-hero-title" id="home-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.titleOne}{' '}</span></span>
            <span className="exo-mask"><span className="exo-mask-in">{home.titleTwo}</span></span>
          </h1>
          <div className="exo-hero-support">
            <p className="exo-hero-intro">
              <span className="exo-mask"><span className="exo-mask-in">{home.introOne}{' '}</span></span>
              <span className="exo-mask"><span className="exo-mask-in">{home.introTwo}</span></span>
            </p>
            <div className="exo-hero-actions">
              <a className="exo-hero-link" href={productLinks.demo}>
                {nav.demo}<ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <SiteLink page="hosting" className="exo-hero-link">
                {home.hostingLink}<ArrowRight size={13} aria-hidden="true" />
              </SiteLink>
              <a className="exo-hero-link exo-hero-link--quiet" href="#workspace">
                {home.scroll}<ArrowDown size={13} aria-hidden="true" />
              </a>
            </div>
            <p className="exo-hero-note">{copy.hosting.linux}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkspaceShowcase() {
  const { copy, locale } = useSite()
  const { home, cases } = copy

  return (
    <section className="exo-work" id="workspace" aria-labelledby="workspace-title">
      <div className="exo-frame">
        <header className="exo-section-head">
          <h2 className="exo-display" id="workspace-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.overview}{' '}</span></span>
            <span className="exo-mask"><span className="exo-mask-in">{home.overviewResult}</span></span>
          </h2>
          <p>{home.overviewBody}</p>
        </header>

        <div className="exo-portfolio">
          <article className="exo-card exo-card--lead">
            <div className="exo-card-media">
              <Poster name="workspace-result" alt={home.workspaceAlt} preview="workspace-teaser" playOnView />
            </div>
            <div className="exo-lead-copy">
              <div className="exo-card-copy">
                <h3>{home.work}</h3>
                <p>{home.workBody}</p>
                <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
                  className="exo-media-link">
                  <Play size={13} fill="currentColor" aria-hidden="true" />{home.recording}
                  <ArrowRight size={14} aria-hidden="true" />
                </MediaLink>
              </div>
              <div className="exo-deliverables" id="deliverables">
                <p className="exo-label">{home.exampleTask}</p>
                <h4 className="exo-deliverables-title">{cases.procurement}</h4>
                <p className="exo-deliverables-note">{home.exampleInput}</p>
                <p className="exo-label exo-deliverables-label">{home.example}</p>
                <ul className="exo-file-list" aria-label={home.example}>
                  <li><FileSpreadsheet size={17} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
                  <li><FileText size={17} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
                </ul>
                <SiteLink page="cases" hash="procurement" className="exo-text-link">
                  {home.workflowLink}<ArrowRight size={15} aria-hidden="true" />
                </SiteLink>
              </div>
            </div>
          </article>

          <article className="exo-card exo-card--files">
            <div className="exo-card-media">
              <img src="/media/team-app.webp" alt={cases.appAlt} width="1152" height="548" loading="lazy" decoding="async" />
            </div>
            <div className="exo-card-copy">
              <h3>{home.files}</h3>
              <p>{home.filesBody}</p>
            </div>
          </article>

          <SiteLink page="cases" hash="capability-sharing" className="exo-card exo-card--skills"
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <div className="exo-card-media">
              <Poster name="skills" alt={home.skillsAlt} preview="skills-preview" />
            </div>
            <div className="exo-card-copy">
              <h3>{home.share}</h3>
              <p>{home.shareBody}</p>
              <span className="exo-card-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
            </div>
          </SiteLink>

          <a className="exo-card exo-card--connect" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <div className="exo-card-media">
              <Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" />
            </div>
            <div className="exo-card-copy">
              <h3>{home.connect}</h3>
              <p>{home.connectBody}</p>
              <span className="exo-card-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
            </div>
          </a>
        </div>

        <div className="exo-team">
          <h2 className="exo-display" id="team-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.teamTitle}</span></span>
          </h2>
          <div className="exo-team-copy">
            <p>{home.teamBody}</p>
            <SiteLink page="cases" hash="capability-sharing" className="exo-text-link">
              {home.share}<ArrowUpRight size={15} aria-hidden="true" />
            </SiteLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilmReel() {
  const { copy } = useSite()
  const home = copy.home

  return (
    <section className="exo-reel" aria-labelledby="film-title">
      <div className="exo-reel-track">
        <div className="exo-reel-stage">
          <div className="exo-reel-head">
            <p className="exo-label">{home.film}</p>
            <h2 className="exo-reel-title" id="film-title">
              <span className="exo-reel-word">{home.reelOne}{' '}</span>
              <span className="exo-reel-word exo-reel-word--soft">{home.reelTwo}</span>
            </h2>
            <p className="exo-reel-note">{home.filmNote}</p>
          </div>
          <div className="exo-reel-media">
            <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film}
              label={home.play} subtitle={home.filmNote} className="exo-reel-link">
              <img src="/media/reel.webp" alt="" width="1440" height="810" loading="lazy" decoding="async" />
              <span className="exo-reel-play"><Play size={17} fill="currentColor" aria-hidden="true" />{home.play}</span>
            </MediaLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function CaseIndex() {
  const { copy } = useSite()
  const home = copy.home

  return (
    <section className="exo-index" aria-labelledby="scenarios-title">
      <div className="exo-frame">
        <header className="exo-index-head">
          <h2 className="exo-display" id="scenarios-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.scenarios}</span></span>
          </h2>
          <p>{home.scenariosBody}</p>
        </header>
        <ol className="exo-case-list">
          {getUseCases(copy.cases).map(({ id, audience, title, output }, index) => (
            <li key={id}>
              <SiteLink page="cases" hash={id} className="exo-case-row">
                <span className="exo-case-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="exo-case-main">
                  <span className="exo-case-audience">{audience}</span>
                  <span className="exo-case-title">{title}</span>
                </span>
                <span className="exo-case-output">{output}</span>
                <span className="exo-case-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
              </SiteLink>
            </li>
          ))}
        </ol>
        <SiteLink page="cases" className="exo-text-link exo-index-all">
          {home.allCases}<ArrowRight size={16} aria-hidden="true" />
        </SiteLink>
      </div>
    </section>
  )
}

function Ownership() {
  const { copy } = useSite()
  const home = copy.home

  return (
    <section className="exo-ownership" aria-labelledby="ownership-title">
      <div className="exo-frame">
        <header className="exo-section-head">
          <h2 className="exo-display" id="ownership-title">
            <span className="exo-mask"><span className="exo-mask-in">{home.ownership}</span></span>
          </h2>
          <p>{home.ownershipBody}</p>
        </header>
        <div className="exo-governance">
          <GovernanceDetails />
        </div>
        <SiteLink page="hosting" className="exo-text-link">
          {home.hostingLink}<ArrowRight size={16} aria-hidden="true" />
        </SiteLink>
      </div>
    </section>
  )
}

function ClosingCta() {
  const { copy } = useSite()

  return (
    <section className="exo-closing" aria-labelledby="closing-title">
      <div className="exo-frame exo-closing-inner">
        <div className="exo-closing-copy">
          <h2 className="exo-closing-title" id="closing-title">
            <span className="exo-mask"><span className="exo-mask-in">{copy.footer.titleOne}{' '}</span></span>
            <span className="exo-mask"><span className="exo-mask-in">{copy.footer.titleTwo}</span></span>
          </h2>
          <div className="exo-closing-actions">
            <a className="exo-cta" href={productLinks.demo}>
              {copy.nav.demo}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a className="exo-text-link" href={productLinks.github}>
              {copy.nav.github}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <figure className="exo-closing-portrait" aria-hidden="true">
          <img src="/media/exoape-hero.webp" alt="" width="1620" height="1000" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <div className="exo-home">
      <HomeHero />
      <WorkspaceShowcase />
      <FilmReel />
      <CaseIndex />
      <Ownership />
      <ClosingCta />
    </div>
  )
}
