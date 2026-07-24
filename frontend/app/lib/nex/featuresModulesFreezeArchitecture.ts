/**
 * NEX-3:8 — Frozen Features & Modules architecture metadata.
 */

import { FeaturesModulesCertification } from "./featuresModulesCertification.ts";

export const FeaturesModulesFrozenArchitecture = Object.freeze({
  id: "NEX-3:8/FrozenArchitecture",
  architecture: "NPA v2",
  domain: "Features & Modules",
  sourceCertificationId: FeaturesModulesCertification.identity.id,
  canonicalLockIdentifier: "NEX-3-FEATURES-MODULES-LOCKED",
  locked: true,
  executesArchitectureLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
