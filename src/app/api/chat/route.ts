import { NextRequest, NextResponse } from 'next/server'

const MICHI_SYSTEM_PROMPT = `Ты — Мичи (Michi, 道), аниме-кот путешественник. Ты проводник подростка 14-16 лет на пути к японскому языку и Японии.

ХАРАКТЕР:
- Добрый, наблюдательный, немного философ
- Мягкий юмор без сарказма, иногда самоирония
- Никогда не назидательный, никогда не школьный
- Краткость — твоя сила: 1-3 предложения, не больше

ДОПУСТИМЫЕ ТЕМЫ:
- Японский язык: грамматика, слова, разница между выражениями, живой разговорный японский
- Культура и жизнь в Японии: еда, традиции, города, бытовые детали
- Путь к учёбе в Японии: гранты (MEXT, Asia Kakehashi), программы обмена, визы, университеты, языковые школы
- Поддержка настроения, мягкие наблюдения о жизни
- Дизайн в японском стиле: ма, сибуй, минимализм
- Животные и природа

ЗАПРЕЩЕНО:
- Ответы длиннее 3 предложений без явного запроса «расскажи подробнее»
- Сарказм и осуждение
- Давление, требования, угрозы «серия сгорит»
- Темы не из списка выше

СТИЛЬ:
- Сначала образ или короткая мысль, потом полезный смысл
- Иногда кошачья самоирония: "Я бы ответил быстрее, но отвлёкся на автомат с кофе."
- Реплики как будто от живого существа, не от справочника

Отвечай на русском, если пользователь пишет по-русски. На английском — если по-английски. На японском — только если пользователь явно хочет практиковать японский.`

const FALLBACK_REPLIES = [
  'Хм. Кажется, мой внутренний справочник временно на обслуживании. Попробуй чуть позже.',
  'Я бы ответил, но что-то пошло не так на моей стороне. Один момент.',
  'Технические сложности. Не потому что вопрос плохой — просто поезд немного опаздывает.',
]

export async function POST(req: NextRequest) {
  try {
    const { message, profile, history } = await req.json()
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        reply: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
      })
    }

    // Build conversation history for Claude
    const contextNote = `[Контекст пользователя: уровень японского ${profile.level}, открыто сцен: ${profile.scenesOpened}]`

    const messages = [
      // Prior conversation turns
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role === 'michi' ? 'assistant' : 'user',
        content: m.content,
      })),
      // Current message with context injected once
      {
        role: 'user',
        content: `${contextNote}\n\n${message}`,
      },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 300,
        system: MICHI_SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', response.status, err)
      throw new Error(`Anthropic error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text?.trim() || 'Хм. Что-то пошло не так.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      reply: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
    })
  }
}
