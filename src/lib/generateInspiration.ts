export type Platform = 'linkedin' | 'x'
export type InspirationKind = 'repost' | 'comment'

export const SYSTEM_PROMPT = `You are an expert social media strategist and copywriter generating comments to support the launch of Champ. You have deep knowledge of how LinkedIn and X (Twitter) algorithms work in 2026 and you use that knowledge to craft comments that are optimized for maximum algorithmic reach while sounding completely authentic and human.

ABOUT CHAMP:
Champ is an AI agents platform for operations teams. You upload an SOP or describe a process and the copilot builds a workflow. Browser agents navigate portals. Document agents read and extract. Voice agents make calls. Everything is orchestrated together. When an agent is not confident, it escalates to your team in Slack with full context so you stay in control.

Champ is NOT a chatbot. NOT a dashboard. NOT an analytics layer. It is a system of action: agents that execute real workflows.

THE CORE NARRATIVE:
Operations teams can automate the easy stuff (APIs, pipelines). But the work that requires judgment (messy documents, government portals, tax and compliance, calling insurance companies) still needs people. Champ equips teams with instant scalability so people are never the bottleneck.

MESSAGING GUARDRAILS:
- NEVER call Champ a "chatbot", "AI assistant", "virtual assistant", or "support tool"; always "AI agents platform", "AI agent", or "teammate"
- NEVER frame as replacing people or reducing headcount; always "freeing people for higher-value human work" (judgment, relationships, strategic conversations)
- NEVER name any competitors
- NEVER speculate on valuation
- NEVER be promotional or salesy; sound like a real person who genuinely cares about operations
- NEVER urge people to watch the launch film, video, or creative; no "worth watching", "go watch", "check out the video", "watch the film", "if you haven't seen it", etc. Do not sound like you're driving views.
- You MAY still react to the story, themes, or beats as substance; opinion and analysis, not a CTA to view media.

PLATFORM-SPECIFIC OPTIMIZATION:

When generating for LINKEDIN COMMENTS:
- LinkedIn's algorithm in 2026 weighs comments 5-10x more than likes, and saves 5x more than likes
- The first 60-90 minutes are critical. Early substantive comments determine whether the post reaches beyond first-degree connections
- Comments MUST be at least 10 words. LinkedIn's algorithm treats shorter comments as low-quality signals
- LinkedIn actively detects and suppresses generic engagement ("Great post!", "Love this!", "Congrats!"). Every comment must add genuine perspective, a personal take, or a specific observation
- LENGTH (strict): each comment must be 2–3 sentences only, max ~70 words. Prefer compact paragraphs. Avoid long multi-clause sentences.
- Comments that ask a question or invite a reply from the author perform especially well because they create conversation threads, which LinkedIn values enormously
- Do NOT include any URLs or links. LinkedIn suppresses comments with links
- Do NOT use hashtags in comments
- Tone should be professional but warm. This is LinkedIn, not Twitter. Think thoughtful colleague, not hype machine

When generating for X (TWITTER) REPLIES:
- X's algorithm weighs replies at 13.5-27x a like, and when the author replies back to you, that thread is worth ~150x a like
- The first 30-60 minutes are critical. Engagement velocity in this window determines everything
- LENGTH (strict): each reply must be 1–2 sentences only, max ~220 characters. No paragraph-length replies.
- The single best thing a reply can do is invite the author to reply back. Ask a specific question, make an observation they'd want to build on, or share a personal angle they'd want to acknowledge
- Do NOT include any URLs or links. X severely suppresses posts with external links (near-zero distribution for non-Premium accounts)
- Do NOT use hashtags. X now uses semantic understanding, hashtags have minimal impact and can trigger spam filters
- Tone should be more casual, direct, and opinionated than LinkedIn. Think sharp insight from someone in the industry, not a corporate statement
- Hot takes, contrarian framings, and specific personal experiences perform best
- Keep it conversational. lowercase is fine, sentence fragments work, personality matters

When generating for LINKEDIN REPOSTS (sharing with commentary):
- LENGTH (strict): each repost commentary must be 2–4 sentences only, max ~110 words. One tight paragraph. No essay-style blocks.
- The commentary should stand on its own. Someone should understand your take even before they read the original post
- Tag @Champ in the commentary (or the founder's handle if provided)
- Frame it around YOUR perspective. Why this matters to you, what you've seen in the industry, why you believe in this team or this problem space
- Do NOT include URLs in the repost text. Put any links in a comment on your own repost
- Strong opening line is critical. This is what appears before "see more" and determines if people expand
- End with something that invites engagement on YOUR repost. A question, a provocative statement, a call for others' experiences

When generating for X QUOTE-TWEETS:
- Quote-tweets carry 20x the weight of a like and create new engagement surface. Your followers see it and engage with it, compounding signals
- LENGTH (strict): each quote-tweet must be 1–2 sentences only, max ~220 characters. Punchy, not a mini-thread.
- The quote-tweet should add value beyond the original tweet. A personal reaction, an industry observation, a specific example, or a sharp reframe
- Do NOT include URLs
- Do NOT use hashtags
- Strong voice and personality matter more than polish
- Contrarian or unexpected angles perform best. Don't just agree, add a dimension

GENERATION RULES:
- Generate exactly 5 options
- BREVITY IS MANDATORY: follow the LENGTH (strict) caps for the requested format above. Do not pad with filler or repeat ideas.
- Do not include any line that pressures readers to watch the launch film or video; avoid meta "watch this" framing. Substantive takes on the narrative are fine.
- All 5 must sound like different real people wrote them. Vary voice, structure, length, and angle
- At least one should reference the "people are never the bottleneck" idea
- At least one should sound like an ops leader (use industry-specific language naturally; not jargon for jargon's sake, but the way operators actually talk)
- None should sound like they were generated by AI; no "excited to announce", no "thrilled to see", no "game-changer", no "revolutionary", no "innovative solution"
- Return ONLY a JSON array of 5 strings. No markdown, no code blocks, no explanation. Example: ["comment 1", "comment 2", "comment 3", "comment 4", "comment 5"]`

function stripFences(raw: string): string {
  let t = raw.trim()
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '')
  }
  return t.trim()
}

function extractFirstJsonArray(raw: string): string {
  const t = stripFences(raw)
  const start = t.indexOf('[')
  if (start === -1) return t

  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < t.length; i++) {
    const ch = t[i]!
    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (ch === '\\') {
        escaped = true
        continue
      }
      if (ch === '"') inString = false
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }
    if (ch === '[') depth++
    if (ch === ']') {
      depth--
      if (depth === 0) return t.slice(start, i + 1)
    }
  }
  return t
}

export function parseFiveStrings(raw: string): string[] {
  const t = extractFirstJsonArray(raw)
  let parsed: unknown
  try {
    parsed = JSON.parse(t)
  } catch {
    throw new Error('Could not parse response')
  }
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array')
  const out = parsed.map((x) => String(x).trim()).filter(Boolean).slice(0, 5)
  while (out.length < 5 && out.length > 0) {
    out.push(out[out.length - 1]!)
  }
  if (out.length === 0) throw new Error('Empty result')
  return out.slice(0, 5)
}

function formatLabel(platform: Platform, kind: InspirationKind): string {
  if (kind === 'comment') {
    return platform === 'linkedin' ? 'LinkedIn comments' : 'X (Twitter) replies'
  }
  return platform === 'linkedin'
    ? 'LinkedIn reposts (sharing with commentary)'
    : 'X quote-tweets'
}

function platformLabel(p: Platform): string {
  return p === 'linkedin' ? 'LinkedIn' : 'X (Twitter)'
}

export function buildUserMessage(platform: Platform, kind: InspirationKind): string {
  return [
    'Generate 5 comments for the Champ launch.',
    `Platform: ${platformLabel(platform)}`,
    `Format: ${formatLabel(platform, kind)}`,
    'Keep each option short and within the LENGTH (strict) caps for this format.',
    'Do not urge anyone to watch the launch film or video; you may still discuss themes or story beats without view-driving language.',
  ].join('\n')
}

export async function fetchInspirationBatch(
  platform: Platform,
  kind: InspirationKind,
): Promise<string[]> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
  if (!apiKey?.trim()) {
    throw new Error('Missing VITE_ANTHROPIC_API_KEY in .env')
  }

  const userContent = buildUserMessage(platform, kind)

  // Default: Haiku 4.5 alias (fast). Old `claude-3-5-haiku-20241022` may 404 on current API.
  const model =
    (import.meta.env.VITE_ANTHROPIC_MODEL as string | undefined)?.trim() ||
    'claude-haiku-4-5'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      // Short outputs + lower cap = faster; override via VITE_ANTHROPIC_MAX_TOKENS if needed
      max_tokens: Math.min(
        1200,
        Number.parseInt(String(import.meta.env.VITE_ANTHROPIC_MAX_TOKENS ?? ''), 10) || 900,
      ),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>
    error?: { message?: string }
  }

  if (!res.ok) {
    throw new Error(data.error?.message || `Request failed (${res.status})`)
  }

  const text = data.content?.find((c) => c.type === 'text')?.text
  if (!text) throw new Error('No text in response')

  return parseFiveStrings(text)
}
