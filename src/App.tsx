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
                  <h1 className="hero__title">felix launch</h1>
                  <p className="hero__intro">
                    Hi all - we&apos;re super excited for the launch of Felix, a project we&apos;ve put
                    tooons of energy into. This is a huge moment for the Rogo team and we&apos;re so
                    grateful to have your support.
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
                      LinkedIn — highest priority
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
                      <strong>Felix</strong> is Rogo&apos;s <strong>AI agent</strong> — you delegate
                      over <strong>email</strong> and <strong>Teams</strong>; it delivers{' '}
                      <strong>pitch materials</strong>, <strong>models</strong>, <strong>filings</strong>,
                      and coordination across tools you already use. <strong>Available 24/7.</strong>
                    </li>
                    <li>
                      <strong>Execution, not dashboards</strong> — it runs{' '}
                      <strong>real workflows</strong> across spreadsheets, decks, PDFs, and research.
                      Not another <strong>analytics layer</strong> that shows you{' '}
                      <strong>problems it can&apos;t solve</strong>.
                    </li>
                    <li>
                      <strong>The apprenticeship narrative</strong> — finance became{' '}
                      <strong>pure execution</strong>. Felix brings back juniors building{' '}
                      <strong>judgment</strong> and seniors <strong>mentoring</strong> and{' '}
                      <strong>winning deals</strong>.{' '}
                      <strong>
                        The senior/junior dual storyline is the heart of the launch.
                      </strong>
                    </li>
                    <li>
                      When you comment — say <strong>agent/teammate</strong>, never{' '}
                      <strong>chatbot</strong>. Never frame as <strong>replacing people</strong>. No{' '}
                      <strong>valuation</strong> speculation. No <strong>competitor names</strong>.
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
