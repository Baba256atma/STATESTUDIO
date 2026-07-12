import type { ProjectPlatformCompatibilityEntry } from "./projectPlatformCertificationTypes.ts";

export const ProjectPlatformCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    compatibilityStatus: "Compatible",
    description: "Compatible with the certified Executive Operations public platform.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformCompatibilityEntry),
  Object.freeze({
    target: "OPS-2 Task Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with task intelligence consumers through public task-reference metadata.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformCompatibilityEntry),
  Object.freeze({
    target: "OPS-3 Workflow Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with workflow intelligence consumers through public workflow-reference metadata.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformCompatibilityEntry),
  Object.freeze({
    target: "Resource Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with future resource-aware project planning layers.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    compatibilityStatus: "Compatible",
    description: "Compatible with dashboard consumers that read stable public project metadata.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    compatibilityStatus: "Compatible",
    description: "Compatible with future OPS phases extending the certified project platform.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformCompatibilityEntry),
] as const);

export const ProjectPlatformCompatibilityMetadata = Object.freeze({
  compatibilityMatrixId: "ops.project.platform-compatibility",
  compatibilityVersion: "1.0.0",
  compatibilityCount: ProjectPlatformCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);

