import {
  ExecutiveExecutionFoundation,
  ExecutionPlatformId,
  buildExecutionManifest,
  validateExecutionFoundation,
} from "./executionIndex.ts";
import type { ExecutionValidationEntry } from "./executionValidationTypes.ts";

export const ExecutionArchitectureValidation = Object.freeze([
  Object.freeze({
    id: "architecture-foundation-integrity",
    name: "Foundation Integrity",
    description: "Validates the OPS-1:1 execution foundation public surface.",
    category: "Foundation",
    status:
      ExecutiveExecutionFoundation.identity.platformId === ExecutionPlatformId &&
      validateExecutionFoundation().summary.status === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "architecture-foundation-manifest",
    name: "Foundation Manifest Generation",
    description: "Validates deterministic manifest generation for OPS-1:1.",
    category: "Manifest",
    status:
      Object.isFrozen(buildExecutionManifest()) &&
      buildExecutionManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "architecture-foundation-immutability",
    name: "Foundation Immutability",
    description: "Validates immutable foundation exports.",
    category: "Immutability",
    status: Object.isFrozen(ExecutiveExecutionFoundation) ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
] as const);
