import { ExecutiveIntentResolutionCapabilityRegistry } from "./executiveIntentResolutionCapabilityRegistry.ts";
import { ExecutiveIntentResolutionDomainRegistry } from "./executiveIntentResolutionDomainRegistry.ts";
import { ExecutiveIntentResolutionIntentRegistry } from "./executiveIntentResolutionIntentRegistry.ts";
import { ExecutiveIntentResolutionRegistryManifest } from "./executiveIntentResolutionRegistryManifest.ts";
import type { ExecutiveRegistryPlatform } from "./executiveIntentResolutionRegistryTypes.ts";

const metadata = Object.freeze({
  platformId: "ENG-3:2", name: "Executive Intent Resolution Registry Platform",
  namespace: "nexora.engine.executive.intent-resolution.registry", owner: "ENG-3",
  version: "1.0.0", status: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveIntentResolutionRegistryPlatform = Object.freeze({
  intentRegistry: ExecutiveIntentResolutionIntentRegistry,
  domainRegistry: ExecutiveIntentResolutionDomainRegistry,
  capabilityRegistry: ExecutiveIntentResolutionCapabilityRegistry,
  manifest: ExecutiveIntentResolutionRegistryManifest,
  metadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveRegistryPlatform);

export const getExecutiveIntentResolutionRegistryPlatform = () => ExecutiveIntentResolutionRegistryPlatform;
export const getExecutiveIntentResolutionRegistryManifest = () => ExecutiveIntentResolutionRegistryManifest;
