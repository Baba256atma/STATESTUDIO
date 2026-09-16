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
  type RmsActorIdentity,
  type RmsParticipantKind,
} from "./rmsActorContracts.ts";
import type { RmsInteractionMode } from "./rmsFoundationContract.ts";
import {
  createEmptyObservableData,
  freezeRmsGroundTruth,
  nexoraKnowledgeExposesGroundTruth,
  projectRmsNexoraKnowledgeView,
  type RmsGroundTruth,
} from "./rmsGroundTruth.ts";
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

const WORLD = new WeakMap<RmsPublicSimulationState, RmsGroundTruth>();

export type CreateRmsSessionInput = {
  readonly simulationId: string;
  readonly simulationType: string;
  readonly sessionId: string;
  readonly runId: string;
  readonly host: RmsHostIdentity;
  readonly actors: readonly RmsActorIdentity[];
  readonly groundTruth: RmsGroundTruth;
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
  WORLD.set(session, freezeRmsGroundTruth(input.groundTruth));
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
  const world = WORLD.get(session);
  if (!world) {
    throw new Error("RMS:1 Ground Truth is not bound to this session");
  }
  return world;
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

export function rmsActorContracts() {
  return Object.freeze({
    managerAgent: RMS_MANAGER_AGENT_CONTRACT,
    operatorAgent: RMS_OPERATOR_AGENT_CONTRACT,
    nexora: RMS_NEXORA_PARTICIPANT_CONTRACT,
    observer: RMS_OBSERVER_CONTRACT,
  });
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
