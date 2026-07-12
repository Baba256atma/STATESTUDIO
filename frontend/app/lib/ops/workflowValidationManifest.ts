import {
  WorkflowPlatformMetadata,
  WorkflowPublicApiRegistry,
} from "./workflowMetadataIndex.ts";
import { WorkflowFoundationValidation } from "./workflowFoundationValidation.ts";
import { WorkflowModelValidationSuite } from "./workflowModelValidationSuite.ts";
import { WorkflowPublicApiValidation } from "./workflowPublicApiValidation.ts";
import { WorkflowRegistryValidation } from "./workflowRegistryValidation.ts";
import type { WorkflowValidationManifestDescriptor } from "./workflowValidationTypes.ts";

const validationEntries = Object.freeze([
  ...WorkflowFoundationValidation,
  ...WorkflowRegistryValidation,
  ...WorkflowModelValidationSuite,
  ...WorkflowPublicApiValidation,
]);

const finalValidationState = validationEntries.every(
  (entry) => entry.status === "PASS",
)
  ? "PASS"
  : "FAIL";

export const buildWorkflowValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-3:4",
      validationName: "Workflow Validation Layer",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-3:1", "OPS-3:2", "OPS-3:3"]),
      compatibilityVersion: WorkflowPlatformMetadata.compatibilityVersion,
      finalValidationState,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies WorkflowValidationManifestDescriptor),
    validationChecks: validationEntries,
    publicApiSurface: WorkflowPublicApiRegistry,
    workflowCompatibilitySummary: Object.freeze({
      taskCompatibilityCount: validationEntries.filter(
        (entry) => entry.category === "TaskCompatibility",
      ).length,
      dependencyValidationCount: validationEntries.filter(
        (entry) => entry.category === "Dependency",
      ).length,
      publicApiStatus: "Stable",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getWorkflowValidationEntries = () => validationEntries;
