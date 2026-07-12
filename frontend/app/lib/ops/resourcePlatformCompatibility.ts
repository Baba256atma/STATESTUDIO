import type { ResourcePlatformCompatibilityEntry } from "./resourcePlatformCertificationTypes.ts";

export const ResourcePlatformCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    compatibilityStatus: "Compatible",
    description: "Compatible with the certified Executive Operations public platform.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformCompatibilityEntry),
  Object.freeze({
    target: "OPS-2 Task Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with task intelligence consumers through public task linkage metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformCompatibilityEntry),
  Object.freeze({
    target: "OPS-3 Workflow Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with workflow intelligence consumers through public workflow linkage metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformCompatibilityEntry),
  Object.freeze({
    target: "OPS-4 Project Execution",
    compatibilityStatus: "Compatible",
    description: "Compatible with project execution consumers through public project linkage metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    compatibilityStatus: "Compatible",
    description: "Compatible with dashboard consumers that read stable public resource metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    compatibilityStatus: "Compatible",
    description: "Compatible with future OPS phases extending the certified resource platform.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformCompatibilityEntry),
] as const);

export const ResourcePlatformCompatibilityMetadata = Object.freeze({
  compatibilityMatrixId: "ops.resource.platform-compatibility",
  compatibilityVersion: "1.0.0",
  compatibilityCount: ResourcePlatformCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
