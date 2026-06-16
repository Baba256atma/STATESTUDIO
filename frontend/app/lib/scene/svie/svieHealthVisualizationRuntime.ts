/**
 * SVIE:1:2 — Health visualization runtime (read-only, one recompute per scene update).
 */

import {
  DEFAULT_SVIE_HEALTH_VISUALIZATION_SNAPSHOT,
  SVIE_HEALTH_COMPUTED_LOG,
  type SvieHealthVisualizationSnapshot,
} from "./svieHealthVisualizationContract.ts";
import { buildSvieHealthVisualizationSnapshot } from "./svieHealthVisualizationResolver.ts";
import {
  buildSvieRuntimeSnapshot,
  initializeSvieRuntime,
} from "./svieRuntimeFoundation.ts";
import type { SvieRuntimeBuildInput } from "./svieRuntimeFoundationContract.ts";

let lastSceneSignature: string | null = null;
let snapshot: SvieHealthVisualizationSnapshot = DEFAULT_SVIE_HEALTH_VISUALIZATION_SNAPSHOT;
const loggedHealthSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function buildSvieSceneSignature(sceneJson: unknown): string {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects)) return "svie:empty";
  return objects
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") return `idx:${index}`;
      const object = entry as Record<string, unknown>;
      return JSON.stringify({
        id: object.id ?? index,
        impact: object.impact ?? null,
        risk: object.risk ?? null,
        confidence: object.confidence ?? null,
        status: object.status ?? null,
        scanner_severity: object.scanner_severity ?? null,
        emphasis: object.emphasis ?? null,
      });
    })
    .join("|");
}

function logHealthComputedOnce(next: SvieHealthVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedHealthSignatures.has(next.sceneSignature)) return;
  loggedHealthSignatures.add(next.sceneSignature);
  globalThis.console?.debug?.(SVIE_HEALTH_COMPUTED_LOG, {
    objectCount: next.objectCount,
    healthyCount: next.healthyCount,
    warningCount: next.warningCount,
    criticalCount: next.criticalCount,
    opportunityCount: next.opportunityCount,
  });
}

export function syncSvieHealthVisualization(
  input: SvieRuntimeBuildInput = {}
): SvieHealthVisualizationSnapshot {
  initializeSvieRuntime();
  const sceneSignature = buildSvieSceneSignature(input.sceneJson);
  if (sceneSignature === lastSceneSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }

  lastSceneSignature = sceneSignature;
  const runtimeSnapshot = buildSvieRuntimeSnapshot(input);
  snapshot = buildSvieHealthVisualizationSnapshot({
    objects: runtimeSnapshot.objects,
    sceneSignature,
    generatedAt: runtimeSnapshot.generatedAt,
  });
  logHealthComputedOnce(snapshot);
  return snapshot;
}

export function getSvieHealthVisualizationSnapshot(): SvieHealthVisualizationSnapshot {
  return snapshot;
}

export function resetSvieHealthVisualizationRuntimeForTests(): void {
  lastSceneSignature = null;
  snapshot = DEFAULT_SVIE_HEALTH_VISUALIZATION_SNAPSHOT;
  loggedHealthSignatures.clear();
}
