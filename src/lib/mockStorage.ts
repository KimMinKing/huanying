export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function loadCollection<T>(storageKey: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      window.localStorage.setItem(storageKey, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw) as T[]
  } catch {
    return fallback
  }
}

export function saveCollection<T>(storageKey: string, value: T[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, JSON.stringify(value))
}

function dispatchAuthChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('lifful-auth-changed'))
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

function decodeBase64(value: string) {
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function readSession<T>(storageKey: string): T | null {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem(storageKey)
  if (!token) return null

  try {
    return JSON.parse(decodeBase64(token)) as T
  } catch {
    return null
  }
}

export function writeSession<T>(storageKey: string, value: T) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey, encodeBase64(JSON.stringify(value)))
  dispatchAuthChange()
}

export function clearSession(storageKey: string) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(storageKey)
  dispatchAuthChange()
}
