/**
 * NEX-ENT-FIX1 — entrance conversation continuity.
 * Composes educational responses from meaning + lesson events.
 * Does not own NLU, Advisor, Stage, or business state.
 */

import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  NEXORA_GUIDED_ENTRANCE_AFTER_CAPABILITY_ACTIONS,
  NEXORA_GUIDED_ENTRANCE_CAPABILITY_PROGRESS_ACTIONS,
  NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS,
  NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS,
  NEXORA_STAGE_APPEARS_PROGRESS_ACTIONS,
  NEXORA_STAGE_APPEARS_SATURATED_ACTIONS,
  NEXORA_STAGE_EDUCATION_AFTER_DEMO_ACTIONS,
  NEXORA_STAGE_EDUCATION_FOCUS_ACTIONS,
  NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS,
  inactiveNexoraEntranceConversationContinuitySession,
  verifyNexoraEntranceConversationContinuity,
  type NexoraEntranceConversationContinuitySession,
  type NexoraEntranceExplanationDepth,
  type NexoraGuidedEntranceSuggestedAction,
} from "./nexoraGuidedEntranceTypes.ts";
import {
  emptyNexoraConversationWorkingContext,
  recordConversationKernelDecision,
  type NexoraConversationWorkingContext,
} from "../nexora-conversation/nexoraConversationWorkingContext.ts";
import {
  advanceConversationCoverage,
  defaultMoveForCoverage,
} from "../nexora-conversation/nexoraConversationProgression.ts";
import type { NexoraConversationalMove } from "../nexora-conversation/nexoraConversationalMove.ts";
import type { NexoraConversationKernelDecision } from "../nexora-conversation/nexoraConversationPolicy.ts";

export {
  NEXORA_ENTRANCE_CONVERSATION_CONTINUITY_BOUNDARY,
  getNexoraEntranceConversationContinuityIdentity,
  inactiveNexoraEntranceConversationContinuitySession,
  verifyNexoraEntranceConversationContinuity,
} from "./nexoraGuidedEntranceTypes.ts";

export const CAPABILITY_INTRODUCTORY_COPY =
  "I help you understand what matters, examine the situation, explore possible actions, and support decisions and their outcomes. You stay in control.";

export const CAPABILITY_DEEPENED_COPY =
  "In practice, I can help you work with Goals, data, Problems, Scenarios, Decisions, Execution, and Outcomes. You’ll see those capabilities as we build your workspace.";

export const CAPABILITY_PRACTICAL_COPY =
  "I can show you rather than describe it. The Stage is where those capabilities appear as we work.";

export const FOCUS_EXPLAIN_BEFORE_COPY =
  "Focus means choosing what we’re examining right now. When something becomes the focus, Nexora can organize the Stage around it and bring relevant context into view.";

export const FOCUS_EXPLAIN_AFTER_COPY =
  "Of course. Focus means choosing what we’re examining right now. When something becomes the focus, Nexora can organize the Stage around it and bring relevant context into view.";

export const FOCUS_EXPLAIN_AFTER_REPEAT_COPY =
  "What you’re seeing is the Stage staying organized around the current subject rather than filling the workspace with everything.";

export const FOCUS_DEMO_COPY =
  "I’ve brought Nexora into focus. When something matters, we organize the workspace around what you’re examining. You can select it on the Stage if you want to feel that.";

export const FOCUS_DEMO_AGAIN_COPY =
  "Sure — I’ll show it again. Nexora is already the current focus, so notice how the Stage organizes around it.";

export const FOCUS_WHY_INTRO_COPY =
  "Focus helps reduce clutter so we can examine one thing at a time instead of everything at once.";

export const FOCUS_WHY_DEEPENED_COPY =
  "More specifically, it lets the Stage organize related context around the thing you are currently investigating instead of showing every Object at once.";

export const APPEARS_EXAMPLES_COPY =
  "For example, a Goal, a KPI, a Problem or Risk, a Scenario, a Decision, or data context can appear when they are relevant. I’m not placing them on Stage just to illustrate that.";

export const APPEARS_PROGRESS_COPY =
  "Those are the main kinds of things that can appear here. The important point is that the Stage changes with what you’re examining. I can show you how that works with Focus.";

export const APPEARS_CLARIFY_COPY =
  "I may not be answering the part you mean. Are you asking what kinds of things the Stage can contain, or what is actually on the Stage right now?";

export const CAPABILITY_CLARIFY_COPY =
  "I may not be answering the part you mean. Are you asking what Nexora can help you examine, or which part of the workspace you want to see first?";

export const RELEVANCE_INTRODUCTORY_COPY =
  "Nexora keeps the situation, evidence, options, decisions, and follow-through connected so you can understand what deserves attention before acting.";

export const RELEVANCE_DEEPENED_COPY =
  "The value is not just getting an answer. Nexora keeps the reasoning around a decision visible — what is known, what is uncertain, what options exist, and what happens next.";

export const RELEVANCE_PRACTICAL_COPY =
  "I can show you how the workspace does that, rather than explaining it again.";

export const RELEVANCE_CLARIFY_COPY =
  "Do you mean why Nexora itself is useful, or why the current item on Stage is here?";

export const FOCUS_EXPLAIN_DEEPENED_COPY =
  "In practice, Focus is how we keep the workspace sparse: related context can come into view around the current subject instead of showing everything at once.";

export const FOCUS_EXPLAIN_PROGRESS_COPY =
  "That’s the useful idea. I can show you how Focus organizes the Stage, or we can continue.";

export const FOCUS_EXPLAIN_CLARIFY_COPY =
  "I may not be answering the part you mean. Do you want the idea of Focus, why it matters, or to see it on the Stage?";

export const FOCUS_WHY_PROGRESS_COPY =
  "That’s why Focus is useful in practice. I can show you how the Stage organizes around the current subject, or we can continue.";

export const FOCUS_WHY_CLARIFY_COPY =
  "I may not be answering the part you mean. Are you asking why Focus exists, or what you should do with it next?";

export const STAGE_SIMPLE_COPY =
  "This is the workspace in front of you. We use it to look at the current situation — not a page of permanent charts.";

export const DASHBOARD_WHY_COPY =
  "A dashboard keeps the same charts in place. The Stage is contextual: what you see can change with what we’re examining right now.";

export const APPEARS_NOW_PREFIX =
  "Right now, the Stage is organized around Nexora as the educational presence. I’m not filling it with example business Objects.";

export type NexoraEntranceProgressionMode = "ANSWER" | "DEEPEN" | "PROGRESS" | "CLARIFY";

export const KNOW_FOCUS_COPY =
  "Understood. We can continue without another Focus demonstration.";

export const CORRECTION_COPY =
  "Tell me what you want to understand — the Stage, Focus, or what Nexora can do — and I’ll follow that.";

export function conversationContinuityOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraEntranceConversationContinuitySession {
  const stored =
    session?.guidedIntroduction?.conversationContinuity ??
    inactiveNexoraEntranceConversationContinuitySession();
  if (stored.working) {
    return Object.freeze({
      ...stored,
      working: Object.freeze({
        ...emptyNexoraConversationWorkingContext(),
        ...stored.working,
        threads: stored.working.threads ?? Object.freeze([]),
      }),
    });
  }
  return Object.freeze({
    ...stored,
    working: emptyNexoraConversationWorkingContext(),
  });
}

export function advanceExplanationDepth(
  current: NexoraEntranceExplanationDepth,
): NexoraEntranceExplanationDepth {
  return advanceConversationCoverage(current);
}

export function nextCapabilityDepth(
  current: NexoraEntranceExplanationDepth,
): NexoraEntranceExplanationDepth {
  return advanceExplanationDepth(current);
}

export function progressionModeForDepth(
  depth: NexoraEntranceExplanationDepth,
): NexoraEntranceProgressionMode {
  return defaultMoveForCoverage(depth);
}

export function composeCapabilityCopy(depth: NexoraEntranceExplanationDepth): string {
  if (depth === "DEEPENED") return CAPABILITY_DEEPENED_COPY;
  if (depth === "PRACTICAL") return CAPABILITY_PRACTICAL_COPY;
  if (depth === "SATURATED") return CAPABILITY_CLARIFY_COPY;
  return CAPABILITY_INTRODUCTORY_COPY;
}

export function composeRelevanceCopy(depth: NexoraEntranceExplanationDepth): string {
  if (depth === "DEEPENED") return RELEVANCE_DEEPENED_COPY;
  if (depth === "PRACTICAL") return RELEVANCE_PRACTICAL_COPY;
  if (depth === "SATURATED") return RELEVANCE_CLARIFY_COPY;
  return RELEVANCE_INTRODUCTORY_COPY;
}

export function composeAppearsCopy(depth: NexoraEntranceExplanationDepth): string {
  if (depth === "DEEPENED") return APPEARS_EXAMPLES_COPY;
  if (depth === "PRACTICAL") return APPEARS_PROGRESS_COPY;
  if (depth === "SATURATED") return APPEARS_CLARIFY_COPY;
  return "Relevant things from the current situation can appear here when we need them. We don’t fill the Stage with everything at once.";
}

export function composeFocusExplainCopy(input: {
  readonly demonstrated: boolean;
  readonly alreadyExplained: boolean;
  readonly lastAction: NexoraEntranceConversationContinuitySession["lastAction"];
}): string {
  if (input.demonstrated && input.lastAction === "DEMONSTRATE") {
    return input.alreadyExplained ? FOCUS_EXPLAIN_AFTER_REPEAT_COPY : FOCUS_EXPLAIN_AFTER_COPY;
  }
  if (input.demonstrated) return FOCUS_EXPLAIN_AFTER_COPY;
  return FOCUS_EXPLAIN_BEFORE_COPY;
}

export function composeFocusDemoCopy(alreadyDemonstrated: boolean): string {
  return alreadyDemonstrated ? FOCUS_DEMO_AGAIN_COPY : FOCUS_DEMO_COPY;
}

export function composeFocusWhyCopy(depth: NexoraEntranceExplanationDepth): string {
  if (depth === "DEEPENED") return FOCUS_WHY_DEEPENED_COPY;
  if (depth === "PRACTICAL") return FOCUS_WHY_PROGRESS_COPY;
  if (depth === "SATURATED") return FOCUS_WHY_CLARIFY_COPY;
  return FOCUS_WHY_INTRO_COPY;
}

export function composeFocusExplainProgressionCopy(
  depth: NexoraEntranceExplanationDepth,
  demonstratedCopy: string,
): string {
  if (depth === "DEEPENED") return FOCUS_EXPLAIN_DEEPENED_COPY;
  if (depth === "PRACTICAL") return FOCUS_EXPLAIN_PROGRESS_COPY;
  if (depth === "SATURATED") return FOCUS_EXPLAIN_CLARIFY_COPY;
  return demonstratedCopy;
}

export function suggestedActionsForContinuity(input: {
  readonly stageActive: boolean;
  readonly focusDemonstrated: boolean;
  readonly focusExplained: boolean;
  readonly subject: NexoraEntranceConversationContinuitySession["subject"];
  readonly lastAction: NexoraEntranceConversationContinuitySession["lastAction"];
  readonly appearsDepth?: NexoraEntranceExplanationDepth;
  readonly capabilityDepth?: NexoraEntranceExplanationDepth;
}): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (!input.stageActive) {
    if (input.subject === "CAPABILITY") {
      if (
        input.capabilityDepth === "PRACTICAL" ||
        input.capabilityDepth === "SATURATED"
      ) {
        return NEXORA_GUIDED_ENTRANCE_CAPABILITY_PROGRESS_ACTIONS;
      }
      return NEXORA_GUIDED_ENTRANCE_AFTER_CAPABILITY_ACTIONS;
    }
    return NEXORA_GUIDED_ENTRANCE_SUGGESTED_ACTIONS;
  }
  if (input.subject === "APPEARS") {
    if (input.appearsDepth === "SATURATED") return NEXORA_STAGE_APPEARS_SATURATED_ACTIONS;
    if (input.appearsDepth === "PRACTICAL" || input.appearsDepth === "DEEPENED") {
      return NEXORA_STAGE_APPEARS_PROGRESS_ACTIONS;
    }
  }
  if (input.focusDemonstrated && input.focusExplained) {
    if (input.lastAction === "EXPLAIN") {
      return Object.freeze(
        NEXORA_STAGE_EDUCATION_AFTER_DEMO_ACTIONS.filter(
          (action) => action.id !== "explain-saw",
        ),
      );
    }
    return NEXORA_STAGE_EDUCATION_AFTER_DEMO_ACTIONS;
  }
  if (input.focusDemonstrated) {
    return NEXORA_STAGE_EDUCATION_AFTER_DEMO_ACTIONS;
  }
  if (input.focusExplained || input.subject === "FOCUS") {
    return NEXORA_STAGE_EDUCATION_FOCUS_ACTIONS;
  }
  return NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS;
}

export function recordContinuity(
  previous: NexoraEntranceConversationContinuitySession,
  patch: Partial<NexoraEntranceConversationContinuitySession>,
): NexoraEntranceConversationContinuitySession {
  verifyNexoraEntranceConversationContinuity();
  return Object.freeze({
    ...previous,
    working: previous.working ?? emptyNexoraConversationWorkingContext(),
    ...patch,
  });
}

export function recordKernelContinuity(
  previous: NexoraEntranceConversationContinuitySession,
  decision: NexoraConversationKernelDecision,
  patch: Partial<NexoraEntranceConversationContinuitySession> = {},
  extras: Parameters<typeof recordConversationKernelDecision>[2] = {},
): NexoraEntranceConversationContinuitySession {
  const resolvedMove = extras.lastThreadDecision?.resolvedMove ?? decision.move;
  const working = recordConversationKernelDecision(
    previous.working ?? emptyNexoraConversationWorkingContext(),
    decision,
    {
      lastCapabilityRequest: decision.requestedCapability,
      lastCapabilityResult: extras.lastCapabilityResult ?? "NONE",
      pendingOffer:
        extras.pendingOffer !== undefined
          ? extras.pendingOffer
          : resolvedMove === "CONNECT" ||
              resolvedMove === "OFFER_NEXT" ||
              resolvedMove === "SUMMARIZE"
            ? decision.requestedCapability && decision.requestedCapability !== "INVESTIGATE"
              ? Object.freeze({
                  capability: decision.requestedCapability,
                  subjectId: decision.subjectId,
                  purpose: decision.purpose,
                })
              : Object.freeze({
                  capability: "NEXT" as const,
                  subjectId: decision.subjectId,
                  purpose: decision.purpose,
                })
            : null,
      pendingClarification:
        extras.pendingClarification !== undefined
          ? extras.pendingClarification
          : resolvedMove === "CLARIFY"
            ? Object.freeze({
                subjectId: decision.subjectId,
                purpose: decision.purpose,
              })
            : null,
      conversationThread: extras.conversationThread,
      lastThreadDecision: extras.lastThreadDecision,
    },
  );
  return recordContinuity(previous, {
    ...patch,
    working,
  });
}

export function suggestedActionsForObjectProgression(
  move: NexoraConversationalMove,
  coveredPurposes: readonly string[] = Object.freeze([]),
): readonly NexoraGuidedEntranceSuggestedAction[] {
  const covered = new Set(coveredPurposes);
  const hideWhat = covered.has("IDENTIFY") || move === "CLARIFY" || move === "CONNECT" || move === "OFFER_NEXT" || move === "SUMMARIZE";
  const hideWhy = covered.has("WHY_PRESENT");
  const hideDifference = covered.has("COMPARE");
  return Object.freeze(
    NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS.filter((action) => {
      if (action.id === "what-is-this" && hideWhat) return false;
      if (action.id === "why-here" && hideWhy) return false;
      if (action.id === "difference" && hideDifference) return false;
      return true;
    }),
  );
}

export function workingContextOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraConversationWorkingContext {
  return conversationContinuityOf(session).working;
}

export function objectEducationHasStarted(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = session?.guidedIntroduction?.objectEducation.state;
  return Boolean(state && state !== "NOT_STARTED" && state !== "SKIPPED");
}

export function handoffOwnsOrdinaryTurns(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = session?.guidedIntroduction?.personalDemoHandoff?.state;
  return state === "COMPLETED" || state === "SKIPPED";
}
