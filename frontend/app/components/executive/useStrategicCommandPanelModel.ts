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
  responseData?: unknown;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: unknown;
  memoryEntries?: DecisionMemoryEntry[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

/** Shared derived state for Strategic Command preview + full workspace (same inputs as legacy panel). */
export function useStrategicCommandPanelModel(props: StrategicCommandPanelModelProps): StrategicCommandState {
  const memoryEntries = props.memoryEntries ?? [];
  const responseRecord = asRecord(props.responseData);
  const decisionResultRecord = asRecord(props.decisionResult);
  // Keep asRecord inside this memo so deps match the values the Compiler sees (preserve-manual-memoization).
  const executionIntent = React.useMemo(
    () =>
      buildDecisionExecutionIntent({
        source: "recommendation",
        canonicalRecommendation: props.canonicalRecommendation ?? null,
        responseData: asRecord(props.responseData),
        decisionResult: asRecord(props.decisionResult),
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
    responseData: responseRecord,
    decisionResult: decisionResultRecord,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    confidenceModel,
    outcomeAssessment: buildDecisionOutcomeAssessment({
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: responseRecord,
      decisionResult: decisionResultRecord,
      memoryEntries,
    }),
    memoryEntries,
  });
  const outcomeFeedback = buildDecisionOutcomeFeedback({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    observedAssessment: buildObservedOutcomeAssessment({
      canonicalRecommendation: props.canonicalRecommendation ?? null,
      responseData: responseRecord,
      decisionResult: decisionResultRecord,
      memoryEntries,
    }),
    memoryEntry: memoryEntries[0] ?? null,
    responseData: responseRecord,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: asRecord(responseRecord?.ai_reasoning),
    simulation: asRecord(responseRecord?.decision_simulation),
    comparison: asRecord(responseRecord?.decision_comparison ?? responseRecord?.comparison),
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    calibration,
    responseData: responseRecord,
    memoryEntries,
  });
  const teamDecision = buildTeamDecisionState({
    responseData: responseRecord,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: decisionResultRecord,
    memoryEntries,
  });
  const collaborationState = buildCollaborationState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    responseData: responseRecord,
    decisionResult: decisionResultRecord,
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
    decisionResult: decisionResultRecord,
    responseData: responseRecord,
    memoryEntries,
  });
  const governanceState = buildDecisionGovernanceState({
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionExecutionIntent: executionIntent,
    decisionResult: decisionResultRecord,
    responseData: responseRecord,
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
    decisionResult: decisionResultRecord,
    responseData: responseRecord,
    memoryEntries,
    policyState,
  });
  const decisionCouncil = buildAutonomousDecisionCouncilState({
    responseData: responseRecord,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: decisionResultRecord,
    memoryEntries,
    collaborationInputs: collaborationEnvelope?.inputs ?? [],
  });

  return buildStrategicCommandState({
    responseData: responseRecord,
    canonicalRecommendation: props.canonicalRecommendation ?? null,
    decisionResult: decisionResultRecord,
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
