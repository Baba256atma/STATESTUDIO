import { ExecutionPlatformMetadata, ExecutionPublicApiRegistry } from "./executionMetadataIndex.ts";
import {
  ExecutionArchitectureValidation,
} from "./executionArchitectureValidation.ts";
import {
  ExecutionModelValidationSuite,
} from "./executionModelValidationSuite.ts";
import {
  ExecutionPublicApiValidation,
} from "./executionPublicApiValidation.ts";
import {
  ExecutionRegistryValidation,
} from "./executionRegistryValidation.ts";
import type { ExecutionValidationManifestDescriptor } from "./executionValidationTypes.ts";

const validationEntries = Object.freeze([
  ...ExecutionArchitectureValidation,
  ...ExecutionRegistryValidation,
  ...ExecutionModelValidationSuite,
  ...ExecutionPublicApiValidation,
]);

const finalValidationState = validationEntries.every(
  (entry) => entry.status === "PASS",
)
  ? "PASS"
  : "FAIL";

export const buildExecutionValidationManifest = () =>
  Object.freeze({
    validationIdentity: Object.freeze({
      validationId: "OPS-1:4",
      validationName: "Execution Validation Layer",
      validationVersion: "1.0.0",
      consumedPhases: Object.freeze(["OPS-1:1", "OPS-1:2", "OPS-1:3"]),
      compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
      finalValidationState,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutionValidationManifestDescriptor),
    validationChecks: validationEntries,
    publicApiSurface: ExecutionPublicApiRegistry,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getExecutionValidationEntries = () => validationEntries;
