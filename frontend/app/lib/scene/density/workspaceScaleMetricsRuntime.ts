import type { WorkspaceScaleMetricsSnapshot } from "./executiveDensityTypes";
import { evaluateExecutiveSceneDensity } from "./executiveSceneDensityRuntime";
import { logWorkspaceScaleMetrics } from "./executiveDensityInstrumentation";

let latestMetrics: WorkspaceScaleMetricsSnapshot | null = null;

export function computeWorkspaceScaleMetrics(input: {
  totalObjects: number;
  visibleObjects?: number;
  relationships?: number;
  boundsSize?: [number, number, number] | null;
  viewportWidth?: number;
  viewportHeight?: number;
  layoutPreset?: string | null;
}): WorkspaceScaleMetricsSnapshot {
  const totalObjects = Math.max(0, Math.floor(input.totalObjects));
  const visibleObjects = Math.max(0, Math.floor(input.visibleObjects ?? totalObjects));
  const relationships = Math.max(0, Math.floor(input.relationships ?? 0));
  const density = evaluateExecutiveSceneDensity({
    objectCount: totalObjects,
    relationshipCount: relationships,
    boundsSize: input.boundsSize,
    viewportWidth: input.viewportWidth,
    viewportHeight: input.viewportHeight,
    layoutPreset: input.layoutPreset,
  });

  const visibilityRatio = totalObjects > 0 ? visibleObjects / totalObjects : 1;
  const layoutHealth = Number(
    Math.max(0, Math.min(1, visibilityRatio * (1 - density.densityScore * 0.55))).toFixed(3)
  );

  const snapshot: WorkspaceScaleMetricsSnapshot = {
    totalObjects,
    visibleObjects,
    relationships,
    densityScore: density.densityScore,
    layoutHealth,
    timestamp: Date.now(),
  };

  latestMetrics = snapshot;
  logWorkspaceScaleMetrics(snapshot);
  return snapshot;
}

export function getLatestWorkspaceScaleMetrics(): WorkspaceScaleMetricsSnapshot | null {
  return latestMetrics;
}

export function resetWorkspaceScaleMetricsForTests(): void {
  latestMetrics = null;
}
