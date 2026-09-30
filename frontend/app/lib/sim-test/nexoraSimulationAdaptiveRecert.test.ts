/**
 * NPA-T SIM-TEST:8-RECERT — post-FIX1 adaptive population recertification.
 * Certification-only. Does not repair Nexora.
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import test from "node:test";

import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";
import { SIM_TEST_8_JOURNEYS } from "./nexoraSimulationAdaptiveJourneys.ts";

const REASSESS =
  /still a problem|still an issue|still happening|still have this|been resolved|still need to act|still need to do|still need attention|still relevant|still a risk|still worry|still make sense|still valid|reconsider this|what about this now|has this changed|where does this stand|is this still|do i still need|does this decision still|does this still/i;
const TITLE_FRAGMENT = /Is This Still A/;
const SEALED = /availableCapacity|machineAvailability|confirmedCausal|\bevt:machine|\bevt:demand|Ground Truth/i;
const AMBIGUOUS = /^(show me\.?|why\??|which one\??|what about that\??|what happened\??|and this\??)$/i;

function inventedName(text: string): boolean {
  return /is this still a/i.test(text) || TITLE_FRAGMENT.test(text);
}

test("SIM-TEST:8-RECERT adaptive population after FIX1", { timeout: 1_800_000 }, () => {
  const records = [];
  const reassessmentRows = [];
  const advisorDivergences = [];
  const ambiguousRows = [];
  for (const journey of SIM_TEST_8_JOURNEYS) {
    const report = runNexoraSimulationTestJourney({ journey, runId: `sim8-recert-${journey.journeyId}` });
    assert.equal(report.harnessStatus, "PASS", `${journey.journeyId} ${report.error ?? ""}`);
    assert.equal(report.managerFirewall?.groundTruthAccess, false);
    assert.equal(report.autoRepairAttempted, false);
    const uniqueFindings = new Map();
    for (const finding of [...report.findings, ...report.journeyFindings]) uniqueFindings.set(finding.findingId, finding);
    let previous = null;
    for (const item of report.journeyObservations) {
      if (REASSESS.test(item.utterance) || item.intent === "REASSESS") {
        reassessmentRows.push({
          journeyId: journey.journeyId,
          family: journey.adaptiveFamily,
          profileId: journey.managerProfileId,
          scenarioId: journey.scenarioId,
          seed: journey.behaviorSeed,
          length: journey.conversationLength,
          turn: item.turn,
          tick: item.tick,
          unpublished: item.worldAdvancedUnpublished === true,
          utterance: item.utterance,
          response: item.response.slice(0, 500),
          subjectBefore: previous?.canonicalSubjectId ?? null,
          canonical: item.canonicalSubjectId,
          conversation: item.conversationSubjectId,
          mlevelL1: item.mlevelL1,
          stage: item.stageActiveSubjectId,
          advisorId: item.advisorReferentId,
          advisorName: item.advisorReferentName,
          invented: inventedName(item.response) || inventedName(item.advisorReferentName ?? ""),
          clarification: item.clarificationRequired === true,
          decisionId: item.decisionId ?? null,
          decisionCount: item.decisionCount ?? 0,
          executionId: item.executionId ?? null,
          executionCount: item.executionCount ?? 0,
        });
      }
      if (AMBIGUOUS.test(item.utterance.trim())) {
        ambiguousRows.push({
          journeyId: journey.journeyId,
          turn: item.turn,
          utterance: item.utterance,
          canonical: item.canonicalSubjectId,
          clarification: item.clarificationRequired === true,
          response: item.response.slice(0, 240),
        });
      }
      if (
        item.advisorReferentId &&
        item.canonicalSubjectId &&
        item.advisorReferentId !== item.canonicalSubjectId
      ) {
        advisorDivergences.push({
          journeyId: journey.journeyId,
          family: journey.adaptiveFamily,
          turn: item.turn,
          utterance: item.utterance,
          response: item.response.slice(0, 240),
          canonical: item.canonicalSubjectId,
          l1: item.mlevelL1,
          stage: item.stageActiveSubjectId,
          advisorId: item.advisorReferentId,
          advisorName: item.advisorReferentName,
        });
      }
      previous = item;
    }
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
        leak: SEALED.test(item.response),
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
          advisorReferentId: observation?.advisorReferentId ?? null,
          advisorReferentName: observation?.advisorReferentName ?? null,
          mlevelL1: observation?.mlevelL1 ?? finding.mlevelActiveId,
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
    const again = runNexoraSimulationTestJourney({ journey, runId: `sim8-recert-${journey.journeyId}` });
    replay.push({
      journeyId: record.journeyId,
      first: record.signature,
      second: again.deterministicSignature,
      matched: record.signature === again.deterministicSignature,
    });
    assert.equal(again.deterministicSignature, record.signature, journey.journeyId);
  }

  const findingCounts = records.reduce((counts, item) => {
    for (const finding of item.findings) counts[finding.severity] += 1;
    return counts;
  }, { S0: 0, S1: 0, S2: 0, S3: 0 });
  const classificationCounts = {};
  for (const record of records) {
    for (const finding of record.findings) {
      classificationCounts[finding.classification] = (classificationCounts[finding.classification] ?? 0) + 1;
    }
  }

  const summary = {
    recert: "SIM-TEST:8-RECERT",
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
    unpublishedLeakHits: records.reduce(
      (sum, item) => sum + item.unpublishedAsks.filter((ask) => ask.leak).length,
      0,
    ),
    recoveryJourneys: records.filter((item) => item.family === "RECOVERY").length,
    hiddenJourneys: records.filter((item) => item.family === "HIDDEN_CHANGE").length,
    delayedJourneys: records.filter((item) => item.family === "DELAYED_OBSERVATION").length,
    decisionChangeJourneys: records.filter((item) => item.family === "CHANGE_AFTER_DECISION").length,
    executionChangeJourneys: records.filter((item) => item.family === "CHANGE_DURING_EXECUTION").length,
    longSessions: records.filter((item) => item.length === "long").length,
    harnessFailures: records.filter((item) => item.harnessStatus !== "PASS").length,
    findingCounts,
    classificationCounts,
    reassessment: {
      occurrences: reassessmentRows.length,
      invented: reassessmentRows.filter((row) => row.invented).length,
      identityStable: reassessmentRows.filter(
        (row) => row.subjectBefore && row.canonical && row.subjectBefore === row.canonical,
      ).length,
      identityChanged: reassessmentRows.filter(
        (row) => row.subjectBefore && row.canonical && row.subjectBefore !== row.canonical,
      ).length,
      noSubject: reassessmentRows.filter((row) => !row.canonical).length,
      rows: reassessmentRows,
    },
    advisorDivergences,
    ambiguousRows,
    replay,
    records,
  };
  const directory = new URL("../../../artifacts/sim-test/SIM-TEST-8-RECERT/", import.meta.url);
  mkdirSync(directory, { recursive: true });
  writeFileSync(new URL("population-run.json", directory), JSON.stringify(summary));
  assert.equal(summary.harnessFailures, 0);
  assert.equal(replay.every((item) => item.matched), true);
  assert.equal(summary.reassessment.invented, 0);
  assert.equal(summary.unpublishedLeakHits, 0);
});
