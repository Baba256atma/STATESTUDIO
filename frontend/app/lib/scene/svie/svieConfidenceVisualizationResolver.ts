/**
 * SVIE:3:4 — Resolve confidence visual styles (read-only).
 */

import type { SvieAdvisoryVisualLink } from "./svieAdvisoryLinkFoundationContract.ts";
import type { SvieConfidenceMappedRecommendation } from "./svieConfidenceVisualizationContract.ts";
import {
  SVIE_CONFIDENCE_PALETTE,
  SVIE_CONFIDENCE_TIER_VISUAL,
  type SvieConfidenceNodeVisualStyle,
} from "./svieConfidenceVisualizationContract.ts";

const TIER_RANK: Record<SvieConfidenceMappedRecommendation["tier"], number> = {
  executive_high: 4,
  high: 3,
  moderate: 2,
  low: 1,
};

export function resolveConfidenceVisualization(input: {
  mapped: SvieConfidenceMappedRecommendation;
  link: SvieAdvisoryVisualLink;
}): Readonly<Record<string, SvieConfidenceNodeVisualStyle>> {
  const tierVisual = SVIE_CONFIDENCE_TIER_VISUAL[input.mapped.tier];
  const nodeVisualByObjectId: Record<string, SvieConfidenceNodeVisualStyle> = {};

  for (const objectId of input.link.objectIds) {
    nodeVisualByObjectId[objectId] = Object.freeze({
      objectId,
      recommendationId: input.mapped.recommendationId,
      tier: input.mapped.tier,
      pulseMode: tierVisual.pulseMode,
      glowColor: SVIE_CONFIDENCE_PALETTE[input.mapped.tier],
      glowOpacity: tierVisual.glowOpacity,
      glowIntensity: tierVisual.glowIntensity,
      pulseSpeed: tierVisual.pulseSpeed,
      pulseAmplitude: tierVisual.pulseAmplitude,
      ringScale: tierVisual.ringScale,
    });
  }

  return Object.freeze(nodeVisualByObjectId);
}

export function mergeConfidenceVisuals(
  visuals: readonly Readonly<Record<string, SvieConfidenceNodeVisualStyle>>[]
): Readonly<Record<string, SvieConfidenceNodeVisualStyle>> {
  const nodeVisualByObjectId: Record<string, SvieConfidenceNodeVisualStyle> = {};

  for (const visualMap of visuals) {
    for (const [objectId, style] of Object.entries(visualMap)) {
      const existing = nodeVisualByObjectId[objectId];
      if (!existing || TIER_RANK[style.tier] >= TIER_RANK[existing.tier]) {
        nodeVisualByObjectId[objectId] = style;
      }
    }
  }

  return Object.freeze(nodeVisualByObjectId);
}
