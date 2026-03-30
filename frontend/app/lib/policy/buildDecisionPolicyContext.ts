export type DecisionPolicyContext = {
  decision_id?: string | null;
  current_action?: string | null;
  risk_level: "low" | "medium" | "high";
  confidence_level: "low" | "medium" | "high";
  calibration_label?: string | null;
  team_alignment: "high" | "moderate" | "low";
  org_warning: boolean;
  org_gap: boolean;
  evidence_strength: "weak" | "moderate" | "strong";
  uncertainty_level: "low" | "medium" | "high";
  safe_environment: boolean;
  blocked_environment: boolean;
  downstream_exposure: "low" | "medium" | "high";
  target_count: number;
};

type BuildDecisionPolicyContextInput = {
  canonicalRecommendation?: any | null;
  decisionExecutionIntent?: any | null;
  confidenceModel?: any | null;
  calibration?: any | null;
  metaDecision?: any | null;
  teamDecision?: any | null;
  orgMemory?: any | null;
  strategicLearning?: any | null;
  responseData?: any | null;
};

function riskLevel(input: BuildDecisionPolicyContextInput): DecisionPolicyContext["risk_level"] {
  const raw = String(
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

export function buildDecisionPolicyContext(
  input: BuildDecisionPolicyContextInput
): DecisionPolicyContext {
  const environmentFlags = [
    ...(input.responseData?.project_governance?.governance?.environment_flags ?? []),
    ...(input.responseData?.platform_assembly?.governance?.environment_flags ?? []),
  ].map((value: unknown) => String(value ?? "").toLowerCase());
  const targetCount =
    (input.decisionExecutionIntent?.target_ids?.length ??
      input.canonicalRecommendation?.primary?.target_ids?.length ??
      0);
  const affectedDimensions =
    input.responseData?.decision_simulation?.risk?.affectedDimensions?.length ?? 0;
  const replayBackedRefs =
    (input.orgMemory?.related_refs ?? []).filter((ref: any) => ref?.replay_backed).length ?? 0;

  return {
    decision_id: input.canonicalRecommendation?.id ?? input.decisionExecutionIntent?.id ?? null,
    current_action:
      input.canonicalRecommendation?.primary?.action ??
      input.decisionExecutionIntent?.action ??
      null,
    risk_level: riskLevel(input),
    confidence_level:
      input.confidenceModel?.level ??
      input.canonicalRecommendation?.confidence?.level ??
      "medium",
    calibration_label: input.calibration?.calibration_label ?? null,
    team_alignment: input.teamDecision?.alignment?.alignment_level ?? "moderate",
    org_warning: Boolean(
      input.orgMemory?.relevant_signals?.some((signal: any) =>
        signal?.category === "org_failure_pattern" ||
        signal?.category === "org_confidence_pattern"
      ) || input.orgMemory?.recurring_failures?.length
    ),
    org_gap: Boolean(
      input.orgMemory?.relevant_signals?.some((signal: any) => signal?.category === "org_learning_gap")
    ),
    evidence_strength:
      input.metaDecision?.evidence_strength ??
      (replayBackedRefs >= 3 ? "strong" : replayBackedRefs >= 1 ? "moderate" : "weak"),
    uncertainty_level: input.metaDecision?.uncertainty_level ?? "medium",
    safe_environment:
      environmentFlags.includes("safe_mode") || environmentFlags.includes("preview_only"),
    blocked_environment:
      environmentFlags.includes("blocked") || environmentFlags.includes("freeze"),
    downstream_exposure:
      affectedDimensions >= 3 || targetCount >= 5
        ? "high"
        : affectedDimensions >= 1 || targetCount >= 2
          ? "medium"
          : "low",
    target_count: targetCount,
  };
}
