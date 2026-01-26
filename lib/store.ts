// Shared state store with localStorage persistence
// Keys for localStorage
export const STORE_KEYS = {
  LAST_SCAN: "cacs_last_scan_date",
  STATS: "cacs_stats",
  IS_SCANNING: "cacs_is_scanning",
} as const

export interface Stats {
  totalWallets: number
  highRiskCount: number
  alertsToday: number
  piiExtracted: number
}

export const DEFAULT_STATS: Stats = {
  totalWallets: 1247,
  highRiskCount: 89,
  alertsToday: 12,
  piiExtracted: 156,
}

// Get stats from localStorage or return defaults
export function getStoredStats(): Stats {
  if (typeof window === "undefined") return DEFAULT_STATS
  const stored = localStorage.getItem(STORE_KEYS.STATS)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return DEFAULT_STATS
    }
  }
  return DEFAULT_STATS
}

// Save stats to localStorage
export function saveStats(stats: Stats): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORE_KEYS.STATS, JSON.stringify(stats))
}

// Get last scan date from localStorage
export function getStoredLastScan(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORE_KEYS.LAST_SCAN)
}

// Save last scan date to localStorage
export function saveLastScan(date: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORE_KEYS.LAST_SCAN, date)
}

// Get scanning state from localStorage
export function getStoredIsScanning(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORE_KEYS.IS_SCANNING) === "true"
}

// Save scanning state to localStorage
export function saveIsScanning(isScanning: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORE_KEYS.IS_SCANNING, String(isScanning))
}
