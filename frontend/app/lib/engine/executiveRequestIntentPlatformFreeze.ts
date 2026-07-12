import { ExecutiveRequestIntentPlatformCompatibility } from "./executiveRequestIntentPlatformCompatibility.ts";
import { ExecutiveRequestIntentPlatformFreezeManifest } from "./executiveRequestIntentPlatformFreezeManifest.ts";
import { ExecutiveRequestIntentPlatformFreezeRegistry } from "./executiveRequestIntentPlatformFreezeRegistry.ts";
import type { ExecutiveRequestIntentPlatformFreeze as PlatformFreeze } from "./executiveRequestIntentPlatformFreezeTypes.ts";

export const ExecutiveRequestIntentPlatformFreeze = Object.freeze({
  registry: ExecutiveRequestIntentPlatformFreezeRegistry,
  compatibility: ExecutiveRequestIntentPlatformCompatibility,
  manifest: ExecutiveRequestIntentPlatformFreezeManifest,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies PlatformFreeze);

export const getExecutiveRequestIntentPlatformFreeze = () => ExecutiveRequestIntentPlatformFreeze;
