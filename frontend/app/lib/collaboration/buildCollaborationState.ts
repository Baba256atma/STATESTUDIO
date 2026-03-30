import { buildDecisionGovernanceState } from "../governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../approval/buildApprovalWorkflowState";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildCollaboratorPerspective } from "./buildCollaboratorPerspective";
import { buildCollaborationAlignment } from "./buildCollaborationAlignment";
import { buildCollaborationDecisionDelta } from "./buildCollaborationDecisionDelta";
import { buildCollaborationNextSteps } from "./buildCollaborationNextSteps";
import type {
  CollaborationInput,
  CollaborationState,
  CollaboratorPerspective,
} from "./collaborationTypes";

type BuildCollaborationStateInput = {
  canonicalRecommendation?: any | null;
  decisionExecutionIntent?: any | null;
  responseData?: any | null;
  decisionResult?: any | null;
  memoryEntries?: any[];
  collaborationInputs?: CollaborationInput[];
  teamDecisionState?: any | null;
  governanceState?: any | null;
  approvalWorkflowState?: any | null;
};

function clean(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

export function buildCollaborationState(
  input: BuildCollaborationStateInput
): CollaborationState {
  const collaborationInputs = [...(input.collaborationInputs ?? [])].sort((a, b) => b.timestamp - a.timestamp);
  const teamDecision =
    input.teamDecisionState ??
    buildTeamDecisionState({
      responseData: input.responseData ?? null,
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionResult: input.decisionResult ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });
  const governance =
    input.governanceState ??
    buildDecisionGovernanceState({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionExecutionIntent: input.decisionExecutionIntent ?? null,
      decisionResult: input.decisionResult ?? null,
      responseData: input.responseData ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });
  const approval =
    input.approvalWorkflowState ??
    buildApprovalWorkflowState({
      canonicalRecommendation: input.canonicalRecommendation ?? null,
      decisionExecutionIntent: input.decisionExecutionIntent ?? null,
      decisionGovernance: governance,
      decisionResult: input.decisionResult ?? null,
      responseData: input.responseData ?? null,
      memoryEntries: input.memoryEntries ?? [],
    });

  const grouped = new Map<string, CollaborationInput[]>();
  collaborationInputs.forEach((entry) => {
    const key = `${entry.user_id}:${entry.role}`;
    grouped.set(key, [...(grouped.get(key) ?? []), entry]);
  });

  const contributors: CollaboratorPerspective[] = Array.from(grouped.entries()).map(([, entries]) =>
    buildCollaboratorPerspective({
      userId: entries[0].user_id,
      userLabel: entries[0].user_label,
      role: entries[0].role,
      inputs: entries,
      sharedRecommendation:
        input.canonicalRecommendation?.primary?.action ?? teamDecision.shared_recommendation,
      teamNextMove: teamDecision.team_next_move,
    })
  );

  const alignment = buildCollaborationAlignment({
    perspectives: contributors,
    inputs: collaborationInputs,
    teamDecisionState: teamDecision,
    governanceState: governance,
    approvalWorkflowState: approval,
  });
  const decisionDelta = buildCollaborationDecisionDelta({
    sharedRecommendation:
      clean(input.canonicalRecommendation?.primary?.action) || teamDecision.shared_recommendation,
    inputs: collaborationInputs,
    perspectives: contributors,
    teamDecisionState: teamDecision,
    governanceState: governance,
    approvalWorkflowState: approval,
  });

  return {
    decision_id:
      clean(input.canonicalRecommendation?.id) ||
      clean(teamDecision.decision_id, `collaboration_${Date.now().toString(36)}`),
    generated_at: Date.now(),
    shared_recommendation:
      clean(input.canonicalRecommendation?.primary?.action) ||
      teamDecision.shared_recommendation ||
      "No shared recommendation is available yet.",
    contributors,
    inputs: collaborationInputs,
    alignment,
    decision_delta: decisionDelta,
    next_steps: buildCollaborationNextSteps({
      alignment,
      inputs: collaborationInputs,
      teamDecisionState: teamDecision,
      governanceState: governance,
      approvalWorkflowState: approval,
    }),
  };
}
