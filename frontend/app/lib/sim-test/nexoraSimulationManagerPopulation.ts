/**
 * NPA-T SIM-TEST:7 — manager population orchestration.
 * Journeys name a profile, scenario, and seed. Utterances are chosen at run time
 * by the existing RMS manager from manager-visible information.
 */

import type { RmsManagerIntent, RmsManagerProfileId } from "../rms/rmsManagerContract.ts";
import { RMS_MANAGER_PROFILES, RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS } from "../rms/rmsManagerProfiles.ts";
import {
  RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
  RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
  RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE,
  RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
} from "../rms/rmsScenarioLibrary.ts";
import type { RmsScenarioDefinition } from "../rms/rmsScenarioContract.ts";
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

const TOPICS = Object.freeze([
  "Capacity Gap", "Capacity", "Delivery", "Revenue", "Risk", "Inventory",
  "Schedule", "Resources", "Milestone", "Service", "Staffing", "Maintenance", "Goal",
]);

const NAVIGATION_PROFILES = new Set<RmsManagerProfileId>([
  "STRUCTURED_MANAGER",
  "DISTRACTED_MANAGER",
  "NONLINEAR_MANAGER",
  "EXECUTIVE_MANAGER",
  "DECISION_ORIENTED_MANAGER",
]);

const SCENARIOS = Object.freeze([
  RMS_SCENARIO_MANUFACTURING_CAPACITY_PRESSURE,
  RMS_SCENARIO_PROJECT_DELIVERY_PRESSURE,
  RMS_SCENARIO_LOGISTICS_DELIVERY_PRESSURE,
  RMS_SCENARIO_SERVICE_CAPACITY_PRESSURE,
]);

export const SIM_TEST_7_SEEDS = Object.freeze([11, 29] as const);
export const SIM_TEST_7_LONG_SEED = 47;

const TURN_COUNTS = Object.freeze({
  short: 6,
  medium: 10,
  long: 18,
} as const);

export const SIM_TEST_7_OBSERVER_DETECTIONS = Object.freeze({
  WRONG_REFERENT: Object.freeze(["JOURNEY/WRONG_REFERENT"]),
  STALE_CONTEXT: Object.freeze([
    "JOURNEY/STALE_REFERENT", "JOURNEY/STALE_DATA_USE", "JOURNEY/STALE_PARENT",
    "JOURNEY/STALE_GRANDPARENT", "JOURNEY/STALE_L1", "JOURNEY/STALE_STAGE_FOCUS",
    "JOURNEY/DATA_SNAPSHOT_RESTORE",
  ]),
  SUBJECT_IDENTITY_LOSS: Object.freeze(["JOURNEY/SUBJECT_LOSS", "JOURNEY/IDENTITY_DRIFT"]),
  UNSUPPORTED_CAUSAL_CLAIM: Object.freeze(["JOURNEY/UNSUPPORTED_CAUSAL_CLAIM"]),
  GROUND_TRUTH_LEAK: Object.freeze(["JOURNEY/GROUND_TRUTH_LEAK", "JOURNEY/KNOWLEDGE_LEAK"]),
  DATA_REALITY_VIOLATION: Object.freeze([
    "JOURNEY/STALE_DATA_USE", "JOURNEY/EVIDENCE_MISMATCH", "JOURNEY/DATA_SNAPSHOT_RESTORE",
    "JOURNEY/DATA_EXECUTION_DESYNC",
  ]),
  FALSE_CERTAINTY: Object.freeze(["JOURNEY/FALSE_CERTAINTY"]),
  INVENTED_FACT: Object.freeze(["JOURNEY/UNSUPPORTED_FACT"]),
  DECISION_STATE_ERROR: Object.freeze([
    "JOURNEY/PREMATURE_DECISION", "JOURNEY/MISSING_DECISION", "JOURNEY/DUPLICATE_DECISION",
    "JOURNEY/DECISION_IDENTITY_DRIFT",
  ]),
  EXECUTION_STATE_ERROR: Object.freeze([
    "JOURNEY/PREMATURE_EXECUTION", "JOURNEY/MISSING_EXECUTION", "JOURNEY/DUPLICATE_EXECUTION",
    "JOURNEY/WRONG_EXECUTION_REFERENT",
  ]),
  ROADMAP_CONTEXT_ERROR: Object.freeze(["JOURNEY/LIFECYCLE_ORDER_VIOLATION"]),
  MANAGEMENT_LEVEL_ERROR: Object.freeze([
    "JOURNEY/MLEVEL_DIVERGENCE", "JOURNEY/STALE_PARENT", "JOURNEY/STALE_GRANDPARENT",
    "JOURNEY/CROSS_BRANCH_ANCESTOR_LEAK",
  ]),
  PROVENANCE_ERROR: Object.freeze(["JOURNEY/EVIDENCE_MISMATCH"]),
  FAILURE_TO_HANDLE_AMBIGUITY: Object.freeze([
    "JOURNEY/FAILURE_TO_HANDLE_AMBIGUITY", "JOURNEY/REPEATED_CLARIFICATION",
  ]),
});

function canonicalTopic(value: string): string {
  return TOPICS.find((topic) => topic.toLowerCase() === value.toLowerCase()) ?? value;
}

export function namedPopulationFocus(utterance: string): string | null {
  const topic = TOPICS.join("|");
  const patterns = [
    new RegExp(`\\bno, i meant (${topic})\\b`, "i"),
    new RegExp(`\\bgo back to (${topic})\\b`, "i"),
    new RegExp(`\\bback to (${topic})\\b`, "i"),
    new RegExp(`\\bshow (?:me )?the (${topic})(?: problem)?\\b`, "i"),
    new RegExp(`\\bwait\\s+[—-]\\s+show (${topic})\\b`, "i"),
    new RegExp(`\\bwhat is driving (${topic})\\b`, "i"),
    new RegExp(`\\bwhat about (${topic})\\b`, "i"),
    new RegExp(`\\bswitch to (${topic})\\b`, "i"),
    new RegExp(`\\bwhere is the (${topic})\\b`, "i"),
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(utterance);
    if (match?.[1]) return canonicalTopic(match[1]);
  }
  return null;
}

export function populationTurnIsDeictic(utterance: string): boolean {
  if (namedPopulationFocus(utterance)) return false;
  const text = utterance.trim();
  if (/^(why\??|show me\.?|and this\??|fix it\.?|next\.?|compare them\.?|what about (that|this|yesterday)\??|is this bad\??|what changed\??|which one\??|can we improve it\??|how do you know\??|that doesn't make sense\.?|show the evidence\.?|are you assuming that\??|did we observe that or calculate it\??|where did (this|that) come from\??|is this current\??)$/i.test(text)) {
    return true;
  }
  return /\b(it|that|this|them|those)\b/i.test(text);
}

export function shapePopulationManagerTurn(input: {
  readonly utterance: string;
  readonly intent: RmsManagerIntent;
  readonly priorSubject: string | null;
}): {
  readonly managementIntent: NexoraSimulationManagerJourneyIntent;
  readonly deictic: boolean;
  readonly intendedSubject: string | null;
} {
  const utterance = input.utterance.trim();
  const named = namedPopulationFocus(utterance);
  const deictic = populationTurnIsDeictic(utterance);
  let managementIntent: NexoraSimulationManagerJourneyIntent;
  if (/^no, i meant\b/i.test(utterance) || /^wait\b/i.test(utterance)) managementIntent = "CHANGE_CONTEXT";
  else if (/\bgo back\b|\bnow back\b|\bback to\b/i.test(utterance)) managementIntent = "RETURN_TO_SUBJECT";
  else if (/^yes, make that the decision\b|^let's go with\b/i.test(utterance)) managementIntent = "COMMIT_DECISION";
  else if (/^start it\b|^put that into action\b/i.test(utterance)) managementIntent = "REQUEST_EXECUTION";
  else if (/^fix it\b/i.test(utterance)) managementIntent = "REQUEST_EXECUTION_BEFORE_COMMIT";
  else if (/^did it work\b/i.test(utterance)) managementIntent = "ASK_OUTCOME";
  else if (/\bcompare\b/i.test(utterance)) managementIntent = "COMPARE";
  else if (/what changed|since yesterday|what about yesterday|has anything changed|has it changed|is capacity still|still the main issue/i.test(utterance)) managementIntent = "CHECK_CHANGE";
  else if (/still a problem|still need to act|still make sense|what happened to the risk/i.test(utterance)) managementIntent = "REASSESS";
  else if (/^how is capacity\b/i.test(utterance)) managementIntent = "INVESTIGATE";
  else if (/which assumptions changed/i.test(utterance)) managementIntent = "CHECK_CHANGE";
  else if (/where did|how do you know|show the evidence|are you assuming|did we observe|is this current|which csv|enough information|if this data is wrong|what evidence/i.test(utterance)) {
    managementIntent = "REQUEST_EVIDENCE";
  } else if (/^why\b|what caused|what is driving|what would change the conclusion/i.test(utterance)) managementIntent = "ASK_CAUSE";
  else if (/what variables|what don't we know/i.test(utterance)) managementIntent = "ASK_VARIABLES";
  else if (/what needs my attention|where are we exposed|management picture|before approving|what decision is blocking/i.test(utterance)) {
    managementIntent = "ORIENT";
  } else if (/^show\b/i.test(utterance)) managementIntent = "FOCUS_PROBLEM";
  else if (/^is this bad\b|^which one\b|^can we improve\b|^what about that\b/i.test(utterance)) managementIntent = "FOLLOW_UP";
  else if (/how is execution going/i.test(utterance)) managementIntent = "FOLLOW_UP";
  else if (/what is the kpi/i.test(utterance)) managementIntent = "INVESTIGATE";
  else if (/what is the goal/i.test(utterance)) managementIntent = "ORIENT";
  else if (/what is the problem/i.test(utterance)) managementIntent = "INVESTIGATE";
  else {
    const fallback: Readonly<Record<RmsManagerIntent, NexoraSimulationManagerJourneyIntent>> = {
      UNDERSTAND: "ORIENT",
      INSPECT: "INVESTIGATE",
      INVESTIGATE: "FOCUS_PROBLEM",
      ASK_DATA: "REQUEST_EVIDENCE",
      ASK_CAUSE: "ASK_CAUSE",
      ASK_OPTIONS: "EXPLORE_OPTIONS",
      COMPARE: "COMPARE",
      ASK_RECOMMENDATION: "FOLLOW_UP",
      FOLLOW_UP: "FOLLOW_UP",
      CLARIFY: "FOLLOW_UP",
    };
    managementIntent = fallback[input.intent];
  }
  return Object.freeze({
    managementIntent,
    deictic,
    intendedSubject: named ?? (deictic ? input.priorSubject : null),
  });
}

function publish(atTick: number): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick });
}

function interact(surface: "MLEVEL_L2" | "MLEVEL_L3" | "STAGE_FOCUSED"): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "INTERACT_VISIBLE" as const, surface });
}

function ingestionMode(profileId: RmsManagerProfileId, length: "short" | "medium" | "long"): "FAST" | "INGESTION" {
  if (length !== "short") return "INGESTION";
  if (profileId === "DATA_CHALLENGING_MANAGER" || profileId === "INVESTIGATIVE_MANAGER" || profileId === "SKEPTICAL_MANAGER") {
    return "INGESTION";
  }
  return "FAST";
}

function publishTicks(scenario: RmsScenarioDefinition, length: "short" | "medium" | "long"): readonly number[] {
  if (length === "short") return Object.freeze([0]);
  const ticks = [0];
  if (scenario.durationTicks >= 7) ticks.push(7);
  if (scenario.durationTicks > 0 && !ticks.includes(scenario.durationTicks)) ticks.push(scenario.durationTicks);
  return Object.freeze(ticks);
}

function buildSteps(input: {
  readonly turns: number;
  readonly publishAt: readonly number[];
  readonly navigate: boolean;
}): readonly NexoraSimulationTestJourneyStep[] {
  const steps: NexoraSimulationTestJourneyStep[] = [publish(input.publishAt[0] ?? 0)];
  const later = input.publishAt.slice(1);
  const midpoint = Math.floor(input.turns / 2);
  let publishedLater = false;
  for (let index = 0; index < input.turns; index += 1) {
    if (!publishedLater && index === midpoint) {
      for (const tick of later) steps.push(publish(tick));
      publishedLater = true;
    }
    steps.push(Object.freeze({ kind: "MANAGER_TURN" as const }));
    if (input.navigate && index === 3) steps.push(interact("MLEVEL_L2"));
    if (input.navigate && index === 6) steps.push(interact("MLEVEL_L3"));
    if (input.navigate && index === 8) steps.push(interact("STAGE_FOCUSED"));
  }
  return Object.freeze(steps);
}

function buildJourney(input: {
  readonly profileId: RmsManagerProfileId;
  readonly scenario: RmsScenarioDefinition;
  readonly seed: number;
  readonly length: "short" | "medium" | "long";
}): NexoraSimulationTestJourney {
  const turns = TURN_COUNTS[input.length];
  const navigate = input.length !== "short" && NAVIGATION_PROFILES.has(input.profileId);
  return Object.freeze({
    journeyId: `sim-test-7-${input.profileId.toLowerCase()}-${input.scenario.scenarioId}-${input.length}-seed-${input.seed}`,
    version: "1.0",
    title: `${input.profileId} ${input.length} ${input.scenario.scenarioId}`,
    scenarioId: input.scenario.scenarioId,
    scenarioVersion: input.scenario.version,
    managerProfileId: input.profileId,
    behaviorSeed: input.seed,
    conversationLength: input.length,
    startingMode: "WATCH" as const,
    mode: ingestionMode(input.profileId, input.length),
    boundedDurationTicks: input.scenario.durationTicks,
    turnBudget: turns,
    maxRepeatedClarificationAttempts: 2,
    maxUnresolvedLoops: 2,
    maxNavigationCycles: navigate ? 8 : undefined,
    disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE" as const,
    requiredCheckpoints: REQUIRED,
    targetSurfaces: TARGETS,
    stopConditions: STOPS,
    steps: buildSteps({
      turns,
      publishAt: publishTicks(input.scenario, input.length),
      navigate,
    }),
  });
}

export function buildSimTest7Population(): readonly NexoraSimulationTestJourney[] {
  const journeys: NexoraSimulationTestJourney[] = [];
  for (const [profileIndex, profileId] of RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS.entries()) {
    if (RMS_MANAGER_PROFILES[profileId].groundTruthAccess) {
      throw new Error("SIM-TEST:7 profile must not grant Ground Truth");
    }
    for (const scenario of SCENARIOS) {
      for (const seed of SIM_TEST_7_SEEDS) {
        const length = seed === SIM_TEST_7_SEEDS[0] ? "short" : "medium";
        journeys.push(buildJourney({ profileId, scenario, seed, length }));
      }
    }
    journeys.push(buildJourney({
      profileId,
      scenario: SCENARIOS[profileIndex % SCENARIOS.length]!,
      seed: SIM_TEST_7_LONG_SEED,
      length: "long",
    }));
  }
  return Object.freeze(journeys);
}

export const SIM_TEST_7_JOURNEYS = buildSimTest7Population();
