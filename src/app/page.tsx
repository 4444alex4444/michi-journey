'use client'
import { useEffect, useState } from 'react'
import HomeScreen from '@/components/HomeScreen'
import SceneScreen from '@/components/SceneScreen'
import PathScreen from '@/components/PathScreen'
import ChatScreen from '@/components/ChatScreen'
import SettingsScreen from '@/components/SettingsScreen'
import { loadProfile, UserProfile } from '@/lib/profile'

export type Screen = 'home' | 'scene' | 'path' | 'chat' | 'settings'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const p = loadProfile()
    setProfile(p)
    // Detect time for day/night theme
    const hour = new Date().getHours()
    setIsDark(hour >= 20 || hour < 7)
    // Init Telegram WebApp if available
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
    }
  }, [])

  const refreshProfile = () => setProfile(loadProfile())

  if (!profile) return <Loader isDark={isDark} />

  const bg = isDark ? '#0d0d1a' : '#f5f3ee'
  const fg = isDark ? '#e8e6df' : '#2a2825'

  return (
    <div style={{ minHeight: '100dvh', background: bg, color: fg, transition: 'background 0.5s' }}>
      {/* Screen router */}
      {screen === 'home' && <HomeScreen profile={profile} onNavigate={setScreen} isDark={isDark} />}
      {screen === 'scene' && <SceneScreen profile={profile} onBack={() => setScreen('home')} onProfileUpdate={refreshProfile} isDark={isDark} />}
      {screen === 'path' && <PathScreen profile={profile} onBack={() => setScreen('home')} onProfileUpdate={refreshProfile} isDark={isDark} />}
      {screen === 'chat' && <ChatScreen profile={profile} onBack={() => setScreen('home')} isDark={isDark} />}
      {screen === 'settings' && <SettingsScreen profile={profile} onBack={() => setScreen('home')} onProfileUpdate={refreshProfile} isDark={isDark} />}

      {/* Bottom nav */}
      {screen === 'home' && (
        <BottomNav current={screen} onNavigate={setScreen} isDark={isDark} />
      )}
    </div>
  )
}

function BottomNav({ current, onNavigate, isDark }: { current: Screen; onNavigate: (s: Screen) => void; isDark: boolean }) {
  const bg = isDark ? '#1a1a2e' : '#ffffff'
  const border = isDark ? '#2a2a3e' : '#e8e5df'
  const items: { id: Screen; label: string; emoji: string }[] = [
    { id: 'home', label: 'Сегодня', emoji: '🌙' },
    { id: 'path', label: 'Путь', emoji: '🗺' },
    { id: 'chat', label: 'Мичи', emoji: '🐱' },
    { id: 'settings', label: 'Настройки', emoji: '⚙' },
  ]
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: bg, borderTop: `1px solid ${border}`, display: 'flex', padding: '8px 0 max(8px, env(safe-area-inset-bottom))' }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: 'none', border: 'none', cursor: 'pointer',
            color: current === item.id ? (isDark ? '#c4a882' : '#8b6c42') : (isDark ? '#666' : '#999'),
            fontSize: 10, padding: '4px 0',
          }}
        >
          <span style={{ fontSize: 20 }}>{item.emoji}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

function Loader({ isDark }: { isDark: boolean }) {
  return (
    <div style={{ minHeight: '100dvh', background: isDark ? '#0d0d1a' : '#f5f3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🐱</div>
      <div style={{ color: isDark ? '#888' : '#999', fontSize: 14 }}>Michi готовится...</div>
    </div>
  )
}
