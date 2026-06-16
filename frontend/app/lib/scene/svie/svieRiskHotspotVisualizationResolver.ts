/**
 * SVIE:2:2 — Map risk levels to render-ready hotspot visual styles.
 */

import {
  SVIE_RISK_CRITICAL_HOTSPOT_CAP,
  SVIE_RISK_HOTSPOT_PALETTE,
  type SvieObjectRiskHotspotVisualStyle,
  type SvieRiskHotspotVisualizationSnapshot,
} from "./svieRiskHotspotVisualizationContract.ts";
import type { SvieRiskLevel, SvieRiskState } from "./svieRiskRuntimeContract.ts";

const EXECUTIVE_ATTENTION_VISUAL_DEFAULTS = Object.freeze({
  executiveAttentionTier: "normal" as const,
  executivePulseEnabled: false,
  executivePulseMinIntensity: 0,
  executivePulseMaxIntensity: 0,
  executivePulseSpeed: 0,
});

const EMPTY_RISK_HOTSPOT_STYLE: SvieObjectRiskHotspotVisualStyle = Object.freeze({
  riskLevel: "low",
  effectiveLevel: "low",
  riskScore: 0,
  showOverlay: false,
  showOutline: false,
  pulseEnabled: false,
  haloEnabled: false,
  outlineColor: "#000000",
  outlineOpacity: 0,
  glowColor: "#000000",
  glowOpacity: 0,
  glowIntensity: 0,
  emissiveColor: "#000000",
  emissiveIntensity: 0,
  pulseMinIntensity: 0,
  pulseMaxIntensity: 0,
  pulseSpeed: 0,
  haloColor: "#000000",
  haloOpacity: 0,
  haloIntensity: 0,
  ...EXECUTIVE_ATTENTION_VISUAL_DEFAULTS,
});

export function resolveEffectiveRiskHotspotLevels(
  objects: readonly SvieRiskState[]
): ReadonlyMap<string, SvieRiskLevel> {
  const effective = new Map<string, SvieRiskLevel>();
  const criticalObjects = objects
    .filter((entry) => entry.riskLevel === "critical")
    .sort((left, right) => right.riskScore - left.riskScore || left.objectId.localeCompare(right.objectId));
  const highlightedCriticalIds = new Set(
    criticalObjects.slice(0, SVIE_RISK_CRITICAL_HOTSPOT_CAP).map((entry) => entry.objectId)
  );

  for (const object of objects) {
    if (object.riskLevel === "critical" && !highlightedCriticalIds.has(object.objectId)) {
      effective.set(object.objectId, "high");
      continue;
    }
    effective.set(object.objectId, object.riskLevel);
  }

  return effective;
}

export function mapSvieRiskLevelToHotspotVisualStyle(input: {
  riskLevel: SvieRiskLevel;
  effectiveLevel: SvieRiskLevel;
  riskScore: number;
}): SvieObjectRiskHotspotVisualStyle {
  if (input.effectiveLevel === "low") {
    return Object.freeze({
      ...EMPTY_RISK_HOTSPOT_STYLE,
      riskLevel: input.riskLevel,
      effectiveLevel: input.effectiveLevel,
      riskScore: input.riskScore,
    });
  }

  if (input.effectiveLevel === "medium") {
    const palette = SVIE_RISK_HOTSPOT_PALETTE.medium;
    return Object.freeze({
      riskLevel: input.riskLevel,
      effectiveLevel: input.effectiveLevel,
      riskScore: input.riskScore,
      showOverlay: true,
      showOutline: true,
      pulseEnabled: false,
      haloEnabled: false,
      outlineColor: palette.outlineColor,
      outlineOpacity: palette.outlineOpacity,
      glowColor: palette.glowColor,
      glowOpacity: palette.glowOpacity,
      glowIntensity: palette.glowIntensity,
      emissiveColor: palette.emissiveColor,
      emissiveIntensity: palette.emissiveIntensity,
      pulseMinIntensity: 0,
      pulseMaxIntensity: 0,
      pulseSpeed: 0,
      haloColor: "#000000",
      haloOpacity: 0,
      haloIntensity: 0,
      ...EXECUTIVE_ATTENTION_VISUAL_DEFAULTS,
    });
  }

  if (input.effectiveLevel === "high") {
    const palette = SVIE_RISK_HOTSPOT_PALETTE.high;
    return Object.freeze({
      riskLevel: input.riskLevel,
      effectiveLevel: input.effectiveLevel,
      riskScore: input.riskScore,
      showOverlay: true,
      showOutline: true,
      pulseEnabled: true,
      haloEnabled: false,
      outlineColor: palette.outlineColor,
      outlineOpacity: palette.outlineOpacity,
      glowColor: palette.glowColor,
      glowOpacity: palette.glowOpacity,
      glowIntensity: palette.glowIntensity,
      emissiveColor: palette.emissiveColor,
      emissiveIntensity: palette.emissiveIntensity,
      pulseMinIntensity: palette.pulseMinIntensity,
      pulseMaxIntensity: palette.pulseMaxIntensity,
      pulseSpeed: palette.pulseSpeed,
      haloColor: "#000000",
      haloOpacity: 0,
      haloIntensity: 0,
      ...EXECUTIVE_ATTENTION_VISUAL_DEFAULTS,
    });
  }

  const palette = SVIE_RISK_HOTSPOT_PALETTE.critical;
  return Object.freeze({
    riskLevel: input.riskLevel,
    effectiveLevel: input.effectiveLevel,
    riskScore: input.riskScore,
    showOverlay: true,
    showOutline: true,
    pulseEnabled: true,
    haloEnabled: true,
    outlineColor: palette.outlineColor,
    outlineOpacity: palette.outlineOpacity,
    glowColor: palette.glowColor,
    glowOpacity: palette.glowOpacity,
    glowIntensity: palette.glowIntensity,
    emissiveColor: palette.emissiveColor,
    emissiveIntensity: palette.emissiveIntensity,
    pulseMinIntensity: palette.pulseMinIntensity,
    pulseMaxIntensity: palette.pulseMaxIntensity,
    pulseSpeed: palette.pulseSpeed,
    haloColor: palette.haloColor,
    haloOpacity: palette.haloOpacity,
    haloIntensity: palette.haloIntensity,
    ...EXECUTIVE_ATTENTION_VISUAL_DEFAULTS,
  });
}

export function buildSvieRiskHotspotVisualizationSnapshot(input: {
  objects: readonly SvieRiskState[];
  sceneSignature: string;
  generatedAt: number;
}): SvieRiskHotspotVisualizationSnapshot {
  const effectiveLevels = resolveEffectiveRiskHotspotLevels(input.objects);
  const visualByObjectId: Record<string, SvieObjectRiskHotspotVisualStyle> = {};
  let lowCount = 0;
  let mediumCount = 0;
  let highCount = 0;
  let criticalCount = 0;
  let highlightedCount = 0;

  for (const object of input.objects) {
    const effectiveLevel = effectiveLevels.get(object.objectId) ?? object.riskLevel;
    visualByObjectId[object.objectId] = mapSvieRiskLevelToHotspotVisualStyle({
      riskLevel: object.riskLevel,
      effectiveLevel,
      riskScore: object.riskScore,
    });

    switch (object.riskLevel) {
      case "low":
        lowCount += 1;
        break;
      case "medium":
        mediumCount += 1;
        break;
      case "high":
        highCount += 1;
        break;
      case "critical":
        criticalCount += 1;
        break;
      default:
        lowCount += 1;
        break;
    }

    if (effectiveLevel === "critical") {
      highlightedCount += 1;
    }
  }

  return Object.freeze({
    visualByObjectId: Object.freeze(visualByObjectId),
    objectCount: input.objects.length,
    lowCount,
    mediumCount,
    highCount,
    criticalCount,
    highlightedCount,
    sceneSignature: input.sceneSignature,
    generatedAt: input.generatedAt,
  });
}
