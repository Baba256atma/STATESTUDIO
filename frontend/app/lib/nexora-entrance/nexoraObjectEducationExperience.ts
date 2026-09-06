/**
 * NEX-ENT:3 — Object language education over the existing entrance catalog.
 * Presentation-only actors. Does not write Goal/Issue/Scenario/Decision truth.
 */

import {
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import type { NexoraMVPContextSubjectFixture } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import { interpretCanonicalManagerMeaning } from "@/app/lib/manager-object/canonicalManagerMeaningInterpreter.ts";
import {
  emptyConversationCapabilities,
  resolveConversationalMove,
} from "@/app/lib/nexora-conversation/nexoraConversationPolicy.ts";
import type { NexoraConversationPurpose, NexoraConversationalMove } from "@/app/lib/nexora-conversation/nexoraConversationalMove.ts";
import {
  availablePurposesForUnderstandSubject,
} from "@/app/lib/nexora-conversation/nexoraConversationThread.ts";
import {
  resolveThreadIntelligence,
  utteranceIsExplicitRevisit,
  utteranceIsGenuineAmbiguity,
  utteranceNeedsDifferentStrategy,
} from "@/app/lib/nexora-conversation/nexoraConversationThreadApply.ts";
import { reconcileConversationAfterAction } from "@/app/lib/nexora-conversation/nexoraConversationActionReconcile.ts";
import {
  conversationSubjectParityOf,
  freezeConversationActionResult,
} from "@/app/lib/nexora-conversation/nexoraConversationActionResult.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS,
  inactiveNexoraEntranceConversationContinuitySession,
  inactiveNexoraObjectEducationSession,
  inactiveNexoraStageEducationSession,
  verifyNexoraObjectEducation,
  type NexoraEducationalObjectKind,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraObjectEducationSession,
  type NexoraObjectEducationState,
  type NexoraStageEducationSession,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import {
  coverageOf,
  coverageThreadOf,
} from "@/app/lib/nexora-conversation/nexoraConversationWorkingContext.ts";
import {
  conversationContinuityOf,
  recordContinuity,
  recordKernelContinuity,
  suggestedActionsForObjectProgression,
} from "./nexoraEntranceConversationContinuity.ts";

export {
  NEXORA_OBJECT_EDUCATION_BOUNDARY,
  NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS,
  getNexoraObjectEducationIdentity,
  inactiveNexoraObjectEducationSession,
  verifyNexoraObjectEducation,
} from "./nexoraGuidedEntranceTypes.ts";

export const NEXORA_EDUCATIONAL_OBJECT_PREFIX = "obj-nex-ent3-" as const;

export const NEXORA_EDUCATIONAL_EXAMPLE_PROVENANCE =
  "This is an educational example, not your business object.";

const ACTORS: Readonly<
  Record<
    NexoraEducationalObjectKind,
    {
      readonly id: string;
      readonly label: string;
      readonly kind: NexoraEducationalObjectKind;
      readonly position: readonly [number, number, number];
    }
  >
> = Object.freeze({
  goal: Object.freeze({
    id: "obj-nex-ent3-goal",
    label: "Goal · Improve delivery",
    kind: "goal" as const,
    position: [0, 0.35, 0] as const,
  }),
  kpi: Object.freeze({
    id: "obj-nex-ent3-kpi",
    label: "KPI · On-time delivery",
    kind: "kpi" as const,
    position: [1.9, 0.2, 0] as const,
  }),
  problem: Object.freeze({
    id: "obj-nex-ent3-problem",
    label: "Problem · Delivery delays",
    kind: "problem" as const,
    position: [-1.9, 0.35, 0] as const,
  }),
  risk: Object.freeze({
    id: "obj-nex-ent3-risk",
    label: "Risk · Further delays",
    kind: "risk" as const,
    position: [1.9, -0.55, 0] as const,
  }),
  scenario: Object.freeze({
    id: "obj-nex-ent3-scenario",
    label: "Scenario · Add temporary capacity",
    kind: "scenario" as const,
    position: [0, -0.15, 0] as const,
  }),
  decision: Object.freeze({
    id: "obj-nex-ent3-decision",
    label: "Decision · Use temporary capacity",
    kind: "decision" as const,
    position: [1.7, 0.25, 0] as const,
  }),
  execution: Object.freeze({
    id: "obj-nex-ent3-execution",
    label: "Execution · Capacity action",
    kind: "execution" as const,
    position: [-1.7, 0.2, 0] as const,
  }),
  outcome: Object.freeze({
    id: "obj-nex-ent3-outcome",
    label: "Outcome · Delivery improved",
    kind: "outcome" as const,
    position: [0, -1.15, 0] as const,
  }),
});

export const NEXORA_EDUCATIONAL_COMPARE_SCENARIO = Object.freeze({
  id: "obj-nex-ent3-scenario-b",
  label: "Scenario · Adjust existing capacity",
  kind: "scenario" as const,
  position: [1.85, -0.15, 0] as const,
});

const VISIBLE: Readonly<Record<NexoraObjectEducationState, readonly NexoraEducationalObjectKind[]>> =
  Object.freeze({
    NOT_STARTED: Object.freeze([]),
    SKIPPED: Object.freeze([]),
    GOAL: Object.freeze(["goal" as const]),
    KPI: Object.freeze(["goal" as const, "kpi" as const]),
    ISSUE: Object.freeze(["problem" as const, "risk" as const]),
    SCENARIO: Object.freeze(["problem" as const, "scenario" as const]),
    DECISION: Object.freeze(["scenario" as const, "decision" as const]),
    EXECUTION: Object.freeze(["decision" as const, "execution" as const]),
    OUTCOME: Object.freeze(["execution" as const, "outcome" as const]),
    REVIEW: Object.freeze([
      "goal" as const,
      "problem" as const,
      "scenario" as const,
      "decision" as const,
      "execution" as const,
      "outcome" as const,
    ]),
    COMPLETED: Object.freeze([
      "goal" as const,
      "problem" as const,
      "scenario" as const,
      "decision" as const,
      "execution" as const,
      "outcome" as const,
    ]),
  });

const FOCUS_KIND: Readonly<Partial<Record<NexoraObjectEducationState, NexoraEducationalObjectKind>>> =
  Object.freeze({
    GOAL: "goal",
    KPI: "kpi",
    ISSUE: "problem",
    SCENARIO: "scenario",
    DECISION: "decision",
    EXECUTION: "execution",
    OUTCOME: "outcome",
    REVIEW: "goal",
    COMPLETED: "goal",
  });

const CONTEXT_KINDS = new Set<NexoraEducationalObjectKind>([
  "problem",
  "scenario",
  "decision",
  "execution",
]);

const HANDOFF =
  "Now that you know the Stage, let me show you what appears on it.";
const OBJECT_INTRO =
  "Most work starts with something you want to improve. These are Objects — the things Nexora uses to represent a situation.";
const GOAL_COPY =
  "A Goal represents something you want to achieve or improve. This example Goal is Improve delivery. It is an educational example, not your business Goal.";
const KPI_COPY =
  "A KPI helps us see how something important is performing. A Goal is the direction; a KPI is how we observe performance. No chart yet — just the measurement idea.";
const ISSUE_COPY =
  "A Problem is something currently requiring attention. A Risk is something uncertain that could affect the situation. They are not the same thing.";
const SCENARIO_COPY =
  "A Scenario represents a possible path we can examine before deciding. It is not a Decision, not a recommendation, and not a prediction.";
const DECISION_COPY =
  "A Decision represents what you actually choose to commit to. I can help you examine options and recommend a path. The commitment remains yours.";
const EXECUTION_COPY =
  "Execution is the work that follows an approved Decision. This is only an example — we are not starting real work.";
const OUTCOME_COPY =
  "Outcome is what we observe after execution. A good Outcome does not by itself prove the Decision caused it.";
const REVIEW_COPY =
  "That’s the basic Object language. Goals tell us where we’re going, KPIs help us observe performance, Problems and Risks show what needs attention, Scenarios let us examine possibilities, Decisions capture commitment, Execution carries the choice forward, and Outcomes show what happened.";
const WHY_STAGE =
  "It’s on Stage because it matters to the example situation we’re examining together. What appears can change with the situation.";
const AFTER_DECISION =
  "After a Decision, Execution is the work that follows the committed choice. Nexora does not start that work for you in this introduction.";
const AUTHORITY =
  "I can help you examine options and recommend a path within what we know. I do not silently commit a Decision for you.";
const NO_CAUSE =
  "No. A good Outcome does not prove the Decision caused it. We can observe what happened without claiming a cause we cannot support.";
const OBJECT_LIST =
  "Nexora can represent Goals, KPIs, Problems, Risks, Scenarios, Decisions, Execution, and Outcomes. Supporting things such as evidence, cost, or time can appear differently later. Data is a different relationship — not in this introduction.";
const NEXT_UNAVAILABLE =
  "I can’t show the next object yet. We can stay with this one, or skip the introduction.";

export type NexoraObjectEducationMove =
  | "NEXT"
  | "THIS"
  | "WHY"
  | "AFTER"
  | "DIFFERENCE"
  | "GOAL"
  | "KPI"
  | "ISSUE"
  | "SCENARIO"
  | "DECISION"
  | "AUTHORITY"
  | "EXECUTION"
  | "OUTCOME"
  | "CAUSE"
  | "LIST"
  | "DATA"
  | "ICONIC";

export function objectEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraObjectEducationSession {
  return (
    session?.guidedIntroduction?.objectEducation ??
    inactiveNexoraObjectEducationSession()
  );
}

function stageOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraStageEducationSession {
  return (
    session?.guidedIntroduction?.stageEducation ??
    inactiveNexoraStageEducationSession()
  );
}

export function isNexoraObjectEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = objectEducationOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED";
}

export function isNexoraEducationalObjectId(id: string | null | undefined): boolean {
  return Boolean(id?.startsWith(NEXORA_EDUCATIONAL_OBJECT_PREFIX));
}

export function overlayObjectEducationOnEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  education: NexoraObjectEducationSession | null | undefined,
): NexoraMVPObjectInteractionCatalog {
  const state = education?.state ?? "NOT_STARTED";
  const kinds = VISIBLE[state];
  if (!kinds.length) return catalog;
  const objects: NexoraMVPStageObjectFixture[] = kinds.map((kind) => {
    const actor = ACTORS[kind];
    return Object.freeze({
      id: actor.id,
      label: actor.label,
      kind: "object" as const,
      position: actor.position,
      status: "stable" as const,
      attention: kind === FOCUS_KIND[state] ? ("important" as const) : ("normal" as const),
      catalogProvenance: "object-education" as const,
    });
  });
  const contextSubjects: NexoraMVPContextSubjectFixture[] = kinds
    .filter((kind) => CONTEXT_KINDS.has(kind))
    .map((kind) => {
      const actor = ACTORS[kind];
      return Object.freeze({
        id: actor.id,
        label: actor.label,
        kind: actor.kind as NexoraMVPContextSubjectFixture["kind"],
        status: "stable" as const,
        attention: "normal" as const,
        catalogProvenance: "object-education" as const,
      });
    });
  return Object.freeze({
    objects: Object.freeze(objects),
    relationships: Object.freeze([]),
    contextSubjects: Object.freeze(contextSubjects),
    contextLinks: Object.freeze([]),
  });
}

export function shouldBeginNexoraObjectEducation(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraObjectEducationActive(session)) return false;
  const stage = stageOf(session);
  if (!stage.focusDemonstrated && !stage.managerInteracted) return false;
  if (stage.state === "SKIPPED" || stage.state === "INACTIVE") return false;
  return classifyObjectEducationMove(utterance, session) === "NEXT";
}

export function shouldNexoraObjectEducationOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraObjectEducation(session, utterance)) return true;
  if (!isNexoraObjectEducationActive(session)) return false;
  return classifyObjectEducationMove(utterance, session) != null;
}

export function resolveNexoraObjectEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraObjectEducation();
  const move = classifyObjectEducationMove(input.utterance, input.session);
  const education = objectEducationOf(input.session);
  if (move == null) {
    return freezeTurn({
      session: input.session,
      runtimeState: input.runtimeState,
      response: "",
      ownsResponse: false,
      shouldCommitRuntime: false,
      centerTransferred: false,
      suggestedActions: Object.freeze([]),
      move: null,
      presentationCue: null,
    });
  }
  if (!isNexoraObjectEducationActive(input.session) || education.state === "NOT_STARTED") {
    if (move === "NEXT" || move === "GOAL") {
      return presentStep(input.session, input.runtimeState, "GOAL", {
        openingCopy: `${HANDOFF} ${OBJECT_INTRO} ${GOAL_COPY}`,
        establishIdentifyCoverage: false,
      });
    }
    return answerWithoutAdvancing(
      input.session,
      input.runtimeState,
      replyFor(move, education, input.utterance),
    );
  }
  if (move === "NEXT") {
    const following = nextState(education.state);
    if (following === education.state || following === "SKIPPED") {
      return unavailableNext(input.session, input.runtimeState, education);
    }
    const reviewOverview = following === "REVIEW" || following === "COMPLETED";
    return presentStep(input.session, input.runtimeState, following, {
      establishIdentifyCoverage: !reviewOverview,
      openingCopy: reviewOverview ? copyForState(following) : undefined,
    });
  }
  if (move === "THIS" || move === "WHY" || move === "DIFFERENCE") {
    return answerWithKernel(input.session, input.runtimeState, education, move, input.utterance);
  }
  return answerWithoutAdvancing(
    input.session,
    input.runtimeState,
    replyFor(move, education, input.utterance),
    move === "DATA" || move === "ICONIC",
  );
}

export function acknowledgeNexoraObjectEducationInteraction(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly subjectId: string | null;
}): NexoraGuidedEntranceTurnResult | null {
  if (!isNexoraObjectEducationActive(input.session)) return null;
  if (!isNexoraEducationalObjectId(input.subjectId)) return null;
  const kind = kindFromId(input.subjectId);
  if (kind == null) return null;
  const nextEducation: NexoraObjectEducationSession = Object.freeze({
    ...objectEducationOf(input.session),
    currentObjectId: input.subjectId,
    lastReferenceId: input.subjectId,
  });
  return freezeTurn({
    session: withObjectEducation(input.session, nextEducation),
    runtimeState: input.runtimeState,
    response: explainKind(kind),
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS,
    move: null,
    presentationCue: null,
  });
}

export function educationalObjectIds(): readonly string[] {
  return Object.freeze([
    ...Object.values(ACTORS).map((actor) => actor.id),
    NEXORA_EDUCATIONAL_COMPARE_SCENARIO.id,
  ]);
}

export function educationalActorForKind(kind: NexoraEducationalObjectKind) {
  return ACTORS[kind];
}

function presentStep(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  state: NexoraObjectEducationState,
  options: {
    readonly openingCopy?: string;
    readonly establishIdentifyCoverage: boolean;
  },
): NexoraGuidedEntranceTurnResult {
  const previousEducation = objectEducationOf(session);
  const focusKind = FOCUS_KIND[state] ?? "goal";
  const focusId = ACTORS[focusKind].id;
  const education: NexoraObjectEducationSession = Object.freeze({
    state,
    currentObjectId: focusId,
    lastReferenceId: focusId,
  });
  const catalog = overlayObjectEducationOnEntranceCatalog(emptyCatalog(), education);
  const focused = selectNexoraMVPInteractionSubject(
    Object.freeze({
      ...runtimeState,
      mode: "overview" as const,
      focusedSubject: null,
      selectedSubject: null,
      environmentIntent: "investigate" as const,
      presentationState: "minimum" as const,
      workspace: "overview" as const,
    }),
    focusId,
    catalog,
  );
  const presented = focused.focusedSubject?.id === focusId;
  const result = freezeConversationActionResult({
    requestedCapability: "NEXT",
    status: presented ? "SUCCEEDED" : "FAILED",
    previousSubjectId: previousEducation.currentObjectId,
    resultingSubjectId: presented ? focusId : previousEducation.currentObjectId,
    owner: "NEX-ENT:3/ObjectLanguageEducation",
    lessonBefore: previousEducation.state,
    lessonAfter: presented ? state : previousEducation.state,
  });
  if (!presented) {
    return unavailableNext(session, runtimeState, previousEducation, result);
  }
  const educated = withObjectEducation(session, education);
  const prior = conversationContinuityOf(educated);
  const capabilities = Object.freeze({
    ...emptyConversationCapabilities(),
    compare: true,
    offerNext: state !== "REVIEW" && state !== "COMPLETED",
    connect: true,
    show: false,
  });
  const reconciled = reconcileConversationAfterAction({
    previous: prior.working,
    result,
    capabilities,
    availablePurposes: availablePurposesForUnderstandSubject({
      compare: true,
      whyPresent: true,
    }),
    relatedSubjects: relatedEducationalSubjects(focusKind),
    establishIdentifyCoverage: options.establishIdentifyCoverage,
  });
  const resolvedMove = reconciled.threadDecision?.resolvedMove ?? reconciled.turn?.move ?? "ANSWER";
  const response =
    options.openingCopy ??
    composeObjectProgressionCopy({
      kind: focusKind,
      purpose: reconciled.turn?.purpose ?? "IDENTIFY",
      move: resolvedMove,
      utterance: "",
      coveredPurposes: reconciled.threadDecision?.thread.coveredPurposes.map(
        (item) => item.purpose,
      ),
      demonstrated: false,
    });
  const nextSession = Object.freeze({
    ...educated,
    centerSubjectId: focusId,
    guidedIntroduction: educated.guidedIntroduction
      ? Object.freeze({
          ...educated.guidedIntroduction,
          conversationContinuity: recordContinuity(prior, {
            lastAction: "CONTINUE",
            lastResult: "PRESENTED",
            working: reconciled.working,
          }),
        })
      : educated.guidedIntroduction,
  });
  void conversationSubjectParityOf({
    resultingSubjectId: result.resultingSubjectId,
    conversationSubjectId: reconciled.working.conversationThread?.primarySubject ?? null,
    stageSubjectId: focused.focusedSubject?.id ?? null,
  });
  return freezeTurn({
    session: nextSession,
    runtimeState: focused,
    response,
    ownsResponse: true,
    shouldCommitRuntime: true,
    centerTransferred: true,
    suggestedActions: options.establishIdentifyCoverage
      ? suggestedActionsForObjectProgression(
          resolvedMove,
          reconciled.threadDecision?.thread.coveredPurposes.map((item) => item.purpose) ??
            Object.freeze([]),
        )
      : NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS,
    move: "CONTINUE",
    presentationCue: "orient",
  });
}

function unavailableNext(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraObjectEducationSession,
  result = freezeConversationActionResult({
    requestedCapability: "NEXT",
    status: "UNAVAILABLE",
    previousSubjectId: education.currentObjectId,
    resultingSubjectId: education.currentObjectId,
    owner: "NEX-ENT:3/ObjectLanguageEducation",
    lessonBefore: education.state,
    lessonAfter: education.state,
  }),
): NexoraGuidedEntranceTurnResult {
  const prior = conversationContinuityOf(session);
  const reconciled = reconcileConversationAfterAction({
    previous: prior.working,
    result,
    establishIdentifyCoverage: false,
  });
  return freezeTurn({
    session: Object.freeze({
      ...session,
      guidedIntroduction: session.guidedIntroduction
        ? Object.freeze({
            ...session.guidedIntroduction,
            conversationContinuity: recordContinuity(prior, {
              working: reconciled.working,
            }),
          })
        : session.guidedIntroduction,
    }),
    runtimeState,
    response: NEXT_UNAVAILABLE,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: suggestedActionsForObjectProgression(
      prior.working.lastThreadDecision?.resolvedMove ?? "ANSWER",
      prior.working.conversationThread?.coveredPurposes.map((item) => item.purpose) ??
        Object.freeze([]),
    ),
    move: null,
    presentationCue: null,
  });
}

function answerWithoutAdvancing(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  response: string,
  supersedeThread = false,
): NexoraGuidedEntranceTurnResult {
  const prior = conversationContinuityOf(session);
  const nextSession = supersedeThread
    ? Object.freeze({
        ...session,
        guidedIntroduction: session.guidedIntroduction
          ? Object.freeze({
              ...session.guidedIntroduction,
              conversationContinuity: recordContinuity(prior, {
                working: Object.freeze({
                  ...prior.working,
                  pendingOffer: null,
                  pendingClarification: null,
                  conversationThread: prior.working.conversationThread
                    ? Object.freeze({
                        ...prior.working.conversationThread,
                        status: "SUPERSEDED" as const,
                      })
                    : null,
                }),
              }),
            })
          : session.guidedIntroduction,
      })
    : session;
  return freezeTurn({
    session: nextSession,
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: NEXORA_OBJECT_EDUCATION_QUESTION_ACTIONS,
    move: null,
    presentationCue: null,
  });
}

function answerWithKernel(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraObjectEducationSession,
  move: NexoraObjectEducationMove,
  utterance: string,
): NexoraGuidedEntranceTurnResult {
  const kind =
    kindFromEducationMove(move) ??
    kindFromId(education.lastReferenceId) ??
    FOCUS_KIND[education.state] ??
    "goal";
  const subjectId = ACTORS[kind].id;
  const purpose = purposeForObjectMove(move, utterance);
  const prior = conversationContinuityOf(session);
  const previousCoverage = coverageOf(prior.working, subjectId, purpose);
  const thread = coverageThreadOf(prior.working, subjectId, purpose);
  const demonstrated =
    prior.lastResult === "PRESENTED" && prior.lastAction === "DEMONSTRATE";
  const pendingOffer = prior.working.pendingOffer;
  const pendingOfferAccepted =
    pendingOffer != null &&
    pendingOffer.subjectId === subjectId &&
    /^(show me|yes|do that|yes please)$/i.test(utterance.trim());
  const capabilities = Object.freeze({
    ...emptyConversationCapabilities(),
    compare: true,
    offerNext: education.state !== "REVIEW" && education.state !== "COMPLETED",
    connect: true,
    show: false,
  });
  const decision = resolveConversationalMove({
    meaning: null,
    subjectId,
    purpose,
    coverage: previousCoverage,
    previousMove: thread?.lastMove ?? prior.working.lastDecision?.move ?? null,
    lastCapabilityRequest: thread?.lastCapabilityRequest ?? null,
    lastCapabilityResult: demonstrated
      ? "SUCCEEDED"
      : thread?.lastCapabilityResult ?? "NONE",
    capabilities,
    explicitRepeat: false,
    materialContextChanged: false,
    pendingOfferAccepted,
  });
  const threadDecision = resolveThreadIntelligence({
    working: prior.working,
    turn: decision,
    capabilities,
    availablePurposes: availablePurposesForUnderstandSubject({
      compare: true,
      whyPresent: true,
    }),
    relatedSubjects: relatedEducationalSubjects(kind),
    explicitAmbiguity: utteranceIsGenuineAmbiguity(utterance),
    explicitRevisit: utteranceIsExplicitRevisit(utterance),
    needsDifferentStrategy: utteranceNeedsDifferentStrategy(utterance),
    pendingOfferAccepted,
  });
  const resolvedMove = threadDecision.resolvedMove;
  const response = composeObjectProgressionCopy({
    kind,
    purpose,
    move: resolvedMove,
    utterance,
    coveredPurposes: threadDecision.thread.coveredPurposes.map((item) => item.purpose),
    demonstrated:
      demonstrated && resolvedMove === "ANSWER" && purpose === "IDENTIFY",
  });
  const nextSession = Object.freeze({
    ...session,
    guidedIntroduction: session.guidedIntroduction
      ? Object.freeze({
          ...session.guidedIntroduction,
          conversationContinuity: recordKernelContinuity(
            prior,
            decision,
            {
              lastAction: "EXPLAIN",
              lastResult: "EXPLAINED",
            },
            {
              conversationThread: threadDecision.thread,
              lastThreadDecision: threadDecision,
            },
          ),
        })
      : session.guidedIntroduction,
  });
  return freezeTurn({
    session: nextSession,
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: suggestedActionsForObjectProgression(
      resolvedMove,
      threadDecision.thread.coveredPurposes.map((item) => item.purpose),
    ),
    move: null,
    presentationCue: null,
  });
}

function purposeForObjectMove(
  move: NexoraObjectEducationMove,
  utterance: string,
): NexoraConversationPurpose {
  if (move === "WHY") {
    const meaning = interpretCanonicalManagerMeaning({
      utterance,
      subjects: Object.freeze([]),
    });
    if (meaning.questionType === "GOAL_RELEVANCE") return "WHY_RELEVANT";
    return "WHY_PRESENT";
  }
  if (move === "DIFFERENCE") return "COMPARE";
  return "IDENTIFY";
}

function kindFromEducationMove(
  move: NexoraObjectEducationMove,
): NexoraEducationalObjectKind | null {
  if (move === "GOAL") return "goal";
  if (move === "KPI") return "kpi";
  if (move === "ISSUE") return "problem";
  if (move === "SCENARIO") return "scenario";
  if (move === "DECISION") return "decision";
  if (move === "EXECUTION") return "execution";
  if (move === "OUTCOME") return "outcome";
  return null;
}

function relatedEducationalSubjects(
  kind: NexoraEducationalObjectKind,
): readonly string[] {
  if (kind === "goal") return Object.freeze([ACTORS.kpi.id]);
  if (kind === "kpi") return Object.freeze([ACTORS.goal.id, ACTORS.problem.id]);
  if (kind === "problem") return Object.freeze([ACTORS.kpi.id, ACTORS.scenario.id]);
  if (kind === "scenario") return Object.freeze([ACTORS.problem.id, ACTORS.decision.id]);
  if (kind === "decision") return Object.freeze([ACTORS.scenario.id, ACTORS.execution.id]);
  if (kind === "execution") return Object.freeze([ACTORS.decision.id, ACTORS.outcome.id]);
  if (kind === "outcome") return Object.freeze([ACTORS.execution.id]);
  return Object.freeze([ACTORS.problem.id]);
}

function kindLabel(kind: NexoraEducationalObjectKind): string {
  if (kind === "kpi") return "KPI";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function relatedLabel(kind: NexoraEducationalObjectKind): string {
  if (kind === "goal") return "a KPI";
  if (kind === "kpi") return "a Goal";
  if (kind === "problem") return "a Risk";
  if (kind === "risk") return "a Problem";
  if (kind === "scenario") return "a Decision";
  if (kind === "decision") return "a Scenario";
  if (kind === "execution") return "the Decision";
  return "Execution";
}

function composeObjectProgressionCopy(input: {
  readonly kind: NexoraEducationalObjectKind;
  readonly purpose: NexoraConversationPurpose;
  readonly move: NexoraConversationalMove;
  readonly utterance: string;
  readonly demonstrated: boolean;
  readonly coveredPurposes?: readonly NexoraConversationPurpose[];
}): string {
  const label = kindLabel(input.kind);
  const covered = new Set(input.coveredPurposes ?? []);
  if (input.move === "REPEAT") {
    return explainKind(input.kind);
  }
  if (input.move === "SUMMARIZE" || (input.move === "OFFER_NEXT" && covered.size >= 2)) {
    return composeThreadCoverageCopy(input.kind, covered);
  }
  if (input.purpose === "WHY_RELEVANT") {
    if (input.move === "EXPLAIN_WHY" || input.move === "ANSWER") {
      return `This ${label} is here as an example of its role in the situation — not as a live business priority.`;
    }
    if (input.move === "DEEPEN") {
      return `In this lesson, the ${label} helps us see how that kind of object is used. That is educational relevance, not a ranking of your work.`;
    }
    if (input.move === "CONNECT" || input.move === "OFFER_NEXT") {
      return `That’s the useful idea. I can compare it with ${relatedLabel(input.kind)}, or we can move to the next object.`;
    }
    return `I may not be answering the part you mean. Are you asking why this ${label} matters in the example, or why it is on Stage?`;
  }
  if (input.purpose === "WHY_PRESENT") {
    if (input.move === "EXPLAIN_WHY" || input.move === "ANSWER") return WHY_STAGE;
    if (input.move === "DEEPEN") {
      return `It is present in this lesson so we can see how a ${label} relates to the rest of the example situation on Stage, without treating it as your live business.`;
    }
    if (input.move === "CONNECT" || input.move === "OFFER_NEXT") {
      return `That’s why this ${label} is here. I can compare it with ${relatedLabel(input.kind)}, or we can move to the next object.`;
    }
    return `I may not be answering the part you mean. Are you asking why this ${label} is on Stage, what it is, or what we should look at next?`;
  }
  if (input.purpose === "COMPARE" || input.move === "COMPARE") {
    return differenceFor(input.kind, input.utterance);
  }
  if (input.move === "DEEPEN") return deepenIdentityCopy(input.kind);
  if (input.move === "CONNECT" || input.move === "OFFER_NEXT") {
    return `I can show you how this ${label} differs from ${relatedLabel(input.kind)}, or we can move to the next object.`;
  }
  if (input.move === "CLARIFY") {
    return `I may not be answering the part you mean. Are you asking what a ${label} is, why this ${label} is here, or how it relates to the other objects?`;
  }
  return explainKind(input.kind);
}

function composeThreadCoverageCopy(
  kind: NexoraEducationalObjectKind,
  covered: ReadonlySet<NexoraConversationPurpose>,
): string {
  const label = kindLabel(kind);
  const fragments: string[] = [];
  if (covered.has("IDENTIFY")) fragments.push(`what this ${label} is`);
  if (covered.has("WHY_PRESENT")) fragments.push("why it is on Stage");
  if (covered.has("COMPARE")) {
    fragments.push(`how it differs from ${relatedLabel(kind)}`);
  }
  const coveredText =
    fragments.length === 0
      ? `this ${label}`
      : fragments.length === 1
        ? fragments[0]
        : fragments.length === 2
          ? `${fragments[0]} and ${fragments[1]}`
          : `${fragments[0]}, ${fragments[1]}, and ${fragments[2]}`;
  return `We’ve covered ${coveredText}. We can look at ${relatedLabel(kind)} next, or explore how the ${label} guides the rest of the situation.`;
}

function deepenIdentityCopy(kind: NexoraEducationalObjectKind): string {
  switch (kind) {
    case "goal":
      return "In practice, a Goal gives the work on Stage a direction. Problems, KPIs, and scenarios can be considered in relation to what you are trying to achieve.";
    case "kpi":
      return "In practice, a KPI is how we observe performance against that direction. It does not replace the Goal, and it is not a Decision.";
    case "problem":
      return "In practice, a Problem is current work that needs attention. It is not a Risk, and noticing it does not by itself decide what to do.";
    case "risk":
      return "In practice, a Risk is uncertainty that could affect the situation. It is not the same as a Problem already requiring attention.";
    case "scenario":
      return "In practice, a Scenario lets us examine a possible path before anyone commits. It remains a possibility, not a Decision.";
    case "decision":
      return "In practice, a Decision is the committed choice. Talking about it, continuing, or asking for more explanation is not approval.";
    case "execution":
      return "In practice, Execution is the work that would follow an approved Decision. Explaining it here does not start that work.";
    case "outcome":
      return "In practice, an Outcome is what we observe after execution. A good Outcome does not prove the Decision caused it.";
  }
}

function withObjectEducation(
  session: NexoraEntranceSession,
  education: NexoraObjectEducationSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      objectEducation: education,
      conversationContinuity:
        guided.objectEducation.state === "NOT_STARTED"
          ? recordContinuity(
              guided.conversationContinuity ??
                inactiveNexoraEntranceConversationContinuitySession(),
              {
                subject: null,
                lastAction: null,
                lastResult: null,
                capabilityDepth: "NONE",
                focusExplained: false,
                focusWhyDepth: "NONE",
                focusExplainDepth: "NONE",
                appearsDepth: "NONE",
                dashboardDepth: "NONE",
                stageExplainDepth: "NONE",
                lastEducationalResponse: null,
                working: inactiveNexoraEntranceConversationContinuitySession().working,
              },
            )
          : guided.conversationContinuity ??
            inactiveNexoraEntranceConversationContinuitySession(),
    }),
  });
}

function nextState(state: NexoraObjectEducationState): NexoraObjectEducationState {
  switch (state) {
    case "NOT_STARTED":
      return "GOAL";
    case "GOAL":
      return "KPI";
    case "KPI":
      return "ISSUE";
    case "ISSUE":
      return "SCENARIO";
    case "SCENARIO":
      return "DECISION";
    case "DECISION":
      return "EXECUTION";
    case "EXECUTION":
      return "OUTCOME";
    case "OUTCOME":
      return "REVIEW";
    case "REVIEW":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function copyForState(state: NexoraObjectEducationState): string {
  switch (state) {
    case "GOAL":
      return `${HANDOFF} ${OBJECT_INTRO} ${GOAL_COPY}`;
    case "KPI":
      return KPI_COPY;
    case "ISSUE":
      return ISSUE_COPY;
    case "SCENARIO":
      return SCENARIO_COPY;
    case "DECISION":
      return DECISION_COPY;
    case "EXECUTION":
      return EXECUTION_COPY;
    case "OUTCOME":
      return OUTCOME_COPY;
    case "REVIEW":
    case "COMPLETED":
      return REVIEW_COPY;
    default:
      return OBJECT_INTRO;
  }
}

function replyFor(
  move: NexoraObjectEducationMove,
  education: NexoraObjectEducationSession,
  utterance: string,
): string {
  const referenced = kindFromId(education.lastReferenceId) ?? FOCUS_KIND[education.state] ?? "goal";
  if (move === "THIS") return explainKind(referenced);
  if (move === "WHY") return WHY_STAGE;
  if (move === "AFTER") return AFTER_DECISION;
  if (move === "AUTHORITY") return AUTHORITY;
  if (move === "CAUSE") return NO_CAUSE;
  if (move === "LIST") return OBJECT_LIST;
  if (move === "DATA") {
    return "Data is a different relationship from these executive Objects. We can look at your data later — not as part of this Object introduction.";
  }
  if (move === "ICONIC") {
    return "Nexora can also show supporting things such as evidence, cost, or time differently. We’ll stay with the main executive Objects for now.";
  }
  if (move === "DIFFERENCE") return differenceFor(referenced, utterance);
  if (move === "GOAL") return GOAL_COPY;
  if (move === "KPI") return KPI_COPY;
  if (move === "ISSUE") return ISSUE_COPY;
  if (move === "SCENARIO") return SCENARIO_COPY;
  if (move === "DECISION") return DECISION_COPY;
  if (move === "EXECUTION") return EXECUTION_COPY;
  if (move === "OUTCOME") return OUTCOME_COPY;
  return explainKind(referenced);
}

function differenceFor(kind: NexoraEducationalObjectKind, utterance: string): string {
  const text = utterance.toLowerCase();
  if (/goal/.test(text) && /kpi/.test(text)) return KPI_COPY;
  if (/problem/.test(text) && /risk/.test(text)) return ISSUE_COPY;
  if (/scenario/.test(text) && /decision/.test(text)) return SCENARIO_COPY;
  if (/decision/.test(text) && /execution/.test(text)) return EXECUTION_COPY;
  if (/execution/.test(text) && /outcome/.test(text)) return OUTCOME_COPY;
  if (kind === "kpi" || kind === "goal") return KPI_COPY;
  if (kind === "problem" || kind === "risk") return ISSUE_COPY;
  if (kind === "scenario" || kind === "decision") return `${SCENARIO_COPY} ${DECISION_COPY}`;
  if (kind === "execution") return EXECUTION_COPY;
  if (kind === "outcome") return OUTCOME_COPY;
  return KPI_COPY;
}

function explainKind(kind: NexoraEducationalObjectKind): string {
  switch (kind) {
    case "goal":
      return "That’s a Goal — something you want to achieve or improve.";
    case "kpi":
      return "That’s a KPI — how we observe performance. It is not the Goal itself.";
    case "problem":
      return "That’s a Problem — something currently requiring attention.";
    case "risk":
      return "That’s a Risk — something uncertain that could affect the situation. It is not the same as a Problem.";
    case "scenario":
      return "That’s a Scenario — a possible path we can examine before making a Decision.";
    case "decision":
      return "That’s a Decision — the committed choice. I can advise; you commit.";
    case "execution":
      return "That’s Execution — the work that follows an approved Decision.";
    case "outcome":
      return "That’s an Outcome — what we observe after execution.";
  }
}

function kindFromId(id: string | null | undefined): NexoraEducationalObjectKind | null {
  if (!id) return null;
  if (id === NEXORA_EDUCATIONAL_COMPARE_SCENARIO.id) return "scenario";
  const found = Object.values(ACTORS).find((actor) => actor.id === id);
  return found?.kind ?? null;
}

function emptyCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: Object.freeze([]),
    relationships: Object.freeze([]),
    contextSubjects: Object.freeze([]),
    contextLinks: Object.freeze([]),
  });
}

function freezeTurn(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly centerTransferred: boolean;
  readonly suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[];
  readonly move: NexoraGuidedEntranceTurnResult["move"];
  readonly presentationCue: NexoraStagePresentationCue;
}): NexoraGuidedEntranceTurnResult {
  const withCopy =
    input.ownsResponse && input.response
      ? Object.freeze({
          ...input.session,
          guidedIntroduction: input.session.guidedIntroduction
            ? Object.freeze({
                ...input.session.guidedIntroduction,
                conversationContinuity: recordContinuity(
                  conversationContinuityOf(input.session),
                  { lastEducationalResponse: input.response },
                ),
              })
            : input.session.guidedIntroduction,
        })
      : input.session;
  return Object.freeze({
    session: withCopy,
    response: input.response,
    ownsResponse: input.ownsResponse,
    shouldCommitRuntime: input.shouldCommitRuntime,
    nextRuntimeState: input.runtimeState,
    centerTransferred: input.centerTransferred,
    suggestedActions: Object.freeze([...input.suggestedActions]),
    move: input.move,
    presentationCue: input.presentationCue,
  });
}

export function classifyObjectEducationMove(
  utterance: string,
  session?: NexoraEntranceSession | null,
): NexoraObjectEducationMove | null {
  const normalized = utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  if (
    normalized === "repeat exactly what you said" ||
    normalized === "repeat exactly" ||
    normalized === "say that again" ||
    normalized === "repeat what you said" ||
    normalized === "repeat that"
  ) {
    return null;
  }
  if (/^show problems$/.test(normalized) || /^show (?:the )?problems$/.test(normalized)) {
    return null;
  }
  if (/^explain delivery delay/.test(normalized)) return null;

  const active = isNexoraObjectEducationActive(session);
  const ready = stageOf(session).focusDemonstrated || stageOf(session).managerInteracted;
  if (
    normalized === "show me the next one" ||
    normalized === "show me what appears" ||
    normalized === "show me the objects"
  ) {
    return ready || active ? "NEXT" : null;
  }
  const pendingOffer = conversationContinuityOf(session).working?.pendingOffer ?? null;
  const currentSubject =
    objectEducationOf(session).currentObjectId ??
    objectEducationOf(session).lastReferenceId;
  if (
    active &&
    pendingOffer &&
    pendingOffer.subjectId === currentSubject &&
    (normalized === "show me" ||
      normalized === "yes" ||
      normalized === "do that" ||
      normalized === "yes please")
  ) {
    return pendingOffer.capability === "NEXT" ? "NEXT" : "DIFFERENCE";
  }
  if (
    active &&
    (normalized === "show me" ||
      normalized === "continue" ||
      normalized === "and then" ||
      normalized === "what next" ||
      normalized === "what's next")
  ) {
    return "NEXT";
  }
  if (
    !active &&
    ready &&
    (normalized === "continue" ||
      normalized === "show me" ||
      normalized === "and then" ||
      normalized === "what next" ||
      normalized === "what's next" ||
      normalized === "what appears here")
  ) {
    return "NEXT";
  }
  if (active && /not what i mean/.test(normalized)) {
    return "THIS";
  }
  if (active && /still don'?t understand|still not clear/.test(normalized)) {
    return "THIS";
  }
  if (
    normalized === "what is this" ||
    normalized === "explain this" ||
    normalized === "explain that" ||
    normalized === "explain it"
  ) {
    return active || ready ? "THIS" : null;
  }
  if (
    normalized === "why is it here" ||
    normalized === "why is it on stage" ||
    normalized === "why is this here" ||
    normalized === "i mean why it matters" ||
    normalized === "why it matters" ||
    normalized === "why it is here"
  ) {
    return "WHY";
  }
  if (
    /what comes after/.test(normalized) ||
    /what happens after (?:a |the )?decision/.test(normalized)
  ) {
    return "AFTER";
  }
  if (/can (?:you|nexora) (?:decide|make the decision)/.test(normalized)) {
    return "AUTHORITY";
  }
  if (
    /prove|caused|cause (?:the |this )?outcome|did (?:the )?decision cause/.test(normalized)
  ) {
    return "CAUSE";
  }
  if (/what(?:'s| is) the difference/.test(normalized) || /why is it different/.test(normalized)) {
    return "DIFFERENCE";
  }
  if (
    /is (?:a |this )?(?:the )?scenario (?:a |the )?decision/.test(normalized) ||
    /is this the decision/.test(normalized)
  ) {
    return "SCENARIO";
  }
  if (
    /is risk (?:the )?same as (?:a )?problem/.test(normalized) ||
    /difference between (?:a )?problem and (?:a )?risk/.test(normalized)
  ) {
    return "ISSUE";
  }
  if (/what(?:'s| is) (?:a )?goal/.test(normalized)) return "GOAL";
  if (/what(?:'s| is) (?:a )?kpi/.test(normalized)) return "KPI";
  if (/what(?:'s| is) (?:a )?problem/.test(normalized)) return "ISSUE";
  if (/what(?:'s| is) (?:a )?risk/.test(normalized)) return "ISSUE";
  if (/what(?:'s| is) (?:a )?scenario/.test(normalized)) return "SCENARIO";
  if (/what(?:'s| is) (?:a )?decision/.test(normalized)) return "DECISION";
  if (/what(?:'s| is) (?:an |a )?execution/.test(normalized)) return "EXECUTION";
  if (/what(?:'s| is) (?:an |a )?outcome/.test(normalized)) return "OUTCOME";
  if (/what objects/.test(normalized) || /what (?:kinds|types) of objects/.test(normalized)) {
    return "LIST";
  }
  if (/\b(?:csv|data library|data object|upload)\b/.test(normalized) && /what|how|show/.test(normalized)) {
    return "DATA";
  }
  if (/\b(?:evidence|cost|time)\b/.test(normalized) && /what|show/.test(normalized)) {
    return "ICONIC";
  }
  if (active) {
    const meaning = interpretCanonicalManagerMeaning({
      utterance,
      subjects: Object.freeze([]),
    });
    if (
      meaning.requestedOperation === "EXPLAIN" ||
      meaning.communicativeIntent === "ASK_EXPLANATION"
    ) {
      return "THIS";
    }
    if (meaning.questionType === "GOAL_RELEVANCE") {
      return "WHY";
    }
    if (meaning.communicativeIntent === "ASK_WHY") {
      return "WHY";
    }
    if (
      meaning.requestedOperation === "COMPARE" ||
      meaning.communicativeIntent === "ASK_COMPARISON"
    ) {
      return "DIFFERENCE";
    }
  }
  return null;
}
