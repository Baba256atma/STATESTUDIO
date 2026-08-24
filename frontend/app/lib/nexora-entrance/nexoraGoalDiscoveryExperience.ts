/**
 * NEX-EXP:2 — goal discovery turns, object emergence, and Stage overlay.
 * Center transfer uses selectNexoraMVPInteractionSubject.
 */

import {
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { makeGoalContext } from "@/app/lib/manager-object/managerObjectGoalContext.ts";
import type { ExecutiveGoalContext } from "@/app/lib/manager-object/managerObjectGoalTypes.ts";
import { NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID } from "./nexoraEntranceTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  applyGoalUtterance,
  emptyGoalDiscoveryContext,
  extractCausalHypotheses,
  extractCurrentState,
  extractIssueSignals,
  extractSuccessSignals,
  isGoalObjectId,
} from "./nexoraGoalDiscoveryResolution.ts";
import {
  NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
  NEXORA_GOAL_DISCOVERY_BOUNDARY,
  getNexoraGoalDiscoveryExperienceIdentity,
  type ExecutiveGoalObject,
  type NexoraExecutiveContextDiscoveryHandoff,
  type NexoraGoalDiscoverySession,
} from "./nexoraGoalDiscoveryTypes.ts";

export {
  NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
  NEXORA_GOAL_DISCOVERY_BOUNDARY,
  NEXORA_GOAL_RESOLUTION_PRECEDENCE,
  getNexoraGoalDiscoveryExperienceIdentity,
  verifyNexoraGoalDiscoveryExperience,
} from "./nexoraGoalDiscoveryTypes.ts";

const ASK_GOAL = "What outcome are you trying to achieve right now?";
const READY_REALITY =
  "I understand what you’re trying to achieve. Next we can look at the current reality around this goal.";

export function createNexoraGoalDiscoverySession(input?: {
  readonly relatedExecutiveContext?: string | null;
  readonly knownGoalSignals?: readonly string[];
  readonly existing?: NexoraGoalDiscoverySession | null;
}): NexoraGoalDiscoverySession {
  if (input?.existing) return input.existing;
  const related = input?.relatedExecutiveContext ?? null;
  const context = emptyGoalDiscoveryContext(related);
  const seeded = input?.knownGoalSignals?.[0]
    ? applyGoalUtterance(
        context,
        `We're trying to ${input.knownGoalSignals[0]}`,
        related,
      ).context
    : context;
  return freezeGoalSession({
    state: seeded.goalTitle ? "GOAL_SIGNAL_FOUND" : "NOT_STARTED",
    context: seeded,
    object: null,
    candidates: Object.freeze([]),
    askedQuestionKeys: Object.freeze([]),
    knownRealitySignals: Object.freeze([]),
    knownIssueSignals: Object.freeze([]),
    managerCausalHypotheses: Object.freeze([]),
    previousTitle: null,
    lastMutation: "NONE",
    handoff: null,
    introduced: false,
  });
}

export function overlayGoalOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraGoalDiscoverySession | null,
): NexoraMVPObjectInteractionCatalog {
  if (!session?.object || !session.context.managerConfirmed) return catalog;
  const goalId = session.object.id;
  const contextObject = catalog.objects.find(
    (object) => object.id === NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  );
  const goalObject = Object.freeze({
    id: goalId,
    label: session.object.displayName,
    kind: "object" as const,
    position: [0, 0, 0] as const,
    status: "stable" as const,
    attention: "important" as const,
  });
  const relatedContext = contextObject
    ? Object.freeze({
        ...contextObject,
        position: [0, 1.55, 0] as const,
        attention: "normal" as const,
      })
    : null;
  const relationship =
    relatedContext != null
      ? Object.freeze({
          id: "rel-executive-context-goal",
          sourceId: relatedContext.id,
          targetId: goalId,
        })
      : null;
  return Object.freeze({
    objects: Object.freeze([
      goalObject,
      ...(relatedContext ? [relatedContext] : []),
      ...catalog.objects.filter(
        (object) =>
          object.id !== goalId &&
          object.id !== NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
      ),
    ]),
    relationships: Object.freeze(
      relationship
        ? [
            relationship,
            ...catalog.relationships.filter(
              (entry) => entry.id !== "rel-executive-context-goal",
            ),
          ]
        : catalog.relationships,
    ),
    contextSubjects: catalog.contextSubjects,
    contextLinks: catalog.contextLinks,
  });
}

export function applyGoalCenterSubject(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  goalId: string,
): NexoraMVPObjectInteractionState {
  return selectNexoraMVPInteractionSubject(state, goalId, catalog);
}

export type NexoraGoalDiscoveryTurnResult = {
  readonly session: NexoraGoalDiscoverySession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly moGoalContext: ExecutiveGoalContext | null;
};

export function isGoalDiscoveryComplete(
  session: NexoraGoalDiscoverySession | null | undefined,
): boolean {
  return (
    session?.state === "GOAL_OBJECT_ACTIVE" ||
    session?.state === "READY_FOR_EXECUTIVE_CONTEXT"
  );
}

export function isManagerObjectGoalUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)?(?: the)? goal|what is connected|where should i look next|how does this (?:help|affect) my goal|why does it matter)$/.test(
      normalized,
    ) || /^show .+/i.test(normalized)
  );
}

export function isGoalUpdateUtterance(normalized: string): boolean {
  if (isIdentityReservedUtterance(normalized)) return false;
  const goalCorrection =
    /^(?:actually|no,?\s+refine|no,?\s+the goal)/.test(normalized) &&
    !/(?:company|role|work at|we(?:'re| are) a)/.test(normalized);
  return (
    goalCorrection ||
    /\bbelow\s+\d/.test(normalized) ||
    /\bby\s+(?:the end of\s+)?q[1-4]/.test(normalized) ||
    /\bsuccess looks like|\bsuccess means/.test(normalized) ||
    /\b(?:currently|we're around|we are around)\s+\d/.test(normalized) ||
    /\bbecause\b/.test(normalized) ||
    OUTCOME_LINE.test(normalized)
  );
}

const OUTCOME_LINE =
  /\b(?:improve|reduce|protect|grow|increase|launch|we need to|trying to)\b/;

export function isGoalMetaUtterance(normalized: string): boolean {
  return (
    /what is my goal/.test(normalized) ||
    /why did you phrase/.test(normalized) ||
    /what do we still not know/.test(normalized) ||
    /how does this connect to my (?:company|context|organization)/.test(normalized)
  );
}

export function shouldNexoraGoalDiscoveryOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  if (entrance.state !== "READY_FOR_GOAL_DISCOVERY") return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReservedUtterance(normalized)) return false;
  if (isGreeting(normalized)) {
    return (
      entrance.workspaceResolution !== "returning-sufficient" &&
      !isGoalDiscoveryComplete(entrance.goalDiscovery)
    );
  }
  if (
    isManagerObjectGoalUtterance(normalized) &&
    isGoalDiscoveryComplete(entrance.goalDiscovery)
  ) {
    return false;
  }
  if (isGoalMetaUtterance(normalized)) return true;
  if (isGoalUpdateUtterance(normalized) && !isManagerObjectGoalUtterance(normalized)) {
    return true;
  }
  return !isGoalDiscoveryComplete(entrance.goalDiscovery);
}

export function resolveNexoraGoalDiscoveryTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
}): NexoraGoalDiscoveryTurnResult {
  const related =
    input.entrance.identityObject?.displayName ??
    input.entrance.identity.executive.displayName ??
    null;
  const previous =
    input.entrance.goalDiscovery ??
    createNexoraGoalDiscoverySession({
      relatedExecutiveContext: related,
      knownGoalSignals: input.entrance.knownGoalSignals,
    });
  const utterance = input.utterance.trim();
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");

  if (isGoalDiscoveryComplete(previous) && isGoalMetaUtterance(normalized)) {
    return metaTurn(previous, input.runtimeState, input.catalog, normalized);
  }
  if (
    isGoalDiscoveryComplete(previous) &&
    isGoalUpdateUtterance(normalized) &&
    !isManagerObjectGoalUtterance(normalized)
  ) {
    const applied = applyGoalUtterance(previous.context, utterance, related);
    const object = toGoalObject(
      applied.context,
      reusableGoalId(applied.existingMatch?.objectId, input.catalog),
    );
    const next = freezeGoalSession({
      ...previous,
      context: applied.context,
      object,
      lastMutation: applied.mutation,
      knownRealitySignals: unique([
        ...previous.knownRealitySignals,
        ...(extractCurrentState(utterance) ? [extractCurrentState(utterance)!] : []),
      ]),
      knownIssueSignals: unique([
        ...previous.knownIssueSignals,
        ...extractIssueSignals(utterance),
      ]),
      managerCausalHypotheses: unique([
        ...previous.managerCausalHypotheses,
        ...extractCausalHypotheses(utterance),
      ]),
    });
    const catalog = overlayGoalOnEntranceCatalog(input.catalog, next);
    const progress = composeProgressResponse(
      applied,
      null,
      extractSuccessSignals(utterance),
    );
    const readyNote =
      applied.context.successSignals.length > 0 &&
      !previous.askedQuestionKeys.includes("ready-reality")
        ? ` ${READY_REALITY}`
        : "";
    return completeGoalTurn({
      session: freezeGoalSession({
        ...next,
        askedQuestionKeys:
          readyNote.length > 0
            ? unique([...next.askedQuestionKeys, "ready-reality"])
            : next.askedQuestionKeys,
      }),
      catalog,
      runtimeState: input.runtimeState,
      response: `${progress}${readyNote}`,
      ownsResponse: true,
      shouldCommitRuntime: false,
      moGoalContext: toMoGoalContext(applied.context, object),
    });
  }
  if (
    isGreeting(normalized) &&
    (previous.state === "NOT_STARTED" || !previous.introduced)
  ) {
    return introduce(previous, input);
  }

  const applied = applyGoalUtterance(previous.context, utterance, related);
  const reality = unique([
    ...previous.knownRealitySignals,
    ...(extractCurrentState(utterance) ? [extractCurrentState(utterance)!] : []),
  ]);
  const issues = unique([
    ...previous.knownIssueSignals,
    ...extractIssueSignals(utterance),
  ]);
  const hypotheses = unique([
    ...previous.managerCausalHypotheses,
    ...extractCausalHypotheses(utterance),
  ]);

  if (applied.candidates.length > 1 && !applied.context.managerConfirmed) {
    const names = applied.candidates.map((candidate) => candidate.title);
    const conflict = applied.context.clarity === "CONFLICTING";
    const next = freezeGoalSession({
      ...previous,
      state: "CLARIFYING",
      context: applied.context,
      candidates: applied.candidates,
      knownRealitySignals: reality,
      knownIssueSignals: issues,
      managerCausalHypotheses: hypotheses,
      introduced: true,
      askedQuestionKeys: unique([...previous.askedQuestionKeys, "priority"]),
    });
    return completeGoalTurn({
      session: next,
      catalog: input.catalog,
      runtimeState: input.runtimeState,
      response: conflict
        ? `Those goals can pull in different directions. Nexora will not resolve the trade-off. Which matters more right now: ${names.join(" or ")}?`
        : `Which matters more right now: ${names.join(" or ")}?`,
      ownsResponse: true,
      shouldCommitRuntime: false,
      moGoalContext: null,
    });
  }

  if (
    applied.context.clarity === "TOO_BROAD" ||
    applied.context.sufficiency === "INSUFFICIENT"
  ) {
    const next = freezeGoalSession({
      ...previous,
      state: "CLARIFYING",
      context: applied.context,
      candidates: applied.candidates,
      knownRealitySignals: reality,
      knownIssueSignals: issues,
      managerCausalHypotheses: hypotheses,
      introduced: true,
      askedQuestionKeys: unique([...previous.askedQuestionKeys, "clarify"]),
    });
    return completeGoalTurn({
      session: next,
      catalog: input.catalog,
      runtimeState: input.runtimeState,
      response:
        "Which outcome matters most: delivery, capacity, cost, quality, or something else?",
      ownsResponse: true,
      shouldCommitRuntime: false,
      moGoalContext: null,
    });
  }

  if (applied.context.needsConfirmation && applied.context.goalTitle) {
    const next = freezeGoalSession({
      ...previous,
      state: "CLARIFYING",
      context: applied.context,
      candidates: applied.candidates,
      previousTitle: previous.context.goalTitle,
      lastMutation: applied.mutation,
      knownRealitySignals: reality,
      knownIssueSignals: issues,
      managerCausalHypotheses: hypotheses,
      introduced: true,
      askedQuestionKeys: unique([...previous.askedQuestionKeys, "confirm"]),
    });
    return completeGoalTurn({
      session: next,
      catalog: input.catalog,
      runtimeState: input.runtimeState,
      response: `So the goal is to ${lowerFirst(applied.context.goalTitle)}. Is that right?`,
      ownsResponse: true,
      shouldCommitRuntime: false,
      moGoalContext: null,
    });
  }

  const canEmerge =
    applied.context.sufficiency === "SUFFICIENT" &&
    applied.context.managerConfirmed &&
    Boolean(applied.context.goalTitle);

  if (!canEmerge && applied.context.goalTitle) {
    const nextQuestion = nextGoalQuestion(
      applied.context,
      previous.askedQuestionKeys,
    );
    const next = freezeGoalSession({
      ...previous,
      state:
        applied.context.sufficiency === "SUFFICIENT"
          ? "GOAL_UNDERSTOOD"
          : "LISTENING",
      context: applied.context,
      candidates: applied.candidates,
      previousTitle: previous.context.goalTitle,
      lastMutation: applied.mutation,
      knownRealitySignals: reality,
      knownIssueSignals: issues,
      managerCausalHypotheses: hypotheses,
      introduced: true,
      askedQuestionKeys: nextQuestion
        ? unique([...previous.askedQuestionKeys, nextQuestion])
        : previous.askedQuestionKeys,
    });
    return completeGoalTurn({
      session: next,
      catalog: input.catalog,
      runtimeState: input.runtimeState,
      response: composeProgressResponse(
        applied,
        nextQuestion,
        extractSuccessSignals(utterance),
      ),
      ownsResponse: true,
      shouldCommitRuntime: false,
      moGoalContext: null,
    });
  }

  if (!canEmerge) {
    return introduce(previous, input);
  }

  const object = toGoalObject(
    applied.existingMatch &&
      reusableGoalId(applied.existingMatch.objectId, input.catalog)
      ? { ...applied.context, source: "RESOLVED" }
      : applied.context,
    reusableGoalId(applied.existingMatch?.objectId, input.catalog),
  );
  const askSuccess =
    applied.context.successSignals.length === 0 &&
    !previous.askedQuestionKeys.includes("success");
  const emerged = freezeGoalSession({
    ...previous,
    state: "READY_FOR_EXECUTIVE_CONTEXT",
    context: applied.context,
    object,
    candidates: applied.candidates,
    previousTitle: previous.context.goalTitle,
    lastMutation: applied.mutation,
    knownRealitySignals: reality,
    knownIssueSignals: issues,
    managerCausalHypotheses: hypotheses,
    introduced: true,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      ...(askSuccess ? ["success"] : []),
      ...(!askSuccess ? ["ready-reality"] : []),
    ]),
    handoff: toHandoff(
      input.entrance,
      applied.context,
      object,
      reality,
      issues,
      hypotheses,
    ),
  });
  const catalog = overlayGoalOnEntranceCatalog(input.catalog, emerged);
  return completeGoalTurn({
    session: emerged,
    catalog,
    runtimeState: applyGoalCenterSubject(
      input.runtimeState,
      catalog,
      object.id,
    ),
    response: askSuccess
      ? `${summarizeGoal(applied.context, related)} What does success look like?`
      : `${summarizeGoal(applied.context, related)} ${READY_REALITY}`,
    ownsResponse: true,
    shouldCommitRuntime: true,
    moGoalContext: toMoGoalContext(applied.context, object),
  });
}

export function toMoGoalContext(
  context: NexoraGoalDiscoverySession["context"],
  object: ExecutiveGoalObject,
): ExecutiveGoalContext {
  return makeGoalContext({
    title: object.displayName,
    goalId: object.id,
    source:
      context.source === "RESOLVED"
        ? "resolved"
        : context.source === "INFERRED"
          ? "inferred"
          : context.source === "UNKNOWN"
            ? "unknown"
            : "explicit",
    managerConfirmed: context.managerConfirmed,
    persisted: object.persistenceState !== "SESSION_ONLY",
    role:
      context.priority === "CONFLICTING"
        ? "CONFLICTING"
        : context.priority === "SECONDARY"
          ? "SECONDARY"
          : context.priority === "UNKNOWN_PRIORITY"
            ? "UNKNOWN_PRIORITY"
            : "ACTIVE",
    description: context.goalDescription,
    epistemicStatus:
      context.epistemicStatus === "INFERRED"
        ? "INFERRED"
        : context.epistemicStatus === "UNKNOWN"
          ? "UNKNOWN"
          : "KNOWN",
  });
}

function introduce(
  previous: NexoraGoalDiscoverySession,
  input: {
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
    readonly entrance: NexoraEntranceSession;
  },
): NexoraGoalDiscoveryTurnResult {
  const signal = previous.context.goalTitle ?? input.entrance.knownGoalSignals[0];
  const next = freezeGoalSession({
    ...previous,
    state: signal ? "GOAL_SIGNAL_FOUND" : "LISTENING",
    introduced: true,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      signal ? "confirm-signal" : "ask-goal",
    ]),
  });
  return completeGoalTurn({
    session: next,
    catalog: input.catalog,
    runtimeState: input.runtimeState,
    response: signal
      ? `You mentioned ${lowerFirst(signal)}. Is that the main goal you want to work on?`
      : `I understand enough about your context. ${ASK_GOAL}`,
    ownsResponse: true,
    shouldCommitRuntime: false,
    moGoalContext: null,
  });
}

function metaTurn(
  session: NexoraGoalDiscoverySession,
  runtimeState: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog,
  normalized: string,
): NexoraGoalDiscoveryTurnResult {
  let response = summarizeGoal(
    session.context,
    session.context.relatedExecutiveContext,
  );
  if (/why did you phrase/.test(normalized)) {
    response =
      session.context.source === "INFERRED"
        ? "That wording is an inference from what you said. It is not a confirmed fact until you accept it."
        : "That phrasing stays close to what you stated. Unknown target, deadline, and KPI values are left unknown.";
  } else if (/what do we still not know/.test(normalized)) {
    response =
      session.context.unknowns.length > 0
        ? `Still unknown: ${session.context.unknowns.join(", ")}.`
        : "No further goal unknowns are recorded.";
  } else if (/connect to my/.test(normalized)) {
    response = session.context.relatedExecutiveContext
      ? `This goal is related to ${session.context.relatedExecutiveContext}. That relationship is recorded; it is not a causal finding.`
      : "The related executive context for this goal is still unknown.";
  } else if (/what is my goal/.test(normalized)) {
    response = session.context.goalTitle
      ? `Goal: ${session.context.goalTitle}. Confirmed: ${
          session.context.managerConfirmed ? "yes" : "not yet"
        }.`
      : "No confirmed goal yet.";
  }
  return completeGoalTurn({
    session,
    catalog,
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    moGoalContext: session.object
      ? toMoGoalContext(session.context, session.object)
      : null,
  });
}

function nextGoalQuestion(
  context: NexoraGoalDiscoverySession["context"],
  asked: readonly string[],
): string | null {
  if (context.needsConfirmation && !asked.includes("confirm")) return "confirm";
  if (context.successSignals.length === 0 && !asked.includes("success")) {
    return "success";
  }
  if (context.priority === "UNKNOWN_PRIORITY" && !asked.includes("priority")) {
    return "priority";
  }
  return null;
}

function composeProgressResponse(
  applied: ReturnType<typeof applyGoalUtterance>,
  nextQuestion: string | null,
  extraSuccess: readonly string[],
): string {
  if (applied.mutation === "CHANGE" && applied.context.goalTitle) {
    return `Understood. I’ll treat the current goal as ${applied.context.goalTitle}.`;
  }
  if (applied.mutation === "REFINEMENT" && applied.context.goalTitle) {
    return `Understood. I’ll refine the goal to ${applied.context.goalTitle}.`;
  }
  if (extraSuccess.length > 0) {
    return `Understood. Success: ${extraSuccess[0]}. Target: ${
      applied.context.targetState ?? "unknown"
    }.`;
  }
  if (applied.context.timeHorizon && nextQuestion == null) {
    return `Understood. Time horizon: ${applied.context.timeHorizon}.`;
  }
  if (extraSuccess.length > 0 && nextQuestion === "priority") {
    return "Got it. Is this the main priority right now?";
  }
  if (nextQuestion === "success") return "What does success look like?";
  if (nextQuestion === "priority") return "Is this the main priority right now?";
  if (nextQuestion === "confirm" && applied.context.goalTitle) {
    return `So the goal is to ${lowerFirst(applied.context.goalTitle)}. Is that right?`;
  }
  return applied.context.goalTitle
    ? `Understood. Goal: ${applied.context.goalTitle}.`
    : ASK_GOAL;
}

function summarizeGoal(
  context: NexoraGoalDiscoverySession["context"],
  related: string | null,
): string {
  return [
    context.goalTitle ? `Goal: ${context.goalTitle}.` : null,
    related ? `Context: ${related}.` : null,
    context.successSignals[0]
      ? `Success: ${context.successSignals[0]}.`
      : "Success: unknown.",
    context.targetState ? `Target: ${context.targetState}.` : "Target: unknown.",
    context.timeHorizon
      ? `Time horizon: ${context.timeHorizon}.`
      : "Time horizon: unknown.",
  ]
    .filter(Boolean)
    .join(" ");
}

function toGoalObject(
  context: NexoraGoalDiscoverySession["context"],
  existingId?: string,
): ExecutiveGoalObject {
  return Object.freeze({
    id: existingId ?? NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    kind: "GOAL",
    displayName: context.goalTitle ?? "Goal",
    description: context.goalDescription,
    scope: context.scope,
    targetState: context.targetState,
    successSignals: context.successSignals,
    source: context.source,
    epistemicStatus: context.epistemicStatus,
    managerConfirmed: context.managerConfirmed,
    persistenceState: existingId ? "REGISTERED_RUNTIME" : "SESSION_ONLY",
  });
}

function toHandoff(
  entrance: NexoraEntranceSession,
  context: NexoraGoalDiscoverySession["context"],
  object: ExecutiveGoalObject,
  reality: readonly string[],
  issues: readonly string[],
  hypotheses: readonly string[],
): NexoraExecutiveContextDiscoveryHandoff {
  return Object.freeze({
    identityContext: entrance.identity,
    executiveContextObject: entrance.identityObject,
    activeGoal: context,
    goalObject: object,
    goalSuccessSignals: context.successSignals,
    goalTargetState: context.targetState,
    goalTimeHorizon: context.timeHorizon,
    knownRealitySignals: Object.freeze([...reality]),
    knownIssueSignals: Object.freeze([...issues]),
    managerCausalHypotheses: Object.freeze([...hypotheses]),
    unknowns: context.unknowns,
    conversationContext: entrance.conversationNotes.slice(-6).join(" | "),
  });
}

function completeGoalTurn(input: {
  readonly session: NexoraGoalDiscoverySession;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly moGoalContext: ExecutiveGoalContext | null;
}): NexoraGoalDiscoveryTurnResult {
  return Object.freeze({
    session: input.session,
    response: input.response,
    ownsResponse: input.ownsResponse,
    shouldCommitRuntime: input.shouldCommitRuntime,
    nextRuntimeState: input.runtimeState,
    catalog: overlayGoalOnEntranceCatalog(input.catalog, input.session),
    moGoalContext: input.moGoalContext,
  });
}

function freezeGoalSession(
  session: NexoraGoalDiscoverySession,
): NexoraGoalDiscoverySession {
  return Object.freeze({
    ...session,
    candidates: Object.freeze([...session.candidates]),
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
    knownRealitySignals: Object.freeze([...session.knownRealitySignals]),
    knownIssueSignals: Object.freeze([...session.knownIssueSignals]),
    managerCausalHypotheses: Object.freeze([...session.managerCausalHypotheses]),
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function isGreeting(normalized: string): boolean {
  return /^(?:hi|hello|hey|good (?:morning|afternoon|evening))$/.test(normalized);
}

function isIdentityReservedUtterance(normalized: string): boolean {
  return (
    /what do you know about me/.test(normalized) ||
    /what do you still need/.test(normalized) ||
    /why are you asking/.test(normalized) ||
    normalized === "who are you" ||
    (/^actually\b/.test(normalized) &&
      /(?:company|role|work at|we(?:'re| are) a)/.test(normalized))
  );
}

function reusableGoalId(
  objectId: string | undefined,
  catalog: NexoraMVPObjectInteractionCatalog,
): string | undefined {
  if (!objectId) return undefined;
  return catalog.objects.some((object) => object.id === objectId)
    ? objectId
    : undefined;
}

function lowerFirst(value: string): string {
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

export function goalDiscoveryUsesExistingAuthorities(): boolean {
  return (
    NEXORA_GOAL_DISCOVERY_BOUNDARY.parallelGoalSystem === false &&
    NEXORA_GOAL_DISCOVERY_BOUNDARY.writesStageCoordinates === false &&
    isGoalObjectId(NEXORA_EXECUTIVE_GOAL_OBJECT_ID) &&
    getNexoraGoalDiscoveryExperienceIdentity().id ===
      "NEX-EXP:2/GoalDiscoveryGoalObjectEmergence"
  );
}
