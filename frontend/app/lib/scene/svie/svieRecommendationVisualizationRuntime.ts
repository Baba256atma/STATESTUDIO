/**
 * SVIE:3:3 — Recommendation visualization runtime (read-only).
 */

import { syncSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkRuntime.ts";
import type { SvieAdvisoryFindingInput } from "./svieAdvisoryLinkFoundationContract.ts";
import {
  buildSvieRecommendationVisualizationSignature,
  deriveRecommendationHierarchies,
} from "./svieRecommendationHierarchyDerivation.ts";
import {
  DEFAULT_SVIE_RECOMMENDATION_VISUALIZATION_SNAPSHOT,
  SVIE_RECOMMENDATION_COMPUTED_LOG,
  SVIE_RECOMMENDATION_VISUALIZATION_TAG,
  SVIE_RECOMMENDATION_VISUALIZATION_VERSION,
  type SvieRecommendationVisualizationBuildInput,
  type SvieRecommendationVisualizationSnapshot,
} from "./svieRecommendationVisualizationContract.ts";
import {
  mergeRecommendationVisuals,
  resolveRecommendationVisualization,
} from "./svieRecommendationVisualizationResolver.ts";
import {
  guardSvieAdvisoryLinkRouteWrite,
  guardSvieAdvisoryLinkWorkspaceWrite,
  initializeSvieAdvisoryLinkRuntime,
} from "./svieAdvisoryLinkRuntime.ts";
import { readAdvisoryFindingsFromSceneJson } from "./svieCauseChainVisualizationRuntime.ts";

let lastSignature: string | null = null;
let snapshot: SvieRecommendationVisualizationSnapshot = DEFAULT_SVIE_RECOMMENDATION_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRecommendationOnce(next: SvieRecommendationVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_RECOMMENDATION_COMPUTED_LOG, {
    tag: SVIE_RECOMMENDATION_VISUALIZATION_TAG,
    version: SVIE_RECOMMENDATION_VISUALIZATION_VERSION,
    recommendationCount: next.hierarchies.length,
    highlightedObjectCount: Object.keys(next.nodeVisualByObjectId).length,
  });
}

export function applyRecommendationVisualization(
  input: SvieRecommendationVisualizationBuildInput = {}
): SvieRecommendationVisualizationSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const hierarchies = deriveRecommendationHierarchies({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });
  const visualRecommendations = Object.freeze(
    hierarchies.map((hierarchy) => resolveRecommendationVisualization(hierarchy))
  );
  const nodeVisualByObjectId = mergeRecommendationVisuals(visualRecommendations);
  const generatedAt = Date.now();
  const signature = buildSvieRecommendationVisualizationSignature({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });

  snapshot = Object.freeze({
    hierarchies,
    visualRecommendations,
    nodeVisualByObjectId,
    generatedAt,
    signature,
  });
  lastSignature = signature;
  logRecommendationOnce(snapshot);
  return snapshot;
}

export function syncSvieRecommendationVisualization(
  input: SvieRecommendationVisualizationBuildInput = {}
): SvieRecommendationVisualizationSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const signature = buildSvieRecommendationVisualizationSignature({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return applyRecommendationVisualization(input);
}

export function getSvieRecommendationVisualizationSnapshot(): SvieRecommendationVisualizationSnapshot {
  return snapshot;
}

export function guardSvieRecommendationRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkRouteWrite(attempt);
}

export function guardSvieRecommendationWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkWorkspaceWrite(attempt);
}

export function resetSvieRecommendationVisualizationRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_RECOMMENDATION_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
