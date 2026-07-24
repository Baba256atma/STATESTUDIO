/**
 * NEX-3:2 — Features & Modules Registry identity.
 */

import { FeaturesModulesFoundation } from "./featuresModulesFoundation.ts";

export const FeaturesModulesRegistryIdentity = Object.freeze({
  id: "NEX-3:2/FeaturesModulesRegistry",
  name: "Nexora Features & Modules Registry",
  domain: "NEX Features & Modules",
  phase: "NEX-3:2",
  namespace: "nexora.nex.features-modules.registry",
  version: "1.0.0",
  status: "Registry",
  description: "Canonical immutable registry of Features & Modules reference metadata.",
  registryVersion: "1.0.0",
  registryOwner: "Nexora Product",
  upstreamId: FeaturesModulesFoundation.identity.id,
  upstreamPhase: "NEX-3:1",
  foundationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
