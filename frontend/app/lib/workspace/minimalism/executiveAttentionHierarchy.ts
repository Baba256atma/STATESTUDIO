import { auditedResolve } from "../../audit/auditedResolve";
import type { AttentionHierarchyTier } from "./executiveMinimalismTypes";
import { logAttentionHierarchy } from "./executiveMinimalismInstrumentation";

export type AttentionElementId =
  | "selected_object"
  | "high_risk_signal"
  | "decision_status"
  | "frsi_score"
  | "timeline"
  | "scenario_status"
  | "object_metadata"
  | "layer_controls"
  | "toolbar_controls"
  | "decorative_glow"
  | "disabled_actions"
  | "pipeline_headline";

const ATTENTION_TIERS: Record<AttentionElementId, AttentionHierarchyTier> = {
  selected_object: "PRIMARY",
  high_risk_signal: "PRIMARY",
  decision_status: "PRIMARY",
  frsi_score: "PRIMARY",
  timeline: "SECONDARY",
  scenario_status: "SECONDARY",
  pipeline_headline: "SECONDARY",
  object_metadata: "TERTIARY",
  layer_controls: "TERTIARY",
  toolbar_controls: "TERTIARY",
  decorative_glow: "BACKGROUND",
  disabled_actions: "BACKGROUND",
};

export type AttentionHierarchyStyle = {
  tier: AttentionHierarchyTier;
  opacityMultiplier: number;
  fontWeight: number;
  emphasisScale: number;
};

const TIER_STYLES: Record<AttentionHierarchyTier, Omit<AttentionHierarchyStyle, "tier">> = {
  PRIMARY: { opacityMultiplier: 1, fontWeight: 800, emphasisScale: 1.04 },
  SECONDARY: { opacityMultiplier: 0.92, fontWeight: 700, emphasisScale: 1 },
  TERTIARY: { opacityMultiplier: 0.78, fontWeight: 600, emphasisScale: 0.98 },
  BACKGROUND: { opacityMultiplier: 0.55, fontWeight: 500, emphasisScale: 0.94 },
};

export function resolveAttentionTier(elementId: AttentionElementId): AttentionHierarchyTier {
  return ATTENTION_TIERS[elementId] ?? "TERTIARY";
}

export function resolveAttentionHierarchyStyle(elementId: AttentionElementId): AttentionHierarchyStyle {
  return auditedResolve({
    auditName: "Minimalism",
    inputs: { kind: "attentionHierarchy", elementId },
    compute: () => {
      const tier = resolveAttentionTier(elementId);
      return { tier, ...TIER_STYLES[tier] };
    },
    formatLogPayload: (style) => ({
      elementId,
      tier: style.tier,
      opacityMultiplier: style.opacityMultiplier,
    }),
    log: logAttentionHierarchy,
  });
}
