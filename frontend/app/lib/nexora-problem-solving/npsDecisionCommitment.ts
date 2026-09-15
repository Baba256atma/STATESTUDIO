/**
 * NPA-T NPS:6 — Decision & Commitment.
 *
 * Read-oriented path composition over NPS:5, ECA:8, and observed CC:10 truth.
 * Does not write Decisions, confirmations, or Execution.
 */

import type { EcaExecutiveCommitmentJudgment } from "@/app/lib/nexora-conversation/ecaExecutiveCommitment.ts";
import {
  attemptNpsPathAdvancement,
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsPathState,
  type NpsProblemSolvingPath,
  type NpsSupportingReference,
} from "./npsProblemSolvingPath.ts";
import type { NpsComparisonRecommendation } from "./npsComparisonRecommendation.ts";

export const NPS_DECISION_COMMITMENT_IDENTITY =
  "NPA-T NPS:6/DecisionCommitment" as const;

export const NPS_COMMITMENT_STATUSES = Object.freeze([
  "NOT_READY",
  "REVIEWING_RECOMMENDATION",
  "PREFERENCE_EXPRESSED",
  "COMMITMENT_AMBIGUOUS",
  "CHALLENGE_REQUIRED",
  "AWAITING_CONFIRMATION",
  "READY_FOR_DECISION_HANDOFF",
  "DECISION_APPROVED",
  "DECISION_DECLINED",
  "BLOCKED",
] as const);
export type NpsCommitmentStatus = (typeof NPS_COMMITMENT_STATUSES)[number];

export const NPS_COMMITMENT_INTENTS = Object.freeze([
  "NONE",
  "PREFER_OPTION",
  "COMMIT_TO_OPTION",
  "AMBIGUOUS",
  "DECLINE",
] as const);
export type NpsCommitmentIntent = (typeof NPS_COMMITMENT_INTENTS)[number];

export const NPS_DECISION_HANDOFF_STATUSES = Object.freeze([
  "NOT_AUTHORIZED",
  "READY_FOR_CC10",
  "APPLIED",
  "FAILED",
  "STALE",
] as const);
export type NpsDecisionHandoffStatus = (typeof NPS_DECISION_HANDOFF_STATUSES)[number];

export const NPS_DECISION_COMMITMENT_BOUNDARY = Object.freeze({
  identity: NPS_DECISION_COMMITMENT_IDENTITY,
  newAuthorityLayer: false as const,
  createsCommitmentEngine: false as const,
  createsConfirmationEngine: false as const,
  createsDecisionStore: false as const,
  commitmentOwner: "ECA:8" as const,
  confirmationOwner: "CC:10 pending confirmation" as const,
  decisionWriter: "CC:10 / CC:10R" as const,
  executionOwner: "CC:11" as const,
  recommendationEqualsPreference: false as const,
  preferenceEqualsCommitment: false as const,
  commitmentEqualsApproval: false as const,
  approvalEqualsExecution: false as const,
  autoCommitsRecommendation: false as const,
  npsWritesDecision: false as const,
  npsWritesExecution: false as const,
  pathAdvancementMutatesCanonicalState: false as const,
});

export type NpsCc10Observation = Readonly<{
  approvedDecisionId: string | null;
  status: "none" | "confirmation-required" | "applied" | "failed" | "preference-only" | "already-committed";
  pendingConfirmation: boolean;
  pendingTargetId: string | null;
  pendingTargetLabel: string | null;
  topicChanged: boolean;
  recommendationInvalidated: boolean;
}>;

export type NpsDecisionHandoff = Readonly<{
  owner: "CC:10 / CC:10R";
  npsWritesDecision: false;
  targetProblemId: string | null;
  targetOptionId: string | null;
  targetScenarioId: string | null;
  challengeStatus: string;
  confirmationStatus: string;
  unresolvedConditions: readonly string[];
  status: NpsDecisionHandoffStatus;
}>;

export type NpsDecisionCommitment = Readonly<{
  identity: typeof NPS_DECISION_COMMITMENT_IDENTITY;
  problemId: string | null;
  problemTitle: string | null;
  candidateOptionId: string | null;
  candidateScenarioId: string | null;
  nexoraRecommendation: string | null;
  managerPreference: string | null;
  commitmentStatus: NpsCommitmentStatus;
  commitmentIntent: NpsCommitmentIntent;
  unresolvedConditions: readonly string[];
  remainingUncertainty: string | null;
  challengeRequired: boolean;
  challengeReason: string | null;
  challengeResult: "NONE" | "ISSUED" | "ACKNOWLEDGED";
  confirmationRequired: boolean;
  confirmationStatus: "NONE" | "PENDING" | "CONFIRMED" | "INVALID";
  decisionHandoffStatus: NpsDecisionHandoffStatus;
  approvedDecisionId: string | null;
  committedOption: string | null;
  nextStep: string | null;
  action: "CLARIFY_PROBLEM" | "CLARIFY_TARGET" | "REVIEW" | "CHALLENGE" | "CONFIRM" | "OBSERVE_DECISION";
  decisionHandoff: NpsDecisionHandoff;
  startsExecution: false;
  supportingReferences: readonly NpsSupportingReference[];
  path: NpsProblemSolvingPath;
  managerProjection: Readonly<{ problem: string; text: string }>;
  canonicalMutations: readonly [];
  npsWritesDecision: false;
  writesExecution: false;
  writesOutcome: false;
  boundary: typeof NPS_DECISION_COMMITMENT_BOUNDARY;
}>;

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function matchOption(comparison: NpsComparisonRecommendation, idOrLabel: string | null) {
  if (!idOrLabel) return null;
  const lower = idOrLabel.toLowerCase();
  return (
    comparison.comparedOptions.find(
      (item) =>
        item.optionId === idOrLabel ||
        item.canonicalScenarioId === idOrLabel ||
        item.title.toLowerCase() === lower ||
        item.title.toLowerCase().includes(lower) ||
        lower.includes(item.title.toLowerCase()),
    ) ?? null
  );
}

function managerText(input: {
  ownership: NpsProblemSolvingPath["problemOwnership"];
  title: string;
  recommendation: string | null;
  preference: string | null;
  condition: string | null;
  status: NpsCommitmentStatus;
  approved: string | null;
  next: string | null;
}): string {
  if (input.ownership !== "DETERMINED") {
    return "The active Problem is not determined. Clarify which Problem this Decision would belong to before committing.";
  }
  if (input.status === "DECISION_APPROVED" && input.approved) {
    return [
      `Decision approved: ${input.approved}`,
      `Problem: ${input.title}`,
      "Next step: Check execution readiness.",
    ].join("\n");
  }
  if (input.status === "AWAITING_CONFIRMATION" || input.status === "CHALLENGE_REQUIRED") {
    return [
      `You are about to approve ${input.preference ?? input.recommendation ?? "this option"} as the Decision for ${input.title}.`,
      input.condition ? `Remaining condition: ${input.condition}` : null,
      "Approve this Decision?",
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");
  }
  if (input.status === "COMMITMENT_AMBIGUOUS") {
    return `Do you want to approve ${input.recommendation ?? "this option"} as the Decision, or keep it as the preferred option for now?`;
  }
  return [
    `Problem: ${input.title}`,
    input.recommendation ? `Recommended direction: ${input.recommendation}` : null,
    input.preference ? `Your preference: ${input.preference}` : "Your preference: none yet.",
    input.condition ? `Important unresolved condition: ${input.condition}` : null,
    input.next ? `Next step: ${input.next}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export function composeNpsDecisionCommitment(input: {
  readonly pathFacts: NpsCanonicalFacts;
  readonly comparison: NpsComparisonRecommendation;
  readonly eca?: EcaExecutiveCommitmentJudgment | null;
  readonly cc10?: Partial<NpsCc10Observation>;
}): NpsDecisionCommitment {
  const cc10: NpsCc10Observation = freeze({
    approvedDecisionId: input.cc10?.approvedDecisionId ?? null,
    status: input.cc10?.status ?? "none",
    pendingConfirmation: input.cc10?.pendingConfirmation === true,
    pendingTargetId: input.cc10?.pendingTargetId ?? null,
    pendingTargetLabel: input.cc10?.pendingTargetLabel ?? null,
    topicChanged: input.cc10?.topicChanged === true,
    recommendationInvalidated: input.cc10?.recommendationInvalidated === true,
  });
  const eca = input.eca ?? null;
  const ownership = input.comparison.path.problemOwnership;
  const condition =
    input.comparison.recommendationConditions[0] ??
    (input.comparison.recommendationStatus === "CONDITIONAL_RECOMMENDATION"
      ? "Supplier availability has not been confirmed."
      : null);
  const uncertainty = input.comparison.recommendationUncertainty;

  if (ownership !== "DETERMINED") {
    const path = input.comparison.path;
    return freeze({
      identity: NPS_DECISION_COMMITMENT_IDENTITY,
      problemId: input.comparison.problemId,
      problemTitle: input.comparison.problemTitle,
      candidateOptionId: null,
      candidateScenarioId: null,
      nexoraRecommendation: input.comparison.nexoraRecommendation,
      managerPreference: input.comparison.managerPreference,
      commitmentStatus: "BLOCKED",
      commitmentIntent: "NONE",
      unresolvedConditions: freeze([]),
      remainingUncertainty: uncertainty,
      challengeRequired: false,
      challengeReason: null,
      challengeResult: "NONE",
      confirmationRequired: false,
      confirmationStatus: "NONE",
      decisionHandoffStatus: "NOT_AUTHORIZED",
      approvedDecisionId: null,
      committedOption: null,
      nextStep: "Determine the active Problem",
      action: "CLARIFY_PROBLEM",
      decisionHandoff: freeze({
        owner: "CC:10 / CC:10R",
        npsWritesDecision: false,
        targetProblemId: null,
        targetOptionId: null,
        targetScenarioId: null,
        challengeStatus: "NONE",
        confirmationStatus: "NONE",
        unresolvedConditions: freeze([]),
        status: "NOT_AUTHORIZED",
      }),
      startsExecution: false,
      supportingReferences: path.supportingReferences,
      path,
      managerProjection: freeze({
        problem: "Not determined",
        text: managerText({
          ownership,
          title: "This Problem",
          recommendation: null,
          preference: null,
          condition: null,
          status: "BLOCKED",
          approved: null,
          next: "Determine the active Problem",
        }),
      }),
      canonicalMutations: freeze([]),
      npsWritesDecision: false,
      writesExecution: false,
      writesOutcome: false,
      boundary: NPS_DECISION_COMMITMENT_BOUNDARY,
    });
  }

  const ecaTarget = eca?.target?.id ?? eca?.target?.label ?? null;
  const preferred =
    matchOption(input.comparison, ecaTarget) ??
    matchOption(input.comparison, input.comparison.managerPreference) ??
    matchOption(input.comparison, cc10.pendingTargetId);
  const recommended = matchOption(input.comparison, input.comparison.recommendedOptionId);
  const candidate = preferred ?? recommended;
  const staleYes = cc10.topicChanged && (eca?.commitmentState === "NONE" || eca == null);
  const invalidated = cc10.recommendationInvalidated === true && !cc10.approvedDecisionId;

  let status: NpsCommitmentStatus = "REVIEWING_RECOMMENDATION";
  let intent: NpsCommitmentIntent = "NONE";
  let handoff: NpsDecisionHandoffStatus = "NOT_AUTHORIZED";
  let confirmationStatus: NpsDecisionCommitment["confirmationStatus"] = "NONE";
  let action: NpsDecisionCommitment["action"] = "REVIEW";
  let next = "Review this condition before approving the Decision.";

  if (cc10.approvedDecisionId && (cc10.status === "applied" || cc10.status === "already-committed")) {
    status = "DECISION_APPROVED";
    intent = "COMMIT_TO_OPTION";
    handoff = "APPLIED";
    confirmationStatus = "CONFIRMED";
    action = "OBSERVE_DECISION";
    next = "Check execution readiness.";
  } else if (cc10.status === "failed") {
    status = "AWAITING_CONFIRMATION";
    intent = "COMMIT_TO_OPTION";
    handoff = "FAILED";
    confirmationStatus = "PENDING";
    action = "CONFIRM";
    next = "The Decision was not recorded. Review commitment again.";
  } else if (invalidated) {
    status = "CHALLENGE_REQUIRED";
    intent = "NONE";
    handoff = "NOT_AUTHORIZED";
    action = "CHALLENGE";
    next = "The previous recommendation no longer holds. Review the updated options before approving.";
  } else if (staleYes) {
    status = "REVIEWING_RECOMMENDATION";
    handoff = "STALE";
    confirmationStatus = "INVALID";
    action = "REVIEW";
    next = "There is no valid pending Decision proposal to approve.";
  } else if (
    eca?.targetResolution === "AMBIGUOUS" ||
    (eca?.commitmentState === "EXPLICIT_COMMITMENT" && !eca.target && input.comparison.comparedOptions.length >= 2)
  ) {
    status = "COMMITMENT_AMBIGUOUS";
    intent = "AMBIGUOUS";
    action = "CLARIFY_TARGET";
    next = "Name the option to approve, or keep it as a preference.";
  } else if (eca?.commitmentState === "CANCELLED") {
    status = "DECISION_DECLINED";
    intent = "DECLINE";
    next = "No Decision was approved.";
  } else if (eca?.commitmentState === "PREFERENCE" || eca?.commitmentState === "INTENT") {
    status = "PREFERENCE_EXPRESSED";
    intent = "PREFER_OPTION";
    next = "Review unresolved conditions before approving a Decision.";
  } else if (eca?.challengeRequired) {
    status = "CHALLENGE_REQUIRED";
    intent = eca.commitmentState === "EXPLICIT_COMMITMENT" ? "COMMIT_TO_OPTION" : "NONE";
    action = "CHALLENGE";
    next = "Resolve or acknowledge the material condition before approval.";
  } else if (eca?.canonicalHandoffAllowed && eca.commitmentState === "EXPLICIT_COMMITMENT") {
    status = "READY_FOR_DECISION_HANDOFF";
    intent = "COMMIT_TO_OPTION";
    handoff = "READY_FOR_CC10";
    confirmationStatus = "CONFIRMED";
    action = "CONFIRM";
    next = "Record the confirmed Decision.";
  } else if (eca?.confirmationRequired || eca?.commitmentState === "AWAITING_CONFIRMATION" || cc10.pendingConfirmation) {
    status = "AWAITING_CONFIRMATION";
    intent = "COMMIT_TO_OPTION";
    confirmationStatus = "PENDING";
    action = "CONFIRM";
    next = "Approve this Decision?";
  } else if (eca?.commitmentState === "EXPLICIT_COMMITMENT") {
    status = "AWAITING_CONFIRMATION";
    intent = "COMMIT_TO_OPTION";
    confirmationStatus = "PENDING";
    action = "CONFIRM";
  }

  const approvedId = status === "DECISION_APPROVED" ? cc10.approvedDecisionId : null;
  const recommendationReady = input.comparison.recommendationStatus != null;
  const awaiting = status !== "DECISION_APPROVED" && recommendationReady;
  const path = composeNpsProblemSolvingPath(
    freeze({
      ...input.pathFacts,
      investigationPresent: true,
      evidenceState: input.pathFacts.evidenceState === "NONE" ? "PARTIAL" : input.pathFacts.evidenceState,
      causeHypothesesAvailable: true,
      scenarioIds: freeze(input.comparison.comparedOptions.map((item) => item.canonicalScenarioId ?? item.optionId)),
      comparisonAvailable: true,
      recommendationReady: true,
      awaitingCommitment: awaiting && !approvedId,
      approvedDecisionId: approvedId,
      execution: freeze({ present: false, executionId: null, status: "NONE" as const }),
    }),
  );

  const preferenceLabel =
    eca?.commitmentState === "PREFERENCE" ||
    eca?.commitmentState === "INTENT" ||
    eca?.commitmentState === "EXPLICIT_COMMITMENT"
      ? preferred?.title ?? eca?.target?.label ?? input.comparison.managerPreference
      : input.comparison.managerPreference;
  const projectionText = managerText({
    ownership,
    title: input.comparison.problemTitle ?? "This Problem",
    recommendation: input.comparison.nexoraRecommendation,
    preference: preferenceLabel,
    condition,
    status,
    approved: approvedId ? preferred?.title ?? candidate?.title ?? input.comparison.nexoraRecommendation : null,
    next,
  });
  if (/\b(?:NPS|ECA|CC:\d|NCA|resolver|composer|authority)\b/i.test(projectionText)) {
    throw new Error("NPS:6 manager projection leaked architecture terminology");
  }

  return freeze({
    identity: NPS_DECISION_COMMITMENT_IDENTITY,
    problemId: input.comparison.problemId,
    problemTitle: input.comparison.problemTitle,
    candidateOptionId: candidate?.optionId ?? null,
    candidateScenarioId: candidate?.canonicalScenarioId ?? null,
    nexoraRecommendation: input.comparison.nexoraRecommendation,
    managerPreference: preferenceLabel,
    commitmentStatus: status,
    commitmentIntent: intent,
    unresolvedConditions: freeze(condition ? [condition] : [...input.comparison.recommendationConditions]),
    remainingUncertainty: uncertainty,
    challengeRequired: eca?.challengeRequired === true || status === "CHALLENGE_REQUIRED",
    challengeReason:
      eca?.preDecisionChallenge && eca.preDecisionChallenge !== "NONE" ? eca.preDecisionChallenge : condition,
    challengeResult: eca?.challengeAcknowledged ? "ACKNOWLEDGED" : eca?.challengeRequired ? "ISSUED" : "NONE",
    confirmationRequired: status === "AWAITING_CONFIRMATION" || eca?.confirmationRequired === true,
    confirmationStatus,
    decisionHandoffStatus: handoff,
    approvedDecisionId: approvedId,
    committedOption: approvedId ? preferred?.title ?? candidate?.title ?? null : null,
    nextStep: next,
    action,
    decisionHandoff: freeze({
      owner: "CC:10 / CC:10R",
      npsWritesDecision: false,
      targetProblemId: input.comparison.problemId,
      targetOptionId: candidate?.optionId ?? eca?.target?.id ?? null,
      targetScenarioId: candidate?.canonicalScenarioId ?? null,
      challengeStatus: eca?.preDecisionChallenge ?? "NONE",
      confirmationStatus,
      unresolvedConditions: freeze(condition ? [condition] : []),
      status: handoff,
    }),
    startsExecution: false,
    supportingReferences: path.supportingReferences,
    path,
    managerProjection: freeze({
      problem: input.comparison.problemTitle ?? "This Problem",
      text: projectionText,
    }),
    canonicalMutations: freeze([]),
    npsWritesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    boundary: NPS_DECISION_COMMITMENT_BOUNDARY,
  });
}

export function attemptNpsDecisionCommitmentAdvancement(
  commitment: NpsDecisionCommitment,
): ReturnType<typeof attemptNpsPathAdvancement> &
  Readonly<{ npsDecisionWrites: 0; executionWrites: 0 }> {
  const advanced = attemptNpsPathAdvancement(commitment.path);
  return freeze({
    ...advanced,
    npsDecisionWrites: 0,
    executionWrites: 0,
  });
}

export function npsPathStateAfterCommitment(commitment: NpsDecisionCommitment): NpsPathState | null {
  return commitment.path.currentState;
}
