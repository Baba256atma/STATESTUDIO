/**
 * NPA-T SIM-TEST:4 — bounded Manager stress journeys for MLEVEL/Stage/conversation.
 * Visible management intent and utterances only. No expected answers or hidden subjects.
 */

import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";
import {
  SIM_TEST_3_LOGISTICS_PARITY,
  SIM_TEST_3_SERVICE_PARITY,
} from "./nexoraSimulationManagerJourneys.ts";

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

function interact(
  surface: Extract<NexoraSimulationTestJourneyStep, { kind: "INTERACT_VISIBLE" }>["surface"],
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "INTERACT_VISIBLE" as const, surface });
}

function journey(input: Omit<NexoraSimulationTestJourney,
  "startingMode" | "disturbancePolicy" | "requiredCheckpoints" | "stopConditions" |
  "maxRepeatedClarificationAttempts" | "maxUnresolvedLoops" | "maxNavigationCycles"
>): NexoraSimulationTestJourney {
  return Object.freeze({
    ...input,
    startingMode: "WATCH" as const,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    stopConditions: STOPS,
    maxRepeatedClarificationAttempts: 2,
    maxUnresolvedLoops: 2,
    maxNavigationCycles: 8,
  });
}

export const SIM_TEST_4_MANUFACTURING_STRESS = journey({
  journeyId: "stress-manager-manufacturing-mlevel-stage",
  version: "1.0",
  title: "Manufacturing MLEVEL and Stage stress",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "DATA_DRIVEN_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 21,
  turnBudget: 36,
  targetSurfaces: Object.freeze([
    "CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "DATA_REALITY",
  ]),
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    turn("ORIENT", "What is happening?"),
    turn("INVESTIGATE", "Show me the main problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the capacity issue.", { intendedSubject: "Capacity" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_CAUSE", "Why?", { intendedSubject: "Capacity", deictic: true }),
    turn("FOCUS_PROBLEM", "The Capacity Gap problem.", { intendedSubject: "Capacity Gap" }),
    turn("FOLLOW_UP", "Explain this.", { intendedSubject: "Capacity Gap", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 7 }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "Why is this important?", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("FOLLOW_UP", "Tell me more about it.", { intendedSubject: "Customer", deictic: true }),
    turn("CHANGE_CONTEXT", "What about inventory?", { intendedSubject: "Inventory" }),
    turn("FOLLOW_UP", "What data supports that?", { intendedSubject: "Inventory", deictic: true }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("FOLLOW_UP", "How does this affect operations?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_PARENT", "Go back to operations.", { intendedSubject: "Operations" }),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    turn("FOCUS_PROBLEM", "Tell me more about the capacity issue.", { intendedSubject: "Capacity" }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Capacity", deictic: true }),
    interact("STAGE_FOCUSED"),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "Explain this.", { intendedSubject: "Delivery", deictic: true }),
    interact("STAGE_VISIBLE_OTHER"),
    turn("FOLLOW_UP", "Why is this important?", { deictic: true }),
    interact("MLEVEL_L2"),
    turn("FOLLOW_UP", "Explain this.", { deictic: true }),
    interact("MLEVEL_L3"),
    turn("FOLLOW_UP", "What is the problem?", { deictic: true }),
    turn("FOCUS_PROBLEM", "Return to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("RETURN_TO_SUBJECT", "Go back to delivery.", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "Explain this.", { intendedSubject: "Delivery", deictic: true }),
    turn("RETURN_TO_SUBJECT", "Go back to the supplier problem.", { intendedSubject: "Supplier" }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 21 }),
    turn("CHECK_CHANGE", "Has anything changed?", { deictic: true }),
    turn("FOLLOW_UP", "How does this affect operations?", { deictic: true }),
    turn("INVESTIGATE", "What evidence supports this?", { deictic: true }),
    turn("REASSESS", "What should I investigate next?", { deictic: true }),
  ]),
});

export const SIM_TEST_4_PROJECT_STRESS = journey({
  journeyId: "stress-manager-project-mlevel-stage",
  version: "1.0",
  title: "Project MLEVEL and Stage stress",
  scenarioId: "project-delivery-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "STANDARD_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 15,
  turnBudget: 18,
  targetSurfaces: Object.freeze([
    "CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "DATA_REALITY",
  ]),
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    turn("ORIENT", "How is the project progressing?"),
    turn("INVESTIGATE", "Show me the main project problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the delivery issue.", { intendedSubject: "Delivery" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Delivery", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 5 }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("FOLLOW_UP", "Tell me more about it.", { intendedSubject: "Resource", deictic: true }),
    turn("REQUEST_PARENT", "How does this connect to the project goal?", { intendedSubject: "Resource", deictic: true }),
    turn("RETURN_TO_SUBJECT", "Go back to the delivery issue.", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "Explain this.", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the schedule?", { intendedSubject: "Schedule" }),
    turn("FOLLOW_UP", "Why?", { intendedSubject: "Schedule", deictic: true }),
    turn("RETURN_TO_SUBJECT", "Return to the delivery issue.", { intendedSubject: "Delivery" }),
    interact("STAGE_FOCUSED"),
    turn("FOLLOW_UP", "Explain this.", { intendedSubject: "Delivery", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 15 }),
    turn("CHECK_CHANGE", "What changed?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Delivery", deictic: true }),
  ]),
});

export const SIM_TEST_4_LOGISTICS_PARITY = SIM_TEST_3_LOGISTICS_PARITY;
export const SIM_TEST_4_SERVICE_PARITY = SIM_TEST_3_SERVICE_PARITY;

export const SIM_TEST_4_JOURNEYS = Object.freeze([
  SIM_TEST_4_MANUFACTURING_STRESS,
  SIM_TEST_4_PROJECT_STRESS,
  SIM_TEST_4_LOGISTICS_PARITY,
  SIM_TEST_4_SERVICE_PARITY,
]);
