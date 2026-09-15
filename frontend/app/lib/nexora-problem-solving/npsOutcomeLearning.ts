/**
 * NPA-T NPS:8 — Outcome, Learning & Reassessment.
 *
 * Read-oriented path composition over NPS:1–6, ECA:11–12, and CORE-OUT.
 * Does not write Outcome, Learning, Goal, Problem, Decision, or Execution.
 */

import type { EcaExecutiveLearningClosureJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveLearningClosure.ts";
import type { EcaExecutiveOutcomeJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveOutcome.ts";
import type { EcaOutcomeEvidence } from "@/app/lib/nexora-conversation/ecaExecutiveOutcome.ts";
import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsExecutionStatus,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";
import type { NpsDecisionCommitment } from "./npsDecisionCommitment.ts";

export const NPS_OUTCOME_LEARNING_IDENTITY =
  "NPA-T NPS:8/OutcomeLearningReassessment" as const;

export const NPS_OUTCOME_STATUSES = Object.freeze([
  "UNKNOWN",
  "TOO_EARLY",
  "BELOW_EXPECTATION",
  "PARTIAL",
  "MEETS_EXPECTATION",
  "EXCEEDS_EXPECTATION",
  "MIXED",
] as const);
export type NpsOutcomeStatus = (typeof NPS_OUTCOME_STATUSES)[number];

export const NPS_RESOLUTION_STATUSES = Object.freeze([
  "UNKNOWN",
  "IMPROVED",
  "PARTIALLY_RESOLVED",
  "RESOLVED",
  "NOT_RESOLVED",
  "WORSENED",
] as const);
export type NpsResolutionStatus = (typeof NPS_RESOLUTION_STATUSES)[number];

export const NPS_LEARNING_STATUSES = Object.freeze([
  "NONE",
  "BOUNDED",
  "TENTATIVE",
  "WEAKENED_HYPOTHESIS",
  "INCONCLUSIVE",
] as const);
export type NpsLearningStatus = (typeof NPS_LEARNING_STATUSES)[number];

export const NPS_REASSESSMENT_STATUSES = Object.freeze([
  "NOT_WARRANTED",
  "AVAILABLE",
  "ROUTED",
] as const);
export type NpsReassessmentStatus = (typeof NPS_REASSESSMENT_STATUSES)[number];

export const NPS_OUTCOME_LEARNING_BOUNDARY = Object.freeze({
  identity: NPS_OUTCOME_LEARNING_IDENTITY,
  newAuthorityLayer: false as const,
  createsOutcomeStore: false as const,
  createsLearningStore: false as const,
  createsCausalLearningEngine: false as const,
  writesGoal: false as const,
  writesProblem: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  inventsDurableLearning: false as const,
  durableLearningWriter: false as const,
  outcomeOwner: "CORE-OUT:1 / CORE-OUT:1A / ECA:11" as const,
  learningOwner: "CORE-OUT:2 / ECA:12 / DTH:12" as const,
  executionOwner: "CC:11" as const,
  completionEqualsSuccess: false as const,
  improvementEqualsResolution: false as const,
  correlationEqualsCausality: false as const,
  expectedEqualsObserved: false as const,
  baselineEqualsGoal: false as const,
  npsWritesOutcome: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

export type NpsOutcomeObservation = Readonly<{
  decisionId: string | null;
  decisionTitle: string | null;
  executionId: string | null;
  executionStatus: string | null;
  executionTitle: string | null;
  measure: string | null;
  baseline: number | null;
  goal: number | null;
  expected: number | null;
  observed: number | null;
  unit: string | null;
  evidencePresent: boolean;
  causeHypothesisInvalidated?: boolean;
  optionsNoLongerAppropriate?: boolean;
  executionFailedOperationally?: boolean;
  comparisonRequired?: boolean;
}>;

export type NpsOutcomeLearning = Readonly<{
  identity: typeof NPS_OUTCOME_LEARNING_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  decisionId: string | null;
  decisionTitle: string | null;
  executionId: string | null;
  executionStatus: string | null;
  baseline: number | null;
  goal: number | null;
  expectedOutcome: number | null;
  observedOutcome: number | null;
  outcomeStatus: NpsOutcomeStatus;
  variance: string | null;
  evidence: string | null;
  uncertainties: readonly string[];
  learningStatus: NpsLearningStatus;
  learningStatements: readonly string[];
  learningDurable: false;
  resolutionStatus: NpsResolutionStatus;
  reassessmentStatus: NpsReassessmentStatus;
  loopBackState: NpsPathState | null;
  attribution: "NOT_ESTABLISHED";
  nextStep: string | null;
  action: "WAIT_FOR_OUTCOME" | "REVIEW_OUTCOME" | "REASSESS" | "RESOLVE" | "CLARIFY_PROBLEM";
  supportingReferences: readonly NpsSupportingReference[];
  path: NpsProblemSolvingPath;
  managerProjection: Readonly<{ problem: string; text: string }>;
  canonicalMutations: readonly [];
  npsWritesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  writesLearning: false;
  writesGoal: false;
  boundary: typeof NPS_OUTCOME_LEARNING_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function mapExecutionStatus(status: string | null | undefined): NpsExecutionStatus {
  const value = (status ?? "").toLowerCase();
  if (value === "completed") return "COMPLETED";
  if (value === "blocked") return "BLOCKED";
  if (value === "at-risk" || value === "monitoring") return "MONITORING";
  if (value === "in-progress" || value === "active") return "ACTIVE";
  if (value === "ready" || value === "planned") return "READY";
  return "NONE";
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  problem: string;
  decision: string | null;
  executionStatus: string | null;
  measure: string;
  baseline: number | null;
  goal: number | null;
  observed: number | null;
  outcome: NpsOutcomeStatus;
  learning: string | null;
  resolution: NpsResolutionStatus;
  next: string | null;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem this Outcome belongs to before judging whether it is resolved.";
  }
  if (input.outcome === "UNKNOWN" || input.outcome === "TOO_EARLY") {
    const completed = /completed/i.test(input.executionStatus ?? "");
    return [
      `Problem: ${input.problem}`,
      input.decision ? `Decision: ${input.decision}` : null,
      completed ? "Execution: Completed" : null,
      completed
        ? "Outcome: Execution completed, but there is not enough Outcome evidence yet to determine whether it worked."
        : "Outcome: There is not enough Outcome evidence yet to determine whether it worked.",
      input.next ? `Next step: ${input.next}` : null,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
  }
  const unit = "%";
  return [
    `Problem: ${input.problem}`,
    input.decision ? `Decision: ${input.decision}` : null,
    /completed/i.test(input.executionStatus ?? "") ? "Execution: Completed" : null,
    input.baseline != null ? `Baseline ${input.measure}: ${input.baseline}${unit}` : null,
    input.goal != null ? `Goal: ${input.goal}${unit}` : null,
    input.observed != null ? `Observed ${input.measure}: ${input.observed}${unit}` : null,
    `Outcome: ${
      input.outcome === "PARTIAL"
        ? "Performance improved, but the Goal has not been reached."
        : input.outcome === "MEETS_EXPECTATION" || input.outcome === "EXCEEDS_EXPECTATION"
          ? "The observed result meets or exceeds the Goal."
          : input.outcome === "BELOW_EXPECTATION" || input.outcome === "MIXED"
            ? "The observed result is below expectation or mixed."
            : "The observed result is not yet a success judgment."
    }`,
    input.learning ? `What we learned: ${input.learning}` : null,
    `Problem status: ${
      input.resolution === "RESOLVED"
        ? "Resolved."
        : input.resolution === "PARTIALLY_RESOLVED" || input.resolution === "IMPROVED"
          ? "Partially resolved."
          : input.resolution === "WORSENED"
            ? "Worsened."
            : input.resolution === "NOT_RESOLVED"
              ? "Not resolved."
              : "Unknown."
    }`,
    input.next ? `Next step: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export function observationFromEcaEvidence(
  evidence: EcaOutcomeEvidence | null | undefined,
  extras?: Partial<NpsOutcomeObservation>,
): NpsOutcomeObservation {
  const primary = evidence?.primary ?? null;
  return freeze({
    decisionId: extras?.decisionId ?? evidence?.decisionId ?? null,
    decisionTitle: extras?.decisionTitle ?? null,
    executionId: extras?.executionId ?? evidence?.executionId ?? null,
    executionStatus: extras?.executionStatus ?? evidence?.executionStatus ?? null,
    executionTitle: extras?.executionTitle ?? null,
    measure: extras?.measure ?? primary?.measure ?? null,
    baseline: extras?.baseline ?? primary?.baseline ?? null,
    goal: extras?.goal ?? primary?.target ?? null,
    expected: extras?.expected ?? primary?.target ?? null,
    observed: extras?.observed ?? primary?.observed ?? null,
    unit: extras?.unit ?? primary?.unit ?? "%",
    evidencePresent: extras?.evidencePresent ?? primary?.observed != null,
    causeHypothesisInvalidated: extras?.causeHypothesisInvalidated,
    optionsNoLongerAppropriate: extras?.optionsNoLongerAppropriate,
    executionFailedOperationally: extras?.executionFailedOperationally,
    comparisonRequired: extras?.comparisonRequired,
  });
}

export function composeNpsOutcomeLearning(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly commitment?: NpsDecisionCommitment | null;
  readonly observation?: Partial<NpsOutcomeObservation> | null;
  readonly ecaOutcome?: EcaExecutiveOutcomeJudgment | null;
  readonly ecaLearning?: EcaExecutiveLearningClosureJudgment | null;
}): NpsOutcomeLearning {
  const observation: NpsOutcomeObservation = freeze({
    decisionId: input.observation?.decisionId ?? input.commitment?.approvedDecisionId ?? input.pathFacts.approvedDecisionId,
    decisionTitle: input.observation?.decisionTitle ?? input.commitment?.committedOption ?? null,
    executionId: input.observation?.executionId ?? input.pathFacts.execution.executionId,
    executionStatus: input.observation?.executionStatus ?? input.pathFacts.execution.status,
    executionTitle: input.observation?.executionTitle ?? null,
    measure: input.observation?.measure ?? "OTD",
    baseline: input.observation?.baseline ?? null,
    goal: input.observation?.goal ?? null,
    expected: input.observation?.expected ?? input.observation?.goal ?? null,
    observed: input.observation?.observed ?? null,
    unit: input.observation?.unit ?? "%",
    evidencePresent: input.observation?.evidencePresent === true || input.observation?.observed != null,
    causeHypothesisInvalidated: input.observation?.causeHypothesisInvalidated === true,
    optionsNoLongerAppropriate: input.observation?.optionsNoLongerAppropriate === true,
    executionFailedOperationally: input.observation?.executionFailedOperationally === true,
    comparisonRequired: input.observation?.comparisonRequired === true,
  });

  const ownershipPath = composeNpsProblemSolvingPath(input.pathFacts);
  if (ownershipPath.problemOwnership !== "DETERMINED") {
    return freeze({
      identity: NPS_OUTCOME_LEARNING_IDENTITY,
      problemId: input.pathFacts.problem.problemId,
      problemTitle: input.pathFacts.problem.problemLabel,
      decisionId: observation.decisionId,
      decisionTitle: observation.decisionTitle,
      executionId: observation.executionId,
      executionStatus: observation.executionStatus,
      baseline: observation.baseline,
      goal: observation.goal,
      expectedOutcome: observation.expected,
      observedOutcome: observation.observed,
      outcomeStatus: "UNKNOWN",
      variance: null,
      evidence: null,
      uncertainties: freeze(["Active Problem is not determined."]),
      learningStatus: "NONE",
      learningStatements: freeze([]),
      learningDurable: false,
      resolutionStatus: "UNKNOWN",
      reassessmentStatus: "NOT_WARRANTED",
      loopBackState: null,
      attribution: "NOT_ESTABLISHED",
      nextStep: "Determine the active Problem",
      action: "CLARIFY_PROBLEM",
      supportingReferences: ownershipPath.supportingReferences,
      path: ownershipPath,
      managerProjection: freeze({
        problem: "Not determined",
        text: managerText({
          ownership: ownershipPath.problemOwnership,
          problem: "This Problem",
          decision: null,
          executionStatus: null,
          measure: "OTD",
          baseline: null,
          goal: null,
          observed: null,
          outcome: "UNKNOWN",
          learning: null,
          resolution: "UNKNOWN",
          next: "Determine the active Problem",
        }),
      }),
      canonicalMutations: freeze([]),
      npsWritesDecision: false,
      writesExecution: false,
      writesOutcome: false,
      writesLearning: false,
      writesGoal: false,
      boundary: NPS_OUTCOME_LEARNING_BOUNDARY,
    });
  }

  const completed = /completed/i.test(observation.executionStatus ?? "");
  const hasNumbers = observation.observed != null;
  const eca = input.ecaOutcome ?? null;
  const learning = input.ecaLearning ?? null;

  let outcomeStatus: NpsOutcomeStatus = "UNKNOWN";
  let resolutionStatus: NpsResolutionStatus = "UNKNOWN";
  let learningStatus: NpsLearningStatus = "NONE";
  let reassessmentStatus: NpsReassessmentStatus = "NOT_WARRANTED";
  let loopBackState: NpsPathState | null = null;
  let action: NpsOutcomeLearning["action"] = "WAIT_FOR_OUTCOME";
  let next = "Observe the Outcome before judging whether the Problem is resolved.";
  const uncertainties: string[] = [];

  if (!completed && !observation.evidencePresent) {
    outcomeStatus = "TOO_EARLY";
    resolutionStatus = "UNKNOWN";
    next = "Wait for Execution to complete, then review Outcome evidence.";
  } else if (completed && !hasNumbers) {
    outcomeStatus = "UNKNOWN";
    resolutionStatus = "UNKNOWN";
    action = "REVIEW_OUTCOME";
    loopBackState = "OUTCOME_REVIEW";
    next = "Capture Outcome evidence before judging whether it worked.";
    uncertainties.push("Outcome evidence is missing after Execution completion.");
  } else if (hasNumbers) {
    const observed = observation.observed as number;
    const baseline = observation.baseline;
    const goal = observation.goal;
    if (baseline != null && observed < baseline) {
      outcomeStatus = "BELOW_EXPECTATION";
      resolutionStatus = "WORSENED";
    } else if (goal != null && observed >= goal) {
      outcomeStatus = observed > goal ? "EXCEEDS_EXPECTATION" : "MEETS_EXPECTATION";
      resolutionStatus = "RESOLVED";
    } else if (baseline != null && goal != null && observed > baseline && observed < goal) {
      outcomeStatus = "PARTIAL";
      resolutionStatus = "PARTIALLY_RESOLVED";
    } else if (baseline != null && observed === baseline) {
      outcomeStatus = "BELOW_EXPECTATION";
      resolutionStatus = "NOT_RESOLVED";
    } else if (eca?.overallInterpretation === "MIXED") {
      outcomeStatus = "MIXED";
      resolutionStatus = "NOT_RESOLVED";
    } else {
      outcomeStatus = "PARTIAL";
      resolutionStatus = "IMPROVED";
    }

    if (observation.causeHypothesisInvalidated || (baseline != null && observed === baseline)) {
      learningStatus = "WEAKENED_HYPOTHESIS";
    } else if (outcomeStatus === "MIXED") {
      learningStatus = "INCONCLUSIVE";
    } else {
      learningStatus = "BOUNDED";
    }

    if (resolutionStatus === "RESOLVED" && !observation.causeHypothesisInvalidated) {
      action = "RESOLVE";
      next = "Treat the Problem as resolved only while this Outcome evidence holds.";
    } else {
      action = "REASSESS";
      reassessmentStatus = "AVAILABLE";
      next = "Reassess the remaining gap before making another Decision.";
    }
  }

  if (observation.executionFailedOperationally) {
    loopBackState = "EXECUTION_READINESS";
    reassessmentStatus = "ROUTED";
    action = "REASSESS";
  } else if (observation.causeHypothesisInvalidated) {
    loopBackState = "CAUSE_ANALYSIS";
    reassessmentStatus = "ROUTED";
    action = "REASSESS";
    next = "Reassess the evidence and remaining contributors.";
  } else if (observation.optionsNoLongerAppropriate) {
    loopBackState = "OPTIONS_AVAILABLE";
    reassessmentStatus = "ROUTED";
  } else if (observation.comparisonRequired) {
    loopBackState = "COMPARING_OPTIONS";
    reassessmentStatus = "ROUTED";
  } else if (reassessmentStatus === "AVAILABLE") {
    loopBackState = "REASSESSMENT";
    reassessmentStatus = "ROUTED";
  } else if (completed && !hasNumbers) {
    loopBackState = "OUTCOME_REVIEW";
  }

  if (learning?.hypothesisEffect === "weakened") {
    learningStatus = "WEAKENED_HYPOTHESIS";
  } else if (learning?.learningState === "INCONCLUSIVE") {
    learningStatus = "INCONCLUSIVE";
  } else if (learning?.learningState === "TENTATIVE" && learningStatus === "NONE") {
    learningStatus = "TENTATIVE";
  }

  const learningStatement =
    learningStatus === "WEAKENED_HYPOTHESIS"
      ? "The observed result weakens the current capacity-contributor hypothesis and supports reassessment. It does not prove capacity is irrelevant."
      : learningStatus === "BOUNDED" && outcomeStatus === "PARTIAL"
        ? "The result is consistent with capacity having some relevance, but it does not confirm capacity as the sole cause."
        : learningStatus === "BOUNDED"
          ? "The result followed this Execution. That is case-specific evidence, not proven cause."
          : learning?.learningStatement ?? null;

  const problemResolved =
    resolutionStatus === "RESOLVED"
      ? true
      : resolutionStatus === "UNKNOWN"
        ? null
        : false;

  const path = composeNpsProblemSolvingPath(
    freeze({
      ...input.pathFacts,
      awaitingCommitment: observation.decisionId ? false : input.pathFacts.awaitingCommitment,
      approvedDecisionId: observation.decisionId ?? input.pathFacts.approvedDecisionId,
      execution: freeze({
        present: Boolean(observation.executionId) || completed || input.pathFacts.execution.present,
        executionId: observation.executionId ?? input.pathFacts.execution.executionId,
        status:
          mapExecutionStatus(observation.executionStatus) === "NONE"
            ? input.pathFacts.execution.status
            : mapExecutionStatus(observation.executionStatus),
        observedFrom: input.pathFacts.execution.observedFrom ?? "CC:11 Execution",
      }),
      outcome: freeze({
        observed: hasNumbers || (completed && outcomeStatus === "UNKNOWN"),
        problemResolved: completed && !hasNumbers ? null : problemResolved,
        observedFrom: "CORE-OUT Outcome",
      }),
    }),
  );

  const variance =
    observation.observed != null && observation.goal != null
      ? `Observed ${observation.observed} vs Goal ${observation.goal}`
      : observation.observed != null && observation.baseline != null
        ? `Observed ${observation.observed} vs baseline ${observation.baseline}`
        : null;

  const projectionText = managerText({
    ownership: path.problemOwnership,
    problem: input.pathFacts.problem.problemLabel ?? "This Problem",
    decision: observation.decisionTitle,
    executionStatus: observation.executionStatus,
    measure: observation.measure ?? "OTD",
    baseline: observation.baseline,
    goal: observation.goal,
    observed: observation.observed,
    outcome: outcomeStatus,
    learning: learningStatement,
    resolution: resolutionStatus,
    next,
  });
  if (/\b(?:NPS|ECA|CC:\d|NCA|CORE-OUT|DTH|resolver|composer|authority)\b/i.test(projectionText)) {
    throw new Error("NPS:8 manager projection leaked architecture terminology");
  }

  return freeze({
    identity: NPS_OUTCOME_LEARNING_IDENTITY,
    problemId: input.pathFacts.problem.problemId,
    problemTitle: input.pathFacts.problem.problemLabel,
    decisionId: observation.decisionId,
    decisionTitle: observation.decisionTitle,
    executionId: observation.executionId,
    executionStatus: observation.executionStatus,
    baseline: observation.baseline,
    goal: observation.goal,
    expectedOutcome: observation.expected,
    observedOutcome: observation.observed,
    outcomeStatus,
    variance,
    evidence: hasNumbers
      ? `${observation.measure ?? "Measure"} observed ${observation.observed}`
      : completed
        ? "Execution completed without Outcome evidence"
        : null,
    uncertainties: freeze(uncertainties),
    learningStatus,
    learningStatements: freeze(learningStatement ? [learningStatement] : []),
    learningDurable: false,
    resolutionStatus,
    reassessmentStatus,
    loopBackState,
    attribution: "NOT_ESTABLISHED",
    nextStep: next,
    action,
    supportingReferences: path.supportingReferences,
    path,
    managerProjection: freeze({
      problem: input.pathFacts.problem.problemLabel ?? "This Problem",
      text: projectionText,
    }),
    canonicalMutations: freeze([]),
    npsWritesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesLearning: false,
    writesGoal: false,
    boundary: NPS_OUTCOME_LEARNING_BOUNDARY,
  });
}

export function attemptNpsOutcomeLearningAdvancement(
  outcome: NpsOutcomeLearning,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{ npsDecisionWrites: 0; executionWrites: 0; outcomeWrites: 0; learningWrites: 0 }> {
  const advanced = attemptNpsPathAdvancement(outcome.path);
  return freeze({
    ...advanced,
    npsDecisionWrites: 0,
    executionWrites: 0,
    outcomeWrites: 0,
    learningWrites: 0,
  });
}
