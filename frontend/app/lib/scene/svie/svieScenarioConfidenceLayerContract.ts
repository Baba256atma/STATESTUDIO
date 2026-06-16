/**
 * SVIE:4:6 — Scenario confidence layer contract.
 *
 * Visual-only confidence cues for simulated scenario outcomes.
 * No percentages in scene, routing writes, lifecycle writes, or topology mutation.
 */

export const SVIE_SCENARIO_CONFIDENCE_LAYER_TAG = "[SVIE:4:6_SCENARIO_CONFIDENCE_LAYER]" as const;

export const SVIE_SCENARIO_CONFIDENCE_LAYER_VERSION = "4.6.0" as const;

export const SVIE_SCENARIO_CONFIDENCE_COMPUTED_LOG = "[SVIE][ScenarioConfidence]" as const;

export type SvieScenarioConfidenceTier = "executive_high" | "high" | "moderate" | "low";

export type SvieScenarioConfidencePulseMode = "stable" | "soft" | "unstable";

export type SvieScenarioConfidenceEntry = Readonly<{
  scenarioId: string;
  confidence: number;
  tier: SvieScenarioConfidenceTier;
  objectIds: readonly string[];
}>;

export type SvieScenarioConfidenceNodeVisualStyle = Readonly<{
  objectId: string;
  scenarioId: string;
  tier: SvieScenarioConfidenceTier;
  pulseMode: SvieScenarioConfidencePulseMode;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  pulseSpeed: number;
  pulseAmplitude: number;
  ringScale: number;
}>;

export type SvieScenarioConfidenceVisualizationSnapshot = Readonly<{
  entries: readonly SvieScenarioConfidenceEntry[];
  nodeVisualByObjectId: Readonly<Record<string, SvieScenarioConfidenceNodeVisualStyle>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieScenarioConfidenceLayerBuildInput = Readonly<{
  scenarios?: readonly import("./svieScenarioLinkFoundationContract.ts").SvieScenarioInput[];
  sceneJson?: unknown;
}>;

export const SVIE_SCENARIO_CONFIDENCE_TIER_LABELS = Object.freeze({
  executive_high: "Executive High",
  high: "High",
  moderate: "Moderate",
  low: "Low",
});

export const SVIE_SCENARIO_CONFIDENCE_PALETTE = Object.freeze({
  executive_high: "#22c55e",
  high: "#4ade80",
  moderate: "#fbbf24",
  low: "#f87171",
});

export const SVIE_SCENARIO_CONFIDENCE_VISUAL_BY_TIER = Object.freeze({
  executive_high: Object.freeze({
    pulseMode: "stable" as SvieScenarioConfidencePulseMode,
    glowOpacity: 0.16,
    glowIntensity: 0.24,
    pulseSpeed: 0,
    pulseAmplitude: 0,
    ringScale: 1.3,
  }),
  high: Object.freeze({
    pulseMode: "stable" as SvieScenarioConfidencePulseMode,
    glowOpacity: 0.14,
    glowIntensity: 0.2,
    pulseSpeed: 0,
    pulseAmplitude: 0,
    ringScale: 1.28,
  }),
  moderate: Object.freeze({
    pulseMode: "soft" as SvieScenarioConfidencePulseMode,
    glowOpacity: 0.12,
    glowIntensity: 0.16,
    pulseSpeed: 1.4,
    pulseAmplitude: 0.08,
    ringScale: 1.26,
  }),
  low: Object.freeze({
    pulseMode: "unstable" as SvieScenarioConfidencePulseMode,
    glowOpacity: 0.1,
    glowIntensity: 0.14,
    pulseSpeed: 3.4,
    pulseAmplitude: 0.16,
    ringScale: 1.24,
  }),
});

export const DEFAULT_SVIE_SCENARIO_CONFIDENCE_VISUALIZATION_SNAPSHOT: SvieScenarioConfidenceVisualizationSnapshot =
  Object.freeze({
    entries: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    generatedAt: 0,
    signature: "svie:scenario-confidence:empty",
  });
