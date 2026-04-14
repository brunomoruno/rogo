import { useRef } from 'react'
import './App.css'
import { StickyNav } from './components/StickyNav'
import { Reveal } from './components/Reveal'
import { InspirationSection } from './components/InspirationSection'
import { usePastHero } from './hooks/usePastHero'

const linkedinPostUrl = import.meta.env.VITE_LINKEDIN_POST_URL?.trim() ?? ''
const xPostUrl = import.meta.env.VITE_X_POST_URL?.trim() ?? ''

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const navVisible = usePastHero(heroRef)

  return (
    <div className="app">
      <StickyNav visible={navVisible} />

      <div className="beans-page">
        <div className="beans-layout beans-layout--simple">
          <div className="beans-layout__spacer" aria-hidden />
          <div className="beans-layout__column">
            <div className="beans-main">
              <header ref={heroRef} className="hero" id="top">
                <div className="hero__inner">
                  <h1 className="hero__title">champ launch</h1>
                  <p className="hero__intro">
                    Hi all, we&apos;re really excited to share Champ, a project we&apos;ve poured a ton of
                    energy into, which supercharges operations teams with AI agents so scaling never
                    creates bottlenecks. Please comment, like, repost, and share -- we are so so
                    grateful for your support.
                  </p>
                  <div className="post-links">
                    <a
                      href={linkedinPostUrl || '#'}
                      className="btn btn--primary"
                      target={linkedinPostUrl ? '_blank' : undefined}
                      rel={linkedinPostUrl ? 'noreferrer noopener' : undefined}
                      onClick={(e) => {
                        if (!linkedinPostUrl) e.preventDefault()
                      }}
                      title={
                        linkedinPostUrl ? undefined : 'Set VITE_LINKEDIN_POST_URL in .env'
                      }
                      aria-disabled={!linkedinPostUrl}
                    >
                      LinkedIn (highest priority)
                    </a>
                    <a
                      href={xPostUrl || '#'}
                      className="btn btn--ghost post-links__x"
                      target={xPostUrl ? '_blank' : undefined}
                      rel={xPostUrl ? 'noreferrer noopener' : undefined}
                      onClick={(e) => {
                        if (!xPostUrl) e.preventDefault()
                      }}
                      title={xPostUrl ? undefined : 'Set VITE_X_POST_URL in .env'}
                      aria-disabled={!xPostUrl}
                    >
                      X post
                    </a>
                  </div>
                </div>
              </header>

              <section id="mission" className="section section--mission">
                <Reveal>
                  <ul className="key-points">
                    <li>
                      <strong>Champ</strong> is the <strong>AI agents platform</strong> for operations.
                      You upload an <strong>SOP</strong> (or describe the process) and the copilot
                      builds a workflow that runs with <strong>browser</strong>, <strong>document</strong>
                      , and <strong>voice</strong> agents, all <strong>orchestrated together</strong>.
                    </li>
                    <li>
                      <strong>Judgment work at scale</strong>. Engineering automates the easy stuff
                      (APIs, pipelines), but the work that requires judgment still needs people:{' '}
                      <strong>PDFs</strong>, <strong>government portals</strong>, tax/compliance, calling
                      insurance companies.
                    </li>
                    <li>
                      <strong>Human-in-the-loop control</strong>. When an agent isn&apos;t confident, it
                      escalates to your team in <strong>Slack</strong> with full context so you stay in
                      control.
                    </li>
                    <li>
                      When you comment, avoid hype. Frame this as{' '}
                      <strong>instant scalability</strong> for ops teams (not replacing people), and
                      keep it concrete: portals, documents, calls, and escalation when confidence is
                      low.
                    </li>
                  </ul>
                </Reveal>
              </section>

              <InspirationSection />
            </div>
          </div>
          <div className="beans-layout__spacer" aria-hidden />
        </div>
      </div>
    </div>
  )
}

export default App
