"use client";

import React from "react";

import { buildDecisionConfidenceModel } from "../../lib/decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../../lib/decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../../lib/decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildObservedOutcomeAssessment } from "../../lib/decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../../lib/decision/outcome/buildDecisionOutcomeFeedback";
import { buildMetaDecisionState } from "../../lib/decision/meta/buildMetaDecisionState";
import { buildTeamDecisionState } from "../../lib/team/buildTeamDecisionState";
import { loadCollaborationEnvelope } from "../../lib/collaboration/collaborationStore";
import { buildCollaborationState } from "../../lib/collaboration/buildCollaborationState";
import { buildAutonomousDecisionCouncilState } from "../../lib/council/buildAutonomousDecisionCouncilState";
import { buildOrgMemoryState } from "../../lib/org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../../lib/policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../../lib/governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../../lib/approval/buildApprovalWorkflowState";
import { buildDecisionExecutionIntent } from "../../lib/execution/buildDecisionExecutionIntent";
import { buildStrategicCommandState } from "../../lib/command/buildStrategicCommandState";
import type { DecisionMemoryEntry } from "../../lib/decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../../lib/decision/recommendation/recommendationTypes";
import type { StrategicCommandState } from "../../lib/command/strategicCommandTypes";

export type StrategicCommandPanelModelProps = {
  workspaceId?: string | null;
  projectId?: string | null;
  responseData?: any;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any;
  memoryEntries?: DecisionMemoryEntry[];
};

/** Shared derived state for Strategic Command preview + full workspace (same inputs as legacy panel). */
export function useStrategicCommandPanelModel(props: StrategicCommandPanelModelProps): StrategicCommandState {
  const memoryEntries = props.memoryEntries ?? [];
  const executionIntent = React.useMemo(
    () =>
      buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: props.responseData ?? null,
        decisionResult: props.decisionResult ?? null,
      }),
    [props.canonicalRecommendation, props.responseData, props.decisionResult]
  );
  const decisionId = executionIntent?.id ?? props.canonicalRecommendation?.id ?? null;
  const collaborationEnvelope = React.useMemo(
    () =>
      loadCollaborationEnvelope(props.workspaceId ?? null, props.projectId ?? null, decisionId),
    [props.workspaceId, props.projectId, decisionId]
  );
  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    responseData: props.responseData ?? null,
    decisionResult: props.decisionResult ?? null,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    confidenceModel,
    outcomeAssessment: buildDecisionOutcomeAssessment({
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: props.responseData ?? null,
      decisionResult: props.decisionResult ?? null,
      memoryEntries,
    }),
    memoryEntries,
  });
  const outcomeFeedback = buildDecisionOutcomeFeedback({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    observedAssessment: buildObservedOutcomeAssessment({
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: props.responseData ?? null,
      decisionResult: props.decisionResult ?? null,
      memoryEntries,
    }),
    memoryEntry: memoryEntries[0] ?? null,
    responseData: props.responseData ?? null,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: props.responseData?.ai_reasoning ?? null,
    simulation: props.responseData?.decision_simulation ?? null,
    comparison: props.responseData?.decision_comparison ?? props.responseData?.comparison ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    calibration,
    responseData: props.responseData ?? null,
    memoryEntries,
  });
  const teamDecision = buildTeamDecisionState({
    responseData: props.responseData ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
  });
  const collaborationState = buildCollaborationState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    responseData: props.responseData ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
    teamDecisionState: teamDecision,
  });
  const orgMemory = buildOrgMemoryState({
    memoryEntries,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
  });
  const policyState = buildDecisionPolicyState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries,
  });
  const governanceState = buildDecisionGovernanceState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries,
    orgMemoryState: orgMemory,
    teamDecisionState: teamDecision,
    metaDecisionState: metaDecision,
    policyState,
  });
  const approvalWorkflow = buildApprovalWorkflowState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionGovernance: governanceState,
    decisionResult: props.decisionResult ?? null,
    responseData: props.responseData ?? null,
    memoryEntries,
    policyState,
  });
  const decisionCouncil = buildAutonomousDecisionCouncilState({
    responseData: props.responseData ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
  });

  return buildStrategicCommandState({
    responseData: props.responseData ?? null,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: props.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
    confidenceModel,
    calibration,
    outcomeFeedback,
    metaDecision,
    teamDecision,
    collaborationState,
    orgMemory,
    policyState,
    governanceState,
    approvalWorkflow,
    decisionCouncil,
  });
}
