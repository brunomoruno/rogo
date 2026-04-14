import { useCallback, useEffect, useState } from 'react'
import { Reveal } from './Reveal'
import { fetchInspirationBatch } from '../lib/generateInspiration'

type Platform = 'linkedin' | 'x'

const PRESETS: Record<Platform, { repost: string[]; comment: string[] }> = {
  linkedin: {
    repost: [
      "The hardest part of ops at scale isn’t the “automation” you can write once. It’s all the judgment work that lives in PDFs, portals, and phone calls. Champ is one of the first products I’ve seen that treats that as the core problem, not an edge case. Curious what workflows people are most excited to hand off first.",
      "Most teams hit a wall where they can automate the easy API stuff, but the messy work still needs humans: compliance forms, tax portals, insurance hold music. Champ’s framing (“people are never the bottleneck”) is the right North Star. The escalation-to-Slack pattern is especially important if you want trust + control.",
      "If you’ve ever tried to onboard tens of thousands of people quickly, you know the pain isn’t just volume. It’s variance. Different documents, different edge cases, different portals that break every Tuesday. Champ feels built for that reality: agents that operate in the same systems your team is stuck in.",
      "I like that Champ isn’t stitched together from three vendors. Browser + docs + voice, orchestrated as one workflow, with a clear confidence/escalation loop. That’s the difference between “AI demo” and something an ops leader can actually run in production.",
      "The real promise here isn’t replacing ops teams. It’s giving them instant scalability without losing judgment. If Champ can reliably handle the repetitive steps and surface the weird cases with full context, that’s a meaningful shift in how operations orgs are staffed and managed.",
    ],
    comment: [
      "This nails the ops reality: you can automate the clean, deterministic pieces, but the judgment work still eats the team alive. Champ going after portals + documents + phone calls in one workflow is the real unlock here.",
      "The “people are never the bottleneck” framing is exactly right. The Slack escalation loop is what turns this from a demo into something an ops team can trust.",
      "SOP → copilot → workflow is a great abstraction. It fits how ops leaders actually reason about work, instead of forcing everything into prompts and one-off scripts.",
      "Browser + docs + voice only works when orchestration is first-class. Retries, fallbacks, and clean handoffs are the difference between a prototype and production.",
      "The best version of AI in ops is leverage with accountability. Let agents do the repetitive steps, and let humans own the edge cases that require judgment.",
    ],
  },
  x: {
    repost: [
      "ops at scale breaks on the stuff you *can’t* API. portals, PDFs, phone calls. Champ is going straight at that.",
      "the “AI demo → production workflow” gap is basically orchestration + escalation. Champ seems to understand that.",
      "onboarding 500k people in a month is a war story. building a platform so nobody has to do that again is the right kind of ambition.",
      "browser + doc + voice agents as one workflow (not 3 vendors taped together) is the only way this works in real ops.",
      "AI won’t replace ops teams. but it can give them instant scalability *if* you keep humans in the loop on low-confidence steps. Champ’s approach is sane.",
    ],
    comment: [
      "this is the real ops bottleneck: judgment work hiding in messy docs + portals + phone trees. champ going straight at execution (not dashboards) is the right move.",
      "love the escalation-to-slack pattern. “AI handles the boring steps, humans handle the weird ones” is the only model that scales.",
      "SOP → workflow is such a better abstraction than “prompt → output.” does Champ track confidence per step or just per run?",
      "the multi-agent thing only matters if orchestration is first-class. otherwise it’s just three tools and a prayer.",
      "if you’ve ever run compliance/tax/insurance ops, you know why this matters. portals change, forms drift, edge cases explode. agents that *navigate* is the point.",
    ],
  },
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

function CopyLine({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }, [text])

  return (
    <button type="button" className="inspiration-line__copy" onClick={onCopy}>
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

export function InspirationSection() {
  const [platform, setPlatform] = useState<Platform>('linkedin')
  const [repostItems, setRepostItems] = useState<string[]>(() => PRESETS.linkedin.repost)
  const [commentItems, setCommentItems] = useState<string[]>(() => PRESETS.linkedin.comment)
  const [repostLoading, setRepostLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  const [repostError, setRepostError] = useState<string | null>(null)
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => {
    setRepostItems(PRESETS[platform].repost)
    setCommentItems(PRESETS[platform].comment)
    setRepostError(null)
    setCommentError(null)
  }, [platform])

  const refreshRepost = useCallback(async () => {
    setRepostLoading(true)
    setRepostError(null)
    try {
      const next = await fetchInspirationBatch(platform, 'repost')
      setRepostItems(next)
    } catch (e) {
      // If AI is not configured, fall back to shuffling the placeholders.
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setRepostError(msg)
      setRepostItems((prev) => shuffle(prev))
    } finally {
      setRepostLoading(false)
    }
  }, [platform])

  const refreshComment = useCallback(async () => {
    setCommentLoading(true)
    setCommentError(null)
    try {
      const next = await fetchInspirationBatch(platform, 'comment')
      setCommentItems(next)
    } catch (e) {
      // If AI is not configured, fall back to shuffling the placeholders.
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setCommentError(msg)
      setCommentItems((prev) => shuffle(prev))
    } finally {
      setCommentLoading(false)
    }
  }, [platform])

  const repostLabel = platform === 'linkedin' ? 'Repost commentary' : 'Quote-post'
  const commentLabel = platform === 'linkedin' ? 'Comment' : 'Reply'

  return (
    <section id="inspiration" className="section section--inspiration">
      <Reveal>
        <h2 className="inspiration__title">AI generated examples</h2>
        <p className="inspiration__subtitle">(tweak slightly)</p>

        <div className="inspiration__toggle-wrap">
          <div className="segmented inspiration__segmented" role="group" aria-label="Platform">
            <button
              type="button"
              className={`segmented__btn ${platform === 'linkedin' ? 'segmented__btn--active' : ''}`}
              onClick={() => setPlatform('linkedin')}
            >
              LinkedIn
            </button>
            <button
              type="button"
              className={`segmented__btn ${platform === 'x' ? 'segmented__btn--active' : ''}`}
              onClick={() => setPlatform('x')}
            >
              X
            </button>
          </div>
        </div>

        <div className="inspiration-grid">
          <div className="inspiration-box">
            <h3 className="inspiration-box__label">{repostLabel}</h3>
            <ul
              className="inspiration-box__list"
              aria-busy={repostLoading}
            >
              {repostItems.map((text, i) => (
                <li key={`${platform}-repost-${i}`} className="inspiration-line">
                  <p className="inspiration-line__text">{text}</p>
                  <CopyLine text={text} />
                </li>
              ))}
            </ul>
            {repostError ? <p className="inspiration-box__error">{repostError}</p> : null}
            <button
              type="button"
              className="btn btn--primary inspiration-box__refresh"
              onClick={refreshRepost}
              disabled={repostLoading}
            >
              {repostLoading ? 'Generating...' : 'Refresh'}
            </button>
          </div>

          <div className="inspiration-box">
            <h3 className="inspiration-box__label">{commentLabel}</h3>
            <ul
              className="inspiration-box__list"
              aria-busy={commentLoading}
            >
              {commentItems.map((text, i) => (
                <li key={`${platform}-comment-${i}`} className="inspiration-line">
                  <p className="inspiration-line__text">{text}</p>
                  <CopyLine text={text} />
                </li>
              ))}
            </ul>
            {commentError ? <p className="inspiration-box__error">{commentError}</p> : null}
            <button
              type="button"
              className="btn btn--primary inspiration-box__refresh"
              onClick={refreshComment}
              disabled={commentLoading}
            >
              {commentLoading ? 'Generating...' : 'Refresh'}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
