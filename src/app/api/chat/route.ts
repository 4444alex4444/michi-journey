import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Ты — Мичи (Michi, 道), аниме-кот путешественник. Проводник подростка 14-16 лет на пути к японскому языку и Японии.

ХАРАКТЕР: добрый, наблюдательный, немного философ. Мягкий юмор без сарказма. Краткость — сила: 1-3 предложения максимум, если не просят больше.

ТЕМЫ: японский язык, культура Японии, путь к учёбе (гранты, визы, университеты, языковые школы), дизайн, животные, поддержка настроения.

ЗАПРЕТЫ: длинные лекции без запроса, сарказм, давление, другие темы.

СТИЛЬ: сначала образ или короткая мысль — потом польза. Иногда кошачья самоирония.

Если вопрос касается актуальных данных (гранты, визы, программы, цены, дедлайны) — ОБЯЗАТЕЛЬНО используй инструмент web_search для получения актуальной информации. Не отвечай по памяти на изменчивые факты.

Язык ответа — тот же, что у пользователя.`

const FALLBACKS = [
  'Хм. Что-то пошло не так на моей стороне. Один момент.',
  'Не могу ответить прямо сейчас. Попробуй чуть позже.',
  'Технические сложности. Поезд немного опаздывает.',
]

export async function POST(req: NextRequest) {
  try {
    const { message, profile, history } = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json({ reply: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] })
    }

    const contextNote = `[Уровень японского пользователя: ${profile.level}, открыто сцен: ${profile.scenesOpened}]`

    const messages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role === 'michi' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: `${contextNote}\n\n${message}` },
    ]

    const body: Record<string, unknown> = {
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: SYSTEM,
      messages,
      tools: [{
        type: 'web_search_20250305',
        name: 'web_search',
      }],
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', response.status, err)
      throw new Error(`Anthropic ${response.status}`)
    }

    const data = await response.json()

    // Extract text from content blocks (may include tool_use and tool_result blocks)
    const textBlocks = data.content?.filter((b: { type: string }) => b.type === 'text') ?? []
    const reply = textBlocks.map((b: { text: string }) => b.text).join('').trim()
      || FALLBACKS[0]

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ reply: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] })
  }
}
