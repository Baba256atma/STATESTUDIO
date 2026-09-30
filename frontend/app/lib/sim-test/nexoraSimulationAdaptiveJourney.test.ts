/**
 * NPA-T SIM-TEST:8 — adaptive world change during certified manager journeys.
 * Does not repair Nexora. Product findings stay classified outside this file.
 */

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import test from "node:test";

import { RMS_OBSERVER_CONTRACT } from "../rms/rmsActorContracts.ts";
import { RMS_4_BOUNDARY } from "../rms/rmsManagerContract.ts";
import { RMS_6_BOUNDARY } from "../rms/rmsEventContract.ts";
import { RMS_MANAGER_PROFILES } from "../rms/rmsManagerProfiles.ts";
import { RMS_NORTHSTAR_MACHINE_RECOVERY } from "../rms/rmsEventFixtures.ts";
import {
  SIM_TEST_8_BOUNDARY,
  SIM_TEST_8_ADAPTIVE_FAMILIES,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import { SIM_TEST_7_JOURNEYS } from "./nexoraSimulationManagerPopulation.ts";
import {
  SIM_TEST_8_JOURNEYS,
  SIM_TEST_8_OBSERVER_DETECTIONS,
} from "./nexoraSimulationAdaptiveJourneys.ts";

const JOURNEY_SOURCE = readFileSync(new URL("./nexoraSimulationAdaptiveJourneys.ts", import.meta.url), "utf8");
const HARNESS_SOURCE = readFileSync(new URL("./nexoraSimulationTestHarness.ts", import.meta.url), "utf8");

test("SIM-TEST:8 reuses RMS events and SIM-TEST:7 managers without a second runtime", () => {
  assert.equal(SIM_TEST_8_BOUNDARY.createsEventEngine, false);
  assert.equal(SIM_TEST_8_BOUNDARY.createsWorld, false);
  assert.equal(SIM_TEST_8_BOUNDARY.createsConversationEngine, false);
  assert.equal(SIM_TEST_8_BOUNDARY.autoRepairs, false);
  assert.equal(SIM_TEST_8_BOUNDARY.startsFix, false);
  assert.equal(RMS_6_BOUNDARY.bypassesOperatorRdi, false);
  assert.equal(RMS_6_BOUNDARY.publishesGroundTruthToNexora, false);
  assert.equal(RMS_4_BOUNDARY.managerReadsGroundTruth, false);
  assert.equal(RMS_OBSERVER_CONTRACT.readOnly, true);
  assert.equal(RMS_NORTHSTAR_MACHINE_RECOVERY.origin, "RMS_SCHEDULER");
  assert.equal(HARNESS_SOURCE.includes("stepRmsEventSchedule"), true);
  assert.equal(HARNESS_SOURCE.includes("ADVANCE_WORLD"), true);
  assert.equal(HARNESS_SOURCE.includes("class AdaptiveWorld"), false);
  assert.equal(SIM_TEST_7_JOURNEYS.length, 90);
  assert.equal(SIM_TEST_8_ADAPTIVE_FAMILIES.length, 10);
  const families = new Set(SIM_TEST_8_JOURNEYS.map((journey) => journey.adaptiveFamily));
  const scenarios = new Set(SIM_TEST_8_JOURNEYS.map((journey) => journey.scenarioId));
  const profiles = new Set(SIM_TEST_8_JOURNEYS.map((journey) => journey.managerProfileId));
  assert.equal(families.size, 10);
  assert.equal(scenarios.size, 4);
  assert.ok(profiles.size >= 8);
  assert.ok(SIM_TEST_8_JOURNEYS.some((journey) => journey.steps.some((step) => step.kind === "ADVANCE_WORLD")));
  assert.ok(SIM_TEST_8_JOURNEYS.some((journey) => journey.adaptiveEventPack === "MACHINE_RECOVERY"));
  assert.ok(SIM_TEST_8_JOURNEYS.some((journey) => journey.conversationLength === "long"));
  assert.equal(JOURNEY_SOURCE.includes("availableCapacity"), false);
  assert.equal(JOURNEY_SOURCE.includes("expectedAnswer"), false);
  assert.equal(JOURNEY_SOURCE.includes("machineAvailability"), false);
  for (const key of SIM_TEST_FORBIDDEN_JOURNEY_KEYS) assert.equal(JOURNEY_SOURCE.includes(key), false);
  for (const journey of SIM_TEST_8_JOURNEYS) {
    assert.equal(RMS_MANAGER_PROFILES[journey.managerProfileId].groundTruthAccess, false);
    assert.equal(journey.adaptiveFamily != null, true);
    assert.ok(journey.steps.some((step) => step.kind === "PUBLISH_OBSERVABLE_DATA"));
    assert.ok(journey.steps.some((step) => step.kind === "MANAGER_TURN"));
  }
  assert.equal(Object.keys(SIM_TEST_8_OBSERVER_DETECTIONS).length, 17);
});

test("SIM-TEST:8 adaptive population runs, stays firewalled, and replays material findings", { timeout: 1_800_000 }, () => {
  const records = [];
  for (const journey of SIM_TEST_8_JOURNEYS) {
    const report = runNexoraSimulationTestJourney({ journey, runId: `sim8-${journey.journeyId}` });
    assert.equal(report.harnessStatus, "PASS", `${journey.journeyId} ${report.error ?? ""}`);
    assert.equal(report.managerFirewall?.groundTruthAccess, false);
    assert.equal(report.autoRepairAttempted, false);
    assert.ok(report.deterministicSignature.startsWith("fnv1a32:"));
    assert.ok(report.turns > 0);
    assert.ok(report.adaptiveTrace);
    assert.equal(report.adaptiveTrace.hiddenFromNexora, true);
    assert.equal(report.adaptiveTrace.writeAttempted, false);
    const uniqueFindings = new Map();
    for (const finding of [...report.findings, ...report.journeyFindings]) uniqueFindings.set(finding.findingId, finding);
    records.push({
      journeyId: journey.journeyId,
      family: journey.adaptiveFamily,
      profileId: journey.managerProfileId,
      scenarioId: journey.scenarioId,
      seed: journey.behaviorSeed,
      length: journey.conversationLength,
      pack: journey.adaptiveEventPack ?? "SCENARIO",
      mode: journey.mode,
      signature: report.deterministicSignature,
      turns: report.turns,
      ticks: report.ticks,
      harnessStatus: report.harnessStatus,
      stopReason: report.stopReason,
      adaptiveTrace: report.adaptiveTrace,
      utterances: report.journeyObservations.map((item) => item.utterance),
      unpublishedAsks: report.journeyObservations.filter((item) => item.worldAdvancedUnpublished).map((item) => ({
        turn: item.turn,
        tick: item.tick,
        utterance: item.utterance,
        response: item.response.slice(0, 400),
        canonicalSubjectId: item.canonicalSubjectId,
        decisionId: item.decisionId ?? null,
        executionId: item.executionId ?? null,
      })),
      findings: [...uniqueFindings.values()].map((finding) => {
        const observation = report.journeyObservations.find((item) => item.turn === finding.managerTurn);
        return {
          classification: finding.classification,
          severity: finding.severity,
          owner: finding.likelyOwner,
          turn: finding.managerTurn,
          tick: finding.tick,
          utterance: observation?.utterance ?? null,
          response: (observation?.response ?? finding.observedBehavior).slice(0, 500),
          canonicalSubjectId: observation?.canonicalSubjectId ?? finding.activeCanonicalSubjectId,
          stageActiveSubjectId: observation?.stageActiveSubjectId ?? finding.stageActiveSubjectId,
          decisionId: observation?.decisionId ?? null,
          executionId: observation?.executionId ?? null,
          unpublished: observation?.worldAdvancedUnpublished === true,
          csv: observation?.csvVersions ?? [],
          history: report.journeyObservations.slice(0, finding.managerTurn).map((item) => item.utterance),
        };
      }),
    });
  }

  const replayTargets = records.filter((record) => record.findings.some((finding) => finding.severity === "S0" || finding.severity === "S1"));
  const replaySample = replayTargets.length > 0 ? replayTargets : records.slice(0, 1);
  const replay = [];
  for (const record of replaySample) {
    const journey = SIM_TEST_8_JOURNEYS.find((item) => item.journeyId === record.journeyId);
    assert.ok(journey);
    const again = runNexoraSimulationTestJourney({ journey, runId: `sim8-${journey.journeyId}` });
    replay.push({
      journeyId: record.journeyId,
      first: record.signature,
      second: again.deterministicSignature,
      matched: record.signature === again.deterministicSignature,
    });
    assert.equal(again.deterministicSignature, record.signature, journey.journeyId);
  }

  const summary = {
    journeys: records.length,
    families: [...new Set(records.map((item) => item.family))],
    profiles: [...new Set(records.map((item) => item.profileId))],
    scenarios: [...new Set(records.map((item) => item.scenarioId))],
    seeds: [...new Set(records.map((item) => item.seed))],
    turns: records.reduce((sum, item) => sum + item.turns, 0),
    worldAdvances: records.reduce((sum, item) => sum + (item.adaptiveTrace?.worldAdvances ?? 0), 0),
    publications: records.reduce((sum, item) => sum + (item.adaptiveTrace?.publications ?? 0), 0),
    eventTraces: records.reduce((sum, item) => sum + (item.adaptiveTrace?.eventTraces ?? 0), 0),
    unpublishedAsks: records.reduce((sum, item) => sum + (item.adaptiveTrace?.unpublishedAsks ?? 0), 0),
    recoveryJourneys: records.filter((item) => item.family === "RECOVERY").length,
    hiddenJourneys: records.filter((item) => item.family === "HIDDEN_CHANGE").length,
    delayedJourneys: records.filter((item) => item.family === "DELAYED_OBSERVATION").length,
    decisionChangeJourneys: records.filter((item) => item.family === "CHANGE_AFTER_DECISION").length,
    executionChangeJourneys: records.filter((item) => item.family === "CHANGE_DURING_EXECUTION").length,
    longSessions: records.filter((item) => item.length === "long").length,
    harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    findingCounts: records.reduce((counts, item) => {
      for (const finding of item.findings) counts[finding.severity] += 1;
      return counts;
    }, { S0: 0, S1: 0, S2: 0, S3: 0 }),
    replay,
    records,
  };
  const directory = new URL("../../../artifacts/sim-test/SIM-TEST-8/", import.meta.url);
  mkdirSync(directory, { recursive: true });
  writeFileSync(new URL("population-run.json", directory), JSON.stringify(summary));
  assert.equal(summary.harnessFailures, 0);
  assert.equal(replay.every((item) => item.matched), true);
  assert.ok(summary.hiddenJourneys >= 1);
  assert.ok(summary.unpublishedAsks >= 1);
  assert.ok(summary.worldAdvances >= 1);
});
