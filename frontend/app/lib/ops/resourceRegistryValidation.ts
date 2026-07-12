import {
  ResourceCapabilityRegistry,
  ResourceConsumerRegistry,
  ResourceDependencyRegistry,
  ResourcePlatformMetadata,
  buildResourceMetadataManifest,
  validateResourceMetadata,
} from "./resourceMetadataIndex.ts";
import type { ResourceValidationEntry } from "./resourceValidationTypes.ts";

export const ResourceRegistryValidation = Object.freeze([
  Object.freeze({
    id: "resource-registry-integrity",
    name: "Metadata Registry Integrity",
    description: "Validates OPS-5:2 resource metadata registry completeness.",
    category: "Registry",
    status:
      validateResourceMetadata().summary.status === "PASS" &&
      ResourceCapabilityRegistry.length === 16
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-dependency-consistency",
    name: "Dependency Consistency",
    description: "Validates resource dependency metadata consistency.",
    category: "Dependency",
    status:
      ResourceDependencyRegistry.every(
        (entry) => entry.dependencyMode === "MetadataOnly",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-consumer-compatibility",
    name: "Consumer Compatibility",
    description: "Validates resource consumer registry compatibility.",
    category: "Consumer",
    status:
      ResourceConsumerRegistry.length === 6 &&
      ResourcePlatformMetadata.compatibilityVersion === "1.0.0"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
  Object.freeze({
    id: "resource-registry-manifest-generation",
    name: "Registry Manifest Generation",
    description: "Validates deterministic OPS-5:2 metadata manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildResourceMetadataManifest()) &&
      buildResourceMetadataManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ResourceValidationEntry),
] as const);
