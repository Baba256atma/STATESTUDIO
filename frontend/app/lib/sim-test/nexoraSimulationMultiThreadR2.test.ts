/** NPA-T SIM-TEST:9-R2 — full multi-thread population recertification. */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { SIM_TEST_8_JOURNEYS } from "./nexoraSimulationAdaptiveJourneys.ts";
import { SIM_TEST_7_JOURNEYS } from "./nexoraSimulationManagerPopulation.ts";
import { SIM_TEST_9_R2_JOURNEYS, type SimTest9R2JourneyFamily } from "./nexoraSimulationMultiThreadR2Journeys.ts";
import type {
  NexoraSimulationJourneyTurnObservation,
  NexoraSimulationManagerJourneyIntent,
  NexoraSimulationTestJourney,
  NexoraSimulationTestJourneyStep,
  NexoraSimulationTestRunReport,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const FRONTEND_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const ARTIFACT_DIRECTORY = new URL("../../../artifacts/sim-test/SIM-TEST-9-R2/", import.meta.url);
const EXECUTION_COMMAND = /^(?:start|execute|do it|proceed|go ahead|run it|put .* into action)/i;
const ORDINAL = /\b(?:first|second|third|previous|last|other|earlier)\b/i;
const REASSESS = /still|reassess|has this changed/i;
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;

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
  title: "SIM-TEST:9 exact blocker after FIX1",
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

function productionSnapshot(): { readonly digest: string; readonly fileCount: number; readonly protectedFiles: Readonly<Record<string, string>> } {
  const files = productionFiles(resolve(FRONTEND_ROOT, "app"));
  const aggregate = createHash("sha256");
  const protectedNames = [
    "conversationalIntent.ts", "conversationalExperienceOrchestrator.ts", "executiveExecutionFollowUp.ts",
    "executiveDecisionRuntimeAdapter.ts", "executiveExecutionRuntimeAdapter.ts", "executiveScenarioResolver.ts",
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

function scenarioConfusion(report: NexoraSimulationTestRunReport) {
  return report.journeyObservations.flatMap((row) => {
    if (row.intent !== "EXPLORE_OPTIONS" || !row.activeScenarioId || !row.canonicalSubjectId) return [];
    const scenario = row.scenarioLedger?.find((item) => item.scenarioId === row.activeScenarioId) ?? null;
    const primary = scenario?.subjectIds[0] ?? null;
    if (!primary || primary === row.canonicalSubjectId) return [];
    const expectedLabel = row.intendedSubject ?? labelFromCanonical(row.canonicalSubjectId);
    if (expectedLabel && scenario?.title.toLowerCase().includes(expectedLabel.toLowerCase())) return [];
    return [{
      journeyId: report.identity.journeyId,
      profileId: report.identity.managerProfileId,
      scenarioFamily: report.identity.scenarioId,
      turn: row.turn,
      tick: row.tick,
      utterance: row.utterance,
      expectedContextId: row.canonicalSubjectId,
      expectedContextLabel: expectedLabel,
      actualScenarioId: row.activeScenarioId,
      actualScenarioTitle: scenario?.title ?? null,
      actualPrimarySubjectId: primary,
      scenarioCandidateIds: row.scenarioCandidateIds ?? [],
      canonicalSubjectId: row.canonicalSubjectId,
      nmiCanonicalId: row.nmiCanonicalId,
      mlevelL1: row.mlevelL1,
      stageActiveSubjectId: row.stageActiveSubjectId,
      advisorReferentId: row.advisorReferentId,
      decisionLedger: row.decisionLedger ?? [],
      response: row.response,
      history: report.journeyObservations.slice(0, row.turn).map((item) => item.utterance),
    }];
  });
}

function executionCommands(report: NexoraSimulationTestRunReport) {
  return report.journeyObservations.flatMap((row, index) => {
    if (!EXECUTION_COMMAND.test(row.utterance.trim())) return [];
    const before = report.journeyObservations[index - 1] ?? null;
    const beforeExecutions = new Set((before?.executionLedger ?? []).map((item) => item.executionId));
    const created = (row.executionLedger ?? []).filter((item) => !beforeExecutions.has(item.executionId));
    return [{
      journeyId: report.identity.journeyId,
      profileId: report.identity.managerProfileId,
      scenarioFamily: report.identity.scenarioId,
      turn: row.turn,
      utterance: row.utterance,
      explicit: !/^(?:start it|execute it|do it|proceed|go ahead|run it|start that)[.!?]*$/i.test(row.utterance.trim()),
      contextBefore: before?.canonicalSubjectId ?? null,
      contextAfter: row.canonicalSubjectId,
      approvedDecisions: (row.decisionLedger ?? []).filter((item) => item.status === "Approved"),
      createdExecutions: created,
      clarification: row.clarificationRequired,
      response: row.response,
    }];
  });
}

function compactRecord(report: NexoraSimulationTestRunReport, population: "A-N" | "SIM7" | "SIM8") {
  const findings = uniqueFindings(report);
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
    finalDecisionLedger: report.journeyObservations.at(-1)?.decisionLedger ?? [],
    finalExecutionLedger: report.journeyObservations.at(-1)?.executionLedger ?? [],
    maxScenarios: Math.max(0, ...report.journeyObservations.map((row) => row.scenarioLedger?.length ?? 0)),
    maxScenarioSets: Math.max(0, ...report.journeyObservations.map((row) => new Set((row.scenarioLedger ?? []).map((item) => item.subjectIds[0] ?? "unowned")).size)),
    maxDecisions: Math.max(0, ...report.journeyObservations.map((row) => row.decisionLedger?.length ?? 0)),
    maxExecutions: Math.max(0, ...report.journeyObservations.map((row) => row.executionLedger?.length ?? 0)),
    findings: findings.map((finding) => {
      const observation = report.journeyObservations.find((item) => item.turn === finding.managerTurn);
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
        history: report.journeyObservations.slice(0, finding.managerTurn).map((item) => item.utterance),
      };
    }),
    observations: population === "A-N" ? report.journeyObservations : undefined,
  };
}

test("SIM-TEST:9-R2 runs the complete isolated population from turn 1", { timeout: 1_800_000 }, () => {
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
        report: runNexoraSimulationTestJourney({ journey, runId: `sim9-r2-${journey.journeyId}` }),
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
  const reassessmentRows = reports.flatMap(({ report }) => report.journeyObservations.filter((row) =>
    row.intent === "REASSESS" || REASSESS.test(row.utterance),
  ).map((row) => ({
    journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance,
    canonicalSubjectId: row.canonicalSubjectId, decisionCount: row.decisionLedger?.length ?? 0,
    executionCount: row.executionLedger?.length ?? 0, clarification: row.clarificationRequired,
    inventedTitle: /Is This Still A/i.test(`${row.response} ${row.advisorReferentName ?? ""}`), response: row.response,
  })));
  const ordinalRows = reports.flatMap(({ report }) => report.journeyObservations.filter((row) => ORDINAL.test(row.utterance)).map((row) => ({
    journeyId: report.identity.journeyId, turn: row.turn, utterance: row.utterance,
    canonicalSubjectId: row.canonicalSubjectId, activeScenarioId: row.activeScenarioId,
    scenarioCandidateIds: row.scenarioCandidateIds ?? [], clarification: row.clarificationRequired, response: row.response,
  })));

  const materialJourneyIds = new Set([
    ...scenarioSetFindings.map((item) => item.journeyId),
    ...leakRows.map((item) => item.journeyId),
  ]);
  const replays = [...materialJourneyIds].map((journeyId) => {
    const source = reports.find((item) => item.report.identity.journeyId === journeyId)!;
    const journey = [...SIM_TEST_9_R2_JOURNEYS, ...SIM_TEST_7_JOURNEYS, ...SIM_TEST_8_JOURNEYS].find((item) => item.journeyId === journeyId)!;
    const replay = runNexoraSimulationTestJourney({ journey, runId: `sim9-r2-${journey.journeyId}` });
    return { journeyId, first: source.report.deterministicSignature, second: replay.deterministicSignature, matched: source.report.deterministicSignature === replay.deterministicSignature };
  });

  const blockerFirst = runNexoraSimulationTestJourney({ journey: BLOCKER, runId: "fix1-t1" });
  const blockerSecond = runNexoraSimulationTestJourney({ journey: BLOCKER, runId: "fix1-t1" });
  const blockerFinal = blockerFirst.journeyObservations.at(-1)!;
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
  const summary = {
    phase: "NPA-T SIM-TEST:9-R2",
    certificationMode: "MEASUREMENT_ONLY",
    population: {
      journeys: reports.length,
      journeyFamilies: SIM_TEST_9_R2_JOURNEYS.map((item) => item.r2Family),
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
      maxScenarioSets: Math.max(...records.map((item) => item.maxScenarioSets)),
      maxScenarios: Math.max(...records.map((item) => item.maxScenarios)),
      maxDecisions: Math.max(...records.map((item) => item.maxDecisions)),
      maxExecutions: Math.max(...records.map((item) => item.maxExecutions)),
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
      rows: executionRows,
      originalBlocker: {
        originalSignature: "fnv1a32:61197640",
        expectedRepairedSignature: "fnv1a32:c5462932",
        first: blockerFirst.deterministicSignature,
        second: blockerSecond.deterministicSignature,
        matched: blockerFirst.deterministicSignature === blockerSecond.deterministicSignature,
        canonicalSubjectId: blockerFinal.canonicalSubjectId,
        l1: blockerFinal.mlevelL1,
        stage: blockerFinal.stageActiveSubjectId,
        advisor: blockerFinal.advisorReferentId,
        decisionLedger: blockerFinal.decisionLedger ?? [],
        executionLedger: blockerFinal.executionLedger ?? [],
        clarification: blockerFinal.clarificationRequired,
        response: blockerFinal.response,
      },
    },
    scenarioSetFindings,
    ordinalRows,
    reassessmentRows,
    advisorDivergences,
    groundTruthLeakRows: leakRows,
    rawFindings: { counts: rawCounts, classificationCounts, rows: rawFindings },
    deterministicReplays: replays,
    productionIntegrity: {
      before: productionBefore,
      after: productionAfter,
      changed: productionBefore.digest !== productionAfter.digest,
      productionChangesDuringR2: productionBefore.digest === productionAfter.digest ? 0 : 1,
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
  assert.equal(blockerFirst.deterministicSignature, "fnv1a32:c5462932");
  assert.equal(blockerSecond.deterministicSignature, blockerFirst.deterministicSignature);
  assert.equal(blockerFinal.executionLedger?.length ?? 0, 0);
  assert.equal(blockerFinal.clarificationRequired, true);
});
