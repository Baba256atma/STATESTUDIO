/**
 * SVIE:2:3 — Apply executive attention pulse guidance to risk hotspot visuals.
 */

import {
  SVIE_EXECUTIVE_ATTENTION_PULSE_BY_TIER,
  type SvieExecutiveRiskAttentionSnapshot,
} from "./svieExecutiveRiskAttentionContract.ts";
import type {
  SvieObjectRiskHotspotVisualStyle,
  SvieRiskHotspotVisualizationSnapshot,
} from "./svieRiskHotspotVisualizationContract.ts";

const NORMAL_EXECUTIVE_ATTENTION_FIELDS = Object.freeze({
  executiveAttentionTier: "normal" as const,
  executivePulseEnabled: false,
  executivePulseMinIntensity: 0,
  executivePulseMaxIntensity: 0,
  executivePulseSpeed: 0,
});

export function applyExecutiveAttentionVisualGuidance(
  hotspotSnapshot: SvieRiskHotspotVisualizationSnapshot,
  attentionSnapshot: SvieExecutiveRiskAttentionSnapshot
): Readonly<Record<string, SvieObjectRiskHotspotVisualStyle>> {
  const attentionByObjectId = new Map(attentionSnapshot.objects.map((entry) => [entry.objectId, entry]));
  const next: Record<string, SvieObjectRiskHotspotVisualStyle> = {};

  for (const [objectId, visual] of Object.entries(hotspotSnapshot.visualByObjectId)) {
    const attention = attentionByObjectId.get(objectId);
    if (!attention || attention.attentionTier === "normal") {
      next[objectId] = Object.freeze({
        ...visual,
        ...NORMAL_EXECUTIVE_ATTENTION_FIELDS,
      });
      continue;
    }

    const pulse = SVIE_EXECUTIVE_ATTENTION_PULSE_BY_TIER[attention.attentionTier];
    next[objectId] = Object.freeze({
      ...visual,
      showOverlay: true,
      executiveAttentionTier: attention.attentionTier,
      executivePulseEnabled: true,
      executivePulseMinIntensity: pulse.pulseMinIntensity,
      executivePulseMaxIntensity: pulse.pulseMaxIntensity,
      executivePulseSpeed: pulse.pulseSpeed,
    });
  }

  return Object.freeze(next);
}
