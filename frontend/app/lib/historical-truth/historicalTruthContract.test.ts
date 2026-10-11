/** NPA-T TIMELINE-FOUNDATION:1 — Historical Truth Contract. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  HISTORICAL_TRUTH_AUTHORITIES,
  HISTORICAL_TRUTH_BOUNDARY,
  HISTORICAL_TRUTH_CAPACITY_PROOF,
  HISTORICAL_TRUTH_CLASSES,
  HISTORICAL_TRUTH_FORBIDDEN_SOURCES,
  HISTORICAL_TRUTH_GAPS,
  HISTORICAL_TRUTH_IDENTITY,
  HISTORICAL_TRUTH_INVARIANTS,
  HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL,
  HISTORICAL_TIMESTAMP_FIELD_MAP,
  HISTORICAL_TIMESTAMP_SEMANTICS,
  describeHistoricalFact,
  historicalTruthContractIdentity,
  historicalTruthExecutionCompletedAtIsRecorded,
  historicalTruthExecutionCreatedAtIsRecorded,
  historicalTruthExecutionStartedAtIsRecorded,
  historicalTruthLearningRefusesCausation,
  historicalTruthOutcomeHasNoAssessmentId,
  historicalTruthOutcomeHasNoEvaluatedAt,
  historicalTruthOutcomeRefusesCausation,
  historicalTruthStatement,
} from "./historicalTruthContract.ts";

const contractSource = readFileSync(new URL("./historicalTruthContract.ts", import.meta.url), "utf8");

test("contract identity is a read contract and seals missing chronology", () => {
  assert.equal(historicalTruthContractIdentity, "NPA-T TIMELINE-FOUNDATION:1/HistoricalTruthContract");
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.role, "read-contract");
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.createsEventLedger, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.createsEventStore, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.mintsTimestamps, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.mintsSourceIds, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.mintsProjectionRowKeys, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.projectionRowKeyReplacesSourceId, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.ownsDecision, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.ownsExecution, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.ownsDataReality, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.ownsLearning, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.admitsRmsGroundTruth, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.establishesCausation, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.implementsPareto, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.implementsNexoCause, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.app4IsDefaultLearningOwner, false);
  assert.equal(HISTORICAL_TRUTH_BOUNDARY.borrowsExecutionTimeFromFlowTimeline, false);
  assert.equal(historicalTruthExecutionCreatedAtIsRecorded, true);
  assert.equal(historicalTruthExecutionStartedAtIsRecorded, true);
  assert.equal(historicalTruthExecutionCompletedAtIsRecorded, true);
  assert.equal(historicalTruthOutcomeHasNoAssessmentId, true);
  assert.equal(historicalTruthOutcomeHasNoEvaluatedAt, true);
  assert.equal(historicalTruthOutcomeRefusesCausation, true);
  assert.equal(historicalTruthLearningRefusesCausation, true);
  assert.equal(/\bDate\.now\s*\(/.test(contractSource), false);
  assert.equal(/\bnew Date\s*\(/.test(contractSource), false);
  assert.equal(contractSource.includes("nexoraMVPExecutiveFlow"), false);
  assert.equal(contractSource.includes("business-timeline/"), false);
  assert.equal(contractSource.includes("decision-timeline/"), false);
  assert.equal(contractSource.includes("scenario-timeline/"), false);
  assert.equal(contractSource.includes("new Map"), false);
  assert.equal(HISTORICAL_TRUTH_FORBIDDEN_SOURCES.includes("flowDomain.timelineEvents"), true);
  assert.equal(HISTORICAL_TRUTH_FORBIDDEN_SOURCES.includes("NEXORA_MVP_FLOW_TIMELINE_SEED"), true);
});

test("HT-INV-01 through HT-INV-10 hold and gaps stay open", () => {
  assert.deepEqual(
    HISTORICAL_TRUTH_INVARIANTS.map((entry) => entry.id),
    [
      "HT-INV-01",
      "HT-INV-02",
      "HT-INV-03",
      "HT-INV-04",
      "HT-INV-05",
      "HT-INV-06",
      "HT-INV-07",
      "HT-INV-08",
      "HT-INV-09",
      "HT-INV-10",
    ],
  );
  assert.equal(HISTORICAL_TRUTH_INVARIANTS.every((entry) => entry.holds), true);
  assert.deepEqual(
    HISTORICAL_TRUTH_GAPS.map((entry) => entry.id),
    [
      "HT-GAP-01",
      "HT-GAP-02",
      "HT-GAP-03",
      "HT-GAP-04",
      "HT-GAP-05",
      "HT-GAP-06",
      "HT-GAP-07",
      "HT-GAP-08",
      "HT-GAP-09",
      "HT-GAP-10",
    ],
  );
  assert.equal(HISTORICAL_TRUTH_GAPS.find((entry) => entry.id === "HT-GAP-01")?.fixed, true);
  assert.equal(HISTORICAL_TRUTH_GAPS.find((entry) => entry.id === "HT-GAP-05")?.fixed, true);
  assert.match(
    HISTORICAL_TRUTH_GAPS.find((entry) => entry.id === "HT-GAP-05")?.summary ?? "",
    /CLOSED/,
  );
  assert.equal(
    HISTORICAL_TRUTH_GAPS.filter(
      (entry) => entry.id !== "HT-GAP-01" && entry.id !== "HT-GAP-05",
    ).every((entry) => entry.fixed === false),
    true,
  );
  assert.match(
    HISTORICAL_TRUTH_GAPS.find((entry) => entry.id === "HT-GAP-08")?.summary ?? "",
    /PARTIALLY CLOSED/,
  );
  assert.deepEqual(HISTORICAL_TRUTH_CLASSES, [
    "CANONICAL_MANAGEMENT",
    "OBSERVED_DATA",
    "DERIVED",
    "PRESENTATION_ONLY",
    "SIMULATION",
  ]);
  assert.deepEqual(HISTORICAL_TIMESTAMP_SEMANTICS, [
    "OBSERVED_TIME",
    "RECORDED_TIME",
    "COMMITTED_TIME",
    "OCCURRENCE_TIME",
    "UNKNOWN",
    "NON_CHRONOLOGICAL",
  ]);
});

test("forbidden chronology sources stay outside the contract", () => {
  for (const sourceKind of HISTORICAL_TRUTH_FORBIDDEN_SOURCES) {
    const described = describeHistoricalFact({
      factType: "decision-committed",
      sourceKind,
      sourceId: "cc10:decision:capacity",
      recordStatus: "Approved",
    });
    assert.equal(described.admitted, false);
    if (!described.admitted) {
      assert.equal(
        described.reason,
        sourceKind === "rms-ground-truth" ? "rms-ground-truth" : "forbidden-source",
      );
    }
  }
  assert.equal(HISTORICAL_TIMESTAMP_FIELD_MAP["flowDomain.occurredAt"].admitted, false);
  assert.equal(HISTORICAL_TRUTH_IDENTITY.projectionRowKey.replacesSourceId, false);
  assert.equal(HISTORICAL_TRUTH_IDENTITY.projectionRowKey.mintedByThisContract, false);
});

test("Decision committedAt is recording time and may be missing", () => {
  const committed = describeHistoricalFact({
    factType: "decision-committed",
    sourceKind: "cc10-decision",
    sourceId: "cc10:decision:capacity-b",
    subjectIds: ["obj-capacity"],
    recordStatus: "Approved",
    relatedRefs: [{ kind: "scenario", id: "cc9:scenario:capacity:capacity:v1" }],
    fields: { committedAt: "2026-10-10T17:22:00.000Z" },
  });
  assert.equal(committed.admitted, true);
  if (committed.admitted) {
    assert.equal(committed.fact.authority, HISTORICAL_TRUTH_AUTHORITIES.decision);
    assert.equal(committed.fact.sourceId, "cc10:decision:capacity-b");
    assert.equal(committed.fact.truthClass, "CANONICAL_MANAGEMENT");
    assert.equal(committed.fact.persistence, "session-storage");
    assert.equal(committed.fact.establishesCausation, false);
    assert.equal(committed.fact.timestamps[0]?.semantics, "RECORDED_TIME");
    assert.equal(committed.fact.timestamps[0]?.status, "present");
    assert.equal(committed.fact.timestamps[0]?.placeable, true);
    assert.notEqual(committed.fact.timestamps[0]?.semantics, "OCCURRENCE_TIME");
  }

  const untimed = describeHistoricalFact({
    factType: "decision-committed",
    sourceKind: "cc10-decision",
    sourceId: "cc10:decision:capacity-b",
    recordStatus: "Approved",
  });
  assert.equal(untimed.admitted, true);
  if (untimed.admitted) {
    assert.equal(untimed.fact.timestamps[0]?.value, null);
    assert.equal(untimed.fact.timestamps[0]?.status, "missing");
    assert.equal(untimed.fact.timestamps[0]?.placeable, false);
    assert.equal(untimed.fact.recordStatus, "Approved");
  }

  const known = describeHistoricalFact({
    factType: "decision-known",
    sourceKind: "cc10-decision",
    sourceId: "ctx-decision-capacity",
    recordStatus: "Under Review",
    fields: { committedAt: "2026-08-15T00:00:00.000Z" },
  });
  assert.equal(known.admitted, true);
  if (known.admitted) {
    assert.deepEqual(known.fact.timestamps, []);
    assert.deepEqual(known.fact.discardedFields, ["committedAt"]);
  }
});

test("Execution lifecycle times are CC:11 recording times", () => {
  const execution = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-cc10:decision:capacity-b",
    recordStatus: "in-progress",
    relatedRefs: [{ kind: "decision", id: "cc10:decision:capacity-b" }],
    fields: { startedAt: "2026-08-15T13:40:00.000Z", completedAt: "2026-08-15T16:15:00.000Z", createdAt: "2026-08-15T09:00:00.000Z" },
  });
  assert.equal(execution.admitted, true);
  if (execution.admitted) {
    assert.equal(execution.fact.authority, HISTORICAL_TRUTH_AUTHORITIES.execution);
    assert.equal(execution.fact.recordStatus, "in-progress");
    assert.equal(execution.fact.eventHistoryComplete, false);
    assert.deepEqual(
      execution.fact.timestamps.map((entry) => [entry.field, entry.value, entry.status, entry.semantics, entry.placeable]),
      [
        ["createdAt", "2026-08-15T09:00:00.000Z", "present", "RECORDED_TIME", true],
        ["startedAt", "2026-08-15T13:40:00.000Z", "present", "RECORDED_TIME", true],
        ["completedAt", "2026-08-15T16:15:00.000Z", "present", "RECORDED_TIME", true],
      ],
    );
    assert.deepEqual(execution.fact.discardedFields, []);
  }

  const untimed = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-cc10:decision:capacity-b",
    recordStatus: "completed",
  });
  assert.equal(untimed.admitted, true);
  if (untimed.admitted) {
    assert.deepEqual(
      untimed.fact.timestamps.map((entry) => [entry.field, entry.value, entry.status, entry.semantics, entry.placeable]),
      [
        ["createdAt", null, "missing", "RECORDED_TIME", false],
        ["startedAt", null, "missing", "RECORDED_TIME", false],
        ["completedAt", null, "missing", "RECORDED_TIME", false],
      ],
    );
  }

  const flowExecution = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "ctx-execution-capacity",
    recordStatus: "in-progress",
  });
  assert.deepEqual(flowExecution, { admitted: false, reason: "flow-execution-id" });

  const occurred = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-cc10:decision:capacity-b",
    recordStatus: "in-progress",
    fields: { occurredAt: "2026-08-15T12:00:00.000Z" },
  });
  assert.deepEqual(occurred, { admitted: false, reason: "presentation-timestamp" });
});

test("observations keep observedAt distinct from committedAt and capture does not replace the source id", () => {
  const observation = describeHistoricalFact({
    factType: "observation-published",
    sourceKind: "data-reality-observation",
    sourceId: "csv:import-capacity:kpi.production.capacity-utilization",
    subjectIds: ["nexora.executive-operations.object.production"],
    fields: {
      observedAt: "2026-10-10T16:10:00.000Z",
      committedAt: "2026-10-10T16:12:00.000Z",
    },
  });
  assert.equal(observation.admitted, true);
  if (observation.admitted) {
    assert.equal(observation.fact.truthClass, "OBSERVED_DATA");
    assert.equal(observation.fact.timestamps[0]?.field, "observedAt");
    assert.equal(observation.fact.timestamps[0]?.semantics, "OBSERVED_TIME");
    assert.equal(observation.fact.timestamps[1]?.field, "committedAt");
    assert.equal(observation.fact.timestamps[1]?.semantics, "COMMITTED_TIME");
    assert.notEqual(observation.fact.timestamps[0]?.value, observation.fact.timestamps[1]?.value);
  }

  const untraced = describeHistoricalFact({
    factType: "outcome-capture",
    sourceKind: "core-out-1a-capture",
    sourceId: "obs:src:dataset:kpi.production.capacity-utilization:2026-10-10T16:10:00.000Z",
    subjectIds: ["obj-capacity"],
    fields: { observedAt: "2026-10-10T16:10:00.000Z", capturedAt: "2026-10-10T16:12:00.000Z" },
  });
  assert.equal(untraced.admitted, true);
  if (untraced.admitted) {
    assert.equal(untraced.fact.sourceIdStatus, "present");
    assert.equal(untraced.fact.sourceObservationTrace, "missing");
    assert.equal(untraced.fact.timestamps[0]?.semantics, "OBSERVED_TIME");
    assert.equal(untraced.fact.timestamps[1]?.semantics, "RECORDED_TIME");
  }

  const traced = describeHistoricalFact({
    factType: "outcome-capture",
    sourceKind: "core-out-1a-capture",
    sourceId: "obs:src:dataset:kpi.production.capacity-utilization:2026-10-10T16:10:00.000Z",
    relatedRefs: [
      { kind: "data-reality-observation", id: "csv:import-capacity:kpi.production.capacity-utilization" },
      { kind: "decision", id: "cc10:decision:capacity-b" },
      { kind: "execution", id: "execution-cc10:decision:capacity-b" },
    ],
    fields: { observedAt: "2026-10-10T16:10:00.000Z" },
  });
  assert.equal(traced.admitted, true);
  if (traced.admitted) {
    assert.equal(traced.fact.sourceObservationTrace, "referenced");
    assert.equal(traced.fact.sourceId?.startsWith("obs:"), true);
    assert.notEqual(
      traced.fact.sourceId,
      "csv:import-capacity:kpi.production.capacity-utilization",
    );
  }
});

test("outcome evaluation stays derived, untimed, and non-causal", () => {
  const evaluation = describeHistoricalFact({
    factType: "outcome-evaluation",
    sourceKind: "core-out-1-assessment",
    sourceId: "CORE-OUT:1/LiveOutcomeIntelligence:obj-capacity:met",
    subjectIds: ["obj-capacity"],
    fields: { evaluatedAt: "2026-10-10T00:00:00.000Z" },
    relatedRefs: [{ kind: "execution", id: "execution-cc10:decision:capacity-b" }],
  });
  assert.equal(evaluation.admitted, true);
  if (evaluation.admitted) {
    assert.equal(evaluation.fact.truthClass, "DERIVED");
    assert.equal(evaluation.fact.persistence, "ephemeral");
    assert.equal(evaluation.fact.sourceId, null);
    assert.equal(evaluation.fact.sourceIdStatus, "missing");
    assert.equal(evaluation.fact.establishesCausation, false);
    assert.equal(evaluation.fact.timestamps[0]?.field, "evaluatedAt");
    assert.equal(evaluation.fact.timestamps[0]?.value, null);
    assert.equal(evaluation.fact.timestamps[0]?.status, "unsupported");
    assert.deepEqual(evaluation.fact.discardedFields, ["evaluatedAt", "sourceId"]);
  }
});

test("Learning status is knowable and createdAt is not an occurrence time", () => {
  const sentinel = describeHistoricalFact({
    factType: "learning-record",
    sourceKind: "core-out-2-learning",
    sourceId: "learn:capacity:fingerprint",
    subjectIds: ["obj-capacity"],
    recordStatus: "supported",
    fields: { createdAt: HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL },
    relatedRefs: [
      { kind: "decision", id: "cc10:decision:capacity-b" },
      { kind: "execution", id: "execution-cc10:decision:capacity-b" },
    ],
  });
  assert.equal(sentinel.admitted, true);
  if (sentinel.admitted) {
    assert.equal(sentinel.fact.authority, HISTORICAL_TRUTH_AUTHORITIES.learning);
    assert.equal(sentinel.fact.persistence, "process-memory");
    assert.equal(sentinel.fact.timestamps[0]?.value, "core-out2:session");
    assert.equal(sentinel.fact.timestamps[0]?.semantics, "NON_CHRONOLOGICAL");
    assert.equal(sentinel.fact.timestamps[0]?.status, "non-chronological");
    assert.equal(sentinel.fact.timestamps[0]?.placeable, false);
  }

  const copied = describeHistoricalFact({
    factType: "learning-record",
    sourceKind: "core-out-2-learning",
    sourceId: "learn:capacity:fingerprint",
    recordStatus: "supported",
    fields: { createdAt: "2026-10-10T16:10:00.000Z" },
  });
  assert.equal(copied.admitted, true);
  if (copied.admitted) {
    assert.equal(copied.fact.timestamps[0]?.semantics, "UNKNOWN");
    assert.equal(copied.fact.timestamps[0]?.placeable, false);
  }

  const app4 = describeHistoricalFact({
    factType: "learning-record",
    sourceKind: "app-4",
    sourceId: "learn:capacity:fingerprint",
    recordStatus: "supported",
  });
  assert.deepEqual(app4, { admitted: false, reason: "forbidden-source" });
});

test("Scenario identity has no comparison time and Problem occurrence is unsupported", () => {
  const scenario = describeHistoricalFact({
    factType: "scenario-identity",
    sourceKind: "cc9-scenario",
    sourceId: "cc9:scenario:do-nothing:do-nothing:v1",
    subjectIds: ["obj-capacity"],
    fields: { comparedAt: "10:05" },
  });
  assert.equal(scenario.admitted, true);
  if (scenario.admitted) {
    assert.equal(scenario.fact.timestamps[0]?.field, "comparedAt");
    assert.equal(scenario.fact.timestamps[0]?.value, null);
    assert.equal(scenario.fact.timestamps[0]?.status, "unsupported");
    assert.deepEqual(scenario.fact.discardedFields, ["comparedAt"]);
  }

  const problem = describeHistoricalFact({
    factType: "problem-identified",
    sourceKind: "cc9-scenario",
    sourceId: "ctx-problem-capacity",
  });
  assert.deepEqual(problem, { admitted: false, reason: "unsupported-fact" });

  const ledger = describeHistoricalFact({
    factType: "decision-committed",
    sourceKind: "cc10-decision",
    sourceId: "tl-capacity-gap",
    recordStatus: "Approved",
  });
  assert.deepEqual(ledger, { admitted: false, reason: "presentation-ledger-id" });
});

test("Risk current-record times are not a Risk event history", () => {
  const risk = describeHistoricalFact({
    factType: "risk-current-state",
    sourceKind: "workspace-risk",
    sourceId: "wrisk_ws_capacity_2026-10-01T00:00:00.000Z",
    recordStatus: "active",
    fields: {
      createdAt: "2026-10-01T00:00:00.000Z",
      updatedAt: "2026-10-02T00:00:00.000Z",
    },
  });
  assert.equal(risk.admitted, true);
  if (risk.admitted) {
    assert.equal(risk.fact.eventHistoryComplete, false);
    assert.equal(risk.fact.timestamps[0]?.semantics, "RECORDED_TIME");
    assert.equal(risk.fact.timestamps[1]?.field, "updatedAt");
    assert.equal(risk.fact.persistence, "local-current-state");
  }
});

test("Capacity proof matrix matches the contract verdicts", () => {
  assert.deepEqual(
    HISTORICAL_TRUTH_CAPACITY_PROOF.map((entry) => [entry.statementId, entry.verdict]),
    [
      ["capacity-observed", "SUPPORTED_WITH_TIMESTAMP_SEMANTIC"],
      ["decision-committed", "SUPPORTED_WITH_TIMESTAMP_SEMANTIC"],
      ["execution-exists", "SUPPORTED_WITH_TIMESTAMP_SEMANTIC"],
      ["execution-in-progress", "SUPPORTED_WITH_TIMESTAMP_SEMANTIC"],
      ["execution-started-at", "SUPPORTED_WITH_TIMESTAMP_SEMANTIC"],
      ["execution-completed-at", "SUPPORTED_WITH_TIMESTAMP_SEMANTIC"],
      ["outcome-evaluated-on-friday", "UNSUPPORTED"],
      ["learning-supported", "SUPPORTED_WITHOUT_OCCURRENCE_TIME"],
      ["problem-identified-at", "UNSUPPORTED"],
      ["scenario-compared-at", "UNSUPPORTED"],
    ],
  );
  assert.equal(historicalTruthStatement("execution-started-at").timestampSemantics, "RECORDED_TIME");
  assert.equal(historicalTruthStatement("execution-started-at").note.includes("business occurrence"), true);
  assert.equal(historicalTruthStatement("problem-identified-at").truthClass, "PRESENTATION_ONLY");
  assert.equal(historicalTruthStatement("capacity-observed").timestampSemantics.includes("OBSERVED_TIME"), true);
  assert.equal(historicalTruthStatement("capacity-observed").timestampSemantics.includes("COMMITTED_TIME"), true);
  assert.equal(historicalTruthStatement("decision-committed").timestampSemantics, "RECORDED_TIME");
  assert.equal(
    HISTORICAL_TRUTH_CAPACITY_PROOF.every((entry) => entry.authority.length > 0),
    true,
  );
});

test("descriptions are pure and do not invent an occurrence clock", () => {
  const first = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-cc10:decision:capacity-b",
    recordStatus: "completed",
  });
  const second = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-cc10:decision:capacity-b",
    recordStatus: "completed",
  });
  assert.deepEqual(first, second);
  if (first.admitted) {
    assert.equal(
      first.fact.timestamps.some((entry) => entry.semantics === "OCCURRENCE_TIME" && entry.status === "present"),
      false,
    );
  }
});
