import { useCallback, useEffect, useState } from 'react'
import { Reveal } from './Reveal'
import { fetchInspirationBatch, type Platform } from '../lib/generateInspiration'

const PRESETS: Record<Platform, { repost: string[]; comment: string[] }> = {
  linkedin: {
    repost: [
      "Really happy to see @Rogo launch Felix. What's always stood out to me about this team is they actually come from finance. They've lived the workflows, they know where things break. Felix is their AI agent that handles execution through email. Not a chatbot, not another dashboard. Just a teammate that does the work.",
      "Finance used to work differently. You'd sit with a senior banker, watch how they handled a client, pick things up over time through proximity. At some point juniors became production lines and that stopped happening. @Rogo just launched Felix so the dynamic can shift back. Juniors develop judgment. Seniors actually get to bring their people along.",
      "I've been in the seat this product is built for. The hard part wasn't the hours, it was knowing that most of what you were doing was mechanical. Reformatting the same data, toggling between tools, sending updates. @Rogo just launched Felix and it's honestly the product I wish existed when I was coming up.",
      "Most AI tools in finance struggle with adoption because they ask people to change how they work. @Rogo went the other way with Felix. You just email it, like you'd email anyone on your team. It works across your existing tools. No new login, no learning curve. Really underrated design decision.",
      "The senior / junior thread in the launch creative is what stuck — both on Felix, converging when the junior isn't stuck at the desk. They're in the room, learning in real time. @Rogo built something that's less about productivity and more about how the next generation develops.",
    ],
    comment: [
      'Congrats Gabe and the Rogo team on this. Felix feels like a really natural evolution of the platform, not just another feature but something that changes how the work actually gets done. Curious to see how this lands with teams.',
      "The apprenticeship framing really hits home. I've seen so many sharp juniors spend their first couple years becoming PowerPoint machines instead of learning how to think. If Felix takes the execution off their plate, that's not just faster work, it's a totally different career trajectory.",
      "If you've ever spent a whole night pulling comps, formatting slides, and updating trackers only to realize you never actually thought about the deal itself, you get why Felix matters. That gap between doing the work and learning from the work is exactly what this is solving.",
      "The fact that you just email Felix is honestly the smartest design choice here. I've seen so many AI tools die because they ask bankers to change their entire workflow. Nobody wants another login. Meeting people in their inbox is how you actually get adoption.",
      "The thing that sticks with me is what this means for the senior side. The best MDs I ever worked under weren't just dealmakers, they genuinely wanted to teach. But how do you mentor someone who's stuck at the office building the book? If Felix gets the junior into the room, that's where the real learning starts.",
    ],
  },
  x: {
    repost: [
      "Finance people building AI for finance people. Harder to find than you'd think. Big day for @RogoAI.",
      "Finance used to be an apprenticeship. Then it turned into execution. Felix makes the case it doesn't have to stay that way.",
      'Every former analyst knows the feeling. You spend 80% of your time on mechanics and 20% actually learning. Something had to give.',
      "You email it like a colleague and it just runs the workflow. No new app to learn. That's the whole game right there.",
      "Not about the AI honestly. It's about the junior finally getting out of the chair and into the room where the deal happens.",
    ],
    comment: [
      "This team's been heads down for years building this. 25K finance pros already on the platform. Felix looks legit.",
      "We turned junior bankers into execution machines and then got confused when they couldn't develop judgment. This is how you fix that.",
      "The gap between doing the work and learning from the work is the whole problem in banking right now. This is the first thing I've seen that actually closes it.",
      "You just email it. No new app, no new UI, you just delegate like you would to a colleague. That's why this one's going to stick.",
      "Forget the efficiency angle. The real thing here is the junior can finally leave the desk and actually be in the room. That's where you learn.",
    ],
  },
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
    setRepostError(null)
    setRepostLoading(true)
    try {
      const next = await fetchInspirationBatch(platform, 'repost')
      setRepostItems(next)
    } catch (e) {
      setRepostError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setRepostLoading(false)
    }
  }, [platform])

  const refreshComment = useCallback(async () => {
    setCommentError(null)
    setCommentLoading(true)
    try {
      const next = await fetchInspirationBatch(platform, 'comment')
      setCommentItems(next)
    } catch (e) {
      setCommentError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setCommentLoading(false)
    }
  }, [platform])

  const repostLabel = platform === 'linkedin' ? 'Repost commentary' : 'Quote-post'
  const commentLabel = platform === 'linkedin' ? 'Comment' : 'Reply'

  return (
    <section id="inspiration" className="section section--inspiration">
      <Reveal>
        <h2 className="inspiration__title">AI Generated Examples</h2>

        <div className="inspiration__toggle-wrap">
          <span className="inspiration__toggle-label">Platform</span>
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
              {repostLoading ? 'Generating…' : 'Refresh'}
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
              {commentLoading ? 'Generating…' : 'Refresh'}
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
