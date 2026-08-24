/**
 * NEX-EXP:1 — entrance session, catalog projection, and conversation overlay.
 * Center transfer uses existing selectNexoraMVPInteractionSubject authority.
 */

import {
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraDecisionRuntimeAdapter } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import type { NexoraExecutionRuntimeAdapter } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import {
  applyManagerIdentityUtterance,
  describeKnownIdentity,
  describeUnknownIdentity,
  emptyManagerIdentityContext,
  extractGoalSignals,
  identitySufficiencyOf,
  isUnnecessaryPersonalDataUtterance,
  nextIdentityQuestionKey,
  questionTextForKey,
  resolveDisplayName,
} from "./nexoraEntranceIdentity.ts";
import { interpretCanonicalManagerMeaning } from "@/app/lib/manager-object/canonicalManagerMeaningInterpreter.ts";
import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import { isDecisionOrExecutionCommand } from "./nexoraScenarioDiscoveryResolution.ts";
import {
  NEXORA_ENTRANCE_OBJECT_ID,
  NEXORA_ENTRANCE_SESSION_STORAGE_KEY,
  NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  type ExecutiveIdentityObject,
  type ManagerIdentityContext,
  type NexoraEntranceSession,
  type NexoraEntranceState,
  type NexoraGoalDiscoveryHandoff,
  type NexoraWorkspaceResolution,
} from "./nexoraEntranceTypes.ts";
import {
  createNexoraGoalDiscoverySession,
  overlayGoalOnEntranceCatalog,
  resolveNexoraGoalDiscoveryTurn,
  shouldNexoraGoalDiscoveryOwnUtterance,
} from "./nexoraGoalDiscoveryExperience.ts";
import {
  overlayIssuesOnEntranceCatalog,
  resolveNexoraIssueDiscoveryTurn,
  shouldNexoraIssueDiscoveryOwnUtterance,
} from "./nexoraIssueDiscoveryExperience.ts";
import {
  overlayScenariosOnEntranceCatalog,
  resolveNexoraScenarioDiscoveryTurn,
  shouldNexoraScenarioDiscoveryOwnUtterance,
} from "./nexoraScenarioDiscoveryExperience.ts";
import {
  overlayComparisonCuesOnEntranceCatalog,
  resolveNexoraScenarioComparisonTurn,
  shouldNexoraScenarioComparisonOwnUtterance,
} from "./nexoraScenarioComparisonExperience.ts";
import {
  overlayDecisionOnEntranceCatalog,
  resolveNexoraDecisionExperienceTurn,
  shouldNexoraDecisionExperienceOwnUtterance,
} from "./nexoraDecisionExperience.ts";
import {
  overlayExecutionOnEntranceCatalog,
  resolveNexoraExecutionPlanningTurn,
  shouldNexoraExecutionPlanningOwnUtterance,
} from "./nexoraExecutionPlanning.ts";
import {
  overlayOutcomeOnEntranceCatalog,
  resolveNexoraOutcomeMonitoringTurn,
  shouldNexoraOutcomeMonitoringOwnUtterance,
} from "./nexoraOutcomeMonitoring.ts";
import {
  overlayLearningOnEntranceCatalog,
  resolveNexoraLearningReassessmentTurn,
  shouldNexoraLearningReassessmentOwnUtterance,
} from "./nexoraLearningReassessment.ts";
import {
  overlayRealityOnEntranceCatalog,
  resolveNexoraRealityDiscoveryTurn,
  shouldNexoraRealityDiscoveryOwnUtterance,
} from "./nexoraRealityDiscoveryExperience.ts";

export {
  NEXORA_ENTRANCE_BOUNDARY,
  NEXORA_ENTRANCE_OBJECT_ID,
  NEXORA_ENTRANCE_SESSION_STORAGE_KEY,
  NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
  getNexoraEntranceExperienceIdentity,
  verifyNexoraEntranceExperience,
} from "./nexoraEntranceTypes.ts";

const INTRO =
  "I’m Nexora. Before we work on decisions, I’d like to understand who I’m working with and what you manage.";

export function isNexoraEntranceRestrained(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  return (
    session?.workspaceResolution === "first-time" ||
    session?.workspaceResolution === "returning-sufficient"
  );
}

export function createNexoraEntranceSession(input: {
  readonly workspaceResolution: NexoraWorkspaceResolution;
  readonly identity?: ManagerIdentityContext | null;
}): NexoraEntranceSession {
  const identity = input.identity ?? emptyManagerIdentityContext();
  const returning =
    input.workspaceResolution === "returning-sufficient" ||
    (input.workspaceResolution === "first-time" &&
      identity.sufficiency === "SUFFICIENT");
  const sufficient = identity.sufficiency === "SUFFICIENT";
  const identityObject = sufficient ? toIdentityObject(identity) : null;
  const state: NexoraEntranceState = returning
    ? "READY_FOR_GOAL_DISCOVERY"
    : input.workspaceResolution === "existing-workspace"
      ? "READY_FOR_GOAL_DISCOVERY"
      : "NEW";
  return freezeSession({
    workspaceResolution: returning
      ? "returning-sufficient"
      : input.workspaceResolution,
    state,
    identity,
    askedQuestionKeys: Object.freeze([]),
    lastQuestionKey: null,
    knownGoalSignals: Object.freeze([]),
    conversationNotes: Object.freeze([]),
    centerSubjectId: returning
      ? NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID
      : input.workspaceResolution === "first-time"
        ? NEXORA_ENTRANCE_OBJECT_ID
        : null,
    identityObject,
    handoff: returning ? toHandoff(identity, identityObject, [], []) : null,
    introduced: returning,
    goalDiscovery: sufficient
      ? createNexoraGoalDiscoverySession({
          relatedExecutiveContext: identityObject?.displayName ?? null,
        })
      : null,
    realityDiscovery: null,
    issueDiscovery: null,
    scenarioDiscovery: null,
    scenarioComparison: null,
    decisionExperience: null,
    executionPlanning: null,
    outcomeMonitoring: null,
    learningReassessment: null,
  });
}

export function projectNexoraEntranceCatalog(
  session: NexoraEntranceSession,
): NexoraMVPObjectInteractionCatalog {
  if (!isNexoraEntranceRestrained(session)) {
    throw new Error("Entrance catalog is only for first-time mode");
  }
  const identityReady =
    session.identity.sufficiency === "SUFFICIENT" &&
    session.identityObject != null;
  const objects: NexoraMVPStageObjectFixture[] = identityReady
    ? [
        Object.freeze({
          id: NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
          label: session.identityObject?.displayName ?? "Executive Context",
          kind: "object" as const,
          position: [0, 0, 0] as const,
          status: "stable" as const,
          attention: "normal" as const,
        }),
      ]
    : [
        Object.freeze({
          id: NEXORA_ENTRANCE_OBJECT_ID,
          label: "Nexora",
          kind: "object" as const,
          position: [0, 0, 0] as const,
          status: "stable" as const,
          attention: "normal" as const,
        }),
      ];
  return overlayLearningOnEntranceCatalog(
    overlayOutcomeOnEntranceCatalog(
      overlayExecutionOnEntranceCatalog(
        overlayDecisionOnEntranceCatalog(
          overlayComparisonCuesOnEntranceCatalog(
            overlayScenariosOnEntranceCatalog(
              overlayIssuesOnEntranceCatalog(
                overlayRealityOnEntranceCatalog(
                  overlayGoalOnEntranceCatalog(
                    Object.freeze({
                      objects: Object.freeze(objects),
                      relationships: Object.freeze([]),
                      contextSubjects: Object.freeze([]),
                      contextLinks: Object.freeze([]),
                    }),
                    session.goalDiscovery,
                  ),
                  session.realityDiscovery,
                ),
                session.issueDiscovery,
              ),
              session.scenarioDiscovery,
            ),
            session.scenarioComparison,
          ),
          session.decisionExperience,
        ),
        session.executionPlanning,
      ),
      session.outcomeMonitoring,
    ),
    session.learningReassessment,
  );
}

export function stabilizeEntranceCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    ...catalog,
    objects: Object.freeze(
      catalog.objects.map((object) =>
        Object.freeze({
          ...object,
          status: "stable" as const,
          attention: "normal" as const,
          primaryValue: undefined,
          primaryMetricLabel: undefined,
        }),
      ),
    ),
  });
}

export function applyEntranceCenterSubject(
  state: NexoraMVPObjectInteractionState,
  session: NexoraEntranceSession,
): NexoraMVPObjectInteractionState {
  const catalog = projectNexoraEntranceCatalog(session);
  const subjectId =
    session.centerSubjectId ??
    catalog.objects[0]?.id ??
    NEXORA_ENTRANCE_OBJECT_ID;
  return selectNexoraMVPInteractionSubject(state, subjectId, catalog);
}

export type NexoraEntranceTurnResult = {
  readonly session: NexoraEntranceSession;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly nextRuntimeState: NexoraMVPObjectInteractionState;
  readonly centerTransferred: boolean;
};

export function resolveNexoraEntranceTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  readonly executionRuntime?: NexoraExecutionRuntimeAdapter | null;
}): NexoraEntranceTurnResult {
  const session = input.session;
  if (session.workspaceResolution === "existing-workspace") {
    return idleTurn(session, input.runtimeState);
  }
  if (shouldNexoraLearningReassessmentOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraLearningReassessmentTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
    });
    const nextSession = freezeSession({
      ...session,
      learningReassessment: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraOutcomeMonitoringOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraOutcomeMonitoringTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
      executionRuntime: input.executionRuntime ?? null,
    });
    const nextSession = freezeSession({
      ...session,
      outcomeMonitoring: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraExecutionPlanningOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraExecutionPlanningTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
      executionRuntime: input.executionRuntime ?? null,
    });
    const nextSession = freezeSession({
      ...session,
      executionPlanning: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraDecisionExperienceOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraDecisionExperienceTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
      decisionRuntime: input.decisionRuntime ?? null,
    });
    const nextSession = freezeSession({
      ...session,
      decisionExperience: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraScenarioComparisonOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraScenarioComparisonTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
    });
    const nextSession = freezeSession({
      ...session,
      scenarioComparison: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraScenarioDiscoveryOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraScenarioDiscoveryTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
    });
    const nextSession = freezeSession({
      ...session,
      scenarioDiscovery: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraIssueDiscoveryOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraIssueDiscoveryTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
    });
    const nextSession = freezeSession({
      ...session,
      issueDiscovery: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraRealityDiscoveryOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraRealityDiscoveryTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
    });
    const nextSession = freezeSession({
      ...session,
      realityDiscovery: turn.session,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (shouldNexoraGoalDiscoveryOwnUtterance(session, input.utterance)) {
    const catalog = projectNexoraEntranceCatalog(session);
    const turn = resolveNexoraGoalDiscoveryTurn({
      utterance: input.utterance,
      entrance: session,
      runtimeState: input.runtimeState,
      catalog,
    });
    const nextSession = freezeSession({
      ...session,
      goalDiscovery: turn.session,
      centerSubjectId:
        turn.session.object && turn.session.context.managerConfirmed
          ? turn.session.object.id
          : session.centerSubjectId,
    });
    return completeTurn({
      session: nextSession,
      runtimeState: turn.nextRuntimeState,
      response: turn.response,
      ownsResponse: turn.ownsResponse,
      shouldCommitRuntime: turn.shouldCommitRuntime,
      centerTransferred: turn.shouldCommitRuntime,
    });
  }
  if (session.workspaceResolution === "returning-sufficient") {
    return resolveReturningTurn(input);
  }

  const utterance = input.utterance.trim();
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");

  if (
    isBusinessObjectRequest(normalized) &&
    session.identity.sufficiency !== "SUFFICIENT"
  ) {
    return completeTurn({
      session,
      runtimeState: input.runtimeState,
      response:
        "That object isn’t part of this environment yet. I only represent what we currently understand about your executive context.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (
    session.identity.sufficiency === "SUFFICIENT" &&
    !isIdentityMetaUtterance(normalized) &&
    !isGreeting(normalized)
  ) {
    if (session.state !== "READY_FOR_GOAL_DISCOVERY") {
      return activateIdentity(input.runtimeState, session);
    }
    if (isIdentityContinuation(utterance, normalized)) {
      return applyContinuation(input.runtimeState, session, utterance);
    }
    return idleTurn(session, input.runtimeState);
  }

  if (isGreeting(normalized) && !session.introduced) {
    const next = freezeSession({
      ...session,
      state: "INTRODUCING",
      introduced: true,
    });
    return completeTurn({
      session: next,
      runtimeState: applyEntranceCenterSubject(input.runtimeState, next),
      response: INTRO,
      ownsResponse: true,
      shouldCommitRuntime: true,
      centerTransferred: false,
    });
  }

  if (isGreeting(normalized) && session.introduced && session.identity.sufficiency !== "SUFFICIENT") {
    return completeTurn({
      session,
      runtimeState: input.runtimeState,
      response: INTRO,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (normalized === "who are you") {
    return completeTurn({
      session: freezeSession({
        ...session,
        introduced: true,
        state: session.state === "NEW" ? "INTRODUCING" : session.state,
      }),
      runtimeState: input.runtimeState,
      response: INTRO,
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (
    /what can you do(?: for me)?/.test(normalized) ||
    /how can you help/.test(normalized)
  ) {
    return completeTurn({
      session: freezeSession({
        ...session,
        introduced: true,
        state: session.state === "NEW" ? "INTRODUCING" : session.state,
      }),
      runtimeState: input.runtimeState,
      response:
        "I help you understand your situation, see what matters, compare possible actions, and make decisions you control. I don’t decide or start work for you.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (
    normalized === "why are you asking this" ||
    normalized === "why are you asking"
  ) {
    return completeTurn({
      session,
      runtimeState: input.runtimeState,
      response:
        "I’m asking only for useful executive context so I can understand who I’m working with before we start making decisions.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (normalized === "what do you know about me") {
    return completeTurn({
      session,
      runtimeState: input.runtimeState,
      response: describeKnownIdentity(session.identity),
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (
    normalized === "what do you still need to know" ||
    normalized === "what do you still need"
  ) {
    return completeTurn({
      session,
      runtimeState: input.runtimeState,
      response: describeUnknownIdentity(session.identity),
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  if (
    isUnnecessaryPersonalDataUtterance(utterance) &&
    !/\bi(?:'m| am)\b/i.test(utterance)
  ) {
    return completeTurn({
      session,
      runtimeState: input.runtimeState,
      response:
        "I only need executive context — role, work, and domain — not personal details.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }

  const nextIdentity = applyManagerIdentityUtterance(session.identity, utterance);
  const goalSignals = unique([
    ...session.knownGoalSignals,
    ...extractGoalSignals(utterance),
  ]);
  const questionKey = nextIdentityQuestionKey(
    nextIdentity,
    session.askedQuestionKeys,
  );
  const askedQuestionKeys = questionKey
    ? unique([...session.askedQuestionKeys, questionKey])
    : session.askedQuestionKeys;
  const nextState = nextEntranceState(session.state, nextIdentity, questionKey);
  const identityObject =
    nextIdentity.sufficiency === "SUFFICIENT"
      ? toIdentityObject(nextIdentity)
      : null;
  const centerSubjectId =
    nextIdentity.sufficiency === "SUFFICIENT"
      ? NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID
      : NEXORA_ENTRANCE_OBJECT_ID;
  const handoff =
    nextIdentity.sufficiency === "SUFFICIENT"
      ? toHandoff(
          nextIdentity,
          identityObject,
          goalSignals,
          session.conversationNotes,
        )
      : null;

  const nextSession = freezeSession({
    ...session,
    state: nextState,
    identity: nextIdentity,
    askedQuestionKeys,
    lastQuestionKey: questionKey,
    knownGoalSignals: goalSignals,
    conversationNotes: Object.freeze(
      [...session.conversationNotes, utterance].slice(-12),
    ),
    centerSubjectId,
    identityObject,
    handoff,
    introduced: true,
  });

  const centerTransferred =
    session.identity.sufficiency !== "SUFFICIENT" &&
    nextIdentity.sufficiency === "SUFFICIENT";
  const nextRuntime = centerTransferred
    ? applyEntranceCenterSubject(input.runtimeState, {
        ...nextSession,
        state: "READY_FOR_GOAL_DISCOVERY",
        identityObject,
      })
    : input.runtimeState;

  const activated = centerTransferred
    ? freezeSession({
        ...nextSession,
        state: "READY_FOR_GOAL_DISCOVERY",
        goalDiscovery:
          session.goalDiscovery ??
          createNexoraGoalDiscoverySession({
            relatedExecutiveContext:
              identityObject?.displayName ?? nextIdentity.executive.displayName,
            knownGoalSignals: goalSignals,
          }),
      })
    : nextSession;

  return completeTurn({
    session: activated,
    runtimeState: nextRuntime,
    response: composeIdentityResponse({
      previous: session.identity,
      next: nextIdentity,
      questionKey,
      centerTransferred,
    }),
    ownsResponse: true,
    shouldCommitRuntime: centerTransferred,
    centerTransferred,
  });
}

export function shouldNexoraEntranceOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
  subjects: readonly NexoraConversationalSubjectRecord[] = Object.freeze([]),
): boolean {
  if (!session || session.workspaceResolution === "existing-workspace") {
    return false;
  }
  const normalized = utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (session.workspaceResolution === "returning-sufficient") {
    return (
      isGreeting(normalized) ||
      isIdentityMetaUtterance(normalized) ||
      shouldNexoraGoalDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraRealityDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraIssueDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraScenarioDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraScenarioComparisonOwnUtterance(session, utterance) ||
      shouldNexoraDecisionExperienceOwnUtterance(session, utterance) ||
      shouldNexoraExecutionPlanningOwnUtterance(session, utterance) ||
      shouldNexoraOutcomeMonitoringOwnUtterance(session, utterance) ||
      shouldNexoraLearningReassessmentOwnUtterance(session, utterance)
    );
  }
  if (session.identity.sufficiency === "SUFFICIENT") {
    return (
      isIdentityMetaUtterance(normalized) ||
      isGreeting(normalized) ||
      isIdentityContinuation(utterance, normalized) ||
      shouldNexoraGoalDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraRealityDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraIssueDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraScenarioDiscoveryOwnUtterance(session, utterance) ||
      shouldNexoraScenarioComparisonOwnUtterance(session, utterance) ||
      shouldNexoraDecisionExperienceOwnUtterance(session, utterance) ||
      shouldNexoraExecutionPlanningOwnUtterance(session, utterance) ||
      shouldNexoraOutcomeMonitoringOwnUtterance(session, utterance) ||
      shouldNexoraLearningReassessmentOwnUtterance(session, utterance) ||
      session.state !== "READY_FOR_GOAL_DISCOVERY"
    );
  }
  const meaning = interpretCanonicalManagerMeaning({
    utterance,
    subjects,
  });
  const executiveAsk =
    meaning.requestedOperation === "HELP" ||
    meaning.requestedOperation === "CAUSE" ||
    meaning.requestedOperation === "EVIDENCE" ||
    meaning.requestedOperation === "COMPARE" ||
    meaning.requestedOperation === "INVESTIGATE" ||
    meaning.requestedOperation === "ATTENTION" ||
    meaning.requestedOperation === "RECOMMEND" ||
    meaning.requestedOperation === "CHALLENGE" ||
    meaning.requestedOperation === "STATUS" ||
    meaning.requestedOperation === "FOCUS" ||
    meaning.requestedOperation === "EXPLAIN" ||
    meaning.communicativeIntent === "ASK_CAPABILITY";
  if (executiveAsk) return false;
  if (isDecisionOrExecutionCommand(normalized)) return false;
  if (
    /\b(?:email|erp|sql|rag|pdf|calendar|warehouse|24\s*\/?\s*7)\b/i.test(
      utterance,
    )
  ) {
    return false;
  }
  return true;
}

function resolveReturningTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraEntranceTurnResult {
  const normalized = input.utterance.toLowerCase().replace(/[.!?]+$/g, "");
  if (isGreeting(normalized) || normalized === "who are you") {
    return completeTurn({
      session: input.session,
      runtimeState: input.runtimeState,
      response:
        "I already have enough executive context to continue. Next, let’s establish what you’re trying to achieve.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (
    /what can you do(?: for me)?/.test(normalized) ||
    /how can you help/.test(normalized)
  ) {
    return completeTurn({
      session: input.session,
      runtimeState: input.runtimeState,
      response:
        "I help you understand your situation, see what matters, compare possible actions, and make decisions you control. I don’t decide or start work for you.",
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  if (isIdentityMetaUtterance(normalized)) {
    return completeTurn({
      session: input.session,
      runtimeState: input.runtimeState,
      response:
        normalized.includes("know about me")
          ? describeKnownIdentity(input.session.identity)
          : describeUnknownIdentity(input.session.identity),
      ownsResponse: true,
      shouldCommitRuntime: false,
      centerTransferred: false,
    });
  }
  return idleTurn(input.session, input.runtimeState);
}

function activateIdentity(
  runtimeState: NexoraMVPObjectInteractionState,
  session: NexoraEntranceSession,
): NexoraEntranceTurnResult {
  const next = freezeSession({
    ...session,
    state: "READY_FOR_GOAL_DISCOVERY",
    centerSubjectId: NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
    identityObject: session.identityObject ?? toIdentityObject(session.identity),
    goalDiscovery:
      session.goalDiscovery ??
      createNexoraGoalDiscoverySession({
        relatedExecutiveContext:
          session.identityObject?.displayName ??
          session.identity.executive.displayName,
        knownGoalSignals: session.knownGoalSignals,
      }),
    handoff:
      session.handoff ??
      toHandoff(
        session.identity,
        session.identityObject,
        session.knownGoalSignals,
        session.conversationNotes,
      ),
  });
  return completeTurn({
    session: next,
    runtimeState: applyEntranceCenterSubject(runtimeState, next),
    response:
      "I have enough context to start building your executive environment. Next, let’s establish what you’re trying to achieve.",
    ownsResponse: true,
    shouldCommitRuntime: true,
    centerTransferred: true,
  });
}

function composeIdentityResponse(input: {
  readonly previous: ManagerIdentityContext;
  readonly next: ManagerIdentityContext;
  readonly questionKey: string | null;
  readonly centerTransferred: boolean;
}): string {
  if (input.centerTransferred) {
    return `${summarizeUnderstood(input.next)} I have enough context to start building your executive environment. Next, let’s establish what you’re trying to achieve.`;
  }
  const understood = summarizeProgress(input.previous, input.next);
  const question = input.questionKey
    ? questionTextForKey(input.questionKey)
    : null;
  if (understood && question) return `${understood} ${question}`;
  if (question) return question;
  return understood || INTRO;
}

function summarizeUnderstood(identity: ManagerIdentityContext): string {
  if (identity.workContext && identity.domain) {
    const mark =
      identity.domainEpistemic === "INFERRED" ? " (inferred)" : "";
    return `Understood. You’re managing ${identity.workContext} in a ${identity.domain}${mark} environment.`;
  }
  if (identity.managerName && identity.workContext) {
    return `Understood. You’re managing ${identity.workContext}.`;
  }
  return "Understood.";
}

function summarizeProgress(
  previous: ManagerIdentityContext,
  next: ManagerIdentityContext,
): string | null {
  if (next.domain && next.domainEpistemic === "KNOWN" && previous.domain !== next.domain) {
    return `Understood. I’ll treat the domain as ${next.domain}.`;
  }
  if (next.workContext && next.domain) {
    const inferred =
      next.domainEpistemic === "INFERRED"
        ? ` It sounds like the domain is ${next.domain}, unless that’s not accurate.`
        : "";
    return `Understood. You’re managing ${next.workContext}.${inferred}`;
  }
  if (next.managerName && !previous.managerName) {
    return `Understood, ${next.managerName}.`;
  }
  if (next.organizationName && !previous.organizationName) {
    return `Understood. ${next.organizationName} is noted.`;
  }
  if (next.role && !previous.role) {
    return `Understood. Your role is ${next.role}.`;
  }
  if (next.workContext && next.workContext !== previous.workContext) {
    return "Got it.";
  }
  return "Understood.";
}

function nextEntranceState(
  current: NexoraEntranceState,
  identity: ManagerIdentityContext,
  questionKey: string | null,
): NexoraEntranceState {
  if (identity.sufficiency === "SUFFICIENT") return "IDENTITY_SUFFICIENT";
  if (questionKey === "who" || questionKey === "who-follow") {
    return "LEARNING_MANAGER";
  }
  if (questionKey === "work" || questionKey === "work-follow") {
    return "LEARNING_ROLE";
  }
  if (questionKey === "domain") return "LEARNING_DOMAIN";
  if (identity.organizationName && !identity.role) return "LEARNING_ORGANIZATION";
  if (current === "NEW") return "INTRODUCING";
  return current;
}

function toIdentityObject(
  identity: ManagerIdentityContext,
): ExecutiveIdentityObject {
  const kind =
    identity.contextKind ??
    (identity.organizationName ? "COMPANY" : "PERSON");
  const displayName = resolveDisplayName(identity);
  const summaryParts = [
    identity.organizationName,
    identity.role,
    identity.domain,
    identity.responsibilities[0],
  ].filter(Boolean);
  return Object.freeze({
    id: NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
    kind,
    displayName,
    managerName: identity.managerName,
    organizationName: identity.organizationName,
    role: identity.role,
    domain: identity.domain,
    skills: Object.freeze([...identity.skills]),
    contextSummary: summaryParts.join(" · ") || displayName,
    epistemicStatus:
      identity.domainEpistemic === "INFERRED" ? "INFERRED" : "KNOWN",
  });
}

function toHandoff(
  identity: ManagerIdentityContext,
  identityObject: ExecutiveIdentityObject | null,
  goalSignals: readonly string[],
  notes: readonly string[],
): NexoraGoalDiscoveryHandoff {
  return Object.freeze({
    identityContext: identity,
    executiveContextObject: identityObject,
    domain: identity.domain,
    knownResponsibilities: Object.freeze([...identity.responsibilities]),
    knownSkills: Object.freeze([...identity.skills]),
    conversationContext: notes.slice(-6).join(" | "),
    knownGoalSignals: Object.freeze([...goalSignals]),
    unknowns: Object.freeze([...identity.unknowns]),
  });
}

function isGreeting(normalized: string): boolean {
  return /^(?:hi|hello|hey|good (?:morning|afternoon|evening))(?: there)?$/.test(
    normalized.replace(/[.!?]+$/g, ""),
  );
}

function isIdentityMetaUtterance(normalized: string): boolean {
  const trimmed = normalized.replace(/[.!?]+$/g, "");
  return (
    /what do you know about me/.test(trimmed) ||
    /what do you still need/.test(trimmed) ||
    /why are you asking/.test(trimmed) ||
    trimmed === "who are you" ||
    /what can you do(?: for me)?/.test(trimmed) ||
    /how can you help/.test(trimmed)
  );
}

function isIdentityContinuation(utterance: string, normalized: string): boolean {
  return (
    /^actually\b/.test(normalized) ||
    /\bwe work in\b/.test(normalized) ||
    /\bwe(?:'re| are) a\b/.test(normalized) ||
    /\bmy role is\b/.test(normalized) ||
    /\bmy skills?\b/.test(normalized) ||
    /\bi work at\b/.test(normalized) ||
    /\bi run\b/.test(normalized) ||
    /\bi mainly manage\b/.test(normalized) ||
    /\bi(?:'m| am) responsible\b/.test(normalized) ||
    /\btrying to\b/.test(normalized) ||
    isUnnecessaryPersonalDataUtterance(utterance)
  );
}

function applyContinuation(
  runtimeState: NexoraMVPObjectInteractionState,
  session: NexoraEntranceSession,
  utterance: string,
): NexoraEntranceTurnResult {
  const nextIdentity = applyManagerIdentityUtterance(session.identity, utterance);
  const goalSignals = unique([
    ...session.knownGoalSignals,
    ...extractGoalSignals(utterance),
  ]);
  const identityObject = toIdentityObject(nextIdentity);
  const nextSession = freezeSession({
    ...session,
    identity: nextIdentity,
    identityObject,
    knownGoalSignals: goalSignals,
    conversationNotes: Object.freeze(
      [...session.conversationNotes, utterance].slice(-12),
    ),
    handoff: toHandoff(
      nextIdentity,
      identityObject,
      goalSignals,
      session.conversationNotes,
    ),
    centerSubjectId: NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID,
    state: "READY_FOR_GOAL_DISCOVERY",
  });
  const labelChanged =
    session.identityObject?.displayName !== identityObject.displayName;
  const priorGoals = new Set(session.knownGoalSignals);
  const addedGoals = goalSignals.filter((signal) => !priorGoals.has(signal));
  const understood = composeIdentityResponse({
    previous: session.identity,
    next: nextIdentity,
    questionKey: null,
    centerTransferred: false,
  });
  return completeTurn({
    session: nextSession,
    runtimeState: labelChanged
      ? applyEntranceCenterSubject(runtimeState, nextSession)
      : runtimeState,
    response: addedGoals.length
      ? `${understood} I’ll carry this as a goal signal for the next step: ${addedGoals[0]}.`
      : understood,
    ownsResponse: true,
    shouldCommitRuntime: labelChanged,
    centerTransferred: false,
  });
}

function isBusinessObjectRequest(normalized: string): boolean {
  return /\bshow (?:capacity|revenue|risks?|scenarios?|decisions?|execution|queue)\b/.test(
    normalized,
  );
}

function idleTurn(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
): NexoraEntranceTurnResult {
  return completeTurn({
    session,
    runtimeState,
    response: "",
    ownsResponse: false,
    shouldCommitRuntime: false,
    centerTransferred: false,
  });
}

function completeTurn(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly centerTransferred: boolean;
}): NexoraEntranceTurnResult {
  return Object.freeze({
    session: input.session,
    response: input.response,
    ownsResponse: input.ownsResponse,
    shouldCommitRuntime: input.shouldCommitRuntime,
    nextRuntimeState: input.runtimeState,
    centerTransferred: input.centerTransferred,
  });
}

function freezeSession(session: NexoraEntranceSession): NexoraEntranceSession {
  return Object.freeze({
    ...session,
    askedQuestionKeys: Object.freeze([...session.askedQuestionKeys]),
    knownGoalSignals: Object.freeze([...session.knownGoalSignals]),
    conversationNotes: Object.freeze([...session.conversationNotes]),
    goalDiscovery: session.goalDiscovery ?? null,
    realityDiscovery: session.realityDiscovery ?? null,
    issueDiscovery: session.issueDiscovery ?? null,
    scenarioDiscovery: session.scenarioDiscovery ?? null,
    scenarioComparison: session.scenarioComparison ?? null,
    decisionExperience: session.decisionExperience ?? null,
    executionPlanning: session.executionPlanning ?? null,
    outcomeMonitoring: session.outcomeMonitoring ?? null,
    learningReassessment: session.learningReassessment ?? null,
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

export function readStoredEntranceIdentity(): ManagerIdentityContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(
      NEXORA_ENTRANCE_SESSION_STORAGE_KEY,
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ManagerIdentityContext;
    if (identitySufficiencyOf(parsed) !== "SUFFICIENT") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredEntranceIdentity(
  identity: ManagerIdentityContext,
): void {
  if (typeof window === "undefined") return;
  if (identity.sufficiency !== "SUFFICIENT") return;
  window.sessionStorage.setItem(
    NEXORA_ENTRANCE_SESSION_STORAGE_KEY,
    JSON.stringify(identity),
  );
}

export function clearStoredEntranceIdentity(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(NEXORA_ENTRANCE_SESSION_STORAGE_KEY);
}
