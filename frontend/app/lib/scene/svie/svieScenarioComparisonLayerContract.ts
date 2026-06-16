/**
 * SVIE:4:5 — Multi-scenario comparison layer contract.
 *
 * Visual-only A/B/C scenario comparison for executive-clean scene overlays.
 * No dashboard clutter, scene mutation, topology mutation, routing, or lifecycle writes.
 */

export const SVIE_MULTI_SCENARIO_COMPARISON_TAG = "[SVIE:4:5_MULTI_SCENARIO_COMPARISON]" as const;

export const SVIE_MULTI_SCENARIO_COMPARISON_VERSION = "4.5.0" as const;

export const SVIE_SCENARIO_COMPARISON_COMPUTED_LOG = "[SVIE][ScenarioComparison]" as const;

export type SvieScenarioComparisonRole = "primary" | "secondary" | "alternative";

export type SvieScenarioComparisonEntry = Readonly<{
  scenarioId: string;
  role: SvieScenarioComparisonRole;
  objectIds: readonly string[];
  confidence: number;
  predictedChangeCount: number;
}>;

export type SvieScenarioComparisonModel = Readonly<{
  entries: readonly SvieScenarioComparisonEntry[];
  roleByScenarioId: Readonly<Record<string, SvieScenarioComparisonRole>>;
}>;

export type SvieScenarioComparisonNodeVisualStyle = Readonly<{
  objectId: string;
  scenarioId: string;
  role: SvieScenarioComparisonRole;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  radiusMultiplier: number;
  pulseSpeed: number;
}>;

export type SvieScenarioComparisonVisualizationSnapshot = Readonly<{
  model: SvieScenarioComparisonModel;
  nodeVisualByObjectId: Readonly<Record<string, SvieScenarioComparisonNodeVisualStyle>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieScenarioComparisonLayerBuildInput = Readonly<{
  scenarios?: readonly import("./svieScenarioLinkFoundationContract.ts").SvieScenarioInput[];
  sceneJson?: unknown;
  primaryScenarioId?: string | null;
  secondaryScenarioId?: string | null;
  alternativeScenarioId?: string | null;
}>;

export const SVIE_SCENARIO_COMPARISON_PALETTE = Object.freeze({
  primary: "#38bdf8",
  secondary: "#a78bfa",
  alternative: "#f59e0b",
});

export const SVIE_SCENARIO_COMPARISON_VISUAL_BY_ROLE = Object.freeze({
  primary: Object.freeze({
    glowOpacity: 0.24,
    glowIntensity: 0.34,
    radiusMultiplier: 1.64,
    pulseSpeed: 1.6,
  }),
  secondary: Object.freeze({
    glowOpacity: 0.16,
    glowIntensity: 0.24,
    radiusMultiplier: 1.5,
    pulseSpeed: 1.2,
  }),
  alternative: Object.freeze({
    glowOpacity: 0.12,
    glowIntensity: 0.18,
    radiusMultiplier: 1.38,
    pulseSpeed: 0.9,
  }),
});

export const DEFAULT_SVIE_SCENARIO_COMPARISON_VISUALIZATION_SNAPSHOT: SvieScenarioComparisonVisualizationSnapshot =
  Object.freeze({
    model: Object.freeze({
      entries: Object.freeze([]),
      roleByScenarioId: Object.freeze({}),
    }),
    nodeVisualByObjectId: Object.freeze({}),
    generatedAt: 0,
    signature: "svie:scenario-comparison:empty",
  });
