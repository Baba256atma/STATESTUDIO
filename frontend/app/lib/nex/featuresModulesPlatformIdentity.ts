/**
 * NEX-3:6 — Features & Modules Platform identity.
 */

import { FeaturesModulesManifest } from "./featuresModulesManifest.ts";

export const FeaturesModulesPlatformIdentity = Object.freeze({
  id: "NEX-3:6/FeaturesModulesPlatform",
  name: "Nexora Features & Modules Platform",
  domain: "NEX Features & Modules",
  phase: "NEX-3:6",
  namespace: "nexora.nex.features-modules.platform",
  version: "1.0.0",
  status: "Platform",
  description: "Canonical immutable platform surface for Features & Modules metadata.",
  platformVersion: "1.0.0",
  platformOwner: "Nexora Product",
  upstreamId: FeaturesModulesManifest.identity.id,
  upstreamPhase: "NEX-3:5",
  manifestOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
