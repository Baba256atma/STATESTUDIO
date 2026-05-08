"use client";

const SESSION_KEY = "sycho_session_id";

let memorySessionId: string | null = null;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sycho_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getSessionId(): string {
  if (memorySessionId) return memorySessionId;

  if (typeof window === "undefined") {
    memorySessionId = createSessionId();
    return memorySessionId;
  }

  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      memorySessionId = stored;
      return stored;
    }

    const next = createSessionId();
    window.sessionStorage.setItem(SESSION_KEY, next);
    memorySessionId = next;
    return next;
  } catch {
    memorySessionId = createSessionId();
    return memorySessionId;
  }
}
