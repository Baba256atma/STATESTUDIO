/**
 * SVIE:3:4 — Confidence visualization contract.
 *
 * Material-only confidence cues for advisory recommendations.
 * No numeric display, popups, object movement, camera movement, or topology changes.
 */

export const SVIE_CONFIDENCE_VISUALIZATION_TAG = "[SVIE:3:4_CONFIDENCE_VISUALIZATION]" as const;

export const SVIE_CONFIDENCE_VISUALIZATION_VERSION = "3.4.0" as const;

export const SVIE_CONFIDENCE_COMPUTED_LOG = "[SVIE][Confidence]" as const;

export type SvieConfidenceTier = "executive_high" | "high" | "moderate" | "low";

export type SvieConfidencePulseMode = "stable" | "soft" | "unstable";

export type SvieConfidenceMappedRecommendation = Readonly<{
  recommendationId: string;
  confidence: number;
  tier: SvieConfidenceTier;
  label: string;
}>;

export type SvieConfidenceNodeVisualStyle = Readonly<{
  objectId: string;
  recommendationId: string;
  tier: SvieConfidenceTier;
  pulseMode: SvieConfidencePulseMode;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  pulseSpeed: number;
  pulseAmplitude: number;
  ringScale: number;
}>;

export type SvieConfidenceVisualizationSnapshot = Readonly<{
  mappedRecommendations: readonly SvieConfidenceMappedRecommendation[];
  nodeVisualByObjectId: Readonly<Record<string, SvieConfidenceNodeVisualStyle>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieConfidenceVisualizationBuildInput = Readonly<{
  findings?: readonly import("./svieAdvisoryLinkFoundationContract.ts").SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}>;

export const SVIE_CONFIDENCE_TIER_LABELS = Object.freeze({
  executive_high: "Executive High Confidence",
  high: "High Confidence",
  moderate: "Moderate Confidence",
  low: "Low Confidence",
});

export const SVIE_CONFIDENCE_PALETTE = Object.freeze({
  executive_high: "#22c55e",
  high: "#4ade80",
  moderate: "#fbbf24",
  low: "#f87171",
});

export const SVIE_CONFIDENCE_TIER_VISUAL = Object.freeze({
  executive_high: Object.freeze({
    pulseMode: "stable" as SvieConfidencePulseMode,
    glowOpacity: 0.16,
    glowIntensity: 0.24,
    pulseSpeed: 0,
    pulseAmplitude: 0,
    ringScale: 1.32,
  }),
  high: Object.freeze({
    pulseMode: "stable" as SvieConfidencePulseMode,
    glowOpacity: 0.14,
    glowIntensity: 0.2,
    pulseSpeed: 0,
    pulseAmplitude: 0,
    ringScale: 1.3,
  }),
  moderate: Object.freeze({
    pulseMode: "soft" as SvieConfidencePulseMode,
    glowOpacity: 0.12,
    glowIntensity: 0.16,
    pulseSpeed: 1.4,
    pulseAmplitude: 0.08,
    ringScale: 1.28,
  }),
  low: Object.freeze({
    pulseMode: "unstable" as SvieConfidencePulseMode,
    glowOpacity: 0.1,
    glowIntensity: 0.14,
    pulseSpeed: 3.6,
    pulseAmplitude: 0.16,
    ringScale: 1.26,
  }),
});

export const DEFAULT_SVIE_CONFIDENCE_VISUALIZATION_SNAPSHOT: SvieConfidenceVisualizationSnapshot =
  Object.freeze({
    mappedRecommendations: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    generatedAt: 0,
    signature: "svie:confidence:empty",
  });
