import { isFocusModeProfileId, type FocusModeProfileId } from "./focusModeProfiles";
import {
  hydrateExecutiveNavigationPreference,
  persistExecutiveNavigationPreference,
  type ExecutiveNavigationPreference,
} from "./executiveNavigationPersistence";
import {
  DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT,
  focusSnapshotsEqual,
  resolveExecutiveFocusSnapshot,
  traceExecutiveFocusSnapshotRead,
  type ExecutiveFocusModeSnapshot,
} from "./executiveFocusStoreSnapshotContract";

export const EXECUTIVE_FOCUS_MODE_EVENT = "nexora:executive-focus-mode-changed";

export type { ExecutiveFocusModeSnapshot };

const logKeys = new Set<string>();
const listeners = new Set<() => void>();

let snapshot: ExecutiveFocusModeSnapshot = DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT;

function devLog(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

function notify(): void {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EXECUTIVE_FOCUS_MODE_EVENT, {
        detail: { enabled: snapshot.enabled, profile: snapshot.profile },
      })
    );
  }
}

function commit(next: ExecutiveFocusModeSnapshot, navigationPatch: Partial<ExecutiveNavigationPreference>): void {
  if (Object.is(snapshot, next) || focusSnapshotsEqual(snapshot, next)) {
    return;
  }
  snapshot = next;
  const current = hydrateExecutiveNavigationPreference();
  persistExecutiveNavigationPreference({ ...current, ...navigationPatch });
  notify();
}

export function getExecutiveFocusModeSnapshot(): ExecutiveFocusModeSnapshot {
  traceExecutiveFocusSnapshotRead("client", snapshot);
  return snapshot;
}

export function getExecutiveFocusModeServerSnapshot(): ExecutiveFocusModeSnapshot {
  traceExecutiveFocusSnapshotRead("server", DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT);
  return DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT;
}

export function isExecutiveFocusModeEnabled(): boolean {
  return snapshot.enabled;
}

export function subscribeExecutiveFocusMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hydrateExecutiveFocusMode(): ExecutiveFocusModeSnapshot {
  const persisted = hydrateExecutiveNavigationPreference();
  const next = resolveExecutiveFocusSnapshot(persisted.focusModeEnabled, persisted.focusProfile);
  if (Object.is(snapshot, next) || focusSnapshotsEqual(snapshot, next)) {
    return snapshot;
  }
  snapshot = next;
  devLog("[Nexora][FocusMode]", { enabled: snapshot.enabled, profile: snapshot.profile, source: "hydrate" });
  return snapshot;
}

export function setExecutiveFocusModeEnabled(enabled: boolean, source = "runtime"): ExecutiveFocusModeSnapshot {
  if (snapshot.enabled === enabled) return snapshot;
  const next = resolveExecutiveFocusSnapshot(enabled, snapshot.profile);
  commit(next, { focusModeEnabled: enabled, focusProfile: snapshot.profile });
  devLog("[Nexora][FocusMode]", { enabled, profile: snapshot.profile, source, action: enabled ? "enter" : "exit" });
  return snapshot;
}

export function toggleExecutiveFocusMode(source = "toolbar"): ExecutiveFocusModeSnapshot {
  return setExecutiveFocusModeEnabled(!snapshot.enabled, source);
}

export function setExecutiveFocusProfile(profile: FocusModeProfileId, source = "runtime"): ExecutiveFocusModeSnapshot {
  if (!isFocusModeProfileId(profile)) return snapshot;
  if (snapshot.profile === profile) return snapshot;
  const next = resolveExecutiveFocusSnapshot(snapshot.enabled, profile);
  commit(next, { focusModeEnabled: snapshot.enabled, focusProfile: profile });
  devLog("[Nexora][FocusMode]", { enabled: snapshot.enabled, profile, source, action: "profile" });
  return snapshot;
}

export function resetExecutiveFocusModeRuntimeForTests(): void {
  snapshot = DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT;
  listeners.clear();
  logKeys.clear();
}
