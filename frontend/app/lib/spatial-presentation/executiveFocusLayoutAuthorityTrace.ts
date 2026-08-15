/**
 * Development-only settled focus→layout authority snapshot.
 * One capture per focused object id — does not log every frame.
 */

import type { ExecutiveStageFocusSource } from "./executiveStageFocusPrecedence.ts";

export type ExecutiveFocusLayoutAuthoritySnapshot = {
  readonly objectId: string;
  readonly clickedObjectId?: string | null;
  readonly selectedObjectId: string | null;
  readonly focusedObjectId: string | null;
  readonly focusSource?: ExecutiveStageFocusSource | null;
  readonly automaticAttentionObjectId?: string | null;
  readonly anchorObjectId: string | null;
  readonly disclosureState: string | null;
  readonly topologyPosition: Readonly<{ readonly x: number; readonly y: number }> | null;
  readonly presentationPosition: Readonly<{ readonly x: number; readonly y: number }> | null;
  readonly targetPosition?: readonly [number, number, number] | null;
  readonly mappedWorldPosition: readonly [number, number, number] | null;
  readonly stageTargetPosition: readonly [number, number, number] | null;
  readonly overviewPosition: readonly [number, number, number] | null;
  readonly overviewMatchesTarget: boolean;
};

const lastLoggedFocusId = new Map<string, string>();

export function captureExecutiveFocusLayoutAuthoritySnapshot(
  input: ExecutiveFocusLayoutAuthoritySnapshot,
  options?: { readonly forceLog?: boolean },
): ExecutiveFocusLayoutAuthoritySnapshot {
  const snapshot = Object.freeze({ ...input });
  if (process.env.NODE_ENV === "production") return snapshot;
  const key = "stage-focus-layout";
  const prior = lastLoggedFocusId.get(key);
  if (!options?.forceLog && prior === snapshot.focusedObjectId) {
    return snapshot;
  }
  lastLoggedFocusId.set(key, snapshot.focusedObjectId ?? "null");
  // One settled line — not a spam channel.
  // eslint-disable-next-line no-console
  console.info(
    "[NEXORA_FOCUS_LAYOUT_AUTHORITY]",
    JSON.stringify(snapshot),
  );
  return snapshot;
}
