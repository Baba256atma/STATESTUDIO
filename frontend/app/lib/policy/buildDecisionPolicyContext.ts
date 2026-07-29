import type { DecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import type { StrategicLearningState } from "../decision/learning/strategicLearningTypes";
import type { MetaDecisionState } from "../decision/meta/metaDecisionTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { DecisionExecutionIntent } from "../execution/decisionExecutionIntent";
import type { OrgMemoryEntryRef, OrgMemorySignal, OrgMemoryState } from "../org-memory/orgMemoryTypes";
import type { TeamDecisionState } from "../team/teamDecisionTypes";

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

type CalibrationSlice = {
  calibration_label?: string | null;
};

type BuildDecisionPolicyContextInput = {
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionExecutionIntent?: DecisionExecutionIntent | null;
  confidenceModel?: DecisionConfidenceModel | null;
  calibration?: CalibrationSlice | null;
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

function riskLevel(input: BuildDecisionPolicyContextInput): DecisionPolicyContext["risk_level"] {
  const raw =
    readNestedString(input.responseData, "executive_summary_surface", "risk_level") ||
    readNestedString(input.responseData, "fragility", "level") ||
    readNestedString(input.responseData, "scene_json", "scene", "fragility", "level");
  if (raw.includes("critical") || raw.includes("high")) return "high";
  if (raw.includes("medium") || raw.includes("mod")) return "medium";
  return "low";
}

function isOrgWarningSignal(signal: OrgMemorySignal): boolean {
  return signal?.category === "org_failure_pattern" || signal?.category === "org_confidence_pattern";
}

function isOrgGapSignal(signal: OrgMemorySignal): boolean {
  return signal?.category === "org_learning_gap";
}

export function buildDecisionPolicyContext(
  input: BuildDecisionPolicyContextInput
): DecisionPolicyContext {
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
  const targetCount =
    input.decisionExecutionIntent?.target_ids?.length ??
    input.canonicalRecommendation?.primary?.target_ids?.length ??
    0;
  const decisionSimulation = asRecord(input.responseData?.decision_simulation);
  const simulationRisk = asRecord(decisionSimulation?.risk);
  const affectedDimensions = Array.isArray(simulationRisk?.affectedDimensions)
    ? simulationRisk.affectedDimensions.length
    : 0;
  const replayBackedRefs =
    (input.orgMemory?.related_refs ?? []).filter((ref: OrgMemoryEntryRef) => ref?.replay_backed).length ?? 0;

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
      input.orgMemory?.relevant_signals?.some(isOrgWarningSignal) || input.orgMemory?.recurring_failures?.length
    ),
    org_gap: Boolean(input.orgMemory?.relevant_signals?.some(isOrgGapSignal)),
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
