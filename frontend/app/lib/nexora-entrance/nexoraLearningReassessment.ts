/**
 * NEX-EXP:10 — Learning, Reassessment & Next Executive Cycle experience.
 * Interprets evidence. Does not auto-change Goal, Decision, or Execution.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  buildCycle,
  buildLearningContext,
  isLearningReassessmentUtterance,
  learningAuthorities,
  maybePersistLearning,
} from "./nexoraLearningReassessmentResolution.ts";
import {
  getNexoraLearningReassessmentIdentity,
  NEXORA_LEARNING_REASSESSMENT_BOUNDARY,
  verifyNexoraLearningReassessment,
  type LearningReassessmentState,
  type NexoraLearningReassessmentSession,
} from "./nexoraLearningReassessmentTypes.ts";

export {
  getNexoraLearningReassessmentIdentity,
  NEXORA_LEARNING_REASSESSMENT_BOUNDARY,
  verifyNexoraLearningReassessment,
};
export type { NexoraLearningReassessmentSession } from "./nexoraLearningReassessmentTypes.ts";

const LEARNING_SLOT = [4.35, 2.15, 0] as const;
export const NEXORA_LEARNING_OBJECT_ID = "learning-exp10" as const;

export function createNexoraLearningReassessmentSession(): NexoraLearningReassessmentSession {
  return Object.freeze({
    state: "NOT_STARTED",
    context: null,
    cycle: null,
    askedQuestionKeys: [],
    introduced: false,
    memoryId: null,
    lastCommittedDecision: null,
    lastMutatedExecution: null,
    lastMutatedGoal: null,
  });
}

export function overlayLearningOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraLearningReassessmentSession | null,
): NexoraMVPObjectInteractionCatalog {
  if (!session?.context?.supportedLearnings.length) return catalog;
  const id = NEXORA_LEARNING_OBJECT_ID;
  if (catalog.objects.some((entry) => entry.id === id)) return catalog;
  const outcomeId =
    catalog.objects.find((entry) => entry.id === "outcome-exp9")?.id ??
    null;
  const goalId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ??
    NEXORA_EXECUTIVE_GOAL_OBJECT_ID;
  return Object.freeze({
    ...catalog,
    objects: Object.freeze([
      ...catalog.objects,
      Object.freeze({
        id,
        label: "Learning",
        kind: "object" as const,
        position: LEARNING_SLOT,
        status: "stable" as const,
        attention: "normal" as const,
      }),
    ]),
    relationships: Object.freeze([
      ...catalog.relationships,
      ...(outcomeId
        ? [
            Object.freeze({
              id: `rel-outcome-learning-${id}`,
              sourceId: outcomeId,
              targetId: id,
            }),
          ]
        : []),
      Object.freeze({
        id: `rel-goal-learning-${id}`,
        sourceId: goalId,
        targetId: id,
      }),
    ]),
  });
}

export function shouldNexoraLearningReassessmentOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  const ready =
    entrance.outcomeMonitoring?.state === "READY_FOR_LEARNING_REASSESSMENT";
  if (!ready && !entrance.learningReassessment?.introduced) return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized) || isManagerObjectUtterance(normalized)) {
    return false;
  }
  if (/^why$/.test(normalized)) {
    return Boolean(entrance.learningReassessment?.introduced);
  }
  return isLearningReassessmentUtterance(normalized);
}

export type NexoraLearningReassessmentTurnResult = {
  readonly session: NexoraLearningReassessmentSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraLearningReassessmentTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
}): NexoraLearningReassessmentTurnResult {
  const previous =
    input.entrance.learningReassessment ??
    createNexoraLearningReassessmentSession();
  const normalized = input.utterance.toLowerCase().replace(/[.!?]+$/g, "");
  const handoff = input.entrance.outcomeMonitoring?.handoff ?? null;
  const draft = buildLearningContext({
    entrance: input.entrance,
    handoff,
    memoryStatus: previous.context?.memoryStatus ?? "NOT_WRITTEN",
  });
  const persist = maybePersistLearning({
    context: draft,
    previousMemoryId: previous.memoryId,
    supersede: /that learning is wrong|supersede that learning/.test(normalized),
  });
  const context = Object.freeze({
    ...draft,
    memoryStatus: persist.memoryStatus,
  });
  const cycle = buildCycle({
    entrance: input.entrance,
    handoff,
    context,
    utterance: input.utterance,
  });
  let state: LearningReassessmentState = context.supportedLearnings.length
    ? "LEARNING_AVAILABLE"
    : "LEARNING_PARTIAL";
  if (!handoff?.observedOutcomes.length) state = "LEARNING_CONTEXT_READY";
  if (cycle.cycleStatus === "REASSESSMENT_REQUIRED") state = "REASSESSMENT_REQUIRED";
  if (cycle.cycleStatus === "COMPLETE_WITH_OPEN_QUESTIONS") {
    state = "REASSESSMENT_OPTIONAL";
  }
  if (cycle.reassessmentRoute === "CLOSE") state = "CYCLE_COMPLETE";
  if (state === "REASSESSMENT_REQUIRED" || state === "CYCLE_COMPLETE") {
    state = "READY_FOR_NEXT_EXECUTIVE_CYCLE";
  }
  const response = answerLearningQuestion({
    normalized,
    context,
    cycle,
    entrance: input.entrance,
  });
  const next = Object.freeze({
    ...previous,
    state,
    context,
    cycle,
    askedQuestionKeys: Object.freeze([
      ...new Set([...previous.askedQuestionKeys, normalized.slice(0, 48)]),
    ]),
    introduced: true,
    memoryId: persist.memoryId,
    lastCommittedDecision: null,
    lastMutatedExecution: null,
    lastMutatedGoal: null,
  });
  return Object.freeze({
    session: next,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayLearningOnEntranceCatalog(input.catalog, next),
  });
}

export function learningReassessmentUsesExistingAuthorities(): boolean {
  const authorities = learningAuthorities();
  return (
    NEXORA_LEARNING_REASSESSMENT_BOUNDARY.commitsDecision === false &&
    NEXORA_LEARNING_REASSESSMENT_BOUNDARY.parallelLearningEngine === false &&
    authorities.causalStatus === "unknown" &&
    authorities.outcomeEqualsLearning === false &&
    authorities.singleCaseEqualsGeneralRule === false &&
    authorities.writesChatAsLearning === false &&
    getNexoraLearningReassessmentIdentity().id ===
      "NEX-EXP:10/LearningReassessmentNextExecutiveCycle"
  );
}

function answerLearningQuestion(input: {
  readonly normalized: string;
  readonly context: NonNullable<NexoraLearningReassessmentSession["context"]>;
  readonly cycle: NonNullable<NexoraLearningReassessmentSession["cycle"]>;
  readonly entrance: NexoraEntranceSession;
}): string {
  const { normalized, context, cycle, entrance } = input;
  const recommendation =
    entrance.scenarioComparison?.recommendation?.recommendedScenarioId ?? null;
  const chosen = entrance.decisionExperience?.handoff?.chosenScenario ?? null;
  if (!context.supportedLearnings.length && /what did we learn|are we done/.test(normalized)) {
    return "Nexora does not yet have enough evidence to form a reliable Learning from this cycle. Outcome is not Learning. Cycle status is not COMPLETE.";
  }
  if (/^why$/.test(normalized)) {
    return `Learning stays scoped THIS_CASE_ONLY. Evidence: ${context.evidence.join("; ") || "none"}. Assumptions: ${context.assumptionReviews.map((entry) => `${entry.status}`).join(", ") || "NOT_TESTED"}. Causal attribution remains UNKNOWN.`;
  }
  if (/what did we learn/.test(normalized)) {
    return `${context.supportedLearnings.map((entry) => entry.statement).join(" ")} Scope: THIS_CASE_ONLY. This is Learning, not a restatement of Outcome alone.`;
  }
  if (/which assumptions were correct/.test(normalized)) {
    const held = context.assumptionReviews.filter((entry) => entry.status === "SUPPORTED");
    return held.length
      ? `SUPPORTED: ${held.map((entry) => entry.statement).join("; ")}`
      : "No Scenario assumption is currently marked SUPPORTED. Presence is not the same as being tested.";
  }
  if (/which assumptions were wrong/.test(normalized)) {
    const failed = context.assumptionReviews.filter(
      (entry) => entry.status === "NOT_SUPPORTED",
    );
    return failed.length
      ? `NOT_SUPPORTED: ${failed.map((entry) => entry.statement).join("; ")} That does not mean the whole Decision was wrong.`
      : "No tested assumption is currently NOT_SUPPORTED.";
  }
  if (/what did we not learn/.test(normalized)) {
    const untested = context.assumptionReviews.filter((entry) => !entry.tested);
    return `NOT_TESTED/UNKNOWN: ${untested.map((entry) => entry.statement).join("; ") || "untested assumptions remain"}. Causation is UNKNOWN.`;
  }
  if (/did this prove the decision was right/.test(normalized)) {
    return `Decision evaluation: ${cycle.decisionOutcomeSupport}. That is not a declaration that the Decision was objectively correct.`;
  }
  if (/did this prove .* caused/.test(normalized)) {
    return "Causal status is UNKNOWN. Nexora will not emit CONFIRMED without causal authority. One result is not a general rule.";
  }
  if (/what should we reassess|what should we change|what should we do differently next time/.test(normalized)) {
    return `Reassessment route: ${cycle.reassessmentRoute}. ${cycle.nextExecutiveQuestion} Nexora does not change Goal, Decision, or Execution automatically.`;
  }
  if (/is the goal still valid/.test(normalized)) {
    return `Goal reassessment: ${cycle.goalReassessment}. Manager retains Goal authority.`;
  }
  if (/should we change the goal/.test(normalized)) {
    return `Consideration: ${cycle.goalReassessment}. The Goal is not changed automatically.`;
  }
  if (/should we revisit the problem/.test(normalized)) {
    return `Issue reassessment may be needed if Goal impact worsened. Next-cycle route currently ${cycle.reassessmentRoute}.`;
  }
  if (/should we explore new scenarios/.test(normalized)) {
    return cycle.reassessmentRoute === "SCENARIO"
      ? cycle.nextExecutiveQuestion
      : `Nexora will not automatically reopen all Scenarios. Current route: ${cycle.reassessmentRoute}`;
  }
  if (/should we revisit the decision/.test(normalized)) {
    return `Decision reassessment: ${cycle.decisionReassessment}. No new Decision is committed.`;
  }
  if (/should we change execution/.test(normalized)) {
    return `Execution reassessment may suggest ${cycle.decisionReassessment}. Current execution is unchanged.`;
  }
  if (/where should the next cycle start/.test(normalized)) {
    return `Next cycle starts at ${cycle.reassessmentRoute}, not an automatic restart at Goal. ${cycle.nextExecutiveQuestion}`;
  }
  if (/what will nexora remember/.test(normalized)) {
    return context.memoryStatus === "WRITTEN" || context.memoryStatus === "SUPERSEDED"
      ? `Durable Learning was written with provenance. Chat history is not Learning memory.`
      : `Memory status ${context.memoryStatus}. Weak speculation is not persisted.`;
  }
  if (/why will you remember/.test(normalized)) {
    return `Provenance: ${context.provenance.join(", ")}. Evidence: ${context.evidence.join(", ") || "none"}.`;
  }
  if (/are we done/.test(normalized)) {
    return `Cycle status: ${cycle.cycleStatus}. That is not automatic Goal closure.`;
  }
  if (/what was wrong/.test(normalized)) {
    const failed = context.assumptionReviews.find(
      (entry) => entry.status === "NOT_SUPPORTED",
    );
    return failed
      ? `The assumption that ${failed.statement} was not supported by the observed outcome. That is not “the whole decision was wrong.”`
      : "Nexora will not invent a fault. Untested assumptions remain NOT_TESTED.";
  }
  if (/should we try again/.test(normalized)) {
    return `Next-cycle route ${cycle.reassessmentRoute}. Nexora will not automatically rerun execution.`;
  }
  if (/what would you do next/.test(normalized)) {
    return cycle.nextExecutiveQuestion;
  }
  if (recommendation && chosen && recommendation !== chosen) {
    return `Recommendation ${recommendation} was not rewritten. Manager chose ${chosen}. Outcome stands separately. Nexora was not declared wrong from one case.`;
  }
  return `${cycle.learningSummary} Next: ${cycle.nextExecutiveQuestion}`;
}

function isManagerObjectUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)? .+|what is connected|where should i look next|how does this (?:help|affect|support) my goal|where are we(?: now)?|what needs my attention)$/.test(
      normalized,
    ) ||
    /^explain .+/i.test(normalized) ||
    /^show learning/.test(normalized)
  );
}

function isIdentityReserved(normalized: string): boolean {
  return (
    /what do you know about me/.test(normalized) || normalized === "who are you"
  );
}
