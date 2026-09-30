/**
 * NPA-T SIM-TEST:3 — realistic, bounded Manager intent progressions.
 *
 * These declarations contain visible management intent and natural utterances only.
 * They contain no expected Nexora answer, hidden disturbance, preferred scenario, or decision.
 */

import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";

const REQUIRED = Object.freeze([
  "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
  "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
  "DECISION_STATE", "EXECUTION_STATE",
] as const);

const STOPS = Object.freeze([
  "TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE",
] as const);

function turn(
  managementIntent: NexoraSimulationManagerJourneyIntent,
  utterance: string,
  extras?: { readonly intendedSubject?: string; readonly deictic?: boolean },
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "MANAGER_TURN" as const, managementIntent, utterance, ...extras });
}

function journey(input: Omit<NexoraSimulationTestJourney,
  "startingMode" | "disturbancePolicy" | "requiredCheckpoints" | "stopConditions" |
  "maxRepeatedClarificationAttempts" | "maxUnresolvedLoops"
>): NexoraSimulationTestJourney {
  return Object.freeze({
    ...input,
    startingMode: "WATCH" as const,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    stopConditions: STOPS,
    maxRepeatedClarificationAttempts: 2,
    maxUnresolvedLoops: 2,
  });
}

export const SIM_TEST_3_MANUFACTURING_PRIMARY = journey({
  journeyId: "real-manager-manufacturing-primary",
  version: "1.0",
  title: "Manufacturing Manager sustained investigation",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "DATA_DRIVEN_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 21,
  turnBudget: 22,
  targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "SCENARIO", "DATA_REALITY"]),
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    turn("ORIENT", "What is happening?"),
    turn("INVESTIGATE", "Show me the main problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the capacity issue.", { intendedSubject: "Capacity" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_CAUSE", "Why?", { intendedSubject: "Capacity", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 7 }),
    turn("CHALLENGE", "Are you sure?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Capacity", deictic: true }),
    turn("FOCUS_PROBLEM", "The Capacity Gap problem.", { intendedSubject: "Capacity Gap" }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "Tell me more about it.", { intendedSubject: "Delivery", deictic: true }),
    turn("FOLLOW_UP", "Does that affect delivery?", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("FOLLOW_UP", "Tell me more about it.", { intendedSubject: "Customer", deictic: true }),
    turn("COMPARE", "Compare them.", { intendedSubject: "Customer", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 21 }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("CHECK_CHANGE", "Has anything changed?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_PARENT", "How does this affect operations?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_PARENT", "Show me the parent process.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("INVESTIGATE", "What will our main competitor's capacity be next quarter?", { intendedSubject: "Capacity Gap" }),
    turn("REASSESS", "What should I investigate next?", { intendedSubject: "Capacity Gap", deictic: true }),
  ]),
});

export const SIM_TEST_3_PROJECT_PRIMARY = journey({
  journeyId: "real-manager-project-primary",
  version: "1.0",
  title: "Project Manager sustained delivery investigation",
  scenarioId: "project-delivery-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "STANDARD_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 15,
  turnBudget: 15,
  targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "SCENARIO", "DATA_REALITY"]),
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    turn("ORIENT", "How is the project progressing?"),
    turn("INVESTIGATE", "Show me the main project problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the delivery issue.", { intendedSubject: "Delivery" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_CAUSE", "What caused it?", { intendedSubject: "Delivery", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 5 }),
    turn("CHALLENGE", "That doesn't match what I see. Are you sure?", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("FOLLOW_UP", "Tell me more about it.", { intendedSubject: "Resource", deictic: true }),
    turn("REQUEST_PARENT", "How does this connect to the project goal?", { intendedSubject: "Resource", deictic: true }),
    turn("RETURN_TO_SUBJECT", "Go back to the delivery issue.", { intendedSubject: "Delivery" }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 15 }),
    turn("CHECK_CHANGE", "What changed?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Delivery", deictic: true }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMPARE", "Compare them.", { intendedSubject: "Delivery", deictic: true }),
    turn("REASSESS", "What should I investigate next?", { intendedSubject: "Delivery", deictic: true }),
  ]),
});

function parity(input: {
  readonly journeyId: string;
  readonly title: string;
  readonly scenarioId: string;
  readonly profile: "STANDARD_MANAGER" | "IMPATIENT_MANAGER";
  readonly focus: string;
}): NexoraSimulationTestJourney {
  return journey({
    journeyId: input.journeyId,
    version: "1.0",
    title: input.title,
    scenarioId: input.scenarioId,
    scenarioVersion: "1.0",
    managerProfileId: input.profile,
    mode: "FAST",
    boundedDurationTicks: 4,
    turnBudget: 6,
    targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE"]),
    steps: Object.freeze([
      Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
      turn("ORIENT", "What is happening?"),
      turn("INVESTIGATE", "What deserves attention?"),
      turn("FOCUS_PROBLEM", `Tell me more about ${input.focus}.`, { intendedSubject: input.focus }),
      Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 4 }),
      turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: input.focus, deictic: true }),
      turn("CHALLENGE", "Are you sure?", { intendedSubject: input.focus, deictic: true }),
      turn("REASSESS", "What should I investigate next?", { intendedSubject: input.focus, deictic: true }),
    ]),
  });
}

export const SIM_TEST_3_LOGISTICS_PARITY = parity({
  journeyId: "real-manager-logistics-parity",
  title: "Logistics Manager parity journey",
  scenarioId: "logistics-delivery-pressure",
  profile: "IMPATIENT_MANAGER",
  focus: "Delivery",
});

export const SIM_TEST_3_SERVICE_PARITY = parity({
  journeyId: "real-manager-service-parity",
  title: "Service Manager parity journey",
  scenarioId: "service-capacity-pressure",
  profile: "STANDARD_MANAGER",
  focus: "Capacity",
});

export const SIM_TEST_3_JOURNEYS = Object.freeze([
  SIM_TEST_3_MANUFACTURING_PRIMARY,
  SIM_TEST_3_PROJECT_PRIMARY,
  SIM_TEST_3_LOGISTICS_PARITY,
  SIM_TEST_3_SERVICE_PARITY,
]);
