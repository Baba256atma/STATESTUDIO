/**
 * Nexora Type-C Object Selection Runtime Contract.
 * Canonical owner: HomeScreen.selectedObjectIdState
 */

import { CANONICAL_OBJECT_SELECTION_OWNER } from "../architecture/nexoraArchitectureFreezeConstants.ts";

export { CANONICAL_OBJECT_SELECTION_OWNER };

export type ObjectSelectionPhase =
  | "hit_detection"
  | "object_resolution"
  | "selection_commit"
  | "scene_highlight"
  | "panel_context"
  | "dashboard_context"
  | "deselect";

export type ObjectSelectionDiagnosticPayload = {
  objectId?: string | null;
  priorObjectId?: string | null;
  source?: string | null;
  phase?: ObjectSelectionPhase;
  eventId?: string | null;
  reason?: string | null;
  hitProxyScale?: number | null;
  intersectionCount?: number | null;
  sceneObjectCount?: number | null;
  owner?: string | null;
  competingOwner?: string | null;
};

const diagnosticLogKeys = new Set<string>();

function shouldEmit(label: string, key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${label}:${key}`;
  if (diagnosticLogKeys.has(dedupeKey)) return false;
  diagnosticLogKeys.add(dedupeKey);
  return true;
}

export function reportObjectSelection(payload: ObjectSelectionDiagnosticPayload): void {
  const key = `${payload.phase ?? "unknown"}:${payload.objectId ?? "none"}:${payload.source ?? "unknown"}`;
  if (!shouldEmit("[Nexora][ObjectSelection]", key)) return;
  globalThis.console?.info?.("[Nexora][ObjectSelection]", {
    owner: CANONICAL_OBJECT_SELECTION_OWNER,
    ...payload,
  });
}

export function reportSelectionResolved(payload: ObjectSelectionDiagnosticPayload): void {
  const key = `${payload.objectId ?? "none"}:${payload.source ?? "unknown"}:${payload.phase ?? "selection_commit"}`;
  if (!shouldEmit("[Nexora][SelectionResolved]", key)) return;
  globalThis.console?.info?.("[Nexora][SelectionResolved]", {
    owner: CANONICAL_OBJECT_SELECTION_OWNER,
    ...payload,
  });
}

export function reportSelectionMiss(payload: ObjectSelectionDiagnosticPayload): void {
  const key = `${payload.reason ?? "unknown"}:${payload.source ?? "unknown"}`;
  if (!shouldEmit("[Nexora][SelectionMiss]", key)) return;
  globalThis.console?.warn?.("[Nexora][SelectionMiss]", {
    owner: CANONICAL_OBJECT_SELECTION_OWNER,
    ...payload,
  });
}

export function reportDuplicateSelectionOwner(payload: ObjectSelectionDiagnosticPayload): void {
  const key = `${payload.competingOwner ?? "unknown"}:${payload.source ?? "unknown"}:${payload.objectId ?? "none"}`;
  if (!shouldEmit("[Nexora][DuplicateSelectionOwner]", key)) return;
  globalThis.console?.warn?.("[Nexora][DuplicateSelectionOwner]", {
    canonicalOwner: CANONICAL_OBJECT_SELECTION_OWNER,
    action: "preserve_canonical_owner",
    ...payload,
  });
  void import("../architecture/nexoraArchitectureFreezeRuntime.ts").then(({ reportArchitectureViolation }) => {
    reportArchitectureViolation({
      contractId: "selection.single_owner",
      reason: "duplicate_selection_owner",
      source: payload.source ?? payload.competingOwner ?? "reportDuplicateSelectionOwner",
      detail: {
        competingOwner: payload.competingOwner ?? null,
        objectId: payload.objectId ?? null,
      },
    });
  });
}

export function resetObjectSelectionRuntimeContractLogsForTests(): void {
  diagnosticLogKeys.clear();
}
