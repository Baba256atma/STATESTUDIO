
import type { DecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import type { StrategicLearningState } from "../decision/learning/strategicLearningTypes";
import type { MetaDecisionState } from "../decision/meta/metaDecisionTypes";
import type { DecisionOutcomeFeedback } from "../decision/outcome/decisionOutcomeTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { DecisionExecutionIntent } from "../execution/decisionExecutionIntent";
import type { OrgMemoryEntryRef, OrgMemorySignal, OrgMemoryState } from "../org-memory/orgMemoryTypes";
import type { TeamDecisionState } from "../team/teamDecisionTypes";

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

type CalibrationSlice = {
  calibration_label?: string | null;
};

type BuildDecisionGovernancePolicyInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionExecutionIntent?: DecisionExecutionIntent | null;
  confidenceModel?: DecisionConfidenceModel | null;
  calibration?: CalibrationSlice | null;
  outcomeFeedback?: DecisionOutcomeFeedback | null;
  metaDecision?: MetaDecisionState | null;
  teamDecision?: TeamDecisionState | null;
  orgMemory?: OrgMemoryState | null;
  strategicLearning?: StrategicLearningState | null;
  responseData?: Record<string, unknown> | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readNestedString(record: Record<string, unknown> | null | undefined, ...keys: string[]): string {
  let current: unknown = record;
  for (const key of keys) {
    current = asRecord(current)?.[key];
  }
  return String(current ?? "")
    .toLowerCase()
    .trim();
}

function riskLevelFromInput(input: BuildDecisionGovernancePolicyInput): DecisionGovernancePolicyContext["risk_level"] {
  const raw = readNestedString(
    input.responseData,
    "executive_summary_surface",
    "risk_level"
  ) ||
    readNestedString(input.responseData, "fragility", "level") ||
    readNestedString(input.responseData, "scene_json", "scene", "fragility", "level");
  if (raw.includes("critical") || raw.includes("high")) return "high";
  if (raw.includes("medium") || raw.includes("mod")) return "medium";
  return "low";
}

function evidenceStrength(input: BuildDecisionGovernancePolicyInput): DecisionGovernancePolicyContext["evidence_strength"] {
  if (input.metaDecision?.evidence_strength) return input.metaDecision.evidence_strength;
  const replayCount =
    (input.orgMemory?.related_refs ?? []).filter((ref: OrgMemoryEntryRef) => ref?.replay_backed).length ?? 0;
  if (replayCount >= 3) return "strong";
  if (replayCount >= 1 || input.confidenceModel?.level === "medium") return "moderate";
  return "weak";
}

function isOrgWarningSignal(signal: OrgMemorySignal): boolean {
  return (
    signal?.category === "org_failure_pattern" ||
    signal?.category === "org_confidence_pattern" ||
    signal?.category === "org_learning_gap"
  );
}

export function buildDecisionGovernancePolicy(
  input: BuildDecisionGovernancePolicyInput
): DecisionGovernancePolicyContext {
  const projectGovernance = asRecord(input.responseData?.project_governance);
  const platformAssembly = asRecord(input.responseData?.platform_assembly);
  const environmentFlags = [
    ...(Array.isArray(asRecord(projectGovernance?.governance)?.environment_flags)
      ? (asRecord(projectGovernance?.governance)?.environment_flags as unknown[])
      : []),
    ...(Array.isArray(asRecord(platformAssembly?.governance)?.environment_flags)
      ? (asRecord(platformAssembly?.governance)?.environment_flags as unknown[])
      : []),
  ].map((value: unknown) => String(value ?? "").toLowerCase());

  return {
    decision_id: input.canonicalRecommendation?.id ?? input.decisionExecutionIntent?.id ?? null,
    risk_level: riskLevelFromInput(input),
    confidence_level: input.confidenceModel?.level ?? input.canonicalRecommendation?.confidence?.level ?? "medium",
    calibration_label: input.calibration?.calibration_label ?? null,
    outcome_status: input.outcomeFeedback?.outcome_status ?? null,
    team_alignment: input.teamDecision?.alignment?.alignment_level ?? "moderate",
    org_warning: Boolean(
      input.orgMemory?.relevant_signals?.some(isOrgWarningSignal) || input.orgMemory?.recurring_failures?.length
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
