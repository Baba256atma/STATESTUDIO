import type { ResourcePlatformRegressionEntry } from "./resourcePlatformFreezeTypes.ts";

export const ResourcePlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "resource-reg-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Resource foundation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Resource registry and metadata public surfaces remain stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Resource model public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Resource validation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Resource manifest public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-platform-index-stability",
    scope: "Platform Index",
    stabilityStatus: "Stable",
    description: "Resource platform index public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Resource certification public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-task-compatibility-stability",
    scope: "Task Compatibility",
    stabilityStatus: "Stable",
    description: "Resource task compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-workflow-compatibility-stability",
    scope: "Workflow Compatibility",
    stabilityStatus: "Stable",
    description: "Resource workflow compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-project-compatibility-stability",
    scope: "Project Compatibility",
    stabilityStatus: "Stable",
    description: "Resource project compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
  Object.freeze({
    id: "resource-reg-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Resource public API surface remains stable and frozen.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformRegressionEntry),
] as const);

export const ResourcePlatformRegressionMetadataSummary = Object.freeze({
  regressionId: "ops.resource.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: ResourcePlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);
