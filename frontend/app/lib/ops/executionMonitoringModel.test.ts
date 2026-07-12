import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveExecutionMonitoringModel,
  getExecutiveExecutionMonitoringModel,
  getExecutionMonitoringPolicyModel,
  getExecutionMonitoringSnapshotModel,
} from "./executionMonitoringModelIndex.ts";
import { ExecutionMonitoringAlertModel } from "./executionMonitoringAlertModel.ts";
import { ExecutionMonitoringHealthModel } from "./executionMonitoringHealthModel.ts";
import { ExecutionMonitoringMetricModel } from "./executionMonitoringMetricModel.ts";
import { ExecutionMonitoringPolicyModel } from "./executionMonitoringPolicyModel.ts";
import { ExecutionMonitoringSnapshotModel } from "./executionMonitoringSnapshotModel.ts";
import { ExecutionMonitoringStateModel } from "./executionMonitoringStateModel.ts";
import { ExecutionMonitoringTargetModel } from "./executionMonitoringTargetModel.ts";

test("target model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringTargetModel), true);
  assert.equal(ExecutionMonitoringTargetModel.length, 7);
  assert.equal(ExecutionMonitoringTargetModel[0]?.category, "Task");
});

test("state model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringStateModel), true);
  assert.equal(ExecutionMonitoringStateModel.length, 7);
  assert.ok(ExecutionMonitoringStateModel[0]?.healthReference.length);
});

test("health model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringHealthModel), true);
  assert.equal(ExecutionMonitoringHealthModel.length, 4);
  assert.equal(ExecutionMonitoringHealthModel[0]?.healthLevel, "Healthy");
});

test("alert model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringAlertModel), true);
  assert.equal(ExecutionMonitoringAlertModel.length, 6);
  assert.equal(ExecutionMonitoringAlertModel[0]?.category, "Execution Alert");
});

test("metric model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringMetricModel), true);
  assert.equal(ExecutionMonitoringMetricModel.length, 7);
  assert.equal(ExecutionMonitoringMetricModel[0]?.unit, "percent");
});

test("snapshot model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringSnapshotModel), true);
  assert.equal(ExecutionMonitoringSnapshotModel.length, 7);
  assert.equal(ExecutionMonitoringSnapshotModel[0]?.metricReferences.length, 2);
});

test("policy model", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringPolicyModel), true);
  assert.equal(ExecutionMonitoringPolicyModel.length, 5);
  assert.equal(
    ExecutionMonitoringPolicyModel[0]?.policyCategory,
    "Observation Policy",
  );
});

test("metadata", () => {
  assert.equal(ExecutiveExecutionMonitoringModel.metadata.modelVersion, "1.0.0");
  assert.equal(
    ExecutiveExecutionMonitoringModel.summary.snapshotModelCount,
    ExecutionMonitoringSnapshotModel.length,
  );
});

test("platform namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringModel), true);
  assert.ok("targets" in ExecutiveExecutionMonitoringModel);
  assert.ok("states" in ExecutiveExecutionMonitoringModel);
  assert.ok("health" in ExecutiveExecutionMonitoringModel);
  assert.ok("alerts" in ExecutiveExecutionMonitoringModel);
  assert.ok("metrics" in ExecutiveExecutionMonitoringModel);
  assert.ok("snapshots" in ExecutiveExecutionMonitoringModel);
  assert.ok("policies" in ExecutiveExecutionMonitoringModel);
  assert.ok("metadata" in ExecutiveExecutionMonitoringModel);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveExecutionMonitoringModel(),
    ExecutiveExecutionMonitoringModel,
  );
  assert.deepEqual(
    getExecutionMonitoringSnapshotModel(),
    ExecutiveExecutionMonitoringModel.snapshots,
  );
  assert.deepEqual(
    getExecutionMonitoringPolicyModel(),
    ExecutiveExecutionMonitoringModel.policies,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveExecutionMonitoringModel()), true);
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringModel.metadata), true);
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveExecutionMonitoringModel(),
    getExecutiveExecutionMonitoringModel(),
  );
  assert.deepEqual(
    getExecutionMonitoringSnapshotModel(),
    getExecutionMonitoringSnapshotModel(),
  );
});

test("public API stability", () => {
  assert.equal(
    ExecutiveExecutionMonitoringModel.metadata.modelId,
    "ops-9-3-executive-execution-monitoring-model",
  );
  assert.equal(ExecutiveExecutionMonitoringModel.metadata.metadataOnly, true);
  assert.equal(ExecutiveExecutionMonitoringModel.immutable, true);
});
