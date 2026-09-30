/**
 * NPA-T SIM-TEST:5 — Decision → Execution → Outcome journeys.
 * Visible management intent and utterances only. No expected answers, Ground Truth, or backdoors.
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

const TARGETS = Object.freeze([
  "CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "SCENARIO",
  "CC10", "CC11", "DATA_REALITY", "OUTCOME", "LEARNING",
]);

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

export const SIM_TEST_5_MANUFACTURING_LIFECYCLE = journey({
  journeyId: "sim-test-5-manufacturing-lifecycle",
  version: "1.0",
  title: "Manufacturing Decision → Execution → Outcome",
  scenarioId: "manufacturing-capacity-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "DATA_DRIVEN_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 21,
  turnBudget: 42,
  targetSurfaces: TARGETS,
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    turn("ORIENT", "What is happening?"),
    turn("INVESTIGATE", "Show me the main problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the capacity issue.", { intendedSubject: "Capacity" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_CAUSE", "Why?", { intendedSubject: "Capacity", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 7 }),
    turn("CHALLENGE", "How serious is it?", { intendedSubject: "Capacity", deictic: true }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Capacity", deictic: true }),
    turn("FOCUS_PROBLEM", "The Capacity Gap problem.", { intendedSubject: "Capacity Gap" }),
    turn("REQUEST_EXECUTION_BEFORE_COMMIT", "Start option B.", { intendedSubject: "Capacity Gap" }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMPARE", "Compare them.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("FOLLOW_UP", "What about option A?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Let's go with option B.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("COMMIT_DECISION", "Yes, that's the decision.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("FOLLOW_UP", "What if we had chosen A?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Proceed.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("REQUEST_EXECUTION", "Yes, execute.", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "Did it work?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "Is this working?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("FOLLOW_UP", "How is it going?", { intendedSubject: "Capacity Gap", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 21 }),
    turn("CHECK_CHANGE", "Has anything changed?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "What's the outcome?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "How did it go?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_COUNTERFACTUAL", "Would option A have been better?", { intendedSubject: "Capacity Gap", deictic: true }),
    turn("ASK_OUTCOME", "What was the outcome of option A?", { intendedSubject: "Capacity Gap" }),
    turn("REVERSE_DECISION", "Actually, switch to option A.", { intendedSubject: "Capacity Gap" }),
    turn("REQUEST_EXECUTION", "Start the supplier recovery plan.", { intendedSubject: "Supplier" }),
    turn("RETURN_TO_SUBJECT", "Go back to the supplier problem.", { intendedSubject: "Supplier" }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("CHANGE_CONTEXT", "What about delivery?", { intendedSubject: "Delivery" }),
    turn("CHANGE_CONTEXT", "What about the customer impact?", { intendedSubject: "Customer" }),
    turn("RETURN_TO_SUBJECT", "Go back to the capacity problem.", { intendedSubject: "Capacity Gap" }),
    turn("UNSUPPORTED_ACTION", "Teleport all inventory to the finished-goods warehouse.", { intendedSubject: "Capacity Gap" }),
    turn("ASK_LEARNING", "What did we learn?", { intendedSubject: "Capacity Gap", deictic: true }),
  ]),
});

export const SIM_TEST_5_PROJECT_LIFECYCLE = journey({
  journeyId: "sim-test-5-project-lifecycle",
  version: "1.0",
  title: "Project Decision → Execution → Outcome",
  scenarioId: "project-delivery-pressure",
  scenarioVersion: "1.0",
  managerProfileId: "STANDARD_MANAGER",
  mode: "INGESTION",
  boundedDurationTicks: 15,
  turnBudget: 22,
  targetSurfaces: TARGETS,
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    turn("ORIENT", "How is the project progressing?"),
    turn("INVESTIGATE", "Show me the main project problems."),
    turn("FOCUS_PROBLEM", "Tell me more about the delivery issue.", { intendedSubject: "Delivery" }),
    turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_CAUSE", "What caused it?", { intendedSubject: "Delivery", deictic: true }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 5 }),
    turn("ASK_VARIABLES", "What can I change?", { intendedSubject: "Delivery", deictic: true }),
    turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMPARE", "Compare them.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMMIT_DECISION", "Approve the delivery recovery plan.", { intendedSubject: "Delivery", deictic: true }),
    turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: "Delivery", deictic: true }),
    turn("REQUEST_EXECUTION", "Put the decision into action.", { intendedSubject: "Delivery", deictic: true }),
    turn("CHANGE_CONTEXT", "What about resources?", { intendedSubject: "Resource" }),
    turn("CHANGE_CONTEXT", "What about the schedule?", { intendedSubject: "Schedule" }),
    turn("RETURN_TO_SUBJECT", "Go back to the delivery issue.", { intendedSubject: "Delivery" }),
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 15 }),
    turn("CHECK_CHANGE", "What changed?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_OUTCOME", "Did it work?", { intendedSubject: "Delivery", deictic: true }),
    turn("ASK_LEARNING", "What should we take from this?", { intendedSubject: "Delivery", deictic: true }),
  ]),
});

function parity(input: {
  journeyId: string;
  title: string;
  scenarioId: string;
  profile: NexoraSimulationTestJourney["managerProfileId"];
  focus: string;
  mode?: NexoraSimulationTestJourney["mode"];
  ticks?: number;
}): NexoraSimulationTestJourney {
  return journey({
    journeyId: input.journeyId,
    version: "1.0",
    title: input.title,
    scenarioId: input.scenarioId,
    scenarioVersion: "1.0",
    managerProfileId: input.profile,
    mode: input.mode ?? "INGESTION",
    boundedDurationTicks: input.ticks ?? 12,
    turnBudget: 12,
    targetSurfaces: TARGETS,
    steps: Object.freeze([
      Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
      turn("ORIENT", "What is happening?"),
      turn("INVESTIGATE", "Show me the main problems."),
      turn("FOCUS_PROBLEM", `Tell me more about the ${input.focus.toLowerCase()} issue.`, { intendedSubject: input.focus }),
      turn("REQUEST_EVIDENCE", "What data supports that?", { intendedSubject: input.focus, deictic: true }),
      turn("EXPLORE_OPTIONS", "Show me the alternatives.", { intendedSubject: input.focus, deictic: true }),
      turn("COMPARE", "Compare them.", { intendedSubject: input.focus, deictic: true }),
      turn("COMMIT_DECISION", "Let's go with option B.", { intendedSubject: input.focus, deictic: true }),
      turn("COMMIT_DECISION", "Yes, make that the decision.", { intendedSubject: input.focus, deictic: true }),
      turn("REQUEST_EXECUTION", "Start it.", { intendedSubject: input.focus, deictic: true }),
      Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: input.ticks ?? 12 }),
      turn("ASK_OUTCOME", "Did it work?", { intendedSubject: input.focus, deictic: true }),
    ]),
  });
}

export const SIM_TEST_5_LOGISTICS_PARITY = parity({
  journeyId: "sim-test-5-logistics-parity",
  title: "Logistics Decision/Execution parity",
  scenarioId: "logistics-delivery-pressure",
  profile: "STANDARD_MANAGER",
  focus: "Capacity",
});

export const SIM_TEST_5_SERVICE_PARITY = parity({
  journeyId: "sim-test-5-service-parity",
  title: "Service Decision/Execution parity",
  scenarioId: "service-capacity-pressure",
  profile: "STANDARD_MANAGER",
  focus: "Capacity",
});

export const SIM_TEST_5_FAST_LIFECYCLE = parity({
  journeyId: "sim-test-5-fast-lifecycle",
  title: "FAST Decision/Execution path",
  scenarioId: "manufacturing-capacity-pressure",
  profile: "DATA_DRIVEN_MANAGER",
  focus: "Capacity",
  mode: "FAST",
  ticks: 21,
});

export const SIM_TEST_5_JOURNEYS = Object.freeze([
  SIM_TEST_5_MANUFACTURING_LIFECYCLE,
  SIM_TEST_5_PROJECT_LIFECYCLE,
  SIM_TEST_5_LOGISTICS_PARITY,
  SIM_TEST_5_SERVICE_PARITY,
  SIM_TEST_5_FAST_LIFECYCLE,
]);
