import type {
  ExecutiveOrientationPersistedState,
  ExecutiveOrientationSnapshot,
  ExecutiveOrientationTier,
} from "./executiveOrientationTypes";
import { SSR_EXECUTIVE_ORIENTATION_SNAPSHOT } from "../executiveHydrationContract";
import { logExecutiveOrientation } from "./executiveOrientationInstrumentation";

export const EXECUTIVE_ORIENTATION_STORAGE_KEY = "nexora:executive-orientation";

const DEFAULT_STATE: ExecutiveOrientationPersistedState = {
  visitCount: 0,
  welcomeDismissed: false,
  lastVisitAt: null,
  totalSessionSeconds: 0,
};

let memoryState: ExecutiveOrientationPersistedState = { ...DEFAULT_STATE };

function readPersistedState(): ExecutiveOrientationPersistedState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(EXECUTIVE_ORIENTATION_STORAGE_KEY);
    if (!raw) return memoryState;
    const parsed = JSON.parse(raw) as Partial<ExecutiveOrientationPersistedState>;
    memoryState = {
      visitCount: typeof parsed.visitCount === "number" ? parsed.visitCount : 0,
      welcomeDismissed: parsed.welcomeDismissed === true,
      lastVisitAt: typeof parsed.lastVisitAt === "number" ? parsed.lastVisitAt : null,
      totalSessionSeconds:
        typeof parsed.totalSessionSeconds === "number" ? parsed.totalSessionSeconds : 0,
    };
  } catch {
    memoryState = { ...DEFAULT_STATE };
  }
  return memoryState;
}

function writePersistedState(state: ExecutiveOrientationPersistedState): void {
  memoryState = state;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EXECUTIVE_ORIENTATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Best-effort persistence only.
  }
}

export function resolveExecutiveOrientationTier(
  state: ExecutiveOrientationPersistedState
): ExecutiveOrientationTier {
  if (state.visitCount <= 1 && !state.welcomeDismissed) return "firstVisit";
  if (state.visitCount <= 5 || state.totalSessionSeconds < 900) return "returningUser";
  return "experiencedUser";
}

export function hydrateExecutiveOrientationState(): ExecutiveOrientationPersistedState {
  return readPersistedState();
}

export function getExecutiveOrientationServerSnapshot(): ExecutiveOrientationSnapshot {
  return SSR_EXECUTIVE_ORIENTATION_SNAPSHOT;
}

export function resolveExecutiveOrientationSnapshot(
  persisted?: ExecutiveOrientationPersistedState
): ExecutiveOrientationSnapshot {
  if (persisted === undefined && typeof window === "undefined") {
    return getExecutiveOrientationServerSnapshot();
  }
  const state = persisted ?? readPersistedState();
  const tier = resolveExecutiveOrientationTier(state);
  const snapshot: ExecutiveOrientationSnapshot = {
    tier,
    visitCount: state.visitCount,
    welcomeDismissed: state.welcomeDismissed,
    isFirstVisit: tier === "firstVisit",
  };
  logExecutiveOrientation("resolved", snapshot);
  return snapshot;
}

/** Record a workspace open — call once per executive session entry. */
export function recordExecutiveOrientationVisit(): ExecutiveOrientationSnapshot {
  const current = readPersistedState();
  const next: ExecutiveOrientationPersistedState = {
    ...current,
    visitCount: current.visitCount + 1,
    lastVisitAt: Date.now(),
  };
  writePersistedState(next);
  return resolveExecutiveOrientationSnapshot(next);
}

export function dismissExecutiveWelcome(): ExecutiveOrientationSnapshot {
  const current = readPersistedState();
  const next: ExecutiveOrientationPersistedState = {
    ...current,
    welcomeDismissed: true,
  };
  writePersistedState(next);
  return resolveExecutiveOrientationSnapshot(next);
}

export function accumulateExecutiveOrientationSession(seconds: number): void {
  if (seconds <= 0) return;
  const current = readPersistedState();
  writePersistedState({
    ...current,
    totalSessionSeconds: current.totalSessionSeconds + seconds,
  });
}

export function resetExecutiveOrientationForTests(): void {
  memoryState = { ...DEFAULT_STATE };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(EXECUTIVE_ORIENTATION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
