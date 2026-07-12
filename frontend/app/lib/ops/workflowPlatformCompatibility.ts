import type { WorkflowPlatformCompatibilityEntry } from "./workflowPlatformCertificationTypes.ts";

export const WorkflowPlatformCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    compatibilityStatus: "Compatible",
    description: "Compatible with the certified Executive Operations public platform.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformCompatibilityEntry),
  Object.freeze({
    target: "OPS-2 Task Intelligence Public Platform",
    compatibilityStatus: "Compatible",
    description: "Compatible with the certified task intelligence public platform.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformCompatibilityEntry),
  Object.freeze({
    target: "Project Execution",
    compatibilityStatus: "Compatible",
    description: "Compatible with project execution consumers of workflow metadata only.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformCompatibilityEntry),
  Object.freeze({
    target: "Scheduling Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with scheduling intelligence through readonly workflow metadata.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    compatibilityStatus: "Compatible",
    description: "Compatible with dashboard consumers that read stable workflow metadata.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    compatibilityStatus: "Compatible",
    description: "Compatible with future OPS phases extending the certified workflow platform.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformCompatibilityEntry),
] as const);

export const WorkflowPlatformCompatibilityMetadata = Object.freeze({
  compatibilityMatrixId: "ops.workflow.platform-compatibility",
  compatibilityVersion: "1.0.0",
  compatibilityCount: WorkflowPlatformCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
