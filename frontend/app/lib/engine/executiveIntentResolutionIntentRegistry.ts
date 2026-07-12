import { ExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionIndex.ts";
import type { ExecutiveRegistryCollection } from "./executiveIntentResolutionRegistryTypes.ts";

export const ExecutiveIntentResolutionIntentRegistry = Object.freeze({
  id: "eng-3-registry-intent-types", group: "IntentTypes", category: "Intent",
  owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.intentTypes,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRegistryCollection);
