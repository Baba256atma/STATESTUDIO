/**
 * SVIE:1:2 — Object health visualization contract.
 *
 * Visual metadata only — no topology, selection, routing, or dashboard writes.
 */

import type { SvieHealthLevel } from "./svieRuntimeFoundationContract.ts";

export const SVIE_HEALTH_VISUALIZATION_TAG = "[SVIE:1:2_HEALTH_VISUALIZATION]" as const;

export const SVIE_HEALTH_VISUALIZATION_VERSION = "1.2.0" as const;

export const SVIE_HEALTH_COMPUTED_LOG = "[SVIE][HealthComputed]" as const;

export type SvieObjectHealthVisualStyle = Readonly<{
  healthLevel: SvieHealthLevel;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  emissiveColor: string;
  emissiveIntensity: number;
  outlineColor: string;
  outlineOpacity: number;
  badgeVisible: boolean;
  showGlowLayer: boolean;
}>;

export type SvieHealthVisualizationSnapshot = Readonly<{
  visualByObjectId: Readonly<Record<string, SvieObjectHealthVisualStyle>>;
  objectCount: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  opportunityCount: number;
  sceneSignature: string;
  generatedAt: number;
}>;

export const SVIE_HEALTH_VISUAL_PALETTE: Readonly<
  Record<
    SvieHealthLevel,
    Readonly<{
      glowColor: string;
      emissiveColor: string;
      outlineColor: string;
      glowOpacity: number;
      glowIntensity: number;
      emissiveIntensity: number;
      outlineOpacity: number;
    }>
  >
> = Object.freeze({
  healthy: Object.freeze({
    glowColor: "#4ade80",
    emissiveColor: "#86efac",
    outlineColor: "#22c55e",
    glowOpacity: 0.14,
    glowIntensity: 0.22,
    emissiveIntensity: 0.12,
    outlineOpacity: 0.1,
  }),
  warning: Object.freeze({
    glowColor: "#fbbf24",
    emissiveColor: "#fcd34d",
    outlineColor: "#f59e0b",
    glowOpacity: 0.18,
    glowIntensity: 0.28,
    emissiveIntensity: 0.18,
    outlineOpacity: 0.14,
  }),
  critical: Object.freeze({
    glowColor: "#f87171",
    emissiveColor: "#fca5a5",
    outlineColor: "#ef4444",
    glowOpacity: 0.22,
    glowIntensity: 0.34,
    emissiveIntensity: 0.24,
    outlineOpacity: 0.18,
  }),
  opportunity: Object.freeze({
    glowColor: "#60a5fa",
    emissiveColor: "#93c5fd",
    outlineColor: "#3b82f6",
    glowOpacity: 0.16,
    glowIntensity: 0.26,
    emissiveIntensity: 0.16,
    outlineOpacity: 0.12,
  }),
});

export const DEFAULT_SVIE_HEALTH_VISUALIZATION_SNAPSHOT: SvieHealthVisualizationSnapshot =
  Object.freeze({
    visualByObjectId: Object.freeze({}),
    objectCount: 0,
    healthyCount: 0,
    warningCount: 0,
    criticalCount: 0,
    opportunityCount: 0,
    sceneSignature: "svie:empty",
    generatedAt: 0,
  });
