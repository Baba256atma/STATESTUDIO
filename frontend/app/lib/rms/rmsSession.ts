/**
 * NPA-T RMS:1 — sealed simulation session.
 *
 * Ground Truth is held off the public state object so Nexora knowledge
 * cannot receive world facts by reading the session.
 */

import {
  RMS_MANAGER_AGENT_CONTRACT,
  RMS_NEXORA_PARTICIPANT_CONTRACT,
  RMS_OBSERVER_CONTRACT,
  RMS_OPERATOR_AGENT_CONTRACT,
  tagRmsAction,
  type RmsActorIdentity,
  type RmsParticipantKind,
  type RmsTaggedAction,
} from "./rmsActorContracts.ts";
import type { RmsInteractionMode } from "./rmsFoundationContract.ts";
import {
  createEmptyObservableData,
  freezeRmsGroundTruth,
  nexoraKnowledgeExposesGroundTruth,
  projectRmsNexoraKnowledgeView,
  type RmsGroundTruth,
} from "./rmsGroundTruth.ts";
import type { RmsGroundTruthSeed } from "./rmsWorldEngine.ts";
import { applyRmsWorldEvents, applyRmsWorldEventsOnCurrentTick, pauseRmsWorld } from "./rmsWorldEngine.ts";
import type { RmsWorldEvent } from "./rmsWorldContract.ts";
import {
  recordRmsObservation,
  type RmsObservationClass,
  type RmsObservationResult,
} from "./rmsObservation.ts";
import {
  createRmsClock,
  type RmsHostIdentity,
  type RmsPublicSimulationState,
} from "./rmsSimulationState.ts";
import {
  observeRmsOperationalWorld,
  projectRmsOperatorPermittedView,
} from "./rmsOperatorRuntime.ts";
import { publishRmsObservableToDataReality } from "./rmsDataRealityPublication.ts";
import type { RmsObservableRecord, RmsOperationalSourceFamily, RmsOperatorPermittedView, RmsOperatorPublicationAttempt } from "./rmsOperatorContract.ts";
import {
  createRmsManagerConversationBind,
  rememberRmsManagerTurn,
  chooseRmsManagerUtterance,
  type RmsManagerConversationBind,
} from "./rmsManagerRuntime.ts";
import { speakRmsManagerThroughCc5 } from "./rmsManagerCc5Adapter.ts";
import { classifyRmsConversationTurn } from "./rmsManagerConversationClassification.ts";
import type { RmsManagerKnowledge, RmsManagerObjective, RmsManagerProfile } from "./rmsManagerContract.ts";
import { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
import { measureRmsPerspectives, type RmsObserverReport } from "./rmsObserverMeasurement.ts";
import { RMS_5_BOUNDARY } from "./rmsObserverContract.ts";
import { RMS_6_BOUNDARY, type RmsScheduledDisturbance } from "./rmsEventContract.ts";
import { createRmsEventRuntime, runRmsEventScheduleUntil, type RmsEventRuntimeState } from "./rmsEventRuntime.ts";
import type { RmsHandoffPhase, RmsHandoffTraceEvent, RmsHumanTurnRecord, RmsManagerAuthority, RmsManagerHandoff } from "./rmsHandoffContract.ts";
import type { RmsExperimentTraceEvent, RmsSimulationAction } from "./rmsExperimentContract.ts";

type RmsBoundWorld = {
  current: RmsGroundTruth;
  operatorObservations: readonly RmsObservableRecord[];
  operatorActions: readonly RmsTaggedAction[];
  publications: readonly RmsOperatorPublicationAttempt[];
  manager: RmsManagerConversationBind | null;
  managerActions: readonly RmsTaggedAction[];
  observerReport: RmsObserverReport | null;
  publishedMetricKeys: readonly string[];
  eventRuntime: RmsEventRuntimeState | null;
  activeManagerAuthority: RmsManagerAuthority;
  handoffPhase: RmsHandoffPhase;
  inFlightManagerTurn: boolean;
  scheduledAgentTurns: number;
  managerAgentFrozen: boolean;
  humanTurns: readonly RmsHumanTurnRecord[];
  handoff: RmsManagerHandoff | null;
  handoffTrace: readonly RmsHandoffTraceEvent[];
  simulationActions: readonly RmsSimulationAction[];
  experimentTrace: readonly RmsExperimentTraceEvent[];
  experimentId: string | null;
  branchId: string | null;
};

const WORLD = new WeakMap<RmsPublicSimulationState, RmsBoundWorld>();

export type CreateRmsSessionInput = {
  readonly simulationId: string;
  readonly simulationType: string;
  readonly sessionId: string;
  readonly runId: string;
  readonly host: RmsHostIdentity;
  readonly actors: readonly RmsActorIdentity[];
  readonly groundTruth: RmsGroundTruth | RmsGroundTruthSeed;
  readonly interactionMode?: RmsInteractionMode;
};

export function createRmsFoundationSession(input: CreateRmsSessionInput): RmsPublicSimulationState {
  requireActor(input.actors, "MANAGER_AGENT");
  requireActor(input.actors, "OPERATOR_AGENT");
  requireActor(input.actors, "NEXORA");
  requireActor(input.actors, "OBSERVER");
  const session: RmsPublicSimulationState = Object.freeze({
    identity: Object.freeze({
      simulationId: requireId(input.simulationId, "simulationId"),
      simulationType: requireId(input.simulationType, "simulationType"),
      sessionId: requireId(input.sessionId, "sessionId"),
      runId: requireId(input.runId, "runId"),
    }),
    host: Object.freeze({ ...input.host }),
    clock: createRmsClock(),
    lifecycle: "prepared",
    interactionMode: input.interactionMode ?? "WATCH",
    actors: Object.freeze(input.actors.map((actor) => Object.freeze({ ...actor }))),
    observableData: createEmptyObservableData(),
    nexoraKnowledge: projectRmsNexoraKnowledgeView(),
  });
  WORLD.set(session, {
    current: freezeRmsGroundTruth(input.groundTruth),
    operatorObservations: Object.freeze([]),
    operatorActions: Object.freeze([]),
    publications: Object.freeze([]),
    manager: null,
    managerActions: Object.freeze([]),
    observerReport: null,
    publishedMetricKeys: Object.freeze([]),
    eventRuntime: null,
    activeManagerAuthority: "MANAGER_AGENT",
    handoffPhase: "WATCH",
    inFlightManagerTurn: false,
    scheduledAgentTurns: 0,
    managerAgentFrozen: false,
    humanTurns: Object.freeze([]),
    handoff: null,
    handoffTrace: Object.freeze([]),
    simulationActions: Object.freeze([]),
    experimentTrace: Object.freeze([]),
    experimentId: null,
    branchId: null,
  });
  return session;
}

export function readRmsNexoraKnowledge(session: RmsPublicSimulationState) {
  if (nexoraKnowledgeExposesGroundTruth(session.nexoraKnowledge)) {
    throw new Error("RMS:1 Nexora knowledge must not expose Ground Truth");
  }
  return session.nexoraKnowledge;
}

export function inspectRmsGroundTruth(
  session: RmsPublicSimulationState,
  observer: RmsActorIdentity,
): RmsGroundTruth {
  if (observer.kind !== "OBSERVER") {
    throw new Error("RMS:1 Ground Truth inspection is Observer-only");
  }
  const bound = WORLD.get(session);
  if (!bound) {
    throw new Error("RMS:1 Ground Truth is not bound to this session");
  }
  return bound.current;
}

export function observeRmsSession(
  session: RmsPublicSimulationState,
  observer: RmsActorIdentity,
  classification: RmsObservationClass,
  note: string,
): RmsObservationResult {
  if (observer.kind !== "OBSERVER") {
    throw new Error("RMS:1 observeRmsSession requires OBSERVER");
  }
  inspectRmsGroundTruth(session, observer);
  readRmsNexoraKnowledge(session);
  return Object.freeze({
    observerContract: RMS_OBSERVER_CONTRACT,
    records: Object.freeze([
      recordRmsObservation({
        observationId: `${session.identity.runId}:${classification}`,
        observerActorId: observer.actorId,
        classification,
        note,
      }),
    ]),
    writeAttempted: false,
  });
}

export function applyRmsGroundTruthEvents(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  events: readonly RmsWorldEvent[],
): RmsGroundTruth {
  if (actor.kind === "OBSERVER") {
    throw new Error("RMS:2 Observer cannot alter Ground Truth");
  }
  if (actor.kind === "NEXORA" || actor.kind === "MANAGER_AGENT" || actor.kind === "REAL_MANAGER") {
    throw new Error("RMS:2 Ground Truth evolution is not a Nexora or manager authority");
  }
  if (actor.kind !== "OPERATOR_AGENT") {
    throw new Error("RMS:2 only the Operator Agent may apply world events in RMS:2");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:2 Ground Truth is not bound to this session");
  bound.current = applyRmsWorldEvents(bound.current, events);
  return bound.current;
}

export function applyRmsGroundTruthEventsOnCurrentTick(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  events: readonly RmsWorldEvent[],
): RmsGroundTruth {
  if (actor.kind === "OBSERVER") {
    throw new Error("RMS:2 Observer cannot alter Ground Truth");
  }
  if (actor.kind === "NEXORA" || actor.kind === "MANAGER_AGENT" || actor.kind === "REAL_MANAGER") {
    throw new Error("RMS:2 Ground Truth evolution is not a Nexora or manager authority");
  }
  if (actor.kind !== "OPERATOR_AGENT") {
    throw new Error("RMS:2 only the Operator Agent may apply world events in RMS:2");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:2 Ground Truth is not bound to this session");
  bound.current = applyRmsWorldEventsOnCurrentTick(bound.current, events);
  return bound.current;
}

export function pauseRmsGroundTruth(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  paused: boolean,
): RmsGroundTruth {
  if (actor.kind !== "OPERATOR_AGENT") {
    throw new Error("RMS:2 pause requires OPERATOR_AGENT");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:2 Ground Truth is not bound to this session");
  bound.current = pauseRmsWorld(bound.current, paused);
  return bound.current;
}

export function readRmsOperatorOperationalView(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
): RmsOperatorPermittedView {
  if (actor.kind !== "OPERATOR_AGENT") {
    throw new Error("RMS:3 operational Ground Truth view is Operator-only");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:3 Ground Truth is not bound to this session");
  return projectRmsOperatorPermittedView(bound.current);
}

export function runRmsOperatorObservation(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  extras?: { readonly enabledSources?: readonly RmsOperationalSourceFamily[] },
): readonly RmsObservableRecord[] {
  if (actor.kind !== "OPERATOR_AGENT") {
    throw new Error("RMS:3 observation requires OPERATOR_AGENT");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:3 Ground Truth is not bound to this session");
  const records = observeRmsOperationalWorld({
    world: bound.current,
    simulationId: session.identity.simulationId,
    runId: session.identity.runId,
    enabledSources: extras?.enabledSources,
  });
  bound.operatorObservations = Object.freeze([...bound.operatorObservations, ...records]);
  bound.operatorActions = Object.freeze([
    ...bound.operatorActions,
    tagRmsAction({
      actionId: `${session.identity.runId}:observe:${bound.current.clock.tick}:${bound.operatorActions.length}`,
      actorId: actor.actorId,
      actorKind: "OPERATOR_AGENT",
      managerChannelSource: null,
      kind: "OPERATIONAL_OBSERVATION",
    }),
  ]);
  return records;
}

export function publishRmsOperatorObservableData(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  records: readonly RmsObservableRecord[],
) {
  if (actor.kind !== "OPERATOR_AGENT") {
    throw new Error("RMS:3 publication requires OPERATOR_AGENT");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:3 Ground Truth is not bound to this session");
  const published = publishRmsObservableToDataReality({
    records,
    runId: session.identity.runId,
  });
  const attempt: RmsOperatorPublicationAttempt = Object.freeze({
    attemptId: `${session.identity.runId}:publish:${bound.publications.length}`,
    tick: bound.current.clock.tick,
    accepted: published.handoff.ready,
    snapshotId: published.handoff.ready ? published.handoff.handoff.sourceSnapshotId : null,
    datasetId: published.handoff.ready ? published.handoff.handoff.dataset.id : null,
    destinationAuthority: published.handoff.ready ? "P0:1/NexoraDataRealityFoundation" : null,
    leakedGroundTruth: false,
  });
  bound.publications = Object.freeze([...bound.publications, attempt]);
  if (published.handoff.ready) {
    bound.publishedMetricKeys = Object.freeze(published.handoff.handoff.dataset.records.map((item) => item.metricKey));
  }
  bound.operatorActions = Object.freeze([
    ...bound.operatorActions,
    tagRmsAction({
      actionId: attempt.attemptId,
      actorId: actor.actorId,
      actorKind: "OPERATOR_AGENT",
      managerChannelSource: null,
      kind: "PUBLISH_OBSERVABLE_DATA",
    }),
  ]);
  return Object.freeze({ ...published, attempt });
}

export function inspectRmsOperatorLedger(
  session: RmsPublicSimulationState,
  observer: RmsActorIdentity,
) {
  if (observer.kind !== "OBSERVER") {
    throw new Error("RMS:3 Operator ledger inspection is Observer-only");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:3 Ground Truth is not bound to this session");
  return Object.freeze({
    groundTruth: bound.current,
    observations: bound.operatorObservations,
    actions: bound.operatorActions,
    publications: bound.publications,
    writeAttempted: false as const,
  });
}

export function prepareRmsManagerConversation(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  input: {
    readonly profile: RmsManagerProfile;
    readonly objective: RmsManagerObjective;
    readonly knowledge?: RmsManagerKnowledge;
  },
): RmsManagerConversationBind {
  if (actor.kind !== "MANAGER_AGENT") {
    throw new Error("RMS:4 Manager conversation prepare requires MANAGER_AGENT");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:4 session is not bound");
  if (RMS_4_BOUNDARY.managerReadsGroundTruth) throw new Error("RMS:4 Manager must not read Ground Truth");
  bound.manager = createRmsManagerConversationBind(input);
  bound.managerActions = Object.freeze([
    ...bound.managerActions,
    tagRmsAction({
      actionId: `${session.identity.runId}:prepare-manager`,
      actorId: actor.actorId,
      actorKind: "MANAGER_AGENT",
      managerChannelSource: "MANAGER_AGENT",
      kind: "PREPARE_MANAGER_CONVERSATION",
    }),
  ]);
  return bound.manager;
}

export function runRmsManagerConversationTurn(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  extras?: {
    readonly imperfect?: "incomplete" | "typo" | "deicticExplain" | "deicticMore" | "deicticInvestigate" | "wrongName" | "topicShift";
    readonly forcedUtterance?: string;
  },
) {
  if (actor.kind !== "MANAGER_AGENT") {
    throw new Error("RMS:4 conversation turns require MANAGER_AGENT");
  }
  const bound = WORLD.get(session);
  if (!bound?.manager) throw new Error("RMS:4 Manager conversation is not prepared");
  if (bound.managerAgentFrozen || bound.activeManagerAuthority !== "MANAGER_AGENT" || bound.handoffPhase === "TAKE_CONTROL") {
    throw new Error("RMS:9 Manager Agent cannot submit turns after Human ownership");
  }
  if (bound.handoffPhase === "HANDOFF_PENDING") {
    throw new Error("RMS:9 Manager Agent cannot start a turn during handoff");
  }
  if (bound.inFlightManagerTurn) {
    throw new Error("RMS:9 a manager turn is already in flight");
  }
  bound.inFlightManagerTurn = true;
  try {
  const choice = chooseRmsManagerUtterance(bound.manager, extras);
  const previousSubjectId = bound.manager.previousCc5?.trace.executiveCurrentSubjectId ?? bound.manager.previousCc5?.nextRuntimeState.focusedSubject?.id ?? null;
  const expectedLabel = bound.manager.knowledge.currentSubject;
  const result = speakRmsManagerThroughCc5({
    utterance: choice.utterance,
    previous: bound.manager.previousCc5,
    messageIdSeed: `${session.identity.runId}:mgr:${bound.manager.memory.turnCount}`,
  });
  if (RMS_4_BOUNDARY.rewriteNexoraResponses) throw new Error("RMS:4 must not rewrite Nexora");
  rememberRmsManagerTurn(bound.manager, { intent: choice.intent, utterance: choice.utterance, result });
  bound.manager.classifications = Object.freeze([
    ...bound.manager.classifications,
    ...classifyRmsConversationTurn({
      classificationId: `${session.identity.runId}:cls:${bound.manager.memory.turnCount}`,
      utterance: choice.utterance,
      result,
      previousSubjectId,
      expectedSubjectLabel: expectedLabel,
    }),
  ]);
  bound.managerActions = Object.freeze([
    ...bound.managerActions,
    tagRmsAction({
      actionId: `${session.identity.runId}:speak:${bound.manager.memory.turnCount}`,
      actorId: actor.actorId,
      actorKind: "MANAGER_AGENT",
      managerChannelSource: "MANAGER_AGENT",
      kind: "MANAGER_UTTERANCE",
    }),
  ]);
  return Object.freeze({
    intent: choice.intent,
    utterance: choice.utterance,
    replacesNexoraIntent: false as const,
    nexoraResponse: result.response,
    nexoraIntentKind: result.intentResult.intent.kind,
    result,
    rewritten: false as const,
    autoConfirm: bound.manager.autoConfirm,
    autoApproveDecision: bound.manager.autoApproveDecision,
    autoStartExecution: bound.manager.autoStartExecution,
  });
  } finally {
    bound.inFlightManagerTurn = false;
    settleRmsManagerHandoffIfPending(session);
  }
}

export function inspectRmsManagerConversation(
  session: RmsPublicSimulationState,
  observer: RmsActorIdentity,
) {
  if (observer.kind !== "OBSERVER") {
    throw new Error("RMS:4 Manager conversation inspection is Observer-only");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:4 session is not bound");
  return Object.freeze({
    objective: bound.manager?.objective ?? null,
    profile: bound.manager?.profile ?? null,
    knowledge: bound.manager?.knowledge ?? null,
    memory: bound.manager?.memory ?? null,
    lastIntent: bound.manager?.lastIntent ?? null,
    lastUtterance: bound.manager?.lastUtterance ?? null,
    lastNexoraResponse: bound.manager?.lastNexoraResponse ?? null,
    turns: bound.manager?.turns ?? Object.freeze([]),
    classifications: bound.manager?.classifications ?? Object.freeze([]),
    actions: bound.managerActions,
    groundTruth: bound.current,
    writeAttempted: false as const,
    fedGroundTruthToManager: false as const,
  });
}

export function measureRmsObserverIntelligence(
  session: RmsPublicSimulationState,
  observer: RmsActorIdentity,
  extras?: {
    readonly omitObservableFields?: readonly string[];
    readonly fixtureReferent?: { readonly active: string; readonly nexoraSubject: string };
    readonly fixtureLeak?: { readonly path: string; readonly fact: string };
    readonly unauthorizedMutation?: boolean;
    readonly runtimeException?: string | null;
    readonly publishedMetricKeys?: readonly string[];
  },
): RmsObserverReport {
  if (observer.kind !== "OBSERVER") {
    throw new Error("RMS:5 measurement requires OBSERVER");
  }
  if (RMS_5_BOUNDARY.leaksGroundTruthToManager || RMS_5_BOUNDARY.leaksGroundTruthToNexora) {
    throw new Error("RMS:5 must not leak Ground Truth");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:5 session is not bound");
  const observations = extras?.omitObservableFields
    ? bound.operatorObservations.filter((item) => !extras.omitObservableFields?.includes(item.field))
    : bound.operatorObservations;
  const publishedMetricKeys = extras?.publishedMetricKeys ?? bound.publishedMetricKeys;
  const report = measureRmsPerspectives({
    simulationId: session.identity.simulationId,
    runId: session.identity.runId,
    world: bound.current,
    observations,
    publications: bound.publications,
    publishedMetricKeys,
    managerTurns: bound.manager?.turns ?? [],
    managerKnowledge: bound.manager?.knowledge ?? null,
    nexoraKnowledge: session.nexoraKnowledge,
    unauthorizedMutation: extras?.unauthorizedMutation ?? false,
    runtimeException: extras?.runtimeException ?? null,
    fixtureReferent: extras?.fixtureReferent,
    fixtureLeak: extras?.fixtureLeak,
    eventTraces: bound.eventRuntime?.traces,
  });
  bound.observerReport = report;
  return report;
}

export function inspectRmsObserverReport(session: RmsPublicSimulationState, observer: RmsActorIdentity) {
  if (observer.kind !== "OBSERVER") {
    throw new Error("RMS:5 Observer report inspection is Observer-only");
  }
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:5 session is not bound");
  return Object.freeze({
    report: bound.observerReport,
    writeAttempted: false as const,
    repaired: false as const,
  });
}

export function loadRmsEventSchedule(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  schedule: readonly RmsScheduledDisturbance[],
): RmsEventRuntimeState {
  if (actor.kind !== "OPERATOR_AGENT") throw new Error("RMS:6 event schedule requires OPERATOR_AGENT");
  if (RMS_6_BOUNDARY.injectsProblemObjects) throw new Error("RMS:6 must not inject Problem objects");
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:6 session is not bound");
  bound.eventRuntime = createRmsEventRuntime(schedule);
  return bound.eventRuntime;
}

export function stepRmsEventSchedule(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  untilTick: number,
) {
  if (actor.kind !== "OPERATOR_AGENT") throw new Error("RMS:6 event stepping requires OPERATOR_AGENT");
  const bound = WORLD.get(session);
  if (!bound?.eventRuntime) throw new Error("RMS:6 event schedule is not loaded");
  const stepped = runRmsEventScheduleUntil(bound.current, bound.eventRuntime, untilTick);
  bound.current = stepped.world;
  bound.eventRuntime = stepped.runtime;
  return stepped;
}

export function inspectRmsEventSchedule(session: RmsPublicSimulationState, observer: RmsActorIdentity) {
  if (observer.kind !== "OBSERVER") throw new Error("RMS:6 event inspection is Observer-only");
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:6 session is not bound");
  return Object.freeze({
    runtime: bound.eventRuntime,
    writeAttempted: false as const,
    hiddenFromNexora: true as const,
    hiddenFromManager: true as const,
  });
}

export function exportRmsWatchSafeSurface(
  session: RmsPublicSimulationState,
  identity?: { readonly scenarioId: string; readonly version: string },
): import("./rmsWatchContract.ts").RmsWatchSafeSurface {
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:8 watch surface requires a bound session");
  const manager = bound.manager;
  const lastTurn = manager?.turns[manager.turns.length - 1] ?? null;
  const workspace = manager?.previousCc5?.nextRuntimeState.workspace ?? null;
  return Object.freeze({
    scenarioId: identity?.scenarioId ?? "",
    version: identity?.version ?? "1.0",
    simulationId: session.identity.simulationId,
    runId: session.identity.runId,
    managerLabel: "Simulated Manager" as const,
    managerObjective: manager?.objective.statement ?? "",
    hostKind: manager?.objective.hostKind ?? "BUSINESS",
    turns: Object.freeze(
      (manager?.turns ?? []).map((turn) =>
        Object.freeze({
          turnIndex: turn.turnIndex,
          intent: turn.intent,
          utterance: turn.utterance,
          nexoraResponse: turn.nexoraResponse,
          rewritten: false as const,
          focusedSubjectId: turn.focusedSubjectId,
          focusedSubjectLabel: turn.focusedSubjectLabel,
          confirmationRequired: turn.confirmationRequired,
        }),
      ),
    ),
    data: Object.freeze(
      bound.operatorObservations.map((item) =>
        Object.freeze({
          field: item.field,
          value: item.value,
          unit: item.unit,
          status: item.status,
          semanticConfirmed: false as const,
        }),
      ),
    ),
    publicationCount: bound.publications.length,
    managerTurnCount: manager?.turns.length ?? 0,
    stage: Object.freeze({
      authority: "Nexora Stage" as const,
      workspace,
      focusedSubjectId: lastTurn?.focusedSubjectId ?? null,
      focusedSubjectLabel: lastTurn?.focusedSubjectLabel ?? null,
      rmsOwnsStage: false as const,
    }),
  });
}

export function rmsActorContracts() {
  return Object.freeze({
    managerAgent: RMS_MANAGER_AGENT_CONTRACT,
    operatorAgent: RMS_OPERATOR_AGENT_CONTRACT,
    nexora: RMS_NEXORA_PARTICIPANT_CONTRACT,
    observer: RMS_OBSERVER_CONTRACT,
  });
}

export function isRmsManagerTurnInFlight(session: RmsPublicSimulationState): boolean {
  return requireBound(session).inFlightManagerTurn;
}

export function cloneRmsFoundationSession(
  source: RmsPublicSimulationState,
  observer: RmsActorIdentity,
  identity: {
    readonly simulationId: string;
    readonly sessionId: string;
    readonly runId: string;
    readonly worldId: string;
  },
  interactionMode: RmsInteractionMode = "EXPERIMENT",
): RmsPublicSimulationState {
  if (observer.kind !== "OBSERVER") throw new Error("RMS:10 fork clone is Observer-gated");
  inspectRmsGroundTruth(source, observer);
  const parent = requireBound(source);
  if (parent.inFlightManagerTurn) throw new Error("RMS:10 cannot fork during an in-flight manager turn");
  const session: RmsPublicSimulationState = Object.freeze({
    identity: Object.freeze({
      simulationId: requireId(identity.simulationId, "simulationId"),
      simulationType: source.identity.simulationType,
      sessionId: requireId(identity.sessionId, "sessionId"),
      runId: requireId(identity.runId, "runId"),
    }),
    host: Object.freeze({ ...source.host }),
    clock: createRmsClock(parent.current.clock.tick, parent.current.clock.simulatedAt),
    lifecycle: source.lifecycle,
    interactionMode,
    actors: source.actors,
    observableData: createEmptyObservableData(),
    nexoraKnowledge: projectRmsNexoraKnowledgeView(),
  });
  WORLD.set(session, {
    current: cloneWorld(parent.current, identity.worldId),
    operatorObservations: Object.freeze([...parent.operatorObservations]),
    operatorActions: Object.freeze([...parent.operatorActions]),
    publications: Object.freeze([...parent.publications]),
    manager: cloneManagerBind(parent.manager),
    managerActions: Object.freeze([...parent.managerActions]),
    observerReport: parent.observerReport,
    publishedMetricKeys: Object.freeze([...parent.publishedMetricKeys]),
    eventRuntime: cloneEventRuntime(parent.eventRuntime),
    activeManagerAuthority: parent.activeManagerAuthority,
    handoffPhase: parent.handoffPhase,
    inFlightManagerTurn: false,
    scheduledAgentTurns: 0,
    managerAgentFrozen: parent.managerAgentFrozen,
    humanTurns: Object.freeze([...parent.humanTurns]),
    handoff: parent.handoff,
    handoffTrace: Object.freeze([...parent.handoffTrace]),
    simulationActions: Object.freeze([]),
    experimentTrace: Object.freeze([]),
    experimentId: null,
    branchId: null,
  });
  return session;
}

export function attachRmsExperimentBranch(
  session: RmsPublicSimulationState,
  identity: { readonly experimentId: string; readonly branchId: string },
): void {
  const bound = requireBound(session);
  bound.experimentId = identity.experimentId;
  bound.branchId = identity.branchId;
}

export function recordRmsSimulationAction(session: RmsPublicSimulationState, action: RmsSimulationAction): void {
  const bound = requireBound(session);
  bound.simulationActions = Object.freeze([...bound.simulationActions, action]);
}

export function replaceRmsSimulationAction(
  session: RmsPublicSimulationState,
  simulationActionId: string,
  next: RmsSimulationAction,
): void {
  const bound = requireBound(session);
  bound.simulationActions = Object.freeze(
    bound.simulationActions.map((item) => (item.simulationActionId === simulationActionId ? next : item)),
  );
}

export function inspectRmsSimulationActions(session: RmsPublicSimulationState, observer: RmsActorIdentity) {
  if (observer.kind !== "OBSERVER") throw new Error("RMS:10 simulation-action inspection is Observer-only");
  const bound = requireBound(session);
  return Object.freeze({
    actions: bound.simulationActions,
    experimentId: bound.experimentId,
    branchId: bound.branchId,
    writeAttempted: false as const,
  });
}

export function recordRmsExperimentTrace(session: RmsPublicSimulationState, event: RmsExperimentTraceEvent): void {
  const bound = requireBound(session);
  bound.experimentTrace = Object.freeze([...bound.experimentTrace, event]);
}

export function inspectRmsExperimentTrace(session: RmsPublicSimulationState, observer: RmsActorIdentity) {
  if (observer.kind !== "OBSERVER") throw new Error("RMS:10 experiment trace is Observer-only");
  const bound = requireBound(session);
  return Object.freeze({
    events: bound.experimentTrace,
    writeAttempted: false as const,
    customerVisible: false as const,
  });
}

export function getRmsActiveManagerAuthority(session: RmsPublicSimulationState): RmsManagerAuthority {
  const bound = requireBound(session);
  return bound.activeManagerAuthority;
}

export function getRmsHandoffPhase(session: RmsPublicSimulationState): RmsHandoffPhase {
  return requireBound(session).handoffPhase;
}

export function inspectRmsHandoffTrace(session: RmsPublicSimulationState, observer: RmsActorIdentity) {
  if (observer.kind !== "OBSERVER") throw new Error("RMS:9 handoff trace is Observer-only");
  const bound = requireBound(session);
  return Object.freeze({
    phase: bound.handoffPhase,
    authority: bound.activeManagerAuthority,
    handoff: bound.handoff,
    trace: bound.handoffTrace,
    scheduledAgentTurns: bound.scheduledAgentTurns,
    managerAgentFrozen: bound.managerAgentFrozen,
    humanTurns: bound.humanTurns,
    writeAttempted: false as const,
  });
}

export function setRmsManagerTurnInFlight(session: RmsPublicSimulationState, inFlight: boolean): void {
  const bound = requireBound(session);
  bound.inFlightManagerTurn = inFlight;
  if (!inFlight) settleRmsManagerHandoffIfPending(session);
}

export function scheduleRmsManagerAgentTurn(session: RmsPublicSimulationState): void {
  const bound = requireBound(session);
  bound.scheduledAgentTurns += 1;
}

export function flushRmsScheduledManagerAgentTurns(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
): number {
  const bound = requireBound(session);
  let executed = 0;
  while (bound.scheduledAgentTurns > 0) {
    if (bound.managerAgentFrozen || bound.activeManagerAuthority !== "MANAGER_AGENT") {
      bound.handoffTrace = Object.freeze([
        ...bound.handoffTrace,
        traceEvent(session, "SCHEDULED_AGENT_BLOCKED", bound),
      ]);
      bound.scheduledAgentTurns = 0;
      break;
    }
    bound.scheduledAgentTurns -= 1;
    runRmsManagerConversationTurn(session, actor);
    executed += 1;
  }
  return executed;
}

export function beginRmsTakeControlRequest(session: RmsPublicSimulationState, handoff: RmsManagerHandoff): RmsManagerHandoff {
  const bound = requireBound(session);
  if (bound.activeManagerAuthority === "HUMAN_MANAGER" && bound.handoff) return bound.handoff;
  if (!bound.manager) {
    return failHandoff(bound, handoff, "missing conversation authority");
  }
  bound.handoffTrace = Object.freeze([...bound.handoffTrace, traceEvent(session, "REQUESTED", bound)]);
  if (bound.inFlightManagerTurn) {
    bound.handoffPhase = "HANDOFF_PENDING";
    bound.handoff = Object.freeze({ ...handoff, status: "HANDOFF_PENDING", effectiveAtTick: null });
    bound.handoffTrace = Object.freeze([...bound.handoffTrace, traceEvent(session, "PENDING_IN_FLIGHT", bound)]);
    return bound.handoff;
  }
  applyHumanOwnership(bound, session, handoff);
  return bound.handoff!;
}

export function runRmsHumanManagerTurn(
  session: RmsPublicSimulationState,
  actor: RmsActorIdentity,
  utterance: string,
) {
  if (actor.kind !== "REAL_MANAGER") throw new Error("RMS:9 human turns require REAL_MANAGER");
  const bound = requireBound(session);
  if (bound.handoffPhase !== "TAKE_CONTROL" || bound.activeManagerAuthority !== "HUMAN_MANAGER") {
    throw new Error("RMS:9 Human Manager cannot submit before successful handoff");
  }
  if (!bound.manager) throw new Error("RMS:9 conversation bind is missing");
  if (RMS_4_BOUNDARY.autoConfirm || RMS_4_BOUNDARY.autoApproveDecision || RMS_4_BOUNDARY.autoStartExecution) {
    throw new Error("RMS:9 must not bypass confirmation/Decision/Execution");
  }
  const previousSubjectId = bound.manager.previousCc5?.trace.executiveCurrentSubjectId ?? bound.manager.previousCc5?.nextRuntimeState.focusedSubject?.id ?? null;
  const expectedLabel = bound.manager.knowledge.currentSubject;
  const result = speakRmsManagerThroughCc5({
    utterance,
    previous: bound.manager.previousCc5,
    messageIdSeed: `${session.identity.runId}:human:${bound.humanTurns.length}`,
  });
  rememberRmsManagerTurn(bound.manager, { intent: "FOLLOW_UP", utterance, result });
  bound.manager.classifications = Object.freeze([
    ...bound.manager.classifications,
    ...classifyRmsConversationTurn({
      classificationId: `${session.identity.runId}:human-cls:${bound.humanTurns.length}`,
      utterance,
      result,
      previousSubjectId,
      expectedSubjectLabel: expectedLabel,
    }),
  ]);
  const humanTurn: RmsHumanTurnRecord = Object.freeze({
    turnIndex: bound.humanTurns.length + 1,
    speaker: "HUMAN_MANAGER",
    label: "You",
    text: utterance,
    nexoraResponse: result.response,
    rewritten: false,
    focusedSubjectId: result.nextRuntimeState.focusedSubject?.id ?? result.trace.executiveCurrentSubjectId ?? null,
    focusedSubjectLabel: result.nextRuntimeState.focusedSubject?.label ?? null,
  });
  bound.humanTurns = Object.freeze([...bound.humanTurns, humanTurn]);
  bound.managerActions = Object.freeze([
    ...bound.managerActions,
    tagRmsAction({
      actionId: `${session.identity.runId}:human:${humanTurn.turnIndex}`,
      actorId: actor.actorId,
      actorKind: "REAL_MANAGER",
      managerChannelSource: "REAL_MANAGER",
      kind: "MANAGER_UTTERANCE",
    }),
  ]);
  bound.handoffTrace = Object.freeze([...bound.handoffTrace, traceEvent(session, "HUMAN_TURN", bound)]);
  return Object.freeze({
    utterance,
    nexoraResponse: result.response,
    rewritten: false as const,
    autoConfirm: false as const,
    autoApproveDecision: false as const,
    autoStartExecution: false as const,
    result,
    turn: humanTurn,
  });
}

function settleRmsManagerHandoffIfPending(session: RmsPublicSimulationState): void {
  const bound = WORLD.get(session);
  if (!bound?.handoff) return;
  if (bound.handoffPhase === "HANDOFF_PENDING" && !bound.inFlightManagerTurn) {
    applyHumanOwnership(bound, session, bound.handoff);
  }
}

function applyHumanOwnership(bound: RmsBoundWorld, session: RmsPublicSimulationState, handoff: RmsManagerHandoff): void {
  bound.activeManagerAuthority = "HUMAN_MANAGER";
  bound.handoffPhase = "TAKE_CONTROL";
  bound.managerAgentFrozen = true;
  bound.scheduledAgentTurns = 0;
  bound.handoff = Object.freeze({
    ...handoff,
    status: "TAKE_CONTROL",
    effectiveAtTick: bound.current.clock.tick,
    failureReason: null,
    customerMessage: "You are now the active manager. Nexora has the current context.",
  });
  bound.handoffTrace = Object.freeze([
    ...bound.handoffTrace,
    traceEvent(session, "AUTHORITY_CHANGED", bound),
    traceEvent(session, "AGENT_FROZEN", bound),
    traceEvent(session, "HUMAN_ACTIVATED", bound),
  ]);
}

function failHandoff(bound: RmsBoundWorld, handoff: RmsManagerHandoff, reason: string): RmsManagerHandoff {
  bound.handoffPhase = "HANDOFF_FAILED";
  bound.activeManagerAuthority = "MANAGER_AGENT";
  bound.managerAgentFrozen = false;
  bound.handoff = Object.freeze({
    ...handoff,
    status: "HANDOFF_FAILED",
    effectiveAtTick: null,
    failureReason: reason,
    customerMessage: "Take Control could not finish. You remain in Watch.",
  });
  bound.handoffTrace = Object.freeze([
    ...bound.handoffTrace,
    Object.freeze({
      eventId: `${handoff.runId}:handoff:failed`,
      kind: "FAILED" as const,
      atTick: bound.current.clock.tick,
      authority: "MANAGER_AGENT" as const,
    }),
  ]);
  return bound.handoff;
}

function traceEvent(
  session: RmsPublicSimulationState,
  kind: RmsHandoffTraceEvent["kind"],
  bound: RmsBoundWorld,
): RmsHandoffTraceEvent {
  return Object.freeze({
    eventId: `${session.identity.runId}:handoff:${bound.handoffTrace.length}:${kind}`,
    kind,
    atTick: bound.current.clock.tick,
    authority: bound.activeManagerAuthority,
  });
}

function requireBound(session: RmsPublicSimulationState) {
  const bound = WORLD.get(session);
  if (!bound) throw new Error("RMS:9 session is not bound");
  return bound;
}

function requireId(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`RMS:1 ${field} is required`);
  return trimmed;
}

function requireActor(actors: readonly RmsActorIdentity[], kind: RmsParticipantKind): void {
  if (!actors.some((actor) => actor.kind === kind)) {
    throw new Error(`RMS:1 session requires a ${kind} actor`);
  }
}

function cloneWorld(world: RmsGroundTruth, worldId: string): RmsGroundTruth {
  return Object.freeze({
    ...world,
    worldId,
    entities: Object.freeze(world.entities.map((item) => Object.freeze({ ...item }))),
    variables: Object.freeze(world.variables.map((item) => Object.freeze({ ...item }))),
    relationships: Object.freeze(world.relationships.map((item) => Object.freeze({ ...item }))),
    history: Object.freeze(world.history.map((item) => Object.freeze({ ...item }))),
    facts: Object.freeze(world.facts.map((item) => Object.freeze({ ...item }))),
  });
}

function cloneManagerBind(bind: RmsManagerConversationBind | null): RmsManagerConversationBind | null {
  if (!bind) return null;
  return {
    profile: bind.profile,
    objective: bind.objective,
    knowledge: bind.knowledge,
    memory: bind.memory,
    lastIntent: bind.lastIntent,
    lastUtterance: bind.lastUtterance,
    lastNexoraResponse: bind.lastNexoraResponse,
    previousCc5: bind.previousCc5,
    turns: Object.freeze([...bind.turns]),
    classifications: Object.freeze([...bind.classifications]),
    autoConfirm: false,
    autoApproveDecision: false,
    autoStartExecution: false,
  };
}

function cloneEventRuntime(runtime: RmsEventRuntimeState | null): RmsEventRuntimeState | null {
  if (!runtime) return null;
  return Object.freeze({
    schedule: runtime.schedule,
    active: Object.freeze([...runtime.active]),
    traces: Object.freeze(
      runtime.traces.map((item) =>
        Object.freeze({
          ...item,
          historyIds: Object.freeze([...item.historyIds]),
        }),
      ),
    ),
    lastCompiledEffects: Object.freeze(runtime.lastCompiledEffects.map((item) => Object.freeze({ ...item }))),
  });
}
