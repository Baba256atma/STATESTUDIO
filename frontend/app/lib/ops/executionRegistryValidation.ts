import {
  ExecutionCapabilityRegistry,
  ExecutionConsumerRegistry,
  ExecutionDependencyRegistry,
  ExecutionPlatformMetadata,
  buildExecutionMetadataManifest,
  validateExecutionMetadata,
} from "./executionMetadataIndex.ts";
import type { ExecutionValidationEntry } from "./executionValidationTypes.ts";

export const ExecutionRegistryValidation = Object.freeze([
  Object.freeze({
    id: "registry-metadata-integrity",
    name: "Metadata Registry Integrity",
    description: "Validates OPS-1:2 metadata registry completeness.",
    category: "Registry",
    status:
      validateExecutionMetadata().summary.status === "PASS" &&
      ExecutionCapabilityRegistry.length === 8
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "registry-dependency-consistency",
    name: "Dependency Consistency",
    description: "Validates dependency metadata consistency for future OPS phases.",
    category: "Dependency",
    status:
      ExecutionDependencyRegistry.every(
        (entry) => entry.futurePhaseDependencies.length >= 2,
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "registry-consumer-compatibility",
    name: "Consumer Compatibility",
    description: "Validates public consumer registry compatibility.",
    category: "Consumer",
    status:
      ExecutionConsumerRegistry.length === 5 &&
      ExecutionPlatformMetadata.compatibilityVersion === "1.0.0"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
  Object.freeze({
    id: "registry-manifest-generation",
    name: "Registry Manifest Generation",
    description: "Validates deterministic OPS-1:2 metadata manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildExecutionMetadataManifest()) &&
      buildExecutionMetadataManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ExecutionValidationEntry),
] as const);
