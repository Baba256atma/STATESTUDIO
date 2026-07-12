import { TaskPlatformMetadata, TaskPublicApiRegistry } from "./taskMetadataIndex.ts";
import { TaskFoundationValidation } from "./taskFoundationValidation.ts";
import { TaskModelValidationSuite } from "./taskModelValidationSuite.ts";
import { TaskPublicApiValidation } from "./taskPublicApiValidation.ts";
import { TaskRegistryValidation } from "./taskRegistryValidation.ts";
import type { TaskValidationManifestDescriptor } from "./taskValidationTypes.ts";

const validationEntries = Object.freeze([
  ...TaskFoundationValidation,
  ...TaskRegistryValidation,
  ...TaskModelValidationSuite,
  ...TaskPublicApiValidation,
]);

const finalValidationState = validationEntries.every(
  (entry) => entry.status === "PASS",
)
  ? "PASS"
  : "FAIL";

export const buildTaskValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-2:4",
      validationName: "Task Validation Layer",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-2:1", "OPS-2:2", "OPS-2:3"]),
      compatibilityVersion: TaskPlatformMetadata.compatibilityVersion,
      finalValidationState,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies TaskValidationManifestDescriptor),
    validationChecks: validationEntries,
    publicApiSurface: TaskPublicApiRegistry,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getTaskValidationEntries = () => validationEntries;
