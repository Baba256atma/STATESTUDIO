import { ExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionIndex.ts";
import type { ExecutiveRegistryCollection } from "./executiveIntentResolutionRegistryTypes.ts";

export const ExecutiveIntentResolutionDomainRegistry = Object.freeze({
  id: "eng-3-registry-business-domains", group: "BusinessDomains", category: "Domain",
  owner: "ENG-3", version: "1.0.0", entries: ExecutiveIntentResolutionRegistry.domains,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRegistryCollection);
