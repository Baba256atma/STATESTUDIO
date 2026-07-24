/**
 * NEX-4:7 — User Journey & Experience Certification identity.
 */

import { UserJourneyExperiencePlatform } from "./userJourneyExperiencePlatform.ts";

export const UserJourneyExperienceCertificationIdentity = Object.freeze({
  id: "NEX-4:7/UserJourneyExperienceCertification",
  name: "Nexora User Journey & Experience Certification",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:7",
  namespace: "nexora.nex.user-journey-experience.certification",
  version: "1.0.0",
  status: "Certification",
  description: "Canonical immutable certification metadata for the User Journey & Experience Platform.",
  certificationVersion: "1.0.0",
  certificationOwner: "Nexora Product",
  upstreamId: UserJourneyExperiencePlatform.identity.id,
  upstreamPhase: "NEX-4:6",
  platformOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
