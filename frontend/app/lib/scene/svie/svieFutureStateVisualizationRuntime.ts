/**
 * SVIE:4:2 — Future state visualization runtime (read-only).
 */

import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import {
  DEFAULT_SVIE_FUTURE_STATE_VISUALIZATION_SNAPSHOT,
  SVIE_FUTURE_STATE_COMPUTED_LOG,
  SVIE_FUTURE_STATE_VISUALIZATION_TAG,
  SVIE_FUTURE_STATE_VISUALIZATION_VERSION,
  type SvieFutureStateVisualizationBuildInput,
  type SvieFutureStateVisualizationSnapshot,
} from "./svieFutureStateVisualizationContract.ts";
import {
  buildSvieFutureStateSignature,
  mergeFutureStateVisuals,
  resolveFutureStateVisualization,
} from "./svieFutureStateVisualizationResolver.ts";

let lastSignature: string | null = null;
let snapshot: SvieFutureStateVisualizationSnapshot =
  DEFAULT_SVIE_FUTURE_STATE_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logFutureStateOnce(next: SvieFutureStateVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_FUTURE_STATE_COMPUTED_LOG, {
    tag: SVIE_FUTURE_STATE_VISUALIZATION_TAG,
    version: SVIE_FUTURE_STATE_VISUALIZATION_VERSION,
    futureStateCount: next.futureStates.length,
    highlightedObjectCount: Object.keys(next.nodeVisualByObjectId).length,
  });
}

export function syncFutureStateOverlay(
  input: SvieFutureStateVisualizationBuildInput = {}
): SvieFutureStateVisualizationSnapshot {
  const scenarioSnapshot = syncSvieScenarioLinks({
    scenarios: input.scenarios,
    sceneJson: input.sceneJson,
  });
  const signature = buildSvieFutureStateSignature({ links: scenarioSnapshot.links });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  const futureStates = resolveFutureStateVisualization(scenarioSnapshot.links);
  const nodeVisualByObjectId = mergeFutureStateVisuals(futureStates);

  snapshot = Object.freeze({
    futureStates,
    nodeVisualByObjectId,
    generatedAt: Date.now(),
    signature,
  });
  lastSignature = signature;
  logFutureStateOnce(snapshot);
  return snapshot;
}

export function getSvieFutureStateVisualizationSnapshot(): SvieFutureStateVisualizationSnapshot {
  return snapshot;
}

export function guardSvieFutureStateRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkRouteWrite(attempt);
}

export function guardSvieFutureStateWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkWorkspaceWrite(attempt);
}

export function resetSvieFutureStateVisualizationRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_FUTURE_STATE_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
