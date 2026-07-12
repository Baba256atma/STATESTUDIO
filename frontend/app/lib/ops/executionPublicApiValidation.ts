import {
  ExecutionPlatformIdentity,
  ExecutionPublicApis,
} from "./executionIndex.ts";
import { ExecutionPublicApiRegistry } from "./executionMetadataIndex.ts";
import {
  ExecutionAutomationModel,
  ExecutionMonitoringModel,
  ExecutionProjectModel,
  ExecutionResourceModel,
  ExecutionScheduleModel,
  ExecutionTaskModel,
  ExecutionWorkflowModel,
} from "./executionModelIndex.ts";
import type { ExecutionValidationEntry } from "./executionValidationTypes.ts";

const publicModels = Object.freeze([
  ExecutionTaskModel,
  ExecutionWorkflowModel,
  ExecutionProjectModel,
  ExecutionResourceModel,
  ExecutionScheduleModel,
  ExecutionMonitoringModel,
  ExecutionAutomationModel,
]);

export const ExecutionPublicApiValidation = Object.freeze([
  Object.freeze({
    id: "public-api-stability",
    name: "Public API Stability",
    description: "Validates stable public API exposure across OPS-1 phases.",
    category: "PublicApi",
    status:
      ExecutionPublicApis.length === 3 &&
      ExecutionPublicApiRegistry.length >= 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "public-api-consumer-only",
    name: "Public API Consumer Only",
    description: "Validates public API remains consumer-facing and metadata-only.",
    category: "PublicApi",
    status:
      publicModels.every((model) => model.metadata.metadataOnly) &&
      ExecutionPlatformIdentity.metadata.sideEffectFree
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "public-api-immutability",
    name: "Public API Immutability",
    description: "Validates immutable public API registry and exported models.",
    category: "Immutability",
    status:
      Object.isFrozen(ExecutionPublicApiRegistry) &&
      publicModels.every((model) => Object.isFrozen(model))
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
] as const);
