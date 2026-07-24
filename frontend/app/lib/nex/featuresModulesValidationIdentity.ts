/**
 * NEX-3:4 — Features & Modules Validation identity.
 */

import { FeaturesModulesModel } from "./featuresModulesModel.ts";

export const FeaturesModulesValidationIdentity = Object.freeze({
  id: "NEX-3:4/FeaturesModulesValidation",
  name: "Nexora Features & Modules Validation",
  domain: "NEX Features & Modules",
  phase: "NEX-3:4",
  namespace: "nexora.nex.features-modules.validation",
  version: "1.0.0",
  status: "Validation",
  description: "Canonical immutable validation metadata for the Features & Modules domain.",
  validationVersion: "1.0.0",
  validationOwner: "Nexora Product",
  upstreamId: FeaturesModulesModel.identity.id,
  upstreamPhase: "NEX-3:3",
  modelOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
