import {
  ArrowDown, ArrowRight, ArrowUpRight, FileSpreadsheet, Monitor,
  Play, Server, Share2, Star,
} from 'lucide-react'
import { productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { ProductVideoLink } from './media'
import { HeroWorkspace } from './hero-workspace'
import { HeroBackground } from './hero-background'
import { TeamCapabilities } from './team-capabilities'
import { ScenarioDeck } from './scenario-deck'
import { SiteLink } from './site-shell'
import { DeploymentDiagram, FileList, GovernanceDetails, SectionHead } from './visuals'

function HomeHero() {
  const { copy } = useSite()
  const { home, nav } = copy
  return (
    <section className="hero hero--home" aria-labelledby="page-title">
      <HeroBackground />
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="h1 hero-title" id="page-title">{home.titleOne}<span>{home.titleTwo}</span></h1>
          <p className="lead hero-lead">{home.introOne} {home.introTwo}</p>
          <div className="hero-actions">
            <a className="btn" href={productLinks.demo}>{nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
            <SiteLink page="hosting" className="btn btn--secondary">{home.hostingLink}<ArrowRight size={17} aria-hidden="true" /></SiteLink>
          </div>
          <a className="hero-source" href={productLinks.github}>
            <Star size={15} fill="currentColor" aria-hidden="true" />{copy.footer.source}<ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-visual">
          <HeroWorkspace />
        </div>
      </div>
      <div className="container hero-bottom">
        <ul className="hero-rail">
          <li><a href="#workspace"><Monitor size={17} aria-hidden="true" /><span>{home.work}</span><ArrowDown size={14} aria-hidden="true" /></a></li>
          <li><a href="#deliverables"><FileSpreadsheet size={17} aria-hidden="true" /><span>{home.files}</span><ArrowDown size={14} aria-hidden="true" /></a></li>
          <li><a href="#team-title"><Share2 size={17} aria-hidden="true" /><span>{home.share}</span><ArrowDown size={14} aria-hidden="true" /></a></li>
          <li><SiteLink page="hosting"><Server size={17} aria-hidden="true" /><span>{nav.hosting}</span><ArrowRight size={14} aria-hidden="true" /></SiteLink></li>
        </ul>
      </div>
    </section>
  )
}

function WorkspaceShowcase() {
  const { copy: { home, cases } } = useSite()
  return (
    <section className="section workspace-section" id="workspace" aria-labelledby="workspace-title">
      <div className="container">
        <SectionHead id="workspace-title" title={`${home.overview} ${home.overviewResult}`} body={home.overviewBody} />
        <div className="workspace-details">
          <div className="workspace-request">
            <p className="detail-label">{home.exampleTask}</p>
            <h3>{cases.procurement}</h3>
            <p>{home.exampleInput}</p>
            <SiteLink page="cases" hash="procurement" className="arrow-link">
              {home.workflowLink}<ArrowRight size={16} aria-hidden="true" />
            </SiteLink>
          </div>
          <span className="workspace-bridge" aria-hidden="true"><ArrowRight size={19} /></span>
          <div className="workspace-output" id="deliverables">
            <h3 className="detail-label">{home.example}</h3>
            <FileList />
          </div>
        </div>
      </div>
    </section>
  )
}

function FilmSection() {
  const { copy: { home } } = useSite()
  return (
    <aside className="film-section" id="film" aria-labelledby="film-title">
      <div className="container film-grid">
        <ProductVideoLink title={home.videoTitle} label={home.videoPlay}
          subtitle={home.videoNote} className="film-link">
          <span className="film-play-icon"><Play size={20} fill="currentColor" aria-hidden="true" /></span>
          <div className="film-copy">
            <h3 id="film-title">{home.reelOne}{' '}{home.reelTwo}</h3>
            <p>{home.videoNote}</p>
          </div>
          <span className="film-play">
            <span>{home.videoPlay}</span><ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </ProductVideoLink>
      </div>
    </aside>
  )
}

function OwnershipSection() {
  const { copy: { home } } = useSite()
  return (
    <section className="section ownership-section" aria-labelledby="ownership-title">
      <div className="container">
        <SectionHead id="ownership-title" title={home.ownership.split(/(?<=[，、])/u).map((phrase) => (
          <span className="heading-phrase" key={phrase}>{phrase}</span>
        ))} body={home.ownershipBody} />
        <div className="ownership-layout">
          <DeploymentDiagram variant="overview" />
          <div>
            <GovernanceDetails />
            <SiteLink page="hosting" className="arrow-link ownership-action">{home.hostingLink}<ArrowRight size={16} aria-hidden="true" /></SiteLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  const { copy } = useSite()
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="container">
        <div className="closing-inner">
          <h2 className="h2" id="closing-title">{copy.footer.titleOne}{' '}<span>{copy.footer.titleTwo}</span></h2>
          <div className="closing-actions">
            <a className="btn" href={productLinks.demo}>{copy.nav.demo}<ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="btn btn--secondary" href={productLinks.github}>{copy.nav.github}<ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="home-flow">
        <WorkspaceShowcase />
        <ScenarioDeck />
        <TeamCapabilities />
        <FilmSection />
        <OwnershipSection />
        <ClosingCta />
      </div>
    </>
  )
}
