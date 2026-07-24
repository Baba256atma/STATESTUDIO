/**
 * NEX-4:3 — User Journey & Experience Model identity.
 */

import { UserJourneyExperienceRegistry } from "./userJourneyExperienceRegistry.ts";

export const UserJourneyExperienceModelIdentity = Object.freeze({
  id: "NEX-4:3/UserJourneyExperienceModel",
  name: "Nexora User Journey & Experience Model",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:3",
  namespace: "nexora.nex.user-journey-experience.model",
  version: "1.0.0",
  status: "Model",
  description: "Canonical typed structural representation of User Journey & Experience metadata.",
  modelVersion: "1.0.0",
  modelOwner: "Nexora Product",
  upstreamId: UserJourneyExperienceRegistry.identity.id,
  upstreamPhase: "NEX-4:2",
  registryOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
