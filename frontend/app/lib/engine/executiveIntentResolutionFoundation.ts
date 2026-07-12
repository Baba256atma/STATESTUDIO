import { ExecutiveIntentResolutionContracts } from "./executiveIntentResolutionContracts.ts";
import { ExecutiveIntentResolutionMetadata } from "./executiveIntentResolutionMetadata.ts";
import { ExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionRegistry.ts";
import type { ExecutiveIntentFoundation } from "./executiveIntentResolutionTypes.ts";

const typeInventory = Object.freeze([
  "ExecutiveIntentId", "ExecutiveIntentType", "ExecutiveGoal", "ExecutiveObjective",
  "ExecutiveRequestDomain", "ExecutiveCapability", "ExecutiveOutputExpectation",
  "ExecutiveResolutionConfidence", "ExecutiveIntentStatus", "ExecutiveIntentPriority",
  "ExecutiveIntentScope", "ExecutiveIntentLifecycleStage", "ExecutiveIntentClassification",
  "ExecutiveIntentMetadata", "ExecutiveIntentDefinition", "ExecutiveIntentRegistry",
  "ExecutiveIntentFoundation",
] as const);

export const ExecutiveIntentResolutionFoundation = Object.freeze({
  contracts: ExecutiveIntentResolutionContracts,
  registry: ExecutiveIntentResolutionRegistry,
  metadata: ExecutiveIntentResolutionMetadata,
  types: typeInventory,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveIntentFoundation);

export const getExecutiveIntentResolutionFoundation = () => ExecutiveIntentResolutionFoundation;
export const getExecutiveIntentResolutionRegistry = () => ExecutiveIntentResolutionRegistry;
export const getExecutiveIntentResolutionMetadata = () => ExecutiveIntentResolutionMetadata;
