/**
 * NPA-T TIMELINE-LIVE:1 — Timeline and Activity presentation proofs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ExecutiveTimelineDock } from "../../executive/exs1/shell/ExecutiveTimelineDock.tsx";
import { NexoraFlowJournalExplorer } from "../../executive/nex-mvp/flow/NexoraFlowJournalExplorer.tsx";
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
import { createInitialNexoraMVPFlowDomainState } from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
import { HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL } from "./historicalTruthContract.ts";
import {
  HISTORICAL_PRESENTATION_BOUNDARY,
  collectLiveHistoricalObservations,
  historicalActivityEntry,
  historicalLensRange,
  historicalPresentationNavigationSubject,
  historicalPresentationRisk,
  readCanonicalHistoricalPresentation,
  type HistoricalPresentationItem,
} from "./historicalTruthPresentation.ts";

const T1 = "2026-08-15T10:00:00.000Z";
const T2 = "2026-08-15T11:00:00.000Z";
const T3 = "2026-08-15T12:00:00.000Z";
const T4 = "2026-08-15T13:00:00.000Z";
const T5 = "2026-08-15T14:00:00.000Z";
const SUBJECT = "obj-capacity";
const DECISION_ID = "ctx-decision-capacity";
const EXECUTION_ID = "execution-ctx-decision-capacity";
const OBSERVATION_ID = "csv:import-capacity:kpi.production.capacity-utilization";

function steppingClock(values: readonly string[]) {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)] ?? T5;
}

function approvedDecision(committedAt: string | undefined = T1) {
  const decisions = createNexoraCanonicalDecisionRuntime();
  const approved = decisions.adapter.transitionDecision({
    decisionId: DECISION_ID,
    action: "approve",
    title: "Expand Capacity",
    subjectIds: [SUBJECT],
    committedAt,
    workspaceId: "w",
    modelId: "m",
  });
  assert.equal(approved.status, "applied");
  return decisions;
}

function observation(): CsvPublishedKpiObservation {
  return Object.freeze({
    observationId: OBSERVATION_ID,
    workspaceId: "ws-capacity",
    sourceContextId: "src-capacity",
    importId: "import-capacity",
    kpiId: "kpi.production.capacity-utilization",
    objectKey: SUBJECT,
    nexoraObjectId: SUBJECT,
    value: 68,
    unit: "%",
    observedAt: T4,
    committedAt: T5,
  });
}

function capture(): CapturedOutcomeObservation {
  return Object.freeze({
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
}

function learning(): GroundedLearningCandidate {
  return Object.freeze({
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
}

function packs(items: readonly HistoricalPresentationItem[]) {
  return items.map((item) =>
    Object.freeze({
      id: item.projectionKey,
      title: item.title,
      risk: historicalPresentationRisk(item.tone),
      timeLabel: item.timeLabel,
      placeable: item.placeable,
      sourceId: item.sourceId,
      factType: item.factType,
      projectionKey: item.projectionKey,
      group: item.group,
    }),
  );
}

test("presentation boundary formats projection rows and ignores legacy history", () => {
  assert.equal(HISTORICAL_PRESENTATION_BOUNDARY.readsFlowTimeline, false);
  assert.equal(HISTORICAL_PRESENTATION_BOUNDARY.readsJournalPacks, false);
  assert.equal(HISTORICAL_PRESENTATION_BOUNDARY.persists, false);
  const source = readFileSync(new URL("./historicalTruthPresentation.ts", import.meta.url), "utf8");
  assert.equal(source.includes("nexoraMVPExecutiveFlow"), false);
  assert.equal(/state\.timelineEvents/.test(source), false);
  assert.equal(/state\.journalPacks/.test(source), false);
  assert.equal(source.includes("sessionStorage"), false);
  assert.equal(source.includes("localStorage"), false);
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  assert.equal(shell.includes("readCanonicalHistoricalPresentation"), true);
  assert.equal(shell.includes("collectLiveHistoricalObservations"), true);
  assert.equal(shell.includes("mapNexoraMVPTimelinePacks"), false);
  assert.equal(shell.includes("projectSceneOrgManagerActivity"), false);
});

test("Proof A — Timeline uses the projection", () => {
  const decisions = approvedDecision();
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    subjectLabel: "Capacity",
    decisions: decisions.adapter.listDecisions(),
  });
  const html = renderToStaticMarkup(
    React.createElement(ExecutiveTimelineDock, {
      lens: "year",
      packs: packs(history.timeline),
      selectedPackId: null,
      onSelectLens: () => undefined,
      onSelectPack: () => undefined,
      historySource: "canonical-projection",
      historySubjectId: SUBJECT,
    }),
  );
  assert.match(html, /Decision approved/);
  assert.match(html, /data-source-id="ctx-decision-capacity"/);
  assert.match(html, /data-fact-type="decision-approved"/);
  assert.match(html, /data-placeable="true"/);
  assert.match(html, /2026-08-15 10:00 UTC/);
  assert.doesNotMatch(html, /Capacity Gap identified/);
});

test("Proof B — Activity uses the same projection facts", () => {
  const decisions = approvedDecision();
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
  });
  const html = renderToStaticMarkup(
    React.createElement(NexoraFlowJournalExplorer, {
      entries: history.activity.map((item) => historicalActivityEntry(item)),
      selectedId: null,
      onSelect: () => undefined,
      historySource: "canonical-projection",
      historySubjectId: SUBJECT,
      emptyLabel: "No supported history yet",
    }),
  );
  assert.match(html, /Decision approved/);
  assert.match(html, /data-source-id="ctx-decision-capacity"/);
  assert.deepEqual(
    history.activity.map((item) => item.projectionKey).sort(),
    history.timeline.map((item) => item.projectionKey).sort(),
  );
});

test("Proof C — legacy fixture rows do not become manager history", () => {
  const legacy = createInitialNexoraMVPFlowDomainState();
  assert.equal(legacy.timelineEvents.some((event) => event.label === "Capacity Gap identified"), true);
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: [],
    executions: [],
    observations: [],
  });
  const labels = [...history.timeline, ...history.activity].map((item) => item.title);
  assert.equal(labels.includes("Capacity Gap identified"), false);
  assert.equal(labels.includes("Margin Pressure identified"), false);
  assert.equal(history.timeline.length, 0);
});

test("Proof D — empty canonical history stays empty", () => {
  const legacy = createInitialNexoraMVPFlowDomainState();
  const history = readCanonicalHistoricalPresentation({ subjectId: SUBJECT });
  const html = renderToStaticMarkup(
    React.createElement(ExecutiveTimelineDock, {
      lens: "week",
      packs: packs(history.timeline),
      selectedPackId: null,
      onSelectLens: () => undefined,
      onSelectPack: () => undefined,
      emptyLabel: "No supported history yet",
    }),
  );
  assert.match(html, /No supported history yet/);
  assert.equal(legacy.journalPacks.length > 0, true);
  assert.doesNotMatch(html, /Capacity Gap|Margin Pressure|pack-problem/);
});

test("Proof E — Execution lifecycle appears once each", () => {
  const decisions = approvedDecision();
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: steppingClock([T2, T3, T5]),
  });
  executions.createExecution({ decisionId: DECISION_ID });
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "prepare" });
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "start" });
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "complete" });
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
  });
  for (const factType of ["execution-created", "execution-started", "execution-completed"] as const) {
    assert.equal(history.timeline.filter((item) => item.factType === factType).length, 1);
    assert.equal(history.activity.filter((item) => item.factType === factType).length, 1);
  }
  const started = history.timeline.find((item) => item.factType === "execution-started");
  assert.equal(started?.orderingTimestamp, T3);
  assert.equal(started?.timeLabel, "2026-08-15 12:00 UTC");
});

test("Proof F — blocked status stays unplaced", () => {
  const decisions = approvedDecision();
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: () => T2,
  });
  const created = executions.createExecution({ decisionId: DECISION_ID });
  assert.equal(created.status, "created");
  const blocked: NexoraCanonicalExecution = Object.freeze({
    ...executions.listExecutions()[0]!,
    status: "blocked",
    createdAt: null,
    startedAt: null,
    completedAt: null,
  });
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    executions: [blocked],
  });
  const current = history.unplaced.find((item) => item.factType === "execution-current-status");
  assert.equal(current?.title, "Current status: Blocked");
  assert.equal(current?.timeLabel, "Time unknown");
  assert.equal(current?.placeable, false);
  assert.equal(history.timeline.some((item) => /blocked at/i.test(item.title)), false);
  assert.equal(history.chronological.some((item) => item.factType.startsWith("execution-")), false);
});

test("Proof G — observation is one measurement and capture is a link", () => {
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    subjectLabel: "Capacity",
    observations: [observation()],
    outcomeCaptures: [capture()],
  });
  const measurements = history.timeline.filter((item) => item.title.includes("68"));
  assert.equal(measurements.length, 1);
  assert.equal(measurements[0]?.factType, "observation-recorded");
  assert.equal(measurements[0]?.timeLabel, "2026-08-15 13:00 UTC");
  assert.match(measurements[0]?.detail ?? "", /Imported at 2026-08-15 14:00 UTC/);
  const link = history.timeline.find((item) => item.factType === "outcome-capture-link");
  assert.equal(link?.title, "Outcome observation captured");
  assert.equal(link?.title.includes("68"), false);
  assert.equal(history.activity.filter((item) => item.title.includes("68")).length, 1);
});

test("Proof H — sentinel Learning has no fabricated time", () => {
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    learnings: [learning()],
  });
  const item = history.unplaced.find((entry) => entry.factType === "learning-supported");
  assert.equal(item?.timeLabel, "Time unknown");
  assert.equal(item?.placeable, false);
  assert.equal(`${item?.title} ${item?.detail} ${item?.timeLabel}`.includes("core-out2:session"), false);
  assert.equal(`${item?.title} ${item?.timeLabel}`.includes("Today"), false);
});

test("Proof I — a canonical start updates the presentation once", () => {
  const decisions = approvedDecision();
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: steppingClock([T2, T3]),
  });
  executions.createExecution({ decisionId: DECISION_ID });
  const before = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
  });
  assert.equal(before.timeline.some((item) => item.factType === "execution-started"), false);
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "prepare" });
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "start" });
  const after = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
  });
  const started = after.timeline.filter((item) => item.factType === "execution-started");
  assert.equal(started.length, 1);
  assert.equal(started[0]?.sourceId, EXECUTION_ID);
  assert.equal(started[0]?.orderingTimestamp, T3);
  assert.equal(after.activity.filter((item) => item.factType === "execution-started").length, 1);
});

test("Proof J — presentation keeps the CC:11 execution id", () => {
  const decisions = approvedDecision();
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: steppingClock([T2, T3]),
  });
  executions.createExecution({ decisionId: DECISION_ID });
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "prepare" });
  executions.transitionExecution({ executionId: EXECUTION_ID, action: "start" });
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
  });
  const started = history.timeline.find((item) => item.factType === "execution-started");
  assert.ok(started);
  assert.equal(started.sourceId, EXECUTION_ID);
  assert.notEqual(started.projectionKey, started.sourceId);
  assert.equal(historicalPresentationNavigationSubject(started), SUBJECT);
  assert.equal(started.projectionKey.startsWith("historical:"), true);
  assert.equal(history.timeline.some((item) => item.sourceId === "ctx-execution-capacity"), false);
  assert.equal(history.timeline.some((item) => item.sourceId?.startsWith("tl-")), false);
});

test("Proof K — rendering history does not change source records", () => {
  const decisions = approvedDecision();
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now: () => T2,
  });
  executions.createExecution({ decisionId: DECISION_ID });
  const input = {
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    executions: executions.listExecutions(),
    observations: [observation()],
    outcomeCaptures: [capture()],
    learnings: [learning()],
  };
  const before = JSON.stringify(input);
  const history = readCanonicalHistoricalPresentation(input);
  renderToStaticMarkup(
    React.createElement(ExecutiveTimelineDock, {
      lens: "year",
      packs: packs(history.timeline),
      selectedPackId: null,
      onSelectLens: () => undefined,
      onSelectPack: () => undefined,
    }),
  );
  renderToStaticMarkup(
    React.createElement(NexoraFlowJournalExplorer, {
      entries: history.activity.map((item) => historicalActivityEntry(item)),
      selectedId: null,
      onSelect: () => undefined,
    }),
  );
  assert.equal(JSON.stringify(input), before);
  assert.equal(history.persisted, false);
  assert.equal(history.establishesCausation, false);
});

test("Proof L — Timeline and Activity agree on fact existence", () => {
  const decisions = approvedDecision();
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    subjectLabel: "Capacity",
    decisions: decisions.adapter.listDecisions(),
    observations: [observation()],
    outcomeCaptures: [capture()],
    outcomeAssessments: [
      projectLiveOutcomeIntelligence({
        subjectId: SUBJECT,
        decisionId: DECISION_ID,
        executionId: EXECUTION_ID,
      }),
    ],
    learnings: [learning()],
    range: historicalLensRange("year", "2026-10-10T16:00:00.000Z") ?? undefined,
  });
  assert.deepEqual(
    new Set(history.timeline.map((item) => item.projectionKey)),
    new Set(history.activity.map((item) => item.projectionKey)),
  );
  assert.deepEqual(
    history.timeline.map((item) => item.factType),
    [...history.chronological, ...history.unplaced].map((item) => item.factType),
  );
  assert.notDeepEqual(
    history.activity.map((item) => item.factType),
    history.timeline.map((item) => item.factType),
  );
  const week = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    decisions: decisions.adapter.listDecisions(),
    learnings: [learning()],
    range: historicalLensRange("week", "2026-10-10T16:00:00.000Z") ?? undefined,
  });
  assert.equal(week.chronological.some((item) => item.factType === "decision-approved"), false);
  assert.equal(week.unplaced.some((item) => item.factType === "learning-supported"), true);
});

test("Proof M — Timeline and Activity agree on the live Capacity observation", () => {
  const collected = collectLiveHistoricalObservations({
    datasetId: "nexora.executive-operations.demo.baseline",
    snapshotKpis: [
      Object.freeze({
        kpiId: "kpi.production.capacity-utilization",
        objectKey: "production",
        nexoraObjectId: "nexora.executive-operations.object.production",
        value: 87,
        unit: "%",
        calculatedAt: "2026-08-10T00:00:00.000Z",
      }),
    ],
  });
  const history = readCanonicalHistoricalPresentation({
    subjectId: SUBJECT,
    subjectLabel: "Capacity",
    observations: collected,
  });
  assert.equal(history.chronological.length, 1);
  assert.equal(history.activity.length, 1);
  assert.equal(history.timeline[0]?.sourceId, history.activity[0]?.sourceId);
  assert.equal(history.timeline[0]?.factType, "observation-recorded");
  assert.equal(history.timeline[0]?.timeLabel, "2026-08-10 00:00 UTC");
  assert.match(history.timeline[0]?.title ?? "", /Capacity observed at 87/);
  const timelineHtml = renderToStaticMarkup(
    React.createElement(ExecutiveTimelineDock, {
      lens: "year",
      packs: packs(history.timeline),
      selectedPackId: null,
      onSelectLens: () => undefined,
      onSelectPack: () => undefined,
      historySource: "canonical-projection",
      historySubjectId: SUBJECT,
      chronologicalCount: history.chronological.length,
      unplacedCount: history.unplaced.length,
    }),
  );
  const activityHtml = renderToStaticMarkup(
    React.createElement(NexoraFlowJournalExplorer, {
      entries: history.activity.map(historicalActivityEntry),
      selectedId: null,
      onSelect: () => undefined,
      emptyLabel: "No supported history yet",
      historySubjectId: SUBJECT,
      historySource: "canonical-projection",
    }),
  );
  assert.match(timelineHtml, /data-fact-type="observation-recorded"/);
  assert.match(activityHtml, /data-fact-type="observation-recorded"/);
  assert.doesNotMatch(timelineHtml + activityHtml, /Capacity Gap identified/);
});
