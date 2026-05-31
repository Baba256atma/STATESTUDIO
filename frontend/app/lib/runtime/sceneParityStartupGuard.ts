/**
 * E2:79 / E2:81 — Scene parity startup deduplication + HomeScreen idempotency.
 */

import { recordParitySkipped } from "../debug/startupNoiseAudit";
import { isStartupPhase } from "./startupPhase";
import { devLogOnSignatureChange } from "./diagnosticIdleGate";

export type SceneParityStableSnapshot = {
  sceneCount: number;
  visibleSceneCount: number;
  selectedObjectId: string | null;
  relationshipCount: number;
  scenarioId: string | null;
};

export type SceneParityHomeScreenEmitInput = {
  businessSignature: string;
  sceneJsonIds: string[];
  visibleSceneJsonIds: string[];
};

const loggedStableParitySignatures = new Set<string>();
const skippedStableSignatures = new Set<string>();
const emittedHomeScreenParitySignatures = new Set<string>();

let sceneParityStabilized = false;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function buildSceneParityStableSignature(snapshot: SceneParityStableSnapshot): string {
  return JSON.stringify({
    sceneCount: snapshot.sceneCount,
    visibleSceneCount: snapshot.visibleSceneCount,
    selectedObjectId: snapshot.selectedObjectId ?? null,
    relationshipCount: snapshot.relationshipCount,
    scenarioId: snapshot.scenarioId ?? null,
  });
}

export function hasSceneParityIdMismatch(sceneJsonIds: string[], visibleSceneJsonIds: string[]): boolean {
  if (sceneJsonIds.length !== visibleSceneJsonIds.length) return true;
  const sortedSceneIds = [...sceneJsonIds].sort();
  const sortedVisibleIds = [...visibleSceneJsonIds].sort();
  return sortedSceneIds.some((id, index) => id !== sortedVisibleIds[index]);
}

export function isVisibleSceneBootstrapCatchUp(
  sceneJsonIds: string[],
  visibleSceneJsonIds: string[]
): boolean {
  if (sceneJsonIds.length === 0) return false;
  if (visibleSceneJsonIds.length === 0) return true;
  if (visibleSceneJsonIds.length >= sceneJsonIds.length) return false;
  const sceneIdSet = new Set(sceneJsonIds);
  return visibleSceneJsonIds.every((id) => sceneIdSet.has(id));
}

export function markSceneParityStabilized(): void {
  sceneParityStabilized = true;
}

export function isSceneParityStabilized(): boolean {
  return sceneParityStabilized;
}

export function shouldEmitStableSceneParity(signature: string): boolean {
  if (loggedStableParitySignatures.has(signature)) {
    recordParitySkipped();
    traceSceneParitySkippedStable(signature);
    return false;
  }
  loggedStableParitySignatures.add(signature);
  return true;
}

export function shouldEmitSceneParityHomeScreenLog(input: SceneParityHomeScreenEmitInput): boolean {
  if (emittedHomeScreenParitySignatures.has(input.businessSignature)) {
    recordParitySkipped();
    return false;
  }
  if (isVisibleSceneBootstrapCatchUp(input.sceneJsonIds, input.visibleSceneJsonIds)) {
    recordParitySkipped();
    return false;
  }
  if (!hasSceneParityIdMismatch(input.sceneJsonIds, input.visibleSceneJsonIds)) {
    recordParitySkipped();
    return false;
  }
  if (isStartupPhase() && !isSceneParityStabilized()) {
    recordParitySkipped();
    return false;
  }
  emittedHomeScreenParitySignatures.add(input.businessSignature);
  return true;
}

/** @deprecated use shouldEmitStableSceneParity */
export function shouldSkipStableSceneParity(signature: string): boolean {
  return !shouldEmitStableSceneParity(signature);
}

export function traceSceneParitySkippedStable(signature: string): void {
  if (!isDev()) return;
  if (skippedStableSignatures.has(signature)) return;
  skippedStableSignatures.add(signature);
  devLogOnSignatureChange("[Nexora][SceneParitySkippedStable]", signature, { signature });
}

export function resetSceneParityStartupGuardForTests(): void {
  loggedStableParitySignatures.clear();
  skippedStableSignatures.clear();
  emittedHomeScreenParitySignatures.clear();
  sceneParityStabilized = false;
}
