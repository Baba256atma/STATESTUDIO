import type { DecisionSnapshot, DecisionStoreState } from "./decisionTypes";
import type { DecisionInsightOutput } from "./decisionIntelligenceTypes";

const STORE_VERSION = 1;
const SNAPSHOT_LIMIT = 50;
const DEV = typeof process !== "undefined" && process.env.NODE_ENV !== "production";

let currentDecision: DecisionInsightOutput | null = null;
let lastDecisionSignature: string | null = null;
let lastResultSignature: string | null = null;
let lastNotifyTime = 0;
let decisionExecutionCount = 0;
const decisionSubscribers = new Set<(decision: DecisionInsightOutput | null) => void>();

const makeKey = (projectId: string): string =>
  `stateStudio:decisionSnapshots:${projectId || "default"}`;

const safeParse = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isSnapshot = (x: unknown): x is DecisionSnapshot =>
  Boolean(
    x &&
      typeof x === "object" &&
      typeof (x as DecisionSnapshot).id === "string" &&
      typeof (x as DecisionSnapshot).timestamp === "number" &&
      typeof (x as DecisionSnapshot).projectId === "string" &&
      Array.isArray((x as DecisionSnapshot).loops) &&
      ((x as DecisionSnapshot).activeLoopId === null ||
        typeof (x as DecisionSnapshot).activeLoopId === "string")
  );

function readStore(projectId: string): DecisionStoreState {
  if (typeof window === "undefined") {
    return { version: STORE_VERSION, snapshots: [] };
  }
  try {
    const raw = window.localStorage.getItem(makeKey(projectId));
    if (!raw) return { version: STORE_VERSION, snapshots: [] };
    const parsed = safeParse(raw);
    const parsedRecord =
      parsed && typeof parsed === "object" ? (parsed as DecisionStoreState) : null;
    if (
      parsedRecord &&
      parsedRecord.version === STORE_VERSION &&
      Array.isArray(parsedRecord.snapshots)
    ) {
      const snapshots = parsedRecord.snapshots.filter(isSnapshot);
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

export function resetDecisionExecutionGuard(): void {
  decisionExecutionCount = 0;
}

function notifyDecisionSubscribers(result: DecisionInsightOutput | null): void {
  const now = Date.now();
  if (now - lastNotifyTime < 30) return;
  lastNotifyTime = now;
  for (const subscriber of decisionSubscribers) {
    subscriber(result);
  }
}

export function setDecision(result: DecisionInsightOutput, signature: string): void {
  decisionExecutionCount += 1;
  if (DEV && decisionExecutionCount > 10) {
    globalThis.console?.warn?.("[Nexora][DecisionLoopDetected] forced stop", {
      signature,
      executionCount: decisionExecutionCount,
    });
    return;
  }
  if (signature === lastResultSignature) return;
  lastResultSignature = signature;
  if (signature === lastDecisionSignature) return;
  lastDecisionSignature = signature;
  currentDecision = result;
  notifyDecisionSubscribers(currentDecision);
}

export function getDecision(): DecisionInsightOutput | null {
  return currentDecision;
}

export function subscribeDecision(
  callback: (decision: DecisionInsightOutput | null) => void
): () => void {
  if (decisionSubscribers.has(callback)) return () => {};
  decisionSubscribers.add(callback);
  return () => {
    decisionSubscribers.delete(callback);
  };
}
