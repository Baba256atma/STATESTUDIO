import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildObservedOutcomeAssessment } from "../decision/outcome/buildObservedOutcomeAssessment";
import { buildDecisionOutcomeFeedback } from "../decision/outcome/buildDecisionOutcomeFeedback";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildCollaborationState } from "../collaboration/buildCollaborationState";
import type { CollaborationInput } from "../collaboration/collaborationTypes";
import { buildOrgMemoryState } from "../org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../approval/buildApprovalWorkflowState";
import { buildAutonomousDecisionCouncilState } from "../council/buildAutonomousDecisionCouncilState";
import { buildDecisionExecutionIntent } from "../execution/buildDecisionExecutionIntent";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { StrategicCommandState } from "./strategicCommandTypes";
import { buildStrategicCommandAlerts } from "./buildStrategicCommandAlerts";
import { buildStrategicCommandExplanation } from "./buildStrategicCommandExplanation";
import { buildStrategicCommandNextMove } from "./buildStrategicCommandNextMove";
import { buildStrategicCommandPriority } from "./buildStrategicCommandPriority";
import { buildStrategicCommandRoutingHints } from "./buildStrategicCommandRoutingHints";

type BuildStrategicCommandStateInput = {
  responseData?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: any | null;
  memoryEntries?: DecisionMemoryEntry[];
  collaborationInputs?: CollaborationInput[];
  confidenceModel?: ReturnType<typeof buildDecisionConfidenceModel> | null;
  calibration?: ReturnType<typeof buildDecisionConfidenceCalibration> | null;
  outcomeFeedback?: ReturnType<typeof buildDecisionOutcomeFeedback> | null;
  metaDecision?: ReturnType<typeof buildMetaDecisionState> | null;
  teamDecision?: ReturnType<typeof buildTeamDecisionState> | null;
  collaborationState?: ReturnType<typeof buildCollaborationState> | null;
  orgMemory?: ReturnType<typeof buildOrgMemoryState> | null;
  policyState?: ReturnType<typeof buildDecisionPolicyState> | null;
  governanceState?: ReturnType<typeof buildDecisionGovernanceState> | null;
  approvalWorkflow?: ReturnType<typeof buildApprovalWorkflowState> | null;
  decisionCouncil?: ReturnType<typeof buildAutonomousDecisionCouncilState> | null;
};

function text(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function prettify(value: string) {
  return value.replace(/_/g, " ");
}

function dedupe(items: Array<string | null | undefined>, limit = 5): string[] {
  return Array.from(
    new Set(items.map((item) => text(item)).filter(Boolean))
  ).slice(0, limit);
}

export function buildStrategicCommandState(
  input: BuildStrategicCommandStateInput
): StrategicCommandState {
  const responseData = input.responseData ?? null;
  const canonicalRecommendation = input.canonicalRecommendation ?? null;
  const memoryEntries = input.memoryEntries ?? [];
  const executionIntent = buildDecisionExecutionIntent({
    source: "recommendation",
    canonicalRecommendation,
    responseData,
    decisionResult: input.decisionResult ?? null,
  });

  const confidenceModel =
    input.confidenceModel ??
    buildDecisionConfidenceModel({
      canonicalRecommendation,
      responseData,
      decisionResult: input.decisionResult ?? null,
    });
  const calibration =
    input.calibration ??
    buildDecisionConfidenceCalibration({
      canonicalRecommendation,
      confidenceModel,
      outcomeAssessment: buildDecisionOutcomeAssessment({
        canonicalRecommendation,
        responseData,
        decisionResult: input.decisionResult ?? null,
        memoryEntries,
      }),
      memoryEntries,
    });
  const outcomeFeedback =
    input.outcomeFeedback ??
    buildDecisionOutcomeFeedback({
      canonicalRecommendation,
      observedAssessment: buildObservedOutcomeAssessment({
        canonicalRecommendation,
        responseData,
        decisionResult: input.decisionResult ?? null,
        memoryEntries,
      }),
      memoryEntry: memoryEntries[0] ?? null,
      responseData,
    });
  const metaDecision =
    input.metaDecision ??
    buildMetaDecisionState({
      reasoning: responseData?.ai_reasoning ?? null,
      simulation: responseData?.decision_simulation ?? null,
      comparison: responseData?.decision_comparison ?? responseData?.comparison ?? null,
      canonicalRecommendation,
      calibration,
      responseData,
      memoryEntries,
    });
  const teamDecision =
    input.teamDecision ??
    buildTeamDecisionState({
      responseData,
      canonicalRecommendation,
      decisionResult: input.decisionResult ?? null,
      memoryEntries,
    });
  const collaborationState =
    input.collaborationState ??
    buildCollaborationState({
      canonicalRecommendation,
      decisionExecutionIntent: executionIntent,
      responseData,
      decisionResult: input.decisionResult ?? null,
      memoryEntries,
      collaborationInputs: input.collaborationInputs ?? [],
      teamDecisionState: teamDecision,
    });
  const orgMemory =
    input.orgMemory ??
    buildOrgMemoryState({
      memoryEntries,
      canonicalRecommendation,
    });
  const policyState =
    input.policyState ??
    buildDecisionPolicyState({
      canonicalRecommendation,
      decisionExecutionIntent: executionIntent,
      decisionResult: input.decisionResult ?? null,
      responseData,
      memoryEntries,
    });
  const governanceState =
    input.governanceState ??
    buildDecisionGovernanceState({
      canonicalRecommendation,
      decisionExecutionIntent: executionIntent,
      decisionResult: input.decisionResult ?? null,
      responseData,
      memoryEntries,
      orgMemoryState: orgMemory,
      teamDecisionState: teamDecision,
      metaDecisionState: metaDecision,
      policyState,
    });
  const approvalWorkflow =
    input.approvalWorkflow ??
    buildApprovalWorkflowState({
      canonicalRecommendation,
      decisionExecutionIntent: executionIntent,
      decisionGovernance: governanceState,
      decisionResult: input.decisionResult ?? null,
      responseData,
      memoryEntries,
      policyState,
    });
  const decisionCouncil =
    input.decisionCouncil ??
    buildAutonomousDecisionCouncilState({
      responseData,
      canonicalRecommendation,
      decisionResult: input.decisionResult ?? null,
      memoryEntries,
      collaborationInputs: input.collaborationInputs ?? [],
    });

  const recommendationAction = text(
    canonicalRecommendation?.primary?.action,
    responseData?.executive_summary_surface?.what_to_do ?? "No clear recommendation is available yet."
  );
  const orgWarning = orgMemory.relevant_signals[0]?.summary ?? orgMemory.current_decision_note ?? null;
  const councilReservation = decisionCouncil.consensus.main_reservations[0] ?? decisionCouncil.debate.unresolved_questions[0] ?? null;
  const { priority, reason: priorityReason } = buildStrategicCommandPriority({
    metaStrategy: metaDecision.selected_strategy,
    policyPosture: policyState.posture,
    governanceMode: governanceState.mode,
    approvalStatus: approvalWorkflow.status,
    confidenceLevel: confidenceModel.level,
    calibrationLabel: calibration.calibration_label,
    teamAlignment: teamDecision.alignment.alignment_level,
    collaborationAlignment: collaborationState.alignment.alignment_level,
    councilConsensus: decisionCouncil.consensus.consensus_level,
    councilReservation,
    orgWarning,
    outcomeStatus: outcomeFeedback.outcome_status,
  });

  const alerts = buildStrategicCommandAlerts({
    confidenceLevel: confidenceModel.level,
    calibrationLabel: calibration.calibration_label,
    policyPosture: policyState.posture,
    governanceMode: governanceState.mode,
    approvalStatus: approvalWorkflow.status,
    teamAlignment: teamDecision.alignment.alignment_level,
    collaborationAlignment: collaborationState.alignment.alignment_level,
    councilConsensus: decisionCouncil.consensus.consensus_level,
    councilReservation,
    orgWarning,
    outcomeStatus: outcomeFeedback.outcome_status,
  });

  const nextMove = buildStrategicCommandNextMove({
    priority,
    governanceMode: governanceState.mode,
    approvalStatus: approvalWorkflow.status,
    councilReservation,
    collaborationSignal:
      collaborationState.alignment.disagreement_points[0] ??
      collaborationState.alignment.unresolved_questions[0] ??
      null,
    teamSignal:
      teamDecision.alignment.disagreement_points[0] ??
      teamDecision.alignment.unresolved_questions[0] ??
      null,
    recommendationAction,
  });

  const routingHints = buildStrategicCommandRoutingHints({
    priority,
    governanceMode: governanceState.mode,
    approvalStatus: approvalWorkflow.status,
    councilConsensus: decisionCouncil.consensus.consensus_level,
    teamAlignment: teamDecision.alignment.alignment_level,
    collaborationAlignment: collaborationState.alignment.alignment_level,
    orgWarning,
  });

  const reviewFlags = dedupe([
    alerts[0]?.summary,
    governanceState.blocked_actions[0] ? `Blocked action: ${prettify(governanceState.blocked_actions[0])}` : null,
    approvalWorkflow.required && approvalWorkflow.status !== "approved"
      ? `Approval status: ${prettify(approvalWorkflow.status)}`
      : null,
    decisionCouncil.consensus.main_reservations[0],
    teamDecision.alignment.unresolved_questions[0],
    collaborationState.alignment.unresolved_questions[0],
  ]);

  const state: StrategicCommandState = {
    generated_at: Date.now(),
    headline:
      priority === "simulate"
        ? "Simulate before stronger action"
        : priority === "compare"
          ? "Compare before commitment"
          : priority === "approve"
            ? "Approval is now the primary blocker"
            : priority === "review"
              ? "Review posture remains active"
              : priority === "investigate"
                ? "Investigate before stronger action"
                : priority === "escalate"
                  ? "Escalate the decision now"
                  : priority === "stabilize"
                    ? "Stabilize before escalation"
                    : "Safe action is available",
    summary:
      responseData?.executive_summary_surface?.why_it_matters ??
      canonicalRecommendation?.reasoning?.why ??
      "Nexora is synthesizing recommendation, control, and review posture into one command view.",
    priority,
    priority_reason: priorityReason,
    alerts,
    command_recommendation: recommendationAction,
    command_confidence_note: `Confidence is ${confidenceModel.level}, calibration is ${prettify(calibration.calibration_label ?? "insufficient_feedback")}.`,
    command_governance_note: `Governance is currently ${prettify(governanceState.mode)}.`,
    command_approval_note:
      approvalWorkflow.required || approvalWorkflow.status !== "not_required"
        ? `Approval is ${prettify(approvalWorkflow.status)}${approvalWorkflow.requested_reviewer_role ? ` with ${prettify(approvalWorkflow.requested_reviewer_role)} review` : ""}.`
        : "Approval is not the active blocker right now.",
    next_move: nextMove.next_move,
    next_move_reason: nextMove.reason,
    routing_hints: routingHints,
    review_flags: reviewFlags,
    explanation: "",
  };

  return {
    ...state,
    explanation: buildStrategicCommandExplanation(state),
  };
}
