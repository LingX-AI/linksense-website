import { useReducedMotion } from 'motion/react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, FileSpreadsheet, FileText, Star,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getUseCases } from '../content'
import { expansionProgress } from '../lib/cuberto'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { hoverPreview, MediaLink, Poster, Showreel, stopPreview } from './media'
import { SiteLink } from './site-shell'
import { MaskedText, Reveal, useMediaQuery } from './cuberto-motion'
import { GovernanceDetails, Hero, SectionHead } from './visuals'

function HomeHero() {
  const { copy } = useSite()
  const { home, nav } = copy
  return (
    <Hero
      kind="home"
      title={[home.titleOne, home.titleTwo]}
      intro={[home.introOne, home.introTwo]}
      details={
        <>
          <a className="hero-source" href={productLinks.github}>
            <Star size={14} fill="currentColor" aria-hidden="true" />{copy.footer.source}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <a className="hero-scroll" href="#workspace">{home.scroll}<ArrowDown size={14} aria-hidden="true" /></a>
        </>
      }
    >
      <a className="pill" href={productLinks.demo}>
        {nav.demo}<ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <SiteLink page="hosting" className="pill pill--outline">
        {home.hostingLink}<ArrowRight size={16} aria-hidden="true" />
      </SiteLink>
    </Hero>
  )
}

function Reel() {
  const { copy } = useSite()
  return (
    <section className="reel-section" aria-label={copy.home.film}>
      <div className="shell">
        <Showreel
          source="/media/linksense-intro-v6.mp4"
          poster="/media/reel-cover.webp"
          title={copy.home.film}
          label={copy.home.play}
          subtitle={copy.home.filmNote}
        />
      </div>
    </section>
  )
}

function WorkspaceOverview() {
  const { copy } = useSite()
  const { home, cases } = copy
  return (
    <section className="section" id="workspace" aria-labelledby="workspace-title">
      <div className="shell">
        <SectionHead
          id="workspace-title"
          label={home.overview}
          title={home.overviewResult}
          body={home.overviewBody}
        />
        <Reveal className="overview-media" distance={50}>
          <MediaLink
            source="/media/product-demo.mp4"
            poster="/media/workspace.webp"
            title={home.recording}
            className="overview-link"
          >
            <Poster name="workspace-result" alt={home.workspaceAlt} preview="workspace-teaser" playOnView />
            <span className="media-badge" aria-hidden="true">{home.recording}<ArrowUpRight size={14} /></span>
          </MediaLink>
        </Reveal>
        <div className="overview-details">
          <Reveal className="overview-task" distance={40}>
            <p className="label">{home.exampleTask}</p>
            <h3>{cases.procurement}</h3>
            <p>{home.exampleInput}</p>
            <SiteLink page="cases" hash="procurement" className="text-link">
              {home.workflowLink}<ArrowRight size={15} aria-hidden="true" />
            </SiteLink>
          </Reveal>
          <Reveal className="overview-files" id="deliverables" distance={40} delay={0.1}>
            <p className="label">{home.example}</p>
            <ul aria-label={home.example} className="file-list">
              <li><FileSpreadsheet size={18} aria-hidden="true" /><span>{home.spreadsheet}</span><small>XLSX</small></li>
              <li><FileText size={18} aria-hidden="true" /><span>{home.report}</span><small>DOCX</small></li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

type Service = {
  id: string
  title: string
  body: string
  image: string
  action: ReactNode
}

function Services() {
  const { copy, locale } = useSite()
  const { home } = copy
  const desktop = useMediaQuery('(min-width: 48rem)')
  const reduced = useReducedMotion()
  const [openIndex, setOpenIndex] = useState(0)
  const list = useRef<HTMLDivElement>(null)

  const services: Service[] = [
    {
      id: 'work', title: home.work, body: home.workBody, image: 'workspace',
      action: <SiteLink page="cases" hash="procurement">{home.view}</SiteLink>,
    },
    {
      id: 'files', title: home.files, body: home.filesBody, image: 'workspace-result',
      action: <SiteLink page="cases" hash="reporting">{home.view}</SiteLink>,
    },
    {
      id: 'share', title: home.share, body: home.shareBody, image: 'skills',
      action: <SiteLink page="cases" hash="capability-sharing">{home.view}</SiteLink>,
    },
    {
      id: 'connect', title: home.connect, body: home.connectBody, image: 'connections',
      action: <a href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}>{home.view}<ArrowUpRight size={14} aria-hidden="true" /></a>,
    },
  ]

  useEffect(() => {
    const root = list.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.service-card'))
    if (!cards.length) return
    if (!desktop || reduced) {
      if (reduced && desktop) cards.forEach((card) => { card.style.setProperty('--p', '1') })
      return () => { cards.forEach((card) => { card.style.removeProperty('--p'); card.style.removeProperty('--rows') }) }
    }
    let frame = 0
    const apply = () => {
      frame = 0
      const viewport = window.innerHeight
      cards.forEach((card, index) => {
        const progress = index === 0 ? 1 : expansionProgress(card.getBoundingClientRect().top, viewport)
        card.style.setProperty('--p', progress.toFixed(3))
        const panel = card.querySelector<HTMLElement>('.service-panel')
        if (panel) {
          panel.style.setProperty('--rows', `${progress.toFixed(3)}fr`)
          panel.inert = progress < 0.5
        }
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cards.forEach((card) => {
        card.style.removeProperty('--p')
        const panel = card.querySelector<HTMLElement>('.service-panel')
        if (panel) {
          panel.style.removeProperty('--rows')
          panel.inert = false
        }
      })
    }
  }, [desktop, reduced])

  return (
    <section className="services">
      <div className="shell">
        <div className="services-list" ref={list}>
          {services.map((service, index) => {
            const open = openIndex === index
            return (
              <article className="service-card" key={service.id} data-open={desktop ? undefined : open}>
                <div className="service-bg" aria-hidden="true">
                  <img src={`/media/${service.image}.webp`} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="service-top">
                  <h3 className="service-title">
                    {desktop ? service.title : (
                      <button
                        type="button"
                        className="service-toggle"
                        aria-expanded={open}
                        aria-controls={`service-panel-${service.id}`}
                        onClick={() => setOpenIndex(open ? -1 : index)}
                      >
                        {service.title}
                      </button>
                    )}
                  </h3>
                  <span className="service-num" aria-hidden="true">0{index + 1}</span>
                </div>
                <div className="service-panel" id={`service-panel-${service.id}`} inert={!desktop && !open}>
                  <div className="service-panel-inner">
                    <div className="service-panel-content">
                      <p>{service.body}</p>
                      <div className="service-link">{service.action}<ArrowRight size={15} aria-hidden="true" /></div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WorkCard({ index, page, hash, meta, title, output, image, preview, ratio }: {
  index: number
  page: 'cases' | 'hosting'
  hash?: string
  meta: string
  title: string
  output?: string
  image: string
  preview?: string
  ratio: 'portrait' | 'square'
}) {
  const content = (
    <>
      <span className={`work-frame work-frame--${ratio}`}>
        <img src={`/media/${image}.webp`} alt="" loading="lazy" decoding="async" />
        {preview && (
          <video
            aria-hidden="true"
            tabIndex={-1}
            src={`/media/${preview}.mp4`}
            preload="none"
            muted
            loop
            playsInline
            className="work-video"
            onPlaying={({ currentTarget }) => { currentTarget.dataset.playing = '' }}
            onPause={({ currentTarget }) => { delete currentTarget.dataset.playing }}
            onEnded={({ currentTarget }) => { delete currentTarget.dataset.playing }}
          />
        )}
      </span>
      <span className="work-caption">
        <span className="work-meta">{meta}</span>
        <span className="work-name">{title}</span>
        {output && <span className="work-output">{output}</span>}
      </span>
    </>
  )
  return (
    <Reveal className="work-item" delay={index * 0.08} distance={60}>
      <SiteLink page={page} hash={hash} className="work-card"
        onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
        {content}
      </SiteLink>
    </Reveal>
  )
}

function UseCases() {
  const { copy } = useSite()
  const { home, cases } = copy
  const examples = getUseCases(cases)
  const media = [
    { image: 'workspace-result', ratio: 'portrait' as const, preview: 'workspace-teaser' },
    { image: 'menu-use-cases', ratio: 'square' as const },
    { image: 'signal', ratio: 'portrait' as const },
  ]
  return (
    <section className="work" aria-labelledby="scenarios-title">
      <div className="shell">
        <div className="work-head">
          <div>
            <p className="label work-label">{home.scenarios}</p>
            <MaskedText as="h2" id="scenarios-title" className="work-title">{copy.nav.cases}</MaskedText>
          </div>
          <Reveal className="work-intro" delay={0.1}>
            <p>{home.scenariosBody}</p>
            <SiteLink page="cases" className="pill pill--light">
              {home.allCases}<ArrowRight size={15} aria-hidden="true" />
            </SiteLink>
          </Reveal>
        </div>
        <div className="work-grid">
          <div className="work-col">
            {examples.slice(0, 2).map((example, index) => (
              <WorkCard key={example.id} index={index} page="cases" hash={example.id}
                meta={example.audience} title={example.title} output={example.output}
                image={media[index]?.image ?? 'workspace-result'} preview={media[index]?.preview}
                ratio={media[index]?.ratio ?? 'square'} />
            ))}
          </div>
          <div className="work-col work-col--offset">
            {examples.slice(2).map((example, index) => (
              <WorkCard key={example.id} index={index + 2} page="cases" hash={example.id}
                meta={example.audience} title={example.title} output={example.output}
                image={media[index + 2]?.image ?? 'signal'}
                ratio={media[index + 2]?.ratio ?? 'portrait'} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Team() {
  const { copy, locale } = useSite()
  const { home, cases } = copy
  return (
    <section className="section team" aria-labelledby="team-title">
      <div className="shell">
        <SectionHead id="team-title" label={cases.enablement} title={home.teamTitle} body={home.teamBody} />
        <div className="team-list">
          <Reveal className="team-item" distance={50}>
            <SiteLink page="cases" hash="capability-sharing" className="team-row"
              onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
              <div className="team-media"><Poster name="skills" alt={home.skillsAlt} preview="skills-preview" /></div>
              <div className="team-copy">
                <span className="team-number" aria-hidden="true">01</span>
                <span className="team-name">{home.share}</span>
                <span className="team-body">{home.shareBody}</span>
                <span className="round-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
              </div>
            </SiteLink>
          </Reveal>
          <Reveal className="team-item" distance={50} delay={0.1}>
            <a className="team-row team-row--reverse" href={docsPath(locale, 'user-guide/mcp/connect-and-manage/')}
              onPointerEnter={hoverPreview} onPointerLeave={stopPreview}>
              <div className="team-media"><Poster name="connections" alt={home.connectionsAlt} preview="connections-preview" /></div>
              <div className="team-copy">
                <span className="team-number" aria-hidden="true">02</span>
                <span className="team-name">{home.connect}</span>
                <span className="team-body">{home.connectBody}</span>
                <span className="round-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Ownership() {
  const { copy } = useSite()
  const { home, nav } = copy
  return (
    <section className="section ownership" aria-labelledby="ownership-title">
      <div className="shell">
        <SectionHead id="ownership-title" label={nav.hosting} title={home.ownership} body={home.ownershipBody} />
        <GovernanceDetails />
        <Reveal className="section-action" delay={0.15}>
          <SiteLink page="hosting" className="pill">
            {home.hostingLink}<ArrowRight size={16} aria-hidden="true" />
          </SiteLink>
        </Reveal>
      </div>
    </section>
  )
}

function Closing() {
  const { copy } = useSite()
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="shell closing-inner">
        <MaskedText as="h2" id="closing-title" className="closing-title">
          {copy.footer.titleOne}<br />{copy.footer.titleTwo}
        </MaskedText>
        <Reveal className="closing-actions" delay={0.1} distance={30}>
          <a className="pill pill--light" href={productLinks.demo}>
            {copy.nav.demo}<ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a className="pill pill--ghost" href={productLinks.github}>
            {copy.nav.github}<ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <HomeHero />
      <Reel />
      <WorkspaceOverview />
      <Services />
      <UseCases />
      <Team />
      <Ownership />
      <Closing />
    </>
  )
}
