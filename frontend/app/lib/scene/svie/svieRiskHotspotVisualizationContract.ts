/**
 * SVIE:2:2 — Risk hotspot visualization contract.
 *
 * Visual metadata only — no topology, coordinates, selection, navigation, or dashboard writes.
 */

import type { SvieRiskLevel } from "./svieRiskRuntimeContract.ts";

export const SVIE_RISK_HOTSPOT_VISUALIZATION_TAG = "[SVIE:2:2_RISK_HOTSPOT]" as const;

export const SVIE_RISK_HOTSPOT_VISUALIZATION_VERSION = "2.2.0" as const;

export const SVIE_RISK_HOTSPOTS_LOG = "[SVIE][RiskHotspots]" as const;

export const SVIE_RISK_CRITICAL_HOTSPOT_CAP = 3 as const;

export type SvieObjectRiskHotspotVisualStyle = Readonly<{
  riskLevel: SvieRiskLevel;
  effectiveLevel: SvieRiskLevel;
  riskScore: number;
  showOverlay: boolean;
  showOutline: boolean;
  pulseEnabled: boolean;
  haloEnabled: boolean;
  outlineColor: string;
  outlineOpacity: number;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  emissiveColor: string;
  emissiveIntensity: number;
  pulseMinIntensity: number;
  pulseMaxIntensity: number;
  pulseSpeed: number;
  haloColor: string;
  haloOpacity: number;
  haloIntensity: number;
  executiveAttentionTier: "top1" | "top3" | "top5" | "normal";
  executivePulseEnabled: boolean;
  executivePulseMinIntensity: number;
  executivePulseMaxIntensity: number;
  executivePulseSpeed: number;
}>;

export type SvieRiskHotspotVisualizationSnapshot = Readonly<{
  visualByObjectId: Readonly<Record<string, SvieObjectRiskHotspotVisualStyle>>;
  objectCount: number;
  lowCount: number;
  mediumCount: number;
  highCount: number;
  criticalCount: number;
  highlightedCount: number;
  sceneSignature: string;
  generatedAt: number;
}>;

export const SVIE_RISK_HOTSPOT_PALETTE = Object.freeze({
  medium: Object.freeze({
    outlineColor: "#fbbf24",
    outlineOpacity: 0.22,
    glowColor: "#fcd34d",
    glowOpacity: 0.12,
    glowIntensity: 0.16,
    emissiveColor: "#f59e0b",
    emissiveIntensity: 0.1,
  }),
  high: Object.freeze({
    outlineColor: "#f59e0b",
    outlineOpacity: 0.28,
    glowColor: "#fbbf24",
    glowOpacity: 0.2,
    glowIntensity: 0.28,
    emissiveColor: "#fbbf24",
    emissiveIntensity: 0.18,
    pulseMinIntensity: 0.18,
    pulseMaxIntensity: 0.36,
    pulseSpeed: 2.4,
  }),
  critical: Object.freeze({
    outlineColor: "#ef4444",
    outlineOpacity: 0.32,
    glowColor: "#f87171",
    glowOpacity: 0.26,
    glowIntensity: 0.34,
    emissiveColor: "#fca5a5",
    emissiveIntensity: 0.24,
    pulseMinIntensity: 0.24,
    pulseMaxIntensity: 0.48,
    pulseSpeed: 2.8,
    haloColor: "#ef4444",
    haloOpacity: 0.18,
    haloIntensity: 0.3,
  }),
});

export const DEFAULT_SVIE_RISK_HOTSPOT_VISUALIZATION_SNAPSHOT: SvieRiskHotspotVisualizationSnapshot =
  Object.freeze({
    visualByObjectId: Object.freeze({}),
    objectCount: 0,
    lowCount: 0,
    mediumCount: 0,
    highCount: 0,
    criticalCount: 0,
    highlightedCount: 0,
    sceneSignature: "svie:empty",
    generatedAt: 0,
  });
