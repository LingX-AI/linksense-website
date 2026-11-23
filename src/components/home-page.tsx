import {
  ArrowRight, ArrowUpRight, BookOpen, ClipboardList, FileSpreadsheet, FileText, Globe2,
  Monitor, Pause, Play, Scale, Server, Share2, Star,
} from 'lucide-react'
import { useState } from 'react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import GradientWaves from './GradientWaves'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails, SectionHead } from './visuals'

function HomeHero() {
  const { copy } = useSite()
  const { home, nav } = copy

  return (
    <section className="bit-hero">
      <div className="container bit-hero-grid">
        <div>
          <a className="bit-source mb-5 inline-flex min-h-11 items-center gap-2 px-3 text-sm" href={productLinks.github}>
            <Star size={15} aria-hidden="true" />{copy.footer.source}<ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <h1 className="h1 bit-title">
            <span className="block">{home.titleOne}</span>{' '}
            <span className="block">{home.titleTwo}</span>
          </h1>
        </div>
        <div className="bit-intro max-w-md self-end">
          <p className="text-pretty text-muted">{home.introOne} {home.introTwo}</p>
          <SiteLink page="hosting" className="arrow-link mt-1">{home.hostingLink}<ArrowRight size={15} aria-hidden="true" /></SiteLink>
        </div>
        <div className="bit-hero-actions flex flex-wrap items-center gap-2.5">
          <a className="btn" href={productLinks.demo}>
            <Globe2 size={17} aria-hidden="true" />{nav.demo}<ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="btn btn--secondary" href="#workspace">{home.scroll}<ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}

function WorkspaceShowcase() {
  const { copy } = useSite()
  const { home, cases, nav } = copy
  const [paused, setPaused] = useState(false)

  return (
    <section className="container" id="workspace" aria-labelledby="workspace-title">
      <div className="bit-stage relative isolate grid items-start gap-3 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
        <div className="bit-stage-art pointer-events-none absolute inset-0 -z-10 hidden overflow-clip motion-safe:block" aria-hidden="true">
          <GradientWaves
            horizonColor="#603ad2" waveColor="#bd88fa" crestColor="#f1d6ff"
            speed={0.26} amplitude={2.75} swell={34} tilt={59} lightAngle={116}
            sheen={0.35} grain={0.12} quality="low" dpr={1} intro={false}
            mouseInteraction={!paused} parallaxStrength={0.3} mouseStrength={0.35} swellOnClick={false} paused={paused}
          />
        </div>
        <div className="bit-stage-panel bit-workspace-window min-w-0">
          <h2 id="workspace-title" className="bit-window-title flex items-center gap-2.5 p-3 text-sm font-medium">
            <img src="/brand/linksense-icon.svg" alt="" width="21" height="21" className="shrink-0" />
            <span>{home.overview} {home.overviewResult}</span>
          </h2>
          <Poster name="workspace-result" alt={home.workspaceAlt} priority />
          <div className="bit-window-footer px-3 py-1">
            <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
              className="bit-window-link inline-flex min-h-11 items-center gap-2 text-sm font-medium">
              <Play size={14} fill="currentColor" aria-hidden="true" />{home.recording}
            </MediaLink>
          </div>
        </div>
        <div className="bit-inspector grid min-w-0 gap-3">
          <div className="bit-stage-panel p-4 xl:p-5">
            <p className="bit-panel-label flex items-center gap-2"><Monitor size={15} aria-hidden="true" />{home.exampleTask}</p>
            <h3 className="mt-2 text-lg leading-tight font-semibold tracking-tight">{cases.procurement}</h3>
            <p className="bit-panel-detail mt-2 text-sm text-pretty">{home.exampleInput}</p>
            <SiteLink page="cases" hash="procurement" className="bit-window-link mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium">
              {home.workflowLink}<ArrowRight size={16} aria-hidden="true" />
            </SiteLink>
          </div>
          <div className="bit-stage-panel p-4 xl:p-5" id="deliverables">
            <p id="deliverables-title" className="bit-panel-label flex items-center gap-2"><FileText size={15} aria-hidden="true" />{home.example}</p>
            <ul role="list" aria-labelledby="deliverables-title" className="bit-file-list mt-2 grid gap-1.5 text-sm">
              <li className="flex items-center gap-2"><FileSpreadsheet size={16} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
              <li className="flex items-center gap-2"><FileText size={16} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
            </ul>
          </div>
        </div>
        <button
          className="bit-motion-toggle"
          type="button"
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? home.playBackground : home.pauseBackground}
        </button>
      </div>
      <div className="bit-stage-caption">
        <p className="max-w-2xl text-pretty text-muted">{home.overviewBody}</p>
        <ul role="list" className="bit-capabilities">
          <li><a href="#workspace"><Monitor size={17} aria-hidden="true" />{home.work}</a></li>
          <li><a href="#deliverables"><FileSpreadsheet size={17} aria-hidden="true" />{home.files}</a></li>
          <li><a href="#team-title"><Share2 size={17} aria-hidden="true" />{home.share}</a></li>
          <li><SiteLink page="hosting"><Server size={17} aria-hidden="true" />{nav.hosting}</SiteLink></li>
        </ul>
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
            <div className="feature-caption">
              <h3>{home.share}</h3>
              <p>{home.shareBody}</p>
              <ArrowRight size={20} aria-hidden="true" />
            </div>
            <div className="feature-media">
              <Poster name="skills" alt={home.skillsAlt} preview="skills-preview" />
            </div>
          </SiteLink>
          <a className="feature-row feature-row--connect" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
            onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
            <div className="feature-caption">
              <h3>{home.connect}</h3>
              <p>{home.connectBody}</p>
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
            <div className="feature-media">
              <Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" />
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
