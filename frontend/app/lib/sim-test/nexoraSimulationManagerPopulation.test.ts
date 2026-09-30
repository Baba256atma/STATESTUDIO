/**
 * NPA-T SIM-TEST:7 — population, isolation, replay, and finding record.
 * Does not repair Nexora. Product findings stay classified outside this file.
 */

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import test from "node:test";

import { RMS_OBSERVER_CONTRACT } from "../rms/rmsActorContracts.ts";
import { selectBoundedRmsManagerBehaviorTurn } from "../rms/rmsManagerBehavior.ts";
import { RMS_4_BOUNDARY, type RmsManagerKnowledge } from "../rms/rmsManagerContract.ts";
import { emptyRmsManagerKnowledge } from "../rms/rmsManagerRuntime.ts";
import { RMS_MANAGER_PROFILES, RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS } from "../rms/rmsManagerProfiles.ts";
import { generateRmsManagerTurn, RMS_NORTHSTAR_AGENDA } from "../rms/rmsManagerTurnGeneration.ts";
import {
  SIM_TEST_7_BOUNDARY,
  SIM_TEST_FORBIDDEN_JOURNEY_KEYS,
} from "./nexoraSimulationTestContract.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import { SIM_TEST_6_JOURNEYS } from "./nexoraSimulationLongSessionJourneys.ts";
import {
  SIM_TEST_7_JOURNEYS,
  SIM_TEST_7_OBSERVER_DETECTIONS,
} from "./nexoraSimulationManagerPopulation.ts";

const BEHAVIOR_SOURCE = readFileSync(new URL("../rms/rmsManagerBehavior.ts", import.meta.url), "utf8");
const POPULATION_SOURCE = readFileSync(new URL("./nexoraSimulationManagerPopulation.ts", import.meta.url), "utf8");
const TURN_SOURCE = readFileSync(new URL("../rms/rmsManagerTurnGeneration.ts", import.meta.url), "utf8");

const MANUFACTURING_OBJECTIVE = Object.freeze({
  objectiveId: "obj-delivery-pressure",
  statement: "Understand why delivery performance is deteriorating and identify what deserves management attention.",
  hostKind: "BUSINESS" as const,
  agenda: RMS_NORTHSTAR_AGENDA,
});

test("SIM-TEST:7 keeps the certified baseline profiles and does not add a second runtime", () => {
  assert.equal(SIM_TEST_7_BOUNDARY.createsManagerRuntime, false);
  assert.equal(SIM_TEST_7_BOUNDARY.createsConversationEngine, false);
  assert.equal(SIM_TEST_7_BOUNDARY.createsGroundTruth, false);
  assert.equal(SIM_TEST_7_BOUNDARY.createsDataReality, false);
  assert.equal(SIM_TEST_7_BOUNDARY.managerReadsGroundTruth, false);
  assert.equal(SIM_TEST_7_BOUNDARY.autoRepairs, false);
  assert.equal(SIM_TEST_7_BOUNDARY.startsFix, false);
  assert.equal(RMS_4_BOUNDARY.parallelConversationEngine, false);
  assert.equal(RMS_4_BOUNDARY.managerReadsGroundTruth, false);
  assert.equal(RMS_OBSERVER_CONTRACT.readOnly, true);
  assert.equal(SIM_TEST_6_JOURNEYS.length, 7);
  assert.equal(TURN_SOURCE.includes('STANDARD_MANAGER: "What is happening?"'), true);
  assert.equal(TURN_SOURCE.includes('IMPATIENT_MANAGER: "Why?"'), true);
  assert.equal(TURN_SOURCE.includes('DATA_DRIVEN_MANAGER: "What data do we have?"'), true);
  const standard = generateRmsManagerTurn({
    intent: "UNDERSTAND",
    profile: RMS_MANAGER_PROFILES.STANDARD_MANAGER,
    knowledge: emptyRmsManagerKnowledge(),
  });
  assert.equal(standard.utterance, "What is happening?");
  const impatient = generateRmsManagerTurn({
    intent: "ASK_CAUSE",
    profile: RMS_MANAGER_PROFILES.IMPATIENT_MANAGER,
    knowledge: emptyRmsManagerKnowledge(),
  });
  assert.equal(impatient.utterance, "Why?");
  assert.equal(BEHAVIOR_SOURCE.includes("rmsGroundTruth"), false);
  assert.equal(BEHAVIOR_SOURCE.includes("inspectRmsGroundTruth"), false);
  assert.equal(BEHAVIOR_SOURCE.includes("rmsObserver"), false);
  assert.equal(POPULATION_SOURCE.includes("expectedAnswer"), false);
  assert.equal(POPULATION_SOURCE.includes("availableCapacity"), false);
  for (const key of SIM_TEST_FORBIDDEN_JOURNEY_KEYS) assert.equal(POPULATION_SOURCE.includes(key), false);
  for (const id of RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS) {
    assert.equal(RMS_MANAGER_PROFILES[id].groundTruthAccess, false);
  }
  assert.equal(Object.keys(SIM_TEST_7_OBSERVER_DETECTIONS).length, 14);
});

test("SIM-TEST:7 behavior selection varies by seed and visible reply, and stays reproducible", () => {
  const knowledge = emptyRmsManagerKnowledge(["I manage Northstar operations."]);
  const first = SIM_TEST_7_JOURNEYS.filter((journey) => journey.managerProfileId === "AMBIGUOUS_MANAGER");
  assert.ok(first.length >= 2);
  for (const journey of SIM_TEST_7_JOURNEYS) {
    assert.equal(journey.behaviorSeed != null, true);
    assert.equal(journey.steps.some((step) => step.kind === "MANAGER_TURN" && step.utterance), false);
    assert.equal(JSON.stringify(journey).includes("expectedAnswer"), false);
  }
  const profiles = new Set(SIM_TEST_7_JOURNEYS.map((journey) => journey.managerProfileId));
  const scenarios = new Set(SIM_TEST_7_JOURNEYS.map((journey) => journey.scenarioId));
  assert.equal(profiles.size, RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS.length);
  assert.equal(scenarios.size, 4);
  assert.ok(SIM_TEST_7_JOURNEYS.some((journey) => journey.conversationLength === "short"));
  assert.ok(SIM_TEST_7_JOURNEYS.some((journey) => journey.conversationLength === "medium"));
  assert.ok(SIM_TEST_7_JOURNEYS.some((journey) => journey.conversationLength === "long"));
  assert.ok(SIM_TEST_7_JOURNEYS.some((journey) => journey.steps.some((step) => step.kind === "INTERACT_VISIBLE" && step.surface === "MLEVEL_L2")));
  assert.ok(SIM_TEST_7_JOURNEYS.some((journey) => journey.steps.some((step) => step.kind === "INTERACT_VISIBLE" && step.surface === "MLEVEL_L3")));

  const left = [];
  const right = [];
  for (let turn = 0; turn < 8; turn += 1) {
    left.push(selectBoundedRmsManagerBehaviorTurn({
      profile: RMS_MANAGER_PROFILES.IMPATIENT_MANAGER,
      objective: MANUFACTURING_OBJECTIVE,
      knowledge,
      turnCount: turn,
      seed: 11,
    }).utterance);
    right.push(selectBoundedRmsManagerBehaviorTurn({
      profile: RMS_MANAGER_PROFILES.IMPATIENT_MANAGER,
      objective: MANUFACTURING_OBJECTIVE,
      knowledge,
      turnCount: turn,
      seed: 29,
    }).utterance);
  }
  assert.notEqual(left.join("|"), right.join("|"));
  const replay = selectBoundedRmsManagerBehaviorTurn({
    profile: RMS_MANAGER_PROFILES.IMPATIENT_MANAGER,
    objective: MANUFACTURING_OBJECTIVE,
    knowledge,
    turnCount: 3,
    seed: 11,
  });
  assert.equal(replay.utterance, left[3]);
  const seen = new Set<string>();
  for (const profileId of RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS) {
    for (const seed of [11, 29, 47]) {
      for (let turn = 0; turn < 12; turn += 1) {
        const spoken = selectBoundedRmsManagerBehaviorTurn({
          profile: RMS_MANAGER_PROFILES[profileId],
          objective: MANUFACTURING_OBJECTIVE,
          knowledge,
          turnCount: turn,
          seed,
        });
        assert.equal(spoken.replacesNexoraIntent, false);
        assert.equal(/CC:5|NCA|ECA|\bRDI\b|\bVAI\b/.test(spoken.utterance), false);
        seen.add(spoken.utterance);
      }
    }
  }
  const spokenCatalog = [...seen].join("\n");
  for (const sample of [/Why\?/, /What about that\?/, /Go back to Capacity\./, /Compare /, /Where did /, /yesterday/i, /No, I meant Delivery\./, /What changed since yesterday\?/]) {
    assert.match(spokenCatalog, sample);
  }
  const told: RmsManagerKnowledge = Object.freeze({
    ...emptyRmsManagerKnowledge(),
    visibleFacts: Object.freeze([{
      factId: "told:0",
      text: "Delivery is the active subject and the buffer moved.",
      source: "nexora-response" as const,
    }]),
    currentSubject: "Delivery",
    discussedLabels: Object.freeze(["Delivery"]),
  });
  const differed = [0, 1, 2, 3, 4, 5].some((turn) =>
    selectBoundedRmsManagerBehaviorTurn({
      profile: RMS_MANAGER_PROFILES.DISTRACTED_MANAGER,
      objective: MANUFACTURING_OBJECTIVE,
      knowledge,
      turnCount: turn,
      seed: 11,
    }).utterance !== selectBoundedRmsManagerBehaviorTurn({
      profile: RMS_MANAGER_PROFILES.DISTRACTED_MANAGER,
      objective: MANUFACTURING_OBJECTIVE,
      knowledge: told,
      turnCount: turn,
      seed: 11,
    }).utterance,
  );
  assert.equal(differed, true);
});

test("SIM-TEST:7 population runs through the canonical path and records replayable findings", { timeout: 1_800_000 }, () => {
  const records = [];
  for (const journey of SIM_TEST_7_JOURNEYS) {
    const report = runNexoraSimulationTestJourney({ journey, runId: `sim7-${journey.journeyId}` });
    assert.equal(report.harnessStatus, "PASS", `${journey.journeyId} ${report.error ?? ""}`);
    assert.equal(report.managerFirewall?.groundTruthAccess, false);
    assert.equal(report.autoRepairAttempted, false);
    assert.ok(report.deterministicSignature.startsWith("fnv1a32:"));
    assert.ok(report.turns > 0);
    const uniqueFindings = new Map<string, (typeof report.journeyFindings)[number] | (typeof report.findings)[number]>();
    for (const finding of [...report.findings, ...report.journeyFindings]) uniqueFindings.set(finding.findingId, finding);
    records.push({
      journeyId: journey.journeyId,
      profileId: journey.managerProfileId,
      scenarioId: journey.scenarioId,
      seed: journey.behaviorSeed,
      length: journey.conversationLength,
      mode: journey.mode,
      signature: report.deterministicSignature,
      turns: report.turns,
      ticks: report.ticks,
      harnessStatus: report.harnessStatus,
      stopReason: report.stopReason,
      findingCounts: report.findingCounts,
      journeyFindingCounts: {
        S0: report.journeyFindings.filter((item) => item.severity === "S0").length,
        S1: report.journeyFindings.filter((item) => item.severity === "S1").length,
        S2: report.journeyFindings.filter((item) => item.severity === "S2").length,
        S3: report.journeyFindings.filter((item) => item.severity === "S3").length,
      },
      utterances: report.journeyObservations.map((item) => item.utterance),
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
          advisorReferentName: observation?.advisorReferentName ?? null,
          mlevelL1: observation?.mlevelL1 ?? finding.mlevelActiveId,
          mlevelL2: observation?.mlevelL2 ?? null,
          mlevelL3: observation?.mlevelL3 ?? null,
          decisionStatus: observation?.decisionStatus ?? null,
          decisionId: observation?.decisionId ?? null,
          executionId: observation?.executionId ?? null,
          history: report.journeyObservations.slice(0, finding.managerTurn).map((item) => item.utterance),
        };
      }),
    });
  }

  const replayTargets = records.filter((record) => record.findings.some((finding) => finding.severity === "S0" || finding.severity === "S1"));
  const replaySample = replayTargets.length > 0 ? replayTargets : records.slice(0, 1);
  const replay = [];
  for (const record of replaySample) {
    const journey = SIM_TEST_7_JOURNEYS.find((item) => item.journeyId === record.journeyId);
    assert.ok(journey);
    const again = runNexoraSimulationTestJourney({ journey, runId: `sim7-${journey.journeyId}` });
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
    profiles: [...new Set(records.map((item) => item.profileId))],
    scenarios: [...new Set(records.map((item) => item.scenarioId))],
    seeds: [...new Set(records.map((item) => item.seed))],
    turns: records.reduce((sum, item) => sum + item.turns, 0),
    longSessions: records.filter((item) => item.length === "long").length,
    ingestionJourneys: records.filter((item) => item.mode === "INGESTION").length,
    harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    findingCounts: records.reduce((counts, item) => {
      for (const finding of item.findings) counts[finding.severity] += 1;
      return counts;
    }, { S0: 0, S1: 0, S2: 0, S3: 0 }),
    replay,
    records,
  };
  const directory = new URL("../../../artifacts/sim-test/SIM-TEST-7/", import.meta.url);
  mkdirSync(directory, { recursive: true });
  writeFileSync(new URL("population-run.json", directory), JSON.stringify(summary));
  assert.equal(summary.harnessFailures, 0);
  assert.equal(replay.every((item) => item.matched), true);
});
