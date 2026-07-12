import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import type { WorkflowPlatformPhaseEntry } from "./workflowPlatformManifestTypes.ts";

export const WorkflowPlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-3:1",
    phaseName: "Workflow Intelligence Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./workflowIntelligenceIndex.ts",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-3:2",
    phaseName: "Workflow Registry & Metadata",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./workflowMetadataIndex.ts",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-3:3",
    phaseName: "Workflow Model",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./workflowModelIndex.ts",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-3:4",
    phaseName: "Workflow Validation Layer",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./workflowValidationIndex.ts",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformPhaseEntry),
] as const);

export const WorkflowPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.workflow-intelligence.platform-phase-registry",
  registryVersion: WorkflowPlatformMetadata.compatibilityVersion,
  phaseCount: WorkflowPlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
