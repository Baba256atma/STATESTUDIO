/**
 * MO-INT:1 — Manager–Object Executive Experience Integration contracts.
 * Orchestration only. Not MO:7 and not a new intelligence authority.
 */

export const managerObjectExperienceIntegrationIdentity =
  "MO-INT:1/ManagerObjectExecutiveExperienceIntegration" as const;
export const managerObjectExperienceIntegrationVersion = "1.0.0" as const;
export const managerObjectExperienceIntegrationNamespace =
  "nexora.manager-object.executive-experience-integration" as const;

export const MANAGER_OBJECT_EXPERIENCE_BOUNDARY = Object.freeze({
  identity: managerObjectExperienceIntegrationIdentity,
  createsMo7: false as const,
  newExplainEngine: false as const,
  newExplorationEngine: false as const,
  newGoalEngine: false as const,
  newJourneyEngine: false as const,
  newAttentionEngine: false as const,
  newAdvisor: false as const,
  newConversationRuntime: false as const,
  newStageNavigation: false as const,
  newDurableMemory: false as const,
  usesLlm: false as const,
  commitsDecisions: false as const,
  startsExecution: false as const,
  stealsDirectFocus: false as const,
  exposesEngineIdsToManager: false as const,
  truthPrecedence:
    "DIRECT MANAGER QUESTION > SAFETY / DECISION REQUIREMENT > ACTIVE OBJECT > ACTIVE GOAL > JOURNEY BLOCKER > ATTENTION > NEXT PATH > SECONDARY CONTEXT" as const,
});

export const EXECUTIVE_MANAGER_LANES = Object.freeze([
  "advisor",
  "explain",
  "explore",
  "goal",
  "journey",
  "attention",
  "next-action",
  "compare",
] as const);
export type ExecutiveManagerLane = (typeof EXECUTIVE_MANAGER_LANES)[number];

export type ExecutiveManagerResponse = {
  readonly integrationId: typeof managerObjectExperienceIntegrationIdentity;
  readonly lane: ExecutiveManagerLane;
  readonly subject: string | null;
  readonly goal: string | null;
  readonly answer: string;
  readonly whyItMatters: string | null;
  readonly currentPosition: string | null;
  readonly attention: string | null;
  readonly intervention: string | null;
  readonly recommendedNextStep: string | null;
  readonly alternatives: readonly string[];
  readonly evidence: readonly string[];
  readonly uncertainty: readonly string[];
  readonly availableActions: readonly string[];
  readonly compactContext: string;
  readonly usesLlm: false;
  readonly commitsDecision: false;
  readonly startsExecution: false;
  readonly stealsDirectFocus: false;
};
