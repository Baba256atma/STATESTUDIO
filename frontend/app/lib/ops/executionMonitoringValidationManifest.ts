import { ExecutionMonitoringCompatibilityVersion, ExecutionMonitoringRegistry } from "./executionMonitoringIndex.ts";
import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidation.ts";
import { ExecutionMonitoringValidationRegistry } from "./executionMonitoringValidationRegistry.ts";
import type { ExecutionMonitoringValidationDescriptor, ExecutionMonitoringValidationManifest } from "./executionMonitoringValidationTypes.ts";

export const buildExecutionMonitoringValidationManifest = () => Object.freeze({
  platformIdentity: Object.freeze({
    platformId: ExecutionMonitoringRegistry.platformId,
    platformName: ExecutionMonitoringRegistry.platformName,
    platformVersion: ExecutionMonitoringRegistry.version,
    metadataOnly: true, immutable: true, deterministic: true,
  }),
  validationIdentity: Object.freeze({
    validationId: "OPS-9:4", validationName: "Executive Execution Monitoring Validation",
    validationVersion: "1.0.0", consumedPhases: Object.freeze(["OPS-9:1", "OPS-9:2", "OPS-9:3"]),
    compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
    finalValidationState: getExecutionMonitoringValidationSummary().status,
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutionMonitoringValidationDescriptor),
  validationRegistry: ExecutionMonitoringValidationRegistry,
  supportedRuleGroups: Object.freeze(ExecutionMonitoringValidationRegistry.validationGroups.map((group) => group.name)),
  validationSummary: getExecutionMonitoringValidationSummary(),
  compatibilitySummary: Object.freeze({ compatibilityStatus: "PASS", metadataOnly: true, immutable: true, deterministic: true }),
  deterministicSummary: Object.freeze({ deterministic: true, metadataOnly: true, immutable: true }),
  metadataOnlySummary: Object.freeze({ metadataOnly: true, immutable: true, publicApiStable: true }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutionMonitoringValidationManifest);
