/** SIM-TEST:9-R2 A–N multi-thread certification journeys. Test evidence only. */

import type { RmsManagerProfileId } from "../rms/rmsManagerContract.ts";
import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";

export type SimTest9R2JourneyFamily =
  | "A_MULTI_PROBLEM" | "B_MULTI_RISK" | "C_SCENARIO_SETS"
  | "D_MULTI_DECISION" | "E_DECISION_EXECUTION_CONCURRENCY"
  | "F_MULTI_OUTCOME" | "G_CROSS_THREAD_EFFECT" | "H_BACKGROUND_CHANGE"
  | "I_HISTORICAL_RETURN" | "J_ORDINAL_STRESS" | "K_LONG_SESSION"
  | "L_EXECUTIVE_OVERVIEW" | "M_BUSINESS_PROJECT_SWITCH" | "N_REASSESSMENT";

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

function journey(input: {
  family: SimTest9R2JourneyFamily;
  profile: RmsManagerProfileId;
  seed: 11 | 29 | 47;
  scenario?: "manufacturing-capacity-pressure" | "project-delivery-pressure" | "logistics-delivery-pressure" | "service-capacity-pressure";
  steps: readonly NexoraSimulationTestJourneyStep[];
  long?: boolean;
}): NexoraSimulationTestJourney & { readonly r2Family: SimTest9R2JourneyFamily } {
  const turns = input.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  return Object.freeze({
    journeyId: `sim-test-9-r2-${input.family.toLowerCase()}`,
    version: "1.0",
    title: `SIM-TEST:9-R2 ${input.family}`,
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
    r2Family: input.family,
  });
}

export const SIM_TEST_9_R2_JOURNEYS = Object.freeze([
  journey({ family: "A_MULTI_PROBLEM", profile: "STRUCTURED_MANAGER", seed: 11, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    turn("Revenue. Details.", "FOCUS_PROBLEM", "Revenue"),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"),
  ] }),
  journey({ family: "B_MULTI_RISK", profile: "IMPATIENT_MANAGER", seed: 29, steps: [
    publish(0), turn("Show me the risks.", "INVESTIGATE"),
    turn("Show me the first risk.", "FOCUS_PROBLEM", "Risk"),
    turn("What about the other risk?", "FOLLOW_UP", "Risk", true),
    turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    turn("Go back to the first risk.", "RETURN_TO_SUBJECT", "Risk"),
  ] }),
  journey({ family: "C_SCENARIO_SETS", profile: "AMBIGUOUS_MANAGER", seed: 47, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    turn("Options.", "EXPLORE_OPTIONS", "Capacity", true),
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    turn("Options.", "EXPLORE_OPTIONS", "Delivery", true),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"),
    turn("Show me the second option.", "FOLLOW_UP", "Capacity", true),
    turn("Let's go with the second option.", "COMMIT_DECISION", "Capacity", true),
  ] }),
  journey({ family: "D_MULTI_DECISION", profile: "DECISION_ORIENTED_MANAGER", seed: 11, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Go with B.", "COMMIT_DECISION", "Capacity"),
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), turn("Options.", "EXPLORE_OPTIONS", "Delivery"),
    turn("Go with A.", "COMMIT_DECISION", "Delivery"),
    turn("Revenue. Details.", "FOCUS_PROBLEM", "Revenue"), turn("Options.", "EXPLORE_OPTIONS", "Revenue"),
    turn("Go with B.", "COMMIT_DECISION", "Revenue"),
    turn("Go back to the Capacity decision.", "RETURN_TO_SUBJECT", "Capacity"),
  ] }),
  journey({ family: "E_DECISION_EXECUTION_CONCURRENCY", profile: "DISTRACTED_MANAGER", seed: 29, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Go with B.", "COMMIT_DECISION", "Capacity"), turn("Start it.", "REQUEST_EXECUTION", "Capacity", true),
    turn("Start No Action on Capacity.", "REQUEST_EXECUTION", "Capacity", true),
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), turn("Options.", "EXPLORE_OPTIONS", "Delivery"),
    turn("Go with A.", "COMMIT_DECISION", "Delivery"), turn("Start it.", "REQUEST_EXECUTION", "Delivery", true),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"), turn("How is execution going?", "FOLLOW_UP", "Capacity", true),
  ] }),
  journey({ family: "F_MULTI_OUTCOME", profile: "INVESTIGATIVE_MANAGER", seed: 47, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Go with B.", "COMMIT_DECISION", "Capacity"), turn("Start it.", "REQUEST_EXECUTION", "Capacity", true),
    publish(7), turn("Did it work?", "ASK_OUTCOME", "Capacity", true),
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), turn("Options.", "EXPLORE_OPTIONS", "Delivery"),
    turn("Go with A.", "COMMIT_DECISION", "Delivery"), turn("What's the outcome?", "ASK_OUTCOME", "Delivery", true),
  ] }),
  journey({ family: "G_CROSS_THREAD_EFFECT", profile: "SKEPTICAL_MANAGER", seed: 11, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Go with B.", "COMMIT_DECISION", "Capacity"),
    turn("What does that do to Delivery?", "FOLLOW_UP", "Delivery", true),
    turn("What does that do to Revenue?", "FOLLOW_UP", "Revenue", true),
    turn("Did the decision cause the margin pressure?", "ASK_CAUSE", "Revenue", true),
  ] }),
  journey({ family: "H_BACKGROUND_CHANGE", profile: "NONLINEAR_MANAGER", seed: 29, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    advance(7), turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    turn("What changed?", "CHECK_CHANGE", "Delivery", true), publish(7),
    turn("Back to Capacity. What changed?", "CHECK_CHANGE", "Capacity"),
  ] }),
  journey({ family: "I_HISTORICAL_RETURN", profile: "EXECUTIVE_MANAGER", seed: 47, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    turn("Revenue. Details.", "FOCUS_PROBLEM", "Revenue"), turn("Inventory. Details.", "FOCUS_PROBLEM", "Inventory"),
    turn("Schedule. Details.", "FOCUS_PROBLEM", "Schedule"), turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"), turn("Explain this.", "FOLLOW_UP", "Capacity", true),
  ] }),
  journey({ family: "J_ORDINAL_STRESS", profile: "DATA_CHALLENGING_MANAGER", seed: 11, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Show me the first one.", "FOLLOW_UP", "Capacity", true), turn("Show me the second one.", "FOLLOW_UP", "Capacity", true),
    turn("What about the other one?", "FOLLOW_UP", "Capacity", true),
    turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), turn("Options.", "EXPLORE_OPTIONS", "Delivery"),
    turn("Show me the previous option.", "FOLLOW_UP", "Delivery", true), turn("Show me the last option.", "FOLLOW_UP", "Delivery", true),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"), turn("Show me the earlier option.", "FOLLOW_UP", "Capacity", true),
  ] }),
  journey({ family: "K_LONG_SESSION", profile: "STRUCTURED_MANAGER", seed: 47, long: true, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Revenue. Details.", "FOCUS_PROBLEM", "Revenue"), turn("Options.", "EXPLORE_OPTIONS", "Revenue"),
    turn("Inventory. Details.", "FOCUS_PROBLEM", "Inventory"), turn("What risks matter?", "INVESTIGATE", "Inventory"),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"), turn("Go with B.", "COMMIT_DECISION", "Capacity"),
    turn("Start it.", "REQUEST_EXECUTION", "Capacity", true), turn("Schedule. Details.", "FOCUS_PROBLEM", "Schedule"),
    advance(7), turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), publish(7),
    turn("Options.", "EXPLORE_OPTIONS", "Delivery"), turn("Go with A.", "COMMIT_DECISION", "Delivery"),
    turn("Back to Inventory.", "RETURN_TO_SUBJECT", "Inventory"), turn("What needs my attention?", "ORIENT"),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"), turn("Does this decision still make sense?", "REASSESS", "Capacity", true),
    turn("How is execution going?", "FOLLOW_UP", "Capacity", true),
  ] }),
  journey({ family: "L_EXECUTIVE_OVERVIEW", profile: "EXECUTIVE_MANAGER", seed: 29, steps: [
    publish(0), turn("What needs my attention?", "ORIENT"), turn("Which problems are open?", "ORIENT"),
    turn("Which decisions are waiting?", "ORIENT"), turn("Which executions are active?", "ORIENT"),
    publish(7), turn("What changed?", "CHECK_CHANGE"), turn("What happened while we were working on Delivery?", "CHECK_CHANGE", "Delivery"),
  ] }),
  journey({ family: "M_BUSINESS_PROJECT_SWITCH", profile: "DISTRACTED_MANAGER", seed: 11, scenario: "project-delivery-pressure", steps: [
    publish(0), turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), turn("Schedule. Details.", "FOCUS_PROBLEM", "Schedule"),
    turn("Resources. Details.", "FOCUS_PROBLEM", "Resources"), turn("Back to Delivery.", "RETURN_TO_SUBJECT", "Delivery"),
    turn("What is the project goal?", "ORIENT", "Goal"), turn("Back to Schedule.", "RETURN_TO_SUBJECT", "Schedule"),
  ] }),
  journey({ family: "N_REASSESSMENT", profile: "DECISION_ORIENTED_MANAGER", seed: 29, long: true, steps: [
    publish(0), turn("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"), turn("Options.", "EXPLORE_OPTIONS", "Capacity"),
    turn("Go with B.", "COMMIT_DECISION", "Capacity"), turn("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"),
    turn("Revenue. Details.", "FOCUS_PROBLEM", "Revenue"), turn("Inventory. Details.", "FOCUS_PROBLEM", "Inventory"),
    advance(7), turn("Schedule. Details.", "FOCUS_PROBLEM", "Schedule"), publish(7),
    turn("Back to Capacity.", "RETURN_TO_SUBJECT", "Capacity"), turn("Is this still a problem?", "REASSESS", "Capacity", true),
    turn("Do I still need to act?", "REASSESS", "Capacity", true),
    turn("Does this decision still make sense?", "REASSESS", "Capacity", true),
    turn("Is this risk still relevant?", "REASSESS", "Risk", true), turn("Has this changed?", "REASSESS", "Capacity", true),
  ] }),
]);
