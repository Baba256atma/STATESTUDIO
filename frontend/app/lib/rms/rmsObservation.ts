/**
 * NPA-T RMS:1 — Observer classification contract.
 *
 * Observer records classifications. It does not repair, influence, or override.
 */

import { RMS_OBSERVER_CONTRACT } from "./rmsActorContracts.ts";

export const RMS_OBSERVATION_CLASSES = Object.freeze([
  "MANAGER_AGENT_ERROR",
  "OPERATOR_AGENT_ERROR",
  "NEXORA_BEHAVIOR_ERROR",
  "CONVERSATION_ERROR",
  "DATA_ERROR",
  "OBJECT_REFERENT_ERROR",
  "SIMULATION_WORLD_ERROR",
  "RUNTIME_SYSTEM_ERROR",
] as const);

export type RmsObservationClass = (typeof RMS_OBSERVATION_CLASSES)[number];

export type RmsObservationRecord = {
  readonly observationId: string;
  readonly observerActorId: string;
  readonly classification: RmsObservationClass;
  readonly note: string;
  readonly mutatedSimulation: false;
  readonly mutatedNexora: false;
};

export type RmsObservationResult = {
  readonly observerContract: typeof RMS_OBSERVER_CONTRACT;
  readonly records: readonly RmsObservationRecord[];
  readonly writeAttempted: false;
};

export function recordRmsObservation(input: {
  readonly observationId: string;
  readonly observerActorId: string;
  readonly classification: RmsObservationClass;
  readonly note: string;
}): RmsObservationRecord {
  return Object.freeze({
    observationId: input.observationId,
    observerActorId: input.observerActorId,
    classification: input.classification,
    note: input.note,
    mutatedSimulation: false,
    mutatedNexora: false,
  });
}
