/** E2 — Snapshot identity contract for executive external stores (focus, view mode, toolbar). */

import { DEFAULT_FOCUS_MODE_PROFILE, type FocusModeProfileId } from "./focusModeProfiles";

export type ExecutiveFocusModeSnapshot = {
  enabled: boolean;
  profile: FocusModeProfileId;
};

/** Immutable default used for SSR and initial client state — always same reference. */
export const DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT = Object.freeze({
  enabled: false,
  profile: DEFAULT_FOCUS_MODE_PROFILE,
}) as ExecutiveFocusModeSnapshot;

const identityLogKeys = new Set<string>();
let lastClientSnapshotRef: ExecutiveFocusModeSnapshot | null = null;
let lastServerSnapshotRef: ExecutiveFocusModeSnapshot | null = null;

export function focusSnapshotsEqual(
  a: ExecutiveFocusModeSnapshot,
  b: ExecutiveFocusModeSnapshot
): boolean {
  return a.enabled === b.enabled && a.profile === b.profile;
}

/** Resolve a frozen snapshot, reusing the default reference when values match. */
export function resolveExecutiveFocusSnapshot(
  enabled: boolean,
  profile: FocusModeProfileId
): ExecutiveFocusModeSnapshot {
  if (!enabled && profile === DEFAULT_FOCUS_MODE_PROFILE) {
    return DEFAULT_EXECUTIVE_FOCUS_SNAPSHOT;
  }
  return Object.freeze({ enabled, profile });
}

function logSnapshotIdentityOnce(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (identityLogKeys.has(key)) return;
  identityLogKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

/** Dev-only: detect unexpected snapshot reference churn on consecutive reads. */
export function traceExecutiveFocusSnapshotRead(
  source: "client" | "server",
  snapshot: ExecutiveFocusModeSnapshot
): void {
  if (process.env.NODE_ENV === "production") return;

  if (source === "server") {
    if (lastServerSnapshotRef !== null && !Object.is(lastServerSnapshotRef, snapshot)) {
      logSnapshotIdentityOnce("[Nexora][ServerSnapshot]", {
        previousRef: lastServerSnapshotRef,
        nextRef: snapshot,
        reason: "server_snapshot_reference_changed",
      });
    }
    lastServerSnapshotRef = snapshot;
    return;
  }

  if (lastClientSnapshotRef !== null && !Object.is(lastClientSnapshotRef, snapshot)) {
    if (focusSnapshotsEqual(lastClientSnapshotRef, snapshot)) {
      logSnapshotIdentityOnce("[Nexora][SnapshotIdentity]", {
        previousRef: lastClientSnapshotRef,
        nextRef: snapshot,
        reason: "equal_values_different_reference",
      });
    }
  } else if (lastClientSnapshotRef !== null && Object.is(lastClientSnapshotRef, snapshot)) {
    logSnapshotIdentityOnce("[Nexora][FocusStoreStable]", {
      enabled: snapshot.enabled,
      profile: snapshot.profile,
    });
  }

  lastClientSnapshotRef = snapshot;
  logSnapshotIdentityOnce("[Nexora][FocusStoreSnapshot]", {
    source,
    enabled: snapshot.enabled,
    profile: snapshot.profile,
  });
}

export function resetExecutiveFocusSnapshotIdentityLogsForTests(): void {
  identityLogKeys.clear();
  lastClientSnapshotRef = null;
  lastServerSnapshotRef = null;
}
