import {
  ArrowRight, ArrowUpRight, BookOpen, Boxes, ClipboardList, FileSpreadsheet, FileText, Files,
  Globe2, Pause, Play, Scale, Server, Share2, Star, Terminal,
} from 'lucide-react'
import { useState } from 'react'
import { getDeploymentProfiles, getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import GradientWaves from './GradientWaves'
import { hoverPreview, MediaLink, Poster, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails } from './visuals'

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

function HomeIntro() {
  const { copy } = useSite()
  const { home, nav } = copy

  return (
    <section className="home-intro">
      <div className="container home-intro-grid">
        <div className="home-intro-lead">
          <a className="source-chip" href={productLinks.github}>
            <Star size={13} aria-hidden="true" />
            <span>{copy.footer.source}</span>
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <h1 className="home-title">
            <span>{home.titleOne}</span>{' '}
            <span className="home-title-accent">{home.titleTwo}</span>
          </h1>
          <div className="home-intro-actions">
            <a className="btn btn--accent" href={productLinks.demo}>
              <Globe2 size={16} aria-hidden="true" />{nav.demo}<ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a className="btn btn--secondary" href="#workspace">
              {home.scroll}<ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="home-intro-note">
          <p>{home.introOne}</p>
          <p>{home.introTwo}</p>
          <SiteLink page="hosting" className="text-link">
            {home.hostingLink}<ArrowRight size={14} aria-hidden="true" />
          </SiteLink>
        </div>
      </div>
    </section>
  )
}

function Workbench() {
  const { copy } = useSite()
  const { home, cases } = copy
  const [paused, setPaused] = useState(false)
  const presets = getUseCases(cases)

  return (
    <section className="container workbench-section" id="workspace" aria-labelledby="workspace-title">
      <div className="workbench-frame">
        <div className="workbench-bar">
          <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
          <div className="workbench-identity">
            <img src="/brand/linksense-icon.svg" alt="" width="17" height="17" />
            <h2 id="workspace-title">{home.overview} {home.overviewResult}</h2>
          </div>
          <div className="workbench-bar-meta">
            <span>{home.exampleTask}</span>
            <span className="workbench-bar-case">{cases.teams}</span>
          </div>
          <button
            className="workbench-pause"
            type="button"
            aria-label={paused ? home.playBackground : home.pauseBackground}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
            <span>{paused ? home.playBackground : home.pauseBackground}</span>
          </button>
        </div>
        <div className="workbench-grid">
          <div className="workbench-editor">
            <div className="workbench-editor-head">
              <span>{home.work}</span>
              <span className="workbench-editor-case">{cases.procurement}</span>
            </div>
            <div className="workbench-screen">
              <Poster name="workspace-result" alt={home.workspaceAlt} priority />
            </div>
            <div className="workbench-editor-foot">
              <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
                className="workbench-play">
                <Play size={13} fill="currentColor" aria-hidden="true" />
                <span>{home.recording}</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </MediaLink>
              <p>{home.overviewBody}</p>
            </div>
          </div>
          <aside className="workbench-aside" aria-label={home.exampleTask}>
            <div className="workbench-waves" aria-hidden="true">
              <GradientWaves
                horizonColor="#603ad2" waveColor="#bd88fa" crestColor="#f1d6ff"
                speed={0.26} amplitude={2.75} swell={34} tilt={59} lightAngle={116}
                sheen={0.35} grain={0.12} quality="low" dpr={1} intro={false}
                mouseInteraction={!paused} parallaxStrength={0.3} mouseStrength={0.35}
                swellOnClick={false} paused={paused}
              />
            </div>
            <div className="workbench-stack">
              <section className="workbench-panel workbench-task-panel" aria-labelledby="workbench-task-title">
                <div className="panel-bar">
                  <Terminal size={13} aria-hidden="true" />
                  <span>{home.exampleTask}</span>
                  <span className="panel-index">01</span>
                </div>
                <h3 id="workbench-task-title">{cases.procurement}</h3>
                <p>{home.exampleInput}</p>
                <SiteLink page="cases" hash="procurement" className="panel-link">
                  {home.workflowLink}<ArrowRight size={14} aria-hidden="true" />
                </SiteLink>
              </section>
              <section className="workbench-panel" id="deliverables" aria-labelledby="deliverables-title">
                <div className="panel-bar">
                  <Files size={13} aria-hidden="true" />
                  <span id="deliverables-title">{home.example}</span>
                  <span className="panel-index">02</span>
                </div>
                <ul className="artifact-list" aria-labelledby="deliverables-title">
                  <li>
                    <SiteLink page="cases" hash="procurement">
                      <FileSpreadsheet size={15} aria-hidden="true" />
                      <span><strong>{home.spreadsheet}</strong><small>XLSX · {cases.file}</small></span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </SiteLink>
                  </li>
                  <li>
                    <SiteLink page="cases" hash="procurement">
                      <FileText size={15} aria-hidden="true" />
                      <span><strong>{home.report}</strong><small>DOCX · {cases.file}</small></span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </SiteLink>
                  </li>
                </ul>
              </section>
              <section className="workbench-panel workbench-presets" aria-labelledby="presets-title">
                <div className="panel-bar">
                  <Boxes size={13} aria-hidden="true" />
                  <span id="presets-title">{home.scenarios}</span>
                  <span className="panel-index">03</span>
                </div>
                <ul className="preset-list">
                  {presets.map((preset, index) => (
                    <li key={preset.id}>
                      <SiteLink page="cases" hash={preset.id}>
                        <span className="preset-index">{String(index + 1).padStart(2, '0')}</span>
                        <span>{preset.title}</span>
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </div>
      <div className="workbench-caption">
        <p>{home.overviewBody}</p>
        <ul className="capability-links" aria-label={copy.nav.primary}>
          <li><a href="#workspace"><Terminal size={14} aria-hidden="true" />{home.work}</a></li>
          <li><a href="#deliverables"><FileSpreadsheet size={14} aria-hidden="true" />{home.files}</a></li>
          <li><a href="#team-title"><Share2 size={14} aria-hidden="true" />{home.share}</a></li>
          <li><SiteLink page="hosting"><Server size={14} aria-hidden="true" />{copy.nav.hosting}</SiteLink></li>
        </ul>
      </div>
    </section>
  )
}

function CapabilityLibrary() {
  const { copy, locale } = useSite()
  const home = copy.home

  return (
    <section className="section-block" aria-labelledby="team-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="team-title">{home.teamTitle}</h2>
          <p>{home.teamBody}</p>
        </div>
        <div className="library-grid">
          <SiteLink
            page="cases"
            hash="capability-sharing"
            className="library-card library-card--lead"
            onPointerEnter={hoverPreview}
            onPointerLeave={stopPreview}
          >
            <div className="library-card-head">
              <span><Share2 size={14} aria-hidden="true" />{home.share}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
            <div className="library-card-copy">
              <h3>{home.share}</h3>
              <p>{home.shareBody}</p>
            </div>
            <div className="library-media">
              <Poster name="skills" alt={home.skillsAlt} preview="skills-preview" />
            </div>
          </SiteLink>
          <a
            className="library-card"
            href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
            onPointerEnter={hoverPreview}
            onPointerLeave={stopPreview}
          >
            <div className="library-card-head">
              <span><Boxes size={14} aria-hidden="true" />{home.connect}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
            <div className="library-card-copy">
              <h3>{home.connect}</h3>
              <p>{home.connectBody}</p>
            </div>
            <div className="library-media">
              <Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" />
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

function UseCaseIndex() {
  const { copy } = useSite()
  const { home, cases } = copy

  return (
    <section className="section-block" aria-labelledby="scenarios-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="scenarios-title">{home.scenarios}</h2>
          <p>{home.scenariosBody}</p>
        </div>
        <ol className="case-index-list">
          {getUseCases(cases).map(({ id, audience, title, output }, index) => {
            const Icon = caseIcons[id]
            return (
              <li key={id}>
                <SiteLink page="cases" hash={id} className="case-index-row">
                  <span className="case-index-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="case-index-main">
                    <span className="chip">{audience}</span>
                    <strong>{title}</strong>
                  </span>
                  <span className="case-index-output">{output}</span>
                  <span className="case-index-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.5} /></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </SiteLink>
              </li>
            )
          })}
        </ol>
        <div className="section-action">
          <SiteLink page="cases" className="arrow-link"><span>{home.allCases}</span><ArrowRight size={15} aria-hidden="true" /></SiteLink>
        </div>
      </div>
    </section>
  )
}

function FilmSection() {
  const { copy } = useSite()
  const home = copy.home
  return (
    <section className="section-block" aria-labelledby="film-title">
      <div className="container film-panel">
        <div className="film-copy">
          <p className="mono-label">{home.film}</p>
          <h2 id="film-title">{home.reelOne}<br /><span>{home.reelTwo}</span></h2>
          <p>{home.filmNote}</p>
        </div>
        <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film} label={home.play}
          subtitle={home.filmNote} className="film-thumb">
          <img src="/media/reel.webp" alt="" width="1440" height="810" loading="lazy" decoding="async" />
          <span className="film-pill"><Play size={16} fill="currentColor" aria-hidden="true" />{home.play}</span>
        </MediaLink>
      </div>
    </section>
  )
}

function RuntimeSection() {
  const { copy, locale } = useSite()
  const { home, hosting, nav } = copy
  const profiles = getDeploymentProfiles(hosting)

  return (
    <section className="section-block" aria-labelledby="ownership-title">
      <div className="container">
        <div className="runtime-panel">
          <div className="runtime-copy">
            <p className="mono-label">{hosting.deployment}</p>
            <h2 id="ownership-title">{home.ownership}</h2>
            <p>{home.ownershipBody}</p>
            <div className="runtime-actions">
              <SiteLink page="hosting" className="btn btn--accent">{home.hostingLink}<ArrowRight size={15} aria-hidden="true" /></SiteLink>
              <a className="text-link" href={docsPath(locale)}>{nav.docs}<ArrowUpRight size={13} aria-hidden="true" /></a>
            </div>
            <div className="runtime-facts">
              <span><Server size={15} aria-hidden="true" />{hosting.linux}</span>
              {profiles.map((profile) => (
                <a href={docsPath(locale, profile.path)} key={profile.id}>
                  {profile.name} · {profile.docs}<ArrowUpRight size={12} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="runtime-governance">
            <GovernanceDetails />
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <HomeIntro />
      <Workbench />
      <CapabilityLibrary />
      <UseCaseIndex />
      <FilmSection />
      <RuntimeSection />
    </>
  )
}
