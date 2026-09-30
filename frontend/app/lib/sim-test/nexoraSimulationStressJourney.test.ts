import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { composeNmiLiveManagementLevels } from "../nmi/nmiLiveManagementLevelsCompose.ts";
import { hostNmiLiveManagementIntelligence } from "../nmi/nmiLivePipeline.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { RMS_MANAGER_AGENT_CONTRACT } from "../rms/rmsActorContracts.ts";
import { RMS_REAL_CONVERSATION_ENTRY_NAME } from "../rms/rmsManagerCc5Adapter.ts";
import {
  aggregateNexoraSimulationTestReports,
  runNexoraSimulationTestJourney,
  validateNexoraSimulationTestJourney,
} from "./nexoraSimulationTestHarness.ts";
import {
  classifyManagerJourney,
  renderContinuitySummary,
  renderStressTransitionTable,
} from "./nexoraSimulationJourneyObservation.ts";
import { SIM_TEST_3_MANUFACTURING_PRIMARY } from "./nexoraSimulationManagerJourneys.ts";
import {
  SIM_TEST_4_JOURNEYS,
  SIM_TEST_4_LOGISTICS_PARITY,
  SIM_TEST_4_MANUFACTURING_STRESS,
  SIM_TEST_4_PROJECT_STRESS,
  SIM_TEST_4_SERVICE_PARITY,
} from "./nexoraSimulationStressJourneys.ts";
import {
  SIM_TEST_4_BOUNDARY,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
  type NexoraSimulationJourneyTurnObservation,
} from "./nexoraSimulationTestContract.ts";

const JOURNEY_SOURCE = readFileSync(new URL("./nexoraSimulationStressJourneys.ts", import.meta.url), "utf8");
const HARNESS_SOURCE = readFileSync(new URL("./nexoraSimulationTestHarness.ts", import.meta.url), "utf8");

let cached: ReturnType<typeof runNexoraSimulationTestJourney>[] | null = null;

function reports() {
  cached ??= SIM_TEST_4_JOURNEYS.map((journey, index) =>
    runNexoraSimulationTestJourney({ journey, runId: `sim-test-4-${index}` }),
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

test("1–6 — SIM-TEST:4 reuses Manager Agent, MLEVEL, Stage, and real CC:5", () => {
  assert.equal(SIM_TEST_4_BOUNDARY.createsNavigationAgent, false);
  assert.equal(SIM_TEST_4_BOUNDARY.createsStageAgent, false);
  assert.equal(SIM_TEST_4_BOUNDARY.createsMlevelAgent, false);
  assert.equal(SIM_TEST_4_BOUNDARY.redesignsMlevel, false);
  assert.equal(SIM_TEST_4_BOUNDARY.redesignsStage, false);
  assert.equal(SIM_TEST_4_BOUNDARY.simTestStageSync, false);
  assert.equal(SIM_TEST_4_BOUNDARY.autoRepairs, false);
  assert.equal(SIM_TEST_4_BOUNDARY.startsSimTest5, false);
  assert.equal(RMS_MANAGER_AGENT_CONTRACT.kind, "MANAGER_AGENT");
  assert.equal(RMS_REAL_CONVERSATION_ENTRY_NAME, "executeNexoraConversationalExperience");
  assert.match(HARNESS_SOURCE, /selectNexoraMVPInteractionSubject/);
  assert.match(HARNESS_SOURCE, /applyManagementLevelInteraction/);
  assert.equal(HARNESS_SOURCE.includes("class StageAgent"), false);
  assert.equal(HARNESS_SOURCE.includes("class MlevelAgent"), false);
  for (const journey of SIM_TEST_4_JOURNEYS) {
    validateNexoraSimulationTestJourney(journey);
  }
  for (const key of SIM_TEST_FORBIDDEN_JOURNEY_KEYS) assert.equal(JOURNEY_SOURCE.includes(key), false);
  assert.equal(JOURNEY_SOURCE.includes("machineAvailability"), false);
  const manufacturingTurns = SIM_TEST_4_MANUFACTURING_STRESS.steps.filter((step) => step.kind === "MANAGER_TURN").length;
  assert.ok(manufacturingTurns >= 25 && manufacturingTurns <= 40);
});

test("missing ancestors stay NOT_APPLICABLE and fabricated L2 is classified", () => {
  const absent = classifyManagerJourney({
    testRunId: "unit",
    rmsRunId: "rms:unit",
    journey: SIM_TEST_4_LOGISTICS_PARITY,
    observations: [observation({
      mlevelL1: "obj-capacity",
      ancestorApplicable: "NOT_APPLICABLE",
      canonicalSubjectId: "obj-capacity",
      conversationSubjectId: "obj-capacity",
      focusedSubjectLabel: "Capacity",
      stageActiveSubjectId: "obj-capacity",
      response: "Capacity is the active subject.",
    })],
    causalOverclaimTurns: [],
  });
  assert.equal(absent.findings.some((finding) => finding.classification.includes("STALE_PARENT")), false);

  const fabricated = classifyManagerJourney({
    testRunId: "unit",
    rmsRunId: "rms:unit",
    journey: SIM_TEST_4_LOGISTICS_PARITY,
    observations: [observation({
      mlevelL1: "obj-capacity",
      mlevelL2: "obj-delivery",
      ancestorApplicable: "CANONICAL",
      canonicalSubjectId: "obj-capacity",
      conversationSubjectId: "obj-capacity",
      focusedSubjectLabel: "Capacity",
      stageActiveSubjectId: "obj-capacity",
      response: "Capacity is the active subject.",
    })],
    causalOverclaimTurns: [],
  });
  assert.ok(fabricated.findings.some((finding) => finding.classification === "JOURNEY/STALE_PARENT"));
});

test("reduced motion does not change live MLEVEL identity", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const live = hostNmiLiveManagementIntelligence({ catalog, focusedSubjectId: "obj-capacity" });
  const full = composeNmiLiveManagementLevels({ map: live.map, selectedCanonicalId: "obj-capacity", reducedMotion: false });
  const reduced = composeNmiLiveManagementLevels({ map: live.map, selectedCanonicalId: "obj-capacity", reducedMotion: true });
  assert.equal(full.path.active?.canonicalId, reduced.path.active?.canonicalId);
  assert.equal(full.path.parent?.canonicalId ?? null, reduced.path.parent?.canonicalId ?? null);
  assert.equal(full.path.grandparent?.canonicalId ?? null, reduced.path.grandparent?.canonicalId ?? null);
});

test("stress journeys, FIX1 regression, isolation, and no auto-repair", () => {
  const all = reports();
  assert.equal(all.length, 4);
  assert.ok(all.every((report) => report.harnessStatus === "PASS"));
  assert.ok(all.every((report) => report.autoRepairAttempted === false));
  assert.ok(all.every((report) => report.managerFirewall?.groundTruthAccess === false));
  const byId = Object.fromEntries(all.map((report) => [report.identity.journeyId, report]));
  const manufacturing = byId[SIM_TEST_4_MANUFACTURING_STRESS.journeyId]!;
  const project = byId[SIM_TEST_4_PROJECT_STRESS.journeyId]!;
  assert.equal(manufacturing.identity.mode, "INGESTION");
  assert.equal(project.identity.mode, "INGESTION");
  assert.equal(byId[SIM_TEST_4_LOGISTICS_PARITY.journeyId]!.identity.mode, "FAST");
  assert.equal(byId[SIM_TEST_4_SERVICE_PARITY.journeyId]!.identity.mode, "FAST");
  assert.ok(manufacturing.turns >= 25 && manufacturing.turns <= 40);
  assert.ok(project.turns >= 10);
  assert.equal(manufacturing.findingCounts.S0, 0);
  assert.equal(manufacturing.findingCounts.S1, 0);
  assert.equal(project.findingCounts.S0, 0);
  assert.equal(project.findingCounts.S1, 0);
  assert.equal(byId[SIM_TEST_4_LOGISTICS_PARITY.journeyId]!.findingCounts.S1, 0);
  assert.equal(byId[SIM_TEST_4_SERVICE_PARITY.journeyId]!.findingCounts.S1, 0);
  assert.equal(manufacturing.productStatus, "PASS");
  assert.equal(project.productStatus, "PASS");
  assert.match(renderStressTransitionTable(manufacturing), /Canonical subject/);
  assert.match(renderContinuitySummary(manufacturing), /Historical return:/);
  const fix1 = runNexoraSimulationTestJourney({ journey: SIM_TEST_3_MANUFACTURING_PRIMARY, runId: "sim-test-4-fix1" });
  assert.equal(fix1.harnessStatus, "PASS");
  assert.equal(fix1.findingCounts.S0, 0);
  const isolation = aggregateNexoraSimulationTestReports("sim-test-4", [...all, fix1]);
  assert.equal(isolation.crossRunIsolation, "PASS");
  assert.equal(isolation.harnessFailures, 0);
});
