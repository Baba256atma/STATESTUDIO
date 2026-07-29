import { buildDecisionExecutionIntent } from "../execution/buildDecisionExecutionIntent";
import { buildDecisionGovernanceState } from "../governance/buildDecisionGovernanceState";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildOrgMemoryState } from "../org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../policy/buildDecisionPolicyState";
import { buildApprovalRequirement } from "./buildApprovalRequirement";
import { evaluateApprovalWorkflow } from "./evaluateApprovalWorkflow";
import { buildApprovalWorkflowExplanation } from "./buildApprovalWorkflowExplanation";
import { buildApprovalWorkflowNextSteps } from "./buildApprovalWorkflowNextSteps";
import type { ApprovalWorkflowState } from "./approvalWorkflowTypes";

type BuildApprovalWorkflowStateInput = {
  canonicalRecommendation?: import("../decision/recommendation/recommendationTypes").CanonicalRecommendation | null;
  decisionExecutionIntent?: import("../execution/decisionExecutionIntent").DecisionExecutionIntent | null;
  decisionGovernance?: import("../governance/decisionGovernanceTypes").DecisionGovernanceState | null;
  decisionResult?: Record<string, unknown> | null;
  responseData?: Record<string, unknown> | null;
  memoryEntries?: import("../decision/memory/decisionMemoryTypes").DecisionMemoryEntry[];
  existingWorkflow?: ApprovalWorkflowState | null;
  policyState?: import("../policy/decisionPolicyTypes").DecisionPolicyState | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export function buildApprovalWorkflowState(
  input: BuildApprovalWorkflowStateInput
): ApprovalWorkflowState {
  const intent =
    input.decisionExecutionIntent ??
    buildDecisionExecutionIntent({
      source: "recommendation",
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      responseData: input.responseData ?? null,
      decisionResult: input.decisionResult ?? null,
    });
  const metaDecision = buildMetaDecisionState({
    reasoning: asRecord(input.responseData?.ai_reasoning),
    simulation: asRecord(input.responseData?.decision_simulation),
    comparison:
      asRecord(input.responseData?.decision_comparison) ?? asRecord(input.responseData?.comparison),
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    calibration: null,
    responseData: input.responseData ?? null,
    memoryEntries: input.memoryEntries ?? [],
  });
  const teamDecision = buildTeamDecisionState({
    responseData: input.responseData ?? null,
    canonicalRecommendation: input.canonicalRecommendation ?? null,
    decisionResult: input.decisionResult ?? null,
    memoryEntries: input.memoryEntries ?? [],
  });
  const orgMemory = buildOrgMemoryState({
    memoryEntries: input.memoryEntries ?? [],
    canonicalRecommendation: input.canonicalRecommendation ?? null,
  });
  const governance =
    input.decisionGovernance ??
    buildDecisionGovernanceState({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionExecutionIntent: intent,
      decisionResult: input.decisionResult ?? null,
      responseData: input.responseData ?? null,
      memoryEntries: input.memoryEntries ?? [],
      orgMemoryState: orgMemory,
      teamDecisionState: teamDecision,
      metaDecisionState: metaDecision,
      policyState: input.policyState ?? null,
    });
  const policyState =
    input.policyState ??
    buildDecisionPolicyState({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionExecutionIntent: intent,
      decisionResult: input.decisionResult ?? null,
      responseData: input.responseData ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });
  const requirement = buildApprovalRequirement({
    governanceState: governance,
    decisionExecutionIntent: intent,
    teamDecisionState: teamDecision,
    orgMemoryState: orgMemory,
    metaDecisionState: metaDecision,
    policyState,
  });
  const evaluated = evaluateApprovalWorkflow({
    decisionId: governance.decision_id ?? intent?.id ?? null,
    requirement,
    decisions: input.existingWorkflow?.decisions ?? [],
  });
  const explanation = buildApprovalWorkflowExplanation(evaluated);
  const nextSteps = buildApprovalWorkflowNextSteps(evaluated);

  return {
    ...evaluated,
    explanation,
    next_steps: nextSteps,
  };
}
