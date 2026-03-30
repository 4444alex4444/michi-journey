'use client'
import { useState, useRef, useEffect } from 'react'
import { UserProfile } from '@/lib/profile'

interface Props {
  profile: UserProfile
  onBack: () => void
  isDark: boolean
}

interface Message {
  role: 'user' | 'michi'
  content: string
}

export default function ChatScreen({ profile, onBack, isDark }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'michi',
    content: 'Привет. Я здесь. Можешь спросить про японский, про Японию — или просто написать, как дела.',
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fg = isDark ? '#e8e6df' : '#2a2825'
  const fgMuted = isDark ? '#888880' : '#888'
  const cardBg = isDark ? '#1a1a2e' : '#ffffff'
  const accent = isDark ? '#c4a882' : '#8b6c42'
  const border = isDark ? '#2a2a3e' : '#e8e5df'
  const userBubble = isDark ? '#2a2a3e' : '#f0ede8'
  const michiBubble = isDark ? 'rgba(196,168,130,0.12)' : 'rgba(139,108,66,0.08)'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          profile: {
            level: profile.level,
            scenesOpened: profile.scenesOpened,
            responseDepth: profile.responseDepth,
          },
          history: messages.slice(-6),
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'michi', content: data.reply || 'Хм. Что-то пошло не так на моей стороне.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'michi', content: 'Не могу ответить прямо сейчас. Попробуй чуть позже.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 12, borderBottom: `1px solid ${border}` }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: fgMuted }}>←</button>
        <span style={{ fontSize: 22 }}>🐱</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: fg }}>Michi</div>
          <div style={{ fontSize: 11, color: fgMuted }}>всегда здесь</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'michi' && <span style={{ fontSize: 20, marginRight: 8, alignSelf: 'flex-end', marginBottom: 2 }}>🐱</span>}
            <div style={{
              maxWidth: '78%', padding: '14px 18px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? userBubble : michiBubble,
              border: `1px solid ${msg.role === 'user' ? border : isDark ? 'rgba(196,168,130,0.2)' : 'rgba(139,108,66,0.12)'}`,
              fontSize: 16, color: fg, lineHeight: 1.7,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🐱</span>
            <div style={{ background: michiBubble, borderRadius: '18px 18px 18px 4px', padding: '12px 16px', border: `1px solid ${isDark ? 'rgba(196,168,130,0.2)' : 'rgba(139,108,66,0.12)'}` }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: accent, opacity: 0.6, animation: `dot 1s ease-in-out ${j * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '12px 20px max(12px, env(safe-area-inset-bottom))', borderTop: `1px solid ${border}`, display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Спроси что-нибудь..."
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 24,
            background: cardBg, border: `1px solid ${border}`,
            fontSize: 16, color: fg, outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: input.trim() ? accent : (isDark ? '#2a2a3e' : '#e8e5df'),
            color: input.trim() ? '#fff' : fgMuted,
            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            fontSize: 18, flexShrink: 0,
          }}
        >→</button>
      </div>
      <style>{`@keyframes dot { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }`}</style>
    </div>
  )
}
