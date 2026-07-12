import type { ProjectPlatformRegressionEntry } from "./projectPlatformFreezeTypes.ts";

export const ProjectPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "project-reg-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Project foundation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Project registry and metadata public surfaces remain stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Project model public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Project validation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Project manifest public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-platform-index-stability",
    scope: "Platform Index",
    stabilityStatus: "Stable",
    description: "Project platform index public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Project certification public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-task-compatibility-stability",
    scope: "Task Compatibility",
    stabilityStatus: "Stable",
    description: "Project task compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-workflow-compatibility-stability",
    scope: "Workflow Compatibility",
    stabilityStatus: "Stable",
    description: "Project workflow compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
  Object.freeze({
    id: "project-reg-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Project public API surface remains stable and frozen.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformRegressionEntry),
] as const);

export const ProjectPlatformRegressionMetadataSummary = Object.freeze({
  regressionId: "ops.project.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: ProjectPlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);

