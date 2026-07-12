import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveExecutionMonitoringRegistry,
  getExecutionMonitoringAlertRegistry,
  getExecutionMonitoringHealthRegistry,
  getExecutionMonitoringLifecycleRegistry,
  getExecutionMonitoringMetricRegistry,
  getExecutionMonitoringSeverityRegistry,
  getExecutionMonitoringStateRegistry,
  getExecutionMonitoringTargetRegistry,
  getExecutiveExecutionMonitoringRegistry,
} from "./executionMonitoringRegistryIndex.ts";

test("target registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringTargetRegistry()), true);
  assert.equal(getExecutionMonitoringTargetRegistry().length, 7);
  assert.equal(getExecutionMonitoringTargetRegistry()[0]?.category, "Task");
});

test("state registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringStateRegistry()), true);
  assert.equal(getExecutionMonitoringStateRegistry().length, 7);
  assert.equal(getExecutionMonitoringStateRegistry()[2]?.state, "Running");
});

test("health registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringHealthRegistry()), true);
  assert.equal(getExecutionMonitoringHealthRegistry().length, 4);
  assert.equal(getExecutionMonitoringHealthRegistry()[0]?.level, "Healthy");
});

test("alert registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringAlertRegistry()), true);
  assert.equal(getExecutionMonitoringAlertRegistry().length, 6);
  assert.equal(getExecutionMonitoringAlertRegistry()[0]?.category, "Execution Alert");
});

test("metric registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringMetricRegistry()), true);
  assert.equal(getExecutionMonitoringMetricRegistry().length, 7);
  assert.equal(getExecutionMonitoringMetricRegistry()[0]?.category, "Progress");
});

test("lifecycle registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringLifecycleRegistry()), true);
  assert.equal(getExecutionMonitoringLifecycleRegistry().length, 5);
  assert.equal(getExecutionMonitoringLifecycleRegistry()[2]?.stage, "Active");
});

test("severity registry", () => {
  assert.equal(Object.isFrozen(getExecutionMonitoringSeverityRegistry()), true);
  assert.equal(getExecutionMonitoringSeverityRegistry().length, 5);
  assert.equal(getExecutionMonitoringSeverityRegistry()[4]?.severity, "Critical");
});

test("registry metadata", () => {
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedTargetCount, 7);
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedStateCount, 7);
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedHealthCount, 4);
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedAlertCount, 6);
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedMetricCount, 7);
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedLifecycleCount, 5);
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.supportedSeverityCount, 5);
  assert.equal(
    ExecutiveExecutionMonitoringRegistry.metadata.compatibilityVersion,
    "1.0.0",
  );
});

test("platform namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringRegistry), true);
  assert.ok("targets" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("states" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("health" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("alerts" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("metrics" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("lifecycle" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("severity" in ExecutiveExecutionMonitoringRegistry);
  assert.ok("metadata" in ExecutiveExecutionMonitoringRegistry);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveExecutionMonitoringRegistry(),
    ExecutiveExecutionMonitoringRegistry,
  );
  assert.deepEqual(
    getExecutionMonitoringSeverityRegistry(),
    ExecutiveExecutionMonitoringRegistry.severity,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(getExecutiveExecutionMonitoringRegistry()), true);
  assert.equal(
    Object.isFrozen(ExecutiveExecutionMonitoringRegistry.metadata),
    true,
  );
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveExecutionMonitoringRegistry(),
    getExecutiveExecutionMonitoringRegistry(),
  );
  assert.deepEqual(
    getExecutionMonitoringTargetRegistry(),
    getExecutionMonitoringTargetRegistry(),
  );
  assert.deepEqual(
    getExecutionMonitoringLifecycleRegistry(),
    getExecutionMonitoringLifecycleRegistry(),
  );
});

test("public API stability", () => {
  assert.equal(
    ExecutiveExecutionMonitoringRegistry.descriptor.registryId,
    "ops-9-2-executive-execution-monitoring-registry",
  );
  assert.equal(ExecutiveExecutionMonitoringRegistry.metadata.metadataOnly, true);
  assert.equal(ExecutiveExecutionMonitoringRegistry.immutable, true);
});
