import { ExecutiveReasoningCapabilityRegistry } from "./executiveReasoningCapabilityRegistry.ts";
import { ExecutiveReasoningComponentRegistry } from "./executiveReasoningComponentRegistry.ts";
import { ExecutiveReasoningLifecycleRegistry } from "./executiveReasoningLifecycleRegistry.ts";
import { ExecutiveReasoningRegistry } from "./executiveReasoningRegistry.ts";
import { ExecutiveReasoningRegistryMetadata } from "./executiveReasoningRegistryMetadata.ts";

export const ExecutiveReasoningRegistrySummary = Object.freeze({
  registryId: ExecutiveReasoningRegistryMetadata.registryId,
  phase: "ENG-6:2",
  namespace: ExecutiveReasoningRegistryMetadata.registryNamespace,
  owner: "ENG-6",
  componentCount: ExecutiveReasoningComponentRegistry.length,
  capabilityCount: ExecutiveReasoningCapabilityRegistry.length,
  lifecycleStageCount: ExecutiveReasoningLifecycleRegistry.length,
  evidenceCategoryCount: ExecutiveReasoningRegistry.evidence.length,
  inferenceTypeCount: ExecutiveReasoningRegistry.inference.length,
  confidenceLevelCount: ExecutiveReasoningRegistry.confidence.length,
  hypothesisTypeCount: ExecutiveReasoningRegistry.hypotheses.length,
  nextPhase: "ENG-6:3",
  modelReady: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const getReasoningRegistrySummary = () => ExecutiveReasoningRegistrySummary;
