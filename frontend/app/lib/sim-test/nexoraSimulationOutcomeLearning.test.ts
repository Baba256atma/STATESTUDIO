/** NPA-T SIM-TEST:10 — Outcome & management learning. Measurement only. */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { SIM_TEST_5_JOURNEYS } from "./nexoraSimulationLifecycleJourneys.ts";
import {
  SIM_TEST_10_CORE_JOURNEYS,
  SIM_TEST_10_JOURNEYS,
  type SimTest10JourneyFamily,
} from "./nexoraSimulationOutcomeLearningJourneys.ts";
import {
  SIM_TEST_10_BOUNDARY,
  type NexoraSimulationTestJourney,
  type NexoraSimulationTestRunReport,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const FRONTEND_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/SIM-TEST-10/", import.meta.url);
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;
const SUCCESS_CLAIM = /\b(?:it worked|was successful|decision succeeded|outcome was success|execution succeeded)\b/i;
const CAUSAL_CERTAINTY = /\b(?:caused|because of|proves that|the decision made)\b/i;
const UNCERTAIN = /not enough|too early|unknown|does not establish|cannot tell|insufficient|not enough outcome evidence/i;
const ESTABLISHED = new Set(["MEETS_EXPECTATION", "EXCEEDS_EXPECTATION", "BELOW_EXPECTATION", "PARTIAL", "MIXED"]);

function productionFiles(directory: string): readonly string[] {
  const files: string[] = [];
  const visit = (current: string): void => {
    for (const name of readdirSync(current)) {
      const path = resolve(current, name);
      const rel = relative(FRONTEND_ROOT, path);
      if (rel.startsWith("app/lib/sim-test/") || rel.includes("/node_modules/") || rel.includes("/.next/")) continue;
      if (statSync(path).isDirectory()) visit(path);
      else if (/\.(?:ts|tsx|js|mjs)$/.test(name) && !/\.test\./.test(name)) files.push(path);
    }
  };
  visit(directory);
  return Object.freeze(files.sort());
}

function productionSnapshot() {
  const files = productionFiles(resolve(FRONTEND_ROOT, "app"));
  const aggregate = createHash("sha256");
  const protectedNames = [
    "conversationalExperienceOrchestrator.ts", "executiveExecutionFollowUp.ts",
    "executiveDecisionRuntimeAdapter.ts", "executiveExecutionRuntimeAdapter.ts",
    "executiveScenarioResolver.ts", "executiveScenarioDefinition.ts",
    "executiveDecisionCommitmentResolver.ts", "npsOutcomeLearning.ts",
    "npsOutcomeLearningRuntime.ts", "ecaExecutiveOutcome.ts", "ecaExecutiveLearningClosure.ts",
    "nexoraLiveOutcomeIntelligence.ts", "nexoraLiveOutcomeObservationCapture.ts",
    "nexoraOutcomeLearningRuntimeIntegration.ts", "nexoraGroundedLearningIntelligence.ts",
    "rmsManagerCc5Adapter.ts", "npsExecutionMonitoring.ts",
  ];
  const protectedFiles: Record<string, string> = {};
  for (const file of files) {
    const content = readFileSync(file);
    const rel = relative(FRONTEND_ROOT, file);
    const hash = createHash("sha256").update(content).digest("hex");
    aggregate.update(rel).update("\0").update(hash).update("\n");
    if (protectedNames.some((name) => rel.endsWith(name))) protectedFiles[rel] = hash;
  }
  return Object.freeze({ digest: aggregate.digest("hex"), fileCount: files.length, protectedFiles: Object.freeze(protectedFiles) });
}

function uniqueFindings(report: NexoraSimulationTestRunReport) {
  const unique = new Map<string, NexoraSimulationTestRunReport["findings"][number]>();
  for (const finding of [...report.findings, ...report.journeyFindings]) unique.set(finding.findingId, finding);
  return [...unique.values()];
}

function familyOf(journeyId: string): SimTest10JourneyFamily | "SIM5" | null {
  const core = SIM_TEST_10_JOURNEYS.find((item) => item.journeyId === journeyId);
  return core?.r10Family ?? (journeyId.startsWith("sim-test-5-") ? "SIM5" : null);
}

test("SIM-TEST:10 measures Outcome/Learning on the certified conversation path", { timeout: 1_800_000 }, () => {
  assert.equal(SIM_TEST_10_BOUNDARY.createsOutcomeEngine, false);
  assert.equal(SIM_TEST_10_BOUNDARY.createsLearningAuthority, false);
  assert.equal(SIM_TEST_10_BOUNDARY.autoRepairs, false);
  const productionBefore = productionSnapshot();
  const population: readonly NexoraSimulationTestJourney[] = Object.freeze([
    ...SIM_TEST_10_JOURNEYS,
    ...SIM_TEST_5_JOURNEYS,
  ]);
  const reports = population.map((journey) =>
    runNexoraSimulationTestJourney({ journey, runId: `sim10-${journey.journeyId}` }),
  );

  const leakRows = reports.flatMap((report) => report.journeyObservations.filter((row) =>
    row.worldAdvancedUnpublished === true && SEALED.test(row.response),
  ).map((row) => ({ journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance, response: row.response })));

  const prematureClaims = reports.flatMap((report) => report.journeyObservations.flatMap((row) => {
    if (row.intent !== "ASK_OUTCOME") return [];
    const unpublished = row.worldAdvancedUnpublished === true;
    const established = ESTABLISHED.has(row.npsOutcomeStatus ?? "");
    const successWithoutUncertainty = SUCCESS_CLAIM.test(row.response) && !UNCERTAIN.test(row.response);
    if ((unpublished || row.npsOutcomeStatus === "TOO_EARLY" || row.npsOutcomeStatus === "UNKNOWN") && (established || successWithoutUncertainty)) {
      return [{ journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance, nps: row.npsOutcomeStatus, unpublished, response: row.response }];
    }
    return [];
  }));

  const causalOverreach = reports.flatMap((report) => report.journeyObservations.flatMap((row) => {
    if (row.intent !== "ASK_CAUSE") return [];
    if (CAUSAL_CERTAINTY.test(row.response) && !UNCERTAIN.test(row.response) && !/does not establish|doesn’t establish|does not prove/i.test(row.response)) {
      return [{ journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance, response: row.response }];
    }
    return [];
  }));

  const inventedDurable = reports.flatMap((report) => report.journeyObservations.filter((row) => row.npsLearningDurable === true)
    .map((row) => ({ journeyId: report.identity.journeyId, turn: row.turn })));

  const allRows = reports.flatMap((report) => report.journeyObservations);
  const allDecisions = new Set(allRows.flatMap((row) => (row.decisionLedger ?? []).map((item) => item.decisionId)));
  const allExecutions = new Set(allRows.flatMap((row) => (row.executionLedger ?? []).map((item) => item.executionId)));
  const establishedOutcomeRows = allRows.filter((row) => ESTABLISHED.has(row.npsOutcomeStatus ?? ""));
  const capturedMax = Math.max(0, ...allRows.map((row) => row.capturedOutcomeObservationCount ?? 0));
  const observedNumeric = allRows.filter((row) => row.npsObservedOutcome != null);

  const hReports = reports.filter((report) => familyOf(report.identity.journeyId) === "H_MULTIPLE_OUTCOME_CHAINS");
  const hMaxExec = Math.max(0, ...hReports.flatMap((report) => report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)));

  const eCore = reports.find((report) => report.identity.journeyId === "sim-test-10-e_delayed_outcome");
  const eAsks = (eCore?.journeyObservations ?? []).filter((row) => row.intent === "ASK_OUTCOME").map((row) => ({
    turn: row.turn, tick: row.tick, unpublished: row.worldAdvancedUnpublished === true,
    nps: row.npsOutcomeStatus, captured: row.capturedOutcomeObservationCount ?? 0, response: row.response,
  }));

  const materialIds = new Set([
    ...leakRows.map((item) => item.journeyId),
    ...prematureClaims.map((item) => item.journeyId),
    ...causalOverreach.map((item) => item.journeyId),
    "sim-test-10-e_delayed_outcome",
    "sim-test-10-h_multiple_outcome_chains",
    "sim-test-10-j_reassessment",
    "sim-test-10-l_loop_reentry",
  ]);
  const replays = [...materialIds].flatMap((journeyId) => {
    const source = reports.find((item) => item.identity.journeyId === journeyId);
    const journey = population.find((item) => item.journeyId === journeyId);
    if (!source || !journey) return [];
    const replay = runNexoraSimulationTestJourney({ journey, runId: `sim10-${journey.journeyId}` });
    return [{ journeyId, first: source.deterministicSignature, second: replay.deterministicSignature, matched: source.deterministicSignature === replay.deterministicSignature }];
  });

  const productionAfter = productionSnapshot();
  const records = reports.map((report) => {
    const findings = uniqueFindings(report);
    const last = report.journeyObservations.at(-1);
    return {
      journeyId: report.identity.journeyId,
      family: familyOf(report.identity.journeyId),
      profileId: report.identity.managerProfileId,
      scenarioId: report.identity.scenarioId,
      seed: population.find((item) => item.journeyId === report.identity.journeyId)?.behaviorSeed ?? null,
      signature: report.deterministicSignature,
      harnessStatus: report.harnessStatus,
      stopReason: report.stopReason,
      turns: report.turns,
      ticks: report.ticks,
      adaptiveTrace: report.adaptiveTrace,
      maxDecisions: Math.max(0, ...report.journeyObservations.map((row) => row.decisionLedger?.length ?? 0)),
      maxExecutions: Math.max(0, ...report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)),
      maxCaptured: Math.max(0, ...report.journeyObservations.map((row) => row.capturedOutcomeObservationCount ?? 0)),
      npsStatuses: [...new Set(report.journeyObservations.map((row) => row.npsOutcomeStatus).filter(Boolean))],
      learningStatuses: [...new Set(report.journeyObservations.map((row) => row.npsLearningStatus).filter(Boolean))],
      finalDecisionLedger: last?.decisionLedger ?? [],
      finalExecutionLedger: last?.executionLedger ?? [],
      findings: findings.map((finding) => ({
        classification: finding.classification,
        rawSeverity: finding.severity,
        owner: finding.likelyOwner,
        turn: finding.managerTurn,
      })),
    };
  });
  const rawFindings = records.flatMap((record) => record.findings.map((finding) => ({ journeyId: record.journeyId, family: record.family, ...finding })));
  const rawCounts = rawFindings.reduce((counts, finding) => {
    counts[finding.rawSeverity] += 1;
    return counts;
  }, { S0: 0, S1: 0, S2: 0, S3: 0 });
  const classificationCounts: Record<string, number> = {};
  for (const finding of rawFindings) classificationCounts[finding.classification] = (classificationCounts[finding.classification] ?? 0) + 1;

  const summary = {
    phase: "NPA-T SIM-TEST:10",
    certificationMode: "MEASUREMENT_ONLY",
    architecture: {
      outcomeOwner: SIM_TEST_10_BOUNDARY.outcomeOwner,
      learningOwner: SIM_TEST_10_BOUNDARY.learningOwner,
      npsWritesOutcome: false,
      cc5RegistersMvpOut1Capture: false,
      coreOut1AStoreObservedMax: capturedMax,
    },
    population: {
      journeys: reports.length,
      coreFamilies: SIM_TEST_10_CORE_JOURNEYS.length,
      journeyFamilies: [...new Set(SIM_TEST_10_JOURNEYS.map((item) => item.r10Family))],
      scenarios: [...new Set(records.map((item) => item.scenarioId))],
      profiles: [...new Set(records.map((item) => item.profileId))],
      seeds: [...new Set(records.map((item) => item.seed).filter((item) => item != null))],
      managerTurns: records.reduce((sum, item) => sum + item.turns, 0),
      nexoraTurns: records.reduce((sum, item) => sum + item.turns, 0),
      longSessions: population.filter((item) => item.conversationLength === "long").length,
      adaptiveEvents: records.reduce((sum, item) => sum + (item.adaptiveTrace?.eventTraces ?? 0), 0),
      operatorPublications: records.reduce((sum, item) => sum + (item.adaptiveTrace?.publications ?? 0), 0),
      unpublishedChanges: records.reduce((sum, item) => sum + (item.adaptiveTrace?.worldAdvances ?? 0), 0),
      unpublishedAsks: allRows.filter((row) => row.worldAdvancedUnpublished === true && (row.intent === "ASK_OUTCOME" || row.intent === "ASK_LEARNING")).length,
      postPublicationAsks: allRows.filter((row) => row.worldAdvancedUnpublished !== true && row.intent === "ASK_OUTCOME" && (row.csvVersions?.some((item) => item.tick > 0) ?? false)).length,
      harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    },
    multiplicity: {
      distinctDecisions: allDecisions.size,
      maxDecisions: Math.max(0, ...records.map((item) => item.maxDecisions)),
      distinctExecutions: allExecutions.size,
      maxExecutions: Math.max(0, ...records.map((item) => item.maxExecutions)),
      hMaxExecutions: hMaxExec,
      capturedOutcomeObservationsMax: capturedMax,
      npsEstablishedOutcomeRows: establishedOutcomeRows.length,
      npsObservedNumericRows: observedNumeric.length,
      canonicalOutcomeObjects: capturedMax,
      learningDurableRows: inventedDurable.length,
    },
    delayedFamilyE: eAsks,
    prematureOutcomeClaims: prematureClaims,
    causalOverreach,
    groundTruthLeakRows: leakRows,
    inventedDurableLearning: inventedDurable.length,
    rawFindings: { counts: rawCounts, classificationCounts },
    deterministicReplays: replays,
    productionIntegrity: {
      before: productionBefore,
      after: productionAfter,
      productionChangesDuringSimTest10: productionBefore.digest === productionAfter.digest ? 0 : 1,
    },
    records,
  };

  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(new URL("population-run.json", ARTIFACT_DIRECTORY), JSON.stringify(summary, null, 2));

  assert.equal(SIM_TEST_10_CORE_JOURNEYS.length, 14);
  assert.equal(new Set(SIM_TEST_10_JOURNEYS.map((item) => item.r10Family)).size, 14);
  assert.equal(summary.population.harnessFailures, 0);
  assert.equal(productionBefore.digest, productionAfter.digest);
  assert.equal(replays.every((item) => item.matched), true);
  assert.equal(leakRows.length, 0);
  assert.equal(inventedDurable.length, 0);
  assert.ok((eAsks.length ?? 0) >= 3);
  assert.ok(hMaxExec >= 1);
});
