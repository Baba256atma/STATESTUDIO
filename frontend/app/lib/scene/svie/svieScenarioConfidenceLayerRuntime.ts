/**
 * SVIE:4:6 — Scenario confidence layer runtime (read-only).
 */

import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import {
  DEFAULT_SVIE_SCENARIO_CONFIDENCE_VISUALIZATION_SNAPSHOT,
  SVIE_SCENARIO_CONFIDENCE_COMPUTED_LOG,
  SVIE_SCENARIO_CONFIDENCE_LAYER_TAG,
  SVIE_SCENARIO_CONFIDENCE_LAYER_VERSION,
  type SvieScenarioConfidenceLayerBuildInput,
  type SvieScenarioConfidenceVisualizationSnapshot,
} from "./svieScenarioConfidenceLayerContract.ts";
import {
  buildSvieScenarioConfidenceSignature,
  mapScenarioConfidences,
  resolveScenarioConfidenceVisualization,
} from "./svieScenarioConfidenceLayerResolver.ts";

let lastSignature: string | null = null;
let snapshot: SvieScenarioConfidenceVisualizationSnapshot =
  DEFAULT_SVIE_SCENARIO_CONFIDENCE_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logScenarioConfidenceOnce(next: SvieScenarioConfidenceVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_SCENARIO_CONFIDENCE_COMPUTED_LOG, {
    tag: SVIE_SCENARIO_CONFIDENCE_LAYER_TAG,
    version: SVIE_SCENARIO_CONFIDENCE_LAYER_VERSION,
    scenarioCount: next.entries.length,
    highlightedObjectCount: Object.keys(next.nodeVisualByObjectId).length,
  });
}

export function syncScenarioConfidenceLayer(
  input: SvieScenarioConfidenceLayerBuildInput = {}
): SvieScenarioConfidenceVisualizationSnapshot {
  const scenarioSnapshot = syncSvieScenarioLinks({
    scenarios: input.scenarios,
    sceneJson: input.sceneJson,
  });
  const entries = mapScenarioConfidences(scenarioSnapshot.links);
  const signature = buildSvieScenarioConfidenceSignature({ entries });

  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  snapshot = Object.freeze({
    entries,
    nodeVisualByObjectId: resolveScenarioConfidenceVisualization(entries),
    generatedAt: Date.now(),
    signature,
  });
  lastSignature = signature;
  logScenarioConfidenceOnce(snapshot);
  return snapshot;
}

export function getSvieScenarioConfidenceLayerSnapshot(): SvieScenarioConfidenceVisualizationSnapshot {
  return snapshot;
}

export function guardSvieScenarioConfidenceRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkRouteWrite(attempt);
}

export function guardSvieScenarioConfidenceWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkWorkspaceWrite(attempt);
}

export function resetSvieScenarioConfidenceLayerRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_SCENARIO_CONFIDENCE_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
