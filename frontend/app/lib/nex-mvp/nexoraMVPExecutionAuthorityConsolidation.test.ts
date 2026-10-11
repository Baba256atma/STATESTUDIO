/** NPA-T TIMELINE-FIX:1 — Execution status has one live owner, CC:11. */

import assert from "node:assert/strict";
import test from "node:test";

import { resolveNexoraExecutiveExecutionFollowUp } from "../conversational-control/executiveExecutionFollowUp.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import { describeHistoricalFact } from "../historical-truth/historicalTruthContract.ts";
import { createNexoraMVPFlowSeededDecisionRuntime } from "./nexoraMVPExecutiveDecisionCommitment.ts";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  flowExecutionCanonicalId,
  projectNexoraMVPFlowExecutionsFromCanonicalRuntime,
} from "./nexoraMVPExecutiveFlow.ts";

function approvedCapacity(now?: () => string) {
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    ...(now ? { now } : {}),
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
  if (!approved.ok) throw new Error("capacity decision did not approve");
  return { decisionRuntime, executionRuntime, state: approved.state };
}

test("Proof A — flow start writes CC:11 in-progress and projects that status", () => {
  const { decisionRuntime, executionRuntime, state } = approvedCapacity(
    () => "2026-10-10T21:00:00.000Z",
  );
  const started = applyNexoraMVPFlowDomainAction(
    state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    {
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      occurredAt: "2026-10-10T20:40:00.000Z",
    },
  );
  assert.equal(started.ok, true);
  const canonical = executionRuntime.findExecutionByDecisionId("ctx-decision-capacity");
  assert.equal(canonical?.executionId, "execution-ctx-decision-capacity");
  assert.equal(canonical?.status, "in-progress");
  assert.equal(canonical?.startedAt, "2026-10-10T21:00:00.000Z");
  assert.notEqual(canonical?.startedAt, "2026-10-10T20:40:00.000Z");
  assert.equal(canonical?.completedAt, null);
  if (!started.ok) return;
  const projected = started.state.executions.find((entry) => entry.id === "ctx-execution-capacity");
  assert.equal(projected?.status, "in-progress");
  assert.notEqual(projected?.id, canonical?.executionId);
  assert.equal(
    flowExecutionCanonicalId(executionRuntime, "ctx-decision-capacity"),
    "execution-ctx-decision-capacity",
  );
});

test("Proof B — flow complete writes CC:11 completed and the projection agrees", () => {
  const { decisionRuntime, executionRuntime, state } = approvedCapacity();
  const started = applyNexoraMVPFlowDomainAction(
    state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    { decisionRuntime: decisionRuntime.adapter, executionRuntime },
  );
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const completed = applyNexoraMVPFlowDomainAction(
    started.state,
    {
      actionId: "act-exec-complete",
      subjectId: "ctx-execution-capacity",
      kind: "complete-execution",
    },
    { decisionRuntime: decisionRuntime.adapter, executionRuntime },
  );
  assert.equal(completed.ok, true);
  assert.equal(
    executionRuntime.findExecutionByDecisionId("ctx-decision-capacity")?.status,
    "completed",
  );
  if (!completed.ok) return;
  assert.equal(
    completed.state.executions.find((entry) => entry.id === "ctx-execution-capacity")?.status,
    "complete",
  );
});

test("Proof C — conversation start and the flow button share one CC:11 Execution", () => {
  const { decisionRuntime, executionRuntime, state } = approvedCapacity();
  const conversation = resolveNexoraExecutiveExecutionFollowUp({
    action: "start",
    decisionId: "ctx-decision-capacity",
    executionRuntime,
    decisionRuntime: decisionRuntime.adapter,
  });
  assert.equal(conversation.executionId, "execution-ctx-decision-capacity");
  assert.equal(conversation.assessment?.status, "in-progress");
  const button = applyNexoraMVPFlowDomainAction(
    state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    { decisionRuntime: decisionRuntime.adapter, executionRuntime },
  );
  assert.equal(button.ok, false);
  if (button.ok) return;
  assert.equal(button.reason, "duplicate");
  assert.equal(executionRuntime.listExecutions().length, 1);
  assert.equal(
    button.state.executions.find((entry) => entry.id === "ctx-execution-capacity")?.status,
    "in-progress",
  );
  assert.equal(
    button.state.executions.some((entry) => entry.id === "ctx-execution-capacity"),
    true,
  );
  assert.equal(
    button.state.executions.filter((entry) => entry.sourceDecisionId === "ctx-decision-capacity").length,
    1,
  );
});

test("Proof D — a rejected CC:11 transition does not claim flow success", () => {
  const decisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
  });
  const state = createInitialNexoraMVPFlowDomainState();
  const beforeEvents = state.timelineEvents.length;
  const started = applyNexoraMVPFlowDomainAction(
    state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    { decisionRuntime: decisionRuntime.adapter, executionRuntime },
  );
  assert.equal(started.ok, false);
  assert.equal(started.state.timelineEvents.length, beforeEvents);
  assert.equal(
    started.state.executions.find((entry) => entry.id === "ctx-execution-capacity")?.status,
    "planned",
  );
  assert.equal(executionRuntime.listExecutions().length, 0);
  assert.equal(
    started.state.journalPacks.some((pack) => pack.id.includes("ctx-execution-capacity-started")),
    false,
  );
});

test("Proof E — flow occurredAt is not an Execution timestamp", () => {
  const { decisionRuntime, executionRuntime, state } = approvedCapacity(
    () => "2026-10-10T21:05:00.000Z",
  );
  const started = applyNexoraMVPFlowDomainAction(
    state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    {
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      occurredAt: "2026-10-10T20:40:00.000Z",
    },
  );
  assert.equal(started.ok, true);
  const canonical = executionRuntime.findExecutionByDecisionId("ctx-decision-capacity");
  assert.equal(canonical?.status, "in-progress");
  assert.equal(canonical?.createdAt, "2026-10-10T21:05:00.000Z");
  assert.equal(canonical?.startedAt, "2026-10-10T21:05:00.000Z");
  assert.notEqual(canonical?.startedAt, "2026-10-10T20:40:00.000Z");
  assert.equal(canonical?.completedAt, null);
  if (!started.ok) return;
  const journal = started.state.timelineEvents.find((event) => event.id === "tl-ctx-execution-capacity-started");
  assert.equal(journal?.occurredAt, "2026-10-10T20:40:00.000Z");
  assert.notEqual(journal?.subjectId, canonical?.executionId);
});

test("Proof F — Historical Truth still refuses fixture Execution identity and flow time", () => {
  const refusedId = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "ctx-execution-capacity",
    recordStatus: "in-progress",
  });
  assert.deepEqual(refusedId, { admitted: false, reason: "flow-execution-id" });
  const refusedTime = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-ctx-decision-capacity",
    recordStatus: "in-progress",
    fields: { occurredAt: "2026-10-10T20:40:00.000Z" },
  });
  assert.deepEqual(refusedTime, { admitted: false, reason: "presentation-timestamp" });
  const admitted = describeHistoricalFact({
    factType: "execution-status",
    sourceKind: "cc11-execution",
    sourceId: "execution-ctx-decision-capacity",
    recordStatus: "in-progress",
  });
  assert.equal(admitted.admitted, true);
  if (admitted.admitted) {
    assert.equal(admitted.fact.timestamps.find((entry) => entry.field === "startedAt")?.status, "missing");
    assert.equal(admitted.fact.timestamps.find((entry) => entry.field === "startedAt")?.semantics, "RECORDED_TIME");
    assert.equal(admitted.fact.timestamps.find((entry) => entry.field === "startedAt")?.value, null);
  }
});

test("pause does not establish a status and unbacked fixture progress is not canonical", () => {
  const { decisionRuntime, executionRuntime, state } = approvedCapacity();
  const started = applyNexoraMVPFlowDomainAction(
    state,
    {
      actionId: "act-exec-cap-start-exec",
      subjectId: "ctx-execution-capacity",
      kind: "start-execution",
    },
    { decisionRuntime: decisionRuntime.adapter, executionRuntime },
  );
  assert.equal(started.ok, true);
  if (!started.ok) return;
  const paused = applyNexoraMVPFlowDomainAction(
    started.state,
    {
      actionId: "act-exec-cap-pause",
      subjectId: "ctx-execution-capacity",
      kind: "pause-execution",
    },
    {
      decisionRuntime: decisionRuntime.adapter,
      executionRuntime,
      occurredAt: "2026-10-10T20:41:00.000Z",
    },
  );
  assert.equal(paused.ok, false);
  if (paused.ok) return;
  assert.equal(paused.reason, "canonical-status-unsupported");
  assert.equal(
    executionRuntime.findExecutionByDecisionId("ctx-decision-capacity")?.status,
    "in-progress",
  );
  assert.equal(
    paused.state.executions.find((entry) => entry.id === "ctx-execution-capacity")?.status,
    "in-progress",
  );
  assert.equal(
    paused.state.timelineEvents.some((event) => event.kind === "execution-changed"),
    false,
  );

  const seeded = createInitialNexoraMVPFlowDomainState();
  const projected = projectNexoraMVPFlowExecutionsFromCanonicalRuntime(seeded, executionRuntime);
  assert.equal(
    projected.executions.find((entry) => entry.id === "ctx-execution-rollout")?.status,
    "planned",
  );
});
