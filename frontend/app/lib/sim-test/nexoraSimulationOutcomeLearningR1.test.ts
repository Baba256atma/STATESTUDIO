/** NPA-T SIM-TEST:10-R1 — Outcome & management learning recertification. Measurement only. */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { listCapturedObservations } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { NPS_OUTCOME_LEARNING_BOUNDARY } from "../nexora-problem-solving/npsOutcomeLearning.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
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
const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/SIM-TEST-10-R1/", import.meta.url);
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
    "nexoraPostDecisionObservationCapture.ts", "csvRealDataImportStore.ts",
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

function snapshotCaptures() {
  return listCapturedObservations().map((item) => Object.freeze({
    observationId: item.observationId,
    executionId: item.executionId,
    decisionId: item.decisionId,
    subjectId: item.subjectId,
    metricId: item.metricId,
    sourceId: item.sourceId,
    datasetId: item.datasetId,
    observedAt: item.observedAt,
    capturedAt: item.capturedAt,
    eligibleAsActualOutcome: item.eligibleAsActualOutcome,
    isOutcome: item.isOutcome,
    rejections: item.rejections,
    duplicateOf: item.duplicateOf,
  }));
}

function speak(previous: RmsCc5Turn | null, utterance: string, seed: string): RmsCc5Turn {
  return speakRmsManagerThroughCc5({ utterance, previous, messageIdSeed: `sim10-r1-${seed}` });
}

test("SIM-TEST:10-R1 recertifies Outcome/Learning after OUT-LIVE:1", { timeout: 1_800_000 }, () => {
  assert.equal(SIM_TEST_10_BOUNDARY.createsOutcomeEngine, false);
  assert.equal(SIM_TEST_10_BOUNDARY.createsLearningAuthority, false);
  assert.equal(SIM_TEST_10_BOUNDARY.autoRepairs, false);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
  const productionBefore = productionSnapshot();
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(new URL("SOURCE-INTEGRITY-BEFORE.md", ARTIFACT_DIRECTORY), `# R1 production digest\n\n\`${productionBefore.digest}\`\nfiles: ${productionBefore.fileCount}\n`);

  const population: readonly NexoraSimulationTestJourney[] = Object.freeze([
    ...SIM_TEST_10_JOURNEYS,
    ...SIM_TEST_5_JOURNEYS,
  ]);
  const reports = population.map((journey) => {
    const report = runNexoraSimulationTestJourney({ journey, runId: `sim10r1-${journey.journeyId}` });
    const captures = snapshotCaptures();
    return Object.freeze({ report, captures });
  });

  const allReports = reports.map((item) => item.report);
  const allRows = allReports.flatMap((report) => report.journeyObservations);
  const leakRows = allRows.filter((row) => row.worldAdvancedUnpublished === true && SEALED.test(row.response))
    .map((row) => ({ journeyId: reports.find((item) => item.report.journeyObservations.includes(row))?.report.identity.journeyId, turn: row.turn, utterance: row.utterance, response: row.response }));

  const prematureClaims = allRows.flatMap((row) => {
    if (row.intent !== "ASK_OUTCOME") return [];
    const unpublished = row.worldAdvancedUnpublished === true;
    const established = ESTABLISHED.has(row.npsOutcomeStatus ?? "");
    const successWithoutUncertainty = SUCCESS_CLAIM.test(row.response) && !UNCERTAIN.test(row.response);
    if ((unpublished || row.npsOutcomeStatus === "TOO_EARLY" || row.npsOutcomeStatus === "UNKNOWN") && (established || successWithoutUncertainty)) {
      return [{ turn: row.turn, utterance: row.utterance, nps: row.npsOutcomeStatus, unpublished, response: row.response }];
    }
    return [];
  });

  const causalOverreach = allRows.flatMap((row) => {
    if (row.intent !== "ASK_CAUSE") return [];
    if (CAUSAL_CERTAINTY.test(row.response) && !UNCERTAIN.test(row.response) && !/does not establish|doesn’t establish|does not prove/i.test(row.response)) {
      return [{ turn: row.turn, utterance: row.utterance, response: row.response }];
    }
    return [];
  });

  const inventedDurable = allRows.filter((row) => row.npsLearningDurable === true);
  const allDecisions = new Set(allRows.flatMap((row) => (row.decisionLedger ?? []).map((item) => item.decisionId)));
  const allExecutions = new Set(allRows.flatMap((row) => (row.executionLedger ?? []).map((item) => item.executionId)));
  const allObservationIds = new Set(reports.flatMap((item) => item.captures.map((capture) => capture.observationId)));
  const establishedOutcomeRows = allRows.filter((row) => ESTABLISHED.has(row.npsOutcomeStatus ?? ""));
  const capturedMax = Math.max(0, ...allRows.map((row) => row.capturedOutcomeObservationCount ?? 0), ...reports.map((item) => item.captures.length));
  const observedNumeric = allRows.filter((row) => row.npsObservedOutcome != null);
  const eligibleCaptures = reports.flatMap((item) => item.captures.filter((capture) => capture.eligibleAsActualOutcome));
  const outcomeFlagged = reports.flatMap((item) => item.captures.filter((capture) => capture.isOutcome === true));
  const npsWrites = allRows.filter((row) => row.npsOutcomeStatus && NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome === true);

  const hReports = allReports.filter((report) => familyOf(report.identity.journeyId) === "H_MULTIPLE_OUTCOME_CHAINS");
  const hMaxExec = Math.max(0, ...hReports.flatMap((report) => report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)));
  const hCaptures = reports.filter((item) => familyOf(item.report.identity.journeyId) === "H_MULTIPLE_OUTCOME_CHAINS");
  const hExecutionBindings = hCaptures.flatMap((item) => item.captures.map((capture) => capture.executionId));

  const eCore = allReports.find((report) => report.identity.journeyId === "sim-test-10-e_delayed_outcome");
  const eAsks = (eCore?.journeyObservations ?? []).filter((row) => row.intent === "ASK_OUTCOME").map((row) => ({
    turn: row.turn, tick: row.tick, unpublished: row.worldAdvancedUnpublished === true,
    nps: row.npsOutcomeStatus, captured: row.capturedOutcomeObservationCount ?? 0, expected: row.npsExpectedOutcome ?? null,
    observed: row.npsObservedOutcome ?? null, response: row.response,
  }));

  const jCore = allReports.find((report) => report.identity.journeyId === "sim-test-10-j_reassessment");
  const jReassess = (jCore?.journeyObservations ?? []).filter((row) => row.intent === "REASSESS" || row.utterance === "Is this still a problem?").map((row) => ({
    turn: row.turn, utterance: row.utterance, subject: row.canonicalSubjectId, captured: row.capturedOutcomeObservationCount ?? 0,
    nps: row.npsOutcomeStatus, learning: row.npsLearningStatus, inventedTitle: /is this still a/i.test(row.response), response: row.response,
  }));

  const lCore = allReports.find((report) => report.identity.journeyId === "sim-test-10-l_loop_reentry");
  const lRows = (lCore?.journeyObservations ?? []).map((row) => ({
    turn: row.turn, utterance: row.utterance, intent: row.intent, decisions: row.decisionLedger?.length ?? 0,
    executions: row.executionLedger?.length ?? 0, captured: row.capturedOutcomeObservationCount ?? 0,
    nps: row.npsOutcomeStatus, learning: row.npsLearningStatus,
  }));

  const chains = reports.map((item) => {
    const last = item.report.journeyObservations.at(-1);
    const executions = last?.executionLedger ?? [];
    return Object.freeze({
      journeyId: item.report.identity.journeyId,
      family: familyOf(item.report.identity.journeyId),
      decisions: last?.decisionLedger ?? [],
      executions,
      observations: item.captures,
      npsOutcomeStatus: last?.npsOutcomeStatus ?? null,
      npsExpected: last?.npsExpectedOutcome ?? null,
      npsObserved: last?.npsObservedOutcome ?? null,
      npsLearningStatus: last?.npsLearningStatus ?? null,
      npsLearningDurable: last?.npsLearningDurable ?? false,
      observationExecutionIds: [...new Set(item.captures.map((capture) => capture.executionId).filter(Boolean))],
    });
  });

  const wrongExecutionBindings = chains.flatMap((chain) => {
    const allowed = new Set(chain.executions.map((item) => item.executionId));
    if (allowed.size === 0) return [];
    return chain.observations.filter((observation) => observation.executionId && !allowed.has(observation.executionId)).map((observation) => ({
      journeyId: chain.journeyId, observationId: observation.observationId, executionId: observation.executionId,
    }));
  });

  const materialIds = new Set([
    ...allReports.filter((report) => leakRows.some((row) => row.journeyId === report.identity.journeyId)).map((report) => report.identity.journeyId),
    "sim-test-10-e_delayed_outcome",
    "sim-test-10-h_multiple_outcome_chains",
    "sim-test-10-j_reassessment",
    "sim-test-10-l_loop_reentry",
    "sim-test-10-a_expected_positive",
    "sim-test-10-g_competing_executions",
  ]);
  const replays = [...materialIds].flatMap((journeyId) => {
    const source = allReports.find((item) => item.identity.journeyId === journeyId);
    const journey = population.find((item) => item.journeyId === journeyId);
    if (!source || !journey) return [];
    const replay = runNexoraSimulationTestJourney({ journey, runId: `sim10r1-${journey.journeyId}` });
    return [{ journeyId, first: source.deterministicSignature, second: replay.deterministicSignature, matched: source.deterministicSignature === replay.deterministicSignature }];
  });

  const fix1 = (() => {
    const journey: NexoraSimulationTestJourney = Object.freeze({
      journeyId: "sim-test-10-r1-fix1-blocker",
      version: "1.0",
      title: "FIX1 blocker R1",
      scenarioId: "manufacturing-capacity-pressure",
      scenarioVersion: "1.0",
      managerProfileId: "DECISION_ORIENTED_MANAGER",
      behaviorSeed: 11,
      conversationLength: "medium",
      startingMode: "WATCH",
      mode: "INGESTION",
      boundedDurationTicks: 29,
      turnBudget: 8,
      maxRepeatedClarificationAttempts: 3,
      maxUnresolvedLoops: 3,
      disturbancePolicy: "CERTIFIED_SCENARIO_SCHEDULE",
      requiredCheckpoints: Object.freeze(["DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED", "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE", "DECISION_STATE", "EXECUTION_STATE"]),
      targetSurfaces: Object.freeze(["CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "CC10", "CC11"]),
      stopConditions: Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"]),
      steps: Object.freeze([
        { kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 },
        { kind: "MANAGER_TURN" as const, utterance: "Status.", managementIntent: "ORIENT" },
        { kind: "MANAGER_TURN" as const, utterance: "Capacity. Details.", managementIntent: "FOCUS_PROBLEM", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Options.", managementIntent: "EXPLORE_OPTIONS", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Go with B.", managementIntent: "COMMIT_DECISION", intendedSubject: "Capacity" },
        { kind: "MANAGER_TURN" as const, utterance: "Delivery. Details.", managementIntent: "FOCUS_PROBLEM", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Options.", managementIntent: "EXPLORE_OPTIONS", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Go with A.", managementIntent: "COMMIT_DECISION", intendedSubject: "Delivery" },
        { kind: "MANAGER_TURN" as const, utterance: "Start it.", managementIntent: "REQUEST_EXECUTION", intendedSubject: "Delivery" },
      ]),
    });
    const report = runNexoraSimulationTestJourney({ journey, runId: "sim10-r1-fix1" });
    const replay = runNexoraSimulationTestJourney({ journey, runId: "sim10-r1-fix1" });
    const capacityDecisionId = "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1";
    const final = report.journeyObservations.at(-1)!;
    return Object.freeze({
      signature: report.deterministicSignature,
      replayMatched: report.deterministicSignature === replay.deterministicSignature,
      capacityDecisionPresent: (final.decisionLedger ?? []).some((item) => item.decisionId === capacityDecisionId),
      wrongThreadCapacityExecutions: (final.executionLedger ?? []).filter((item) => item.decisionId === capacityDecisionId).length,
      executionCount: final.executionLedger?.length ?? 0,
      response: final.response,
    });
  })();

  const fix2 = (() => {
    let turn = speak(null, "Capacity. Details.", "fix2-1");
    turn = speak(turn, "Options.", "fix2-2");
    const capacityNames = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map((id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id);
    turn = speak(turn, "Delivery. Details.", "fix2-3");
    turn = speak(turn, "Options.", "fix2-4");
    const deliveryNames = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map((id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id);
    turn = speak(turn, "Revenue. Details.", "fix2-5");
    turn = speak(turn, "Options.", "fix2-6");
    const revenueNames = (turn.nextScenarioSession?.candidateScenarioIds ?? []).map((id) => turn.nextScenarioSession?.scenariosById[id]?.name ?? id);
    const staleCapacityUnder = (label: string, names: readonly string[]) =>
      !/capacity/i.test(label) && names.some((name) => /investigate capacity|no action on capacity/i.test(name));
    return Object.freeze({
      capacityNames,
      deliveryNames,
      revenueNames,
      staleCapacityUnderDelivery: staleCapacityUnder("Delivery", deliveryNames),
      staleCapacityUnderRevenue: staleCapacityUnder("Revenue", revenueNames),
    });
  })();

  const productionAfter = productionSnapshot();
  const records = reports.map((item) => {
    const report = item.report;
    const findings = uniqueFindings(report);
    const last = report.journeyObservations.at(-1);
    return {
      journeyId: report.identity.journeyId,
      family: familyOf(report.identity.journeyId),
      profileId: report.identity.managerProfileId,
      scenarioId: report.identity.scenarioId,
      seed: population.find((journey) => journey.journeyId === report.identity.journeyId)?.behaviorSeed ?? null,
      signature: report.deterministicSignature,
      harnessStatus: report.harnessStatus,
      stopReason: report.stopReason,
      turns: report.turns,
      ticks: report.ticks,
      adaptiveTrace: report.adaptiveTrace,
      maxDecisions: Math.max(0, ...report.journeyObservations.map((row) => row.decisionLedger?.length ?? 0)),
      maxExecutions: Math.max(0, ...report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)),
      maxCaptured: Math.max(0, ...report.journeyObservations.map((row) => row.capturedOutcomeObservationCount ?? 0), item.captures.length),
      captureSnapshot: item.captures,
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
    phase: "NPA-T SIM-TEST:10-R1",
    certificationMode: "MEASUREMENT_ONLY",
    baseline: "OUT-LIVE:1 CERTIFIED",
    architecture: {
      outcomeOwner: SIM_TEST_10_BOUNDARY.outcomeOwner,
      learningOwner: SIM_TEST_10_BOUNDARY.learningOwner,
      npsWritesOutcome: NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome,
      cc5RegistersMvpOut1Capture: true,
      coreOut1AStoreObservedMax: capturedMax,
      eligibleAsActualOutcomeCount: eligibleCaptures.length,
      captureIsOutcomeCount: outcomeFlagged.length,
    },
    population: {
      journeys: allReports.length,
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
      postPublicationAsks: allRows.filter((row) => row.worldAdvancedUnpublished !== true && row.intent === "ASK_OUTCOME" && (row.csvVersions?.some((csv) => csv.tick > 0) ?? false)).length,
      harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    },
    multiplicity: {
      distinctDecisions: allDecisions.size,
      maxDecisions: Math.max(0, ...records.map((item) => item.maxDecisions)),
      distinctExecutions: allExecutions.size,
      maxExecutions: Math.max(0, ...records.map((item) => item.maxExecutions)),
      hMaxExecutions: hMaxExec,
      distinctObservations: allObservationIds.size,
      capturedOutcomeObservationsMax: capturedMax,
      npsEstablishedOutcomeRows: establishedOutcomeRows.length,
      npsObservedNumericRows: observedNumeric.length,
      eligibleEvaluations: eligibleCaptures.length,
      captureIsOutcomeCount: outcomeFlagged.length,
      learningDurableRows: inventedDurable.length,
    },
    delayedFamilyE: eAsks,
    reassessmentFamilyJ: jReassess,
    loopFamilyL: lRows,
    chains,
    hExecutionBindings: [...new Set(hExecutionBindings)],
    wrongExecutionBindings,
    prematureOutcomeClaims: prematureClaims,
    causalOverreach,
    groundTruthLeakRows: leakRows,
    inventedDurableLearning: inventedDurable.length,
    npsWriterHits: npsWrites.length,
    fix1Replay: fix1,
    fix2Replay: fix2,
    rawFindings: { counts: rawCounts, classificationCounts },
    deterministicReplays: replays,
    productionIntegrity: {
      before: productionBefore,
      after: productionAfter,
      productionChangesDuringR1: productionBefore.digest === productionAfter.digest ? 0 : 1,
    },
    records,
  };

  writeFileSync(new URL("population-run.json", ARTIFACT_DIRECTORY), JSON.stringify(summary, null, 2));
  writeFileSync(
    new URL("SOURCE-INTEGRITY-AFTER.md", ARTIFACT_DIRECTORY),
    `# R1 production digest after\n\n\`${productionAfter.digest}\`\nfiles: ${productionAfter.fileCount}\nchanges: ${productionBefore.digest === productionAfter.digest ? 0 : 1}\n`,
  );

  assert.equal(SIM_TEST_10_CORE_JOURNEYS.length, 14);
  assert.equal(new Set(SIM_TEST_10_JOURNEYS.map((item) => item.r10Family)).size, 14);
  assert.equal(summary.population.harnessFailures, 0);
  assert.equal(productionBefore.digest, productionAfter.digest);
  assert.equal(replays.every((item) => item.matched), true);
  assert.equal(leakRows.length, 0);
  assert.equal(inventedDurable.length, 0);
  assert.equal(NPS_OUTCOME_LEARNING_BOUNDARY.writesOutcome, false);
  assert.equal(fix1.wrongThreadCapacityExecutions, 0);
  assert.equal(fix2.staleCapacityUnderDelivery, false);
  assert.equal(fix2.staleCapacityUnderRevenue, false);
  assert.ok((eAsks.length ?? 0) >= 3);
});
