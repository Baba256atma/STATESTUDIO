import { ProjectPlatformMetadata, ProjectPublicApiRegistry } from "./projectMetadataIndex.ts";
import { ProjectFoundationValidation } from "./projectFoundationValidation.ts";
import { ProjectModelValidationSuite } from "./projectModelValidationSuite.ts";
import { ProjectPublicApiValidation } from "./projectPublicApiValidation.ts";
import { ProjectRegistryValidation } from "./projectRegistryValidation.ts";
import type { ProjectValidationManifestDescriptor } from "./projectValidationTypes.ts";

const validationEntries = Object.freeze([
  ...ProjectFoundationValidation,
  ...ProjectRegistryValidation,
  ...ProjectModelValidationSuite,
  ...ProjectPublicApiValidation,
]);

const finalValidationState = validationEntries.every(
  (entry) => entry.status === "PASS",
)
  ? "PASS"
  : "FAIL";

export const buildProjectValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-4:4",
      validationName: "Project Validation Layer",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-4:1", "OPS-4:2", "OPS-4:3"]),
      compatibilityVersion: ProjectPlatformMetadata.compatibilityVersion,
      finalValidationState,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ProjectValidationManifestDescriptor),
    validationChecks: validationEntries,
    publicApiSurface: ProjectPublicApiRegistry,
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus: validationEntries.some(
        (entry) =>
          entry.id === "project-task-reference-compatibility" &&
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
          entry.id === "project-workflow-reference-compatibility" &&
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

export const getProjectValidationEntries = () => validationEntries;

