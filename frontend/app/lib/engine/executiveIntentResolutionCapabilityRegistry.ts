import { ExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionIndex.ts";
import type { ExecutiveRegistryCollection } from "./executiveIntentResolutionRegistryTypes.ts";

export const ExecutiveIntentResolutionCapabilityRegistry = Object.freeze({
  id: "eng-3-registry-capabilities", group: "Capabilities", category: "Capability",
  owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.capabilities,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRegistryCollection);
