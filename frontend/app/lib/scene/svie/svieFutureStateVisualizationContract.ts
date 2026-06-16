/**
 * SVIE:4:2 — Future state visualization contract.
 *
 * Material-only overlays for predicted future object states.
 * No object movement, scene mutation, topology mutation, routing, or lifecycle writes.
 */

export const SVIE_FUTURE_STATE_VISUALIZATION_TAG = "[SVIE:4:2_FUTURE_STATE_VISUALIZATION]" as const;

export const SVIE_FUTURE_STATE_VISUALIZATION_VERSION = "4.2.0" as const;

export const SVIE_FUTURE_STATE_COMPUTED_LOG = "[SVIE][FutureState]" as const;

export type SvieFutureStateLevel = "stable" | "moderate" | "high" | "critical";

export type SvieFutureObjectState = Readonly<{
  objectId: string;
  scenarioId: string;
  futureLevel: SvieFutureStateLevel;
  futureRiskScore: number;
  confidence: number;
  changeCount: number;
}>;

export type SvieFutureStateNodeVisualStyle = Readonly<{
  objectId: string;
  scenarioId: string;
  futureLevel: SvieFutureStateLevel;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  radiusMultiplier: number;
  pulseSpeed: number;
}>;

export type SvieFutureStateVisualizationSnapshot = Readonly<{
  futureStates: readonly SvieFutureObjectState[];
  nodeVisualByObjectId: Readonly<Record<string, SvieFutureStateNodeVisualStyle>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieFutureStateVisualizationBuildInput = Readonly<{
  scenarios?: readonly import("./svieScenarioLinkFoundationContract.ts").SvieScenarioInput[];
  sceneJson?: unknown;
}>;

export const SVIE_FUTURE_STATE_PALETTE = Object.freeze({
  stable: "#22c55e",
  moderate: "#fbbf24",
  high: "#f97316",
  critical: "#ef4444",
});

export const SVIE_FUTURE_STATE_VISUAL_BY_LEVEL = Object.freeze({
  stable: Object.freeze({
    glowOpacity: 0.1,
    glowIntensity: 0.14,
    radiusMultiplier: 1.36,
    pulseSpeed: 0.9,
  }),
  moderate: Object.freeze({
    glowOpacity: 0.14,
    glowIntensity: 0.2,
    radiusMultiplier: 1.42,
    pulseSpeed: 1.2,
  }),
  high: Object.freeze({
    glowOpacity: 0.2,
    glowIntensity: 0.3,
    radiusMultiplier: 1.5,
    pulseSpeed: 1.5,
  }),
  critical: Object.freeze({
    glowOpacity: 0.26,
    glowIntensity: 0.4,
    radiusMultiplier: 1.58,
    pulseSpeed: 1.8,
  }),
});

export const DEFAULT_SVIE_FUTURE_STATE_VISUALIZATION_SNAPSHOT: SvieFutureStateVisualizationSnapshot =
  Object.freeze({
    futureStates: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    generatedAt: 0,
    signature: "svie:future-state:empty",
  });
