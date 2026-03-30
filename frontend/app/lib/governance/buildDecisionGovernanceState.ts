import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../decision/outcome/buildDecisionOutcomeFeedback";
import { buildObservedOutcomeAssessment } from "../decision/outcome/buildObservedOutcomeAssessment";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildOrgMemoryState } from "../org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../policy/buildDecisionPolicyState";
import type { DecisionPolicyState } from "../policy/decisionPolicyTypes";
import { buildDecisionGovernanceExplanation } from "./buildDecisionGovernanceExplanation";
import { buildDecisionGovernanceNextSteps } from "./buildDecisionGovernanceNextSteps";
import { buildDecisionGovernancePolicy } from "./buildDecisionGovernancePolicy";
import type { DecisionGovernanceState } from "./decisionGovernanceTypes";
import { evaluateDecisionGovernance } from "./evaluateDecisionGovernance";

type BuildDecisionGovernanceStateInput = {
  canonicalRecommendation?: any | null;
  decisionExecutionIntent?: any | null;
  decisionResult?: any | null;
  responseData?: any | null;
  memoryEntries?: any[];
  orgMemoryState?: any | null;
  teamDecisionState?: any | null;
  metaDecisionState?: any | null;
  policyState?: DecisionPolicyState | null;
};

const ACTIONS = ["preview", "simulate", "compare", "save", "apply"] as const;

function allowedActionsForMode(mode: DecisionGovernanceState["mode"]) {
  if (mode === "blocked") return ["save"];
  if (mode === "advisory_only") return ["save"];
  if (mode === "preview_only") return ["preview", "save"];
  if (mode === "simulation_allowed") return ["preview", "simulate", "compare", "save"];
  if (mode === "compare_required") return ["preview", "simulate", "compare", "save"];
  if (mode === "approval_required") return ["preview", "simulate", "compare", "save", "apply"];
  return ["preview", "simulate", "compare", "save", "apply"];
}

function posturePrecedence(mode: DecisionGovernanceState["mode"]) {
  const precedence: DecisionGovernanceState["mode"][] = [
    "advisory_only",
    "preview_only",
    "simulation_allowed",
    "compare_required",
    "approval_required",
    "executive_review_required",
    "blocked",
  ];
  return precedence.indexOf(mode);
}

function strengthenMode(
  currentMode: DecisionGovernanceState["mode"],
  nextMode: DecisionGovernanceState["mode"]
) {
  return posturePrecedence(nextMode) > posturePrecedence(currentMode) ? nextMode : currentMode;
}

export function buildDecisionGovernanceState(
  input: BuildDecisionGovernanceStateInput
): DecisionGovernanceState {
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    responseData: input.responseData ?? null,
    decisionResult: input.decisionResult ?? null,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    confidenceModel,
    outcomeAssessment: buildDecisionOutcomeAssessment({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      responseData: input.responseData ?? null,
      decisionResult: input.decisionResult ?? null,
      memoryEntries: input.memoryEntries ?? [],
    }),
    memoryEntries: input.memoryEntries ?? [],
  });
  const outcomeFeedback = buildDecisionOutcomeFeedback({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    observedAssessment: buildObservedOutcomeAssessment({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      responseData: input.responseData ?? null,
      decisionResult: input.decisionResult ?? null,
      memoryEntries: input.memoryEntries ?? [],
    }),
    memoryEntry: input.memoryEntries?.[0] ?? null,
    responseData: input.responseData ?? null,
  });
  const metaDecision =
    input.metaDecisionState ??
    buildMetaDecisionState({
      reasoning: input.responseData?.ai_reasoning ?? null,
      simulation: input.responseData?.decision_simulation ?? null,
      comparison: input.responseData?.decision_comparison ?? input.responseData?.comparison ?? null,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      calibration,
      responseData: input.responseData ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });
  const teamDecision =
    input.teamDecisionState ??
    buildTeamDecisionState({
      responseData: input.responseData ?? null,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionResult: input.decisionResult ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });
  const strategicLearning = buildStrategicLearningState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const orgMemory =
    input.orgMemoryState ??
    buildOrgMemoryState({
      memoryEntries: input.memoryEntries ?? [],
      canonicalRecommendation: input.canonicalRecommendation ?? null,
    });
  const policyState =
    input.policyState ??
    buildDecisionPolicyState({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionExecutionIntent: input.decisionExecutionIntent ?? null,
      decisionResult: input.decisionResult ?? null,
      responseData: input.responseData ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });

  const context = buildDecisionGovernancePolicy({
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    decisionExecutionIntent: input.decisionExecutionIntent ?? null,
    confidenceModel,
    calibration,
    outcomeFeedback,
    metaDecision,
    teamDecision,
    orgMemory,
    strategicLearning,
    responseData: input.responseData ?? null,
  });
  const evaluation = evaluateDecisionGovernance(context);
  let mode = evaluation.mode;
  if (policyState.posture === "restricted") {
    mode = strengthenMode(mode, context.blocked_environment ? "blocked" : "preview_only");
  } else if (policyState.posture === "executive_review") {
    mode = strengthenMode(mode, "executive_review_required");
  } else if (policyState.posture === "approval_gated") {
    mode = strengthenMode(mode, "approval_required");
  } else if (policyState.posture === "compare_first") {
    mode = strengthenMode(mode, "compare_required");
  } else if (policyState.posture === "simulation_first") {
    mode = strengthenMode(mode, "simulation_allowed");
  } else if (policyState.posture === "guarded" && mode === "advisory_only") {
    mode = "preview_only";
  }

  const rule_evaluations: DecisionGovernanceState["rule_evaluations"] = [
    {
      id: "policy_posture_alignment",
      label: "Policy posture aligns with governance",
      passed: policyState.posture === "permissive",
      summary:
        policyState.posture === "permissive"
          ? "Policy does not require a stronger governance posture."
          : `Policy is guiding governance toward ${policyState.posture.replace(/_/g, " ")} handling.`,
      severity:
        policyState.posture === "restricted" || policyState.posture === "executive_review"
          ? "high"
          : "medium",
    },
    ...evaluation.rule_evaluations,
  ];
  const allowed_actions = allowedActionsForMode(mode);
  const blocked_actions = ACTIONS.filter((action) => !allowed_actions.includes(action));

  return {
    decision_id: context.decision_id,
    mode,
    approval: {
      required:
        evaluation.approval_required ||
        policyState.posture === "approval_gated" ||
        policyState.posture === "executive_review",
      approver_role:
        policyState.posture === "executive_review"
          ? "executive"
          : evaluation.approver_role,
      reason:
        policyState.posture === "executive_review"
          ? "Policy requires executive review before stronger action."
          : policyState.posture === "approval_gated"
            ? "Policy requires approval before stronger action."
            : evaluation.approval_required
        ? mode === "executive_review_required"
          ? "High-stakes decisions require executive review before stronger action."
          : "Current confidence and evidence require approval before stronger action."
        : null,
    },
    escalation_required:
      evaluation.escalation_required || policyState.posture === "executive_review",
    escalation_reason:
      policyState.posture === "executive_review"
        ? "Policy posture requires executive review before the decision can move forward."
        : evaluation.escalation_reason,
    allowed_actions,
    blocked_actions,
    rule_evaluations,
    explanation: buildDecisionGovernanceExplanation({
      mode,
      context,
    }),
    next_steps: buildDecisionGovernanceNextSteps({
      mode,
      context,
    }),
  };
}
