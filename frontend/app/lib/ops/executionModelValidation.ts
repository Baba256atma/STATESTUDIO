import { ExecutionCapabilityRegistry, ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import { ExecutionAutomationModel } from "./executionAutomationModel.ts";
import { buildExecutionModelManifest } from "./executionModelManifest.ts";
import { ExecutionMonitoringModel } from "./executionMonitoringModel.ts";
import { ExecutionProjectModel } from "./executionProjectModel.ts";
import { ExecutionResourceModel } from "./executionResourceModel.ts";
import { ExecutionScheduleModel } from "./executionScheduleModel.ts";
import { ExecutionTaskModel } from "./executionTaskModel.ts";
import { ExecutionWorkflowModel } from "./executionWorkflowModel.ts";

const executionModels = Object.freeze([
  ExecutionTaskModel,
  ExecutionWorkflowModel,
  ExecutionProjectModel,
  ExecutionResourceModel,
  ExecutionScheduleModel,
  ExecutionMonitoringModel,
  ExecutionAutomationModel,
]);

const identifiers = executionModels.map((model) => model.identifier);

const uniqueIdentifiers = new Set(identifiers);

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "model-completeness",
      name: "Model Completeness",
      status: executionModels.length === 7 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "identifier-uniqueness",
      name: "Identifier Uniqueness",
      status: uniqueIdentifiers.size === executionModels.length ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "manifest-generation",
      name: "Manifest Generation",
      status: Object.isFrozen(buildExecutionModelManifest()) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "immutable-exports",
      name: "Immutable Exports",
      status: executionModels.every((model) => Object.isFrozen(model)) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "registry-compatibility",
      name: "Registry Compatibility",
      status: executionModels.every((model) =>
        ExecutionCapabilityRegistry.some(
          (capability) => capability.id === model.metadata.registryCapabilityId,
        ),
      )
        ? "PASS"
        : "FAIL",
    }),
    Object.freeze({
      id: "metadata-consistency",
      name: "Metadata Consistency",
      status: executionModels.every(
        (model) =>
          model.metadata.platformId === ExecutionPlatformMetadata.platformId &&
          model.metadata.compatibilityVersion ===
            ExecutionPlatformMetadata.compatibilityVersion,
      )
        ? "PASS"
        : "FAIL",
    }),
  ] as const);

export const validateExecutionModel = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
