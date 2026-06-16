/**
 * SVIE:2:3 — Executive risk attention contract.
 *
 * Read-only attention ranking for visual guidance. Never mutates business,
 * workspace, routing, or lifecycle state.
 */

export const SVIE_EXECUTIVE_RISK_ATTENTION_TAG = "[SVIE:2:3_EXECUTIVE_RISK_ATTENTION]" as const;

export const SVIE_EXECUTIVE_RISK_ATTENTION_VERSION = "2.3.0" as const;

export const SVIE_EXECUTIVE_ATTENTION_LOG = "[SVIE][ExecutiveAttention]" as const;

export type SvieExecutiveAttentionTier = "top1" | "top3" | "top5" | "normal";

/** Spec alias: ExecutiveRiskAttention */
export type SvieExecutiveRiskAttention = Readonly<{
  objectId: string;
  riskScore: number;
  impactWeight: number;
  confidenceWeight: number;
  attentionScore: number;
  rank: number;
  attentionTier: SvieExecutiveAttentionTier;
}>;

export type SvieExecutiveRiskAttentionSnapshot = Readonly<{
  objects: readonly SvieExecutiveRiskAttention[];
  top1: readonly string[];
  top3: readonly string[];
  top5: readonly string[];
  topObjectId: string | null;
  topScore: number;
  objectCount: number;
  sceneSignature: string;
  generatedAt: number;
}>;

export type SvieExecutiveRiskAttentionBuildInput = Readonly<{
  sceneJson?: unknown;
}>;

export const SVIE_EXECUTIVE_ATTENTION_PULSE_BY_TIER: Readonly<
  Record<
    Extract<SvieExecutiveAttentionTier, "top1" | "top3" | "top5">,
    Readonly<{ pulseMinIntensity: number; pulseMaxIntensity: number; pulseSpeed: number }>
  >
> = Object.freeze({
  top1: Object.freeze({ pulseMinIntensity: 0.34, pulseMaxIntensity: 0.62, pulseSpeed: 3.2 }),
  top3: Object.freeze({ pulseMinIntensity: 0.22, pulseMaxIntensity: 0.44, pulseSpeed: 2.7 }),
  top5: Object.freeze({ pulseMinIntensity: 0.12, pulseMaxIntensity: 0.26, pulseSpeed: 2.3 }),
});

export const DEFAULT_SVIE_EXECUTIVE_RISK_ATTENTION_SNAPSHOT: SvieExecutiveRiskAttentionSnapshot =
  Object.freeze({
    objects: Object.freeze([]),
    top1: Object.freeze([]),
    top3: Object.freeze([]),
    top5: Object.freeze([]),
    topObjectId: null,
    topScore: 0,
    objectCount: 0,
    sceneSignature: "svie:empty",
    generatedAt: 0,
  });
