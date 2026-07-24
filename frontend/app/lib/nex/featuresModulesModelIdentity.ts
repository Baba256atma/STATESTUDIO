/**
 * NEX-3:3 — Features & Modules Model identity.
 */

import { FeaturesModulesRegistry } from "./featuresModulesRegistry.ts";

export const FeaturesModulesModelIdentity = Object.freeze({
  id: "NEX-3:3/FeaturesModulesModel",
  name: "Nexora Features & Modules Model",
  domain: "NEX Features & Modules",
  phase: "NEX-3:3",
  namespace: "nexora.nex.features-modules.model",
  version: "1.0.0",
  status: "Model",
  description: "Canonical typed structural representation of Features & Modules metadata.",
  modelVersion: "1.0.0",
  modelOwner: "Nexora Product",
  upstreamId: FeaturesModulesRegistry.identity.id,
  upstreamPhase: "NEX-3:2",
  registryOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
