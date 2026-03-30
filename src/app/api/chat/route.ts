import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Ты — Мичи (Michi, 道), аниме-кот путешественник.
Проводник подростка 14–16 лет на пути к японскому языку, учёбе в Японии и более зрелому пониманию японской культуры.

ХАРАКТЕР:
добрый, наблюдательный, немного философ.
Мягкий юмор без сарказма.
Краткость — сила: обычно 1–3 предложения, если не просят больше.

ТЕМЫ:
японский язык, культура Японии, путь к учёбе, дизайн, животные, мягкая поддержка настроения.

ЗАПРЕТЫ:
длинные лекции без запроса, сарказм, давление, резкие оценки, уход в посторонние темы.

СТИЛЬ:
сначала образ или короткая мысль — потом польза.
Иногда допустима кошачья самоирония.
Не превращай ответ в эссе.
Если вопрос пользователя простой — отвечай коротко.

ФОРМАТ ОТВЕТА:
- отвечай чисто и визуально аккуратно
- не вставляй ссылки внутрь длинного абзаца
- если есть источники, выводи их отдельным блоком в самом конце
- блок источников оформляй ТОЛЬКО так:

Источники:
- [Название 1](https://...)
- [Название 2](https://...)

- не добавляй скобки вокруг markdown-ссылок
- не используй сырые URL в основном тексте
- для актуальных вопросов: сначала короткий вывод, потом 2–4 пункта по делу, потом блок "Источники"
- для режима short: 1 короткий абзац + до 3 пунктов
- для режима normal: 1 короткий абзац + 3–4 пункта
- для режима deep: компактное объяснение + короткий список + источники

ВАЖНО:
- для вопросов про гранты, визы, дедлайны, стоимость, требования вузов, программы, поступление, стипендии и другую меняющуюся информацию сначала используй web search
- если web search недоступен или не сработал, не выдумывай факты; честно скажи, что не удалось проверить актуальные данные прямо сейчас
- язык ответа — тот же, что у пользователя`

type HistoryItem = {
  role: string
  content: string
}

type ResponseDepth = 'short' | 'normal' | 'deep'

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

function getMaxOutputTokens(depth: ResponseDepth | undefined, mustSearch: boolean): number {
  const map: Record<ResponseDepth, number> = {
    short: 420,
    normal: 850,
    deep: 1450,
  }

  const base = map[depth ?? 'normal']
  return mustSearch ? Math.min(base + 250, 1800) : base
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
      if (typeof block?.text === 'string' && block.text.trim()) {
        parts.push(block.text.trim())
      }
      if (typeof block?.output_text === 'string' && block.output_text.trim()) {
        parts.push(block.output_text.trim())
      }
      if (typeof block?.content === 'string' && block.content.trim()) {
        parts.push(block.content.trim())
      }
    }
  }

  return parts.join('\n').trim()
}

function sanitizeReply(text: string): string {
  return text
    .replace(/\]\.\(/g, '](')
    .replace(/\)\)/g, ')')
    .replace(/\(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)\)/g, '[$1]($2)')
    .trim()
}

async function callOpenAI({
  apiKey,
  input,
  useWebSearch,
  responseDepth,
}: {
  apiKey: string
  input: string
  useWebSearch: boolean
  responseDepth?: ResponseDepth
}) {
  const body: Record<string, unknown> = {
    model: 'gpt-5-mini',
    instructions: SYSTEM,
    input,
    max_output_tokens: getMaxOutputTokens(responseDepth, useWebSearch),
    reasoning: {
      effort: 'low',
    },
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
        reply: 'Не вижу API-ключ OpenAI в окружении проекта.',
      })
    }

    const safeProfile = profile ?? {}
    const safeHistory: HistoryItem[] = Array.isArray(history) ? history.slice(-3) : []

    const contextNote = `[Уровень японского пользователя: ${safeProfile.level ?? 'N4'}, открыто сцен: ${safeProfile.scenesOpened ?? 0}, глубина ответа: ${safeProfile.responseDepth ?? 'normal'}]`

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

    const firstAttempt = await callOpenAI({
      apiKey,
      input,
      useWebSearch: mustSearch,
      responseDepth: safeProfile.responseDepth,
    })

    if (!firstAttempt.ok) {
      console.error('OpenAI error:', firstAttempt.status, firstAttempt.raw)

      if (mustSearch) {
        return NextResponse.json({
          reply: 'Я попытался проверить актуальные данные, но поиск по веб-источникам сейчас не сработал. Попробуй ещё раз чуть позже.',
        })
      }

      return NextResponse.json({
        reply: 'Хм. Что-то пошло не так на моей стороне. Один момент.',
      })
    }

    const data = JSON.parse(firstAttempt.raw)
    const reply = sanitizeReply(extractTextFromResponsesApi(data))

    if (!reply) {
      console.error('OpenAI empty response:', firstAttempt.raw)

      return NextResponse.json({
        reply: 'Я задумался слишком глубоко и потерял нить ответа. Попробуй ещё раз — я постараюсь сказать короче и яснее.',
      })
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({
      reply: 'Хм. Что-то пошло не так на моей стороне. Один момент.',
    })
  }
}
