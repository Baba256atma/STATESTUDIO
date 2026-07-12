import {
  SchedulingCapabilityRegistry,
  SchedulingConsumerRegistry,
  SchedulingDependencyRegistry,
  SchedulingPlatformMetadata,
  buildSchedulingMetadataManifest,
  validateSchedulingMetadata,
} from "./schedulingMetadataIndex.ts";
import type { SchedulingValidationEntry } from "./schedulingValidationTypes.ts";

export const SchedulingRegistryValidation = Object.freeze([
  Object.freeze({
    id: "scheduling-registry-integrity",
    name: "Metadata Registry Integrity",
    description: "Validates OPS-6:2 scheduling metadata registry completeness.",
    category: "Registry",
    status:
      validateSchedulingMetadata().summary.status === "PASS" &&
      SchedulingCapabilityRegistry.length === 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-dependency-consistency",
    name: "Dependency Consistency",
    description: "Validates scheduling dependency metadata consistency.",
    category: "Dependency",
    status:
      SchedulingDependencyRegistry.every(
        (entry) => entry.dependencyMode === "MetadataOnly",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-consumer-compatibility",
    name: "Consumer Compatibility",
    description: "Validates scheduling consumer registry compatibility.",
    category: "Consumer",
    status:
      SchedulingConsumerRegistry.length === 9 &&
      SchedulingPlatformMetadata.compatibilityVersion === "1.0.0"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
  Object.freeze({
    id: "scheduling-registry-manifest-generation",
    name: "Registry Manifest Generation",
    description: "Validates deterministic OPS-6:2 metadata manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildSchedulingMetadataManifest()) &&
      buildSchedulingMetadataManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies SchedulingValidationEntry),
] as const);
