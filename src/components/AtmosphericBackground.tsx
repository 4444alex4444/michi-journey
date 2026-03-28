'use client'
import { useEffect, useState } from 'react'

type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' | 'deep_night'
type Season = 'spring' | 'summer' | 'autumn' | 'winter'

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 4 && hour < 7) return 'dawn'
  if (hour >= 7 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  if (hour >= 20 && hour < 23) return 'night'
  return 'deep_night'
}

function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// Colour palettes inspired by Miyazaki films + Murakami urban prose
const PALETTES: Record<Season, Record<TimeOfDay, { sky: string[]; accent: string; fog: string; stars: boolean }>> = {
  spring: {
    dawn:      { sky: ['#f9c8d0','#fde8c8','#e8c8f0'], accent: '#f48fb1', fog: 'rgba(255,220,230,0.35)', stars: false },
    morning:   { sky: ['#b3e0f7','#dff6ff','#fff9f0'], accent: '#90caf9', fog: 'rgba(200,230,255,0.2)',  stars: false },
    afternoon: { sky: ['#87ceeb','#c8e6f5','#e8f5e9'], accent: '#64b5f6', fog: 'rgba(180,220,255,0.15)',stars: false },
    evening:   { sky: ['#ff8a65','#ffb74d','#ce93d8'], accent: '#ff7043', fog: 'rgba(255,180,120,0.3)', stars: false },
    night:     { sky: ['#1a237e','#283593','#4a148c'], accent: '#7986cb', fog: 'rgba(100,80,160,0.4)',  stars: true },
    deep_night:{ sky: ['#0d0d2b','#1a1a3e','#0d1b2a'], accent: '#5c6bc0', fog: 'rgba(60,50,120,0.5)', stars: true },
  },
  summer: {
    dawn:      { sky: ['#ffcc80','#ffe0b2','#fff9c4'], accent: '#ffa726', fog: 'rgba(255,220,150,0.3)', stars: false },
    morning:   { sky: ['#4fc3f7','#b3e5fc','#e0f7fa'], accent: '#29b6f6', fog: 'rgba(180,240,255,0.2)', stars: false },
    afternoon: { sky: ['#039be5','#4fc3f7','#b2ebf2'], accent: '#0288d1', fog: 'rgba(150,220,250,0.15)',stars: false },
    evening:   { sky: ['#f4511e','#ff7043','#ff8f00'], accent: '#e64a19', fog: 'rgba(255,120,50,0.35)', stars: false },
    night:     { sky: ['#0d1b2a','#162032','#1a2744'], accent: '#4fc3f7', fog: 'rgba(50,80,130,0.5)',  stars: true },
    deep_night:{ sky: ['#050e1a','#0d1b2a','#091520'], accent: '#1565c0', fog: 'rgba(30,50,100,0.6)', stars: true },
  },
  autumn: {
    dawn:      { sky: ['#d7ccc8','#f5deb3','#ffe0b2'], accent: '#a1887f', fog: 'rgba(220,190,150,0.4)', stars: false },
    morning:   { sky: ['#bcaaa4','#efebe9','#fff8e1'], accent: '#8d6e63', fog: 'rgba(200,170,130,0.25)',stars: false },
    afternoon: { sky: ['#b0bec5','#cfd8dc','#eceff1'], accent: '#78909c', fog: 'rgba(180,190,200,0.2)', stars: false },
    evening:   { sky: ['#bf360c','#d84315','#e64a19'], accent: '#ff5722', fog: 'rgba(200,80,30,0.4)',  stars: false },
    night:     { sky: ['#1c1208','#2d1f0e','#3e2b14'], accent: '#a1887f', fog: 'rgba(80,50,20,0.5)',  stars: true },
    deep_night:{ sky: ['#0c0804','#1a110a','#0d0907'], accent: '#6d4c41', fog: 'rgba(50,30,10,0.6)', stars: true },
  },
  winter: {
    dawn:      { sky: ['#b0bec5','#cfd8dc','#e8eaf6'], accent: '#90a4ae', fog: 'rgba(200,210,230,0.5)', stars: false },
    morning:   { sky: ['#cfd8dc','#e3f2fd','#f5f5f5'], accent: '#b0bec5', fog: 'rgba(220,230,245,0.35)',stars: false },
    afternoon: { sky: ['#b0bec5','#cfd8dc','#e0e0e0'], accent: '#78909c', fog: 'rgba(190,200,220,0.3)', stars: false },
    evening:   { sky: ['#4a148c','#6a1b9a','#311b92'], accent: '#9c27b0', fog: 'rgba(100,60,150,0.45)',stars: false },
    night:     { sky: ['#0d0d1f','#1a1a3e','#12122e'], accent: '#7986cb', fog: 'rgba(40,40,100,0.55)', stars: true },
    deep_night:{ sky: ['#050510','#0d0d1f','#080818'], accent: '#3f51b5', fog: 'rgba(20,20,70,0.65)', stars: true },
  },
}

// SVG scene elements per season/time — Miyazaki-inspired silhouettes
function SceneSVG({ season, time }: { season: Season; time: TimeOfDay }) {
  const isNight = time === 'night' || time === 'deep_night'
  const isEvening = time === 'evening'

  return (
    <svg
      viewBox="0 0 400 220"
      style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0 }}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Ground / horizon */}
      {season === 'spring' && (
        <>
          {/* Cherry blossom hill */}
          <ellipse cx="200" cy="220" rx="260" ry="80" fill="rgba(210,180,200,0.35)" />
          {/* Torii gate silhouette */}
          <rect x="170" y="120" width="8" height="80" fill="rgba(120,40,30,0.6)" />
          <rect x="222" y="120" width="8" height="80" fill="rgba(120,40,30,0.6)" />
          <rect x="162" y="118" width="76" height="10" rx="2" fill="rgba(140,50,35,0.65)" />
          <rect x="168" y="108" width="64" height="8" rx="2" fill="rgba(140,50,35,0.55)" />
          {/* Blossom trees */}
          {[60,140,260,330].map((x,i) => (
            <g key={i}>
              <rect x={x} y={150} width="5" height="60" fill="rgba(90,55,30,0.5)" />
              <ellipse cx={x+2} cy={145} rx={18} ry={14} fill={isNight ? 'rgba(180,130,160,0.3)' : 'rgba(255,182,193,0.55)'} />
              <ellipse cx={x+2} cy={140} rx={14} ry={10} fill={isNight ? 'rgba(160,110,140,0.25)' : 'rgba(255,192,203,0.45)'} />
            </g>
          ))}
        </>
      )}
      {season === 'summer' && (
        <>
          {/* Bamboo grove */}
          {[30,60,90,310,340,370].map((x,i) => (
            <g key={i}>
              <rect x={x} y={60} width="6" height="160" fill={isNight ? 'rgba(30,70,30,0.5)' : 'rgba(50,120,50,0.45)'} rx="1"/>
              <ellipse cx={x+3} cy={75} rx={12} ry={6} fill={isNight ? 'rgba(20,60,20,0.4)' : 'rgba(60,140,60,0.4)'} />
            </g>
          ))}
          {/* Mountain Fuji silhouette in distance */}
          <polygon points="140,100 200,20 260,100" fill={isNight ? 'rgba(20,40,80,0.5)' : 'rgba(100,120,160,0.25)'} />
          <polygon points="155,100 200,38 245,100" fill="rgba(230,240,255,0.3)" />
          {/* Ground */}
          <rect x="0" y="175" width="400" height="45" fill={isNight ? 'rgba(20,40,20,0.4)' : 'rgba(60,120,60,0.3)'} rx="0"/>
        </>
      )}
      {season === 'autumn' && (
        <>
          {/* Autumn tree silhouettes */}
          {[50,130,270,350].map((x,i) => (
            <g key={i}>
              <rect x={x} y={130} width="7" height="80" fill="rgba(70,40,20,0.55)" />
              <ellipse cx={x+3} cy={120} rx={25} ry={20} fill={isNight ? 'rgba(100,50,20,0.4)' : 'rgba(200,80,20,0.45)'} />
              <ellipse cx={x+3} cy={110} rx={18} ry={14} fill={isNight ? 'rgba(80,40,15,0.35)' : 'rgba(220,100,30,0.4)'} />
            </g>
          ))}
          {/* Temple roof */}
          <polygon points="140,140 200,95 260,140" fill="rgba(60,30,10,0.5)" />
          <rect x="150" y="140" width="100" height="50" fill="rgba(70,35,12,0.45)" />
          {/* Path */}
          <ellipse cx="200" cy="210" rx="80" ry="15" fill="rgba(150,100,50,0.3)" />
        </>
      )}
      {season === 'winter' && (
        <>
          {/* Snow-covered ground */}
          <ellipse cx="200" cy="215" rx="280" ry="30" fill="rgba(230,240,255,0.5)" />
          {/* Bare trees */}
          {[60,130,270,340].map((x,i) => (
            <g key={i} opacity="0.55">
              <rect x={x} y={140} width="5" height="70" fill="rgba(50,40,35,0.7)" />
              <line x1={x+2} y1={160} x2={x-12} y2={140} stroke="rgba(50,40,35,0.5)" strokeWidth="2"/>
              <line x1={x+2} y1={160} x2={x+16} y2={138} stroke="rgba(50,40,35,0.5)" strokeWidth="2"/>
              <line x1={x+2} y1={175} x2={x-8} y2={158} stroke="rgba(50,40,35,0.4)" strokeWidth="1.5"/>
              <line x1={x+2} y1={175} x2={x+10} y2={156} stroke="rgba(50,40,35,0.4)" strokeWidth="1.5"/>
            </g>
          ))}
          {/* Train station silhouette */}
          <rect x="160" y="120" width="80" height="60" fill="rgba(40,40,60,0.4)" rx="2"/>
          <rect x="150" y="115" width="100" height="15" fill="rgba(40,40,60,0.45)" rx="1"/>
          {/* Snow on roof */}
          <rect x="152" y="113" width="96" height="6" fill="rgba(220,230,255,0.6)" rx="3"/>
          {/* Platform light glow */}
          {isNight && <ellipse cx="200" cy="180" rx="30" ry="8" fill="rgba(255,240,180,0.25)" />}
        </>
      )}

      {/* Train silhouette — always present, seasonal colour */}
      {(isNight || isEvening) && (
        <g opacity="0.7">
          <rect x="-20" y="185" width="120" height="22" fill="rgba(30,30,50,0.8)" rx="4"/>
          <rect x="-18" y="188" width="25" height="10" fill="rgba(255,240,180,0.6)" rx="2"/>
          <rect x="12" y="188" width="25" height="10" fill="rgba(255,240,180,0.6)" rx="2"/>
          <ellipse cx="-5" cy="207" rx="5" ry="5" fill="rgba(40,40,60,0.9)"/>
          <ellipse cx="60" cy="207" rx="5" ry="5" fill="rgba(40,40,60,0.9)"/>
        </g>
      )}

      {/* Vending machine glow (night only) */}
      {isNight && (
        <g>
          <rect x="345" y="150" width="28" height="55" fill="rgba(180,200,255,0.2)" rx="3"/>
          <rect x="347" y="155" width="24" height="30" fill="rgba(150,200,255,0.35)" rx="2"/>
          <ellipse cx="359" cy="185" rx="20" ry="8" fill="rgba(150,200,255,0.15)"/>
        </g>
      )}

      {/* Cat silhouette */}
      <g opacity={isNight ? 0.7 : 0.45} transform="translate(20,175)">
        <ellipse cx="15" cy="20" rx="10" ry="7" fill="rgba(30,25,20,0.8)"/>
        <circle cx="20" cy="12" r="7" fill="rgba(30,25,20,0.8)"/>
        <polygon points="14,7 12,0 18,6" fill="rgba(30,25,20,0.8)"/>
        <polygon points="22,7 28,1 24,7" fill="rgba(30,25,20,0.8)"/>
        {isNight && <>
          <ellipse cx="18" cy="12" rx="2" ry="3" fill="rgba(180,220,180,0.8)"/>
          <ellipse cx="23" cy="12" rx="2" ry="3" fill="rgba(180,220,180,0.8)"/>
        </>}
      </g>
    </svg>
  )
}

export default function AtmosphericBackground({ isDark }: { isDark: boolean }) {
  const [time, setTime] = useState<TimeOfDay>('morning')
  const [season, setSeason] = useState<Season>('spring')

  useEffect(() => {
    const now = new Date()
    setTime(getTimeOfDay(now.getHours()))
    setSeason(getSeason(now.getMonth() + 1))
  }, [])

  const palette = PALETTES[season][time]
  const [c1, c2, c3] = palette.sky

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
      background: `linear-gradient(180deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)`,
    }}>
      {/* Stars */}
      {palette.stars && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          ))}
        </div>
      )}

      {/* Moon */}
      {(time === 'night' || time === 'deep_night') && (
        <div style={{
          position: 'absolute', top: '8%', right: '12%',
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,248,220,0.9)',
          boxShadow: '0 0 20px rgba(255,248,180,0.5)',
        }} />
      )}

      {/* Dawn/dusk soft light disc */}
      {(time === 'dawn' || time === 'evening') && (
        <div style={{
          position: 'absolute',
          top: time === 'dawn' ? '30%' : '20%',
          left: time === 'dawn' ? '15%' : '75%',
          width: 60, height: 60, borderRadius: '50%',
          background: time === 'dawn' ? 'rgba(255,200,100,0.7)' : 'rgba(255,120,50,0.7)',
          filter: 'blur(8px)',
        }} />
      )}

      {/* Fog layer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: `linear-gradient(to top, ${palette.fog}, transparent)`,
      }} />

      {/* Scene SVG */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%' }}>
        <SceneSVG season={season} time={time} />
      </div>

      {/* Content overlay — darkens the bg so text is readable */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark
          ? 'rgba(5,5,20,0.55)'
          : 'rgba(255,255,255,0.18)',
      }} />

      <style>{`
        @keyframes twinkle {
          0%,100%{opacity:0.4;transform:scale(1)}
          50%{opacity:1;transform:scale(1.4)}
        }
      `}</style>
    </div>
  )
}
