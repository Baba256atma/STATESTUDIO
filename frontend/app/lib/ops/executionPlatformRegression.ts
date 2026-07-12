import type { ExecutionPlatformRegressionEntry } from "./executionPlatformFreezeTypes.ts";

export const ExecutionPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "reg-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Foundation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Registry and metadata public surfaces remain stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Execution model public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Validation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Manifest public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-platform-index-stability",
    scope: "Platform Index",
    stabilityStatus: "Stable",
    description: "Platform index public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Certification public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
  Object.freeze({
    id: "reg-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Public API surface remains stable and frozen.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformRegressionEntry),
] as const);

export const ExecutionPlatformRegressionMetadataSummary = Object.freeze({
  regressionId: "ops.execution.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: ExecutionPlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);
