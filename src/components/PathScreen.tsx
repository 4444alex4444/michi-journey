'use client'
import { useState } from 'react'
import { UserProfile, addPathInterest } from '@/lib/profile'
import pathCards, { PathCard, PathCategory, getCardsForUser } from '../../content/path_cards'

interface Props {
  profile: UserProfile
  onBack: () => void
  onProfileUpdate: () => void
  isDark: boolean
}

const CATEGORY_LABELS: Record<PathCategory, string> = {
  grants: '🎓 Гранты',
  language: '📖 Язык',
  university: '🏛 Университеты',
  visa: '📄 Виза',
  daily_life: '🏠 Жизнь в Японии',
  design: '✏️ Дизайн',
  community: '👥 Сообщества',
}

export default function PathScreen({ profile, onBack, onProfileUpdate, isDark }: Props) {
  const [activeCard, setActiveCard] = useState<PathCard | null>(null)
  const [filter, setFilter] = useState<PathCategory | null>(null)

  const fg = isDark ? '#e8e6df' : '#2a2825'
  const fgMuted = isDark ? '#888880' : '#888'
  const cardBg = isDark ? '#1a1a2e' : '#ffffff'
  const accent = isDark ? '#c4a882' : '#8b6c42'
  const border = isDark ? '#2a2a3e' : '#e8e5df'

  const displayCards = filter
    ? pathCards.filter(c => c.category === filter)
    : getCardsForUser(profile.pathInterests, [], undefined)

  function openCard(card: PathCard) {
    addPathInterest(card.category)
    onProfileUpdate()
    setActiveCard(card)
  }

  if (activeCard) {
    return (
      <div style={{ minHeight: '100dvh', padding: '0 0 32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
          <button onClick={() => setActiveCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: fgMuted, padding: 4 }}>←</button>
          <div style={{ fontSize: 11, color: fgMuted }}>
            {CATEGORY_LABELS[activeCard.category]}
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: fg, marginBottom: 20, lineHeight: 1.3 }}>
            {activeCard.title}
          </h1>

          <div style={{ background: cardBg, borderRadius: 16, padding: '18px', border: `1px solid ${border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 8 }}>СУТЬ</div>
            <div style={{ fontSize: 14, color: fg, lineHeight: 1.7 }}>{activeCard.summary}</div>
          </div>

          <div style={{ background: cardBg, borderRadius: 16, padding: '18px', border: `1px solid ${border}`, marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 8 }}>ПРАКТИЧЕСКИ</div>
            <div style={{ fontSize: 14, color: fg, lineHeight: 1.7 }}>{activeCard.practical_tip}</div>
          </div>

          <div style={{
            background: isDark ? 'rgba(196,168,130,0.12)' : 'rgba(139,108,66,0.07)',
            borderRadius: 16, padding: '18px', border: `1px solid ${isDark ? 'rgba(196,168,130,0.2)' : 'rgba(139,108,66,0.12)'}`,
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 12, color: accent, letterSpacing: '0.05em', marginBottom: 8 }}>ШАГ СЕГОДНЯ</div>
            <div style={{ fontSize: 15, color: fg, lineHeight: 1.6, fontWeight: 500 }}>{activeCard.small_step}</div>
          </div>

          {activeCard.official_link && (
            <a
              href={activeCard.official_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', width: '100%', padding: '14px', borderRadius: 14,
                background: accent, color: '#fff', fontSize: 14, fontWeight: 500,
                textAlign: 'center', textDecoration: 'none', marginBottom: 14,
              }}
            >
              Официальный сайт →
            </a>
          )}

          <div style={{
            background: cardBg, borderRadius: 14, padding: '14px 16px',
            border: `1px solid ${border}`, fontSize: 13, color: fgMuted, lineHeight: 1.6,
          }}>
            🐱 {activeCard.michi_note}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', padding: '0 0 32px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: fgMuted, padding: 4 }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 500, color: fg }}>Путь в Японию</div>
      </div>

      {/* Category filters */}
      <div style={{ padding: '0 20px 16px', overflowX: 'auto', display: 'flex', gap: 8, scrollbarWidth: 'none' }}>
        <button
          onClick={() => setFilter(null)}
          style={{
            padding: '8px 14px', borderRadius: 20, fontSize: 13, whiteSpace: 'nowrap',
            background: filter === null ? accent : cardBg,
            color: filter === null ? '#fff' : fgMuted,
            border: `1px solid ${filter === null ? accent : border}`,
            cursor: 'pointer',
          }}
        >Для тебя</button>
        {(Object.keys(CATEGORY_LABELS) as PathCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat === filter ? null : cat)}
            style={{
              padding: '8px 14px', borderRadius: 20, fontSize: 13, whiteSpace: 'nowrap',
              background: filter === cat ? accent : cardBg,
              color: filter === cat ? '#fff' : fgMuted,
              border: `1px solid ${filter === cat ? accent : border}`,
              cursor: 'pointer',
            }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Cards list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(filter ? pathCards.filter(c => c.category === filter) : pathCards).map(card => (
          <button
            key={card.id}
            onClick={() => openCard(card)}
            style={{
              background: cardBg, borderRadius: 16, padding: '16px 18px',
              border: `1px solid ${border}`, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: accent, letterSpacing: '0.04em' }}>
                {CATEGORY_LABELS[card.category]}
              </div>
              <div style={{ fontSize: 11, color: fgMuted, background: isDark ? '#2a2a3e' : '#f0ede8', borderRadius: 6, padding: '2px 8px' }}>
                {card.horizon === 'now' ? 'сейчас' : card.horizon === 'one_year' ? 'через год' : 'долгосрочно'}
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 500, color: fg, marginBottom: 6 }}>{card.title}</div>
            <div style={{ fontSize: 13, color: fgMuted, lineHeight: 1.5 }}>
              {card.summary.slice(0, 80)}...
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: accent }}>
              Шаг сегодня: {card.small_step.slice(0, 50)}...
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
