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
  canonicalRecommendation?: any | null;
  decisionExecutionIntent?: any | null;
  decisionGovernance?: any | null;
  decisionResult?: any | null;
  responseData?: any | null;
  memoryEntries?: any[];
  existingWorkflow?: ApprovalWorkflowState | null;
  policyState?: any | null;
};

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
    reasoning: input.responseData?.ai_reasoning ?? null,
    simulation: input.responseData?.decision_simulation ?? null,
    comparison: input.responseData?.decision_comparison ?? input.responseData?.comparison ?? null,
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
