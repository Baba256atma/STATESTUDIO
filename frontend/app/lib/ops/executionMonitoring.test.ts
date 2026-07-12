import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutionMonitoringCompatibilityVersion,
  ExecutionMonitoringContracts,
  ExecutionMonitoringMetadataCatalog,
  ExecutionMonitoringRegistry,
  ExecutionMonitoringSnapshotContract,
  ExecutionMonitoringStateContract,
  ExecutionMonitoringTargetContract,
  ExecutiveExecutionMonitoringFoundation,
  getExecutiveExecutionMonitoringFoundation,
  getExecutiveExecutionMonitoringMetadata,
} from "./executionMonitoringIndex.ts";

test("contracts", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringContracts), true);
  assert.equal(
    ExecutionMonitoringTargetContract.id,
    "execution-monitoring-target-contract",
  );
  assert.equal(ExecutionMonitoringStateContract.health, "Observed");
  assert.equal(
    ExecutionMonitoringSnapshotContract.targetReference,
    ExecutionMonitoringTargetContract.id,
  );
});

test("registry", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringRegistry), true);
  assert.equal(ExecutionMonitoringRegistry.platformId, "OPS-9:1");
  assert.equal(ExecutionMonitoringRegistry.registeredPhases.length, 1);
});

test("metadata", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringMetadataCatalog), true);
  assert.equal(ExecutionMonitoringCompatibilityVersion, "1.0.0");
  assert.equal(
    ExecutionMonitoringMetadataCatalog.supportedMonitoringTargets.length,
    7,
  );
  assert.equal(
    ExecutionMonitoringMetadataCatalog.supportedMonitoringStatuses.length,
    6,
  );
});

test("foundation namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringFoundation), true);
  assert.ok("contracts" in ExecutiveExecutionMonitoringFoundation);
  assert.ok("registry" in ExecutiveExecutionMonitoringFoundation);
  assert.ok("metadata" in ExecutiveExecutionMonitoringFoundation);
  assert.ok("types" in ExecutiveExecutionMonitoringFoundation);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveExecutionMonitoringFoundation(),
    ExecutiveExecutionMonitoringFoundation,
  );
  assert.deepEqual(
    getExecutiveExecutionMonitoringMetadata(),
    ExecutionMonitoringMetadataCatalog,
  );
});

test("immutable exports", () => {
  assert.equal(
    Object.isFrozen(getExecutiveExecutionMonitoringFoundation()),
    true,
  );
  assert.equal(
    Object.isFrozen(getExecutiveExecutionMonitoringMetadata()),
    true,
  );
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveExecutionMonitoringFoundation(),
    getExecutiveExecutionMonitoringFoundation(),
  );
  assert.deepEqual(
    getExecutiveExecutionMonitoringMetadata(),
    getExecutiveExecutionMonitoringMetadata(),
  );
});

test("public API stability", () => {
  assert.equal(
    ExecutiveExecutionMonitoringFoundation.descriptor.contractCount,
    5,
  );
  assert.equal(
    ExecutiveExecutionMonitoringFoundation.descriptor.registryStatus,
    "Complete",
  );
  assert.equal(ExecutiveExecutionMonitoringFoundation.metadataOnly, true);
});
