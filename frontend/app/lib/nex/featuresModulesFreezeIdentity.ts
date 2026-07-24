/**
 * NEX-3:8 — Features & Modules Freeze identity.
 */

import { FeaturesModulesCertification } from "./featuresModulesCertification.ts";

export const FeaturesModulesFreezeIdentity = Object.freeze({
  id: "NEX-3:8/FeaturesModulesFreeze",
  name: "Nexora Features & Modules Freeze",
  domain: "NEX Features & Modules",
  phase: "NEX-3:8",
  namespace: "nexora.nex.features-modules.freeze",
  version: "1.0.0",
  status: "Freeze",
  description: "Canonical immutable frozen baseline for the certified Features & Modules Platform.",
  freezeVersion: "1.0.0",
  freezeOwner: "Nexora Product",
  canonicalLockIdentifier: "NEX-3-FEATURES-MODULES-LOCKED",
  upstreamId: FeaturesModulesCertification.identity.id,
  upstreamPhase: "NEX-3:7",
  certificationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
