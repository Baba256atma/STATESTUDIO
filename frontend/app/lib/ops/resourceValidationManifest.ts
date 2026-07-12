import { ResourcePlatformMetadata, ResourcePublicApiRegistry } from "./resourceMetadataIndex.ts";
import { ResourceFoundationValidation } from "./resourceFoundationValidation.ts";
import { ResourceModelValidationSuite } from "./resourceModelValidationSuite.ts";
import { ResourcePublicApiValidation } from "./resourcePublicApiValidation.ts";
import { ResourceRegistryValidation } from "./resourceRegistryValidation.ts";
import type { ResourceValidationManifestDescriptor } from "./resourceValidationTypes.ts";

const validationEntries = Object.freeze([
  ...ResourceFoundationValidation,
  ...ResourceRegistryValidation,
  ...ResourceModelValidationSuite,
  ...ResourcePublicApiValidation,
]);

const finalValidationState = validationEntries.every(
  (entry) => entry.status === "PASS",
)
  ? "PASS"
  : "FAIL";

export const buildResourceValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-5:4",
      validationName: "Resource Validation Layer",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-5:1", "OPS-5:2", "OPS-5:3"]),
      compatibilityVersion: ResourcePlatformMetadata.compatibilityVersion,
      finalValidationState,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ResourceValidationManifestDescriptor),
    validationChecks: validationEntries,
    publicApiSurface: ResourcePublicApiRegistry,
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus: validationEntries.some(
        (entry) =>
          entry.id === "resource-task-linkage-compatibility" &&
          entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus: validationEntries.some(
        (entry) =>
          entry.id === "resource-workflow-linkage-compatibility" &&
          entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    projectCompatibilitySummary: Object.freeze({
      compatibilityStatus: validationEntries.some(
        (entry) =>
          entry.id === "resource-project-linkage-compatibility" &&
          entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getResourceValidationEntries = () => validationEntries;
