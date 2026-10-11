/**
 * NPA-T TIMELINE-TEST:1 — real-manager historical journeys.
 * Consumes certified Historical Truth / CMSI / presentation. No new product authority.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { executiveAdvisoryPurposeOf, resolveNexoraConversationalIntent } from "../conversational-control/conversationalIntentResolver.ts";
import { HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL, HISTORICAL_TRUTH_GAPS, describeHistoricalFact } from "./historicalTruthContract.ts";
import { nexoraGroundedLearningIntelligenceIdentity, type GroundedLearningCandidate } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import { NEXORA_MVP_FLOW_TIMELINE_SEED } from "../nex-mvp/nexoraMVPExecutiveFlowFixtures.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import { resolveDataRealityEvidenceForManagedSubject } from "../managed-subject-identity/managedSubjectIdentity.ts";
import { screenHistoricalProjectionInput, type HistoricalObservationInput, type ProjectHistoricalTruthInput } from "./historicalTruthProjection.ts";
import {
  agreementKeys,
  emptyLabelFor,
  HISTORICAL_MANAGER_FROZEN_NOW,
  historicalTruthManagerJourneyIdentity,
  playHistoricalManagerTurn,
  rangeForScope,
  type HistoricalJourneyLedgerRow,
  type HistoricalJourneyTurn,
} from "./historicalTruthManagerJourneyHarness.ts";
import { historicalLensRange, readCanonicalHistoricalPresentation } from "./historicalTruthPresentation.ts";

const OBS_87: HistoricalObservationInput = Object.freeze({
  observationId:
    "nexora.executive-operations.demo.baseline:kpi.production.capacity-utilization:nexora.executive-operations.object.production:2026-08-10T00:00:00.000Z",
  kpiId: "kpi.production.capacity-utilization",
  objectKey: "production",
  nexoraObjectId: "nexora.executive-operations.object.production",
  value: 87,
  unit: "%",
  observedAt: "2026-08-10T00:00:00.000Z",
});

const OBS_25: HistoricalObservationInput = Object.freeze({
  observationId: "live:PM2-github:overview:vercel/next.js-20260821112935515:kpi.production.capacity-utilization",
  kpiId: "kpi.production.capacity-utilization",
  objectKey: "production",
  nexoraObjectId: "nexora.executive-operations.object.production",
  value: 25,
  unit: "%",
  observedAt: "2026-08-21T11:29:00.000Z",
});

const OBS_222: HistoricalObservationInput = Object.freeze({
  observationId: "live:PM2-github:overview:vercel/next.js-20260901213429010:kpi.production.capacity-utilization",
  kpiId: "kpi.production.capacity-utilization",
  objectKey: "production",
  nexoraObjectId: "nexora.executive-operations.object.production",
  value: 2.2222222222222223,
  unit: "%",
  observedAt: "2026-09-01T21:34:00.000Z",
});

const THROUGHPUT: HistoricalObservationInput = Object.freeze({
  observationId: "prod-throughput",
  kpiId: "kpi.production.throughput",
  objectKey: "production",
  nexoraObjectId: "nexora.executive-operations.object.production",
  value: 12,
  unit: "u",
  observedAt: "2026-08-10T00:00:00.000Z",
});

const LIVE_CAPACITY = Object.freeze([OBS_87, OBS_25, OBS_222]);

function liveWorld(): ProjectHistoricalTruthInput {
  return {
    subjectId: "obj-capacity",
    observations: LIVE_CAPACITY,
    decisions: [
      Object.freeze({
        decisionId: "ctx-decision-capacity",
        title: "Expand Capacity",
        status: "Under Review" as const,
        locked: false,
        subjectIds: Object.freeze([]),
        evidenceRefs: Object.freeze([]),
        uncertaintyRefs: Object.freeze([]),
        committedBy: "manager" as const,
        source: "conversation" as const,
        workspaceId: "nexora-mvp",
        modelId: "nexora-mvp",
      }),
    ],
  };
}

function managementWorld(): ProjectHistoricalTruthInput {
  const decisions = createNexoraCanonicalDecisionRuntime();
  const approved = decisions.adapter.transitionDecision({
    decisionId: "ctx-decision-capacity",
    action: "approve",
    title: "Expand Capacity",
    subjectIds: ["obj-capacity"],
    committedAt: "2026-08-15T10:00:00.000Z",
    workspaceId: "w",
    modelId: "m",
  });
  assert.equal(approved.status, "applied");
  let index = 0;
  const clock = () =>
    ["2026-08-15T11:00:00.000Z", "2026-08-15T12:00:00.000Z"][Math.min(index++, 1)]!;
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: clock,
  });
  const created = executions.createExecution({ decisionId: "ctx-decision-capacity" });
  assert.equal(created.status, "created");
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "prepare",
  });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "start",
  });
  const learning: GroundedLearningCandidate = Object.freeze({
    identity: nexoraGroundedLearningIntelligenceIdentity,
    learningId: "core-out2:learning:l2",
    version: 1,
    previousLearningId: null,
    workspaceId: "w",
    subjectId: "obj-capacity",
    learningType: "outcome-learning",
    statement: "Capacity learning L2 is supported.",
    status: "supported",
    scope: "case-specific",
    confidence: "unknown",
    evidenceStrength: "unknown",
    createdAt: HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL,
    decisionRefs: Object.freeze(["ctx-decision-capacity"]),
    executionRefs: Object.freeze(["execution-ctx-decision-capacity"]),
    scenarioRefs: Object.freeze([]),
    issueRefs: Object.freeze([]),
    expectedOutcomeRefs: Object.freeze([]),
    outcomeAssessmentRefs: Object.freeze([]),
    observationRefs: Object.freeze([OBS_87.observationId]),
    causalFindingRefs: Object.freeze([]),
    constraintFindingRefs: Object.freeze([]),
    assumptionRefs: Object.freeze([]),
    evidenceRefs: Object.freeze([]),
    provenanceRefs: Object.freeze([]),
    uncertainty: Object.freeze([]),
    repeatability: "single-case",
    contradictions: Object.freeze([]),
    freshness: "current",
    promotionEligibility: "not-promotion-eligible",
    establishesCausation: false,
    recommendsAction: false,
    isCurrentTruth: false,
  });
  return {
    subjectId: "obj-capacity",
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
    observations: LIVE_CAPACITY,
    learnings: Object.freeze([learning]),
  };
}

function turn(
  family: HistoricalJourneyTurn["family"],
  id: string,
  profile: HistoricalJourneyTurn["managerProfile"],
  seed: HistoricalJourneyTurn["seed"],
  utterance: string,
  expected: HistoricalJourneyTurn["expectedClassification"],
  extra: Partial<HistoricalJourneyTurn> = {},
): HistoricalJourneyTurn {
  return Object.freeze({
    journeyId: id,
    family,
    managerProfile: profile,
    seed,
    initialSubject: extra.initialSubject ?? "obj-capacity",
    managerUtterance: utterance,
    intent: extra.intent ?? "history",
    requestedTimeScope: extra.requestedTimeScope ?? "unbounded",
    expectedClassification: expected,
    expectedSubject: extra.expectedSubject,
    mustIncludeTitles: extra.mustIncludeTitles,
    mustExcludeTitles: extra.mustExcludeTitles ?? [
      "Capacity Gap identified",
      "tl-capacity-gap",
    ],
    expectEmptyLabel: extra.expectEmptyLabel,
    expectPlaceableOnly: extra.expectPlaceableOnly,
    expectNoCausation: extra.expectNoCausation ?? true,
    expectRecordingTimeOnly: extra.expectRecordingTimeOnly,
  });
}

const TURNS: readonly HistoricalJourneyTurn[] = Object.freeze([
  turn("A", "A1", "STRUCTURED_MANAGER", 11, "What happened with Capacity?", "SUPPORTED_HISTORY", {
    mustIncludeTitles: ["Capacity observed at 87%"],
  }),
  turn("A", "A2", "IMPATIENT_MANAGER", 11, "Show me Capacity history.", "SUPPORTED_HISTORY", {
    mustIncludeTitles: ["Capacity observed at 87%"],
  }),
  turn("A", "A3", "AMBIGUOUS_MANAGER", 29, "What has happened to Capacity?", "SUPPORTED_HISTORY"),
  turn("A", "A4", "DISTRACTED_MANAGER", 29, "Give me the history of Capacity.", "SUPPORTED_HISTORY"),
  turn("A", "A5", "INVESTIGATIVE_MANAGER", 47, "Capacity history.", "SUPPORTED_HISTORY"),
  turn("A", "A6", "NONLINEAR_MANAGER", 47, "What happened with production capacity?", "SUPPORTED_HISTORY", {
    expectedSubject: "obj-capacity",
    mustIncludeTitles: ["Capacity observed at 87%"],
  }),
  turn("B", "B1", "STRUCTURED_MANAGER", 11, "What happened with Capacity in August?", "SUPPORTED_HISTORY", {
    requestedTimeScope: "august-2026",
    mustIncludeTitles: ["Capacity observed at 87%", "Capacity observed at 25%"],
  }),
  turn("B", "B2", "STRUCTURED_MANAGER", 11, "Show Capacity history for August 2026.", "SUPPORTED_HISTORY", {
    requestedTimeScope: "august-2026",
  }),
  turn("B", "B3", "IMPATIENT_MANAGER", 29, "What happened last week?", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "week",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("B", "B4", "IMPATIENT_MANAGER", 29, "What happened this month?", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "month",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("B", "B5", "INVESTIGATIVE_MANAGER", 47, "Show me Capacity between August 1 and August 31.", "SUPPORTED_HISTORY", {
    requestedTimeScope: "explicit-august",
    mustIncludeTitles: ["87%"],
  }),
  turn("B", "B6", "STRUCTURED_MANAGER", 11, "Show Capacity history this year.", "SUPPORTED_HISTORY", {
    requestedTimeScope: "year",
    mustIncludeTitles: ["87%", "25%"],
  }),
  turn("B", "B7", "DISTRACTED_MANAGER", 29, "What happened today?", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "day",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("B", "B8", "SKEPTICAL_MANAGER", 47, "What happened last month?", "SUPPORTED_HISTORY", {
    requestedTimeScope: "last-month",
    mustIncludeTitles: ["2.2222222222222223%"],
  }),
  turn("C", "C1", "AMBIGUOUS_MANAGER", 11, "What happened with Capacity?", "SUPPORTED_HISTORY"),
  turn("C", "C2", "AMBIGUOUS_MANAGER", 11, "What about last month?", "SUPPORTED_HISTORY", {
    requestedTimeScope: "last-month",
    expectedSubject: "obj-capacity",
  }),
  turn("C", "C3", "AMBIGUOUS_MANAGER", 11, "And before that?", "SUPPORTED_HISTORY", {
    requestedTimeScope: "august-2026",
    expectedSubject: "obj-capacity",
  }),
  turn("C", "C4", "AMBIGUOUS_MANAGER", 11, "What changed after that?", "SUPPORTED_HISTORY", {
    expectedSubject: "obj-capacity",
    expectNoCausation: true,
  }),
  turn("C", "C5", "DISTRACTED_MANAGER", 29, "Show it again.", "SUPPORTED_HISTORY", {
    expectedSubject: "obj-capacity",
  }),
  turn("C", "C6", "NONLINEAR_MANAGER", 47, "What about it?", "SUPPORTED_HISTORY", {
    expectedSubject: "obj-capacity",
  }),
  turn("D", "D1", "STRUCTURED_MANAGER", 11, "What happened with Revenue?", "NO_SUPPORTED_HISTORY", {
    initialSubject: "obj-revenue",
    expectedSubject: "obj-revenue",
    expectEmptyLabel: "No supported history yet",
  }),
  turn("D", "D2", "IMPATIENT_MANAGER", 29, "Show Revenue history.", "NO_SUPPORTED_HISTORY", {
    initialSubject: "obj-revenue",
    expectEmptyLabel: "No supported history yet",
  }),
  turn("D", "D3", "INVESTIGATIVE_MANAGER", 47, "What happened with Inventory?", "NO_SUPPORTED_HISTORY", {
    initialSubject: "obj-inventory",
    expectEmptyLabel: "No supported history yet",
  }),
  turn("E", "E1", "STRUCTURED_MANAGER", 11, "What happened with Capacity last week?", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "week",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("E", "E2", "SKEPTICAL_MANAGER", 29, "Show Capacity this week.", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "week",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("E", "E3", "IMPATIENT_MANAGER", 47, "Anything this month for Capacity?", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "month",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("F", "F1", "INVESTIGATIVE_MANAGER", 11, "When was Capacity observed at 87%?", "SUPPORTED_HISTORY", {
    mustIncludeTitles: ["Capacity observed at 87%"],
  }),
  turn("F", "F2", "INVESTIGATIVE_MANAGER", 11, "What was the Capacity reading in August?", "SUPPORTED_HISTORY", {
    requestedTimeScope: "august-2026",
    mustIncludeTitles: ["87%"],
  }),
  turn("F", "F3", "STRUCTURED_MANAGER", 29, "What Capacity observations do we have?", "SUPPORTED_HISTORY"),
  turn("F", "F4", "STRUCTURED_MANAGER", 29, "Which Capacity reading came first?", "SUPPORTED_HISTORY", {
    intent: "first",
    expectPlaceableOnly: true,
    mustIncludeTitles: ["87%"],
  }),
  turn("F", "F5", "STRUCTURED_MANAGER", 29, "What is the latest Capacity observation?", "SUPPORTED_HISTORY", {
    intent: "latest",
    expectPlaceableOnly: true,
    mustIncludeTitles: ["2.2222222222222223%"],
  }),
  turn("F", "F6", "SKEPTICAL_MANAGER", 47, "What changed between these Capacity readings?", "SUPPORTED_HISTORY", {
    expectNoCausation: true,
  }),
  turn("F", "F7", "INVESTIGATIVE_MANAGER", 47, "Order the Capacity observations.", "SUPPORTED_HISTORY"),
  turn("F", "F8", "IMPATIENT_MANAGER", 11, "When did Capacity change?", "SUPPORTED_HISTORY", {
    expectNoCausation: true,
  }),
  turn("G", "G1", "DECISION_ORIENTED_MANAGER", 11, "What decisions were committed?", "SUPPORTED_HISTORY", {
    expectRecordingTimeOnly: true,
  }),
  turn("G", "G2", "DECISION_ORIENTED_MANAGER", 11, "When was this Decision committed?", "SUPPORTED_HISTORY"),
  turn("G", "G3", "DECISION_ORIENTED_MANAGER", 29, "What happened before this Decision?", "SUPPORTED_HISTORY", {
    intent: "before",
  }),
  turn("G", "G4", "DECISION_ORIENTED_MANAGER", 29, "What happened after this Decision?", "SUPPORTED_HISTORY", {
    intent: "after",
  }),
  turn("G", "G5", "SKEPTICAL_MANAGER", 47, "When did this Decision happen?", "SUPPORTED_HISTORY", {
    expectRecordingTimeOnly: true,
  }),
  turn("H", "H1", "DECISION_ORIENTED_MANAGER", 11, "When did execution start?", "SUPPORTED_HISTORY"),
  turn("H", "H2", "DECISION_ORIENTED_MANAGER", 29, "Show me the execution history.", "SUPPORTED_HISTORY"),
  turn("H", "H3", "STRUCTURED_MANAGER", 47, "What happened after execution started?", "SUPPORTED_HISTORY", {
    intent: "after",
  }),
  turn("I", "I1", "SKEPTICAL_MANAGER", 11, "When was the Capacity problem first identified?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I2", "SKEPTICAL_MANAGER", 11, "When did this scenario get reviewed?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I3", "SKEPTICAL_MANAGER", 29, "When did Nexora learn this?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I4", "SKEPTICAL_MANAGER", 29, "When exactly did the outcome assessment happen?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I5", "INVESTIGATIVE_MANAGER", 47, "When did Capacity become a problem?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I6", "INVESTIGATIVE_MANAGER", 47, "When did we compare this scenario?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I7", "STRUCTURED_MANAGER", 11, "When was this outcome evaluated?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("I", "I8", "AMBIGUOUS_MANAGER", 29, "When did we learn that?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("J", "J1", "NONLINEAR_MANAGER", 11, "What happened with Capacity?", "SUPPORTED_HISTORY", {
    expectedSubject: "obj-capacity",
  }),
  turn("J", "J2", "NONLINEAR_MANAGER", 11, "What happened with Revenue?", "NO_SUPPORTED_HISTORY", {
    expectedSubject: "obj-revenue",
    expectEmptyLabel: "No supported history yet",
  }),
  turn("J", "J3", "NONLINEAR_MANAGER", 11, "Back to Capacity.", "SUPPORTED_HISTORY", {
    expectedSubject: "obj-capacity",
    mustIncludeTitles: ["87%"],
  }),
  turn("J", "J4", "NONLINEAR_MANAGER", 29, "What about Inventory?", "NO_SUPPORTED_HISTORY", {
    expectedSubject: "obj-inventory",
  }),
  turn("K", "K1", "INVESTIGATIVE_MANAGER", 47, "Show me everything that happened with Capacity.", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["throughput", "Capacity Gap identified"],
  }),
  turn("K", "K2", "SKEPTICAL_MANAGER", 47, "Did Production throughput happen to Capacity?", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["throughput"],
  }),
  turn("K", "K3", "STRUCTURED_MANAGER", 11, "Show Capacity history including production numbers.", "SUPPORTED_HISTORY"),
  turn("K", "K4", "IMPATIENT_MANAGER", 29, "Everything on Capacity.", "SUPPORTED_HISTORY"),
  turn("L", "L1", "SKEPTICAL_MANAGER", 11, "How do you know Capacity was 87%?", "SUPPORTED_HISTORY", {
    intent: "skeptical",
    mustIncludeTitles: ["87%"],
  }),
  turn("L", "L2", "SKEPTICAL_MANAGER", 11, "Where did that come from?", "SUPPORTED_HISTORY", {
    intent: "skeptical",
  }),
  turn("L", "L3", "SKEPTICAL_MANAGER", 29, "Is that an observation or an assumption?", "SUPPORTED_HISTORY", {
    intent: "skeptical",
  }),
  turn("L", "L4", "SKEPTICAL_MANAGER", 29, "Did Nexora infer that?", "SUPPORTED_HISTORY", {
    intent: "skeptical",
  }),
  turn("L", "L5", "SKEPTICAL_MANAGER", 47, "Are you sure this happened in August?", "SUPPORTED_HISTORY", {
    requestedTimeScope: "august-2026",
    intent: "skeptical",
  }),
  turn("L", "L6", "SKEPTICAL_MANAGER", 47, "Why did Capacity fall?", "CAUSATION_NOT_ESTABLISHED", {
    intent: "causation",
  }),
  turn("L", "L7", "DECISION_ORIENTED_MANAGER", 11, "Did the Decision cause Capacity to drop?", "CAUSATION_NOT_ESTABLISHED", {
    intent: "causation",
  }),
  turn("L", "L8", "DECISION_ORIENTED_MANAGER", 29, "Was the 25% reading caused by our action?", "CAUSATION_NOT_ESTABLISHED", {
    intent: "causation",
  }),
  turn("M", "M1", "NONLINEAR_MANAGER", 11, "What happened with Capacity?", "SUPPORTED_HISTORY"),
  turn("M", "M2", "NONLINEAR_MANAGER", 11, "What about Revenue?", "NO_SUPPORTED_HISTORY"),
  turn("M", "M3", "NONLINEAR_MANAGER", 29, "Show Capacity history.", "SUPPORTED_HISTORY", {
    mustIncludeTitles: ["87%"],
  }),
  turn("N", "N1", "SKEPTICAL_MANAGER", 47, "What happened with Capacity?", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["Capacity Gap identified", "tl-capacity-gap", "Margin Pressure"],
  }),
  turn("N", "N2", "STRUCTURED_MANAGER", 47, "Show the Capacity Gap identified event.", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["Capacity Gap identified"],
  }),
  turn("C", "C7", "AMBIGUOUS_MANAGER", 29, "What happened with it?", "AMBIGUOUS_SUBJECT", {
    initialSubject: null,
    intent: "ambiguous-subject",
    expectedSubject: null,
  }),
  turn("B", "B9", "AMBIGUOUS_MANAGER", 11, "What happened recently?", "AMBIGUOUS_TIME", {
    requestedTimeScope: "ambiguous",
    intent: "ambiguous-time",
  }),
  turn("B", "B10", "AMBIGUOUS_MANAGER", 29, "What happened earlier?", "AMBIGUOUS_TIME", {
    requestedTimeScope: "ambiguous",
    intent: "ambiguous-time",
  }),
  turn("A", "A7", "IMPATIENT_MANAGER", 11, "What happened with Capacity?", "SUPPORTED_HISTORY"),
  turn("A", "A8", "IMPATIENT_MANAGER", 11, "What happened with Capacity?", "SUPPORTED_HISTORY"),
  turn("A", "A9", "STRUCTURED_MANAGER", 29, "What is Capacity now?", "CURRENT_STATE_NOT_HISTORY", {
    intent: "current-state",
  }),
  turn("J", "J5", "DISTRACTED_MANAGER", 47, "Revenue history please.", "NO_SUPPORTED_HISTORY"),
  turn("K", "K5", "INVESTIGATIVE_MANAGER", 11, "Show me everything that happened with Capacity.", "SUPPORTED_HISTORY"),
  turn("H", "H4", "DECISION_ORIENTED_MANAGER", 47, "When was it completed?", "SUPPORTED_HISTORY"),
  turn("G", "G6", "DECISION_ORIENTED_MANAGER", 47, "What decisions were committed for Capacity?", "SUPPORTED_HISTORY"),
  turn("F", "F9", "INVESTIGATIVE_MANAGER", 11, "Which Capacity reading came first?", "SUPPORTED_HISTORY", {
    intent: "first",
  }),
  turn("I", "I9", "SKEPTICAL_MANAGER", 11, "When did Nexora learn this?", "UNSUPPORTED_HISTORICAL_CLAIM", {
    intent: "unsupported-claim",
  }),
  turn("L", "L9", "SKEPTICAL_MANAGER", 29, "Did execution fix Capacity?", "CAUSATION_NOT_ESTABLISHED", {
    intent: "causation",
  }),
  turn("E", "E4", "STRUCTURED_MANAGER", 11, "Capacity today.", "SUPPORTED_HISTORY_OUTSIDE_PERIOD", {
    requestedTimeScope: "day",
    expectEmptyLabel: "No supported history in this period",
  }),
  turn("N", "N3", "NONLINEAR_MANAGER", 29, "Replay the Capacity Gap identified timeline.", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["Capacity Gap identified"],
  }),
  turn("M", "M4", "NONLINEAR_MANAGER", 47, "What happened with Capacity?", "SUPPORTED_HISTORY"),
  turn("M", "M5", "NONLINEAR_MANAGER", 11, "Return to Capacity history.", "SUPPORTED_HISTORY", {
    mustIncludeTitles: ["87%"],
  }),
  turn("M", "M6", "DISTRACTED_MANAGER", 29, "Open Activity for Capacity.", "SUPPORTED_HISTORY"),
  turn("N", "N4", "SKEPTICAL_MANAGER", 11, "Show journal Capacity Gap identified.", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["Capacity Gap identified", "pack-problem"],
  }),
  turn("N", "N5", "IMPATIENT_MANAGER", 47, "Use the seeded timeline for Capacity.", "SUPPORTED_HISTORY", {
    mustExcludeTitles: ["Capacity Gap identified"],
  }),
]);

function worldFor(turnSpec: HistoricalJourneyTurn): ProjectHistoricalTruthInput {
  if (turnSpec.family === "G" || turnSpec.family === "H") {
    return managementWorld();
  }
  return liveWorld();
}

test("TIMELINE-TEST:1 harness stays test-only after the product historical Truth route is added", () => {
  assert.equal(historicalTruthManagerJourneyIdentity, "NPA-T TIMELINE-TEST:1/ManagerHistoricalJourneyHarness");
  assert.ok(RMS_MANAGER_PROFILES.STRUCTURED_MANAGER);
  assert.equal(executiveAdvisoryPurposeOf("what happened with capacity?"), "historical-query");
  assert.equal(executiveAdvisoryPurposeOf("show me capacity history"), "historical-query");
  const resolved = resolveNexoraConversationalIntent({ utterance: "What happened with Capacity?" });
  assert.notEqual(resolved.intent.kind, "focus");
  const shell = readFileSync(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url), "utf8");
  assert.equal(shell.includes("historicalTruthManagerJourneyHarness"), false);
  assert.equal(shell.includes("readCanonicalHistoricalPresentation"), true);
  const harness = readFileSync(new URL("./historicalTruthManagerJourneyHarness.ts", import.meta.url), "utf8");
  assert.equal(harness.includes("Date.now"), false);
  assert.match(harness, /test-only manager journey harness/);
});

test("TIMELINE-TEST:1 frozen time matches the certified lens seam", () => {
  const week = historicalLensRange("week", HISTORICAL_MANAGER_FROZEN_NOW);
  assert.ok(week);
  assert.equal(week?.to, HISTORICAL_MANAGER_FROZEN_NOW);
  assert.ok(week!.from < "2026-08-10T00:00:00.000Z" === false);
  const august = rangeForScope("august-2026");
  assert.equal(august?.from, "2026-08-01T00:00:00.000Z");
});

test("TIMELINE-TEST:1 manager journeys A–N stay faithful to canonical history", () => {
  const ledger: HistoricalJourneyLedgerRow[] = [];
  let prior: string | null = null;
  const before = JSON.stringify(LIVE_CAPACITY);
  for (const spec of TURNS) {
    const extras = spec.family === "K" ? [THROUGHPUT] : [];
    const played = playHistoricalManagerTurn({
      turn: spec,
      priorSubject: prior,
      world: worldFor(spec),
      extraObservations: extras,
    });
    prior = spec.intent === "ambiguous-subject" ? null : played.resolvedSubject;
    ledger.push(played.ledger);
    assert.equal(played.ledger.pass, true, `${spec.journeyId} ${spec.managerUtterance} → ${played.ledger.actualClassification}`);
  }
  assert.equal(JSON.stringify(LIVE_CAPACITY), before);
  assert.ok(TURNS.length >= 70, `turns ${TURNS.length}`);
  const families = new Set(TURNS.map((item) => item.family));
  assert.deepEqual([...families].sort(), ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"]);
  const count = (family: string) => TURNS.filter((item) => item.family === family).length;
  assert.ok(count("A") >= 6);
  assert.ok(count("B") >= 8);
  assert.ok(count("C") >= 6);
  assert.ok(count("D") + count("E") >= 6);
  assert.ok(count("F") >= 8);
  assert.ok(count("G") + count("H") >= 8);
  assert.ok(count("I") >= 8);
  assert.ok(count("J") + count("K") >= 8);
  assert.ok(count("L") >= 8);
  assert.ok(count("M") + count("N") >= 8);
  assert.equal(ledger.every((row) => row.findingSeverity === "none"), true);
  const failed = ledger.filter((row) => !row.pass);
  assert.deepEqual(failed, []);
});

test("TIMELINE-TEST:1 Timeline and Activity agree and empty/outside stay distinct", () => {
  const capacity = readCanonicalHistoricalPresentation({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    observations: LIVE_CAPACITY,
  });
  const keys = agreementKeys(capacity);
  assert.deepEqual(keys.timeline, keys.activity);
  assert.equal(capacity.chronological[0]?.title.includes("87%"), true);
  assert.equal(capacity.chronological[0]?.orderingTimestamp, "2026-08-10T00:00:00.000Z");
  const week = readCanonicalHistoricalPresentation({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    observations: LIVE_CAPACITY,
    range: rangeForScope("week"),
  });
  assert.equal(week.chronological.length, 0);
  assert.ok(week.outsidePeriodCount > 0);
  assert.equal(emptyLabelFor("SUPPORTED_HISTORY_OUTSIDE_PERIOD"), "No supported history in this period");
  const revenue = readCanonicalHistoricalPresentation({
    subjectId: "obj-revenue",
    subjectLabel: "Revenue",
    observations: LIVE_CAPACITY,
  });
  assert.equal(revenue.chronological.length, 0);
  assert.equal(revenue.outsidePeriodCount, 0);
  assert.equal(emptyLabelFor("NO_SUPPORTED_HISTORY"), "No supported history yet");
  assert.notEqual(emptyLabelFor("NO_SUPPORTED_HISTORY"), emptyLabelFor("SUPPORTED_HISTORY_OUTSIDE_PERIOD"));
});

test("TIMELINE-TEST:1 CMSI granularity, under-review Decision, fixture Execution, RMS, and gaps", () => {
  const membership = resolveDataRealityEvidenceForManagedSubject({
    objectKey: OBS_87.objectKey,
    nexoraObjectId: OBS_87.nexoraObjectId,
    evidenceId: OBS_87.kpiId,
  });
  assert.equal(membership.status, "resolved");
  if (membership.status === "resolved") {
    assert.equal(membership.provenance?.declarationId, "cmsi:capacity:kpi.production.capacity-utilization");
  }
  const leaked = readCanonicalHistoricalPresentation({
    subjectId: "obj-capacity",
    observations: [THROUGHPUT],
  });
  assert.equal(leaked.chronological.length, 0);
  const live = liveWorld();
  const underReview = readCanonicalHistoricalPresentation({
    subjectId: "obj-capacity",
    decisions: live.decisions,
    observations: LIVE_CAPACITY,
  });
  assert.equal(underReview.chronological.some((item) => item.factType.startsWith("decision-")), false);
  const fixtureExec = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: createNexoraCanonicalDecisionRuntime().adapter,
  });
  const screenedExec = screenHistoricalProjectionInput({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "ctx-execution-capacity",
  });
  assert.equal(screenedExec.admitted, false);
  void fixtureExec;
  const rms = screenHistoricalProjectionInput({
    factType: "observation-published",
    sourceKind: "rms-ground-truth",
    sourceId: "rms:capacity:hidden",
    fields: { observedAt: "2026-08-10T00:00:00.000Z" },
  });
  assert.deepEqual(rms, { admitted: false, reason: "rms-ground-truth" });
  const published = readCanonicalHistoricalPresentation({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    observations: [OBS_87],
  });
  assert.equal(published.chronological.length, 1);
  const problem = describeHistoricalFact({
    factType: "problem-identified",
    sourceKind: "workspace-risk",
    sourceId: "tl-capacity-gap",
    subjectIds: ["obj-capacity"],
    fields: { occurredAt: "2026-08-02T11:00:00.000Z" },
  });
  assert.equal(problem.admitted, false);
  assert.equal(problem.admitted === false ? problem.reason : null, "unsupported-fact");
  assert.ok(NEXORA_MVP_FLOW_TIMELINE_SEED.some((event) => event.id === "tl-capacity-gap"));
  assert.equal(published.timeline.some((item) => item.title.includes("Capacity Gap identified")), false);
  const learning = describeHistoricalFact({
    factType: "learning-record",
    sourceKind: "core-out-2-learning",
    sourceId: "core-out2:learning:l2",
    subjectIds: ["obj-capacity"],
    fields: { createdAt: HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL },
  });
  assert.equal(learning.admitted, true);
  if (learning.admitted) {
    assert.equal(learning.fact.timestamps[0]?.placeable, false);
    assert.equal(learning.fact.timestamps[0]?.status, "non-chronological");
    assert.equal(learning.fact.timestamps[0]?.value, HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL);
  }
  assert.equal(HISTORICAL_TRUTH_GAPS.find((entry) => entry.id === "HT-GAP-03")?.fixed, false);
  assert.equal(HISTORICAL_TRUTH_GAPS.find((entry) => entry.id === "HT-GAP-05")?.fixed, true);
});
