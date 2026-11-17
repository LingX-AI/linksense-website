import { ArrowDown, ArrowUpRight, BookOpen, ClipboardList, FileSpreadsheet, FileText, Play, Scale } from 'lucide-react'
import { getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaCue, MediaLink, placeCue, Poster, stopPreview } from './media'
import { CircleArrow, SiteLink } from './site-shell'
import { Hero, MaskedLines } from './visuals'
import type { ReactNode } from 'react'

function Feature({ position, title, body, children }: {
  position: 'share' | 'connect'
  title: string
  body: string
  children: ReactNode
}) {
  return (
    <article className={`feature feature--${position}`}>
      <figure className="feature-motion">
        {children}
        <figcaption className="feature-caption">
          <h3>{title}</h3>
          <p>{body}</p>
        </figcaption>
      </figure>
    </article>
  )
}

function WorkspaceShowcase() {
  const { copy } = useSite()
  const { home, cases } = copy

  return (
    <section className="workspace-section site-gutter" id="workspace" aria-labelledby="workspace-title">
      <div className="workspace-showcase">
        <div className="workspace-product">
          <MediaLink source="/media/product-demo.mp4" poster="/media/workspace.webp" title={home.recording}
            className="workspace-media" preview>
            <Poster name="workspace" alt={home.workspaceAlt} preview="workspace-preview" eager />
            <span className="media-default"><Play size={14} fill="currentColor" aria-hidden="true" />{home.recording}</span>
          </MediaLink>
          <div className="workspace-caption">
            <h2 id="workspace-title">{home.overview}</h2>
            <p>{home.workBody}</p>
          </div>
        </div>
        <article className="workspace-example">
          <p className="workspace-label"><ClipboardList size={16} aria-hidden="true" />{home.exampleTask}</p>
          <h3>{cases.procurement}</h3>
          <p>{home.exampleInput}</p>
          <ul aria-label={home.example} className="workspace-files">
            <li><FileSpreadsheet size={18} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
            <li><FileText size={18} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
          </ul>
          <SiteLink page="cases" hash="procurement" className="workspace-example-link">
            {home.workflowLink}<ArrowUpRight size={16} aria-hidden="true" />
          </SiteLink>
        </article>
      </div>
      <div className="workspace-outputs">
        <h3>{home.files}</h3>
        <p>{home.filesBody}</p>
      </div>
    </section>
  )
}

const caseIcons = { procurement: Scale, reporting: ClipboardList, knowledge: BookOpen }

function UseCasePreview() {
  const { copy } = useSite()

  return (
    <section className="scenario-section site-gutter" aria-labelledby="scenarios-title">
      <div className="editorial-intro">
        <MaskedLines id="scenarios-title" className="section-title" as="h2" lines={[copy.home.scenarios]} />
        <p>{copy.home.scenariosBody}</p>
      </div>
      <div className="scenario-grid">
        {getUseCases(copy.cases).map(({ id, audience, title, output }) => {
          const Icon = caseIcons[id]
          return (
            <article className="scenario-card" data-case={id} key={id}>
              <span className="scenario-icon" aria-hidden="true"><Icon size={23} strokeWidth={1.6} /></span>
              <p className="scenario-label">{audience}</p>
              <h3><SiteLink page="cases" hash={id}>{title}<ArrowUpRight size={18} aria-hidden="true" /></SiteLink></h3>
              <p className="scenario-output">{output}</p>
            </article>
          )
        })}
      </div>
      <SiteLink page="cases" className="text-action scenario-action"><span>{copy.home.allCases}</span><CircleArrow /></SiteLink>
    </section>
  )
}

export function HomePage() {
  const { copy, locale } = useSite()
  const home = copy.home

  return (
    <>
      <Hero kind="home" intro={[home.introOne, home.introTwo]} title={[home.titleOne, home.titleTwo]}>
        <a className="primary-action" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
        <a className="hero-secondary" href="#workspace">{home.scroll}<ArrowDown size={16} aria-hidden="true" /></a>
      </Hero>
      <WorkspaceShowcase />
      <UseCasePreview />
      <section className="team-section site-gutter">
        <div className="editorial-intro">
          <MaskedLines className="section-title" as="h2" lines={[home.teamTitle]} />
          <p>{home.teamBody}</p>
        </div>
        <div className="feature-grid">
          <Feature position="share" title={home.share} body={home.shareBody}>
            <SiteLink page="cases" hash="capability-sharing" className="feature-media feature-media--share" onPointerEnter={hoverPreview}
              onPointerLeave={stopPreview} onPointerMove={placeCue}>
              <Poster name="skills" alt={home.skillsAlt} preview="skills-preview" />
              <span className="feature-corner"><ArrowUpRight size={18} aria-hidden="true" /></span>
              <MediaCue label={home.view} />
            </SiteLink>
          </Feature>
          <Feature position="connect" title={home.connect} body={home.connectBody}>
            <a className="feature-media feature-media--connect" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
              onPointerEnter={hoverPreview} onPointerLeave={stopPreview} onPointerMove={placeCue}>
              <Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" />
              <span className="feature-corner"><ArrowUpRight size={18} aria-hidden="true" /></span>
              <MediaCue label={home.view} />
            </a>
          </Feature>
        </div>
      </section>
      <section className="reel-section">
        <div className="reel-stage">
          <div className="reel-type" aria-hidden="true">
            <span>{home.reelOne}</span><span>{home.reelTwo}</span>
          </div>
          <h2 className="sr-only">{home.film}</h2>
          <div className="reel-frame">
            <MediaLink source="/media/linksense-intro-v6.mp4" poster="/media/reel.webp" title={home.film} label={home.play}
              subtitle={home.filmNote} className="reel-link">
              <img src="/media/reel.webp" alt="" width="1440" height="810" loading="lazy" decoding="async" />
              <span className="reel-play"><Play size={21} fill="currentColor" aria-hidden="true" />{home.play}</span>
              <MediaCue label={home.play} play />
            </MediaLink>
          </div>
          <p className="reel-caption">{home.filmNote}</p>
        </div>
      </section>
      <section className="ownership-section site-gutter">
        <MaskedLines className="section-title" as="h2" lines={[home.ownership]} />
        <div>
          <p>{home.ownershipBody}</p>
          <SiteLink page="hosting" className="text-action mt-8 w-fit"><span>{home.hostingLink}</span><CircleArrow /></SiteLink>
        </div>
      </section>
    </>
  )
}
