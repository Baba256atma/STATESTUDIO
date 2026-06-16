/**
 * SVIE:1:2 — Map health levels to render-ready visual styles.
 */

import {
  SVIE_HEALTH_VISUAL_PALETTE,
  type SvieHealthVisualizationSnapshot,
  type SvieObjectHealthVisualStyle,
} from "./svieHealthVisualizationContract.ts";
import type { SvieHealthLevel, SvieObjectState } from "./svieRuntimeFoundationContract.ts";

export function mapSvieHealthLevelToVisualStyle(
  healthLevel: SvieHealthLevel
): SvieObjectHealthVisualStyle {
  const palette = SVIE_HEALTH_VISUAL_PALETTE[healthLevel];
  return Object.freeze({
    healthLevel,
    glowColor: palette.glowColor,
    glowOpacity: palette.glowOpacity,
    glowIntensity: palette.glowIntensity,
    emissiveColor: palette.emissiveColor,
    emissiveIntensity: palette.emissiveIntensity,
    outlineColor: palette.outlineColor,
    outlineOpacity: palette.outlineOpacity,
    badgeVisible: healthLevel !== "healthy",
    showGlowLayer: true,
  });
}

export function buildSvieHealthVisualizationSnapshot(input: {
  objects: readonly SvieObjectState[];
  sceneSignature: string;
  generatedAt: number;
}): SvieHealthVisualizationSnapshot {
  const visualByObjectId: Record<string, SvieObjectHealthVisualStyle> = {};
  let healthyCount = 0;
  let warningCount = 0;
  let criticalCount = 0;
  let opportunityCount = 0;

  for (const object of input.objects) {
    visualByObjectId[object.objectId] = mapSvieHealthLevelToVisualStyle(object.healthLevel);
    switch (object.healthLevel) {
      case "healthy":
        healthyCount += 1;
        break;
      case "warning":
        warningCount += 1;
        break;
      case "critical":
        criticalCount += 1;
        break;
      case "opportunity":
        opportunityCount += 1;
        break;
      default:
        healthyCount += 1;
        break;
    }
  }

  return Object.freeze({
    visualByObjectId: Object.freeze(visualByObjectId),
    objectCount: input.objects.length,
    healthyCount,
    warningCount,
    criticalCount,
    opportunityCount,
    sceneSignature: input.sceneSignature,
    generatedAt: input.generatedAt,
  });
}
