/**
 * NEX-4:2 — User Journey & Experience Registry identity.
 */

import { UserJourneyExperienceFoundation } from "./userJourneyExperienceFoundation.ts";

export const UserJourneyExperienceRegistryIdentity = Object.freeze({
  id: "NEX-4:2/UserJourneyExperienceRegistry",
  name: "Nexora User Journey & Experience Registry",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:2",
  namespace: "nexora.nex.user-journey-experience.registry",
  version: "1.0.0",
  status: "Registry",
  description: "Canonical immutable registry of User Journey & Experience reference metadata.",
  registryVersion: "1.0.0",
  registryOwner: "Nexora Product",
  upstreamId: UserJourneyExperienceFoundation.identity.id,
  upstreamPhase: "NEX-4:1",
  foundationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
