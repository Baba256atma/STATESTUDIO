import { ExecutiveReasoningCapabilityRegistry } from "./executiveReasoningCapabilityRegistry.ts";
import { ExecutiveReasoningComponentRegistry } from "./executiveReasoningComponentRegistry.ts";
import { ExecutiveReasoningLifecycleRegistry } from "./executiveReasoningLifecycleRegistry.ts";

export const ExecutiveReasoningRegistryMetadata = Object.freeze({
  registryId: "ENG-6:2",
  registryVersion: "1.0.0",
  registryNamespace: "nexora.engine.executive.reasoning.registry",
  registryName: "Executive Reasoning Components Registry",
  registryDescription:
    "Canonical immutable metadata-only registry of Executive Reasoning Pipeline components, capabilities, and lifecycle stages.",
  registryStatus: Object.freeze({
    registry: "Registry",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    aiFree: "AiFree",
  } as const),
  owner: "ENG-6",
  phase: "ENG-6:2",
  foundationDependency: "executiveReasoningPipelineFoundation.ts",
  totalComponentCount: 8,
  totalCapabilityCount: 8,
  totalLifecycleStageCount: 9,
  componentCount: ExecutiveReasoningComponentRegistry.length,
  capabilityCount: ExecutiveReasoningCapabilityRegistry.length,
  lifecycleStageCount: ExecutiveReasoningLifecycleRegistry.length,
  nextPhase: "ENG-6:3",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
