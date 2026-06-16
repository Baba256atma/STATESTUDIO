/**
 * SVIE:4:3 — Scenario delta visualization contract.
 *
 * Visual-only current-vs-future delta overlays.
 * No numeric scene display, scene mutation, topology mutation, routing, or lifecycle writes.
 */

export const SVIE_SCENARIO_DELTA_VISUALIZATION_TAG = "[SVIE:4:3_SCENARIO_DELTA_VISUALIZATION]" as const;

export const SVIE_SCENARIO_DELTA_VISUALIZATION_VERSION = "4.3.0" as const;

export const SVIE_SCENARIO_DELTA_COMPUTED_LOG = "[SVIE][ScenarioDelta]" as const;

export type SvieScenarioDeltaDirection = "increase" | "decrease" | "stable" | "unknown";

export type SvieScenarioDelta = Readonly<{
  objectId: string;
  scenarioId: string;
  direction: SvieScenarioDeltaDirection;
  magnitude: number;
  confidence: number;
  changeCount: number;
}>;

export type SvieScenarioDeltaNodeVisualStyle = Readonly<{
  objectId: string;
  scenarioId: string;
  direction: SvieScenarioDeltaDirection;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  radiusMultiplier: number;
  pulseSpeed: number;
}>;

export type SvieScenarioDeltaVisualizationSnapshot = Readonly<{
  deltas: readonly SvieScenarioDelta[];
  nodeVisualByObjectId: Readonly<Record<string, SvieScenarioDeltaNodeVisualStyle>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieScenarioDeltaVisualizationBuildInput = Readonly<{
  scenarios?: readonly import("./svieScenarioLinkFoundationContract.ts").SvieScenarioInput[];
  sceneJson?: unknown;
}>;

export const SVIE_SCENARIO_DELTA_PALETTE = Object.freeze({
  increase: "#ef4444",
  decrease: "#22c55e",
  stable: "#94a3b8",
  unknown: "#a78bfa",
});

export const SVIE_SCENARIO_DELTA_VISUAL_BY_DIRECTION = Object.freeze({
  increase: Object.freeze({
    glowOpacity: 0.22,
    glowIntensity: 0.34,
    radiusMultiplier: 1.62,
    pulseSpeed: 1.8,
  }),
  decrease: Object.freeze({
    glowOpacity: 0.18,
    glowIntensity: 0.26,
    radiusMultiplier: 1.5,
    pulseSpeed: 1.2,
  }),
  stable: Object.freeze({
    glowOpacity: 0.1,
    glowIntensity: 0.14,
    radiusMultiplier: 1.34,
    pulseSpeed: 0.8,
  }),
  unknown: Object.freeze({
    glowOpacity: 0.12,
    glowIntensity: 0.18,
    radiusMultiplier: 1.4,
    pulseSpeed: 1.4,
  }),
});

export const DEFAULT_SVIE_SCENARIO_DELTA_VISUALIZATION_SNAPSHOT: SvieScenarioDeltaVisualizationSnapshot =
  Object.freeze({
    deltas: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    generatedAt: 0,
    signature: "svie:scenario-delta:empty",
  });
