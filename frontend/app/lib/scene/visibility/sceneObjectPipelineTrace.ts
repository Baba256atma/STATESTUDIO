/**
 * E2:110 — One-shot dev trace for the scene object render pipeline.
 * Signature-gated only; no timers or repeated logging.
 */

import { shouldSuppressIdleDebugLog } from "../../runtime/idleRuntimeStabilityGuard";

export type SceneObjectPipelineTraceSnapshot = {
  sceneJsonObjectIds: readonly string[];
  visibleSceneObjectIds: readonly string[];
  renderedObjectIds: readonly string[];
  activeFilters: readonly string[];
  focusMode: "all" | "selected" | "pinned";
  selectedObjectId: string | null;
  scenarioId: string | null;
  executiveFocusModeEnabled: boolean;
  restrictToFocus: boolean;
  dimUnrelatedObjects: boolean;
};

const loggedSignatures = new Set<string>();

function sortedIds(ids: readonly string[]): string[] {
  return [...ids].sort((a, b) => a.localeCompare(b));
}

export function buildSceneObjectPipelineTraceSignature(
  snapshot: SceneObjectPipelineTraceSnapshot
): string {
  return JSON.stringify({
    scene: sortedIds(snapshot.sceneJsonObjectIds),
    visible: sortedIds(snapshot.visibleSceneObjectIds),
    rendered: sortedIds(snapshot.renderedObjectIds),
    filters: [...snapshot.activeFilters].sort(),
    focusMode: snapshot.focusMode,
    selectedObjectId: snapshot.selectedObjectId,
    scenarioId: snapshot.scenarioId,
    executiveFocus: snapshot.executiveFocusModeEnabled,
    restrict: snapshot.restrictToFocus,
    dim: snapshot.dimUnrelatedObjects,
  });
}

export function detectSceneObjectPipelineFilters(input: {
  sceneJsonCount: number;
  visibleCount: number;
  renderedCount: number;
  staleSceneJsonCache: boolean;
  restrictToFocus: boolean;
  dimUnrelatedObjects: boolean;
  focusMode: "all" | "selected" | "pinned";
  selectedObjectId: string | null;
  scenarioId: string | null;
  objectSelectionHighlightCount: number;
}): string[] {
  const filters: string[] = [];
  if (input.staleSceneJsonCache) filters.push("stale_scene_json_cache");
  if (input.restrictToFocus) filters.push("focus_isolation");
  if (input.dimUnrelatedObjects) filters.push("dim_unrelated_objects");
  if (input.focusMode === "selected" || input.focusMode === "pinned") {
    filters.push(`focus_mode_${input.focusMode}`);
  }
  if (input.selectedObjectId) filters.push("selected_object_id");
  if (input.scenarioId) filters.push(`scenario:${input.scenarioId}`);
  if (input.objectSelectionHighlightCount > 0 && input.objectSelectionHighlightCount < input.sceneJsonCount) {
    filters.push("object_selection_highlight_subset");
  }
  if (input.renderedCount < input.sceneJsonCount) filters.push("render_count_drop");
  if (input.visibleCount < input.sceneJsonCount) filters.push("visible_count_drop");
  if (input.renderedCount === 1 && input.sceneJsonCount > 1) filters.push("single_object_bottleneck");
  return filters;
}

/** Call during render when signature changes; logs at most once per stable signature. */
export function traceSceneObjectPipeline(snapshot: SceneObjectPipelineTraceSnapshot): void {
  if (process.env.NODE_ENV === "production") return;

  const signature = buildSceneObjectPipelineTraceSignature(snapshot);
  if (loggedSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`scene-object-pipeline-trace:${signature}`)) return;
  loggedSignatures.add(signature);

  console.info("[Nexora][SceneObjectPipelineTrace]", {
    sceneJsonObjects: snapshot.sceneJsonObjectIds.length,
    visibleSceneObjects: snapshot.visibleSceneObjectIds.length,
    renderedObjects: snapshot.renderedObjectIds.length,
    sceneJsonObjectIds: sortedIds(snapshot.sceneJsonObjectIds),
    visibleSceneObjectIds: sortedIds(snapshot.visibleSceneObjectIds),
    renderedObjectIds: sortedIds(snapshot.renderedObjectIds),
    activeFilters: [...snapshot.activeFilters],
    focusMode: snapshot.focusMode,
    selectedObjectId: snapshot.selectedObjectId,
    scenarioId: snapshot.scenarioId,
    executiveFocusModeEnabled: snapshot.executiveFocusModeEnabled,
    restrictToFocus: snapshot.restrictToFocus,
    dimUnrelatedObjects: snapshot.dimUnrelatedObjects,
  });
}

export function resetSceneObjectPipelineTraceLogsForTests(): void {
  loggedSignatures.clear();
}
