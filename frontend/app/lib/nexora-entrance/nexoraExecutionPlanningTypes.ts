/**
 * NEX-EXP:8 — Execution Planning & Commitment-to-Action contracts.
 * Experience/integration over CC:11. Does not start NEX-EXP:9.
 */

export const nexoraExecutionPlanningIdentity =
  "NEX-EXP:8/ExecutionPlanningCommitmentToAction" as const;
export const nexoraExecutionPlanningVersion = "1.0.0" as const;
export const nexoraExecutionPlanningNamespace =
  "nexora.experience.execution.planning-commitment-to-action" as const;

export const NEXORA_EXECUTION_PLANNING_BOUNDARY = Object.freeze({
  identity: nexoraExecutionPlanningIdentity,
  startsNexExp9: false as const,
  createsMo7: false as const,
  parallelExecutionRuntime: false as const,
  parallelTaskManager: false as const,
  parallelGantt: false as const,
  parallelOutcomeEngine: false as const,
  parallelAdvisor: false as const,
  newStageRuntime: false as const,
  usesLlm: false as const,
  writesStageCoordinates: false as const,
  stealsCenter: false as const,
  writesDataReality: false as const,
  autoStartsOnDecision: false as const,
  nexoraCanStartExecution: false as const,
  managerConfirmationRequired: true as const,
  cc11Authority: "CC:11/CanonicalExecution" as const,
  ei6Authority: "EI:6/ExecutionOutcomeLearningLoop" as const,
});

export const EXECUTION_PLANNING_STATES = Object.freeze([
  "NOT_STARTED",
  "EXECUTION_CONTEXT_READY",
  "PLANNING",
  "PLAN_PARTIAL",
  "PLAN_READY",
  "AWAITING_EXECUTION_CONFIRMATION",
  "EXECUTION_COMMITTED",
  "EXECUTION_ACTIVE",
  "READY_FOR_OUTCOME_MONITORING",
] as const);

export type ExecutionPlanningState =
  (typeof EXECUTION_PLANNING_STATES)[number];

export type ExecutionReadiness =
  | "UNKNOWN"
  | "NOT_READY"
  | "PARTIAL"
  | "READY"
  | "BLOCKED";

export type ExecutionBlockerKind =
  | "MISSING_OWNER"
  | "UNRESOLVED_DEPENDENCY"
  | "CONSTRAINT_VIOLATION"
  | "MISSING_RESOURCE"
  | "MISSING_APPROVAL"
  | "MISSING_EVIDENCE"
  | "TECHNICAL_BLOCKER"
  | "SCHEDULE_BLOCKER"
  | "UNKNOWN";

export type ExecutiveExecutionAction = {
  readonly actionId: string;
  readonly title: string;
  readonly description: string | null;
  readonly owner: string | null;
  readonly sequence: number | null;
  readonly dependsOn: readonly string[];
  readonly dueDate: null;
  readonly milestoneId: string | null;
  readonly status: "planned";
  readonly evidence: readonly string[];
  readonly epistemicStatus: "KNOWN" | "UNKNOWN";
};

export type ExecutionBlocker = {
  readonly kind: ExecutionBlockerKind;
  readonly subject: string | null;
  readonly reason: string;
  readonly evidence: readonly string[];
  readonly owner: null;
  readonly severity: "material" | "unknown";
  readonly epistemicStatus: "KNOWN" | "UNKNOWN";
};

export type ExecutiveExecutionPlan = {
  readonly executionPlanId: string;
  readonly decisionId: string | null;
  readonly goalId: string | null;
  readonly objective: string;
  readonly actions: readonly ExecutiveExecutionAction[];
  readonly owners: readonly string[];
  readonly dependencies: readonly { readonly from: string; readonly to: string }[];
  readonly milestones: readonly { readonly milestoneId: string; readonly label: string }[];
  readonly constraints: readonly string[];
  readonly risks: readonly string[];
  readonly assumptions: readonly string[];
  readonly unknowns: readonly string[];
  readonly startCondition: string | null;
  readonly completionCriteria: readonly string[];
  readonly progressSignals: readonly string[];
  readonly status: ExecutionPlanningState;
  readonly readiness: ExecutionReadiness;
  readonly committed: boolean;
  readonly started: false | true;
};

export type NexoraOutcomeMonitoringHandoff = {
  readonly activeGoal: unknown;
  readonly committedDecision: unknown;
  readonly executionPlan: ExecutiveExecutionPlan | null;
  readonly executionRuntimeState: string | null;
  readonly expectedOutcomes: readonly string[];
  readonly successSignals: readonly string[];
  readonly progressSignals: readonly string[];
  readonly risks: readonly string[];
  readonly unknowns: readonly string[];
  readonly conversationContext: string;
  readonly startsOutcomeMonitoring: false;
};

export type PendingExecutionConfirmation = {
  readonly action: "start" | "cancel";
  readonly executionId: string | null;
  readonly fingerprint: string;
};

export type NexoraExecutionPlanningSession = {
  readonly state: ExecutionPlanningState;
  readonly plan: ExecutiveExecutionPlan | null;
  readonly pendingConfirmation: PendingExecutionConfirmation | null;
  readonly canonicalExecutionId: string | null;
  readonly canonicalStatus: string | null;
  readonly askedQuestionKeys: readonly string[];
  readonly introduced: boolean;
  readonly handoff: NexoraOutcomeMonitoringHandoff | null;
  readonly lastMutatedReality: null;
  readonly lastInventedOwner: null;
};

export function getNexoraExecutionPlanningIdentity() {
  return Object.freeze({
    id: nexoraExecutionPlanningIdentity,
    version: nexoraExecutionPlanningVersion,
    namespace: nexoraExecutionPlanningNamespace,
  });
}

export function verifyNexoraExecutionPlanning(): { readonly ok: true } {
  if (
    getNexoraExecutionPlanningIdentity().id !==
    "NEX-EXP:8/ExecutionPlanningCommitmentToAction"
  ) {
    throw new Error("NEX-EXP:8 identity mismatch");
  }
  if (NEXORA_EXECUTION_PLANNING_BOUNDARY.startsNexExp9) {
    throw new Error("NEX-EXP:8 must not start NEX-EXP:9");
  }
  if (NEXORA_EXECUTION_PLANNING_BOUNDARY.autoStartsOnDecision) {
    throw new Error("NEX-EXP:8 must not auto-start execution");
  }
  if (NEXORA_EXECUTION_PLANNING_BOUNDARY.nexoraCanStartExecution) {
    throw new Error("NEX-EXP:8 must not autonomously start execution");
  }
  return Object.freeze({ ok: true as const });
}
