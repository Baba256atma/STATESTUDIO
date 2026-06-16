/**
 * SVIE:2:2 — Risk hotspot visualization runtime (read-only, one recompute per scene update).
 */

import {
  DEFAULT_SVIE_RISK_HOTSPOT_VISUALIZATION_SNAPSHOT,
  SVIE_RISK_HOTSPOTS_LOG,
  type SvieRiskHotspotVisualizationSnapshot,
} from "./svieRiskHotspotVisualizationContract.ts";
import { buildSvieRiskHotspotVisualizationSnapshot } from "./svieRiskHotspotVisualizationResolver.ts";
import { buildSvieRiskSnapshot, initializeSvieRiskRuntime } from "./svieRiskRuntime.ts";
import type { SvieRiskRuntimeBuildInput } from "./svieRiskRuntimeContract.ts";
import { buildSvieSceneSignature } from "./svieHealthVisualizationRuntime.ts";

let lastSceneSignature: string | null = null;
let snapshot: SvieRiskHotspotVisualizationSnapshot = DEFAULT_SVIE_RISK_HOTSPOT_VISUALIZATION_SNAPSHOT;
const loggedHotspotSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRiskHotspotsOnce(next: SvieRiskHotspotVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedHotspotSignatures.has(next.sceneSignature)) return;
  loggedHotspotSignatures.add(next.sceneSignature);
  globalThis.console?.debug?.(SVIE_RISK_HOTSPOTS_LOG, {
    criticalCount: next.criticalCount,
    highlightedCount: next.highlightedCount,
  });
}

export function syncSvieRiskHotspotVisualization(
  input: SvieRiskRuntimeBuildInput = {}
): SvieRiskHotspotVisualizationSnapshot {
  initializeSvieRiskRuntime();
  const sceneSignature = buildSvieSceneSignature(input.sceneJson);
  if (sceneSignature === lastSceneSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  lastSceneSignature = sceneSignature;
  const riskSnapshot = buildSvieRiskSnapshot(input);
  snapshot = buildSvieRiskHotspotVisualizationSnapshot({
    objects: riskSnapshot.objects,
    sceneSignature,
    generatedAt: riskSnapshot.generatedAt,
  });
  logRiskHotspotsOnce(snapshot);
  return snapshot;
}

export function getSvieRiskHotspotVisualizationSnapshot(): SvieRiskHotspotVisualizationSnapshot {
  return snapshot;
}

export function resetSvieRiskHotspotVisualizationRuntimeForTests(): void {
  lastSceneSignature = null;
  snapshot = DEFAULT_SVIE_RISK_HOTSPOT_VISUALIZATION_SNAPSHOT;
  loggedHotspotSignatures.clear();
}
