import { ExecutiveIntentResolutionDependencyMap } from "./executiveIntentResolutionDependencyMap.ts";
import { ExecutiveIntentResolutionManifest } from "./executiveIntentResolutionManifest.ts";
import { ExecutiveIntentResolutionPhaseRegistry } from "./executiveIntentResolutionPhaseRegistry.ts";
import { ExecutiveIntentResolutionPublicSurface } from "./executiveIntentResolutionPublicSurface.ts";
import type { ExecutiveManifestPlatform } from "./executiveIntentResolutionManifestTypes.ts";

const metadata = Object.freeze({
  platformId: "ENG-3:5", name: "Executive Intent Resolution Manifest Platform",
  namespace: "nexora.engine.executive.intent-resolution.manifest", version: "1.0.0",
  owner: "ENG-3", status: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveIntentResolutionManifestPlatform = Object.freeze({
  phaseRegistry: ExecutiveIntentResolutionPhaseRegistry,
  dependencyMap: ExecutiveIntentResolutionDependencyMap,
  publicSurface: ExecutiveIntentResolutionPublicSurface,
  manifest: ExecutiveIntentResolutionManifest,
  metadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveManifestPlatform);

export const getExecutiveIntentResolutionManifestPlatform = () => ExecutiveIntentResolutionManifestPlatform;
export const getExecutiveIntentResolutionManifest = () => ExecutiveIntentResolutionManifest;
