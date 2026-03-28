import { Level } from '../../content/scenes'
import { MichiState } from '../../content/michi_lines'
import { PathCategory } from '../../content/path_cards'

export interface UserProfile {
  userId: number
  level: Level
  scenesOpened: number
  wordsEncountered: string[]
  correctAnswers: number
  totalAnswers: number
  reflectionCount: number
  easyTaps: number[]        // timestamps последних нажатий "слишком легко"
  hardTaps: number[]        // timestamps "слишком сложно"
  lastSeenDate: string
  daysStreak: number
  energyToday: 'fog' | 'energy' | 'chaos' | 'quiet' | 'tired' | null
  michiState: MichiState
  pathInterests: PathCategory[]
  shownPathCards: string[]
  language: 'ru' | 'en'
  createdAt: string
}

const DEFAULT_PROFILE: UserProfile = {
  userId: Math.floor(Math.random() * 9999) + 1,
  level: 'N5',
  scenesOpened: 0,
  wordsEncountered: [],
  correctAnswers: 0,
  totalAnswers: 0,
  reflectionCount: 0,
  easyTaps: [],
  hardTaps: [],
  lastSeenDate: '',
  daysStreak: 0,
  energyToday: null,
  michiState: 'night_watcher',
  pathInterests: [],
  shownPathCards: [],
  language: 'ru',
  createdAt: new Date().toISOString(),
}

const KEY = 'michi_profile'

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return { ...DEFAULT_PROFILE }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_PROFILE }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(profile))
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const current = loadProfile()
  const updated = { ...current, ...updates }
  saveProfile(updated)
  return updated
}

// Логика адаптации сложности
export function shouldSuggestLevelUp(profile: UserProfile): boolean {
  const now = Date.now()
  const recentEasy = profile.easyTaps.filter(t => now - t < 1000 * 60 * 60 * 24 * 7) // за неделю
  const accuracy = profile.totalAnswers > 0 ? profile.correctAnswers / profile.totalAnswers : 0
  return recentEasy.length >= 3 || (profile.totalAnswers >= 10 && accuracy >= 0.8)
}

export function shouldSuggestLevelDown(profile: UserProfile): boolean {
  const now = Date.now()
  const recentHard = profile.hardTaps.filter(t => now - t < 1000 * 60 * 60 * 24 * 3) // за 3 дня
  const accuracy = profile.totalAnswers > 0 ? profile.correctAnswers / profile.totalAnswers : 1
  return recentHard.length >= 3 || (profile.totalAnswers >= 5 && accuracy < 0.4)
}

export function isReturningUser(profile: UserProfile): boolean {
  if (!profile.lastSeenDate) return false
  const last = new Date(profile.lastSeenDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays >= 2
}

export function addPathInterest(category: PathCategory): void {
  const profile = loadProfile()
  if (!profile.pathInterests.includes(category)) {
    profile.pathInterests = [...profile.pathInterests, category]
    saveProfile(profile)
  }
}

export function recordAnswer(correct: boolean): void {
  const profile = loadProfile()
  profile.totalAnswers += 1
  if (correct) profile.correctAnswers += 1
  saveProfile(profile)
}

export function recordEasyTap(): void {
  const profile = loadProfile()
  profile.easyTaps = [...profile.easyTaps.slice(-9), Date.now()]
  saveProfile(profile)
}

export function recordHardTap(): void {
  const profile = loadProfile()
  profile.hardTaps = [...profile.hardTaps.slice(-9), Date.now()]
  saveProfile(profile)
}
