import type { DecisionGovernanceState } from "./decisionGovernanceTypes";

export type DecisionGovernancePolicyContext = {
  decision_id?: string | null;
  risk_level: "low" | "medium" | "high";
  confidence_level: "low" | "medium" | "high";
  calibration_label?: string | null;
  outcome_status?: string | null;
  team_alignment: "high" | "moderate" | "low";
  org_warning: boolean;
  evidence_strength: "weak" | "moderate" | "strong";
  uncertainty_level: "low" | "medium" | "high";
  action_posture?: string | null;
  safe_environment: boolean;
  blocked_environment: boolean;
  current_action?: string | null;
};

type BuildDecisionGovernancePolicyInput = {
  canonicalRecommendation?: any | null;
  decisionExecutionIntent?: any | null;
  confidenceModel?: any | null;
  calibration?: any | null;
  outcomeFeedback?: any | null;
  metaDecision?: any | null;
  teamDecision?: any | null;
  orgMemory?: any | null;
  strategicLearning?: any | null;
  responseData?: any | null;
};

function riskLevelFromInput(input: BuildDecisionGovernancePolicyInput): DecisionGovernancePolicyContext["risk_level"] {
  const raw =
    String(
      input.responseData?.executive_summary_surface?.risk_level ??
        input.responseData?.fragility?.level ??
        input.responseData?.scene_json?.scene?.fragility?.level ??
        ""
    )
      .toLowerCase()
      .trim();
  if (raw.includes("critical") || raw.includes("high")) return "high";
  if (raw.includes("medium") || raw.includes("mod")) return "medium";
  return "low";
}

function evidenceStrength(input: BuildDecisionGovernancePolicyInput): DecisionGovernancePolicyContext["evidence_strength"] {
  if (input.metaDecision?.evidence_strength) return input.metaDecision.evidence_strength;
  const replayCount =
    (input.orgMemory?.related_refs ?? []).filter((ref: any) => ref?.replay_backed).length ??
    0;
  if (replayCount >= 3) return "strong";
  if (replayCount >= 1 || input.confidenceModel?.level === "medium") return "moderate";
  return "weak";
}

export function buildDecisionGovernancePolicy(
  input: BuildDecisionGovernancePolicyInput
): DecisionGovernancePolicyContext {
  const environmentFlags = [
    ...(input.responseData?.project_governance?.governance?.environment_flags ?? []),
    ...(input.responseData?.platform_assembly?.governance?.environment_flags ?? []),
  ].map((value: unknown) => String(value ?? "").toLowerCase());

  return {
    decision_id: input.canonicalRecommendation?.id ?? input.decisionExecutionIntent?.id ?? null,
    risk_level: riskLevelFromInput(input),
    confidence_level: input.confidenceModel?.level ?? input.canonicalRecommendation?.confidence?.level ?? "medium",
    calibration_label: input.calibration?.calibration_label ?? null,
    outcome_status: input.outcomeFeedback?.outcome_status ?? null,
    team_alignment: input.teamDecision?.alignment?.alignment_level ?? "moderate",
    org_warning: Boolean(
      input.orgMemory?.relevant_signals?.some((signal: any) =>
        signal?.category === "org_failure_pattern" ||
        signal?.category === "org_confidence_pattern" ||
        signal?.category === "org_learning_gap"
      ) || input.orgMemory?.recurring_failures?.length
    ),
    evidence_strength: evidenceStrength(input),
    uncertainty_level: input.metaDecision?.uncertainty_level ?? "medium",
    action_posture: input.metaDecision?.action_posture ?? null,
    safe_environment:
      environmentFlags.includes("safe_mode") ||
      environmentFlags.includes("preview_only"),
    blocked_environment: environmentFlags.includes("blocked") || environmentFlags.includes("freeze"),
    current_action: input.canonicalRecommendation?.primary?.action ?? input.decisionExecutionIntent?.action ?? null,
  };
}
