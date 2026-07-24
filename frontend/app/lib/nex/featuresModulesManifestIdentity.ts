/**
 * NEX-3:5 — Features & Modules Manifest identity.
 */

import { FeaturesModulesValidation } from "./featuresModulesValidation.ts";

export const FeaturesModulesManifestIdentity = Object.freeze({
  id: "NEX-3:5/FeaturesModulesManifest",
  name: "Nexora Features & Modules Manifest",
  domain: "NEX Features & Modules",
  phase: "NEX-3:5",
  namespace: "nexora.nex.features-modules.manifest",
  version: "1.0.0",
  status: "Manifest",
  description: "Canonical immutable publication package for validated Features & Modules metadata.",
  manifestVersion: "1.0.0",
  manifestOwner: "Nexora Product",
  upstreamId: FeaturesModulesValidation.identity.id,
  upstreamPhase: "NEX-3:4",
  validationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
