/**
 * SVIE:3:3 — Recommendation visualization contract.
 *
 * Material-only tier highlights for advisory recommendations.
 * No text labels, popups, object movement, camera movement, or topology changes.
 */

export const SVIE_RECOMMENDATION_VISUALIZATION_TAG = "[SVIE:3:3_RECOMMENDATION_VISUALIZATION]" as const;

export const SVIE_RECOMMENDATION_VISUALIZATION_VERSION = "3.3.0" as const;

export const SVIE_RECOMMENDATION_COMPUTED_LOG = "[SVIE][Recommendation]" as const;

export type SvieRecommendationTier = 1 | 2 | 3;

export type SvieRecommendationRankedObject = Readonly<{
  objectId: string;
  label: string;
  tier: SvieRecommendationTier;
  rankScore: number;
}>;

export type SvieRecommendationHierarchy = Readonly<{
  recommendationId: string;
  title?: string;
  rankedObjects: readonly SvieRecommendationRankedObject[];
}>;

export type SvieRecommendationNodeVisualStyle = Readonly<{
  objectId: string;
  recommendationId: string;
  tier: SvieRecommendationTier;
  showHighlight: boolean;
  glowColor: string;
  glowOpacity: number;
  glowIntensity: number;
  ringScale: number;
  pulseSpeed: number;
}>;

export type SvieVisualRecommendation = Readonly<{
  recommendationId: string;
  nodeVisualByObjectId: Readonly<Record<string, SvieRecommendationNodeVisualStyle>>;
}>;

export type SvieRecommendationVisualizationSnapshot = Readonly<{
  hierarchies: readonly SvieRecommendationHierarchy[];
  visualRecommendations: readonly SvieVisualRecommendation[];
  nodeVisualByObjectId: Readonly<Record<string, SvieRecommendationNodeVisualStyle>>;
  generatedAt: number;
  signature: string;
}>;

export type SvieRecommendationVisualizationBuildInput = Readonly<{
  findings?: readonly import("./svieAdvisoryLinkFoundationContract.ts").SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}>;

export const SVIE_RECOMMENDATION_PALETTE = Object.freeze({
  tier1: "#f59e0b",
  tier1Emissive: "#fbbf24",
  tier2: "#fbbf24",
  tier2Emissive: "#fcd34d",
  tier3: "#fcd34d",
  tier3Emissive: "#fde68a",
});

export const SVIE_RECOMMENDATION_TIER_VISUAL = Object.freeze({
  1: Object.freeze({
    glowOpacity: 0.28,
    glowIntensity: 0.42,
    ringScale: 1.58,
    pulseSpeed: 2.4,
  }),
  2: Object.freeze({
    glowOpacity: 0.18,
    glowIntensity: 0.28,
    ringScale: 1.48,
    pulseSpeed: 2.0,
  }),
  3: Object.freeze({
    glowOpacity: 0.12,
    glowIntensity: 0.18,
    ringScale: 1.38,
    pulseSpeed: 1.6,
  }),
});

export const DEFAULT_SVIE_RECOMMENDATION_VISUALIZATION_SNAPSHOT: SvieRecommendationVisualizationSnapshot =
  Object.freeze({
    hierarchies: Object.freeze([]),
    visualRecommendations: Object.freeze([]),
    nodeVisualByObjectId: Object.freeze({}),
    generatedAt: 0,
    signature: "svie:recommendation:empty",
  });
