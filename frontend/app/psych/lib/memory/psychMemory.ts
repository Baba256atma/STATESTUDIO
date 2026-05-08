import type { ObjectState, PsychElementId, PsychState } from "../../../lib/psych/reactionTypes";
import type { PsychGameState } from "../game/psychGameScore";
import type { AccessMode } from "../paywall/psychAccess";

const LEGACY_STORAGE_KEY = "nexora_psych_session_v1";
const DISABLED_SESSION_KEY = "nexora_psych_memory_disabled";

export type PsychSessionSnapshot = {
  version: 1;
  savedAt: string;
  psychState: PsychState;
  objects: Record<PsychElementId, ObjectState>;
  gameState: PsychGameState;
  lastInput: string | null;
  lastReaction: string | null;
  accessMode?: AccessMode;
};

let memoryWriteDisabled = false;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function clearLegacyDisabledFlag(): void {
  if (typeof window === "undefined" || typeof window.sessionStorage === "undefined") return;
  try {
    window.sessionStorage.removeItem(DISABLED_SESSION_KEY);
  } catch {
    // Best effort cleanup.
  }
}

export function isPsychMemoryWriteDisabled(): boolean {
  return memoryWriteDisabled;
}

export function resetPsychMemoryWriteDisabled(): void {
  memoryWriteDisabled = false;
  clearLegacyDisabledFlag();
}

export function savePsychSessionSnapshot(_snapshot: PsychSessionSnapshot): boolean {
  // SYCHO-B08-SLIM:
  // Scene snapshots are intentionally disabled.
  // Persistent memory now stores only tiny behavioral signals in memoryEngine.ts.
  return false;
}

export function loadPsychSessionSnapshot(): PsychSessionSnapshot | null {
  if (!canUseStorage()) return null;
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore cleanup failures; loading a scene snapshot is disabled.
  }
  return null;
}

export function clearPsychSessionSnapshot(): void {
  if (canUseStorage()) {
    try {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Best effort cleanup.
    }
  }
  resetPsychMemoryWriteDisabled();
}
