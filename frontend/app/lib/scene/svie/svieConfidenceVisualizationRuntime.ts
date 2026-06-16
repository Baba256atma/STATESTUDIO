/**
 * SVIE:3:4 — Confidence visualization runtime (read-only).
 */

import { syncSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkRuntime.ts";
import type { SvieAdvisoryFindingInput } from "./svieAdvisoryLinkFoundationContract.ts";
import {
  buildSvieConfidenceVisualizationSignature,
  mapRecommendationConfidences,
} from "./svieConfidenceMapping.ts";
import {
  DEFAULT_SVIE_CONFIDENCE_VISUALIZATION_SNAPSHOT,
  SVIE_CONFIDENCE_COMPUTED_LOG,
  SVIE_CONFIDENCE_VISUALIZATION_TAG,
  SVIE_CONFIDENCE_VISUALIZATION_VERSION,
  type SvieConfidenceVisualizationBuildInput,
  type SvieConfidenceVisualizationSnapshot,
} from "./svieConfidenceVisualizationContract.ts";
import {
  mergeConfidenceVisuals,
  resolveConfidenceVisualization,
} from "./svieConfidenceVisualizationResolver.ts";
import {
  guardSvieAdvisoryLinkRouteWrite,
  guardSvieAdvisoryLinkWorkspaceWrite,
  initializeSvieAdvisoryLinkRuntime,
} from "./svieAdvisoryLinkRuntime.ts";
import { readAdvisoryFindingsFromSceneJson } from "./svieCauseChainVisualizationRuntime.ts";

let lastSignature: string | null = null;
let snapshot: SvieConfidenceVisualizationSnapshot = DEFAULT_SVIE_CONFIDENCE_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logConfidenceOnce(next: SvieConfidenceVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_CONFIDENCE_COMPUTED_LOG, {
    tag: SVIE_CONFIDENCE_VISUALIZATION_TAG,
    version: SVIE_CONFIDENCE_VISUALIZATION_VERSION,
    recommendationCount: next.mappedRecommendations.length,
    highlightedObjectCount: Object.keys(next.nodeVisualByObjectId).length,
  });
}

export function applyConfidenceVisualization(
  input: SvieConfidenceVisualizationBuildInput = {}
): SvieConfidenceVisualizationSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const mappedRecommendations = mapRecommendationConfidences({
    links: linkSnapshot.links,
    findings,
  });
  const linkById = linkSnapshot.linkByRecommendationId;
  const visualMaps = mappedRecommendations.map((mapped) => {
    const link = linkById[mapped.recommendationId];
    return link ? resolveConfidenceVisualization({ mapped, link }) : Object.freeze({});
  });
  const nodeVisualByObjectId = mergeConfidenceVisuals(visualMaps);
  const generatedAt = Date.now();
  const signature = buildSvieConfidenceVisualizationSignature({
    links: linkSnapshot.links,
    findings,
  });

  snapshot = Object.freeze({
    mappedRecommendations,
    nodeVisualByObjectId,
    generatedAt,
    signature,
  });
  lastSignature = signature;
  logConfidenceOnce(snapshot);
  return snapshot;
}

export function syncSvieConfidenceVisualization(
  input: SvieConfidenceVisualizationBuildInput = {}
): SvieConfidenceVisualizationSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const signature = buildSvieConfidenceVisualizationSignature({
    links: linkSnapshot.links,
    findings,
  });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return applyConfidenceVisualization(input);
}

export function getSvieConfidenceVisualizationSnapshot(): SvieConfidenceVisualizationSnapshot {
  return snapshot;
}

export function guardSvieConfidenceRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkRouteWrite(attempt);
}

export function guardSvieConfidenceWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkWorkspaceWrite(attempt);
}

export function resetSvieConfidenceVisualizationRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_CONFIDENCE_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
