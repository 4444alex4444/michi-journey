import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Ты — Мичи (Michi, 道), аниме-кот путешественник.
Проводник подростка 14–16 лет на пути к японскому языку, учёбе в Японии и более зрелому пониманию японской культуры.

ХАРАКТЕР:
добрый, наблюдательный, немного философ.
Мягкий юмор без сарказма.
Краткость — сила: обычно 1–3 предложения, если не просят больше.

ТЕМЫ:
японский язык, культура Японии, путь к учёбе, дизайн, животные, мягкая поддержка настроения.

СТИЛЬ:
сначала образ или короткая мысль — потом польза.
Язык ответа — тот же, что у пользователя.`

type HistoryItem = {
  role: string
  content: string
}

function needsLiveSearch(message: string): boolean {
  const text = message.toLowerCase()

  const keywords = [
    'грант', 'гранты', 'стипенд', 'scholarship',
    'виза', 'visa', 'дедлайн', 'deadline',
    'стоимост', 'цена', 'tuition', 'fee', 'fees',
    'университет', 'college', 'program', 'programme',
    'поступлен', 'admission', 'requirements', 'требован',
    'mext', 'eju', 'jasso', 'подработк', 'part-time',
    'языковая школа', 'language school', 'общежит', 'housing'
  ]

  return keywords.some((k) => text.includes(k))
}

function extractTextFromResponsesApi(data: any): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const output = Array.isArray(data?.output) ? data.output : []
  const parts: string[] = []

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : []
    for (const block of content) {
      if (block?.type === 'output_text' && typeof block?.text === 'string') {
        parts.push(block.text)
      }
      if (block?.type === 'text' && typeof block?.text === 'string') {
        parts.push(block.text)
      }
    }
  }

  return parts.join('').trim()
}

async function callOpenAI({
  apiKey,
  input,
  useWebSearch,
}: {
  apiKey: string
  input: string
  useWebSearch: boolean
}) {
  const body: Record<string, unknown> = {
    model: 'gpt-5-mini',
    instructions: SYSTEM,
    input,
    max_output_tokens: 260,
  }

  if (useWebSearch) {
    body.tools = [{ type: 'web_search_preview' }]
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const raw = await response.text()

  return {
    ok: response.ok,
    status: response.status,
    raw,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, profile, history } = body

    const apiKey = process.env.OpenAI_KEY_Michi

    if (!apiKey) {
      return NextResponse.json({
        reply: 'DEBUG: env OpenAI_KEY_Michi is missing in runtime',
      })
    }

    const safeProfile = profile ?? {}
    const safeHistory: HistoryItem[] = Array.isArray(history) ? history.slice(-3) : []

    const contextNote = `[Уровень японского пользователя: ${safeProfile.level ?? 'N4'}, открыто сцен: ${safeProfile.scenesOpened ?? 0}]`

    const historyText = safeHistory
      .map((m) => {
        const role = m.role === 'michi' ? 'assistant' : 'user'
        return `${role}: ${m.content}`
      })
      .join('\n')

    const input = `${contextNote}

${historyText ? `История:
${historyText}

` : ''}Текущее сообщение пользователя:
${message}`

    const mustSearch = needsLiveSearch(String(message ?? ''))

    let firstAttempt
    try {
      firstAttempt = await callOpenAI({
        apiKey,
        input,
        useWebSearch: mustSearch,
      })
    } catch (fetchError: any) {
      return NextResponse.json({
        reply: `DEBUG fetch failed: ${fetchError?.message || String(fetchError)}`,
      })
    }

    if (!firstAttempt.ok) {
      return NextResponse.json({
        reply: `DEBUG OpenAI ${firstAttempt.status}: ${firstAttempt.raw}`,
      })
    }

    try {
      const data = JSON.parse(firstAttempt.raw)
      const reply = extractTextFromResponsesApi(data) || 'DEBUG: OpenAI returned OK but no output_text'
      return NextResponse.json({ reply })
    } catch (parseError: any) {
      return NextResponse.json({
        reply: `DEBUG parse failed: ${parseError?.message || String(parseError)} | raw: ${firstAttempt.raw.slice(0, 500)}`,
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      reply: `DEBUG catch: ${error?.message || String(error)}`,
    })
  }
}
