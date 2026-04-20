/**
 * B.24 — Operator mode: Adaptive (memory/bias) vs Pure (fragility + trust only).
 */

export type NexoraMode = "adaptive" | "pure";

export const NEXORA_MODE_STORAGE_KEY = "nexora.mode.v1";

export function modeToBiasEnabled(mode: NexoraMode): boolean {
  return mode === "adaptive";
}

export function parseNexoraMode(raw: string | null | undefined): NexoraMode | null {
  const L = String(raw ?? "").trim().toLowerCase();
  if (L === "pure") return "pure";
  if (L === "adaptive") return "adaptive";
  return null;
}

export function readStoredNexoraMode(): NexoraMode | null {
  if (typeof window === "undefined") return null;
  try {
    return parseNexoraMode(window.localStorage.getItem(NEXORA_MODE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function persistNexoraMode(mode: NexoraMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NEXORA_MODE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

let lastB24LoggedTransition: string | null = null;

export function emitNexoraModeChangedDev(from: NexoraMode, to: NexoraMode): void {
  if (process.env.NODE_ENV === "production") return;
  if (from === to) return;
  const key = `${from}>${to}`;
  if (lastB24LoggedTransition === key) return;
  lastB24LoggedTransition = key;
  globalThis.console?.debug?.("[Nexora][B24] mode_changed", { from, to });
}
