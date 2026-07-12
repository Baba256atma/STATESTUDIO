import {
  ProjectCapabilityRegistry,
  ProjectConsumerRegistry,
  ProjectDependencyRegistry,
  ProjectPlatformMetadata,
  buildProjectMetadataManifest,
  validateProjectMetadata,
} from "./projectMetadataIndex.ts";
import type { ProjectValidationEntry } from "./projectValidationTypes.ts";

export const ProjectRegistryValidation = Object.freeze([
  Object.freeze({
    id: "project-registry-integrity",
    name: "Metadata Registry Integrity",
    description: "Validates OPS-4:2 project metadata registry completeness.",
    category: "Registry",
    status:
      validateProjectMetadata().summary.status === "PASS" &&
      ProjectCapabilityRegistry.length === 8
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-dependency-consistency",
    name: "Dependency Consistency",
    description: "Validates project dependency metadata consistency.",
    category: "Dependency",
    status:
      ProjectDependencyRegistry.every(
        (entry) => entry.dependencyMode === "MetadataOnly",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-consumer-compatibility",
    name: "Consumer Compatibility",
    description: "Validates project consumer registry compatibility.",
    category: "Consumer",
    status:
      ProjectConsumerRegistry.length === 6 &&
      ProjectPlatformMetadata.compatibilityVersion === "1.0.0"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-registry-manifest-generation",
    name: "Registry Manifest Generation",
    description: "Validates deterministic OPS-4:2 metadata manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildProjectMetadataManifest()) &&
      buildProjectMetadataManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
] as const);

