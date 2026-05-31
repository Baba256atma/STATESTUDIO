import type { Vector3Tuple } from "../../sceneTypes";
import { evaluateExecutiveSceneDensity } from "./executiveSceneDensityRuntime";
import { logExecutiveSpacingResolved } from "./executiveDensityInstrumentation";
import {
  resolvePreferredStrategicLayoutMode,
  resolveStrategicLayoutPosition,
} from "./strategicLayoutEngine";

export type ExecutiveSpacingSnapshot = {
  minDistance: number;
  orbitRadiusBase: number;
  labelClearance: number;
  selectionHalo: number;
};

function distance(a: Vector3Tuple, b: Vector3Tuple): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function resolveExecutiveSpacing(input: {
  objectCount: number;
  relationshipCount?: number;
  boundsSize?: [number, number, number] | null;
  layoutPreset?: string | null;
}): ExecutiveSpacingSnapshot {
  const density = evaluateExecutiveSceneDensity(input);
  const tier = density.sceneDensity;
  const minDistance =
    tier === "sparse" ? 1.45 : tier === "moderate" ? 1.22 : tier === "dense" ? 1.02 : 0.88;
  const orbitRadiusBase = density.recommendedSpacing + (tier === "critical" ? 0.35 : 0.15);
  const labelClearance = tier === "sparse" ? 0.42 : tier === "moderate" ? 0.34 : 0.28;
  const selectionHalo = tier === "sparse" ? 0.24 : 0.18;

  const snapshot = {
    minDistance: Number(minDistance.toFixed(3)),
    orbitRadiusBase: Number(orbitRadiusBase.toFixed(3)),
    labelClearance: Number(labelClearance.toFixed(3)),
    selectionHalo: Number(selectionHalo.toFixed(3)),
  };

  logExecutiveSpacingResolved({
    objectCount: input.objectCount,
    sceneDensity: tier,
    ...snapshot,
  });

  return snapshot;
}

export function resolveSpacedCatalogPlacementPosition(
  existingPositions: Vector3Tuple[],
  startIndex: number,
  input: {
    objectCount: number;
    relationshipCount?: number;
    boundsSize?: [number, number, number] | null;
    layoutPreset?: string | null;
  }
): { position: Vector3Tuple; reason: string } {
  const spacing = resolveExecutiveSpacing(input);
  const layoutMode = resolvePreferredStrategicLayoutMode(input.objectCount);

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const position = resolveStrategicLayoutPosition({
      mode: layoutMode,
      index: startIndex + attempt,
      objectCount: Math.max(startIndex + attempt + 1, input.objectCount),
      spacing: spacing.orbitRadiusBase,
    });
    const overlaps = existingPositions.some((pos) => distance(pos, position) < spacing.minDistance);
    if (!overlaps) {
      return { position, reason: `${layoutMode.toLowerCase()}_clear_slot` };
    }
  }

  const fallback = resolveStrategicLayoutPosition({
    mode: layoutMode,
    index: startIndex + 28,
    objectCount: input.objectCount,
    spacing: spacing.orbitRadiusBase,
  });
  return { position: fallback, reason: `${layoutMode.toLowerCase()}_fallback_slot` };
}
