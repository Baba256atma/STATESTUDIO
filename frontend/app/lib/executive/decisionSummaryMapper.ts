import type { StrategicCouncilResult } from "../council/strategicCouncilTypes";
import { buildCanonicalRecommendation } from "../decision/recommendation/buildCanonicalRecommendation";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { DecisionImpactState } from "../impact/decisionImpactTypes";
import type {
  ActionRecommendation,
  ActionRecommendationType,
  ActionUrgency,
  DecisionBrief,
  DecisionRiskLevel,
  ExpectedImpact,
  ValueFraming,
} from "./decisionSummaryTypes";

type DecisionBriefMapperInput = {
  fragility?: any | null;
  decisionImpact?: DecisionImpactState | null;
  strategicAdvice?: any | null;
  strategicCouncil?: StrategicCouncilResult | null;
  cockpitExecutive?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  promptFeedback?: any | null;
  decisionSimulation?: any | null;
  reply?: string | null;
  selectedObjectLabel?: string | null;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function labelFor(
  resolveObjectLabel: DecisionBriefMapperInput["resolveObjectLabel"],
  id: string | null | undefined,
  fallback = "System"
) {
  if (!id) return fallback;
  return resolveObjectLabel?.(id) ?? id;
}

function deriveRiskLevel(fragility: any): DecisionRiskLevel {
  const level = String(fragility?.level ?? "").trim().toLowerCase();
  if (level === "critical") return "critical";
  if (level === "high") return "high";
  if (level === "medium") return "medium";
  if (level === "low") return "low";
  const score = Number(fragility?.score ?? 0);
  if (score >= 0.85) return "critical";
  if (score >= 0.65) return "high";
  if (score >= 0.35) return "medium";
  return "low";
}

function deriveUrgency(riskLevel: DecisionRiskLevel): ActionUrgency {
  return riskLevel === "critical" || riskLevel === "high" ? "high" : riskLevel === "medium" ? "medium" : "low";
}

function inferActionType(actionTitle: string): ActionRecommendationType {
  const text = actionTitle.toLowerCase();
  if (/stabil|buffer|contain|phase/.test(text)) return "stabilize";
  if (/reduce|mitigat|hedge/.test(text)) return "reduce_risk";
  if (/protect|guard|shield/.test(text)) return "protect";
  if (/increase|expand|boost/.test(text)) return "increase";
  return "optimize";
}

function getConfidence(input: DecisionBriefMapperInput, canonicalRecommendation: CanonicalRecommendation | null) {
  return clamp01(
    Number(
      input.strategicCouncil?.synthesis?.confidence ??
        canonicalRecommendation?.confidence?.score ??
        input.decisionImpact?.meta?.confidence ??
        0.64
    )
  );
}

function deriveRecommendation(
  input: DecisionBriefMapperInput,
  riskLevel: DecisionRiskLevel,
  canonicalRecommendation: CanonicalRecommendation | null
): ActionRecommendation {
  const councilAction = String(input.strategicCouncil?.synthesis?.top_actions?.[0] ?? "").trim();
  const actionTitle =
    String(canonicalRecommendation?.primary?.action ?? "").trim() ||
    councilAction ||
    (riskLevel === "low" ? "Maintain monitoring cadence" : "Stabilize the primary pressure point");
  const targetObjectId =
    (Array.isArray(canonicalRecommendation?.primary?.target_ids)
      ? String(canonicalRecommendation?.primary?.target_ids?.[0] ?? "").trim()
      : "") ||
    input.decisionImpact?.source_object_id ||
    null;
  const reasoning =
    String(canonicalRecommendation?.reasoning?.why ?? "").trim() ||
    String(input.strategicCouncil?.synthesis?.summary ?? "").trim() ||
    (riskLevel === "low"
      ? "The current scene is stable enough to monitor without immediate intervention."
      : "This action reduces the strongest visible system pressure before it spreads.");

  return {
    action_title: actionTitle,
    target_object_id: targetObjectId,
    action_type: inferActionType(actionTitle),
    reasoning,
    urgency: deriveUrgency(riskLevel),
  };
}

function deriveExpectedImpact(
  input: DecisionBriefMapperInput,
  recommendation: ActionRecommendation,
  canonicalRecommendation: CanonicalRecommendation | null
): ExpectedImpact {
  const impact = input.decisionImpact;
  const strongestDownstream = impact?.nodes.find((node) => node.role === "downstream_risk") ?? null;
  const secondary = (impact?.nodes ?? [])
    .filter((node) => node.object_id !== strongestDownstream?.object_id && node.object_id !== impact?.source_object_id && node.role !== "context")
    .slice(0, 2)
    .map((node) => labelFor(input.resolveObjectLabel, node.object_id, "Connected node"));
  const sourceLabel = labelFor(input.resolveObjectLabel, impact?.source_object_id, input.selectedObjectLabel ?? "Current focus");
  const downstreamLabel = strongestDownstream
    ? labelFor(input.resolveObjectLabel, strongestDownstream.object_id, "downstream risk")
    : null;
  const primaryEffect =
    String(canonicalRecommendation?.primary?.impact_summary ?? "").trim() ||
    (downstreamLabel
      ? `${downstreamLabel} becomes less exposed as pressure is reduced at ${sourceLabel}.`
      : `Pressure is reduced around ${sourceLabel} with limited downstream disruption.`);
  const riskReduction =
    downstreamLabel || recommendation.action_type === "reduce_risk" || recommendation.action_type === "stabilize"
      ? "Reduces the likelihood of further downstream escalation."
      : undefined;
  const systemChangeSummary =
    impact?.edges?.[0]
      ? `${sourceLabel} changes first, then the strongest visible path shifts through ${labelFor(input.resolveObjectLabel, impact.edges[0].to_id, "connected operations")}.`
      : `The visible system effect remains concentrated around ${sourceLabel}.`;

  return {
    primary_effect: primaryEffect,
    secondary_effects: secondary,
    risk_reduction: riskReduction,
    system_change_summary: systemChangeSummary,
  };
}

function deriveValueFraming(
  recommendation: ActionRecommendation,
  expectedImpact: ExpectedImpact,
  riskLevel: DecisionRiskLevel
): ValueFraming {
  const riskReduction =
    expectedImpact.risk_reduction ??
    (riskLevel === "critical" || riskLevel === "high" ? "Reduced downstream disruption risk" : undefined);
  const efficiencyGain =
    recommendation.action_type === "stabilize" || recommendation.action_type === "optimize"
      ? "Improved operational stability across the affected flow"
      : undefined;
  const costAvoidance =
    riskLevel === "critical" || riskLevel === "high"
      ? "Avoids further loss escalation across connected operations"
      : recommendation.action_type === "protect"
      ? "Protects current operating performance without unnecessary intervention"
      : undefined;
  const qualitativeRoi =
    recommendation.action_type === "stabilize"
      ? "Creates a more predictable operating position before pressure compounds."
      : recommendation.action_type === "reduce_risk"
      ? "Contains downside exposure before it turns into a broader business constraint."
      : recommendation.action_type === "protect"
      ? "Protects continuity while preserving strategic flexibility."
      : "Improves decision quality by making the next operating move more controllable.";

  return {
    efficiency_gain: efficiencyGain,
    risk_reduction: riskReduction,
    cost_avoidance: costAvoidance,
    qualitative_roi: qualitativeRoi,
  };
}

export function mapDecisionBrief(input: DecisionBriefMapperInput): DecisionBrief {
  const riskLevel = deriveRiskLevel(input.fragility);
  const canonicalRecommendation =
    input.canonicalRecommendation ??
    buildCanonicalRecommendation({
      strategicAdvice: input.strategicAdvice,
      cockpitExecutive: input.cockpitExecutive,
      promptFeedback: input.promptFeedback,
      decisionSimulation: input.decisionSimulation,
      reply: input.reply,
      sourceHint: input.decisionSimulation ? "simulation" : input.strategicCouncil?.active ? "multi_agent" : null,
    });
  const confidence = getConfidence(input, canonicalRecommendation);
  const stableSystem = !input.decisionImpact?.active && riskLevel === "low";
  const sourceLabel = labelFor(
    input.resolveObjectLabel,
    input.decisionImpact?.source_object_id,
    input.selectedObjectLabel ?? "System"
  );
  const strongestDownstream = input.decisionImpact?.nodes.find((node) => node.role === "downstream_risk") ?? null;
  const problemLabel = strongestDownstream
    ? labelFor(input.resolveObjectLabel, strongestDownstream.object_id, "downstream risk")
    : sourceLabel;
  const situation =
    String(input.cockpitExecutive?.summary ?? "").trim() ||
    String(input.strategicCouncil?.synthesis?.headline ?? "").trim() ||
    String(input.decisionImpact?.action_label ?? "").trim() ||
    (stableSystem
      ? "System is currently stable."
      : `${sourceLabel} is the main pressure point in the current scene.`);
  const coreProblem =
    stableSystem
      ? "No critical action required."
      : strongestDownstream
      ? `${problemLabel} is the clearest downstream consequence of current pressure.`
      : `${sourceLabel} is carrying the most meaningful visible system pressure.`;
  const recommendation = deriveRecommendation(input, riskLevel, canonicalRecommendation);
  const expectedImpact = deriveExpectedImpact(input, recommendation, canonicalRecommendation);
  const valueFraming = deriveValueFraming(recommendation, expectedImpact, riskLevel);

  return {
    summary: {
      situation,
      core_problem: coreProblem,
      primary_object: sourceLabel,
      risk_level: riskLevel,
      confidence,
    },
    recommendation,
    canonical_recommendation: canonicalRecommendation,
    expected_impact: expectedImpact,
    value_framing: valueFraming,
    council_recommendation: input.strategicCouncil?.active
      ? String(
          input.strategicCouncil.synthesis.recommended_direction ||
            input.strategicCouncil.synthesis.summary ||
            ""
        ).trim() || null
      : null,
    stable_system: stableSystem,
  };
}
