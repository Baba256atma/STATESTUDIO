/**
 * SVIE:4:3 — Scenario delta visualization runtime (read-only).
 */

import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import {
  DEFAULT_SVIE_SCENARIO_DELTA_VISUALIZATION_SNAPSHOT,
  SVIE_SCENARIO_DELTA_COMPUTED_LOG,
  SVIE_SCENARIO_DELTA_VISUALIZATION_TAG,
  SVIE_SCENARIO_DELTA_VISUALIZATION_VERSION,
  type SvieScenarioDeltaVisualizationBuildInput,
  type SvieScenarioDeltaVisualizationSnapshot,
} from "./svieScenarioDeltaVisualizationContract.ts";
import {
  buildSvieScenarioDeltaSignature,
  mergeScenarioDeltaVisuals,
  resolveScenarioDeltaVisualization,
} from "./svieScenarioDeltaVisualizationResolver.ts";

let lastSignature: string | null = null;
let snapshot: SvieScenarioDeltaVisualizationSnapshot =
  DEFAULT_SVIE_SCENARIO_DELTA_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logScenarioDeltaOnce(next: SvieScenarioDeltaVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_SCENARIO_DELTA_COMPUTED_LOG, {
    tag: SVIE_SCENARIO_DELTA_VISUALIZATION_TAG,
    version: SVIE_SCENARIO_DELTA_VISUALIZATION_VERSION,
    deltaCount: next.deltas.length,
    highlightedObjectCount: Object.keys(next.nodeVisualByObjectId).length,
  });
}

export function syncScenarioDeltaOverlay(
  input: SvieScenarioDeltaVisualizationBuildInput = {}
): SvieScenarioDeltaVisualizationSnapshot {
  const scenarioSnapshot = syncSvieScenarioLinks({
    scenarios: input.scenarios,
    sceneJson: input.sceneJson,
  });
  const signature = buildSvieScenarioDeltaSignature({ links: scenarioSnapshot.links });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  const deltas = resolveScenarioDeltaVisualization(scenarioSnapshot.links);
  const nodeVisualByObjectId = mergeScenarioDeltaVisuals(deltas);

  snapshot = Object.freeze({
    deltas,
    nodeVisualByObjectId,
    generatedAt: Date.now(),
    signature,
  });
  lastSignature = signature;
  logScenarioDeltaOnce(snapshot);
  return snapshot;
}

export function getSvieScenarioDeltaVisualizationSnapshot(): SvieScenarioDeltaVisualizationSnapshot {
  return snapshot;
}

export function guardSvieScenarioDeltaRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkRouteWrite(attempt);
}

export function guardSvieScenarioDeltaWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkWorkspaceWrite(attempt);
}

export function resetSvieScenarioDeltaVisualizationRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_SCENARIO_DELTA_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
