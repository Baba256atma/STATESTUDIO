/**
 * NEX-3:7 — Features & Modules Certification identity.
 */

import { FeaturesModulesPlatform } from "./featuresModulesPlatform.ts";

export const FeaturesModulesCertificationIdentity = Object.freeze({
  id: "NEX-3:7/FeaturesModulesCertification",
  name: "Nexora Features & Modules Certification",
  domain: "NEX Features & Modules",
  phase: "NEX-3:7",
  namespace: "nexora.nex.features-modules.certification",
  version: "1.0.0",
  status: "Certification",
  description: "Canonical immutable certification metadata for the Features & Modules Platform.",
  certificationVersion: "1.0.0",
  certificationOwner: "Nexora Product",
  upstreamId: FeaturesModulesPlatform.identity.id,
  upstreamPhase: "NEX-3:6",
  platformOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
