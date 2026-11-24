import {
  ArrowRight, ArrowUpRight, BookOpen, Boxes, ClipboardList,
  Globe2, Play, Scale, Server, Share2, Star,
} from 'lucide-react'
import { getDeploymentProfiles, getUseCases } from '../content'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { MediaLink } from './media'
import { SiteLink } from './site-shell'
import { GovernanceDetails, ScreenshotPlaceholder } from './visuals'

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
            aria-label={home.share}
            aria-describedby="library-share-description library-share-media"
          >
            <div className="library-card-head">
              <span><Share2 size={14} aria-hidden="true" />{home.share}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
            <div className="library-card-copy">
              <h3>{home.share}</h3>
              <p id="library-share-description">{home.shareBody}</p>
            </div>
            <div className="library-media" id="library-share-media">
              <ScreenshotPlaceholder>{copy.screenshot.skills}</ScreenshotPlaceholder>
            </div>
          </SiteLink>
          <a
            className="library-card"
            href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
            aria-label={home.connect}
            aria-describedby="library-connect-description library-connect-media"
          >
            <div className="library-card-head">
              <span><Boxes size={14} aria-hidden="true" />{home.connect}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
            <div className="library-card-copy">
              <h3>{home.connect}</h3>
              <p id="library-connect-description">{home.connectBody}</p>
            </div>
            <div className="library-media" id="library-connect-media">
              <ScreenshotPlaceholder>{copy.screenshot.connections}</ScreenshotPlaceholder>
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
      <div className="container">
        <div className="film-panel">
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
      <CapabilityLibrary />
      <UseCaseIndex />
      <FilmSection />
      <RuntimeSection />
    </>
  )
}
