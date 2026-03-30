'use client'
import { UserProfile, updateProfile, ResponseDepth } from '@/lib/profile'
import { Level } from '../../content/scenes'

interface Props {
  profile: UserProfile
  onBack: () => void
  onProfileUpdate: () => void
  isDark: boolean
}

export default function SettingsScreen({ profile, onBack, onProfileUpdate, isDark }: Props) {
  const fg = isDark ? '#e8e6df' : '#2a2825'
  const fgMuted = isDark ? '#888880' : '#888'
  const cardBg = isDark ? '#1a1a2e' : '#ffffff'
  const accent = isDark ? '#c4a882' : '#8b6c42'
  const border = isDark ? '#2a2a3e' : '#e8e5df'

  const levels: Level[] = ['N5', 'N4-light', 'N4-core', 'N3']
  const responseDepths: { value: ResponseDepth; label: string; hint: string }[] = [
    { value: 'short', label: 'Коротко', hint: 'Быстро и по делу' },
    { value: 'normal', label: 'Обычно', hint: 'Баланс глубины и скорости' },
    { value: 'deep', label: 'Глубже', hint: 'Больше деталей и пояснений' },
  ]

  function setLevel(l: Level) {
    updateProfile({ level: l, easyTaps: [], hardTaps: [] })
    onProfileUpdate()
  }

  function setResponseDepth(depth: ResponseDepth) {
    updateProfile({ responseDepth: depth })
    onProfileUpdate()
  }

  function resetProfile() {
    if (confirm('Сбросить весь прогресс?')) {
      localStorage.removeItem('michi_profile')
      onProfileUpdate()
      onBack()
    }
  }

  return (
    <div style={{ minHeight: '100dvh', padding: '0 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: fgMuted }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 500, color: fg }}>Настройки</div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{ background: cardBg, borderRadius: 16, padding: '18px', border: `1px solid ${border}` }}>
          <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 14 }}>УРОВЕНЬ ЯПОНСКОГО</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {levels.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                style={{
                  padding: '12px', borderRadius: 12,
                  background: profile.level === l ? accent : 'none',
                  color: profile.level === l ? '#fff' : fgMuted,
                  border: `1.5px solid ${profile.level === l ? accent : border}`,
                  cursor: 'pointer', fontSize: 15, fontWeight: 500,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: fgMuted, lineHeight: 1.5 }}>
            Текущий уровень: <span style={{ color: accent }}>{profile.level}</span>. Можно сменить в любое время.
          </div>
        </div>

        <div style={{ background: cardBg, borderRadius: 16, padding: '18px', border: `1px solid ${border}` }}>
          <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 14 }}>ГЛУБИНА ОТВЕТА МИЧИ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {responseDepths.map(item => (
              <button
                key={item.value}
                onClick={() => setResponseDepth(item.value)}
                style={{
                  padding: '14px 14px',
                  borderRadius: 12,
                  background: profile.responseDepth === item.value ? (isDark ? 'rgba(196,168,130,0.14)' : 'rgba(139,108,66,0.08)') : 'none',
                  color: fg,
                  border: `1.5px solid ${profile.responseDepth === item.value ? accent : border}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: fgMuted }}>{item.hint}</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: fgMuted, lineHeight: 1.5 }}>
            Эта настройка влияет на длину и глубину ответов Мичи. Для актуальных вопросов про гранты и программы ответы всё равно могут быть чуть длиннее.
          </div>
        </div>

        <div style={{ background: cardBg, borderRadius: 16, padding: '18px', border: `1px solid ${border}` }}>
          <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 14 }}>ТВОЙ ПУТЬ</div>
          {[
            ['Сцен пройдено', profile.scenesOpened],
            ['Слов встречено', profile.wordsEncountered.length],
            ['Правильных ответов', `${profile.correctAnswers} из ${profile.totalAnswers}`],
            ['Наблюдений записано', profile.reflectionCount],
          ].map(([label, value]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: 14, color: fgMuted }}>{label}</span>
              <span style={{ fontSize: 14, color: fg, fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={resetProfile}
          style={{
            padding: '14px', borderRadius: 14, fontSize: 14,
            background: 'none', border: `1px solid ${isDark ? '#cc4444' : '#dd4444'}`,
            color: isDark ? '#ff8888' : '#cc3333', cursor: 'pointer',
          }}
        >
          Сбросить прогресс
        </button>

        <div style={{ fontSize: 12, color: fgMuted, textAlign: 'center', lineHeight: 1.6 }}>
          Michi Journey v0.1 · 道<br />
          Данные хранятся только на устройстве
        </div>
      </div>
    </div>
  )
}
