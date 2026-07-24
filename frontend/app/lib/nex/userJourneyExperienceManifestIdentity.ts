/**
 * NEX-4:5 — User Journey & Experience Manifest identity.
 */

import { UserJourneyExperienceValidation } from "./userJourneyExperienceValidation.ts";

export const UserJourneyExperienceManifestIdentity = Object.freeze({
  id: "NEX-4:5/UserJourneyExperienceManifest",
  name: "Nexora User Journey & Experience Manifest",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:5",
  namespace: "nexora.nex.user-journey-experience.manifest",
  version: "1.0.0",
  status: "Manifest",
  description: "Canonical immutable publication package for validated User Journey & Experience metadata.",
  manifestVersion: "1.0.0",
  manifestOwner: "Nexora Product",
  upstreamId: UserJourneyExperienceValidation.identity.id,
  upstreamPhase: "NEX-4:4",
  validationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
