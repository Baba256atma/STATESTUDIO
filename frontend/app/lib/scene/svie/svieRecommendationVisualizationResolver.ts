/**
 * SVIE:3:3 — Resolve material-only recommendation visual hierarchy (read-only).
 */

import {
  SVIE_RECOMMENDATION_PALETTE,
  SVIE_RECOMMENDATION_TIER_VISUAL,
  type SvieRecommendationHierarchy,
  type SvieRecommendationNodeVisualStyle,
  type SvieRecommendationTier,
  type SvieVisualRecommendation,
} from "./svieRecommendationVisualizationContract.ts";

function paletteForTier(tier: SvieRecommendationTier): { glowColor: string } {
  if (tier === 1) return { glowColor: SVIE_RECOMMENDATION_PALETTE.tier1 };
  if (tier === 2) return { glowColor: SVIE_RECOMMENDATION_PALETTE.tier2 };
  return { glowColor: SVIE_RECOMMENDATION_PALETTE.tier3 };
}

export function resolveRecommendationVisualization(
  hierarchy: SvieRecommendationHierarchy
): SvieVisualRecommendation {
  const nodeVisualByObjectId: Record<string, SvieRecommendationNodeVisualStyle> = {};

  for (const ranked of hierarchy.rankedObjects) {
    const tierVisual = SVIE_RECOMMENDATION_TIER_VISUAL[ranked.tier];
    const palette = paletteForTier(ranked.tier);
    nodeVisualByObjectId[ranked.objectId] = Object.freeze({
      objectId: ranked.objectId,
      recommendationId: hierarchy.recommendationId,
      tier: ranked.tier,
      showHighlight: true,
      glowColor: palette.glowColor,
      glowOpacity: tierVisual.glowOpacity,
      glowIntensity: tierVisual.glowIntensity,
      ringScale: tierVisual.ringScale,
      pulseSpeed: tierVisual.pulseSpeed,
    });
  }

  return Object.freeze({
    recommendationId: hierarchy.recommendationId,
    nodeVisualByObjectId: Object.freeze(nodeVisualByObjectId),
  });
}

export function mergeRecommendationVisuals(
  visualRecommendations: readonly SvieVisualRecommendation[]
): Readonly<Record<string, SvieRecommendationNodeVisualStyle>> {
  const nodeVisualByObjectId: Record<string, SvieRecommendationNodeVisualStyle> = {};

  for (const visual of visualRecommendations) {
    for (const [objectId, style] of Object.entries(visual.nodeVisualByObjectId)) {
      const existing = nodeVisualByObjectId[objectId];
      if (!existing || style.tier < existing.tier || style.glowIntensity > existing.glowIntensity) {
        nodeVisualByObjectId[objectId] = style;
      }
    }
  }

  return Object.freeze(nodeVisualByObjectId);
}
