/**
 * NEX-4:6 — User Journey & Experience Platform identity.
 */

import { UserJourneyExperienceManifest } from "./userJourneyExperienceManifest.ts";

export const UserJourneyExperiencePlatformIdentity = Object.freeze({
  id: "NEX-4:6/UserJourneyExperiencePlatform",
  name: "Nexora User Journey & Experience Platform",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:6",
  namespace: "nexora.nex.user-journey-experience.platform",
  version: "1.0.0",
  status: "Platform",
  description: "Canonical immutable platform surface for User Journey & Experience metadata.",
  platformVersion: "1.0.0",
  platformOwner: "Nexora Product",
  upstreamId: UserJourneyExperienceManifest.identity.id,
  upstreamPhase: "NEX-4:5",
  manifestOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
