/**
 * NEX-4:8 — User Journey & Experience Freeze identity.
 */

import { UserJourneyExperienceCertification } from "./userJourneyExperienceCertification.ts";

export const UserJourneyExperienceFreezeIdentity = Object.freeze({
  id: "NEX-4:8/UserJourneyExperienceFreeze",
  name: "Nexora User Journey & Experience Freeze",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:8",
  namespace: "nexora.nex.user-journey-experience.freeze",
  version: "1.0.0",
  status: "Freeze",
  description: "Canonical immutable frozen baseline for the certified User Journey & Experience Platform.",
  freezeVersion: "1.0.0",
  freezeOwner: "Nexora Product",
  canonicalLockIdentifier: "NEX-4-USER-JOURNEY-EXPERIENCE-LOCKED",
  upstreamId: UserJourneyExperienceCertification.identity.id,
  upstreamPhase: "NEX-4:7",
  certificationOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
