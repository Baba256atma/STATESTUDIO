import { ExecutiveIntentResolutionFreezeCompatibilityLock } from "./executiveIntentResolutionFreezeCompatibility.ts";
import { ExecutiveIntentResolutionFreezeManifest } from "./executiveIntentResolutionFreezeManifest.ts";
import { ExecutiveIntentResolutionFreezeRegistry } from "./executiveIntentResolutionFreezeRegistry.ts";
import type { ExecutiveFreezePlatform } from "./executiveIntentResolutionFreezeTypes.ts";

const freezeMetadata = Object.freeze({
  platformId: "ENG-3:8", name: "Executive Intent Resolution Freeze Platform",
  namespace: "nexora.engine.executive.intent-resolution.freeze", version: "1.0.0",
  owner: "ENG-3", status: "Frozen", publicationState: "Published",
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveIntentResolutionFreezePlatform = Object.freeze({
  freezeRegistry: ExecutiveIntentResolutionFreezeRegistry,
  compatibilityLock: ExecutiveIntentResolutionFreezeCompatibilityLock,
  freezeManifest: ExecutiveIntentResolutionFreezeManifest,
  freezeMetadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveFreezePlatform);

export const getExecutiveIntentResolutionFreezePlatform = () => ExecutiveIntentResolutionFreezePlatform;
