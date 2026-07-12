import { ExecutiveEngineFoundation } from "./engineIndex.ts";
import type { ExecutiveEngineCapabilityRegistryEntry } from "./engineRegistryTypes.ts";

const capability = (id: string, name: string, description: string) => Object.freeze({
  id, name, description, ownership: "ExecutiveEngine", status: "Architectural",
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineCapabilityRegistryEntry);

export const ExecutiveEngineCapabilityRegistry = Object.freeze([
  capability("request-understanding", "Request Understanding", "Architectural capability for understanding high-level requests."),
  capability("intent-resolution", "Intent Resolution", "Architectural capability for resolving executive intent."),
  capability("context-assembly", "Context Assembly", "Architectural capability reserved for future context assembly."),
  capability("planning", "Planning", "Architectural capability reserved for future planning coordination."),
  capability("decision-coordination", "Decision Coordination", "Architectural capability for decision coordination metadata."),
  capability("reasoning-coordination", "Reasoning Coordination", "Architectural capability for reasoning coordination metadata."),
  capability("orchestration-coordination", "Orchestration Coordination", "Architectural capability for orchestration coordination metadata."),
  capability("executive-awareness-coordination", "Executive Awareness Coordination", "Architectural capability for awareness coordination metadata."),
] as const);

export const ExecutiveEngineCapabilityRegistryMetadata = Object.freeze({
  registryId: "eng-1-2-capabilities", capabilityCount: ExecutiveEngineCapabilityRegistry.length,
  foundationId: ExecutiveEngineFoundation.registry.platformId,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const getExecutiveEngineCapabilityRegistry = () => ExecutiveEngineCapabilityRegistry;
