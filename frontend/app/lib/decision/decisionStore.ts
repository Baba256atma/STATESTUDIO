import type { DecisionSnapshot, DecisionStoreState } from "./decisionTypes";

const STORE_VERSION = 1;
const SNAPSHOT_LIMIT = 50;

const makeKey = (projectId: string): string =>
  `stateStudio:decisionSnapshots:${projectId || "default"}`;

const safeParse = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isSnapshot = (x: any): x is DecisionSnapshot =>
  x &&
  typeof x === "object" &&
  typeof x.id === "string" &&
  typeof x.timestamp === "number" &&
  typeof x.projectId === "string" &&
  Array.isArray(x.loops) &&
  (x.activeLoopId === null || typeof x.activeLoopId === "string");

function readStore(projectId: string): DecisionStoreState {
  if (typeof window === "undefined") {
    return { version: STORE_VERSION, snapshots: [] };
  }
  try {
    const raw = window.localStorage.getItem(makeKey(projectId));
    if (!raw) return { version: STORE_VERSION, snapshots: [] };
    const parsed = safeParse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed as any).version === STORE_VERSION &&
      Array.isArray((parsed as any).snapshots)
    ) {
      const snapshots = (parsed as any).snapshots.filter(isSnapshot);
      return { version: STORE_VERSION, snapshots };
    }
  } catch {
    // ignore
  }
  return { version: STORE_VERSION, snapshots: [] };
}

function writeStore(projectId: string, store: DecisionStoreState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(makeKey(projectId), JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function loadSnapshots(projectId: string): DecisionSnapshot[] {
  const store = readStore(projectId);
  const sorted = [...store.snapshots].sort((a, b) => a.timestamp - b.timestamp);
  return sorted.slice(-SNAPSHOT_LIMIT);
}

export function appendSnapshot(
  projectId: string,
  snapshot: Omit<DecisionSnapshot, "projectId">
): DecisionSnapshot[] {
  const safeId = projectId || "default";
  const store = readStore(safeId);
  const nextSnapshots = [...store.snapshots, { ...snapshot, projectId: safeId }];
  const trimmed = nextSnapshots.slice(-SNAPSHOT_LIMIT);
  writeStore(safeId, { version: STORE_VERSION, snapshots: trimmed });
  return trimmed;
}

export function replaceSnapshots(projectId: string, snapshots: DecisionSnapshot[]): DecisionSnapshot[] {
  const safeId = projectId || "default";
  const normalized = Array.isArray(snapshots)
    ? snapshots
        .filter(isSnapshot)
        .map((s) => ({ ...s, projectId: safeId }))
        .sort((a, b) => a.timestamp - b.timestamp)
    : [];
  const trimmed = normalized.slice(-SNAPSHOT_LIMIT);
  writeStore(safeId, { version: STORE_VERSION, snapshots: trimmed });
  return trimmed;
}

export function clearSnapshots(projectId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(makeKey(projectId));
  } catch {
    // ignore
  }
}
