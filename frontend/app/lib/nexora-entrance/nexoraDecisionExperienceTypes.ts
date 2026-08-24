/**
 * NEX-EXP:7 — Manager Decision & Commitment Experience contracts.
 * Experience/integration over CC:10 / CC:10R. Does not start execution.
 */

export const nexoraDecisionExperienceIdentity =
  "NEX-EXP:7/ManagerDecisionCommitmentExperience" as const;
export const nexoraDecisionExperienceVersion = "1.0.0" as const;
export const nexoraDecisionExperienceNamespace =
  "nexora.experience.manager.decision-commitment" as const;

export const NEXORA_DECISION_EXPERIENCE_BOUNDARY = Object.freeze({
  identity: nexoraDecisionExperienceIdentity,
  startsNexExp8: false as const,
  createsMo7: false as const,
  parallelDecisionEngine: false as const,
  parallelDecisionRuntime: false as const,
  parallelExecutionRuntime: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsCenter: false as const,
  writesDataReality: false as const,
  nexoraCanRecommend: true as const,
  nexoraCanCommitDecision: false as const,
  managerConfirmationRequired: true as const,
  startsExecution: false as const,
  changesExecution: false as const,
  cc10Authority: "CC:10/DecisionCommitment" as const,
  cc10rAuthority: "CC:10R/CanonicalDecisionRuntime" as const,
  ei5Authority: "EI:5/ExecutiveDecisionIntelligence" as const,
  prod4Authority: "STAGE-PROD:4/ExecutiveStageDecisionBrief" as const,
});

export const DECISION_EXPERIENCE_STATES = Object.freeze([
  "NOT_STARTED",
  "DECISION_READY",
  "REVIEWING_DECISION",
  "PREFERENCE_EXPRESSED",
  "AWAITING_CONFIRMATION",
  "COMMITTED",
  "REJECTED",
  "DEFERRED",
  "READY_FOR_EXECUTION_PLANNING",
] as const);

export type DecisionExperienceState =
  (typeof DECISION_EXPERIENCE_STATES)[number];

export type ExecutiveDecisionExperienceView = {
  readonly decisionQuestion: string;
  readonly activeGoal: string | null;
  readonly recommendedScenario: string | null;
  readonly alternatives: readonly string[];
  readonly selectedPreference: string | null;
  readonly decisionStatus: DecisionExperienceState;
  readonly rationale: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly risks: readonly string[];
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
  readonly evidence: readonly string[];
  readonly confirmationRequired: true;
  readonly managerConfirmed: boolean;
  readonly committedDecisionId: string | null;
  readonly committedAt: string | null;
  readonly startsExecution: false;
  readonly overrideNoted: boolean;
};

export type NexoraExecutionPlanningHandoff = {
  readonly activeGoal: unknown;
  readonly realityContext: unknown;
  readonly issueContext: unknown;
  readonly scenarioComparison: unknown;
  readonly recommendation: unknown;
  readonly committedDecision: unknown;
  readonly chosenScenario: string | null;
  readonly decisionRationale: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly risks: readonly string[];
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
  readonly evidence: readonly string[];
  readonly conversationContext: string;
  readonly startsExecution: false;
};

export type PendingDecisionConfirmationView = {
  readonly scenarioId: string;
  readonly title: string;
  readonly fingerprint: string;
  readonly requestedAction: "approve" | "reject";
};

export type NexoraDecisionExperienceSession = {
  readonly state: DecisionExperienceState;
  readonly view: ExecutiveDecisionExperienceView | null;
  readonly pendingConfirmation: PendingDecisionConfirmationView | null;
  readonly canonicalRecord: import("../conversational-control/executiveDecisionCandidate.ts").NexoraExecutiveDecision | null;
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly handoff: NexoraExecutionPlanningHandoff | null;
  readonly lastMutatedReality: null;
  readonly lastStartedExecution: null;
};

export function getNexoraDecisionExperienceIdentity() {
  return Object.freeze({
    id: nexoraDecisionExperienceIdentity,
    version: nexoraDecisionExperienceVersion,
    namespace: nexoraDecisionExperienceNamespace,
  });
}

export function verifyNexoraDecisionExperience(): { readonly ok: true } {
  if (
    getNexoraDecisionExperienceIdentity().id !==
    "NEX-EXP:7/ManagerDecisionCommitmentExperience"
  ) {
    throw new Error("NEX-EXP:7 identity mismatch");
  }
  if (NEXORA_DECISION_EXPERIENCE_BOUNDARY.startsNexExp8) {
    throw new Error("NEX-EXP:7 must not start NEX-EXP:8");
  }
  if (NEXORA_DECISION_EXPERIENCE_BOUNDARY.nexoraCanCommitDecision) {
    throw new Error("NEX-EXP:7 must not autonomously commit");
  }
  if (NEXORA_DECISION_EXPERIENCE_BOUNDARY.startsExecution) {
    throw new Error("NEX-EXP:7 must not start execution");
  }
  return Object.freeze({ ok: true as const });
}
