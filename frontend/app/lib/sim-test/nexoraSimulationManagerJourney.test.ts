import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { RMS_MANAGER_AGENT_CONTRACT } from "../rms/rmsActorContracts.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "../rms/rmsManagerCc5Adapter.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import {
  aggregateNexoraSimulationTestReports,
  runNexoraSimulationTestJourney,
  validateNexoraSimulationTestJourney,
} from "./nexoraSimulationTestHarness.ts";
import {
  assessCrossRunIsolation,
  classifyManagerJourney,
  renderContinuitySummary,
  renderJourneyTimeline,
} from "./nexoraSimulationJourneyObservation.ts";
import {
  SIM_TEST_3_JOURNEYS,
  SIM_TEST_3_LOGISTICS_PARITY,
  SIM_TEST_3_MANUFACTURING_PRIMARY,
  SIM_TEST_3_PROJECT_PRIMARY,
  SIM_TEST_3_SERVICE_PARITY,
} from "./nexoraSimulationManagerJourneys.ts";
import {
  SIM_TEST_3_BOUNDARY,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
  type NexoraSimulationJourneyTurnObservation,
  type NexoraSimulationTestJourney,
} from "./nexoraSimulationTestContract.ts";

const JOURNEY_SOURCE = readFileSync(new URL("./nexoraSimulationManagerJourneys.ts", import.meta.url), "utf8");
const HARNESS_SOURCE = readFileSync(new URL("./nexoraSimulationTestHarness.ts", import.meta.url), "utf8");

let cached: ReturnType<typeof runNexoraSimulationTestJourney>[] | null = null;

function reports() {
  cached ??= SIM_TEST_3_JOURNEYS.map((journey, index) =>
    runNexoraSimulationTestJourney({ journey, runId: `sim-test-3-${index}` }),
  );
  return cached;
}

function observation(
  overrides: Partial<NexoraSimulationJourneyTurnObservation> = {},
): NexoraSimulationJourneyTurnObservation {
  return Object.freeze({
    turn: 1,
    tick: 0,
    intent: "ORIENT",
    utterance: "What is happening?",
    deictic: false,
    intendedSubject: null,
    response: "Operations are under pressure.",
    conversationSubjectId: null,
    canonicalSubjectId: null,
    focusedSubjectLabel: null,
    nmiCanonicalId: null,
    advisorReferentId: null,
    advisorReferentName: null,
    mlevelL1: null,
    mlevelL2: null,
    mlevelL3: null,
    mlevelVisibleDepth: 0,
    ancestorApplicable: "NOT_APPLICABLE",
    stageActiveSubjectId: null,
    stageSelectedObjectId: null,
    sceneIntent: null,
    clarificationRequired: false,
    decisionStatus: null,
    npsState: null,
    npsProblemLabel: null,
    vaiFocalObjectId: null,
    vaiRoleSummaries: Object.freeze([]),
    dataPublicationIds: Object.freeze([]),
    csvVersions: Object.freeze([]),
    visibleNumbers: Object.freeze({}),
    epistemicMarks: Object.freeze([]),
    ...overrides,
  });
}

function classify(observations: readonly NexoraSimulationJourneyTurnObservation[], journey: NexoraSimulationTestJourney = SIM_TEST_3_LOGISTICS_PARITY) {
  return classifyManagerJourney({
    testRunId: "unit",
    rmsRunId: "rms:unit",
    journey,
    observations,
    causalOverclaimTurns: [],
  });
}

test("1–6 — existing Manager Agent, real CC:5, and intent journeys stay bounded", () => {
  assert.equal(SIM_TEST_3_BOUNDARY.managerAuthority, "NPA-T RMS:4/ManagerAgentConversation");
  assert.equal(SIM_TEST_3_BOUNDARY.createsJourneyManager, false);
  assert.equal(SIM_TEST_3_BOUNDARY.createsConversationEngine, false);
  assert.equal(SIM_TEST_3_BOUNDARY.suppliesHiddenReferent, false);
  assert.equal(RMS_MANAGER_AGENT_CONTRACT.kind, "MANAGER_AGENT");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
  assert.match(HARNESS_SOURCE, /runRmsManagerConversationTurn/);
  assert.equal(HARNESS_SOURCE.includes("class JourneyManager"), false);
  assert.equal(JOURNEY_SOURCE.includes("executeNexoraConversationalExperience"), false);
  for (const journey of SIM_TEST_3_JOURNEYS) {
    validateNexoraSimulationTestJourney(journey);
    assert.equal(JSON.stringify(journey).includes("expectedAnswer"), false);
    assert.ok(journey.steps.some((step) => step.kind === "MANAGER_TURN" && step.managementIntent));
  }
  for (const key of SIM_TEST_FORBIDDEN_JOURNEY_KEYS) assert.equal(JOURNEY_SOURCE.includes(key), false);
});

test("3–4 — Manager profiles cannot read Ground Truth or Observer knowledge", () => {
  for (const profile of Object.values(RMS_MANAGER_PROFILES)) {
    assert.equal(profile.groundTruthAccess, false);
  }
  assert.equal(SIM_TEST_3_BOUNDARY.managerReadsGroundTruth, false);
  assert.equal(SIM_TEST_3_BOUNDARY.managerReadsObserver, false);
  assert.equal(JOURNEY_SOURCE.includes("machineAvailability"), false);
  assert.equal(JOURNEY_SOURCE.includes("findingId"), false);
});

test("7–9 — STANDARD, IMPATIENT, and DATA_DRIVEN journeys keep their profiles", () => {
  assert.equal(SIM_TEST_3_PROJECT_PRIMARY.managerProfileId, "STANDARD_MANAGER");
  assert.equal(SIM_TEST_3_SERVICE_PARITY.managerProfileId, "STANDARD_MANAGER");
  assert.equal(SIM_TEST_3_LOGISTICS_PARITY.managerProfileId, "IMPATIENT_MANAGER");
  assert.equal(SIM_TEST_3_MANUFACTURING_PRIMARY.managerProfileId, "DATA_DRIVEN_MANAGER");
  assert.ok(SIM_TEST_3_MANUFACTURING_PRIMARY.steps.some((step) => step.kind === "MANAGER_TURN" && step.managementIntent === "REQUEST_EVIDENCE"));
  assert.equal(RMS_MANAGER_PROFILES.DATA_DRIVEN_MANAGER.groundTruthAccess, false);
  assert.equal(RMS_MANAGER_PROFILES.IMPATIENT_MANAGER.groundTruthAccess, false);
});

test("10–22 and 48 — manufacturing and project journeys declare the required management progression", () => {
  const manufacturing = SIM_TEST_3_MANUFACTURING_PRIMARY.steps.flatMap((step) => step.kind === "MANAGER_TURN" ? [step.managementIntent] : []);
  for (const intent of ["ORIENT", "FOCUS_PROBLEM", "REQUEST_EVIDENCE", "ASK_CAUSE", "ASK_VARIABLES", "CHANGE_CONTEXT", "RETURN_TO_SUBJECT", "REQUEST_PARENT", "EXPLORE_OPTIONS", "CHECK_CHANGE"]) {
    assert.ok(manufacturing.some((item) => item === intent), intent);
  }
  assert.ok(SIM_TEST_3_MANUFACTURING_PRIMARY.steps.some((step) => step.kind === "MANAGER_TURN" && step.deictic));
  assert.ok(SIM_TEST_3_MANUFACTURING_PRIMARY.steps.filter((step) => step.kind === "PUBLISH_OBSERVABLE_DATA").length >= 2);
  const project = SIM_TEST_3_PROJECT_PRIMARY.steps.flatMap((step) => step.kind === "MANAGER_TURN" ? [step.managementIntent] : []);
  for (const intent of ["ORIENT", "INVESTIGATE", "FOCUS_PROBLEM", "REQUEST_EVIDENCE", "RETURN_TO_SUBJECT", "CHECK_CHANGE", "EXPLORE_OPTIONS", "REQUEST_PARENT"]) {
    assert.ok(project.some((item) => item === intent), intent);
  }
  const managerTurns = SIM_TEST_3_MANUFACTURING_PRIMARY.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  assert.ok(managerTurns >= 15 && managerTurns <= 30);
  const parityTurns = SIM_TEST_3_LOGISTICS_PARITY.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  assert.ok(parityTurns >= 5 && parityTurns <= 12);
});

test("28–29 and 36 — Decision is not bypassed and turn budgets stop the loop", () => {
  assert.equal(SIM_TEST_3_BOUNDARY.bypassesDecision, false);
  assert.equal(HARNESS_SOURCE.includes("commitDecision"), false);
  assert.equal(JOURNEY_SOURCE.includes("winningDecision"), false);
  const bounded = Object.freeze({ ...SIM_TEST_3_SERVICE_PARITY, journeyId: "budget-manager", turnBudget: 1 });
  const stopped = runNexoraSimulationTestJourney({ journey: bounded, runId: "budget-manager" });
  assert.equal(stopped.stopReason, "TURN_BUDGET");
  assert.equal(stopped.turns, 1);
  assert.equal(stopped.continuity.decisionDeferredLegitimately, true);
});

test("37–39 — loop, contradiction, and freshness classification use visible evidence", () => {
  const alternating = ["capacity", "delivery", "capacity", "delivery", "capacity", "delivery"].map((family, index) => observation({
    turn: index + 1,
    intent: index % 2 === 0 ? "CHANGE_CONTEXT" : "FOLLOW_UP",
    focusedSubjectLabel: family,
    intendedSubject: family,
    utterance: `Talk about ${family}`,
  }));
  const loop = classify(alternating);
  assert.ok(loop.findings.some((finding) => finding.classification === "JOURNEY/CONVERSATION_LOOP"));

  const clarified = [1, 2, 3].map((turn) => observation({
    turn,
    intent: "FOLLOW_UP",
    clarificationRequired: true,
    response: "Which subject do you mean?",
  }));
  assert.ok(classify(clarified).findings.some((finding) => finding.classification === "JOURNEY/REPEATED_CLARIFICATION"));

  const stale = classify([
    observation({ turn: 1, response: "Available capacity is 85.", csvVersions: Object.freeze([{ sourceType: "PRODUCTION", version: 1, tick: 0 }]) }),
    observation({ turn: 2, response: "Available capacity is 110.", csvVersions: Object.freeze([{ sourceType: "PRODUCTION", version: 1, tick: 0 }]) }),
  ]);
  assert.ok(stale.findings.some((finding) => finding.classification === "JOURNEY/STALE_DATA_USE"));
  const fresh = classify([
    observation({ turn: 1, response: "Available capacity is 85.", csvVersions: Object.freeze([{ sourceType: "PRODUCTION", version: 1, tick: 0 }]) }),
    observation({ turn: 2, response: "Available capacity is 110.", csvVersions: Object.freeze([{ sourceType: "PRODUCTION", version: 2, tick: 7 }]) }),
  ]);
  assert.equal(fresh.findings.some((finding) => finding.classification === "JOURNEY/STALE_DATA_USE"), false);
  assert.equal(fresh.freshness[1]?.latestIngestionTick, 7);
});

test("12 and 23–24 — return, stage divergence, and stage non-authority are measured", () => {
  const returned = classify([
    observation({ turn: 1, intent: "FOCUS_PROBLEM", intendedSubject: "Capacity Gap", focusedSubjectLabel: "Capacity Gap", response: "Capacity Gap is the active problem." }),
    observation({ turn: 2, intent: "CHANGE_CONTEXT", intendedSubject: "Delivery", focusedSubjectLabel: "Delivery Risk", response: "Delivery Risk is now in focus." }),
    observation({ turn: 3, intent: "RETURN_TO_SUBJECT", intendedSubject: "Capacity Gap", focusedSubjectLabel: "Capacity Gap", response: "Back to the Capacity Gap." }),
  ]);
  assert.equal(returned.findings.some((finding) => finding.classification === "JOURNEY/STALE_REFERENT"), false);

  const stuck = classify([
    observation({ turn: 1, intent: "FOCUS_PROBLEM", intendedSubject: "Capacity Gap", focusedSubjectLabel: "Capacity Gap", response: "Capacity Gap is active." }),
    observation({ turn: 2, intent: "RETURN_TO_SUBJECT", intendedSubject: "Capacity Gap", focusedSubjectLabel: "Delivery Risk", response: "Still looking at delivery risk." }),
  ]);
  const stale = stuck.findings.find((finding) => finding.classification === "JOURNEY/STALE_REFERENT");
  assert.ok(stale);
  assert.equal(stale?.repaired, false);

  const diverged = classify([
    observation({
      turn: 1,
      intent: "FOCUS_PROBLEM",
      intendedSubject: "Capacity",
      focusedSubjectLabel: "Capacity Gap",
      stageActiveSubjectId: "delivery-risk",
      response: "Capacity remains the subject.",
    }),
  ]);
  const stage = diverged.findings.find((finding) => finding.classification === "JOURNEY/STAGE_DIVERGENCE");
  assert.equal(stage?.likelyOwner, "STAGE");
  assert.equal(stage?.repaired, false);
});

test("17–19 and 40 — unknown answers and negated causes are not false causal findings", () => {
  const unknown = classify([
    observation({
      turn: 1,
      intent: "INVESTIGATE",
      utterance: "What will our main competitor's capacity be next quarter?",
      response: "The current data does not establish the competitor capacity.",
      visibleNumbers: Object.freeze({ CAP_AV: 85 }),
    }),
  ]);
  assert.equal(unknown.findings.some((finding) => finding.classification === "JOURNEY/UNSUPPORTED_FACT"), false);

  const fabricated = classify([
    observation({
      turn: 1,
      intent: "INVESTIGATE",
      utterance: "What will our main competitor's capacity be next quarter?",
      response: "The competitor capacity next quarter will be 400.",
      visibleNumbers: Object.freeze({ CAP_AV: 85 }),
    }),
  ]);
  assert.ok(fabricated.findings.some((finding) => finding.classification === "JOURNEY/UNSUPPORTED_FACT"));

  const negated = classifyManagerJourney({
    testRunId: "unit",
    rmsRunId: "rms:unit",
    journey: SIM_TEST_3_MANUFACTURING_PRIMARY,
    observations: [observation({
      turn: 3,
      intent: "ASK_CAUSE",
      response: "Machine downtime is not a confirmed cause. There is not enough evidence.",
    })],
    causalOverclaimTurns: [],
  });
  assert.equal(negated.findings.some((finding) => finding.classification.includes("CAUSAL_OVERCLAIM")), false);
  assert.equal(negated.findings.some((finding) => finding.classification === "JOURNEY/UNSUPPORTED_CAUSAL_CLAIM"), false);
  assert.equal(negated.continuity.causalSafety, "PASS");
});

test("30–35 and 41–44 — primary, parity, FAST, and INGESTION journeys stay isolated and unrepaired", () => {
  const all = reports();
  assert.equal(all.length, 4);
  assert.ok(all.every((report) => report.harnessStatus === "PASS"));
  assert.ok(all.every((report) => report.autoRepairAttempted === false));
  assert.ok(all.every((report) => report.managerFirewall?.groundTruthAccess === false));
  assert.ok(all.every((report) => report.managerFirewall?.observerKnowledge === false));
  assert.ok(all.every((report) => report.findingCounts.S0 === 0));
  const byId = Object.fromEntries(all.map((report) => [report.identity.journeyId, report]));
  const manufacturing = byId[SIM_TEST_3_MANUFACTURING_PRIMARY.journeyId]!;
  const project = byId[SIM_TEST_3_PROJECT_PRIMARY.journeyId]!;
  assert.equal(manufacturing.identity.mode, "INGESTION");
  assert.equal(project.identity.mode, "INGESTION");
  assert.equal(byId[SIM_TEST_3_LOGISTICS_PARITY.journeyId]!.identity.mode, "FAST");
  assert.equal(byId[SIM_TEST_3_SERVICE_PARITY.journeyId]!.identity.mode, "FAST");
  assert.ok(manufacturing.turns >= 15 && manufacturing.turns <= 30);
  assert.ok(project.turns >= 15);
  assert.ok(manufacturing.ingestion && manufacturing.ingestion.files.length > 0);
  assert.equal(manufacturing.journeyObservations.length, manufacturing.turns);
  assert.match(renderJourneyTimeline(manufacturing), /Turn 01 — ORIENT/);
  assert.match(renderContinuitySummary(manufacturing), /Conversation continuity:/);
  for (const report of all) {
    for (const finding of report.findings) {
      if (!finding.classification.includes("CAUSAL_OVERCLAIM")) continue;
      const turn = report.journeyObservations.find((item) => item.turn === finding.managerTurn);
      assert.equal(/do not establish|does not establish|not a confirmed cause|possible contributor|not a measured impact/i.test(turn?.response ?? ""), false);
    }
  }
  const isolation = assessCrossRunIsolation(all);
  assert.equal(isolation.status, "PASS");
  const aggregate = aggregateNexoraSimulationTestReports("sim-test-3", all);
  assert.equal(aggregate.crossRunIsolation, "PASS");
  assert.equal(aggregate.harnessFailures, 0);
  const replay = runNexoraSimulationTestJourney({ journey: SIM_TEST_3_LOGISTICS_PARITY, runId: "replay-logistics" });
  const first = byId[SIM_TEST_3_LOGISTICS_PARITY.journeyId]!;
  assert.equal(replay.deterministicSignature, first.deterministicSignature);
  assert.notEqual(replay.identity.rmsRunId, first.identity.rmsRunId);
});
