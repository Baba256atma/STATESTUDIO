/**
 * NEX-EXP:3 — reality discovery turns and restrained Stage overlay.
 * Goal remains center. Emergence does not select Reality objects.
 */

import type {
  NexoraMVPObjectInteractionCatalog,
  NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { isGoalDiscoveryComplete } from "./nexoraGoalDiscoveryExperience.ts";
import {
  isIssueClassificationUtterance,
  isIssueMetaUtterance,
} from "./nexoraIssueDiscoveryResolution.ts";
import { NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID } from "./nexoraEntranceTypes.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import {
  applyRealityUtterance,
  emergeRealityObjects,
  emptyRealityContext,
  extractCausalHypothesis,
  toMoGap,
} from "./nexoraRealityDiscoveryResolution.ts";
import {
  NEXORA_REALITY_DISCOVERY_BOUNDARY,
  getNexoraRealityDiscoveryExperienceIdentity,
  type ExecutiveRealityObservation,
  type NexoraIssueDiscoveryHandoff,
  type NexoraRealityDiscoverySession,
  type RealityEmergedObject,
} from "./nexoraRealityDiscoveryTypes.ts";

export {
  NEXORA_REALITY_DISCOVERY_BOUNDARY,
  NEXORA_REALITY_SOURCE_PRECEDENCE,
  getNexoraRealityDiscoveryExperienceIdentity,
  verifyNexoraRealityDiscoveryExperience,
} from "./nexoraRealityDiscoveryTypes.ts";

const REALITY_SLOTS: ReadonlyArray<readonly [number, number, number]> = [
  [1.75, -0.15, 0],
  [-1.75, -0.15, 0],
  [0, -1.65, 0],
  [1.45, -1.45, 0],
  [-1.45, -1.45, 0],
];

export function createNexoraRealityDiscoverySession(input: {
  readonly goalId: string | null;
  readonly goalTitle: string | null;
  readonly targetState: string | null;
  readonly earlyRealitySignals?: readonly string[];
  readonly existing?: NexoraRealityDiscoverySession | null;
}): NexoraRealityDiscoverySession {
  if (input.existing) return input.existing;
  let context = emptyRealityContext(
    input.goalId,
    input.goalTitle,
    input.targetState,
  );
  if (input.earlyRealitySignals?.[0]) {
    context = applyRealityUtterance(
      context,
      `We're currently around ${input.earlyRealitySignals[0]}`,
      { objects: [], relationships: [], contextSubjects: [], contextLinks: [] },
    );
  }
  return freezeRealitySession({
    state: context.observations.length
      ? "ASSESSING_EXISTING_CONTEXT"
      : "NOT_STARTED",
    context,
    objects: Object.freeze([]),
    askedQuestionKeys: Object.freeze([]),
    introduced: false,
    handoff: null,
  });
}

export function overlayRealityOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  session: NexoraRealityDiscoverySession | null,
): NexoraMVPObjectInteractionCatalog {
  if (!session?.objects.length) return catalog;
  const goalId =
    catalog.objects.find((entry) => entry.id.startsWith("goal-"))?.id ?? null;
  const extra = session.objects.map((object, index) => {
    const prior = catalog.objects.find((entry) => entry.id === object.id);
    return Object.freeze({
      id: object.id,
      label: object.displayName,
      kind: "object" as const,
      position: prior?.position ?? REALITY_SLOTS[index] ?? [1.75, -0.15, 0],
      status: "stable" as const,
      attention: "normal" as const,
    });
  });
  const relationships = goalId
    ? session.objects.map((object) =>
        Object.freeze({
          id: `rel-goal-reality-${object.id}`,
          sourceId: goalId,
          targetId: object.id,
        }),
      )
    : [];
  return Object.freeze({
    objects: Object.freeze([
      ...catalog.objects.filter(
        (object) => !session.objects.some((entry) => entry.id === object.id),
      ),
      ...extra.filter(
        (object) =>
          object.id !== NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID &&
          !object.id.startsWith("goal-"),
      ),
    ]),
    relationships: Object.freeze([
      ...catalog.relationships.filter(
        (rel) => !rel.id.startsWith("rel-goal-reality-"),
      ),
      ...relationships,
    ]),
    contextSubjects: catalog.contextSubjects,
    contextLinks: catalog.contextLinks,
  });
}

export function isRealityDiscoveryComplete(
  session: NexoraRealityDiscoverySession | null | undefined,
): boolean {
  return (
    session?.state === "REALITY_ACTIVE" ||
    session?.state === "READY_FOR_ISSUE_DISCOVERY"
  );
}

export function shouldNexoraRealityDiscoveryOwnUtterance(
  entrance: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (!entrance || entrance.workspaceResolution === "existing-workspace") {
    return false;
  }
  if (!isGoalDiscoveryComplete(entrance.goalDiscovery)) return false;
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isIdentityReserved(normalized)) return false;
  if (
    /^(?:actually|no,?\s+refine|no,?\s+the goal)/.test(normalized) &&
    !/\d+(?:\.\d+)?%/.test(normalized)
  ) {
    return false;
  }
  if (
    isManagerObjectUtterance(normalized) &&
    isRealityDiscoveryComplete(entrance.realityDiscovery)
  ) {
    return false;
  }
  if (
    isRealityDiscoveryComplete(entrance.realityDiscovery) &&
    isIssueClassificationUtterance(normalized)
  ) {
    return false;
  }
  if (
    isRealityDiscoveryComplete(entrance.realityDiscovery) &&
    isIssueMetaUtterance(normalized) &&
    entrance.issueDiscovery?.introduced
  ) {
    return false;
  }
  if (isRealityMetaUtterance(normalized)) return true;
  if (isRealityObservationUtterance(normalized)) return true;
  if (isGreeting(normalized)) {
    return !isRealityDiscoveryComplete(entrance.realityDiscovery);
  }
  return !isRealityDiscoveryComplete(entrance.realityDiscovery);
}

export type NexoraRealityDiscoveryTurnResult = {
  readonly session: NexoraRealityDiscoverySession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

export function resolveNexoraRealityDiscoveryTurn(input: {
  readonly utterance: string;
  readonly entrance: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly authoritativeObservations?: readonly ExecutiveRealityObservation[];
}): NexoraRealityDiscoveryTurnResult {
  const goal = input.entrance.goalDiscovery;
  const previous =
    input.entrance.realityDiscovery ??
    createNexoraRealityDiscoverySession({
      goalId: goal?.object?.id ?? null,
      goalTitle: goal?.context.goalTitle ?? null,
      targetState: goal?.context.targetState ?? null,
      earlyRealitySignals: goal?.knownRealitySignals,
    });
  const utterance = input.utterance.trim();
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");

  if (isGreeting(normalized) && !previous.introduced) {
    return introduce(previous, input);
  }
  if (isRealityMetaUtterance(normalized)) {
    return metaTurn(previous, input, normalized);
  }
  if (!previous.introduced && !isRealityObservationUtterance(normalized)) {
    return introduce(previous, input);
  }

  const nextContext = applyRealityUtterance(
    previous.context,
    utterance,
    input.catalog,
    input.authoritativeObservations ?? [],
  );
  const objects = emergeRealityObjects(nextContext.observations, input.catalog);
  const asked = previous.askedQuestionKeys;
  const shouldAskConditions =
    nextContext.gap?.status === "KNOWN" &&
    objects.length < 2 &&
    !asked.includes("conditions");
  const canClose =
    nextContext.sufficiency === "SUFFICIENT" &&
    !shouldAskConditions &&
    (objects.length > 0 || nextContext.gap?.status === "KNOWN");
  const state = canClose
    ? "READY_FOR_ISSUE_DISCOVERY"
    : nextContext.sufficiency === "SUFFICIENT"
      ? "REALITY_SUFFICIENT"
      : nextContext.sufficiency === "PARTIAL"
        ? "REALITY_PARTIAL"
        : "COLLECTING_REALITY";
  const next = freezeRealitySession({
    ...previous,
    state,
    context: nextContext,
    objects: objects.length && (canClose || asked.includes("conditions"))
      ? objects
      : canClose
        ? objects
        : previous.objects,
    introduced: true,
    askedQuestionKeys: shouldAskConditions
      ? unique([...asked, "conditions"])
      : asked,
    handoff: canClose
      ? toIssueHandoff(input.entrance, nextContext, objects)
      : previous.handoff,
  });
  return Object.freeze({
    session: next,
    response: composeRealityResponse(next, utterance, shouldAskConditions),
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayRealityOnEntranceCatalog(input.catalog, next),
  });
}

export function realityGapForMo(session: NexoraRealityDiscoverySession | null) {
  return session ? toMoGap(session.context.gap) : null;
}

function introduce(
  previous: NexoraRealityDiscoverySession,
  input: {
    readonly entrance: NexoraEntranceSession;
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
): NexoraRealityDiscoveryTurnResult {
  const goalTitle =
    previous.context.goalTitle ??
    input.entrance.goalDiscovery?.context.goalTitle ??
    "this Goal";
  const early = previous.context.observations[0]?.value;
  const next = freezeRealitySession({
    ...previous,
    state: early ? "ASSESSING_EXISTING_CONTEXT" : "REALITY_NEEDED",
    introduced: true,
    askedQuestionKeys: unique([
      ...previous.askedQuestionKeys,
      early ? "confirm-early" : "ask-situation",
    ]),
  });
  return Object.freeze({
    session: next,
    response: early
      ? `Your Goal is ${goalTitle}. You mentioned we're currently around ${early}. Is that the current measure for this Goal?`
      : `Your Goal is ${goalTitle}. What does the current situation look like?`,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: input.catalog,
  });
}

function metaTurn(
  session: NexoraRealityDiscoverySession,
  input: {
    readonly runtimeState: NexoraMVPObjectInteractionState;
    readonly catalog: NexoraMVPObjectInteractionCatalog;
  },
  normalized: string,
): NexoraRealityDiscoveryTurnResult {
  const context = session.context;
  let response =
    context.currentStateSummary ?? "Current reality is not yet established.";
  if (/what don'?t we know|what do we not know|what do we still not know/.test(normalized)) {
    response = context.unknowns[0]
      ? `The main missing piece is ${context.unknowns[0]}.`
      : "No further reality unknowns are recorded.";
  } else if (/what do we know|what is the current reality|current situation/.test(normalized)) {
    response = context.currentStateSummary
      ? `${context.currentStateSummary} This is Reality, not a cause.`
      : "I understand the Goal, but I don’t yet have enough current evidence to establish the gap. You can provide current values, import a CSV, or continue with manager-reported observations.";
  } else if (/what is the current value/.test(normalized)) {
    response = context.gap?.currentValue
      ? `Current value: ${context.gap.currentValue}.`
      : "The current value is unknown.";
  } else if (/what is the target/.test(normalized)) {
    response = context.targetState
      ? `Target: ${context.targetState}.`
      : "The target is unknown.";
  } else if (/what'?s the gap|what is the gap/.test(normalized)) {
    response =
      context.gap?.status === "KNOWN"
        ? `Gap: ${context.gap.delta} ${context.gap.direction === "below-target" ? "below target" : "relative to target"}. This is a performance gap, not a confirmed problem cause.`
        : context.gap?.status === "NOT_MEASURABLE"
          ? "The Goal is understood, but Nexora does not yet have a measurable target-state comparison."
          : "The gap is currently UNKNOWN.";
  } else if (/where did (?:that|this|the) number come from/.test(normalized)) {
    response = context.provenance[0]
      ? `That value comes from ${context.provenance[0]}.`
      : "No stronger provenance than the recorded source is available.";
  } else if (/how current/.test(normalized)) {
    response =
      context.freshness === "STALE"
        ? "The latest available evidence is stale, so Nexora cannot confidently treat it as the current condition."
        : context.freshness === "CURRENT"
          ? "The recorded evidence is treated as current unless marked stale."
          : "Freshness is unknown.";
  } else if (/measured or something i told|measured or assumed/.test(normalized)) {
    const reported = context.observations.every(
      (observation) => observation.source === "MANAGER_REPORTED",
    );
    response = reported
      ? "That is manager-reported, not externally validated data."
      : "Validated or runtime evidence outranks manager-reported values when both exist.";
  } else if (/caused the gap|root cause/.test(normalized)) {
    response =
      "No. A related current condition is not a confirmed cause of the gap. Nexora will not treat that as root cause without a causal authority.";
  } else if (/how does this relate to my goal/.test(normalized)) {
    response =
      "This current condition is related to the active Goal. Related is not the same as caused.";
  } else if (/ready to investigate/.test(normalized)) {
    response =
      session.state === "READY_FOR_ISSUE_DISCOVERY"
        ? "We now have enough context to start examining what may be preventing or enabling the Goal. That issue discovery has not started yet."
        : "Not yet. Nexora still needs enough current evidence to describe reality relative to the Goal.";
  }
  return Object.freeze({
    session,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    nextRuntimeState: input.runtimeState,
    catalog: overlayRealityOnEntranceCatalog(input.catalog, session),
  });
}

function composeRealityResponse(
  session: NexoraRealityDiscoverySession,
  utterance: string,
  askConditions: boolean,
): string {
  if (extractCausalHypothesis(utterance) && /caused the gap/.test(utterance.toLowerCase())) {
    return "No. That observation is not a confirmed cause of the gap.";
  }
  if (session.context.conflicts[0]) return session.context.conflicts[0];
  if (askConditions && session.context.gap?.status === "KNOWN") {
    return `Understood. Current ${session.context.gap.measure ?? "measure"} is about ${session.context.gap.delta} ${session.context.gap.direction === "below-target" ? "below the target" : "relative to the target"}. Is there any current operational condition you already believe is relevant?`;
  }
  if (session.state === "READY_FOR_ISSUE_DISCOVERY") {
    const names = session.objects.map((object) => object.displayName).join(" and ");
    return `${session.context.currentStateSummary ?? "Initial reality is recorded."} I've captured ${names || "the current observations"} as current conditions. That establishes enough initial reality to begin examining what may be preventing the Goal. This does not establish what is causing the gap.`;
  }
  if (session.context.sufficiency === "INSUFFICIENT") {
    return "I understand the Goal, but I don’t yet have enough current evidence to establish the gap. You can provide current values, import a CSV, use an existing connected source, or continue with manager-reported observations.";
  }
  return session.context.currentStateSummary ?? "Understood.";
}

function toIssueHandoff(
  entrance: NexoraEntranceSession,
  context: NexoraRealityDiscoverySession["context"],
  objects: readonly RealityEmergedObject[],
): NexoraIssueDiscoveryHandoff {
  return Object.freeze({
    identityContext: entrance.identity,
    executiveContextObject: entrance.identityObject,
    activeGoal: entrance.goalDiscovery?.context ?? null,
    goalObject: entrance.goalDiscovery?.object ?? null,
    realityContext: context,
    goalRealityGap: context.gap,
    realityObjects: objects,
    constraints: context.constraints,
    knownIssueSignals: unique([
      ...context.knownIssues,
      ...(entrance.goalDiscovery?.knownIssueSignals ?? []),
    ]),
    knownRiskSignals: context.knownRisks,
    knownOpportunitySignals: context.knownOpportunities,
    evidence: context.evidence,
    provenance: context.provenance,
    unknowns: context.unknowns,
    conversationContext: entrance.conversationNotes.slice(-6).join(" | "),
  });
}

function freezeRealitySession(
  session: NexoraRealityDiscoverySession,
): NexoraRealityDiscoverySession {
  return Object.freeze({
    ...session,
    objects: Object.freeze([...session.objects]),
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
  });
}

export function isNexoraRealityMetaUtterance(normalized: string): boolean {
  return isRealityMetaUtterance(normalized);
}

function isRealityMetaUtterance(normalized: string): boolean {
  return (
    /what is the current reality|what does the current situation/.test(normalized) ||
    /what do we know/.test(normalized) ||
    /what don'?t we know|what do we not know|what do we still not know/.test(normalized) ||
    /what is the current value/.test(normalized) ||
    /what is the target/.test(normalized) ||
    /what'?s the gap|what is the gap/.test(normalized) ||
    /where did (?:that|this|the) number come from/.test(normalized) ||
    /how current/.test(normalized) ||
    /measured or something i told|measured or assumed/.test(normalized) ||
    /caused the gap|root cause/.test(normalized) ||
    /how does this relate to my goal/.test(normalized) ||
    /ready to investigate/.test(normalized)
  );
}

function isRealityObservationUtterance(normalized: string): boolean {
  return (
    /\d+(?:\.\d+)?%/.test(normalized) ||
    /\bcurrently\b/.test(normalized) ||
    /\bwe want\b/.test(normalized) ||
    /\bbacklog\b/.test(normalized) ||
    /\bcapacity\b/.test(normalized) ||
    /\bweeks? behind\b/.test(normalized) ||
    /\bthat number is old|\bfigure is old|\bstale\b/.test(normalized) ||
    /\bmay be (?:a |the )?problem\b/.test(normalized) ||
    /\bbecause\b/.test(normalized) ||
    /\bcash\b/.test(normalized) ||
    /\bblocked\b/.test(normalized) ||
    /\bbugs?\b/.test(normalized)
  );
}

function isManagerObjectUtterance(normalized: string): boolean {
  return (
    /^(?:explain this|what is this|show(?: me)? .+|what is connected|where should i look next|how does this (?:help|affect) my goal|where are we|what needs my attention)$/.test(
      normalized,
    ) || /^explain .+/i.test(normalized)
  );
}

function isIdentityReserved(normalized: string): boolean {
  return /what do you know about me/.test(normalized) || normalized === "who are you";
}

function isGreeting(normalized: string): boolean {
  return /^(?:hi|hello|hey)$/.test(normalized);
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

export function realityDiscoveryUsesExistingAuthorities(): boolean {
  return (
    NEXORA_REALITY_DISCOVERY_BOUNDARY.parallelDataReality === false &&
    NEXORA_REALITY_DISCOVERY_BOUNDARY.startsNexExp4 === false &&
    NEXORA_REALITY_DISCOVERY_BOUNDARY.stealsGoalCenter === false &&
    getNexoraRealityDiscoveryExperienceIdentity().id ===
      "NEX-EXP:3/CurrentRealityExecutiveContextDiscovery"
  );
}

