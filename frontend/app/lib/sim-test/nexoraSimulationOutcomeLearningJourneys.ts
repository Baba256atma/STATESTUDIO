/** SIM-TEST:10 A–N Outcome / Learning journeys. Measurement only. */

import type { RmsManagerProfileId } from "../rms/rmsManagerContract.ts";
import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";

export type SimTest10JourneyFamily =
  | "A_EXPECTED_POSITIVE" | "B_PARTIAL_SUCCESS" | "C_NEGATIVE_TRADEOFF"
  | "D_NO_OBSERVABLE_EFFECT" | "E_DELAYED_OUTCOME" | "F_EXTERNAL_CONFOUNDER"
  | "G_COMPETING_EXECUTIONS" | "H_MULTIPLE_OUTCOME_CHAINS" | "I_HISTORICAL_RETURN"
  | "J_REASSESSMENT" | "K_LEARNING_ASSUMPTION" | "L_LOOP_REENTRY"
  | "M_EXECUTIVE_OVERVIEW" | "N_INCOMPLETE_EVIDENCE";

const REQUIRED = Object.freeze([
  "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
  "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
  "DECISION_STATE", "EXECUTION_STATE",
] as const);

const TARGETS = Object.freeze([
  "CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "SCENARIO",
  "CC10", "CC11", "DATA_REALITY", "OUTCOME", "LEARNING",
]);

function turn(
  utterance: string,
  managementIntent: NexoraSimulationManagerJourneyIntent,
  intendedSubject?: string,
  deictic = false,
): NexoraSimulationTestJourneyStep {
  return Object.freeze({
    kind: "MANAGER_TURN" as const,
    utterance,
    managementIntent,
    ...(intendedSubject ? { intendedSubject } : {}),
    ...(deictic ? { deictic: true } : {}),
  });
}

const publish = (atTick: number): NexoraSimulationTestJourneyStep =>
  Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick });
const advance = (atTick: number): NexoraSimulationTestJourneyStep =>
  Object.freeze({ kind: "ADVANCE_WORLD" as const, atTick });

const CAPACITY_CHAIN = Object.freeze([
  turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
  turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
  turn("Go with B.", "COMMIT_DECISION", "Capacity"),
  turn("Start it.", "REQUEST_EXECUTION", "Capacity", true),
]);

const DELIVERY_CHAIN = Object.freeze([
  turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
  turn("Options.", "EXPLORE_OPTIONS", "Delivery"),
  turn("Go with A.", "COMMIT_DECISION", "Delivery"),
  turn("Start it.", "REQUEST_EXECUTION", "Delivery", true),
]);

function journey(input: {
  family: SimTest10JourneyFamily;
  profile: RmsManagerProfileId;
  seed: 11 | 29 | 47;
  scenario?: "manufacturing-capacity-pressure" | "project-delivery-pressure" | "logistics-delivery-pressure" | "service-capacity-pressure";
  steps: readonly NexoraSimulationTestJourneyStep[];
  long?: boolean;
  suffix?: string;
}): NexoraSimulationTestJourney & { readonly r10Family: SimTest10JourneyFamily } {
  const turns = input.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  return Object.freeze({
    journeyId: `sim-test-10-${input.family.toLowerCase()}${input.suffix ?? ""}`,
    version: "1.0",
    title: `SIM-TEST:10 ${input.family}${input.suffix ?? ""}`,
    scenarioId: input.scenario ?? "manufacturing-capacity-pressure",
    scenarioVersion: "1.0",
    managerProfileId: input.profile,
    behaviorSeed: input.seed,
    conversationLength: input.long ? "long" : "medium",
    startingMode: "WATCH" as const,
    mode: "INGESTION" as const,
    boundedDurationTicks: 29,
    turnBudget: turns,
    maxRepeatedClarificationAttempts: 4,
    maxUnresolvedLoops: 4,
    maxNavigationCycles: 12,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    targetSurfaces: TARGETS,
    stopConditions: Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"] as const),
    steps: Object.freeze([...input.steps]),
    r10Family: input.family,
  });
}

export const SIM_TEST_10_CORE_JOURNEYS = Object.freeze([
  journey({ family: "A_EXPECTED_POSITIVE", profile: "DECISION_ORIENTED_MANAGER", seed: 11, steps: [
    publish(0), ...CAPACITY_CHAIN,
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    advance(10),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    publish(15),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("What changed?", "CHECK_CHANGE", "Capacity", true),
    turn("What did we learn?", "ASK_LEARNING", "Capacity", true),
  ] }),
  journey({ family: "B_PARTIAL_SUCCESS", profile: "INVESTIGATIVE_MANAGER", seed: 29, steps: [
    publish(0), ...CAPACITY_CHAIN, ...DELIVERY_CHAIN,
    advance(10), publish(15),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("What happened to Delivery?", "ASK_OUTCOME", "Delivery"),
    turn("What about cost?", "FOLLOW_UP", "Capacity", true),
  ] }),
  journey({ family: "C_NEGATIVE_TRADEOFF", profile: "SKEPTICAL_MANAGER", seed: 47, steps: [
    publish(0), ...CAPACITY_CHAIN,
    advance(10), publish(15),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("Did overtime cost get worse?", "FOLLOW_UP", "Capacity", true),
    turn("What happened to margin?", "FOLLOW_UP", "Revenue"),
    turn("Was the decision successful?", "ASK_OUTCOME", "Capacity", true),
  ] }),
  journey({ family: "D_NO_OBSERVABLE_EFFECT", profile: "DATA_CHALLENGING_MANAGER", seed: 11, steps: [
    publish(0), ...CAPACITY_CHAIN,
    turn("Did we actually do it?", "FOLLOW_UP", "Capacity", true),
    advance(10), publish(15),
    turn("Did capacity actually change?", "ASK_OUTCOME", "Capacity", true),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
  ] }),
  journey({ family: "E_DELAYED_OUTCOME", profile: "IMPATIENT_MANAGER", seed: 29, steps: [
    publish(0), ...CAPACITY_CHAIN,
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    advance(8),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    advance(12),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    publish(15),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("What's the outcome?", "ASK_OUTCOME", "Capacity", true),
  ] }),
  journey({ family: "F_EXTERNAL_CONFOUNDER", profile: "INVESTIGATIVE_MANAGER", seed: 11, steps: [
    publish(0), ...CAPACITY_CHAIN,
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    advance(10), publish(15),
    turn("What changed?", "CHECK_CHANGE", "Delivery"),
    turn("Did the Capacity decision cause the delivery change?", "ASK_CAUSE", "Delivery"),
    turn("What else changed?", "CHECK_CHANGE", "Delivery"),
  ] }),
  journey({ family: "G_COMPETING_EXECUTIONS", profile: "NONLINEAR_MANAGER", seed: 47, steps: [
    publish(0), ...CAPACITY_CHAIN, ...DELIVERY_CHAIN,
    advance(10), publish(15),
    turn("Did Delivery improve because of the Capacity decision?", "ASK_CAUSE", "Delivery"),
    turn("What happened with the first execution?", "ASK_OUTCOME", "Capacity"),
    turn("What happened with the second execution?", "ASK_OUTCOME", "Delivery"),
  ] }),
  journey({ family: "H_MULTIPLE_OUTCOME_CHAINS", profile: "DECISION_ORIENTED_MANAGER", seed: 11, long: true, steps: [
    publish(0), ...CAPACITY_CHAIN, ...DELIVERY_CHAIN,
    turn("Did it work?", "ASK_OUTCOME", "Delivery", true),
    advance(10), publish(15),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"),
    turn("What happened with Capacity?", "ASK_OUTCOME", "Capacity"),
    turn("Did the Capacity decision work?", "ASK_OUTCOME", "Capacity"),
    turn("Go back to that Delivery result.", "RETURN_TO_SUBJECT", "Delivery"),
    turn("What happened after we did it?", "ASK_OUTCOME", "Delivery", true),
  ] }),
  journey({ family: "I_HISTORICAL_RETURN", profile: "AMBIGUOUS_MANAGER", seed: 29, steps: [
    publish(0), ...CAPACITY_CHAIN, ...DELIVERY_CHAIN,
    turn("Revenue. Details.", "FOCUS_PROBLEM", "Revenue"),
    turn("Inventory. Details.", "FOCUS_PROBLEM", "Inventory"),
    advance(10), publish(15),
    turn("Did the Capacity decision work?", "ASK_OUTCOME", "Capacity"),
    turn("What happened with the first execution?", "ASK_OUTCOME"),
    turn("Show me the second execution.", "FOLLOW_UP", "Delivery", true),
  ] }),
  journey({ family: "J_REASSESSMENT", profile: "EXECUTIVE_MANAGER", seed: 11, steps: [
    publish(0), ...CAPACITY_CHAIN,
    advance(10), publish(15),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("What did we learn?", "ASK_LEARNING", "Capacity", true),
    turn("Is this still a problem?", "REASSESS", "Capacity"),
    turn("Is this risk still relevant?", "REASSESS"),
    turn("Does this decision still make sense?", "REASSESS", "Capacity", true),
  ] }),
  journey({ family: "K_LEARNING_ASSUMPTION", profile: "DATA_CHALLENGING_MANAGER", seed: 47, steps: [
    publish(0), ...CAPACITY_CHAIN,
    advance(10), publish(15),
    turn("What did we learn?", "ASK_LEARNING", "Capacity", true),
    turn("Did we underestimate the cost?", "ASK_LEARNING", "Capacity", true),
    turn("Does overtime always improve delivery?", "ASK_CAUSE"),
    turn("What should we reconsider?", "REASSESS", "Capacity"),
  ] }),
  journey({ family: "L_LOOP_REENTRY", profile: "DECISION_ORIENTED_MANAGER", seed: 29, long: true, steps: [
    publish(0), ...CAPACITY_CHAIN,
    advance(10), publish(15),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("What did we learn?", "ASK_LEARNING", "Capacity", true),
    turn("Is this still a problem?", "REASSESS", "Capacity"),
    turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Go with A.", "COMMIT_DECISION", "Capacity"),
    turn("Go back to the Capacity decision.", "RETURN_TO_SUBJECT", "Capacity"),
  ] }),
  journey({ family: "M_EXECUTIVE_OVERVIEW", profile: "EXECUTIVE_MANAGER", seed: 11, steps: [
    publish(0), ...CAPACITY_CHAIN, ...DELIVERY_CHAIN,
    advance(10), publish(15),
    turn("Which decisions are working?", "ORIENT"),
    turn("Which executions are not producing results?", "ORIENT"),
    turn("Where did our assumptions fail?", "ASK_LEARNING"),
    turn("What changed because of our actions?", "CHECK_CHANGE"),
    turn("What still needs attention?", "ORIENT"),
  ] }),
  journey({ family: "N_INCOMPLETE_EVIDENCE", profile: "SKEPTICAL_MANAGER", seed: 29, steps: [
    publish(0), ...CAPACITY_CHAIN,
    publish(12),
    turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("Do we know the cost impact yet?", "FOLLOW_UP", "Capacity", true),
    turn("Is the full outcome known?", "ASK_OUTCOME", "Capacity", true),
  ] }),
]);

const DELAYED_PROFILES = Object.freeze([
  "IMPATIENT_MANAGER", "AMBIGUOUS_MANAGER", "INVESTIGATIVE_MANAGER", "DECISION_ORIENTED_MANAGER",
  "SKEPTICAL_MANAGER", "EXECUTIVE_MANAGER", "DATA_CHALLENGING_MANAGER", "NONLINEAR_MANAGER",
] as const satisfies readonly RmsManagerProfileId[]);

const DELAYED_STEPS = Object.freeze([
  publish(0), ...CAPACITY_CHAIN,
  turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
  advance(10),
  turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
  publish(15),
  turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
]);

export const SIM_TEST_10_PROFILE_JOURNEYS = Object.freeze(
  DELAYED_PROFILES.filter((profile) => profile !== "IMPATIENT_MANAGER").map((profile) =>
    journey({
      family: "E_DELAYED_OUTCOME",
      profile,
      seed: 11,
      suffix: `-${profile.toLowerCase().replace(/_manager$/, "")}`,
      steps: DELAYED_STEPS,
    }),
  ),
);

export const SIM_TEST_10_SEED_JOURNEYS = Object.freeze([
  journey({ family: "A_EXPECTED_POSITIVE", profile: "DECISION_ORIENTED_MANAGER", seed: 29, suffix: "-seed-29", steps: SIM_TEST_10_CORE_JOURNEYS[0]!.steps }),
  journey({ family: "A_EXPECTED_POSITIVE", profile: "DECISION_ORIENTED_MANAGER", seed: 47, suffix: "-seed-47", steps: SIM_TEST_10_CORE_JOURNEYS[0]!.steps }),
  journey({ family: "H_MULTIPLE_OUTCOME_CHAINS", profile: "DECISION_ORIENTED_MANAGER", seed: 29, suffix: "-seed-29", long: true, steps: SIM_TEST_10_CORE_JOURNEYS[7]!.steps }),
  journey({ family: "H_MULTIPLE_OUTCOME_CHAINS", profile: "DECISION_ORIENTED_MANAGER", seed: 47, suffix: "-seed-47", long: true, steps: SIM_TEST_10_CORE_JOURNEYS[7]!.steps }),
]);

export const SIM_TEST_10_RMS_JOURNEYS = Object.freeze([
  journey({
    family: "H_MULTIPLE_OUTCOME_CHAINS", profile: "STRUCTURED_MANAGER", seed: 11,
    scenario: "project-delivery-pressure", suffix: "-project", long: true,
    steps: SIM_TEST_10_CORE_JOURNEYS[7]!.steps,
  }),
  journey({
    family: "H_MULTIPLE_OUTCOME_CHAINS", profile: "DISTRACTED_MANAGER", seed: 11,
    scenario: "logistics-delivery-pressure", suffix: "-logistics", long: true,
    steps: SIM_TEST_10_CORE_JOURNEYS[7]!.steps,
  }),
  journey({
    family: "A_EXPECTED_POSITIVE", profile: "STRUCTURED_MANAGER", seed: 11,
    scenario: "service-capacity-pressure", suffix: "-service",
    steps: SIM_TEST_10_CORE_JOURNEYS[0]!.steps,
  }),
]);

export const SIM_TEST_10_JOURNEYS = Object.freeze([
  ...SIM_TEST_10_CORE_JOURNEYS,
  ...SIM_TEST_10_PROFILE_JOURNEYS,
  ...SIM_TEST_10_SEED_JOURNEYS,
  ...SIM_TEST_10_RMS_JOURNEYS,
]);
