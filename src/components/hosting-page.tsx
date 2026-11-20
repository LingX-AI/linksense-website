import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Boxes, Layers3, Network, Plus, Server, ShieldCheck, Workflow } from 'lucide-react'
import { docsPath, productLinks } from '../lib/site'
import { useSite } from '../lib/use-site'
import { GovernanceDetails, Hero, SectionHead } from './visuals'
import './hosting-page.css'

function HostingArchitecture() {
  const { copy: { hosting } } = useSite()
  return (
    <div className="hosting-architecture" role="group" aria-label={hosting.deployment}>
      <div className="hosting-environment">
        <p className="hosting-environment-title"><Server size={19} strokeWidth={1.6} aria-hidden="true" />{hosting.deployment}</p>
        <div className="hosting-topology">
          <div className="hosting-node hosting-node--worker">
            <span><Workflow size={32} strokeWidth={1.5} aria-hidden="true" /></span>
            <strong>{hosting.workers}</strong>
          </div>
          <svg className="hosting-node-link" viewBox="0 0 64 24" fill="none" aria-hidden="true"><path pathLength="1" d="M1 12H61M53 4L61 12L53 20" /></svg>
          <div className="hosting-node hosting-node--shared">
            <span><Layers3 size={32} strokeWidth={1.5} aria-hidden="true" /></span>
            <strong>{hosting.capabilities}</strong>
          </div>
        </div>
      </div>
      <svg className="hosting-endpoint-link" viewBox="0 0 24 48" fill="none" aria-hidden="true"><path pathLength="1" d="M12 0V44M5 37L12 44L19 37" /></svg>
      <div className="hosting-endpoint"><Network size={20} strokeWidth={1.6} aria-hidden="true" /><strong>{hosting.models}</strong></div>
    </div>
  )
}

export function HostingPage() {
  const { copy, locale } = useSite()
  const { hosting, home } = copy
  const profiles = [
    { name: 'Core', title: hosting.core, body: hosting.coreBody, link: hosting.coreDocs, path: 'deploy/core/' },
    { name: 'Full', title: hosting.full, body: hosting.fullBody, link: hosting.fullDocs, path: 'deploy/full/' },
  ]
  return (
    <div className="self-hosted-page">
      <Hero kind="hosting" title={[hosting.titleOne, hosting.titleTwo]} intro={[hosting.introOne, hosting.introTwo]} visual={<HostingArchitecture />}>
        <a className="btn" href="#profiles">{hosting.compare}<ArrowDown size={17} aria-hidden="true" /></a>
        <a className="arrow-link hosting-source" href={productLinks.github}>{hosting.source}<ArrowUpRight size={16} aria-hidden="true" /></a>
      </Hero>
      <section className="section hosting-profiles" id="profiles" aria-labelledby="profiles-title">
        <div className="container">
          <SectionHead id="profiles-title" title={hosting.compare} body={hosting.compareBody} />
          <div className="hosting-profile-pair">
            {profiles.map((item) => (
              <article className={`hosting-profile hosting-profile--${item.name.toLowerCase()}`} key={item.name} aria-labelledby={`hosting-${item.name.toLowerCase()}`}>
                <div className="hosting-profile-heading">
                  <h3 id={`hosting-${item.name.toLowerCase()}`}>{item.name}</h3>
                  {item.name === 'Full' ? <BookOpen size={29} strokeWidth={1.5} aria-hidden="true" /> : <Boxes size={29} strokeWidth={1.5} aria-hidden="true" />}
                </div>
                <p className="hosting-profile-title">{item.title}</p>
                <p className="hosting-profile-body">{item.body}</p>
                <div className="hosting-profile-composition" aria-hidden="true">
                  <span><Workflow size={17} strokeWidth={1.6} />Core</span>
                  {item.name === 'Full' && <><Plus size={15} strokeWidth={1.5} /><span><BookOpen size={17} strokeWidth={1.6} />{home.capabilityKnowledge}</span></>}
                </div>
                <a className="hosting-guide" href={docsPath(locale, item.path)}>{item.link}<ArrowRight size={18} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
          <p className="hosting-platform"><Server size={17} strokeWidth={1.6} aria-hidden="true" />{hosting.linux}</p>
        </div>
      </section>
      <section className="section hosting-governance" id="governance" aria-labelledby="governance-title">
        <div className="container hosting-governance-grid">
          <div className="hosting-governance-copy">
            <SectionHead id="governance-title" title={hosting.governance} />
            <aside className="hosting-boundary" aria-labelledby="hosting-boundary-title">
              <ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" />
              <h3 id="hosting-boundary-title">{hosting.boundaries}</h3>
              <p>{hosting.boundaryBody}</p>
              <a className="arrow-link" href={productLinks.security}>{hosting.security}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </aside>
          </div>
          <GovernanceDetails />
        </div>
      </section>
    </div>
  )
}
