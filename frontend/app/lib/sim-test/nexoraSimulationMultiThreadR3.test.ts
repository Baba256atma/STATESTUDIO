/** NPA-T SIM-TEST:9-R3 — final full multi-thread recertification. Measurement only. */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { SIM_TEST_8_JOURNEYS } from "./nexoraSimulationAdaptiveJourneys.ts";
import { SIM_TEST_7_JOURNEYS } from "./nexoraSimulationManagerPopulation.ts";
import { SIM_TEST_9_R2_JOURNEYS } from "./nexoraSimulationMultiThreadR2Journeys.ts";
import type {
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
  NexoraSimulationTestRunReport,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const FRONTEND_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/SIM-TEST-9-R3/", import.meta.url);
const EXECUTION_COMMAND = /^(?:start|execute|do it|proceed|go ahead|run it|put .* into action)/i;
const ORDINAL = /\b(?:first|second|third|previous|last|other|earlier)\b/i;
const REASSESS = /still|reassess|has this changed/i;
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;
const FIX2_FAMILIES = Object.freeze([
  "C_SCENARIO_SETS", "D_MULTI_DECISION", "E_DECISION_EXECUTION_CONCURRENCY",
  "F_MULTI_OUTCOME", "J_ORDINAL_STRESS", "K_LONG_SESSION",
]);

const REQUIRED = Object.freeze([
  "DATA_VISIBLE", "MANAGER_TURN_COMPLETED", "NEXORA_TURN_COMPLETED", "SUBJECT_SELECTED",
  "MLEVEL_STATE", "STAGE_STATE", "PROBLEM_AVAILABLE", "SCENARIO_AVAILABLE",
  "DECISION_STATE", "EXECUTION_STATE",
] as const);
const TARGETS = Object.freeze([
  "CC5", "REFERENT", "NMI", "MLEVEL", "STAGE", "NPS", "VAI", "SCENARIO",
  "CC10", "CC11", "DATA_REALITY", "OUTCOME", "LEARNING",
]);

function step(
  utterance: string,
  managementIntent: NexoraSimulationManagerJourneyIntent,
  intendedSubject?: string,
): NexoraSimulationTestJourneyStep {
  return Object.freeze({ kind: "MANAGER_TURN" as const, utterance, managementIntent, ...(intendedSubject ? { intendedSubject } : {}) });
}

const BLOCKER: NexoraSimulationTestJourney = Object.freeze({
  journeyId: "sim-test-9-fix1-original-blocker",
  version: "1.0",
  title: "SIM-TEST:9 FIX1 blocker under FIX2 baseline",
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
  requiredCheckpoints: REQUIRED,
  targetSurfaces: TARGETS,
  stopConditions: Object.freeze(["TURN_BUDGET", "TICK_BUDGET", "S0", "RUNTIME_ERROR", "JOURNEY_COMPLETE"]),
  steps: Object.freeze([
    Object.freeze({ kind: "PUBLISH_OBSERVABLE_DATA" as const, atTick: 0 }),
    step("Status.", "ORIENT"), step("Capacity. Details.", "FOCUS_PROBLEM", "Capacity"),
    step("Options.", "EXPLORE_OPTIONS", "Capacity"), step("Go with B.", "COMMIT_DECISION", "Capacity"),
    step("Delivery. Details.", "FOCUS_PROBLEM", "Delivery"), step("Options.", "EXPLORE_OPTIONS", "Delivery"),
    step("Go with A.", "COMMIT_DECISION", "Delivery"), step("Start it.", "REQUEST_EXECUTION", "Delivery"),
  ]),
});

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
    "conversationalIntent.ts", "conversationalExperienceOrchestrator.ts", "executiveExecutionFollowUp.ts",
    "executiveDecisionRuntimeAdapter.ts", "executiveExecutionRuntimeAdapter.ts", "executiveScenarioResolver.ts",
    "executiveScenarioDefinition.ts", "executiveDecisionCommitmentResolver.ts",
    "nmiAdvisorContract.ts", "nexoraMVPObjectInteraction.ts", "nexoraNxa1ExecutiveAdvisorContract.ts",
    "npsExecutionMonitoring.ts", "rmsManagerCc5Adapter.ts", "rmsDataReality.ts",
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

function labelFromCanonical(id: string | null): string | null {
  if (!id) return null;
  if (/capacity/i.test(id)) return "Capacity";
  if (/delivery|schedule/i.test(id)) return "Delivery";
  if (/revenue|margin/i.test(id)) return "Revenue";
  if (/inventory/i.test(id)) return "Inventory";
  if (/resource|staff/i.test(id)) return "Resources";
  if (/risk/i.test(id)) return "Risk";
  return null;
}

function scenarioSourceOf(item: { sourceSubjectId?: string | null; title: string; scenarioId: string; subjectIds: readonly string[] }): string | null {
  if (item.sourceSubjectId) return item.sourceSubjectId;
  const fromId = item.scenarioId.match(/obj-(?:capacity|delivery|revenue|inventory|risk)/i)?.[0] ?? null;
  if (fromId) return fromId.toLowerCase().startsWith("obj-") ? `obj-${fromId.replace(/^obj-/i, "").toLowerCase()}` : fromId;
  const title = item.title.toLowerCase();
  if (/delivery/.test(title)) return "obj-delivery";
  if (/revenue|margin/.test(title)) return "obj-revenue";
  if (/inventory/.test(title)) return "obj-inventory";
  if (/capacity/.test(title)) return "obj-capacity";
  return item.subjectIds.find((id) => id.startsWith("obj-") && !/budget|cost/.test(id)) ?? null;
}

function scenarioConfusion(report: NexoraSimulationTestRunReport) {
  return report.journeyObservations.flatMap((row) => {
    if (row.intent !== "EXPLORE_OPTIONS" || !row.activeScenarioId || !row.canonicalSubjectId) return [];
    const scenario = row.scenarioLedger?.find((item) => item.scenarioId === row.activeScenarioId) ?? null;
    if (!scenario) return [];
    const source = scenarioSourceOf(scenario);
    const expectedLabel = row.intendedSubject ?? labelFromCanonical(row.canonicalSubjectId);
    if (expectedLabel && scenario.title.toLowerCase().includes(expectedLabel.toLowerCase())) return [];
    const expectedId = expectedLabel === "Capacity" ? "obj-capacity"
      : expectedLabel === "Delivery" ? "obj-delivery"
        : expectedLabel === "Revenue" ? "obj-revenue"
          : expectedLabel === "Inventory" ? "obj-inventory" : null;
    if (expectedId && source === expectedId) return [];
    if (source && source === row.canonicalSubjectId) return [];
    if (!expectedLabel) return [];
    return [{
      journeyId: report.identity.journeyId,
      profileId: report.identity.managerProfileId,
      scenarioFamily: report.identity.scenarioId,
      turn: row.turn,
      utterance: row.utterance,
      expectedContextId: row.canonicalSubjectId,
      expectedContextLabel: expectedLabel,
      actualScenarioId: row.activeScenarioId,
      actualScenarioTitle: scenario.title,
      sourceSubjectId: source,
      canonicalSubjectId: row.canonicalSubjectId,
      response: row.response,
    }];
  });
}

function executionCommands(report: NexoraSimulationTestRunReport) {
  return report.journeyObservations.flatMap((row, index) => {
    if (!EXECUTION_COMMAND.test(row.utterance.trim())) return [];
    const before = report.journeyObservations[index - 1] ?? null;
    const beforeExecutions = new Set((before?.executionLedger ?? []).map((item) => item.executionId));
    const created = (row.executionLedger ?? []).filter((item) => !beforeExecutions.has(item.executionId));
    const context = row.canonicalSubjectId ?? before?.canonicalSubjectId ?? null;
    const wrong = created.filter((execution) => {
      if (!context) return false;
      if (/delivery/i.test(context) && /do-nothing:do-nothing/i.test(execution.decisionId)) return true;
      if (/revenue/i.test(context) && /do-nothing:do-nothing/i.test(execution.decisionId)) return true;
      return false;
    });
    return [{
      journeyId: report.identity.journeyId,
      profileId: report.identity.managerProfileId,
      turn: row.turn,
      utterance: row.utterance,
      explicit: !/^(?:start it|execute it|do it|proceed|go ahead|run it|start that)[.!?]*$/i.test(row.utterance.trim()),
      contextAfter: row.canonicalSubjectId,
      approvedDecisions: (row.decisionLedger ?? []).filter((item) => item.status === "Approved"),
      createdExecutions: created,
      wrongExecutions: wrong,
      clarification: row.clarificationRequired,
      response: row.response,
    }];
  });
}

function compactRecord(report: NexoraSimulationTestRunReport, population: "A-N" | "SIM7" | "SIM8") {
  const findings = uniqueFindings(report);
  const rows = report.journeyObservations;
  const problemIds = new Set(rows.map((row) => row.canonicalSubjectId).filter((id): id is string => Boolean(id) && id.startsWith("obj-") && !/risk/.test(id ?? "")));
  return {
    population,
    journeyId: report.identity.journeyId,
    family: population === "A-N"
      ? (SIM_TEST_9_R2_JOURNEYS.find((item) => item.journeyId === report.identity.journeyId)?.r2Family ?? null)
      : population === "SIM8"
        ? (SIM_TEST_8_JOURNEYS.find((item) => item.journeyId === report.identity.journeyId)?.adaptiveFamily ?? null)
        : "MANAGER_POPULATION",
    profileId: report.identity.managerProfileId,
    scenarioId: report.identity.scenarioId,
    seed: [...SIM_TEST_9_R2_JOURNEYS, ...SIM_TEST_7_JOURNEYS, ...SIM_TEST_8_JOURNEYS].find((item) => item.journeyId === report.identity.journeyId)?.behaviorSeed ?? null,
    length: [...SIM_TEST_9_R2_JOURNEYS, ...SIM_TEST_7_JOURNEYS, ...SIM_TEST_8_JOURNEYS].find((item) => item.journeyId === report.identity.journeyId)?.conversationLength ?? null,
    signature: report.deterministicSignature,
    harnessStatus: report.harnessStatus,
    stopReason: report.stopReason,
    turns: report.turns,
    ticks: report.ticks,
    adaptiveTrace: report.adaptiveTrace,
    finalDecisionLedger: rows.at(-1)?.decisionLedger ?? [],
    finalExecutionLedger: rows.at(-1)?.executionLedger ?? [],
    distinctProblems: problemIds.size,
    maxScenarios: Math.max(0, ...rows.map((row) => row.scenarioLedger?.length ?? 0)),
    maxScenarioSets: Math.max(0, ...rows.map((row) => new Set((row.scenarioLedger ?? []).map((item) => scenarioSourceOf(item) ?? "unowned")).size)),
    maxDecisions: Math.max(0, ...rows.map((row) => row.decisionLedger?.length ?? 0)),
    maxExecutions: Math.max(0, ...rows.map((row) => row.executionLedger?.length ?? 0)),
    findings: findings.map((finding) => {
      const observation = rows.find((item) => item.turn === finding.managerTurn);
      return {
        classification: finding.classification,
        rawSeverity: finding.severity,
        owner: finding.likelyOwner,
        turn: finding.managerTurn,
        tick: finding.tick,
        utterance: observation?.utterance ?? null,
        response: observation?.response ?? finding.observedBehavior,
        canonicalSubjectId: observation?.canonicalSubjectId ?? finding.activeCanonicalSubjectId,
        l1: observation?.mlevelL1 ?? finding.mlevelActiveId,
        l2: observation?.mlevelL2 ?? null,
        l3: observation?.mlevelL3 ?? null,
        stage: observation?.stageActiveSubjectId ?? finding.stageActiveSubjectId,
        advisor: observation?.advisorReferentId ?? null,
        decisionLedger: observation?.decisionLedger ?? [],
        executionLedger: observation?.executionLedger ?? [],
      };
    }),
    observations: population === "A-N" ? rows : undefined,
  };
}

test("SIM-TEST:9-R3 runs the complete isolated population from turn 1", { timeout: 1_800_000 }, () => {
  const productionBefore = productionSnapshot();
  const reports: { report: NexoraSimulationTestRunReport; population: "A-N" | "SIM7" | "SIM8" }[] = [];
  for (const [population, journeys] of [
    ["A-N", SIM_TEST_9_R2_JOURNEYS],
    ["SIM7", SIM_TEST_7_JOURNEYS],
    ["SIM8", SIM_TEST_8_JOURNEYS],
  ] as const) {
    for (const journey of journeys) {
      reports.push({
        population,
        report: runNexoraSimulationTestJourney({ journey, runId: `sim9-r3-${journey.journeyId}` }),
      });
    }
  }

  const scenarioSetFindings = reports.flatMap(({ report }) => scenarioConfusion(report));
  const executionRows = reports.flatMap(({ report }) => executionCommands(report));
  const leakRows = reports.flatMap(({ report }) => report.journeyObservations.filter((row) =>
    row.worldAdvancedUnpublished === true && SEALED.test(row.response),
  ).map((row) => ({ journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance, response: row.response })));
  const advisorDivergences = reports.flatMap(({ report }) => report.journeyObservations.filter((row) =>
    row.canonicalSubjectId && row.advisorReferentId && row.canonicalSubjectId !== row.advisorReferentId,
  ).map((row) => ({
    journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance,
    canonicalSubjectId: row.canonicalSubjectId, l1: row.mlevelL1, stage: row.stageActiveSubjectId,
    advisorReferentId: row.advisorReferentId, advisorReferentName: row.advisorReferentName, response: row.response,
  })));
  const knownAdvisorDebt = advisorDivergences.filter((row) =>
    /capacity/i.test(row.canonicalSubjectId ?? "") && /delivery/i.test(row.advisorReferentId ?? ""),
  );
  const reassessmentRows = reports.flatMap(({ report }) => report.journeyObservations.filter((row) =>
    row.intent === "REASSESS" || REASSESS.test(row.utterance),
  ).map((row) => ({
    journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance,
    canonicalSubjectId: row.canonicalSubjectId,
    inventedTitle: /Is This Still A/i.test(`${row.response} ${row.advisorReferentName ?? ""}`),
    decisionsCreatedThisTurn: false,
    response: row.response,
  })));
  const bJourney = reports.find(({ report }) => report.identity.journeyId === "sim-test-9-r2-b_multi_risk");
  const bT5 = bJourney?.report.journeyObservations.find((row) => row.utterance === "Go back to the first risk.") ?? null;

  const fix2Journeys = SIM_TEST_9_R2_JOURNEYS.filter((item) =>
    (FIX2_FAMILIES as readonly string[]).includes(item.r2Family),
  );
  const materialJourneyIds = new Set([
    ...scenarioSetFindings.map((item) => item.journeyId),
    ...leakRows.map((item) => item.journeyId),
    ...fix2Journeys.map((item) => item.journeyId),
    ...(bT5 ? ["sim-test-9-r2-b_multi_risk"] : []),
  ]);
  const allJourneys = [...SIM_TEST_9_R2_JOURNEYS, ...SIM_TEST_7_JOURNEYS, ...SIM_TEST_8_JOURNEYS];
  const replays = [...materialJourneyIds].map((journeyId) => {
    const source = reports.find((item) => item.report.identity.journeyId === journeyId)!;
    const journey = allJourneys.find((item) => item.journeyId === journeyId)!;
    const replay = runNexoraSimulationTestJourney({ journey, runId: `sim9-r3-${journey.journeyId}` });
    return { journeyId, first: source.report.deterministicSignature, second: replay.deterministicSignature, matched: source.report.deterministicSignature === replay.deterministicSignature };
  });

  const blockerFirst = runNexoraSimulationTestJourney({ journey: BLOCKER, runId: "r3-fix1" });
  const blockerSecond = runNexoraSimulationTestJourney({ journey: BLOCKER, runId: "r3-fix1" });
  const blockerFinal = blockerFirst.journeyObservations.at(-1)!;
  const capacityExecution = (blockerFinal.executionLedger ?? []).filter((item) =>
    item.decisionId === "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1",
  );
  const productionAfter = productionSnapshot();
  const records = reports.map(({ report, population }) => compactRecord(report, population));
  const rawFindings = records.flatMap((record) => record.findings.map((finding) => ({ journeyId: record.journeyId, family: record.family, profileId: record.profileId, scenarioId: record.scenarioId, ...finding })));
  const rawCounts = rawFindings.reduce((counts, finding) => {
    counts[finding.rawSeverity] += 1;
    return counts;
  }, { S0: 0, S1: 0, S2: 0, S3: 0 });
  const classificationCounts: Record<string, number> = {};
  for (const finding of rawFindings) classificationCounts[finding.classification] = (classificationCounts[finding.classification] ?? 0) + 1;

  const allRows = reports.flatMap(({ report }) => report.journeyObservations);
  const uniqueCanonical = new Set(allRows.map((row) => row.canonicalSubjectId).filter(Boolean));
  const allDecisions = new Set(allRows.flatMap((row) => (row.decisionLedger ?? []).map((item) => item.decisionId)));
  const allExecutions = new Set(allRows.flatMap((row) => (row.executionLedger ?? []).map((item) => item.executionId)));
  const allScenarioSources = new Set(allRows.flatMap((row) => (row.scenarioLedger ?? []).map((item) => scenarioSourceOf(item)).filter(Boolean)));
  const an = records.filter((item) => item.population === "A-N");
  const npsS3 = rawFindings.filter((item) => item.classification === "JOURNEY/SUBJECT_LOSS" && item.rawSeverity === "S3");
  const invented = reassessmentRows.filter((row) => row.inventedTitle);
  const wrongExec = executionRows.flatMap((row) => row.wrongExecutions);

  const summary = {
    phase: "NPA-T SIM-TEST:9-R3",
    certificationMode: "MEASUREMENT_ONLY",
    population: {
      journeys: reports.length,
      journeyFamilies: [...new Set(SIM_TEST_9_R2_JOURNEYS.map((item) => item.r2Family))],
      scenarios: [...new Set(records.map((item) => item.scenarioId))],
      profiles: [...new Set(records.map((item) => item.profileId))],
      seeds: [...new Set(records.map((item) => item.seed))],
      managerTurns: records.reduce((sum, item) => sum + item.turns, 0),
      nexoraTurns: records.reduce((sum, item) => sum + item.turns, 0),
      longSessions: records.filter((item) => item.length === "long").length,
      adaptiveEvents: records.reduce((sum, item) => sum + (item.adaptiveTrace?.eventTraces ?? 0), 0),
      operatorPublications: records.reduce((sum, item) => sum + (item.adaptiveTrace?.publications ?? 0), 0),
      unpublishedChanges: records.reduce((sum, item) => sum + (item.adaptiveTrace?.worldAdvances ?? 0), 0),
      unpublishedAsks: records.reduce((sum, item) => sum + (item.adaptiveTrace?.unpublishedAsks ?? 0), 0),
      harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    },
    multiplicity: {
      uniqueCanonicalSubjectsObserved: uniqueCanonical.size,
      distinctScenarioSources: [...allScenarioSources],
      maxScenarioSets: Math.max(0, ...records.map((item) => item.maxScenarioSets)),
      maxScenarios: Math.max(0, ...records.map((item) => item.maxScenarios)),
      distinctDecisions: allDecisions.size,
      maxDecisions: Math.max(0, ...records.map((item) => item.maxDecisions)),
      anMaxDecisions: Math.max(0, ...an.map((item) => item.maxDecisions)),
      distinctExecutions: allExecutions.size,
      maxExecutions: Math.max(0, ...records.map((item) => item.maxExecutions)),
      anMaxExecutions: Math.max(0, ...an.map((item) => item.maxExecutions)),
      outcomesObserved: allRows.filter((row) =>
        row.nxa3OutcomeState != null
        || (row.npsOutcomeStatus != null && !["TOO_EARLY", "UNKNOWN"].includes(row.npsOutcomeStatus)),
      ).length,
    },
    fix1: {
      executionCommands: executionRows.length,
      deicticCommands: executionRows.filter((row) => !row.explicit).length,
      explicitCommands: executionRows.filter((row) => row.explicit).length,
      clarifications: executionRows.filter((row) => row.clarification).length,
      executionsCreated: executionRows.reduce((sum, row) => sum + row.createdExecutions.length, 0),
      wrongCrossThreadExecutions: wrongExec.length,
      rows: executionRows,
      originalBlocker: {
        originalSignature: "fnv1a32:61197640",
        historicalRepairedSignature: "fnv1a32:c5462932",
        first: blockerFirst.deterministicSignature,
        second: blockerSecond.deterministicSignature,
        matched: blockerFirst.deterministicSignature === blockerSecond.deterministicSignature,
        canonicalSubjectAfter: blockerFinal.canonicalSubjectId,
        capacityExecutions: capacityExecution,
        decisionLedger: blockerFinal.decisionLedger ?? [],
        executionLedger: blockerFinal.executionLedger ?? [],
        clarification: blockerFinal.clarificationRequired,
        response: blockerFinal.response,
      },
    },
    scenarioSetFindings,
    bT5: bT5 ? {
      utterance: bT5.utterance,
      canonicalSubjectId: bT5.canonicalSubjectId,
      l1: bT5.mlevelL1,
      stage: bT5.stageActiveSubjectId,
      advisor: bT5.advisorReferentId,
      split: bT5.canonicalSubjectId !== bT5.mlevelL1,
    } : null,
    reassessmentRows,
    inventedReassessment: invented.length,
    advisorDivergences: advisorDivergences.length,
    knownAdvisorDebt: knownAdvisorDebt.length,
    npsS3: npsS3.length,
    groundTruthLeakRows: leakRows,
    rawFindings: { counts: rawCounts, classificationCounts },
    deterministicReplays: replays,
    productionIntegrity: {
      before: productionBefore,
      after: productionAfter,
      productionChangesDuringR3: productionBefore.digest === productionAfter.digest ? 0 : 1,
    },
    architecture: {
      secondManagementModel: false, secondScenarioAuthority: false, secondDecisionAuthority: false,
      secondExecutionAuthority: false, secondOutcomeAuthority: false, secondContextAuthority: false,
      secondReferentEngine: false, secondDataReality: false, secondWorld: false, secondOperator: false,
      secondManagerRuntime: false, secondObserver: false, secondNmi: false, secondStage: false,
      secondAdvisor: false, secondObjectAuthority: false,
    },
    records,
  };

  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(new URL("population-run.json", ARTIFACT_DIRECTORY), JSON.stringify(summary, null, 2));

  assert.equal(reports.length, 160);
  assert.equal(new Set(SIM_TEST_9_R2_JOURNEYS.map((item) => item.r2Family)).size, 14);
  assert.equal(summary.population.profiles.length, 10);
  assert.deepEqual([...summary.population.seeds].sort(), [11, 29, 47]);
  assert.equal(summary.population.harnessFailures, 0);
  assert.equal(productionBefore.digest, productionAfter.digest);
  assert.equal(replays.every((item) => item.matched), true);
  assert.equal(blockerFirst.deterministicSignature, blockerSecond.deterministicSignature);
  assert.equal(capacityExecution.length, 0);
  assert.equal(wrongExec.length, 0);
  assert.equal(leakRows.length, 0);
  assert.equal(invented.length, 0);
});
