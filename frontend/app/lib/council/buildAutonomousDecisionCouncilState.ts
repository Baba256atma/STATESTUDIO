import { buildDecisionConfidenceModel } from "../decision/confidence/buildDecisionConfidenceModel";
import { buildDecisionConfidenceCalibration } from "../decision/confidence/calibration/buildDecisionConfidenceCalibration";
import { buildDecisionOutcomeAssessment } from "../decision/confidence/calibration/buildDecisionOutcomeAssessment";
import { buildDecisionPatternIntelligence } from "../decision/patterns/buildDecisionPatternIntelligence";
import { buildStrategicLearningState } from "../decision/learning/buildStrategicLearningState";
import { buildMetaDecisionState } from "../decision/meta/buildMetaDecisionState";
import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import { buildDecisionExecutionIntent } from "../execution/buildDecisionExecutionIntent";
import { buildTeamDecisionState } from "../team/buildTeamDecisionState";
import { buildCollaborationState } from "../collaboration/buildCollaborationState";
import type { CollaborationInput } from "../collaboration/collaborationTypes";
import { buildOrgMemoryState } from "../org-memory/buildOrgMemoryState";
import { buildDecisionPolicyState } from "../policy/buildDecisionPolicyState";
import { buildDecisionGovernanceState } from "../governance/buildDecisionGovernanceState";
import { buildApprovalWorkflowState } from "../approval/buildApprovalWorkflowState";
import { buildCouncilDebateState } from "./buildCouncilDebateState";
import { buildCouncilExplanation } from "./buildCouncilExplanation";
import { buildCouncilRolePerspective } from "./buildCouncilRolePerspective";
import { buildCouncilConsensus } from "./buildCouncilConsensus";
import type {
  AutonomousDecisionCouncilState,
  CouncilRole,
} from "./councilTypes";

type BuildAutonomousDecisionCouncilStateInput = {
  responseData?: unknown | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: unknown | null;
  memoryEntries?: DecisionMemoryEntry[];
  collaborationInputs?: CollaborationInput[];
};

const COUNCIL_ROLES: CouncilRole[] = [
  "strategist",
  "risk_officer",
  "operator",
  "financial_reviewer",
  "skeptic",
];

type LooseRecord = Record<string, unknown>;

function text(value: unknown, fallback = "") {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized || fallback;
}

function list(values: unknown, limit = 3): string[] {
  if (!Array.isArray(values)) return [];
  return Array.from(
    new Set(values.map((value) => text(value)).filter(Boolean))
  ).slice(0, limit);
}

function pickFirst(...values: unknown[]) {
  for (const value of values) {
    const normalized = text(value);
    if (normalized) return normalized;
  }
  return "";
}

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" ? (value as LooseRecord) : null;
}

function getValue(record: LooseRecord | null, key: string): unknown {
  return record ? record[key] : undefined;
}

export function buildAutonomousDecisionCouncilState(
  input: BuildAutonomousDecisionCouncilStateInput
): AutonomousDecisionCouncilState {
  const responseData = asRecord(input.responseData ?? null);
  const typedRecommendation = input.canonicalRecommendation ?? null;
  const canonicalRecommendation = asRecord(typedRecommendation);
  const recommendationPrimary = asRecord(getValue(canonicalRecommendation, "primary"));
  const recommendationReasoning = asRecord(getValue(canonicalRecommendation, "reasoning"));
  const executiveSummary = asRecord(getValue(responseData, "executive_summary_surface"));
  const simulation = asRecord(getValue(responseData, "decision_simulation"));
  const simulationImpact = asRecord(getValue(simulation, "impact"));
  const simulationRisk = asRecord(getValue(simulation, "risk"));
  const decisionComparison = asRecord(getValue(responseData, "decision_comparison"));
  const comparison = asRecord(getValue(responseData, "comparison"));
  const memoryEntries = input.memoryEntries ?? [];

  const confidenceModel = buildDecisionConfidenceModel({
    canonicalRecommendation: typedRecommendation,
    responseData,
    decisionResult: input.decisionResult ?? null,
  });
  const calibration = buildDecisionConfidenceCalibration({
    canonicalRecommendation: typedRecommendation,
    confidenceModel,
    outcomeAssessment: buildDecisionOutcomeAssessment({
      canonicalRecommendation: typedRecommendation,
      responseData,
      decisionResult: input.decisionResult ?? null,
      memoryEntries,
    }),
    memoryEntries,
  });
  const patternIntelligence = buildDecisionPatternIntelligence({
    memoryEntries,
    canonicalRecommendation: typedRecommendation,
  });
  const strategicLearning = buildStrategicLearningState({
    memoryEntries,
    canonicalRecommendation: typedRecommendation,
  });
  const metaDecision = buildMetaDecisionState({
    reasoning: getValue(responseData, "ai_reasoning") ?? null,
    simulation: simulation ?? null,
    comparison: decisionComparison ?? comparison ?? null,
    canonicalRecommendation: typedRecommendation,
    calibration,
    responseData,
    memoryEntries,
  });
  const executionIntent = buildDecisionExecutionIntent({
    source: "recommendation",
    canonicalRecommendation: typedRecommendation,
    responseData,
    decisionResult: input.decisionResult ?? null,
  });
  const teamDecision = buildTeamDecisionState({
    responseData,
    canonicalRecommendation: typedRecommendation,
    decisionResult: input.decisionResult ?? null,
    memoryEntries,
  });
  const collaborationState = buildCollaborationState({
    canonicalRecommendation: typedRecommendation,
    decisionExecutionIntent: executionIntent,
    responseData,
    decisionResult: input.decisionResult ?? null,
    memoryEntries,
    collaborationInputs: input.collaborationInputs ?? [],
    teamDecisionState: teamDecision,
  });
  const orgMemory = buildOrgMemoryState({
    memoryEntries,
    canonicalRecommendation: typedRecommendation,
  });
  const policy = buildDecisionPolicyState({
    canonicalRecommendation: typedRecommendation,
    decisionExecutionIntent: executionIntent,
    decisionResult: input.decisionResult ?? null,
    responseData,
    memoryEntries,
  });
  const governance = buildDecisionGovernanceState({
    canonicalRecommendation: typedRecommendation,
    decisionExecutionIntent: executionIntent,
    decisionResult: input.decisionResult ?? null,
    responseData,
    memoryEntries,
    orgMemoryState: orgMemory,
    teamDecisionState: teamDecision,
    metaDecisionState: metaDecision,
    policyState: policy,
  });
  const approval = buildApprovalWorkflowState({
    canonicalRecommendation: typedRecommendation,
    decisionExecutionIntent: executionIntent,
    decisionGovernance: governance,
    decisionResult: input.decisionResult ?? null,
    responseData,
    memoryEntries,
    policyState: policy,
  });

  const recommendationAction = pickFirst(
    getValue(recommendationPrimary, "action"),
    getValue(executiveSummary, "what_to_do"),
    "No clear recommendation is available yet."
  );
  const recommendationWhy = pickFirst(
    getValue(recommendationReasoning, "why"),
    getValue(executiveSummary, "why_it_matters"),
    getValue(responseData, "analysis_summary")
  );
  const impactSummary = pickFirst(
    getValue(recommendationPrimary, "impact_summary"),
    getValue(simulationImpact, "summary"),
    getValue(executiveSummary, "what_happens_next")
  );
  const riskSummary = pickFirst(
    getValue(recommendationReasoning, "risk_summary"),
    getValue(simulationRisk, "summary"),
    patternIntelligence.top_failure_patterns[0]
  );
  const decisionComparisonTradeoffs = Array.isArray(getValue(decisionComparison, "tradeoffs"))
    ? (getValue(decisionComparison, "tradeoffs") as unknown[])
    : [];
  const comparisonTradeoffs = Array.isArray(getValue(comparison, "tradeoffs"))
    ? (getValue(comparison, "tradeoffs") as unknown[])
    : [];
  const tradeoffSummary = pickFirst(
    decisionComparisonTradeoffs[0],
    comparisonTradeoffs[0],
    patternIntelligence.repeated_tradeoffs[0]
  );
  const targetIds = list(getValue(recommendationPrimary, "target_ids"), 3);
  const targetSummary = targetIds.length
    ? `Primary targets: ${targetIds.join(", ")}`
    : pickFirst(getValue(executiveSummary, "happened"), "Execution scope remains broad.");
  const confidenceLabel = confidenceModel.level ?? "unknown";
  const calibrationLabel = calibration.calibration_label ?? "insufficient_feedback";
  const teamSignal = pickFirst(
    teamDecision.alignment.disagreement_points[0],
    teamDecision.alignment.unresolved_questions[0],
    teamDecision.team_next_move
  );
  const collaborationSignal = pickFirst(
    collaborationState.alignment.disagreement_points[0],
    collaborationState.alignment.unresolved_questions[0],
    collaborationState.inputs[0]?.summary
  );
  const orgSignal = pickFirst(
    orgMemory.current_decision_note,
    orgMemory.relevant_signals[0]?.summary,
    orgMemory.org_guidance
  );
  const learningSignal = pickFirst(
    strategicLearning.strategic_guidance,
    strategicLearning.learning_signals[0]?.summary
  );
  const patternSignal = pickFirst(
    patternIntelligence.recommendation_hint,
    patternIntelligence.pattern_signals[0]?.summary
  );

  const rolePerspectives = COUNCIL_ROLES.map((role) =>
    buildCouncilRolePerspective({
      role,
      recommendationAction,
      recommendationWhy,
      impactSummary,
      riskSummary,
      tradeoffSummary,
      confidenceLabel,
      calibrationLabel,
      metaStrategy: metaDecision.selected_strategy,
      policyPosture: policy.posture,
      governanceMode: governance.mode,
      approvalStatus: approval.status,
      teamSignal,
      collaborationSignal,
      orgSignal,
      learningSignal,
      patternSignal,
      targetSummary,
    })
  );

  const debate = buildCouncilDebateState({
    rolePerspectives,
    recommendationAction,
    teamSignal,
    collaborationSignal,
    governanceMode: governance.mode,
  });
  const consensus = buildCouncilConsensus({
    rolePerspectives,
    debate,
    recommendationAction,
    recommendationWhy,
    governanceMode: governance.mode,
    approvalStatus: approval.status,
    metaStrategy: metaDecision.selected_strategy,
  });

  const nextSteps = Array.from(
    new Set(
      [
        consensus.final_recommendation,
        metaDecision.next_best_actions[0],
        governance.next_steps[0],
        approval.next_steps[0],
        collaborationState.next_steps[0],
      ]
        .map((value) => text(value))
        .filter(Boolean)
    )
  ).slice(0, 4);

  const state: AutonomousDecisionCouncilState = {
    decision_id: text(getValue(canonicalRecommendation, "id"), executionIntent?.id ?? `decision_council_${Date.now().toString(36)}`),
    generated_at: Date.now(),
    explanation: "",
    role_perspectives: rolePerspectives,
    debate,
    consensus,
    next_steps: nextSteps.length
      ? nextSteps
      : ["Gather stronger evidence before the council takes a stronger posture."],
  };

  return {
    ...state,
    explanation: buildCouncilExplanation(state),
  };
}
