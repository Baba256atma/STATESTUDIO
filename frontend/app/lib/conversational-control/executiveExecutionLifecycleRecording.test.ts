/**
 * NPA-T TIMELINE-FIX:2 — CC:11 owns Execution lifecycle recording time.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { describeHistoricalFact } from "../historical-truth/historicalTruthContract.ts";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  projectNexoraMVPFlowExecutionsFromCanonicalRuntime,
} from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
import { createNexoraMVPFlowSeededDecisionRuntime } from "../nex-mvp/nexoraMVPExecutiveDecisionCommitment.ts";
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";
import { resolveNexoraExecutiveExecutionFollowUp } from "./executiveExecutionFollowUp.ts";
import {
  createNexoraCanonicalExecutionRuntime,
  hydrateNexoraCanonicalExecutionRuntimeRecords,
  serializeNexoraCanonicalExecutionRuntimeState,
  type NexoraCanonicalExecutionRuntimeAdapter,
} from "./executiveExecutionRuntimeAdapter.ts";

const T1 = "2026-08-15T10:00:00.000Z";
const T2 = "2026-08-15T11:00:00.000Z";
const T3 = "2026-08-15T12:00:00.000Z";
const T4 = "2026-08-15T13:00:00.000Z";
const FLOW_OCCURRED_AT = "2026-10-10T20:40:00.000Z";

function steppingClock(values: readonly string[]) {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)] ?? T4;
}

function approvedRuntime(now: () => string) {
  const decisions = createNexoraCanonicalDecisionRuntime();
  decisions.adapter.transitionDecision({
    decisionId: "ctx-decision-capacity",
    action: "approve",
    title: "Expand Capacity",
    workspaceId: "w",
    modelId: "m",
    rationale: {
      summary: "Because capacity",
      goalIds: [],
      problemIds: [],
      evidenceRefs: [],
      uncertaintyRefs: [],
    },
  });
  const executions = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisions.adapter,
    now,
  });
  return { decisions, executions };
}

function executionOf(executions: NexoraCanonicalExecutionRuntimeAdapter) {
  const execution = executions.getExecution("execution-ctx-decision-capacity");
  assert.ok(execution);
  return execution;
}

test("Proof A — canonical creation records createdAt once", () => {
  const { executions } = approvedRuntime(steppingClock([T1, T2, T3, T4]));
  const created = executions.createExecution({ decisionId: "ctx-decision-capacity" });
  assert.equal(created.status, "created");
  const execution = executionOf(executions);
  assert.equal(execution.executionId, "execution-ctx-decision-capacity");
  assert.equal(execution.status, "planned");
  assert.equal(execution.createdAt, T1);
  assert.equal(execution.startedAt, null);
  assert.equal(execution.completedAt, null);
  const again = executions.createExecution({ decisionId: "ctx-decision-capacity" });
  assert.equal(again.status, "reused");
  assert.equal(executionOf(executions).createdAt, T1);
});

test("Proof B — canonical start records startedAt and keeps createdAt", () => {
  const { executions } = approvedRuntime(steppingClock([T1, T2, T3, T4]));
  executions.createExecution({ decisionId: "ctx-decision-capacity" });
  const prepared = executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "prepare",
  });
  assert.equal(prepared.execution?.status, "ready");
  assert.equal(prepared.execution?.startedAt, null);
  const started = executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "start",
  });
  assert.equal(started.status, "applied");
  const execution = executionOf(executions);
  assert.equal(execution.status, "in-progress");
  assert.equal(execution.createdAt, T1);
  assert.equal(execution.startedAt, T2);
  assert.equal(execution.completedAt, null);
});

test("Proof C — canonical completion records completedAt in clock order", () => {
  const { executions } = approvedRuntime(steppingClock([T1, T2, T3, T4]));
  executions.createExecution({ decisionId: "ctx-decision-capacity" });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "prepare",
  });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "start",
  });
  const completed = executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "complete",
  });
  assert.equal(completed.status, "applied");
  const execution = executionOf(executions);
  assert.equal(execution.status, "completed");
  assert.equal(execution.createdAt, T1);
  assert.equal(execution.startedAt, T2);
  assert.equal(execution.completedAt, T3);
  assert.equal(execution.createdAt <= execution.startedAt, true);
  assert.equal(execution.startedAt <= execution.completedAt!, true);
});

test("Proof D — duplicate and rejected transitions do not rewrite lifecycle times", () => {
  const clock = steppingClock([T1, T2, T3, T4]);
  const { executions } = approvedRuntime(clock);
  executions.createExecution({ decisionId: "ctx-decision-capacity" });
  const rejected = executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "complete",
  });
  assert.equal(rejected.status, "transition-not-allowed");
  assert.equal(executionOf(executions).completedAt, null);
  assert.equal(executionOf(executions).createdAt, T1);
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "prepare",
  });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "start",
  });
  const duplicate = executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "start",
  });
  assert.equal(duplicate.status, "reused");
  assert.equal(executionOf(executions).startedAt, T2);
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "block",
  });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "resume",
  });
  const afterResume = executionOf(executions);
  assert.equal(afterResume.status, "in-progress");
  assert.equal(afterResume.createdAt, T1);
  assert.equal(afterResume.startedAt, T2);
  assert.equal(afterResume.completedAt, null);
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "complete",
  });
  const repeat = executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "complete",
  });
  assert.equal(repeat.status, "reused");
  assert.equal(executionOf(executions).completedAt, T3);
  assert.equal(clock(), T4);
});

test("Proof E — flow start records the CC:11 clock, not flow occurredAt", () => {
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    now: steppingClock([T1, T2]),
  });
  const approved = applyNexoraMVPFlowDomainAction(
    createInitialNexoraMVPFlowDomainState(),
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-capacity",
      kind: "approve-decision",
    },
    { decisionRuntime: decisionRuntime.adapter, occurredAt: FLOW_OCCURRED_AT },
  );
  assert.equal(approved.ok, true);
  if (!approved.ok) return;
  const started = applyNexoraMVPFlowDomainAction(
    approved.state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    {
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      occurredAt: FLOW_OCCURRED_AT,
    },
  );
  assert.equal(started.ok, true);
  const canonical = executionRuntime.findExecutionByDecisionId("ctx-decision-capacity");
  assert.equal(canonical?.createdAt, T1);
  assert.equal(canonical?.startedAt, T2);
  assert.notEqual(canonical?.startedAt, FLOW_OCCURRED_AT);
  assert.notEqual(canonical?.createdAt, FLOW_OCCURRED_AT);
  if (!started.ok) return;
  assert.equal(
    started.state.timelineEvents.find((event) => event.id === "tl-ctx-execution-capacity-started")
      ?.occurredAt,
    FLOW_OCCURRED_AT,
  );
});

test("Proof F — conversation start and flow start share the CC:11 clock", () => {
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  decisionRuntime.adapter.transitionDecision({
    decisionId: "ctx-decision-capacity",
    action: "approve",
    title: "Expand Capacity",
  });
  decisionRuntime.adapter.transitionDecision({
    decisionId: "ctx-decision-reprice",
    action: "approve",
    title: "Approve Repricing",
  });
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    now: steppingClock([T1, T2, T3, T4]),
  });
  const conversation = resolveNexoraExecutiveExecutionFollowUp({
    action: "start",
    decisionId: "ctx-decision-capacity",
    executionRuntime,
    decisionRuntime: decisionRuntime.adapter,
    asOf: FLOW_OCCURRED_AT,
  });
  assert.equal(conversation.executionId, "execution-ctx-decision-capacity");
  const capacity = executionRuntime.getExecution("execution-ctx-decision-capacity");
  assert.equal(capacity?.createdAt, T1);
  assert.equal(capacity?.startedAt, T2);
  assert.notEqual(capacity?.startedAt, FLOW_OCCURRED_AT);
  const projected = projectNexoraMVPFlowExecutionsFromCanonicalRuntime(
    createInitialNexoraMVPFlowDomainState(),
    executionRuntime,
  );
  const flow = applyNexoraMVPFlowDomainAction(
    projected,
    {
      actionId: "act-exec-rollout-start",
      subjectId: "ctx-execution-rollout",
      kind: "start-execution",
    },
    {
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      occurredAt: FLOW_OCCURRED_AT,
    },
  );
  assert.equal(flow.ok, true);
  const rollout = executionRuntime.getExecution("execution-ctx-decision-reprice");
  assert.equal(rollout?.createdAt, T3);
  assert.equal(rollout?.startedAt, T4);
  assert.notEqual(rollout?.startedAt, FLOW_OCCURRED_AT);
  assert.equal(capacity?.startedAt, T2);
});

test("Proof G — persistence keeps canonical identity and lifecycle times", () => {
  const { executions } = approvedRuntime(steppingClock([T1, T2, T3, T4]));
  executions.createExecution({ decisionId: "ctx-decision-capacity" });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "prepare",
  });
  executions.transitionExecution({
    executionId: "execution-ctx-decision-capacity",
    action: "start",
  });
  const serialized = serializeNexoraCanonicalExecutionRuntimeState(executions.getState());
  let clockCalls = 0;
  const { decisions, executions: restored } = approvedRuntime(() => {
    clockCalls += 1;
    return "2099-01-01T00:00:00.000Z";
  });
  const hydrated = hydrateNexoraCanonicalExecutionRuntimeRecords(serialized, []);
  restored.hydrateExecutions(hydrated);
  const execution = restored.getExecution("execution-ctx-decision-capacity");
  assert.equal(execution?.executionId, "execution-ctx-decision-capacity");
  assert.equal(execution?.status, "in-progress");
  assert.equal(execution?.createdAt, T1);
  assert.equal(execution?.startedAt, T2);
  assert.equal(execution?.completedAt, null);
  assert.equal(clockCalls, 0);
  assert.equal(decisions.adapter.getDecision("ctx-decision-capacity")?.status, "Approved");
});

test("Proof H — legacy untimed records stay untimed", () => {
  const legacy = JSON.stringify({
    version: 1,
    executions: [
      {
        executionId: "execution-ctx-decision-capacity",
        decisionId: "ctx-decision-capacity",
        title: "Capacity Expansion",
        status: "in-progress",
        ownerIds: [],
        blockers: [],
        risks: [],
        milestones: [],
        source: "conversation",
        createdFromDecision: true,
        workspaceId: null,
        modelId: null,
      },
    ],
  });
  let clockCalls = 0;
  const { executions } = approvedRuntime(() => {
    clockCalls += 1;
    return "2099-01-01T00:00:00.000Z";
  });
  const hydrated = hydrateNexoraCanonicalExecutionRuntimeRecords(legacy, []);
  executions.hydrateExecutions(hydrated);
  const execution = executions.getExecution("execution-ctx-decision-capacity");
  assert.equal(execution?.status, "in-progress");
  assert.equal(execution?.createdAt, null);
  assert.equal(execution?.startedAt, null);
  assert.equal(execution?.completedAt, null);
  assert.equal(clockCalls, 0);
});

test("Proof I — Historical Truth admits CC:11 recording time and refuses presentation chronology", () => {
  const admitted = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-ctx-decision-capacity",
    recordStatus: "completed",
    fields: {
      createdAt: T1,
      startedAt: T2,
      completedAt: T3,
    },
  });
  assert.equal(admitted.admitted, true);
  if (admitted.admitted) {
    assert.equal(admitted.fact.sourceId, "execution-ctx-decision-capacity");
    assert.deepEqual(
      admitted.fact.timestamps.map((entry) => [entry.field, entry.semantics, entry.value]),
      [
        ["createdAt", "RECORDED_TIME", T1],
        ["startedAt", "RECORDED_TIME", T2],
        ["completedAt", "RECORDED_TIME", T3],
      ],
    );
    assert.equal(admitted.fact.eventHistoryComplete, false);
  }
  assert.deepEqual(
    describeHistoricalFact({
      factType: "execution-status",
      sourceKind: "cc11-execution",
      sourceId: "ctx-execution-capacity",
      recordStatus: "in-progress",
      fields: { startedAt: T2 },
    }),
    { admitted: false, reason: "flow-execution-id" },
  );
  assert.deepEqual(
    describeHistoricalFact({
      factType: "execution-status",
      sourceKind: "cc11-execution",
      sourceId: "execution-ctx-decision-capacity",
      recordStatus: "in-progress",
      fields: { occurredAt: FLOW_OCCURRED_AT, startedAt: T2 },
    }),
    { admitted: false, reason: "presentation-timestamp" },
  );
  assert.deepEqual(
    describeHistoricalFact({
      factType: "execution-status",
      sourceKind: "cc11-execution",
      sourceId: "tl-ctx-execution-capacity-started",
      recordStatus: "in-progress",
    }),
    { admitted: false, reason: "presentation-ledger-id" },
  );
});

test("Proof J — historical identity is the CC:11 id, not the fixture row", () => {
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    now: () => T1,
  });
  const approved = applyNexoraMVPFlowDomainAction(
    createInitialNexoraMVPFlowDomainState(),
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-capacity",
      kind: "approve-decision",
    },
    { decisionRuntime: decisionRuntime.adapter },
  );
  assert.equal(approved.ok, true);
  if (!approved.ok) return;
  const started = applyNexoraMVPFlowDomainAction(
    approved.state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    { decisionRuntime: decisionRuntime.adapter, executionRuntime },
  );
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const row = started.state.executions.find((entry) => entry.id === "ctx-execution-capacity");
  assert.equal(row?.id, "ctx-execution-capacity");
  assert.equal(row?.canonicalExecutionId, "execution-ctx-decision-capacity");
  assert.notEqual(row?.id, row?.canonicalExecutionId);
  const described = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: row?.canonicalExecutionId,
    recordStatus: "in-progress",
    fields: { startedAt: executionRuntime.getExecution(row?.canonicalExecutionId ?? "")?.startedAt },
  });
  assert.equal(described.admitted, true);
  if (described.admitted) {
    assert.equal(described.fact.sourceId, "execution-ctx-decision-capacity");
  }
});
