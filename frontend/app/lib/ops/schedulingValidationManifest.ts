import { SchedulingPlatformMetadata, SchedulingPublicApiRegistry } from "./schedulingMetadataIndex.ts";
import { SchedulingFoundationValidation } from "./schedulingFoundationValidation.ts";
import { SchedulingModelValidationSuite } from "./schedulingModelValidationSuite.ts";
import { SchedulingPublicApiValidation } from "./schedulingPublicApiValidation.ts";
import { SchedulingRegistryValidation } from "./schedulingRegistryValidation.ts";
import type { SchedulingValidationManifestDescriptor } from "./schedulingValidationTypes.ts";

const validationEntries = Object.freeze([
  ...SchedulingFoundationValidation,
  ...SchedulingRegistryValidation,
  ...SchedulingModelValidationSuite,
  ...SchedulingPublicApiValidation,
]);

const finalValidationState = validationEntries.every(
  (entry) => entry.status === "PASS",
)
  ? "PASS"
  : "FAIL";

export const buildSchedulingValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-6:4",
      validationName: "Scheduling Validation Layer",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-6:1", "OPS-6:2", "OPS-6:3"]),
      compatibilityVersion: SchedulingPlatformMetadata.compatibilityVersion,
      finalValidationState,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies SchedulingValidationManifestDescriptor),
    validationChecks: validationEntries,
    publicApiSurface: SchedulingPublicApiRegistry,
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus: validationEntries.some(
        (entry) =>
          entry.id === "scheduling-task-linkage-compatibility" &&
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
          entry.id === "scheduling-workflow-linkage-compatibility" &&
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
          entry.id === "scheduling-project-linkage-compatibility" &&
          entry.status === "PASS",
      )
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    resourceCompatibilitySummary: Object.freeze({
      compatibilityStatus: validationEntries.some(
        (entry) =>
          entry.id === "scheduling-resource-linkage-compatibility" &&
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

export const getSchedulingValidationEntries = () => validationEntries;
