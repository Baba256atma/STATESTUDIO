import { ExecutiveExecutionMonitoringFoundation } from "./executionMonitoringIndex.ts";
import { ExecutiveExecutionMonitoringRegistry } from "./executionMonitoringRegistryIndex.ts";
import { ExecutiveExecutionMonitoringModel } from "./executionMonitoringModelIndex.ts";
import { ExecutionMonitoringValidationRuleCatalog } from "./executionMonitoringValidationRules.ts";
import type { ExecutionMonitoringValidationCategory, ExecutionMonitoringValidationResult, ExecutionMonitoringValidationStatus, ExecutionMonitoringValidationSummary } from "./executionMonitoringValidationTypes.ts";

const buildResult = (category: ExecutionMonitoringValidationCategory, statuses: readonly boolean[]) => {
  const rules = ExecutionMonitoringValidationRuleCatalog.filter((rule) => rule.category === category);
  const checks = Object.freeze(rules.map((rule, index) => Object.freeze({
    ...rule,
    status: (statuses[index] ? "PASS" : "FAIL") as ExecutionMonitoringValidationStatus,
  })));
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  return Object.freeze({
    totalChecks: checks.length,
    passedChecks,
    failedChecks: checks.length - passedChecks,
    status: (passedChecks === checks.length ? "PASS" : "FAIL") as ExecutionMonitoringValidationStatus,
    checks,
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutionMonitoringValidationResult);
};

export const validateExecutionMonitoringFoundation = () => buildResult("Foundation", [
  ExecutiveExecutionMonitoringFoundation.contracts.all.length > 0,
  Object.keys(ExecutiveExecutionMonitoringFoundation.registry).length > 0,
  Object.keys(ExecutiveExecutionMonitoringFoundation.metadata).length > 0,
]);

export const validateExecutionMonitoringRegistry = () => buildResult("Registry", [
  ExecutiveExecutionMonitoringRegistry.targets.length > 0,
  ExecutiveExecutionMonitoringRegistry.states.length > 0,
  ExecutiveExecutionMonitoringRegistry.health.length > 0,
  ExecutiveExecutionMonitoringRegistry.alerts.length > 0,
  ExecutiveExecutionMonitoringRegistry.metrics.length > 0,
  ExecutiveExecutionMonitoringRegistry.lifecycle.length > 0,
  ExecutiveExecutionMonitoringRegistry.severity.length > 0,
]);

export const validateExecutionMonitoringModel = () => buildResult("Model", [
  ExecutiveExecutionMonitoringModel.targets.length > 0,
  ExecutiveExecutionMonitoringModel.states.length > 0,
  ExecutiveExecutionMonitoringModel.health.length > 0,
  ExecutiveExecutionMonitoringModel.alerts.length > 0,
  ExecutiveExecutionMonitoringModel.metrics.length > 0,
  ExecutiveExecutionMonitoringModel.snapshots.length > 0,
  ExecutiveExecutionMonitoringModel.policies.length > 0,
]);

export const validateExecutionMonitoringPlatform = () => buildResult("Platform", [
  Object.isFrozen(ExecutiveExecutionMonitoringFoundation) && Object.isFrozen(ExecutiveExecutionMonitoringRegistry) && Object.isFrozen(ExecutiveExecutionMonitoringModel),
  ExecutiveExecutionMonitoringFoundation.deterministic && ExecutiveExecutionMonitoringRegistry.deterministic && ExecutiveExecutionMonitoringModel.deterministic,
  ExecutiveExecutionMonitoringFoundation.immutable && ExecutiveExecutionMonitoringRegistry.immutable && ExecutiveExecutionMonitoringModel.immutable,
  ExecutiveExecutionMonitoringFoundation.contracts.all.length > 0 && ExecutiveExecutionMonitoringRegistry.targets.length > 0 && ExecutiveExecutionMonitoringModel.targets.length > 0,
  ExecutiveExecutionMonitoringFoundation.metadataOnly && ExecutiveExecutionMonitoringRegistry.metadataOnly && ExecutiveExecutionMonitoringModel.metadataOnly,
]);

export const validateExecutiveExecutionMonitoringPlatform = () => {
  const checks = Object.freeze([
    ...validateExecutionMonitoringFoundation().checks,
    ...validateExecutionMonitoringRegistry().checks,
    ...validateExecutionMonitoringModel().checks,
    ...validateExecutionMonitoringPlatform().checks,
  ]);
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  return Object.freeze({ totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks,
    status: (passedChecks === checks.length ? "PASS" : "FAIL") as ExecutionMonitoringValidationStatus,
    checks, metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutionMonitoringValidationResult);
};

export const getExecutionMonitoringValidationSummary = () => {
  const result = validateExecutiveExecutionMonitoringPlatform();
  return Object.freeze({ totalChecks: result.totalChecks, passedChecks: result.passedChecks,
    failedChecks: result.failedChecks, status: result.status,
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutionMonitoringValidationSummary);
};
