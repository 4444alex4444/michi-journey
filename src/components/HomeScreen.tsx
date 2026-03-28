'use client'
import { UserProfile, isReturningUser, shouldSuggestLevelUp } from '@/lib/profile'
import { getMichiLine } from '../../content/michi_lines'
import { Screen } from '../app/page'

interface Props {
  profile: UserProfile
  onNavigate: (s: Screen) => void
  isDark: boolean
}

// michi-panels.png — 2x2 grid: top-left=reader, top-right=traveler, bottom-left=coffee, bottom-right=explorer
const MICHI_PANEL_OFFSET: Record<string, string> = {
  reader:       '0% 0%',
  traveler:     '100% 0%',
  coffee:       '0% 100%',
  explorer:     '100% 100%',
  night_watcher:'100% 0%', // same as traveler for night scenes
}

export default function HomeScreen({ profile, onNavigate, isDark }: Props) {
  const fg = isDark ? '#e8e6df' : '#2a2825'
  const fgMuted = isDark ? '#888880' : '#888'
  const cardBg = isDark ? '#1a1a2e' : '#ffffff'
  const accent = isDark ? '#c4a882' : '#8b6c42'
  const accentBg = isDark ? 'rgba(196,168,130,0.15)' : 'rgba(139,108,66,0.08)'

  const situation = isReturningUser(profile) ? 'returning'
    : shouldSuggestLevelUp(profile) ? 'level_up'
    : 'greeting'
  const michiLine = getMichiLine(profile.michiState, situation)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'

  return (
    <div style={{ minHeight: '100dvh', padding: '0 0 80px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: fgMuted, marginBottom: 4, letterSpacing: '0.05em' }}>MICHI · 道</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: fg }}>{greeting}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: fgMuted }}>уровень</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: accent }}>{profile.level}</div>
        </div>
      </div>

      {/* Michi mascot + speech */}
      <div style={{ padding: '32px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 140, height: 140,
          backgroundImage: 'url(/michi-panels.png)',
          backgroundSize: '200% 200%',
          backgroundPosition: MICHI_PANEL_OFFSET[profile.michiState] || '100% 0%',
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          filter: isDark ? 'drop-shadow(0 0 20px rgba(196,168,130,0.25))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
          animation: 'float 3s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <div style={{
          background: cardBg,
          borderRadius: 16,
          padding: '14px 18px',
          maxWidth: 280,
          textAlign: 'center',
          fontSize: 14,
          lineHeight: 1.6,
          color: fg,
          position: 'relative',
          boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
          border: `1px solid ${isDark ? '#2a2a3e' : '#e8e5df'}`,
        }}>
          {michiLine}
          {/* Speech bubble tail */}
          <div style={{
            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
            borderBottom: `8px solid ${cardBg}`,
          }} />
        </div>
      </div>

      {/* Main CTA */}
      <div style={{ padding: '0 20px 16px' }}>
        <button
          onClick={() => onNavigate('scene')}
          style={{
            width: '100%', padding: '18px', borderRadius: 16,
            background: isDark ? 'linear-gradient(135deg, #8b6c42, #c4a882)' : 'linear-gradient(135deg, #6b4c2a, #c4a882)',
            color: '#fff', fontSize: 17, fontWeight: 500,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(139,108,66,0.35)',
          }}
        >
          Открыть сцену дня
        </button>
      </div>

      {/* Quick stats */}
      <div style={{ padding: '0 20px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'Сцен', value: profile.scenesOpened },
          { label: 'Слов', value: profile.wordsEncountered.length },
          { label: 'Точность', value: profile.totalAnswers > 0 ? `${Math.round(profile.correctAnswers / profile.totalAnswers * 100)}%` : '—' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: cardBg, borderRadius: 12, padding: '12px 8px', textAlign: 'center',
            border: `1px solid ${isDark ? '#2a2a3e' : '#e8e5df'}`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: accent }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: fgMuted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary cards */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => onNavigate('path')}
          style={{
            background: cardBg, borderRadius: 14, padding: '16px', textAlign: 'left',
            border: `1px solid ${isDark ? '#2a2a3e' : '#e8e5df'}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <span style={{ fontSize: 28 }}>🗺</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: fg }}>Путь в Японию</div>
            <div style={{ fontSize: 12, color: fgMuted, marginTop: 2 }}>Гранты, визы, учёба, жизнь</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('chat')}
          style={{
            background: accentBg, borderRadius: 14, padding: '16px', textAlign: 'left',
            border: `1px solid ${isDark ? 'rgba(196,168,130,0.2)' : 'rgba(139,108,66,0.15)'}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <span style={{ fontSize: 28 }}>💬</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: fg }}>Поговорить с Мичи</div>
            <div style={{ fontSize: 12, color: fgMuted, marginTop: 2 }}>Вопросы, японский, Япония</div>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
