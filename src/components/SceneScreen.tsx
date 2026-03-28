'use client'
import { useState } from 'react'
import { UserProfile, updateProfile, recordAnswer, recordEasyTap, recordHardTap, shouldSuggestLevelUp, shouldSuggestLevelDown } from '@/lib/profile'
import { getSceneForDay, getNextLevel, getPrevLevel } from '../../content/scenes'
import { getMichiLine } from '../../content/michi_lines'

interface Props {
  profile: UserProfile
  onBack: () => void
  onProfileUpdate: () => void
  isDark: boolean
}

type Step = 'scene' | 'question' | 'reflection' | 'done'

export default function SceneScreen({ profile, onBack, onProfileUpdate, isDark }: Props) {
  const scene = getSceneForDay(profile.userId, profile.level)
  const [step, setStep] = useState<Step>('scene')
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [michiReaction, setMichiReaction] = useState<string | null>(null)
  const [showLevelSuggestion, setShowLevelSuggestion] = useState(false)

  const fg = isDark ? '#e8e6df' : '#2a2825'
  const fgMuted = isDark ? '#888880' : '#888'
  const cardBg = isDark ? '#1a1a2e' : '#ffffff'
  const accent = isDark ? '#c4a882' : '#8b6c42'
  const border = isDark ? '#2a2a3e' : '#e8e5df'

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(idx)
    const correct = idx === scene.question.correct
    recordAnswer(correct)

    const situation = correct ? 'correct' : 'wrong'
    const line = getMichiLine(scene.michi_state, situation)
    setMichiReaction(line)

    // Update words
    const newWords = scene.words.map(w => w[0]).filter(w => !profile.wordsEncountered.includes(w))
    if (newWords.length > 0) {
      updateProfile({ wordsEncountered: [...profile.wordsEncountered, ...newWords] })
    }
    onProfileUpdate()

    setTimeout(() => setStep('reflection'), 1800)
  }

  function handleEasy() {
    recordEasyTap()
    onProfileUpdate()
    const line = getMichiLine(scene.michi_state, 'too_easy')
    setMichiReaction(line)
    const updated = { easyTaps: [...profile.easyTaps, Date.now()] } as any
    const p2 = updateProfile(updated)
    if (shouldSuggestLevelUp(p2)) {
      setTimeout(() => setShowLevelSuggestion(true), 1000)
    }
  }

  function handleHard() {
    recordHardTap()
    onProfileUpdate()
    const line = getMichiLine(scene.michi_state, 'too_hard')
    setMichiReaction(line)
  }

  function handleLevelUp() {
    const next = getNextLevel(profile.level)
    updateProfile({ level: next, easyTaps: [] })
    onProfileUpdate()
    setShowLevelSuggestion(false)
    const line = getMichiLine(scene.michi_state, 'level_up')
    setMichiReaction(line)
  }

  function handleDone() {
    updateProfile({
      scenesOpened: profile.scenesOpened + 1,
      lastSeenDate: new Date().toISOString(),
      reflectionCount: step === 'reflection' ? profile.reflectionCount + 1 : profile.reflectionCount,
    })
    onProfileUpdate()
    onBack()
  }

  return (
    <div style={{ minHeight: '100dvh', padding: '0 0 32px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: fgMuted, padding: 4 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: fgMuted, letterSpacing: '0.05em' }}>{profile.level} · {scene.theme}</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: fg }}>{scene.title}</div>
        </div>
        <div style={{ fontSize: 11, color: fgMuted }}>
          {step === 'scene' ? '1/3' : step === 'question' ? '2/3' : '3/3'}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: isDark ? '#2a2a3e' : '#e8e5df', margin: '0 20px' }}>
        <div style={{
          height: '100%', background: accent, borderRadius: 2,
          width: step === 'scene' ? '33%' : step === 'question' ? '66%' : '100%',
          transition: 'width 0.4s ease'
        }} />
      </div>

      <div style={{ padding: '20px' }}>
        {/* STEP 1: Scene */}
        {step === 'scene' && (
          <>
            {/* Atmospheric text */}
            <div style={{
              background: cardBg, borderRadius: 16, padding: '20px',
              border: `1px solid ${border}`, marginBottom: 16,
            }}>
              <div style={{ fontSize: 15, lineHeight: 1.8, color: fg, marginBottom: 16 }}>
                {scene.text}
              </div>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: 14, marginTop: 8 }}>
                <div style={{ fontSize: 18, lineHeight: 1.7, color: accent, fontWeight: 500, marginBottom: 6 }}>
                  {scene.jp_text}
                </div>
                <div style={{ fontSize: 13, color: fgMuted, lineHeight: 1.6 }}>
                  {scene.jp_translation}
                </div>
              </div>
            </div>

            {/* Words */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: fgMuted, marginBottom: 10, letterSpacing: '0.05em' }}>СЛОВА СЦЕНЫ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scene.words.map(([kanji, reading, meaning]) => (
                  <div key={kanji} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: cardBg, borderRadius: 12, padding: '12px 16px',
                    border: `1px solid ${border}`,
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: accent, minWidth: 60 }}>{kanji}</div>
                    <div>
                      <div style={{ fontSize: 13, color: fgMuted }}>{reading}</div>
                      <div style={{ fontSize: 14, color: fg }}>{meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phrase */}
            <div style={{
              background: isDark ? 'rgba(196,168,130,0.1)' : 'rgba(139,108,66,0.06)',
              borderRadius: 14, padding: '14px 16px', marginBottom: 20,
              border: `1px solid ${isDark ? 'rgba(196,168,130,0.2)' : 'rgba(139,108,66,0.12)'}`,
            }}>
              <div style={{ fontSize: 12, color: fgMuted, marginBottom: 6, letterSpacing: '0.05em' }}>ФРАЗА ДНЯ</div>
              <div style={{ fontSize: 17, color: accent, fontWeight: 500 }}>{scene.phrase[0]}</div>
              <div style={{ fontSize: 12, color: fgMuted, marginTop: 4 }}>{scene.phrase[1]}</div>
              <div style={{ fontSize: 13, color: fg, marginTop: 2 }}>{scene.phrase[2]}</div>
            </div>

            {/* Difficulty feedback */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Слишком легко', action: handleEasy },
                { label: 'Нормально', action: () => {} },
                { label: 'Сложновато', action: handleHard },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 11,
                    background: 'none', border: `1px solid ${border}`, cursor: 'pointer', color: fgMuted,
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Michi reaction */}
            {michiReaction && (
              <div style={{
                background: isDark ? 'rgba(196,168,130,0.08)' : 'rgba(139,108,66,0.05)',
                borderRadius: 14, padding: '12px 16px', marginBottom: 16,
                border: `1px solid ${isDark ? 'rgba(196,168,130,0.15)' : 'rgba(139,108,66,0.1)'}`,
                fontSize: 13, color: fg, lineHeight: 1.6,
              }}>
                🐱 {michiReaction}
              </div>
            )}

            {/* Level up suggestion */}
            {showLevelSuggestion && (
              <div style={{
                background: isDark ? 'rgba(196,168,130,0.15)' : 'rgba(139,108,66,0.1)',
                borderRadius: 14, padding: '16px', marginBottom: 16,
              }}>
                <div style={{ fontSize: 14, color: fg, marginBottom: 10 }}>
                  🐱 Похоже, тебе уже можно сложнее. Перейти на {getNextLevel(profile.level)}?
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleLevelUp} style={{
                    flex: 1, padding: '10px', borderRadius: 10, background: accent,
                    color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14,
                  }}>Да, перейти</button>
                  <button onClick={() => setShowLevelSuggestion(false)} style={{
                    flex: 1, padding: '10px', borderRadius: 10, background: 'none',
                    color: fgMuted, border: `1px solid ${border}`, cursor: 'pointer', fontSize: 14,
                  }}>Пока нет</button>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('question')}
              style={{
                width: '100%', padding: '16px', borderRadius: 14,
                background: isDark ? 'linear-gradient(135deg, #8b6c42, #c4a882)' : 'linear-gradient(135deg, #6b4c2a, #c4a882)',
                color: '#fff', fontSize: 16, fontWeight: 500, border: 'none', cursor: 'pointer',
              }}
            >
              Перейти к вопросу →
            </button>
          </>
        )}

        {/* STEP 2: Question */}
        {step === 'question' && (
          <>
            <div style={{
              background: cardBg, borderRadius: 16, padding: '20px',
              border: `1px solid ${border}`, marginBottom: 20,
            }}>
              <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 10 }}>МАЛЕНЬКИЙ ВОПРОС</div>
              <div style={{ fontSize: 17, color: fg, lineHeight: 1.6 }}>{scene.question.text}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {scene.question.options.map((opt, i) => {
                let bg = cardBg
                let borderColor = border
                let textColor = fg
                if (selectedAnswer !== null) {
                  if (i === scene.question.correct) { bg = isDark ? 'rgba(50,180,100,0.2)' : 'rgba(50,180,100,0.1)'; borderColor = '#32b464'; textColor = '#32b464' }
                  else if (i === selectedAnswer) { bg = isDark ? 'rgba(220,60,60,0.2)' : 'rgba(220,60,60,0.1)'; borderColor = '#dc3c3c'; textColor = isDark ? '#ff8080' : '#c03030' }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    style={{
                      background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 14,
                      padding: '16px', fontSize: 15, color: textColor, cursor: selectedAnswer === null ? 'pointer' : 'default',
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

                    {michiReaction && (
              <div style={{
                background: isDark ? 'rgba(196,168,130,0.08)' : 'rgba(139,108,66,0.05)',
                borderRadius: 14, padding: '12px 16px',
                fontSize: 13, color: fg, lineHeight: 1.6,
              }}>
                🐱 {michiReaction}
              </div>
            )}

            {/* Explanation after answer */}
            {selectedAnswer !== null && scene.question.explanation && (
              <div style={{
                marginTop: 10, background: cardBg, borderRadius: 14, padding: '14px 16px',
                border: `1px solid ${border}`, fontSize: 13, color: fgMuted, lineHeight: 1.6,
              }}>
                <span style={{ color: accent, fontWeight: 500 }}>Почему: </span>
                {scene.question.explanation}
              </div>
            )}
          </>
        )}

        {/* STEP 3: Reflection */}
        {step === 'reflection' && (
          <>
            <div style={{
              background: cardBg, borderRadius: 16, padding: '24px 20px',
              border: `1px solid ${border}`, marginBottom: 20, textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>🐱</div>
              <div style={{ fontSize: 12, color: fgMuted, letterSpacing: '0.05em', marginBottom: 12 }}>
                НАБЛЮДЕНИЕ НА СЕГОДНЯ
              </div>
              <div style={{ fontSize: 16, color: fg, lineHeight: 1.7, fontStyle: 'italic' }}>
                {scene.reflection}
              </div>
            </div>

            <div style={{
              background: isDark ? 'rgba(196,168,130,0.1)' : 'rgba(139,108,66,0.06)',
              borderRadius: 14, padding: '16px', marginBottom: 20,
              fontSize: 13, color: fg, lineHeight: 1.6,
            }}>
              🐱 {getMichiLine(scene.michi_state, 'reflection')}
            </div>

            <button
              onClick={handleDone}
              style={{
                width: '100%', padding: '16px', borderRadius: 14,
                background: isDark ? 'linear-gradient(135deg, #8b6c42, #c4a882)' : 'linear-gradient(135deg, #6b4c2a, #c4a882)',
                color: '#fff', fontSize: 16, fontWeight: 500, border: 'none', cursor: 'pointer',
              }}
            >
              Готово ✓
            </button>
          </>
        )}
      </div>
    </div>
  )
}
