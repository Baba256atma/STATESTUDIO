/**
 * MO-INT:1 — compose one manager-facing experience from MO:1–MO:6.
 * Does not recalculate intelligence. Does not create MO:7.
 */

import { findMentionedManagerObjectId } from "./managerObjectIntent.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import { isExecutiveAttentionUtterance } from "./managerObjectAttentionEngine.ts";
import type { ManagerObjectTurn } from "./managerObjectInteraction.ts";
import type { ManagerObjectSession } from "./managerObjectActive.ts";
import {
  MANAGER_OBJECT_EXPERIENCE_BOUNDARY,
  managerObjectExperienceIntegrationIdentity,
  type ExecutiveManagerLane,
  type ExecutiveManagerResponse,
} from "./managerObjectExperienceTypes.ts";

export {
  MANAGER_OBJECT_EXPERIENCE_BOUNDARY,
  managerObjectExperienceIntegrationIdentity,
} from "./managerObjectExperienceTypes.ts";
export type { ExecutiveManagerResponse } from "./managerObjectExperienceTypes.ts";

export function getManagerObjectExperienceIntegrationIdentity(): {
  readonly id: typeof managerObjectExperienceIntegrationIdentity;
  readonly version: "1.0.0";
  readonly namespace: "nexora.manager-object.executive-experience-integration";
} {
  return Object.freeze({
    id: managerObjectExperienceIntegrationIdentity,
    version: "1.0.0" as const,
    namespace: "nexora.manager-object.executive-experience-integration" as const,
  });
}

export function verifyManagerObjectExperienceIntegration(): { readonly ok: true } {
  if (
    getManagerObjectExperienceIntegrationIdentity().id !==
    "MO-INT:1/ManagerObjectExecutiveExperienceIntegration"
  ) {
    throw new Error("MO-INT:1 identity mismatch");
  }
  if (MANAGER_OBJECT_EXPERIENCE_BOUNDARY.createsMo7) {
    throw new Error("MO-INT:1 must not create MO:7");
  }
  if (MANAGER_OBJECT_EXPERIENCE_BOUNDARY.usesLlm) {
    throw new Error("MO-INT:1 must remain deterministic");
  }
  if (MANAGER_OBJECT_EXPERIENCE_BOUNDARY.commitsDecisions) {
    throw new Error("MO-INT:1 must not commit decisions");
  }
  if (MANAGER_OBJECT_EXPERIENCE_BOUNDARY.startsExecution) {
    throw new Error("MO-INT:1 must not start execution");
  }
  return Object.freeze({ ok: true as const });
}

export function composeExecutiveManagerExperience(input: {
  readonly utterance: string;
  readonly originalResponse: string;
  readonly conversationalKind: string;
  readonly turn: ManagerObjectTurn;
  readonly previousSession?: ManagerObjectSession | null;
  readonly recommendationPresent?: boolean;
  readonly scenarioPresent?: boolean;
  readonly decisionCommitmentPresent?: boolean;
}): ExecutiveManagerResponse {
  const normalized = normalizeUtterance(input.utterance);
  const lane = routeExecutiveManagerLane({
    normalized,
    utterance: input.utterance,
    kind: input.conversationalKind,
    intent: input.turn.intent,
    previous: input.previousSession,
    recommendationPresent: input.recommendationPresent === true,
    scenarioPresent: input.scenarioPresent === true,
    decisionCommitmentPresent: input.decisionCommitmentPresent === true,
  });
  const composed = composeLane(lane, normalized, input);
  const answer = sanitizeManagerCopy(composed.answer);
  return Object.freeze({
    integrationId: managerObjectExperienceIntegrationIdentity,
    lane,
    subject: input.turn.context.identity.value,
    goal:
      input.turn.navigation.goal.source === "unknown"
        ? null
        : input.turn.navigation.goal.title,
    answer,
    whyItMatters: composed.whyItMatters ? sanitizeManagerCopy(composed.whyItMatters) : null,
    currentPosition: composed.currentPosition
      ? sanitizeManagerCopy(composed.currentPosition)
      : null,
    attention: composed.attention ? sanitizeManagerCopy(composed.attention) : null,
    intervention: composed.intervention
      ? sanitizeManagerCopy(composed.intervention)
      : null,
    recommendedNextStep: composed.recommendedNextStep,
    alternatives: Object.freeze(composed.alternatives),
    evidence: Object.freeze(composed.evidence),
    uncertainty: Object.freeze(composed.uncertainty),
    availableActions: Object.freeze(composed.availableActions),
    compactContext: composeCompactContext(input.turn),
    usesLlm: false,
    commitsDecision: false,
    startsExecution: false,
    stealsDirectFocus: false,
  });
}

export function routeExecutiveManagerLane(input: {
  readonly normalized: string;
  readonly utterance: string;
  readonly kind: string;
  readonly intent: ManagerObjectTurn["intent"];
  readonly previous?: ManagerObjectSession | null;
  readonly recommendationPresent: boolean;
  readonly scenarioPresent: boolean;
  readonly decisionCommitmentPresent: boolean;
}): ExecutiveManagerLane {
  if (
    input.kind === "greet" ||
    input.kind === "help" ||
    input.kind === "commit-decision" ||
    input.kind === "prefer-option" ||
    input.kind === "confirm-decision-commitment"
  ) {
    return "advisor";
  }
  if (/what about /.test(input.normalized)) return "compare";
  if (isExecutiveAttentionUtterance(input.utterance) || /^(?:why this)$/.test(input.normalized)) {
    return "attention";
  }
  if (input.intent === "WHY" && input.previous?.attentionPrompted === true) {
    return "attention";
  }
  if (input.scenarioPresent || input.decisionCommitmentPresent) return "advisor";
  if (
    input.kind === "explore-scenario" ||
    input.kind === "show-scenarios" ||
    input.kind === "define-scenario"
  ) {
    return "advisor";
  }
  if (input.kind === "recommend" || input.intent === "RECOMMEND") {
    if (/what\s+should\s+i\s+do\s+next/.test(input.normalized)) return "next-action";
    if (input.previous) return "explain";
    return "advisor";
  }
  if (input.intent === "WHY" && input.previous?.journeyPrompted === true) {
    return "journey";
  }
  if (input.intent === "WHY" && input.previous?.explorationPrompted === true) {
    return "explore";
  }
  if (
    /^(?:where are we(?: now)?|what have we (?:done so far|resolved)|what is still (?:unresolved|open)|what is blocking us|why is it blocking|where does .+ fit|have we made a decision|has execution started|do we have an outcome|did it move us toward the goal|what did we learn|are we finished)$/.test(
      input.normalized,
    )
  ) {
    return "journey";
  }
  if (
    /how does this (?:help|affect) my goal|what is my current goal|(?:my|our) goal is|is now the priority/.test(
      input.normalized,
    )
  ) {
    return "goal";
  }
  if (
    input.intent === "NEXT_ACTION" ||
    /what should i do next|where should i look next|what should i look at next/.test(
      input.normalized,
    )
  ) {
    return "next-action";
  }
  if (
    input.intent === "RELATIONSHIPS" ||
    /^(?:explain(?:\s+(?:this|it|that))?|what is this)\b/.test(input.normalized) ||
    /^explain /.test(input.normalized)
  ) {
    return "explain";
  }
  if (input.intent === "IMPACT" || input.intent === "WHY") return "explain";
  return "advisor";
}

function composeLane(
  lane: ExecutiveManagerLane,
  normalized: string,
  input: {
    readonly originalResponse: string;
    readonly turn: ManagerObjectTurn;
    readonly previousSession?: ManagerObjectSession | null;
  },
): {
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
} {
  const turn = input.turn;
  const next = resolveSingleNextStep(turn);
  if (lane === "advisor") {
    return baseFields(input.originalResponse, next, turn);
  }
  if (lane === "compare") {
    return baseFields(composeCompare(turn, normalized), next, turn);
  }
  if (lane === "attention") {
    return {
      ...baseFields(composeAttentionAnswer(turn, normalized), next, turn),
      attention: turn.attention.primaryAttention?.label ?? turn.attention.attentionState,
      intervention: humanizeIntervention(turn.attention.interventionAssessment.need),
    };
  }
  if (lane === "journey") {
    return {
      ...baseFields(composeJourneyAnswer(turn, normalized), next, turn),
      currentPosition: describeJourneyPosition(turn),
    };
  }
  if (lane === "goal") {
    return {
      ...baseFields(composeGoalAnswer(turn, normalized), next, turn),
      whyItMatters: turn.navigation.reasoningSummary,
    };
  }
  if (lane === "explore") {
    const recommended =
      turn.navigation.recommendedPath?.path ?? turn.exploration.recommendedPaths[0] ?? null;
    const why = turn.navigation.recommendedPath?.why ?? recommended?.reason ?? null;
    const answer =
      recommended && why
        ? `${recommended.label}. ${why}`
        : turn.exploration.managerFacingText;
    return {
      ...baseFields(answer, next, turn),
      recommendedNextStep: recommended?.label ?? next,
    };
  }
  if (lane === "explain") {
    return composeExplainAnswer(turn, normalized, next);
  }
  return composeNextActionAnswer(turn, next, normalized);
}

function composeExplainAnswer(
  turn: ManagerObjectTurn,
  normalized: string,
  next: string | null,
): ReturnType<typeof baseFields> & { readonly whyItMatters: string | null } {
  const explanation = turn.explanation.managerFacingText.trim();
  if (/why does it matter/.test(normalized)) {
    const why =
      turn.explanation.significance ??
      turn.navigation.reasoningSummary ??
      explanation;
    return {
      ...baseFields(why, next, turn),
      whyItMatters: why,
    };
  }
  if (
    turn.intent === "RELATIONSHIPS" ||
    turn.intent === "RECOMMEND" ||
    turn.intent === "WHY" ||
    /what is connected|what does it affect/.test(normalized)
  ) {
    return {
      ...baseFields(explanation, next, turn),
      whyItMatters: null,
    };
  }
  const primary = explanation || turn.explanation.summary;
  const goalKnown =
    turn.navigation.goal.source !== "unknown" &&
    Boolean(turn.navigation.goal.title) &&
    !/unknown/i.test(turn.navigation.goal.title);
  const why = goalKnown
    ? `${turn.context.identity.value ?? "This"} is relevant to ${turn.navigation.goal.title}.`
    : null;
  const lines = [primary];
  if (
    why &&
    !/does not yet know which business outcome/i.test(primary ?? "") &&
    !overlapsCopy(primary, why)
  ) {
    lines.push(why);
  }
  return {
    ...baseFields(lines.filter(Boolean).join(" "), next, turn),
    whyItMatters: why,
  };
}

function overlapsCopy(left: string | null | undefined, right: string): boolean {
  if (!left) return false;
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  return a.includes(b.slice(0, Math.min(24, b.length)));
}

function composeNextActionAnswer(
  turn: ManagerObjectTurn,
  next: string | null,
  normalized: string,
): ReturnType<typeof baseFields> {
  const lookNext = /look at next|explore next|look at first/.test(normalized);
  if (lookNext && !turn.navigation.goal.managerConfirmed) {
    return baseFields(turn.exploration.managerFacingText.trim(), next, turn);
  }
  const decisionPending =
    turn.journey.journeyState === "AWAITING_DECISION" ||
    turn.journey.blocker?.kind === "DECISION_REQUIRED";
  if (decisionPending && !lookNext) {
    const label = next ?? "the pending decision";
    return baseFields(
      `The strongest next step is to review ${label}. The current journey is waiting on a decision, and that requires your authority. Nexora can explain the recommendation, but the commitment remains yours.`,
      next,
      turn,
    );
  }
  if (turn.navigation.goal.managerConfirmed && turn.navigation.managerFacingText.trim()) {
    return baseFields(turn.navigation.managerFacingText.trim(), next, turn);
  }
  return baseFields(turn.exploration.managerFacingText.trim(), next, turn);
}

function composeJourneyAnswer(turn: ManagerObjectTurn, normalized: string): string {
  if (/what have we (?:done so far|resolved)/.test(normalized)) {
    return turn.journey.accomplishedText;
  }
  if (/what is still (?:unresolved|open)/.test(normalized)) {
    return turn.journey.unresolvedText;
  }
  if (/what is blocking us|why is it blocking/.test(normalized)) {
    return sanitizeManagerCopy(turn.journey.blockerText.replace(/Current blocker: [A-Z_]+/, (match) =>
      match.replace(/[A-Z_]+$/, (kind) => humanizeToken(kind)),
    ));
  }
  if (/where does .+ fit/.test(normalized)) return turn.journey.objectFit;
  if (/have we made a decision/.test(normalized)) {
    return `Decision: ${humanizeToken(turn.journey.decisionState)}. Viewing a decision is not committing it.`;
  }
  if (/has execution started/.test(normalized)) {
    return `Execution: ${humanizeToken(turn.journey.executionState)}. Viewing execution is not starting execution.`;
  }
  if (/do we have an outcome|did it move us toward the goal/.test(normalized)) {
    return `Outcome: ${humanizeToken(turn.journey.outcomeState)}. Missing outcome remains unknown.`;
  }
  if (/what did we learn/.test(normalized)) {
    return `Learning: ${humanizeToken(turn.journey.learningState)}. Learning is not invented from an outcome.`;
  }
  if (/are we finished/.test(normalized)) {
    return `${describeJourneyPosition(turn)} Nexora does not automatically close goals.`;
  }
  const next = resolveSingleNextStep(turn);
  const blocker = turn.journey.blocker
    ? `Current blocker: ${humanizeToken(turn.journey.blocker.kind)}.`
    : "Current blocker: none.";
  return [
    turn.navigation.goal.source === "unknown"
      ? "Goal: unknown."
      : `Goal: ${turn.navigation.goal.title}.`,
    `Where we are: ${describeJourneyPosition(turn)}`,
    blocker,
    next ? `Recommended next: ${next}.` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

function composeGoalAnswer(turn: ManagerObjectTurn, normalized: string): string {
  if (/how does this (?:help|affect) my goal/.test(normalized)) {
    return `${turn.journey.objectFit} ${turn.navigation.reasoningSummary}`.trim();
  }
  return turn.navigation.managerFacingText.trim();
}

function composeAttentionAnswer(turn: ManagerObjectTurn, normalized: string): string {
  const attention = turn.attention;
  if (/why not |what about /.test(normalized)) {
    return composeCompare(turn, normalized);
  }
  if (/do i need to intervene|should i intervene|do i need to do anything/.test(normalized)) {
    return `Intervention: ${humanizeIntervention(attention.interventionAssessment.need)}. ${attention.interventionAssessment.reason} Nexora is not performing the intervention.`;
  }
  if (/continue without me|leave this alone|can this continue/.test(normalized)) {
    if (attention.doNotDisturb || attention.safeToContinueItems.length > 0) {
      return (
        attention.safeToContinueItems[0] ??
        "This can continue without manager intervention for now."
      );
    }
    return attention.managerFacingText;
  }
  if (/what happens if i (?:do nothing|don.?t)/.test(normalized)) {
    return attention.inactionConsequence;
  }
  if (/does this need my decision|need my decision|do i need to make a decision/.test(normalized)) {
    return `A manager decision ${
      attention.interventionAssessment.need === "DECISION_REQUIRED" ? "is required" : "is not currently required"
    }. Viewing a decision is not committing it.`;
  }
  if (/is execution okay/.test(normalized)) {
    return `Execution is ${humanizeToken(turn.journey.executionState)}. ${
      attention.safeToContinueItems.find((line) => /execution/i.test(line)) ??
      "Nexora is not starting or changing execution."
    }`;
  }
  if (/why this/.test(normalized) || turn.intent === "WHY") {
    return attention.reasoningSummary || attention.managerFacingText;
  }
  const primary = attention.primaryAttention;
  if (attention.doNotDisturb && primary == null) {
    return "No manager intervention is required right now. Existing work can continue without interruption.";
  }
  if (attention.comparablePriority) {
    return sanitizeManagerCopy(attention.managerFacingText);
  }
  const next = resolveSingleNextStep(turn);
  const lines = [
    primary
      ? `Needs your attention: ${primary.label}.`
      : "No manager intervention is required right now.",
    primary ? `Why now: ${primary.reason}` : null,
    `Intervention: ${humanizeIntervention(attention.interventionAssessment.need)}.`,
    next ? `Recommended next: ${next}.` : null,
  ];
  const watch = attention.secondaryItems.filter((item) => item.attentionLevel === "WATCH");
  if (watch.length > 0) {
    lines.push(`Also watching: ${watch.map((item) => item.label).join("; ")}.`);
  }
  if (attention.safeToContinueItems[0]) lines.push(attention.safeToContinueItems[0]);
  if (
    primary?.kind === "EVIDENCE" ||
    primary?.epistemicStatus === "UNKNOWN" ||
    attention.secondaryItems.some((item) => item.kind === "EVIDENCE")
  ) {
    lines.push("Don't have enough evidence to invent additional attention facts.");
  }
  return lines.filter(Boolean).join(" ");
}

function composeCompare(turn: ManagerObjectTurn, normalized: string): string {
  const mentioned = findMentionedManagerObjectId(
    normalized,
    projectManagerObjectConversationalSubjects(),
  );
  const primary = turn.attention.primaryAttention;
  const item =
    turn.attention.attentionItems.find((candidate) => candidate.subjectId === mentioned) ??
    null;
  const mentionedLabel =
    item?.label ??
    (mentioned
      ? turn.exploration.availablePaths.find((path) => path.targetObjectId === mentioned)?.label
      : null);
  if (primary && mentionedLabel && item && item.attentionId !== primary.attentionId) {
    const reason =
      primary.journeyRelevance === "BLOCKER"
        ? "it is currently blocking the active journey"
        : primary.goalRelevance === "DIRECT"
          ? "it is directly relevant to the active goal"
          : "available executive context ranks it higher";
    return `${mentionedLabel} is relevant, but it is not currently blocking the active journey. ${primary.label} outranks ${mentionedLabel} because ${reason}. This ranking is inferred and is not a causal claim.`;
  }
  if (primary && mentionedLabel) {
    return `${primary.label} is currently the highest-priority attention candidate relative to ${mentionedLabel}. ${turn.attention.reasoningSummary}`;
  }
  return turn.attention.reasoningSummary || turn.attention.managerFacingText;
}

function resolveSingleNextStep(turn: ManagerObjectTurn): string | null {
  const blocker = turn.journey.blocker;
  if (blocker?.kind === "DECISION_REQUIRED" || turn.journey.decisionState === "proposed") {
    return (
      blocker?.recommendedResolutionPath ??
      turn.attention.primaryAttention?.recommendedPath ??
      turn.navigation.recommendedPath?.path.label ??
      "Review the pending decision"
    );
  }
  if (blocker?.recommendedResolutionPath) return blocker.recommendedResolutionPath;
  if (
    turn.attention.primaryAttention?.interventionNeed === "DECISION_REQUIRED" ||
    turn.attention.primaryAttention?.interventionNeed === "ACTION_REQUIRED"
  ) {
    return (
      turn.attention.primaryAttention.recommendedPath ??
      turn.attention.primaryAttention.label
    );
  }
  return (
    turn.navigation.recommendedPath?.path.label ??
    turn.exploration.recommendedPaths[0]?.label ??
    null
  );
}

function describeJourneyPosition(turn: ManagerObjectTurn): string {
  const state = turn.journey.journeyState;
  if (state === "AWAITING_DECISION") {
    return "The issue is understood and scenarios are available. The journey is currently waiting on a decision.";
  }
  if (state === "EXECUTING") {
    return "A decision is committed and work is in execution.";
  }
  if (state === "AWAITING_OUTCOME") {
    return "Execution is complete and the journey is waiting for an observed outcome.";
  }
  if (state === "STALLED") return "Progress appears stalled on the current blocker.";
  if (turn.journey.currentPhase === "GOAL") return "The goal is known and the journey is beginning.";
  if (turn.navigation.goal.source === "unknown") {
    return "The current object is in focus, but the goal is not yet established.";
  }
  return humanizeToken(state);
}

function composeCompactContext(turn: ManagerObjectTurn): string {
  const parts: string[] = [];
  if (turn.context.identity.value) parts.push(turn.context.identity.value);
  if (turn.navigation.goal.source !== "unknown") {
    parts.push(`Goal: ${turn.navigation.goal.title}`);
  }
  if (turn.journey.journeyState === "AWAITING_DECISION") {
    parts.push("Awaiting decision");
  } else if (turn.attention.doNotDisturb) {
    parts.push("No intervention required");
  } else if (turn.attention.primaryAttention) {
    parts.push(`Needs attention: ${turn.attention.primaryAttention.label}`);
  }
  return parts.join(" · ");
}

function baseFields(
  answer: string,
  next: string | null,
  turn: ManagerObjectTurn,
): {
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
} {
  return {
    answer,
    whyItMatters: null,
    currentPosition: null,
    attention: null,
    intervention: null,
    recommendedNextStep: next,
    alternatives: Object.freeze(
      turn.exploration.recommendedPaths.slice(1, 3).map((path) => path.label),
    ),
    evidence: Object.freeze(turn.explanation.evidence.map((item) => item.text)),
    uncertainty: Object.freeze([...turn.attention.unknowns]),
    availableActions: Object.freeze(
      turn.explanation.availableActions.map((action) => action.label),
    ),
  };
}

export function sanitizeManagerCopy(text: string): string {
  return text
    .replace(/\bUnknown goal\b/gi, "a goal that is not yet confirmed")
    .replace(/\bMO:[1-6]\b/g, "Nexora")
    .replace(/\bMO-INT:1\b/g, "Nexora")
    .replace(/\b(?:NEX-EXP|NEX-E2E|CC|EI|APP-4|CORE-OUT):\S+/g, "Nexora")
    .replace(/\bepistemicStatus\b/g, "confidence")
    .replace(/\brankingSignal\s*=\s*\d+/gi, "")
    .replace(/\b(?:obj|ctx|goal)-[a-z0-9-]+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function humanizeToken(value: string): string {
  return value.toLowerCase().replace(/_/g, " ");
}

function humanizeIntervention(need: string): string {
  if (need === "NOT_REQUIRED") return "not required";
  if (need === "DECISION_REQUIRED") return "DECISION_REQUIRED";
  if (need === "ACTION_REQUIRED") return "ACTION_REQUIRED";
  return humanizeToken(need);
}

function normalizeUtterance(utterance: string): string {
  return utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
}
