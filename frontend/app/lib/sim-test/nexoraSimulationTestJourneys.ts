/** Declarative SIM-TEST:1 journeys. They describe exercised behavior, never correct Nexora answers. */

import type { NexoraSimulationTestJourney } from "./nexoraSimulationTestContract.ts";

const REQUIRED = Object.freeze([
  "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
  "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
  "DECISION_STATE", "EXECUTION_STATE",
] as const);

const STOPS = Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"] as const);

export const SIM_TEST_MANUFACTURING_BASELINE: NexoraSimulationTestJourney = Object.freeze({
  journeyId: "baseline-manager-investigation-manufacturing",
  version: "1.0",
  title: "Manufacturing manager investigation",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "DATA_DRIVEN_MANAGER",
  startingMode: "WATCH",
  mode: "FAST",
  boundedDurationTicks: 21,
  turnBudget: 4,
  disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE",
  requiredCheckpoints: REQUIRED,
  targetSurfaces: Object.freeze(["DATA_REALITY", "CC5", "NMI", "MLEVEL", "STAGE", "NPS", "DECISION", "EXECUTION"]),
  stopConditions: STOPS,
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "What is happening in operations?" }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 7 }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "What pressure deserves my attention?" }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 21 }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "What evidence supports that?" }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "What can change?" }),
  ]),
});

export const SIM_TEST_PROJECT_BASELINE: NexoraSimulationTestJourney = Object.freeze({
  journeyId: "baseline-manager-investigation-project",
  version: "1.0",
  title: "Project manager investigation",
  scenarioId: "project-delivery-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "STANDARD_MANAGER",
  startingMode: "WATCH",
  mode: "FAST",
  boundedDurationTicks: 5,
  turnBudget: 3,
  disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE",
  requiredCheckpoints: REQUIRED,
  targetSurfaces: Object.freeze(["PROJECT_CONTEXT", "DATA_REALITY", "CC5", "MLEVEL", "STAGE"]),
  stopConditions: STOPS,
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "How is the project progressing?" }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 5 }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "What is putting delivery under pressure?" }),
    Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "Tell me more about it." }),
  ]),
});

function parityJourney(input: {
  journeyId: string;
  title: string;
  scenarioId: string;
  managerProfileId: "STANDARD_MANAGER" | "IMPATIENT_MANAGER";
  tick: number;
}): NexoraSimulationTestJourney {
  return Object.freeze({
    ...input,
    version: "1.0",
    scenarioVersion: "1.0",
    startingMode: "WATCH" as const,
    mode: "FAST" as const,
    boundedDurationTicks: input.tick,
    turnBudget: 1,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    targetSurfaces: Object.freeze(["DATA_REALITY", "CC5", "STAGE"]),
    stopConditions: STOPS,
    steps: Object.freeze([
      Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: input.tick }),
      Object.freeze({ kind: "MANAGER_TURN" as const, utterance: "What is happening and what deserves attention?" }),
    ]),
  });
}

export const SIM_TEST_LOGISTICS_PARITY = parityJourney({
  journeyId: "parity-logistics",
  title: "Logistics parity smoke",
  scenarioId: "logistics-delivery-pressure",
  managerProfileId: "STANDARD_MANAGER",
  tick: 4,
});

export const SIM_TEST_SERVICE_PARITY = parityJourney({
  journeyId: "parity-service",
  title: "Service parity smoke",
  scenarioId: "service-capacity-pressure",
  managerProfileId: "IMPATIENT_MANAGER",
  tick: 4,
});

export const SIM_TEST_1_JOURNEYS = Object.freeze([
  SIM_TEST_MANUFACTURING_BASELINE,
  SIM_TEST_PROJECT_BASELINE,
  SIM_TEST_LOGISTICS_PARITY,
  SIM_TEST_SERVICE_PARITY,
]);
