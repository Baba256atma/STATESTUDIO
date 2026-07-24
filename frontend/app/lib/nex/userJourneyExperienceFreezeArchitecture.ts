/**
 * NEX-4:8 — Frozen User Journey & Experience architecture metadata.
 */

import { UserJourneyExperienceCertification } from "./userJourneyExperienceCertification.ts";

export const UserJourneyExperienceFrozenArchitecture = Object.freeze({
  id: "NEX-4:8/FrozenArchitecture",
  architecture: "NPA v2",
  domain: "User Journey & Experience",
  sourceCertificationId: UserJourneyExperienceCertification.identity.id,
  canonicalLockIdentifier: "NEX-4-USER-JOURNEY-EXPERIENCE-LOCKED",
  locked: true,
  executesArchitectureLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
