import type { ObjectState, PsychElementId, PsychState } from "../../../lib/psych/reactionTypes";
import type { PsychGameState } from "../game/psychGameScore";
import type { AccessMode } from "../paywall/psychAccess";

const STORAGE_KEY = "nexora_psych_session_v1";
const STORAGE_VERSION = 1;
const MAX_SNAPSHOT_BYTES = 25_000;

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

let lastSavedSignature: string | null = null;
let memoryWriteDisabled = false;
let quotaDisabledWarned = false;
let memorySaveFailedWarned = false;
let corruptMemoryClearedWarned = false;
let oversizedSaveWarned = false;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function minimalObject(id: PsychElementId, object: ObjectState | undefined): ObjectState {
  return {
    id,
    brightness: object?.brightness ?? 0.2,
    activity: object?.activity ?? 0.1,
  };
}

function createMinimalSnapshot(snapshot: PsychSessionSnapshot): PsychSessionSnapshot {
  return {
    version: STORAGE_VERSION,
    savedAt: snapshot.savedAt,
    psychState: {
      energy: snapshot.psychState.energy,
      calm: snapshot.psychState.calm,
      tension: snapshot.psychState.tension,
      curiosity: snapshot.psychState.curiosity,
    },
    objects: {
      fire: minimalObject("fire", snapshot.objects.fire),
      water: minimalObject("water", snapshot.objects.water),
      air: minimalObject("air", snapshot.objects.air),
      earth: minimalObject("earth", snapshot.objects.earth),
      sun: minimalObject("sun", snapshot.objects.sun),
      ego: minimalObject("ego", snapshot.objects.ego),
    },
    gameState: {
      selfAwarenessScore: snapshot.gameState.selfAwarenessScore,
      balanceScore: snapshot.gameState.balanceScore,
      level: snapshot.gameState.level,
      achievements: snapshot.gameState.achievements.slice(0, 8),
    },
    lastInput: snapshot.lastInput ? snapshot.lastInput.slice(0, 240) : null,
    lastReaction: snapshot.lastReaction ? snapshot.lastReaction.slice(0, 320) : null,
    accessMode: snapshot.accessMode,
  };
}

function snapshotSignature(snapshot: PsychSessionSnapshot): string {
  const { savedAt: _savedAt, ...withoutSavedAt } = snapshot;
  return JSON.stringify(withoutSavedAt);
}

function isQuotaExceeded(error: unknown): boolean {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22;
  }
  if (typeof error !== "object" || error == null) return false;
  const maybeStorageError = error as { name?: unknown; code?: unknown };
  return maybeStorageError.name === "QuotaExceededError" || maybeStorageError.name === "NS_ERROR_DOM_QUOTA_REACHED" || maybeStorageError.code === 22;
}

function clearStoredSnapshot(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    lastSavedSignature = null;
  } catch {
    lastSavedSignature = null;
  }
}

function warnCorruptMemoryCleared(): void {
  if (corruptMemoryClearedWarned) return;
  corruptMemoryClearedWarned = true;
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Sycho][SYCHO-B08][CorruptOrOversizedMemoryCleared]");
  }
}

export function isPsychMemoryWriteDisabled(): boolean {
  return memoryWriteDisabled;
}

export function resetPsychMemoryWriteDisabled(): void {
  memoryWriteDisabled = false;
  quotaDisabledWarned = false;
  memorySaveFailedWarned = false;
  oversizedSaveWarned = false;
}

export function savePsychSessionSnapshot(snapshot: PsychSessionSnapshot): boolean {
  if (!canUseStorage() || memoryWriteDisabled) return false;

  const minimalSnapshot = createMinimalSnapshot(snapshot);
  const signature = snapshotSignature(minimalSnapshot);
  if (signature === lastSavedSignature) return false;

  const serialized = JSON.stringify(minimalSnapshot);
  if (serialized.length > MAX_SNAPSHOT_BYTES) {
    if (!oversizedSaveWarned && process.env.NODE_ENV !== "production") {
      oversizedSaveWarned = true;
      console.warn("[Sycho][SYCHO-B08][MemorySaveFailed]", { reason: "snapshot_oversized", bytes: serialized.length });
    }
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
    lastSavedSignature = signature;
    return true;
  } catch (error) {
    if (isQuotaExceeded(error)) {
      memoryWriteDisabled = true;
      if (!quotaDisabledWarned) {
        quotaDisabledWarned = true;
        console.warn("[Sycho][SYCHO-B08][MemoryWriteDisabledQuota]");
      }
      return false;
    }

    if (!memorySaveFailedWarned) {
      memorySaveFailedWarned = true;
      console.warn("[Sycho][SYCHO-B08][MemorySaveFailed]", error);
    }
    return false;
  }
}

export function loadPsychSessionSnapshot(): PsychSessionSnapshot | null {
  if (!canUseStorage()) return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    warnCorruptMemoryCleared();
    return null;
  }
  if (!raw) return null;
  if (raw.length > MAX_SNAPSHOT_BYTES) {
    clearStoredSnapshot();
    warnCorruptMemoryCleared();
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PsychSessionSnapshot;
    if (parsed?.version !== 1 || !parsed.psychState || !parsed.objects || !parsed.gameState) {
      clearStoredSnapshot();
      warnCorruptMemoryCleared();
      return null;
    }
    return parsed;
  } catch {
    clearStoredSnapshot();
    warnCorruptMemoryCleared();
    return null;
  }
}

export function clearPsychSessionSnapshot(): void {
  clearStoredSnapshot();
  resetPsychMemoryWriteDisabled();
}
