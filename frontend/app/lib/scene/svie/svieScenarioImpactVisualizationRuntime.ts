/**
 * SVIE:4:4 — Scenario impact visualization runtime (read-only).
 */

import {
  guardSvieScenarioLinkRouteWrite,
  guardSvieScenarioLinkWorkspaceWrite,
  syncSvieScenarioLinks,
} from "./svieScenarioLinkRuntime.ts";
import { readScenariosFromSceneJson } from "./svieScenarioLinkResolver.ts";
import {
  buildScenarioImpactChains,
  buildSvieScenarioImpactChainSignature,
} from "./svieScenarioImpactChainBuilder.ts";
import {
  DEFAULT_SVIE_SCENARIO_IMPACT_VISUALIZATION_SNAPSHOT,
  SVIE_SCENARIO_IMPACT_CHAIN_COMPUTED_LOG,
  SVIE_SCENARIO_IMPACT_CHAIN_TAG,
  SVIE_SCENARIO_IMPACT_CHAIN_VERSION,
  type SvieScenarioImpactVisualizationBuildInput,
  type SvieScenarioImpactVisualizationSnapshot,
} from "./svieScenarioImpactChainContract.ts";
import {
  mergeScenarioImpactPropagations,
  resolveScenarioImpactPropagation,
} from "./svieScenarioImpactPropagationResolver.ts";

let lastSignature: string | null = null;
let snapshot: SvieScenarioImpactVisualizationSnapshot =
  DEFAULT_SVIE_SCENARIO_IMPACT_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logScenarioImpactOnce(next: SvieScenarioImpactVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_SCENARIO_IMPACT_CHAIN_COMPUTED_LOG, {
    tag: SVIE_SCENARIO_IMPACT_CHAIN_TAG,
    version: SVIE_SCENARIO_IMPACT_CHAIN_VERSION,
    chainCount: next.chains.length,
    connectionCount: next.connectionVisuals.length,
  });
}

export function syncScenarioImpactVisualization(
  input: SvieScenarioImpactVisualizationBuildInput = {}
): SvieScenarioImpactVisualizationSnapshot {
  const scenarios = input.scenarios ?? readScenariosFromSceneJson(input.sceneJson);
  const scenarioSnapshot = syncSvieScenarioLinks({
    scenarios,
    sceneJson: input.sceneJson,
  });
  const signature = buildSvieScenarioImpactChainSignature({
    links: scenarioSnapshot.links,
    scenarios,
    sceneJson: input.sceneJson,
  });

  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  const chains = buildScenarioImpactChains({
    links: scenarioSnapshot.links,
    scenarios,
    sceneJson: input.sceneJson,
  });
  const visualChains = Object.freeze(chains.map((chain) => resolveScenarioImpactPropagation(chain)));
  const merged = mergeScenarioImpactPropagations(visualChains);

  snapshot = Object.freeze({
    chains,
    visualChains,
    nodeVisualByObjectId: merged.nodeVisualByObjectId,
    connectionVisuals: merged.connectionVisuals,
    generatedAt: Date.now(),
    signature,
  });
  lastSignature = signature;
  logScenarioImpactOnce(snapshot);
  return snapshot;
}

export function getSvieScenarioImpactVisualizationSnapshot(): SvieScenarioImpactVisualizationSnapshot {
  return snapshot;
}

export function guardSvieScenarioImpactRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkRouteWrite(attempt);
}

export function guardSvieScenarioImpactWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieScenarioLinkWorkspaceWrite(attempt);
}

export function resetSvieScenarioImpactVisualizationRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_SCENARIO_IMPACT_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
