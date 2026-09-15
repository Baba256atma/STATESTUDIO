import assert from "node:assert/strict";
import test from "node:test";
import type { NpsCanonicalFacts } from "./npsProblemSolvingPath.ts";
import {
  NPS_EXECUTION_MONITORING_BOUNDARY,
  attemptNpsExecutionMonitoringAdvancement,
  composeNpsExecutionMonitoring,
} from "./npsExecutionMonitoring.ts";
import { composeNpsOutcomeLearning } from "./npsOutcomeLearning.ts";
import type { NpsDecisionCommitment } from "./npsDecisionCommitment.ts";

function pathFacts(overrides: Partial<NpsCanonicalFacts> = {}): NpsCanonicalFacts {
  return Object.freeze({
    problem: Object.freeze({
      problemId: "ctx-problem-capacity",
      problemLabel: "Capacity Gap",
      confidence: "HIGH",
      observedFrom: "NPS:1",
    }),
    investigationPresent: true,
    evidenceState: "PARTIAL",
    causeHypothesesAvailable: true,
    scenarioIds: Object.freeze(["ctx-scenario-capacity"]),
    comparisonAvailable: true,
    recommendationReady: true,
    awaitingCommitment: false,
    approvedDecisionId: "dec-capacity-1",
    execution: Object.freeze({ present: false, executionId: null, status: "NONE" as const }),
    outcome: Object.freeze({ observed: false, problemResolved: null }),
    conversationSubjectId: "ctx-problem-margin",
    ...overrides,
  });
}

function commitment(overrides: Partial<NpsDecisionCommitment> = {}): NpsDecisionCommitment {
  return {
    approvedDecisionId: "dec-capacity-1",
    committedOption: "External Capacity",
    problemId: "ctx-problem-capacity",
    problemTitle: "Capacity Gap",
    unresolvedConditions: Object.freeze([]),
    npsWritesDecision: false,
    writesExecution: false,
    ...overrides,
  } as NpsDecisionCommitment;
}

test("A — NPS:7 identity is present and does not own Execution", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
  });
  assert.equal(result.identity, "NPA-T NPS:7/ExecutionMonitoring");
  assert.equal(result.npsWritesExecution, false);
  assert.equal(NPS_EXECUTION_MONITORING_BOUNDARY.executionWriter, "CC:11");
  assert.equal(NPS_EXECUTION_MONITORING_BOUNDARY.readinessOwner, "ECA:9");
  assert.equal(NPS_EXECUTION_MONITORING_BOUNDARY.monitoringOwner, "ECA:10");
});

test("B — Approved Decision exposes EXECUTION_READINESS without auto-start", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    ecaReadiness: { readiness: "READY", canonicalStartAllowed: false } as never,
  });
  assert.equal(result.path.currentState, "EXECUTION_READINESS");
  assert.equal(result.executionId, null);
  assert.equal(result.npsWritesExecution, false);
});

test("C — Unresolved Decision condition blocks CC:11", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment({
      unresolvedConditions: Object.freeze(["Supplier availability must be confirmed before execution."]),
    }),
    cc11: { managerStartIntent: true },
  });
  assert.equal(result.readinessStatus, "BLOCKED");
  assert.equal(result.executionHandoffStatus, "NOT_AUTHORIZED");
  assert.equal(result.executionId, null);
  assert.equal(attemptNpsExecutionMonitoringAdvancement(result).executionWrites, 0);
});

test("D — READY still has no executionId", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    ecaReadiness: { readiness: "READY", canonicalStartAllowed: true } as never,
  });
  assert.ok(result.readinessStatus === "READY" || result.readinessStatus === "READY_WITH_CONDITIONS" || result.readinessStatus === "ASSESSING");
  assert.equal(result.executionId, null);
  assert.notEqual(result.executionHandoffStatus, "APPLIED");
});

test("E — Explicit Start with READY is READY_FOR_CC11", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    ecaReadiness: { readiness: "READY", canonicalStartAllowed: true } as never,
    cc11: { managerStartIntent: true },
  });
  assert.equal(result.executionHandoffStatus, "READY_FOR_CC11");
  assert.equal(result.executionId, null);
  assert.notEqual(result.path.currentState, "EXECUTING");
});

test("F — CC:11 success becomes EXECUTING", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    cc11: {
      executionId: "exec-capacity-1",
      decisionId: "dec-capacity-1",
      title: "External Capacity rollout",
      status: "in-progress",
      resultStatus: "applied",
      managerStartIntent: true,
    },
  });
  assert.equal(result.executionId, "exec-capacity-1");
  assert.equal(result.path.currentState, "EXECUTING");
});

test("G — CC:11 failure is not EXECUTING", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    cc11: {
      executionId: null,
      resultStatus: "failed",
      managerStartIntent: true,
    },
  });
  assert.equal(result.executionId, null);
  assert.equal(result.executionHandoffStatus, "FAILED");
  assert.notEqual(result.path.currentState, "EXECUTING");
});

test("H — Existing Execution is reused", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    cc11: {
      executionId: "exec-capacity-1",
      decisionId: "dec-capacity-1",
      title: "External Capacity rollout",
      status: "in-progress",
      resultStatus: "reused",
      managerStartIntent: true,
    },
  });
  assert.equal(result.executionHandoffStatus, "REUSED");
  assert.equal(result.executionId, "exec-capacity-1");
});

test("I — Active Execution with progress is MONITORING", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    ecaLive: { trackStatus: "UNKNOWN", deviation: "NO_MATERIAL_DEVIATION", primaryAttentionItem: null } as never,
    cc11: {
      executionId: "exec-capacity-1",
      status: "in-progress",
      progress: 42,
      resultStatus: "applied",
    },
  });
  assert.equal(result.progress, 42);
  assert.equal(result.path.currentState, "MONITORING");
});

test("J — Unknown progress is UNKNOWN, not an estimate", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    cc11: {
      executionId: "exec-capacity-1",
      status: "in-progress",
      progress: null,
      resultStatus: "applied",
    },
  });
  assert.equal(result.progress, "UNKNOWN");
});

test("K — Canonical deviation is attention, not intervention mutation", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    ecaLive: {
      trackStatus: "OFF_TRACK",
      deviation: "UNFAVORABLE_DEVIATION",
      primaryAttentionItem: "Supplier onboarding is behind the planned milestone.",
    } as never,
    cc11: {
      executionId: "exec-capacity-1",
      status: "at-risk",
      progress: 35,
      resultStatus: "applied",
      milestones: Object.freeze([{ label: "Supplier onboarding", planned: "Sept 20", completed: false }]),
    },
  });
  assert.equal(result.attentionStatus, "ATTENTION");
  assert.equal(result.interventionStatus, "INTERVENTION_REVIEW");
  assert.equal(result.npsWritesExecution, false);
  assert.equal(result.writesDecision, false);
});

test("L — Completed Execution hands the same chain to NPS:8", () => {
  const execution = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    cc11: {
      executionId: "exec-capacity-1",
      decisionId: "dec-capacity-1",
      title: "External Capacity rollout",
      status: "completed",
      resultStatus: "applied",
    },
  });
  assert.equal(execution.outcomeReadiness, "READY_FOR_OUTCOME_REVIEW");
  assert.equal(execution.outcomeHandoff.problemId, "ctx-problem-capacity");
  assert.equal(execution.outcomeHandoff.decisionId, "dec-capacity-1");
  assert.equal(execution.outcomeHandoff.executionId, "exec-capacity-1");
  const outcome = composeNpsOutcomeLearning({
    pathFacts: pathFacts(),
    commitment: commitment() as never,
    observation: {
      decisionId: execution.outcomeHandoff.decisionId,
      executionId: execution.outcomeHandoff.executionId,
      executionStatus: execution.outcomeHandoff.executionStatus,
      evidencePresent: false,
    },
  });
  assert.equal(outcome.problemId, execution.problemId);
  assert.equal(outcome.decisionId, execution.decisionId);
  assert.equal(outcome.executionId, execution.executionId);
  assert.equal(outcome.path.currentState, "OUTCOME_REVIEW");
  assert.notEqual(outcome.resolutionStatus, "RESOLVED");
});

test("M — Stale Margin Pressure does not replace Capacity Gap Execution", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts({ conversationSubjectId: "ctx-problem-margin" }),
    commitment: commitment(),
    cc11: {
      executionId: "exec-capacity-1",
      decisionId: "dec-capacity-1",
      title: "External Capacity rollout",
      status: "in-progress",
      progress: 42,
      resultStatus: "applied",
    },
  });
  assert.equal(result.problemId, "ctx-problem-capacity");
  assert.match(result.managerProjection.text, /Capacity Gap|External Capacity/i);
  assert.doesNotMatch(result.managerProjection.text, /Margin Pressure/);
});

test("N — Monitoring alone writes nothing", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    cc11: {
      executionId: "exec-capacity-1",
      status: "in-progress",
      progress: 42,
      resultStatus: "applied",
    },
  });
  const advanced = attemptNpsExecutionMonitoringAdvancement(result);
  assert.equal(advanced.npsDecisionWrites, 0);
  assert.equal(advanced.executionWrites, 0);
  assert.equal(advanced.outcomeWrites, 0);
  assert.equal(advanced.learningWrites, 0);
  assert.equal(result.writesOutcome, false);
  assert.equal(result.writesLearning, false);
});

test("Ambiguous Okay does not start Execution", () => {
  const result = composeNpsExecutionMonitoring({
    pathFacts: pathFacts(),
    commitment: commitment(),
    ecaReadiness: { readiness: "READY" } as never,
    cc11: { ambiguousStartLanguage: true },
  });
  assert.equal(result.startAuthorizationStatus, "AMBIGUOUS");
  assert.equal(result.executionHandoffStatus, "NOT_AUTHORIZED");
  assert.equal(result.executionId, null);
});
