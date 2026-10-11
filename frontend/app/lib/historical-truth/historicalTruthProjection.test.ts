/**
 * NPA-T TIMELINE-PROJ:1 — Canonical Historical Projection proofs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  createNexoraCanonicalExecutionRuntime,
  type NexoraCanonicalExecution,
} from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import type { CsvPublishedKpiObservation } from "../data-reality/csvRealDataImportStore.ts";
import {
  nexoraGroundedLearningIntelligenceIdentity,
  type GroundedLearningCandidate,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import type { CapturedOutcomeObservation } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import { projectLiveOutcomeIntelligence } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL } from "./historicalTruthContract.ts";
import {
  CANONICAL_MANAGED_SUBJECT_BINDINGS,
  createManagedSubjectCatalogForTests,
  managedSubjectIdentityIdentity,
  resolveDataRealityEvidenceForManagedSubject,
} from "../managed-subject-identity/managedSubjectIdentity.ts";
import {
  HISTORICAL_PROJECTION_BOUNDARY,
  historicalTruthProjectionIdentity,
  observationBelongsToHistoricalSubject,
  projectHistoricalTruth,
  screenHistoricalProjectionInput,
  type HistoricalObservationInput,
  type HistoricalProjectionRow,
} from "./historicalTruthProjection.ts";

const T1 = "2026-08-15T10:00:00.000Z";
const T2 = "2026-08-15T11:00:00.000Z";
const T3 = "2026-08-15T12:00:00.000Z";
const T4 = "2026-08-15T13:00:00.000Z";
const T5 = "2026-08-15T13:05:00.000Z";
const SUBJECT = "obj-capacity";
const DECISION_ID = "ctx-decision-capacity";
const EXECUTION_ID = "execution-ctx-decision-capacity";
const OBSERVATION_ID = "csv:import-capacity:kpi.production.capacity-utilization";

function steppingClock(values: readonly string[]) {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)] ?? T5;
}

function capacitySources() {
  const decisions = createNexoraCanonicalDecisionRuntime();
  const approved = decisions.adapter.transitionDecision({
    decisionId: DECISION_ID,
    action: "approve",
    title: "Expand Capacity",
    subjectIds: [SUBJECT],
    committedAt: T1,
    workspaceId: "w",
    modelId: "m",
  });
  assert.equal(approved.status, "applied");
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: steppingClock([T2, T3]),
  });
  const created = executions.createExecution({ decisionId: DECISION_ID });
  assert.equal(created.status, "created");
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "prepare" });
  const started = executions.transitionExecution({ executionId: EXECUTION_ID, action: "start" });
  assert.equal(started.status, "applied");
  const observation: CsvPublishedKpiObservation = Object.freeze({
    observationId: OBSERVATION_ID,
    workspaceId: "ws-capacity",
    sourceContextId: "src-capacity",
    importId: "import-capacity",
    kpiId: "kpi.production.capacity-utilization",
    objectKey: "obj-capacity",
    nexoraObjectId: SUBJECT,
    value: 68,
    unit: "%",
    observedAt: T4,
    committedAt: T5,
  });
  const capture: CapturedOutcomeObservation = Object.freeze({
    observationId: `obs:src-capacity:ds-capacity:capacity-utilization:${T4}`,
    subjectId: SUBJECT,
    metricId: "capacity-utilization",
    dimension: "capacity-utilization",
    unit: "%",
    value: 68,
    qualitativeState: null,
    observedAt: T4,
    capturedAt: T5,
    sourceId: OBSERVATION_ID,
    datasetId: "ds-capacity",
    evidenceRefs: Object.freeze([]),
    provenanceRefs: Object.freeze([OBSERVATION_ID]),
    validationState: "valid",
    freshnessState: "current",
    decisionId: DECISION_ID,
    executionId: EXECUTION_ID,
    expectedOutcomeId: null,
    observationWindowId: null,
    outcomeLink: null,
    eligibleAsActualOutcome: false,
    rejections: Object.freeze([]),
    isOutcome: false,
    duplicateOf: null,
  });
  const learning: GroundedLearningCandidate = Object.freeze({
    identity: nexoraGroundedLearningIntelligenceIdentity,
    learningId: "core-out2:learning:l2",
    version: 1,
    previousLearningId: null,
    workspaceId: "w",
    subjectId: SUBJECT,
    learningType: "outcome-learning",
    statement: "Capacity learning L2 is supported.",
    status: "supported",
    scope: "case-specific",
    confidence: "unknown",
    evidenceStrength: "unknown",
    createdAt: HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL,
    decisionRefs: Object.freeze([DECISION_ID]),
    executionRefs: Object.freeze([EXECUTION_ID]),
    scenarioRefs: Object.freeze([]),
    issueRefs: Object.freeze([]),
    expectedOutcomeRefs: Object.freeze([]),
    outcomeAssessmentRefs: Object.freeze([]),
    observationRefs: Object.freeze([OBSERVATION_ID]),
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
  const assessment = projectLiveOutcomeIntelligence({
    subjectId: SUBJECT,
    decisionId: DECISION_ID,
    executionId: EXECUTION_ID,
  });
  return {
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
    observations: Object.freeze([observation]),
    outcomeCaptures: Object.freeze([capture]),
    outcomeAssessments: Object.freeze([assessment]),
    learnings: Object.freeze([learning]),
  };
}

function row(rows: readonly HistoricalProjectionRow[], factType: HistoricalProjectionRow["factType"]) {
  const found = rows.find((entry) => entry.factType === factType);
  assert.ok(found, factType);
  return found;
}

test("projection boundary is a recomputable read model", () => {
  assert.equal(historicalTruthProjectionIdentity, "NPA-T TIMELINE-PROJ:1/CanonicalHistoricalProjection");
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.persists, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.mutatesAuthorities, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.establishesCausation, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.mintsCanonicalIds, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.readsFlowTimeline, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.admitsRmsGroundTruth, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.mergesSubjectAliases, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.ownsManagedSubjectIdentity, false);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.consumesManagedSubjectIdentity, true);
  assert.equal(HISTORICAL_PROJECTION_BOUNDARY.wiresTimelineDock, false);
  const source = readFileSync(new URL("./historicalTruthProjection.ts", import.meta.url), "utf8");
  assert.equal(source.includes("nexoraMVPExecutiveFlow"), false);
  assert.equal(source.includes("timelineEvents"), false);
  assert.equal(source.includes("journalPacks"), false);
  assert.equal(source.includes("sessionStorage"), false);
  assert.equal(source.includes("localStorage"), false);
  assert.equal(source.includes("publishedKpiSubjectsEquivalent"), false);
  assert.equal(source.includes("NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS"), false);
  assert.equal(source.includes("resolveDataRealityEvidenceForManagedSubject"), true);
  assert.equal(/\bDate\.now\s*\(/.test(source), false);
  assert.equal(/\bnew Date\s*\(/.test(source), false);
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.equal(shell.includes("historicalTruthProjection"), false);
});

test("Proof A — Decision projection keeps CC:10 recording time", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({ subjectId: SUBJECT, decisions: sources.decisions });
  const approved = row(projected.chronological, "decision-approved");
  assert.equal(approved.sourceAuthority, "CC:10/NexoraExecutiveDecision");
  assert.equal(approved.sourceId, DECISION_ID);
  assert.notEqual(approved.projectionKey, approved.sourceId);
  assert.equal(approved.timestamps[0]?.semantics, "RECORDED_TIME");
  assert.equal(approved.timestamps[0]?.value, T1);
  assert.equal(approved.placeable, true);
  assert.equal(approved.establishesCausation, false);
});

test("Proof B — Execution lifecycle facts share one canonical id", () => {
  const sources = capacitySources();
  const completed = sources.executions[0];
  assert.ok(completed);
  const withCompletion: NexoraCanonicalExecution = Object.freeze({
    ...completed,
    status: "completed",
    completedAt: "2026-08-15T14:00:00.000Z",
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    decisions: sources.decisions,
    executions: [withCompletion],
  });
  const created = row(projected.chronological, "execution-created");
  const started = row(projected.chronological, "execution-started");
  const done = row(projected.chronological, "execution-completed");
  for (const entry of [created, started, done]) {
    assert.equal(entry.sourceAuthority, "CC:11/NexoraCanonicalExecution");
    assert.equal(entry.sourceId, EXECUTION_ID);
    assert.equal(entry.timestamps[0]?.semantics, "RECORDED_TIME");
    assert.equal(entry.relatedRefs.some((ref) => ref.kind === "decision" && ref.id === DECISION_ID), true);
    assert.notEqual(entry.projectionKey, entry.sourceId);
  }
  assert.deepEqual(
    [created.orderingTimestamp, started.orderingTimestamp, done.orderingTimestamp],
    [T2, T3, "2026-08-15T14:00:00.000Z"],
  );
});

test("Proof C — legacy untimed Execution gains no lifecycle time", () => {
  const sources = capacitySources();
  const legacy: NexoraCanonicalExecution = Object.freeze({
    ...sources.executions[0]!,
    status: "in-progress",
    createdAt: null,
    startedAt: null,
    completedAt: null,
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    decisions: sources.decisions,
    executions: [legacy],
  });
  assert.equal(projected.chronological.some((entry) => entry.factType.startsWith("execution-")), false);
  const current = row(projected.unplaced, "execution-current-status");
  assert.equal(current.recordStatus, "in-progress");
  assert.equal(current.placeable, false);
  assert.equal(current.orderingTimestamp, null);
  assert.equal(current.timestamps.length, 0);
  assert.equal(current.sourceId, EXECUTION_ID);
});

test("Proof D — observation keeps observedAt distinct from committedAt", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: sources.observations,
  });
  assert.equal(projected.chronological.length, 1);
  const observed = projected.chronological[0]!;
  assert.equal(observed.factType, "observation-recorded");
  assert.equal(observed.sourceId, OBSERVATION_ID);
  assert.equal(observed.measurement?.value, 68);
  const observedAt = observed.timestamps.find((entry) => entry.field === "observedAt");
  const committedAt = observed.timestamps.find((entry) => entry.field === "committedAt");
  assert.equal(observedAt?.semantics, "OBSERVED_TIME");
  assert.equal(observedAt?.value, T4);
  assert.equal(committedAt?.semantics, "COMMITTED_TIME");
  assert.equal(committedAt?.value, T5);
  assert.equal(observed.orderingTimestamp, T4);
  assert.notEqual(observed.orderingTimestamp, committedAt?.value);
});

test("Proof E — capture does not duplicate the measurement", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: sources.observations,
    outcomeCaptures: sources.outcomeCaptures,
  });
  const measurements = [...projected.chronological, ...projected.unplaced].filter(
    (entry) => entry.factType === "observation-recorded",
  );
  assert.equal(measurements.length, 1);
  assert.equal(measurements[0]?.sourceId, OBSERVATION_ID);
  const link = row([...projected.chronological, ...projected.unplaced], "outcome-capture-link");
  assert.notEqual(link.sourceId, OBSERVATION_ID);
  assert.equal(
    link.relatedRefs.some((ref) => ref.kind === "data-reality-observation" && ref.id === OBSERVATION_ID),
    true,
  );
  assert.equal(link.relatedRefs.some((ref) => ref.kind === "decision" && ref.id === DECISION_ID), true);
  assert.equal(link.relatedRefs.some((ref) => ref.kind === "execution" && ref.id === EXECUTION_ID), true);
  assert.equal(link.summary, "Outcome capture linked");
  assert.equal(link.measurement, null);
});

test("Proof F — untimed Outcome assessment stays derived and unplaced", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    outcomeAssessments: sources.outcomeAssessments,
  });
  const assessment = row(projected.unplaced, "outcome-assessment-available");
  assert.equal(assessment.truthClass, "DERIVED");
  assert.equal(assessment.placeable, false);
  assert.equal(assessment.sourceId, null);
  assert.equal(assessment.persistence, "ephemeral");
  assert.equal(assessment.timestamps.some((entry) => entry.field === "evaluatedAt" && entry.value != null), false);
  assert.equal(assessment.establishesCausation, false);
  assert.equal(projected.chronological.length, 0);
});

test("Proof G — sentinel Learning stays non-chronological", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    learnings: sources.learnings,
  });
  const learning = row(projected.unplaced, "learning-supported");
  assert.equal(learning.sourceId, "core-out2:learning:l2");
  assert.equal(learning.timestamps[0]?.semantics, "NON_CHRONOLOGICAL");
  assert.equal(learning.timestamps[0]?.value, HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL);
  assert.equal(learning.placeable, false);
  assert.equal(projected.chronological.length, 0);
});

test("Proof H — placeable rows sort by time then projection key", () => {
  const sources = capacitySources();
  const later = sources.decisions[0]!;
  const earlier = Object.freeze({
    ...later,
    decisionId: "cc10:decision:capacity-earlier",
    committedAt: "2026-08-15T09:00:00.000Z",
  });
  const tied = Object.freeze({
    ...later,
    decisionId: "cc10:decision:capacity-tied",
    committedAt: T1,
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    decisions: [later, tied, earlier],
    executions: [...sources.executions].reverse(),
    observations: sources.observations,
  });
  const times = projected.chronological.map((entry) => entry.orderingTimestamp);
  const sorted = [...times].sort((left, right) => (left ?? "").localeCompare(right ?? ""));
  assert.deepEqual(times, sorted);
  const tiedRows = projected.chronological.filter((entry) => entry.orderingTimestamp === T1);
  assert.deepEqual(
    tiedRows.map((entry) => entry.projectionKey),
    [...tiedRows.map((entry) => entry.projectionKey)].sort((left, right) => left.localeCompare(right)),
  );
  assert.equal(projected.unplaced.every((entry) => entry.orderingTimestamp == null), true);
});

test("Proof I — presentation history and fixture Execution ids are refused", () => {
  assert.equal(
    screenHistoricalProjectionInput({
      factType: "execution-status",
      sourceKind: "flowDomain.timelineEvents",
      sourceId: "tl-capacity-started",
    }).admitted,
    false,
  );
  assert.equal(
    screenHistoricalProjectionInput({
      factType: "execution-status",
      sourceKind: "journalPacks",
      sourceId: "pack-capacity",
    }).admitted,
    false,
  );
  assert.deepEqual(
    screenHistoricalProjectionInput({
      factType: "execution-status",
      sourceKind: "cc11-execution",
      sourceId: EXECUTION_ID,
      recordStatus: "in-progress",
      fields: { occurredAt: "2026-08-15T13:40:00.000Z" },
    }),
    { admitted: false, reason: "presentation-timestamp" },
  );
  const sources = capacitySources();
  const fixture: NexoraCanonicalExecution = Object.freeze({
    ...sources.executions[0]!,
    executionId: "ctx-execution-capacity",
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    decisions: sources.decisions,
    executions: [fixture],
  });
  assert.equal(projected.chronological.some((entry) => entry.sourceId === "ctx-execution-capacity"), false);
  assert.equal(projected.unplaced.some((entry) => entry.sourceId === "ctx-execution-capacity"), false);
  assert.equal(projected.refused.some((entry) => entry.reason === "flow-execution-id"), true);
});

test("Proof J — RMS ground truth is refused and admitted Data Reality still enters", () => {
  const screened = screenHistoricalProjectionInput({
    factType: "observation-published",
    sourceKind: "rms-ground-truth",
    sourceId: "rms:capacity:68",
    fields: { observedAt: T4 },
  });
  assert.deepEqual(screened, { admitted: false, reason: "rms-ground-truth" });
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: sources.observations,
  });
  assert.equal(projected.chronological[0]?.sourceId, OBSERVATION_ID);
  assert.equal(projected.chronological[0]?.truthClass, "OBSERVED_DATA");
});

test("Proof K — projection does not change source records", () => {
  const sources = capacitySources();
  const before = JSON.stringify(sources);
  projectHistoricalTruth({ subjectId: SUBJECT, ...sources });
  projectHistoricalTruth({ subjectId: SUBJECT, ...sources, range: { from: T2, to: T4 } });
  assert.equal(JSON.stringify(sources), before);
});

test("Proof L — Capacity chain separates chronology from unplaced facts", () => {
  const sources = capacitySources();
  const alias: CsvPublishedKpiObservation = Object.freeze({
    ...sources.observations[0]!,
    observationId: "csv:import-capacity:other",
    nexoraObjectId: "production",
    objectKey: "nexora.executive-operations.object.production",
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    ...sources,
    observations: [...sources.observations, alias],
  });
  assert.deepEqual(
    projected.chronological.map((entry) => [
      entry.factType,
      entry.sourceId,
      entry.orderingTimestamp,
      entry.timestamps[0]?.semantics ?? entry.timestamps.find((item) => item.field === "observedAt")?.semantics,
      entry.truthClass,
      entry.placeable,
    ]),
    [
      ["decision-approved", DECISION_ID, T1, "RECORDED_TIME", "CANONICAL_MANAGEMENT", true],
      ["execution-created", EXECUTION_ID, T2, "RECORDED_TIME", "CANONICAL_MANAGEMENT", true],
      ["execution-started", EXECUTION_ID, T3, "RECORDED_TIME", "CANONICAL_MANAGEMENT", true],
      ["observation-recorded", OBSERVATION_ID, T4, "OBSERVED_TIME", "OBSERVED_DATA", true],
      [
        "outcome-capture-link",
        sources.outcomeCaptures[0]?.observationId,
        T5,
        "OBSERVED_TIME",
        "OBSERVED_DATA",
        true,
      ],
    ],
  );
  const capture = row(projected.chronological, "outcome-capture-link");
  assert.equal(capture.timestamps.find((entry) => entry.field === "capturedAt")?.semantics, "RECORDED_TIME");
  assert.equal(capture.measurement, null);
  assert.deepEqual(
    projected.unplaced.map((entry) => [entry.factType, entry.placeable, entry.sourceId]),
    [
      ["execution-current-status", false, EXECUTION_ID],
      ["learning-supported", false, "core-out2:learning:l2"],
      ["outcome-assessment-available", false, null],
    ],
  );
  assert.equal(
    [...projected.chronological, ...projected.unplaced].some((entry) => entry.sourceId === alias.observationId),
    false,
  );
  assert.equal(projected.establishesCausation, false);
  assert.equal(projected.persisted, false);
  const again = projectHistoricalTruth({ subjectId: SUBJECT, ...sources });
  assert.deepEqual(projected, again);
});

test("problem, scenario, and blocked-at claims stay outside the projection", () => {
  assert.equal(
    screenHistoricalProjectionInput({
      factType: "problem-identified",
      sourceKind: "cc11-execution",
      sourceId: "tl-capacity-gap",
      fields: { occurredAt: "2026-08-15T09:18:00.000Z" },
    }).admitted,
    false,
  );
  assert.deepEqual(
    screenHistoricalProjectionInput({
      factType: "scenario-identity",
      sourceKind: "cc9-scenario",
      sourceId: "cc9:scenario:pricing",
      fields: { comparedAt: "2026-08-15T10:05:00.000Z" },
    }).admitted,
    true,
  );
  const scenario = screenHistoricalProjectionInput({
    factType: "scenario-identity",
    sourceKind: "cc9-scenario",
    sourceId: "cc9:scenario:pricing",
    fields: { comparedAt: "2026-08-15T10:05:00.000Z" },
  });
  assert.equal(scenario.admitted, true);
  if (scenario.admitted) {
    assert.equal(scenario.fact.timestamps[0]?.status, "unsupported");
    assert.equal(scenario.fact.timestamps[0]?.value, null);
    assert.deepEqual(scenario.fact.discardedFields, ["comparedAt"]);
  }
  const sources = capacitySources();
  const blocked: NexoraCanonicalExecution = Object.freeze({
    ...sources.executions[0]!,
    status: "blocked",
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    decisions: sources.decisions,
    executions: [blocked],
  });
  const emitted = [...projected.chronological, ...projected.unplaced].map((entry) => entry.factType);
  assert.equal(emitted.includes("execution-current-status"), true);
  assert.equal(emitted.some((factType) => factType.includes("blocked")), false);
  const current = row(projected.unplaced, "execution-current-status");
  assert.equal(current.recordStatus, "blocked");
  assert.equal(current.placeable, false);
});

test("time range filters placeable rows and keeps unplaced facts", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    ...sources,
    range: { from: T3, to: T4 },
  });
  assert.deepEqual(
    projected.chronological.map((entry) => entry.factType),
    ["execution-started", "observation-recorded"],
  );
  assert.equal(projected.unplaced.some((entry) => entry.factType === "learning-supported"), true);
  assert.equal(projected.unplaced.some((entry) => entry.factType === "execution-current-status"), true);
});

const LIVE_CAPACITY: HistoricalObservationInput = Object.freeze({
  observationId: "nexora.executive-operations.demo.baseline:kpi.production.capacity-utilization:nexora.executive-operations.object.production:2026-08-10T00:00:00.000Z",
  kpiId: "kpi.production.capacity-utilization",
  objectKey: "production",
  nexoraObjectId: "nexora.executive-operations.object.production",
  value: 87,
  unit: "%",
  observedAt: "2026-08-10T00:00:00.000Z",
});

test("CMSI Proof B — exact observation subject matching remains valid", () => {
  const sources = capacitySources();
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: sources.observations,
  });
  assert.equal(projected.chronological[0]?.sourceId, OBSERVATION_ID);
  assert.equal(projected.chronological[0]?.measurement?.value, 68);
});

test("CMSI Proof C/D/E/K — live Capacity KPI is one observation-recorded row", () => {
  const membership = resolveDataRealityEvidenceForManagedSubject({
    objectKey: LIVE_CAPACITY.objectKey,
    nexoraObjectId: LIVE_CAPACITY.nexoraObjectId,
    evidenceId: LIVE_CAPACITY.kpiId,
  });
  assert.equal(membership.status, "resolved");
  if (membership.status === "resolved") {
    assert.equal(membership.canonicalSubjectId, SUBJECT);
    assert.equal(membership.relationship, "EVIDENCE_FOR_MANAGED_SUBJECT");
    assert.equal(membership.provenance?.declarationId, "cmsi:capacity:kpi.production.capacity-utilization");
    assert.equal(membership.provenance?.owner, managedSubjectIdentityIdentity);
  }
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: [LIVE_CAPACITY],
  });
  assert.equal(projected.chronological.length, 1);
  const recorded = row(projected.chronological, "observation-recorded");
  assert.equal(
    recorded.projectionKey,
    `historical:observation-recorded:${LIVE_CAPACITY.observationId}`,
  );
  assert.equal(recorded.factType, "observation-recorded");
  assert.equal(recorded.subjectId, SUBJECT);
  assert.equal(recorded.sourceId, LIVE_CAPACITY.observationId);
  assert.notEqual(recorded.sourceId, "cmsi:capacity:kpi.production.capacity-utilization");
  assert.equal(recorded.sourceAuthority, "Data Reality/RDI");
  assert.equal(recorded.sourceRecordType, "CsvPublishedKpiObservation");
  assert.equal(recorded.truthClass, "OBSERVED_DATA");
  assert.equal(recorded.orderingTimestamp, "2026-08-10T00:00:00.000Z");
  assert.equal(recorded.placeable, true);
  assert.equal(recorded.establishesCausation, false);
  assert.deepEqual(recorded.measurement, { value: 87, unit: "%" });
  const again = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: [LIVE_CAPACITY],
  });
  assert.deepEqual(again, projected);
});

test("CMSI Proof F/G/I — throughput, missing scope, and unknown evidence stay out", () => {
  const throughput: HistoricalObservationInput = Object.freeze({
    ...LIVE_CAPACITY,
    observationId: "prod-throughput",
    kpiId: "kpi.production.throughput",
    value: 12,
  });
  const unknown: HistoricalObservationInput = Object.freeze({
    ...LIVE_CAPACITY,
    observationId: "unknown-kpi",
    kpiId: "kpi.unknown.metric",
  });
  assert.equal(observationBelongsToHistoricalSubject(throughput, SUBJECT), false);
  const missingScope = resolveDataRealityEvidenceForManagedSubject({
    objectKey: "production",
    nexoraObjectId: LIVE_CAPACITY.nexoraObjectId,
  });
  assert.equal(missingScope.status, "unresolved");
  if (missingScope.status === "unresolved") {
    assert.equal(missingScope.reason, "missing-evidence-scope");
  }
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: [throughput, unknown],
  });
  assert.equal(projected.chronological.length, 0);
  assert.equal(projected.unplaced.length, 0);
});

test("CMSI Proof H/J — ambiguous CMSI fails closed and the source observation is unchanged", () => {
  const before = JSON.stringify(LIVE_CAPACITY);
  const catalog = createManagedSubjectCatalogForTests({
    subjects: ["obj-capacity", "obj-test-a"],
    bindings: [
      ...CANONICAL_MANAGED_SUBJECT_BINDINGS,
      Object.freeze({
        declarationId: "cmsi:test:ambiguous",
        canonicalSubjectId: "obj-test-a",
        referenceDomain: "data-reality" as const,
        referenceId: "nexora.executive-operations.object.production",
        evidenceId: "kpi.production.capacity-utilization",
        relationship: "EVIDENCE_FOR_MANAGED_SUBJECT" as const,
        provenance: Object.freeze({
          owner: managedSubjectIdentityIdentity,
          declarationId: "cmsi:test:ambiguous",
          source: "internal-canonical-configuration" as const,
        }),
      }),
    ],
  });
  const projected = projectHistoricalTruth({
    subjectId: SUBJECT,
    observations: [LIVE_CAPACITY],
    subjectMembershipCatalog: catalog,
  });
  assert.equal(projected.chronological.length, 0);
  assert.equal(JSON.stringify(LIVE_CAPACITY), before);
});

test("CMSI Proof U — RMS ground truth remains refused", () => {
  const screened = screenHistoricalProjectionInput({
    factType: "observation-published",
    sourceKind: "rms-ground-truth",
    sourceId: "rms:capacity:87",
    fields: { observedAt: LIVE_CAPACITY.observedAt },
  });
  assert.deepEqual(screened, { admitted: false, reason: "rms-ground-truth" });
});
