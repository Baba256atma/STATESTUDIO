import assert from "node:assert/strict";
import test from "node:test";
import { createNexoraCanonicalDecisionRuntime } from "./executiveDecisionRuntimeAdapter.ts";
import { createExecutiveRuntimeStoreExecutionAdapter, createNexoraCanonicalExecutionRuntime, type NexoraCanonicalExecution } from "./executiveExecutionRuntimeAdapter.ts";
import { resolveNexoraExecutiveExecutionFollowUp, resolveNexoraExecutionFollowUpRequest, EXECUTIVE_EXECUTION_FOLLOW_UP_BOUNDARY } from "./executiveExecutionFollowUp.ts";

function fixture() {
  const decisions = createNexoraCanonicalDecisionRuntime();
  for (const [decisionId, action] of [["approved", "approve"], ["review", "defer"]] as const) {
    decisions.adapter.transitionDecision({ decisionId, action, title: decisionId, workspaceId: "w", modelId: "m", rationale: { summary: `Because ${decisionId}`, goalIds: [], problemIds: [], evidenceRefs: [], uncertaintyRefs: [] } });
  }
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisions.adapter });
  return { decisions, executions };
}

test("CC:11 identity boundary forbids parallel and external writers", () => {
  assert.deepEqual(EXECUTIVE_EXECUTION_FOLLOW_UP_BOUNDARY, {
    canonicalExecutionWriter: false, delegatesMutationsToCanonicalRuntime: true,
    mutatesDecision: false, mutatesStage: false, movesCamera: false, mutatesTopology: false,
    createsTasks: false, assignsOwners: false, createsDeadlines: false, externalSideEffects: false,
  });
});

test("minimal execution language stays distinct from Decision commitment", () => {
  assert.deepEqual(resolveNexoraExecutionFollowUpRequest("Start execution for Decision B."), { action: "start", targetHint: "decision b", requiresContext: false });
  assert.deepEqual(resolveNexoraExecutionFollowUpRequest("What's blocking this?"), { action: "blockers", targetHint: null, requiresContext: true });
  assert.deepEqual(resolveNexoraExecutionFollowUpRequest("Mark this complete."), { action: "transition", transitionAction: "complete", targetHint: null, requiresContext: true });
  assert.equal(resolveNexoraExecutionFollowUpRequest("Approve B."), null);
  assert.equal(resolveNexoraExecutionFollowUpRequest("Create five tasks for this."), null);
});

test("approved Decision creates and starts exactly one canonical Execution", () => {
  const { decisions, executions } = fixture();
  const run = () => resolveNexoraExecutiveExecutionFollowUp({ action: "start", decisionId: "approved", decisionRuntime: decisions.adapter, executionRuntime: executions });
  const first = run(); const second = run();
  assert.equal(first.assessment?.status, "in-progress");
  assert.equal(second.executionId, first.executionId);
  assert.equal(executions.listExecutions().length, 1);
  assert.equal(executions.getExecution(first.executionId!)?.decisionId, "approved");
});

test("non-approved and missing Decisions create nothing atomically", () => {
  const { decisions, executions } = fixture();
  const deferred = resolveNexoraExecutiveExecutionFollowUp({ action: "start", decisionId: "review", decisionRuntime: decisions.adapter, executionRuntime: executions });
  const missing = resolveNexoraExecutiveExecutionFollowUp({ action: "start", decisionId: "moon", decisionRuntime: decisions.adapter, executionRuntime: executions });
  assert.equal(deferred.status, "blocked"); assert.equal(missing.status, "not-found");
  assert.equal(executions.listExecutions().length, 0);
});

test("follow-up never invents progress, owner, blocker, milestone, or deadline", () => {
  const { decisions, executions } = fixture();
  const created = executions.createExecution({ decisionId: "approved" }).execution!;
  for (const action of ["progress", "owner", "blockers", "milestones", "deadline"] as const) {
    const result = resolveNexoraExecutiveExecutionFollowUp({ action, executionId: created.executionId, decisionRuntime: decisions.adapter, executionRuntime: executions });
    assert.equal(result.assessment?.progress, null);
    assert.deepEqual(result.assessment?.blockers, []); assert.deepEqual(result.assessment?.nextMilestones, []);
  }
});

test("trusted execution evidence is read without conflating risks and blockers", () => {
  const { decisions } = fixture();
  const canonical: NexoraCanonicalExecution = { executionId: "e", decisionId: "approved", title: "Implement", status: "blocked", progress: 50,
    ownerIds: ["person:coo"], blockers: [{ blockerId: "b", label: "Procurement approval" }], risks: [{ riskId: "r", label: "Schedule erosion" }],
    milestones: [{ milestoneId: "mi", label: "Installation", deadline: "2026-08-01" }], source: "runtime", createdFromDecision: true, workspaceId: "w", modelId: "m" };
  const executions = createNexoraCanonicalExecutionRuntime({ decisionRuntime: decisions.adapter, initialExecutions: [canonical] });
  const result = resolveNexoraExecutiveExecutionFollowUp({ action: "review", executionId: "e", asOf: "2026-08-15", decisionRuntime: decisions.adapter, executionRuntime: executions });
  assert.equal(result.assessment?.progress, 50); assert.equal(result.assessment?.attentionLevel, "critical");
  assert.equal(result.assessment?.blockers[0]?.blockerId, "b"); assert.equal(result.assessment?.risks[0]?.riskId, "r");
  assert.deepEqual(result.assessment?.overdueItems, ["mi"]);
});

test("illegal transition is atomic; completion/cancellation require confirmation", () => {
  const { decisions, executions } = fixture();
  const e = executions.createExecution({ decisionId: "approved" }).execution!;
  const illegal = resolveNexoraExecutiveExecutionFollowUp({ action: "transition", executionId: e.executionId, transitionAction: "complete", confirmed: true, decisionRuntime: decisions.adapter, executionRuntime: executions });
  assert.equal(illegal.status, "blocked"); assert.equal(executions.getExecution(e.executionId)?.status, "planned");
  const confirmation = resolveNexoraExecutiveExecutionFollowUp({ action: "transition", executionId: e.executionId, transitionAction: "cancel", decisionRuntime: decisions.adapter, executionRuntime: executions });
  assert.equal(confirmation.status, "confirmation-required"); assert.equal(executions.getExecution(e.executionId)?.status, "planned");
});

test("execution transitions never rewrite canonical Decision", () => {
  const { decisions, executions } = fixture();
  const e = executions.createExecution({ decisionId: "approved" }).execution!;
  executions.transitionExecution({ executionId: e.executionId, action: "prepare" });
  executions.transitionExecution({ executionId: e.executionId, action: "start" });
  executions.transitionExecution({ executionId: e.executionId, action: "block" });
  assert.equal(decisions.adapter.getDecision("approved")?.status, "Approved");
});

test("why reads Decision and reconsider/scenario/recommend hand off", () => {
  const { decisions, executions } = fixture();
  const e = executions.createExecution({ decisionId: "approved" }).execution!;
  const base = { executionId: e.executionId, decisionRuntime: decisions.adapter, executionRuntime: executions };
  assert.equal(resolveNexoraExecutiveExecutionFollowUp({ ...base, action: "why" }).decisionRationale, "Because approved");
  assert.equal(resolveNexoraExecutiveExecutionFollowUp({ ...base, action: "reconsider" }).handoff, "CC:10");
  assert.equal(resolveNexoraExecutiveExecutionFollowUp({ ...base, action: "scenario" }).handoff, "CC:9");
  assert.equal(resolveNexoraExecutiveExecutionFollowUp({ ...base, action: "recommend" }).handoff, "CC:8");
});

test("workspace/model scope mismatch cannot create a dangling execution", () => {
  const { decisions, executions } = fixture();
  const result = executions.createExecution({ decisionId: "approved", workspaceId: "other" });
  assert.equal(result.status, "scope-mismatch"); assert.equal(executions.listExecutions().length, 0);
});

test("EXS1 UI and conversation converge through the live store adapter", () => {
  const { decisions } = fixture();
  let plan = { id: "plan", decisionId: "approved", name: "Capacity", owner: "COO", status: "Idle" as "Idle" | "Running" | "Paused" | "Completed" | "Cancelled",
    tasks: [{ id: "task", name: "Procurement", owner: "Ops", status: "Blocked", progress: 25, health: "Blocked" }] };
  const store = { getState: () => ({ execution: { plan } }), actions: {
    startExecution: () => { plan = { ...plan, status: "Running" }; }, pauseExecution: () => { plan = { ...plan, status: "Paused" }; },
    resumeExecution: () => { plan = { ...plan, status: "Running" }; }, completeExecution: () => { plan = { ...plan, status: "Completed" }; },
    cancelExecution: () => { plan = { ...plan, status: "Cancelled" }; },
  } };
  const adapter = createExecutiveRuntimeStoreExecutionAdapter(store, decisions.adapter);
  assert.equal(adapter.createExecution({ decisionId: "approved" }).status, "reused");
  assert.equal(adapter.transitionExecution({ executionId: "plan", action: "start" }).execution?.status, "in-progress");
  assert.equal(store.getState().execution.plan.status, "Running");
  assert.equal(adapter.getExecution("plan")?.blockers[0]?.label, "Procurement");
});
