/**
 * NPA-T SIM-TEST:8 — adaptive journeys over certified RMS worlds and SIM-TEST:7 managers.
 * World ticks use RMS:6. Hidden change advances Ground Truth without Operator publication.
 */

import type { RmsManagerProfileId } from "../rms/rmsManagerContract.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import {
  RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
  RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
  RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE,
  RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
} from "../rms/rmsScenarioLibrary.ts";
import type { RmsScenarioDefinition } from "../rms/rmsScenarioContract.ts";
import type {
  NexoraSimulationAdaptiveFamily,
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
} from "./nexoraSimulationTestContract.ts";
import { SIM_TEST_8_ADAPTIVE_FAMILIES } from "./nexoraSimulationTestContract.ts";

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

const SCENARIOS = Object.freeze([
  RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
  RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE,
  RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
  RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
]);

const PROFILES = Object.freeze([
  "IMPATIENT_MANAGER",
  "DISTRACTED_MANAGER",
  "INVESTIGATIVE_MANAGER",
  "DECISION_ORIENTED_MANAGER",
  "SKEPTICAL_MANAGER",
  "NONLINEAR_MANAGER",
  "EXECUTIVE_MANAGER",
  "DATA_CHALLENGING_MANAGER",
  "STRUCTURED_MANAGER",
  "AMBIGUOUS_MANAGER",
] as const satisfies readonly RmsManagerProfileId[]);

export const SIM_TEST_8_SEEDS = Object.freeze([11, 29] as const);
export const SIM_TEST_8_LONG_SEED = 47;

export const SIM_TEST_8_OBSERVER_DETECTIONS = Object.freeze({
  GROUND_TRUTH_LEAK: Object.freeze(["JOURNEY/GROUND_TRUTH_LEAK", "JOURNEY/KNOWLEDGE_LEAK"]),
  WRONG_REFERENT: Object.freeze(["JOURNEY/WRONG_REFERENT"]),
  STALE_CONTEXT: Object.freeze(["JOURNEY/STALE_REFERENT", "JOURNEY/STALE_DATA_USE", "JOURNEY/DATA_SNAPSHOT_RESTORE"]),
  STALE_EVIDENCE: Object.freeze(["JOURNEY/STALE_EVIDENCE", "JOURNEY/STALE_DATA_USE"]),
  CURRENT_STATE_IGNORED: Object.freeze(["JOURNEY/CURRENT_STATE_IGNORED"]),
  TEMPORAL_CONFUSION: Object.freeze(["JOURNEY/TEMPORAL_CONFUSION"]),
  SUBJECT_IDENTITY_LOSS: Object.freeze(["JOURNEY/SUBJECT_LOSS", "JOURNEY/IDENTITY_DRIFT"]),
  UNSUPPORTED_CAUSAL_CLAIM: Object.freeze(["JOURNEY/UNSUPPORTED_CAUSAL_CLAIM"]),
  FALSE_CERTAINTY: Object.freeze(["JOURNEY/FALSE_CERTAINTY"]),
  INVENTED_FACT: Object.freeze(["JOURNEY/UNSUPPORTED_FACT"]),
  DECISION_STATE_ERROR: Object.freeze([
    "JOURNEY/PREMATURE_DECISION", "JOURNEY/MISSING_DECISION", "JOURNEY/DUPLICATE_DECISION",
  ]),
  DECISION_IDENTITY_DRIFT: Object.freeze(["JOURNEY/DECISION_IDENTITY_DRIFT"]),
  EXECUTION_STATE_ERROR: Object.freeze([
    "JOURNEY/MISSING_EXECUTION", "JOURNEY/DUPLICATE_EXECUTION", "JOURNEY/WRONG_EXECUTION_REFERENT",
  ]),
  PREMATURE_EXECUTION: Object.freeze(["JOURNEY/PREMATURE_EXECUTION"]),
  ROADMAP_CONTEXT_ERROR: Object.freeze(["JOURNEY/LIFECYCLE_ORDER_VIOLATION"]),
  PROVENANCE_ERROR: Object.freeze(["JOURNEY/EVIDENCE_MISMATCH"]),
  FAILURE_TO_HANDLE_AMBIGUITY: Object.freeze(["JOURNEY/FAILURE_TO_HANDLE_AMBIGUITY", "JOURNEY/REPEATED_CLARIFICATION"]),
});

function publish(atTick: number): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick });
}

function advance(atTick: number): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "ADVANCE_WORLD" as const, atTick });
}

function spoken(): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "MANAGER_TURN" as const });
}

function probe(
  utterance: string,
  managementIntent: NexoraSimulationManagerJourneyIntent,
  extras?: { readonly intendedSubject?: string; readonly deictic?: boolean },
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "MANAGER_TURN" as const, utterance, managementIntent, ...extras });
}

function firstChangeTick(scenario: RmsScenarioDefinition): number {
  return scenario.eventSchedule[0]?.scheduledTick ?? Math.min(4, scenario.durationTicks);
}

function laterChangeTick(scenario: RmsScenarioDefinition): number {
  const ticks = scenario.eventSchedule.map((item) => item.scheduledTick);
  const unique = [...new Set(ticks)].sort((left, right) => left - right);
  return unique[1] ?? scenario.durationTicks;
}

function recoveryTick(scenario: RmsScenarioDefinition): number {
  if (scenario.scenarioId === "manufacturing-capacity-pressure") return 29;
  return scenario.durationTicks;
}

function usesRecovery(family: NexoraSimulationAdaptiveFamily, scenario: RmsScenarioDefinition): boolean {
  return family === "RECOVERY" && scenario.scenarioId === "manufacturing-capacity-pressure";
}

function boundedTicks(family: NexoraSimulationAdaptiveFamily, scenario: RmsScenarioDefinition, length: "short" | "medium" | "long"): number {
  if (usesRecovery(family, scenario) || (length === "long" && scenario.scenarioId === "manufacturing-capacity-pressure" && family === "RECOVERY")) {
    return 29;
  }
  return Math.max(scenario.durationTicks, laterChangeTick(scenario), firstChangeTick(scenario));
}

function modeFor(family: NexoraSimulationAdaptiveFamily): "FAST" | "INGESTION" {
  if (family === "HIDDEN_CHANGE" || family === "DELAYED_OBSERVATION" || family === "COMPETING_CHANGES" || family === "RECOVERY") {
    return "INGESTION";
  }
  return "INGESTION";
}

function buildFamilySteps(input: {
  readonly family: NexoraSimulationAdaptiveFamily;
  readonly scenario: RmsScenarioDefinition;
  readonly length: "short" | "medium" | "long";
}): readonly NexoraSimulationTestJourneyStep[] {
  const first = firstChangeTick(input.scenario);
  const later = laterChangeTick(input.scenario);
  const recover = recoveryTick(input.scenario);
  const extra = input.length === "long" ? Object.freeze([spoken(), spoken(), spoken(), spoken()]) : Object.freeze([]);

  if (input.family === "CHANGE_BEFORE_QUESTION") {
    return Object.freeze([
      publish(first),
      probe("What is happening?", "ORIENT"),
      spoken(),
      probe("Has anything changed?", "CHECK_CHANGE"),
      ...extra,
    ]);
  }
  if (input.family === "CHANGE_BETWEEN_TURNS") {
    return Object.freeze([
      publish(0),
      probe("Show the Capacity problem.", "FOCUS_PROBLEM", { intendedSubject: "Capacity" }),
      publish(first),
      probe("Why is this happening?", "ASK_CAUSE", { deictic: true }),
      spoken(),
      ...extra,
    ]);
  }
  if (input.family === "CHANGE_DURING_INVESTIGATION") {
    return Object.freeze([
      publish(0),
      probe("Show the Capacity problem.", "FOCUS_PROBLEM", { intendedSubject: "Capacity" }),
      probe("Why?", "ASK_CAUSE", { intendedSubject: "Capacity", deictic: true }),
      publish(first),
      probe("What evidence supports that?", "REQUEST_EVIDENCE", { deictic: true }),
      probe("Has anything changed?", "CHECK_CHANGE"),
      ...extra,
    ]);
  }
  if (input.family === "CHANGE_DURING_SCENARIO") {
    return Object.freeze([
      publish(0),
      probe("Show the Capacity problem.", "FOCUS_PROBLEM", { intendedSubject: "Capacity" }),
      probe("Compare the three scenarios.", "COMPARE", { deictic: true }),
      publish(first),
      probe("Which assumptions changed?", "CHECK_CHANGE"),
      spoken(),
      ...extra,
    ]);
  }
  if (input.family === "CHANGE_AFTER_DECISION") {
    return Object.freeze([
      publish(0),
      probe("Show the Capacity problem.", "FOCUS_PROBLEM", { intendedSubject: "Capacity" }),
      probe("Compare those two.", "COMPARE", { deictic: true }),
      probe("Let's go with the first option.", "COMMIT_DECISION", { deictic: true }),
      probe("Yes, make that the decision.", "COMMIT_DECISION", { deictic: true }),
      publish(first),
      probe("Does this decision still make sense?", "REASSESS", { deictic: true }),
      ...extra,
    ]);
  }
  if (input.family === "CHANGE_DURING_EXECUTION") {
    return Object.freeze([
      publish(0),
      probe("Show the Capacity problem.", "FOCUS_PROBLEM", { intendedSubject: "Capacity" }),
      probe("Let's go with the first option.", "COMMIT_DECISION", { deictic: true }),
      probe("Yes, make that the decision.", "COMMIT_DECISION", { deictic: true }),
      probe("Start it.", "REQUEST_EXECUTION", { deictic: true }),
      publish(first),
      probe("How is execution going?", "FOLLOW_UP", { deictic: true }),
      ...extra,
    ]);
  }
  if (input.family === "RECOVERY") {
    const afterPressure = Math.min(later, recover);
    const recovered = recover > afterPressure;
    return Object.freeze([
      publish(0),
      probe("Show the Capacity problem.", "FOCUS_PROBLEM", { intendedSubject: "Capacity" }),
      publish(first),
      probe("Why are deliveries late?", "ASK_CAUSE", { intendedSubject: "Delivery" }),
      publish(afterPressure),
      probe("Is this still a problem?", "REASSESS", { deictic: true }),
      ...(recovered ? [publish(recover)] : []),
      probe("What changed?", "CHECK_CHANGE"),
      probe("Do I still need to act?", "REASSESS"),
      probe("Does the previous decision still matter?", "REASSESS"),
      ...extra,
    ]);
  }
  if (input.family === "HIDDEN_CHANGE") {
    return Object.freeze([
      publish(0),
      probe("How is Capacity?", "INVESTIGATE", { intendedSubject: "Capacity" }),
      advance(first),
      probe("How is Capacity?", "INVESTIGATE", { intendedSubject: "Capacity" }),
      probe("Has anything changed?", "CHECK_CHANGE"),
      ...extra,
    ]);
  }
  if (input.family === "DELAYED_OBSERVATION") {
    return Object.freeze([
      publish(0),
      probe("How is Capacity?", "INVESTIGATE", { intendedSubject: "Capacity" }),
      advance(first),
      probe("How is Capacity?", "INVESTIGATE", { intendedSubject: "Capacity" }),
      publish(first),
      probe("Has anything changed?", "CHECK_CHANGE"),
      ...extra,
    ]);
  }
  return Object.freeze([
    publish(0),
    probe("Give me the management picture.", "ORIENT"),
    publish(first),
    probe("Where are we exposed?", "ORIENT"),
    publish(later),
    probe("Has anything changed?", "CHECK_CHANGE"),
    probe("Is Capacity still the main issue?", "CHECK_CHANGE", { intendedSubject: "Capacity" }),
    ...extra,
  ]);
}

function buildJourney(input: {
  readonly family: NexoraSimulationAdaptiveFamily;
  readonly scenario: RmsScenarioDefinition;
  readonly profileId: RmsManagerProfileId;
  readonly seed: number;
  readonly length: "short" | "medium" | "long";
}): NexoraSimulationTestJourney {
  const steps = buildFamilySteps({ family: input.family, scenario: input.scenario, length: input.length });
  const turns = steps.filter((step) => step.kind === "MANAGER_TURN").length;
  return Object.freeze({
    journeyId: `sim-test-8-${input.family.toLowerCase()}-${input.scenario.scenarioId}-${input.profileId.toLowerCase()}-${input.length}-seed-${input.seed}`,
    version: "1.0",
    title: `${input.family} ${input.profileId} ${input.scenario.scenarioId}`,
    scenarioId: input.scenario.scenarioId,
    scenarioVersion: input.scenario.version,
    managerProfileId: input.profileId,
    behaviorSeed: input.seed,
    conversationLength: input.length,
    adaptiveFamily: input.family,
    adaptiveEventPack: usesRecovery(input.family, input.scenario) ? "MACHINE_RECOVERY" : "SCENARIO",
    startingMode: "WATCH" as const,
    mode: modeFor(input.family),
    boundedDurationTicks: boundedTicks(input.family, input.scenario, input.length),
    turnBudget: turns,
    maxRepeatedClarificationAttempts: 2,
    maxUnresolvedLoops: 2,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    targetSurfaces: TARGETS,
    stopConditions: STOPS,
    steps,
  });
}

export function buildSimTest8Population(): readonly NexoraSimulationTestJourney[] {
  const journeys: NexoraSimulationTestJourney[] = [];
  for (const [index, family] of SIM_TEST_8_ADAPTIVE_FAMILIES.entries()) {
    for (const [scenarioIndex, scenario] of SCENARIOS.entries()) {
      const profileId = PROFILES[(index + scenarioIndex) % PROFILES.length]!;
      if (RMS_MANAGER_PROFILES[profileId].groundTruthAccess) {
        throw new Error("SIM-TEST:8 profile must not grant Ground Truth");
      }
      journeys.push(buildJourney({
        family,
        scenario,
        profileId,
        seed: SIM_TEST_8_SEEDS[0],
        length: "short",
      }));
    }
  }
  const secondSeedFamilies = Object.freeze([
    "HIDDEN_CHANGE", "DELAYED_OBSERVATION", "CHANGE_AFTER_DECISION",
    "CHANGE_DURING_EXECUTION", "RECOVERY", "COMPETING_CHANGES",
  ] as const satisfies readonly NexoraSimulationAdaptiveFamily[]);
  for (const family of secondSeedFamilies) {
    journeys.push(buildJourney({
      family,
      scenario: RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
      profileId: family === "CHANGE_AFTER_DECISION" || family === "CHANGE_DURING_EXECUTION"
        ? "DECISION_ORIENTED_MANAGER"
        : family === "HIDDEN_CHANGE" || family === "DELAYED_OBSERVATION"
          ? "DATA_CHALLENGING_MANAGER"
          : family === "COMPETING_CHANGES"
            ? "EXECUTIVE_MANAGER"
            : "INVESTIGATIVE_MANAGER",
      seed: SIM_TEST_8_SEEDS[1],
      length: "medium",
    }));
  }
  for (const family of SIM_TEST_8_ADAPTIVE_FAMILIES) {
    journeys.push(buildJourney({
      family,
      scenario: RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
      profileId: family === "CHANGE_AFTER_DECISION" || family === "CHANGE_DURING_EXECUTION"
        ? "DECISION_ORIENTED_MANAGER"
        : "INVESTIGATIVE_MANAGER",
      seed: SIM_TEST_8_LONG_SEED,
      length: "long",
    }));
  }
  return Object.freeze(journeys);
}

export const SIM_TEST_8_JOURNEYS = buildSimTest8Population();
