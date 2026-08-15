/**
 * CC:9 — Scenario Conversation identity and boundary.
 *
 * Defines, evaluates, and compares trusted scenarios conversationally.
 * Stops before Decision commitment and Execution.
 */

export const executiveScenarioConversationIdentity =
  "CC:9/ScenarioConversation" as const;

export const executiveScenarioConversationVersion = "1.0.0" as const;

export const executiveScenarioConversationNamespace =
  "nexora.conversational-control.scenario-conversation" as const;

export const executiveScenarioConversationPhase =
  "ScenarioConversation" as const;

export const executiveScenarioConversationArchitecturalRole =
  "ExecutiveScenarioConversationAuthority" as const;

export type ExecutiveScenarioConversationIdentity = {
  readonly id: typeof executiveScenarioConversationIdentity;
  readonly version: typeof executiveScenarioConversationVersion;
  readonly namespace: typeof executiveScenarioConversationNamespace;
  readonly phase: typeof executiveScenarioConversationPhase;
  readonly architecturalRole: typeof executiveScenarioConversationArchitecturalRole;
};

const IDENTITY: ExecutiveScenarioConversationIdentity = Object.freeze({
  id: executiveScenarioConversationIdentity,
  version: executiveScenarioConversationVersion,
  namespace: executiveScenarioConversationNamespace,
  phase: executiveScenarioConversationPhase,
  architecturalRole: executiveScenarioConversationArchitecturalRole,
});

export function getExecutiveScenarioConversationIdentity(): ExecutiveScenarioConversationIdentity {
  return IDENTITY;
}

export const EXECUTIVE_SCENARIO_CONVERSATION_BOUNDARY = Object.freeze({
  architecturalRole: executiveScenarioConversationArchitecturalRole,
  mutatesRuntime: false as const,
  mutatesStage: false as const,
  movesCamera: false as const,
  mutatesDecisionState: false as const,
  mutatesExecutionState: false as const,
  inventsBusinessOutcomes: false as const,
  inventsRelationships: false as const,
  usesLlmOrExternalProvider: false as const,
  commitsDecisions: false as const,
  altersExecution: false as const,
  destroysBaselineTruth: false as const,
  preferenceIsNotCommitment: true as const,
  sessionOnlyDrafts: true as const,
  stopsBeforeCommitment: true as const,
});

export const EXECUTIVE_SCENARIO_REASON = Object.freeze({
  SCENARIO_DEFINED: "scenario-defined",
  SCENARIO_MODIFIED: "scenario-modified",
  SCENARIO_EVALUATED: "scenario-evaluated",
  SCENARIO_PARTIAL: "scenario-partial",
  SCENARIO_UNSUPPORTED: "scenario-unsupported",
  SCENARIO_INSUFFICIENT_DATA: "scenario-insufficient-data",
  SCENARIO_HORIZON_REQUIRED: "scenario-horizon-required",
  SCENARIO_COMPARISON_CREATED: "scenario-comparison-created",
  SCENARIO_PREFERENCE_DERIVED: "scenario-preference-derived",
  SCENARIO_CAUSALITY_NOT_MODELED: "scenario-causality-not-modeled",
  SCENARIO_BASELINE_PRESERVED: "scenario-baseline-preserved",
  DECISION_COMMITMENT_DEFERRED: "decision-commitment-deferred",
  DO_NOTHING_DEFINED: "do-nothing-scenario-defined",
  INTERVENTION_DEFINED: "scenario-intervention-defined",
  ASSUMPTION_ADDED: "scenario-assumption-added",
  REVISION_ADVANCED: "scenario-revision-advanced",
  RECOMMENDATION_HANDOFF: "recommendation-scenario-handoff",
  GOAL_ALIGNMENT: "scenario-goal-alignment",
  PROBLEM_ALIGNMENT: "scenario-problem-alignment",
  EXPLICIT_SUBJECT_SCOPE: "explicit-subject-scope",
  CONTEXT_SUBJECT_SCOPE: "context-subject-scope",
  DETERMINISTIC: "deterministic-scenario-conversation",
} as const);

export type ExecutiveScenarioReasonCode =
  (typeof EXECUTIVE_SCENARIO_REASON)[keyof typeof EXECUTIVE_SCENARIO_REASON];
