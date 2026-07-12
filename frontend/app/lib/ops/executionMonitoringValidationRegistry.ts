import { ExecutionMonitoringCompatibilityVersion } from "./executionMonitoringIndex.ts";
import { ExecutionMonitoringValidationGroups, ExecutionMonitoringValidationRuleCatalog } from "./executionMonitoringValidationRules.ts";

export const ExecutionMonitoringValidationMetadata = Object.freeze({
  groupCount: ExecutionMonitoringValidationGroups.length,
  ruleCount: ExecutionMonitoringValidationRuleCatalog.length,
  compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutionMonitoringValidationCompatibilityMetadata = Object.freeze({
  consumedPhases: Object.freeze(["OPS-9:1", "OPS-9:2", "OPS-9:3"]),
  compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutionMonitoringValidationRegistry = Object.freeze({
  validationGroups: ExecutionMonitoringValidationGroups,
  validationRuleCatalog: ExecutionMonitoringValidationRuleCatalog,
  validationMetadata: ExecutionMonitoringValidationMetadata,
  compatibilityMetadata: ExecutionMonitoringValidationCompatibilityMetadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
