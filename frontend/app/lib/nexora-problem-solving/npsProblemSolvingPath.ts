/**
 * NPA-T NPS:1 — Problem-Solving Path Foundation.
 *
 * Read-oriented cross-layer path contract. Observes existing authorities.
 * Does not own Problem, Investigation, Evidence, Scenario, Recommendation,
 * Decision, Execution, Outcome, Learning, conversation, Stage, or Theatre.
 */

export const NPS_PROBLEM_SOLVING_PATH_IDENTITY =
  "NPA-T NPS:1/ProblemSolvingPathFoundation" as const;
export const NPS_PROBLEM_SOLVING_PATH_VERSION = "1.0.0" as const;
export const NPS_PROBLEM_SOLVING_PATH_NAMESPACE =
  "nexora.problem-solving.path" as const;

export const NPS_PATH_STATES = Object.freeze([
  "PROBLEM_IDENTIFIED",
  "UNDERSTANDING",
  "INVESTIGATING",
  "EVIDENCE_REVIEW",
  "CAUSE_ANALYSIS",
  "OPTIONS_AVAILABLE",
  "COMPARING_OPTIONS",
  "RECOMMENDATION_READY",
  "AWAITING_COMMITMENT",
  "DECIDED",
  "EXECUTION_READINESS",
  "EXECUTING",
  "MONITORING",
  "OUTCOME_REVIEW",
  "REASSESSMENT",
  "RESOLVED",
] as const);
export type NpsPathState = (typeof NPS_PATH_STATES)[number];

export const NPS_PROBLEM_OWNERSHIP = Object.freeze([
  "DETERMINED",
  "UNCERTAIN",
  "CONFLICTED",
] as const);
export type NpsProblemOwnership = (typeof NPS_PROBLEM_OWNERSHIP)[number];

export const NPS_EVIDENCE_STATES = Object.freeze([
  "NONE",
  "INSUFFICIENT",
  "PARTIAL",
  "SUFFICIENT",
] as const);
export type NpsEvidenceState = (typeof NPS_EVIDENCE_STATES)[number];

export const NPS_EXECUTION_STATUSES = Object.freeze([
  "NONE",
  "READY",
  "ACTIVE",
  "MONITORING",
  "BLOCKED",
  "COMPLETED",
] as const);
export type NpsExecutionStatus = (typeof NPS_EXECUTION_STATUSES)[number];

export const NPS_PROBLEM_SOLVING_PATH_BOUNDARY = Object.freeze({
  identity: NPS_PROBLEM_SOLVING_PATH_IDENTITY,
  newAuthorityLayer: false as const,
  createsProblemStore: false as const,
  createsScenarioStore: false as const,
  createsInvestigationStore: false as const,
  writesEvidence: false as const,
  writesRecommendation: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  inventsOutcome: false as const,
  inventsLearning: false as const,
  bypassesEca: false as const,
  bypassesCc10: false as const,
  bypassesCc11: false as const,
  replacesMo5: false as const,
  redesignsAdvisor: false as const,
  redesignsStage: false as const,
  derivedFromCanonicalFacts: true as const,
  uncertaintyExplicit: true as const,
  managerConfirmationUnchanged: true as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

const STATE_ORDER: Readonly<Record<NpsPathState, number>> = Object.freeze({
  PROBLEM_IDENTIFIED: 0,
  UNDERSTANDING: 1,
  INVESTIGATING: 2,
  EVIDENCE_REVIEW: 3,
  CAUSE_ANALYSIS: 4,
  OPTIONS_AVAILABLE: 5,
  COMPARING_OPTIONS: 6,
  RECOMMENDATION_READY: 7,
  AWAITING_COMMITMENT: 8,
  DECIDED: 9,
  EXECUTION_READINESS: 10,
  EXECUTING: 11,
  MONITORING: 12,
  OUTCOME_REVIEW: 13,
  REASSESSMENT: 14,
  RESOLVED: 15,
});

const NEXT_STEP: Readonly<Record<NpsPathState, string>> = Object.freeze({
  PROBLEM_IDENTIFIED: "Understand the Problem",
  UNDERSTANDING: "Investigate",
  INVESTIGATING: "Gather and review evidence",
  EVIDENCE_REVIEW: "Analyze possible causes",
  CAUSE_ANALYSIS: "Develop options",
  OPTIONS_AVAILABLE: "Compare options",
  COMPARING_OPTIONS: "Review a recommendation",
  RECOMMENDATION_READY: "Review commitment",
  AWAITING_COMMITMENT: "Confirm the Decision",
  DECIDED: "Check execution readiness",
  EXECUTION_READINESS: "Prepare to execute",
  EXECUTING: "Monitor",
  MONITORING: "Review the outcome",
  OUTCOME_REVIEW: "Resolve or reassess",
  REASSESSMENT: "Reopen understanding of the Problem",
  RESOLVED: "None",
});

const MANAGER_STEP: Readonly<Record<NpsPathState, string>> = Object.freeze({
  PROBLEM_IDENTIFIED: "Problem identified",
  UNDERSTANDING: "Understanding",
  INVESTIGATING: "Investigation",
  EVIDENCE_REVIEW: "Evidence Review",
  CAUSE_ANALYSIS: "Cause Analysis",
  OPTIONS_AVAILABLE: "Options Available",
  COMPARING_OPTIONS: "Comparing Options",
  RECOMMENDATION_READY: "Recommendation Ready",
  AWAITING_COMMITMENT: "Awaiting Commitment",
  DECIDED: "Decided",
  EXECUTION_READINESS: "Execution Readiness",
  EXECUTING: "Executing",
  MONITORING: "Monitoring",
  OUTCOME_REVIEW: "Outcome Review",
  REASSESSMENT: "Reassessment",
  RESOLVED: "Resolved",
});

export type NpsSupportingReference = Readonly<{
  role:
    | "problem"
    | "investigation"
    | "evidence"
    | "cause"
    | "scenario"
    | "comparison"
    | "recommendation"
    | "decision"
    | "execution"
    | "outcome"
    | "learning";
  id: string | null;
  observedFrom: string;
}>;

export type NpsProblemAnchor = Readonly<{
  problemId: string | null;
  problemLabel: string | null;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  observedFrom: string;
  candidateProblemIds?: readonly string[];
}>;

export type NpsCanonicalFacts = Readonly<{
  problem: NpsProblemAnchor;
  investigationPresent: boolean;
  investigationId?: string | null;
  investigationObservedFrom?: string;
  evidenceState: NpsEvidenceState;
  evidenceObservedFrom?: string;
  evidenceGapLabel?: string | null;
  causeHypothesesAvailable: boolean;
  causeObservedFrom?: string;
  scenarioIds: readonly string[];
  scenarioObservedFrom?: string;
  comparisonAvailable: boolean;
  comparisonObservedFrom?: string;
  recommendationReady: boolean;
  recommendationObservedFrom?: string;
  awaitingCommitment: boolean;
  approvedDecisionId: string | null;
  decisionObservedFrom?: string;
  execution: Readonly<{
    present: boolean;
    executionId: string | null;
    status: NpsExecutionStatus;
    observedFrom?: string;
  }>;
  outcome: Readonly<{
    observed: boolean;
    problemResolved: boolean | null;
    observedFrom?: string;
  }>;
  learningAvailable?: boolean;
  stageFocusId?: string | null;
  conversationSubjectId?: string | null;
  collectionMemberIds?: readonly string[];
}>;

export type NpsManagerProjection = Readonly<{
  problem: string;
  currentStep: string;
  completed: readonly string[];
  nextUsefulStep: string;
  blockedBy: string | null;
}>;

export type NpsProblemSolvingPath = Readonly<{
  identity: typeof NPS_PROBLEM_SOLVING_PATH_IDENTITY;
  problemId: string | null;
  problemLabel: string | null;
  problemOwnership: NpsProblemOwnership;
  currentState: NpsPathState | null;
  completedStates: readonly NpsPathState[];
  availableNextStates: readonly NpsPathState[];
  nextStep: string | null;
  blockingReason: string | null;
  supportingReferences: readonly NpsSupportingReference[];
  managerProjection: NpsManagerProjection;
  unknowns: readonly string[];
  canonicalMutations: readonly [];
  commitsDecision: false;
  startsExecution: false;
  writesEvidence: false;
  boundary: typeof NPS_PROBLEM_SOLVING_PATH_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function problemIsDetermined(problem: NpsProblemAnchor): boolean {
  const candidates = problem.candidateProblemIds ?? [];
  if (candidates.length > 1 && problem.problemId == null) return false;
  if (problem.problemId == null || problem.problemId.trim() === "") return false;
  return problem.confidence === "HIGH" || problem.confidence === "MEDIUM";
}

function problemOwnership(problem: NpsProblemAnchor): NpsProblemOwnership {
  const candidates = problem.candidateProblemIds ?? [];
  if (candidates.length > 1 && (problem.problemId == null || problem.confidence === "LOW")) {
    return "CONFLICTED";
  }
  if (problemIsDetermined(problem)) return "DETERMINED";
  return "UNCERTAIN";
}

function reached(
  facts: NpsCanonicalFacts,
  state: NpsPathState,
): boolean {
  const executionStatus = facts.execution.status;
  switch (state) {
    case "PROBLEM_IDENTIFIED":
      return true;
    case "UNDERSTANDING":
      return true;
    case "INVESTIGATING":
      return facts.investigationPresent;
    case "EVIDENCE_REVIEW":
      return (
        facts.evidenceState === "INSUFFICIENT" ||
        facts.evidenceState === "PARTIAL" ||
        facts.evidenceState === "SUFFICIENT"
      );
    case "CAUSE_ANALYSIS":
      return facts.causeHypothesesAvailable;
    case "OPTIONS_AVAILABLE":
      return facts.scenarioIds.length > 0;
    case "COMPARING_OPTIONS":
      return facts.comparisonAvailable;
    case "RECOMMENDATION_READY":
      return facts.recommendationReady;
    case "AWAITING_COMMITMENT":
      return facts.awaitingCommitment && facts.approvedDecisionId == null;
    case "DECIDED":
      return facts.approvedDecisionId != null;
    case "EXECUTION_READINESS":
      return facts.approvedDecisionId != null && executionStatus === "READY";
    case "EXECUTING":
      return executionStatus === "ACTIVE";
    case "MONITORING":
      return (
        executionStatus === "MONITORING" ||
        (executionStatus === "COMPLETED" && !facts.outcome.observed)
      );
    case "OUTCOME_REVIEW":
      return facts.outcome.observed && facts.outcome.problemResolved == null;
    case "REASSESSMENT":
      return facts.outcome.observed && facts.outcome.problemResolved === false;
    case "RESOLVED":
      return facts.outcome.observed && facts.outcome.problemResolved === true;
  }
}

function resolveCurrentState(facts: NpsCanonicalFacts): NpsPathState {
  const reverse = [...NPS_PATH_STATES].reverse();
  for (const state of reverse) {
    if (reached(facts, state)) return state;
  }
  return "UNDERSTANDING";
}

function impliedByLaterProgress(
  state: NpsPathState,
  current: NpsPathState,
  facts: NpsCanonicalFacts,
): boolean {
  const later = STATE_ORDER[current] > STATE_ORDER[state];
  if (!later) return false;
  if (state === "OUTCOME_REVIEW") return facts.outcome.observed;
  if (state === "DECIDED") return facts.approvedDecisionId != null;
  if (state === "EXECUTION_READINESS") {
    return (
      facts.execution.status === "ACTIVE" ||
      facts.execution.status === "MONITORING" ||
      facts.execution.status === "COMPLETED"
    );
  }
  if (state === "EXECUTING") {
    return (
      facts.execution.status === "MONITORING" ||
      facts.execution.status === "COMPLETED" ||
      facts.outcome.observed
    );
  }
  if (state === "MONITORING") return facts.outcome.observed;
  return false;
}

function completedBefore(
  current: NpsPathState,
  facts: NpsCanonicalFacts,
): readonly NpsPathState[] {
  const currentOrder = STATE_ORDER[current];
  return freeze(
    NPS_PATH_STATES.filter((state) => {
      if (STATE_ORDER[state] >= currentOrder) return false;
      if (state === "AWAITING_COMMITMENT") return facts.awaitingCommitment;
      return reached(facts, state) || impliedByLaterProgress(state, current, facts);
    }),
  );
}

function nextStatesFor(current: NpsPathState): readonly NpsPathState[] {
  switch (current) {
    case "PROBLEM_IDENTIFIED":
      return freeze(["UNDERSTANDING"]);
    case "UNDERSTANDING":
      return freeze(["INVESTIGATING"]);
    case "INVESTIGATING":
      return freeze(["EVIDENCE_REVIEW"]);
    case "EVIDENCE_REVIEW":
      return freeze(["CAUSE_ANALYSIS"]);
    case "CAUSE_ANALYSIS":
      return freeze(["OPTIONS_AVAILABLE"]);
    case "OPTIONS_AVAILABLE":
      return freeze(["COMPARING_OPTIONS"]);
    case "COMPARING_OPTIONS":
      return freeze(["RECOMMENDATION_READY"]);
    case "RECOMMENDATION_READY":
      return freeze(["AWAITING_COMMITMENT"]);
    case "AWAITING_COMMITMENT":
      return freeze(["DECIDED"]);
    case "DECIDED":
      return freeze(["EXECUTION_READINESS"]);
    case "EXECUTION_READINESS":
      return freeze(["EXECUTING"]);
    case "EXECUTING":
      return freeze(["MONITORING"]);
    case "MONITORING":
      return freeze(["OUTCOME_REVIEW"]);
    case "OUTCOME_REVIEW":
      return freeze(["RESOLVED", "REASSESSMENT"]);
    case "REASSESSMENT":
      return freeze(["UNDERSTANDING", "INVESTIGATING"]);
    case "RESOLVED":
      return freeze([]);
    default:
      return freeze([]);
  }
}

function blockingReason(
  current: NpsPathState,
  facts: NpsCanonicalFacts,
): string | null {
  if (current === "EVIDENCE_REVIEW" && facts.evidenceState === "INSUFFICIENT") {
    return facts.evidenceGapLabel?.trim() || "Evidence is still incomplete";
  }
  if (current === "EXECUTING" && facts.execution.status === "BLOCKED") {
    return "Execution is blocked";
  }
  return null;
}

function collectReferences(facts: NpsCanonicalFacts): readonly NpsSupportingReference[] {
  const refs: NpsSupportingReference[] = [];
  if (facts.problem.problemId) {
    refs.push({
      role: "problem",
      id: facts.problem.problemId,
      observedFrom: facts.problem.observedFrom,
    });
  }
  if (facts.investigationPresent) {
    refs.push({
      role: "investigation",
      id: facts.investigationId ?? null,
      observedFrom: facts.investigationObservedFrom ?? "FINAL:5 investigation composer",
    });
  }
  if (facts.evidenceState !== "NONE") {
    refs.push({
      role: "evidence",
      id: null,
      observedFrom: facts.evidenceObservedFrom ?? "Data Reality / CC:8 evidence pack",
    });
  }
  if (facts.causeHypothesesAvailable) {
    refs.push({
      role: "cause",
      id: null,
      observedFrom: facts.causeObservedFrom ?? "CORE-INT:3 causal constraint intelligence",
    });
  }
  for (const scenarioId of facts.scenarioIds) {
    refs.push({
      role: "scenario",
      id: scenarioId,
      observedFrom: facts.scenarioObservedFrom ?? "CC:9 scenario authority",
    });
  }
  if (facts.comparisonAvailable) {
    refs.push({
      role: "comparison",
      id: null,
      observedFrom: facts.comparisonObservedFrom ?? "NCA-POST:4 comparison",
    });
  }
  if (facts.recommendationReady) {
    refs.push({
      role: "recommendation",
      id: null,
      observedFrom: facts.recommendationObservedFrom ?? "ECA:7 / NCA:4 recommendation",
    });
  }
  if (facts.approvedDecisionId) {
    refs.push({
      role: "decision",
      id: facts.approvedDecisionId,
      observedFrom: facts.decisionObservedFrom ?? "CC:10 Decision",
    });
  }
  if (facts.execution.present || facts.execution.executionId) {
    refs.push({
      role: "execution",
      id: facts.execution.executionId,
      observedFrom: facts.execution.observedFrom ?? "CC:11 Execution",
    });
  }
  if (facts.outcome.observed) {
    refs.push({
      role: "outcome",
      id: null,
      observedFrom: facts.outcome.observedFrom ?? "CORE-OUT Outcome",
    });
  }
  if (facts.learningAvailable) {
    refs.push({
      role: "learning",
      id: null,
      observedFrom: "CORE-OUT:2 / ECA:12 learning projection",
    });
  }
  return freeze(refs);
}

function collectUnknowns(
  ownership: NpsProblemOwnership,
  facts: NpsCanonicalFacts,
): readonly string[] {
  const unknowns: string[] = [];
  if (ownership !== "DETERMINED") {
    unknowns.push("Active Problem is not determined from canonical facts.");
  }
  if (facts.stageFocusId && facts.problem.problemId && facts.stageFocusId !== facts.problem.problemId) {
    unknowns.push("Stage focus is not used as a substitute for the active Problem.");
  }
  if (
    facts.conversationSubjectId &&
    facts.problem.problemId &&
    facts.conversationSubjectId !== facts.problem.problemId
  ) {
    unknowns.push("Conversation subject is not used as a substitute for the active Problem.");
  }
  if (ownership === "DETERMINED" && facts.evidenceState === "INSUFFICIENT") {
    unknowns.push("Evidence is incomplete for this Problem.");
  }
  if (facts.outcome.observed && facts.outcome.problemResolved == null) {
    unknowns.push("Outcome is observed, but whether the Problem is resolved remains unknown.");
  }
  return freeze(unknowns);
}

function uncertainPath(facts: NpsCanonicalFacts, ownership: NpsProblemOwnership): NpsProblemSolvingPath {
  const reason =
    ownership === "CONFLICTED"
      ? "More than one Problem is in view, and the active Problem is not determined."
      : "The active Problem cannot be determined safely.";
  return freeze({
    identity: NPS_PROBLEM_SOLVING_PATH_IDENTITY,
    problemId: null,
    problemLabel: facts.problem.problemLabel,
    problemOwnership: ownership,
    currentState: null,
    completedStates: freeze([]),
    availableNextStates: freeze([]),
    nextStep: "Determine the active Problem",
    blockingReason: reason,
    supportingReferences: collectReferences(facts),
    managerProjection: freeze({
      problem: "Not determined",
      currentStep: "Unknown",
      completed: freeze([]),
      nextUsefulStep: "Determine the active Problem",
      blockedBy: reason,
    }),
    unknowns: collectUnknowns(ownership, facts),
    canonicalMutations: freeze([]),
    commitsDecision: false,
    startsExecution: false,
    writesEvidence: false,
    boundary: NPS_PROBLEM_SOLVING_PATH_BOUNDARY,
  });
}

export function composeNpsProblemSolvingPath(
  facts: NpsCanonicalFacts,
): NpsProblemSolvingPath {
  const ownership = problemOwnership(facts.problem);
  if (ownership !== "DETERMINED") {
    return uncertainPath(facts, ownership);
  }

  const currentState = resolveCurrentState(facts);
  const completedStates = completedBefore(currentState, facts);
  const blocked = blockingReason(currentState, facts);
  const availableNextStates = blocked ? freeze([]) : nextStatesFor(currentState);
  const nextStep =
    blocked && currentState === "EVIDENCE_REVIEW"
      ? "Finish reviewing evidence"
      : NEXT_STEP[currentState];

  return freeze({
    identity: NPS_PROBLEM_SOLVING_PATH_IDENTITY,
    problemId: facts.problem.problemId,
    problemLabel: facts.problem.problemLabel,
    problemOwnership: ownership,
    currentState,
    completedStates,
    availableNextStates,
    nextStep,
    blockingReason: blocked,
    supportingReferences: collectReferences(facts),
    managerProjection: freeze({
      problem: facts.problem.problemLabel?.trim() || "This Problem",
      currentStep: MANAGER_STEP[currentState],
      completed: freeze(completedStates.map((state) => MANAGER_STEP[state])),
      nextUsefulStep: nextStep,
      blockedBy: blocked,
    }),
    unknowns: collectUnknowns(ownership, facts),
    canonicalMutations: freeze([]),
    commitsDecision: false,
    startsExecution: false,
    writesEvidence: false,
    boundary: NPS_PROBLEM_SOLVING_PATH_BOUNDARY,
  });
}

export function attemptNpsPathAdvancement(
  path: NpsProblemSolvingPath,
): Readonly<{
  path: NpsProblemSolvingPath;
  canonicalMutations: readonly [];
  decisionsCreated: 0;
  executionsStarted: 0;
  evidenceWritten: false;
  outcomesInvented: false;
  learningInvented: false;
}> {
  return freeze({
    path,
    canonicalMutations: freeze([]),
    decisionsCreated: 0,
    executionsStarted: 0,
    evidenceWritten: false,
    outcomesInvented: false,
    learningInvented: false,
  });
}

export function getNpsProblemSolvingPathIdentity(): Readonly<{
  id: typeof NPS_PROBLEM_SOLVING_PATH_IDENTITY;
  version: typeof NPS_PROBLEM_SOLVING_PATH_VERSION;
  namespace: typeof NPS_PROBLEM_SOLVING_PATH_NAMESPACE;
}> {
  return freeze({
    id: NPS_PROBLEM_SOLVING_PATH_IDENTITY,
    version: NPS_PROBLEM_SOLVING_PATH_VERSION,
    namespace: NPS_PROBLEM_SOLVING_PATH_NAMESPACE,
  });
}
