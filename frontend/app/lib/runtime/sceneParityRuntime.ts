/**
 * E2:63 — Stable scene parity signatures for deduped diagnostics.
 */

export type SceneParitySnapshot = {
  sceneJsonCount: number;
  visibleSceneJsonCount: number;
  sceneJsonIds: string[];
  visibleSceneJsonIds: string[];
  rightPanelView: string | null;
  rightPanelContextId: string | null;
};

export function buildSceneParitySignature(snapshot: SceneParitySnapshot): string {
  return JSON.stringify(snapshot);
}

export type BusinessSceneParitySnapshot = {
  sceneJsonIds: string[];
  visibleSceneJsonIds: string[];
  selectedObjectId?: string | null;
  relationshipIds?: string[];
  scenarioId?: string | null;
  mode?: string | null;
};

/** Business-only parity signature — ignores panel layout/HUD/diagnostic churn. */
export function buildBusinessSceneParitySignature(snapshot: BusinessSceneParitySnapshot): string {
  return JSON.stringify({
    sceneJsonIds: [...snapshot.sceneJsonIds].sort(),
    visibleSceneJsonIds: [...snapshot.visibleSceneJsonIds].sort(),
    selectedObjectId: snapshot.selectedObjectId ?? null,
    relationshipIds: [...(snapshot.relationshipIds ?? [])].sort(),
    scenarioId: snapshot.scenarioId ?? null,
    mode: snapshot.mode ?? null,
  });
}

export function buildSceneVisibleSignature(input: {
  count: number;
  ids: string[];
}): string {
  return JSON.stringify({ count: input.count, ids: [...input.ids].sort() });
}

export type SceneResetCandidateTrace = {
  source: string;
  prevCount: number;
  nextCount: number;
  reason: string;
  objectIdsChanged?: boolean;
};

export function shouldEmitSceneResetCandidate(
  trace: SceneResetCandidateTrace,
  previousSignature: string | null
): boolean {
  if (trace.reason === "stable_signature_reuse") return false;
  if (trace.source === "workspace" && trace.prevCount === trace.nextCount && trace.objectIdsChanged === false) {
    return false;
  }
  const signature = JSON.stringify(trace);
  return previousSignature !== signature;
}

export function buildSceneActivityDriftSignature(input: {
  objectCount: number;
  selectedObjectId?: string | null;
  selectedRelationshipId?: string | null;
  selectedPropagationPathId?: string | null;
}): string {
  return JSON.stringify({
    objectCount: input.objectCount,
    selectedObjectId: input.selectedObjectId ?? null,
    selectedRelationshipId: input.selectedRelationshipId ?? null,
    selectedPropagationPathId: input.selectedPropagationPathId ?? null,
  });
}
