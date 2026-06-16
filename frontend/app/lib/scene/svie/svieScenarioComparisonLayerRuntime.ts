/**
 * SVIE:4:5 — Multi-scenario comparison layer runtime (read-only).
 */

import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import {
  DEFAULT_SVIE_SCENARIO_COMPARISON_VISUALIZATION_SNAPSHOT,
  SVIE_MULTI_SCENARIO_COMPARISON_TAG,
  SVIE_MULTI_SCENARIO_COMPARISON_VERSION,
  SVIE_SCENARIO_COMPARISON_COMPUTED_LOG,
  type SvieScenarioComparisonLayerBuildInput,
  type SvieScenarioComparisonVisualizationSnapshot,
} from "./svieScenarioComparisonLayerContract.ts";
import {
  buildScenarioComparisonModel,
  buildSvieScenarioComparisonSignature,
  resolveScenarioComparisonVisualization,
} from "./svieScenarioComparisonLayerResolver.ts";

let lastSignature: string | null = null;
let snapshot: SvieScenarioComparisonVisualizationSnapshot =
  DEFAULT_SVIE_SCENARIO_COMPARISON_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logScenarioComparisonOnce(next: SvieScenarioComparisonVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_SCENARIO_COMPARISON_COMPUTED_LOG, {
    tag: SVIE_MULTI_SCENARIO_COMPARISON_TAG,
    version: SVIE_MULTI_SCENARIO_COMPARISON_VERSION,
    scenarioCount: next.model.entries.length,
    highlightedObjectCount: Object.keys(next.nodeVisualByObjectId).length,
  });
}

export function syncScenarioComparisonLayer(
  input: SvieScenarioComparisonLayerBuildInput = {}
): SvieScenarioComparisonVisualizationSnapshot {
  const scenarioSnapshot = syncSvieScenarioLinks({
    scenarios: input.scenarios,
    sceneJson: input.sceneJson,
  });
  const model = buildScenarioComparisonModel({
    links: scenarioSnapshot.links,
    primaryScenarioId: input.primaryScenarioId,
    secondaryScenarioId: input.secondaryScenarioId,
    alternativeScenarioId: input.alternativeScenarioId,
  });
  const signature = buildSvieScenarioComparisonSignature({ model });

  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  snapshot = Object.freeze({
    model,
    nodeVisualByObjectId: resolveScenarioComparisonVisualization(model),
    generatedAt: Date.now(),
    signature,
  });
  lastSignature = signature;
  logScenarioComparisonOnce(snapshot);
  return snapshot;
}

export function getSvieScenarioComparisonLayerSnapshot(): SvieScenarioComparisonVisualizationSnapshot {
  return snapshot;
}

export function guardSvieScenarioComparisonRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkRouteWrite(attempt);
}

export function guardSvieScenarioComparisonWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkWorkspaceWrite(attempt);
}

export function resetSvieScenarioComparisonLayerRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_SCENARIO_COMPARISON_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
