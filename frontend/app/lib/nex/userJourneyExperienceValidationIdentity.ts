/**
 * NEX-4:4 — User Journey & Experience Validation identity.
 */

import { UserJourneyExperienceModel } from "./userJourneyExperienceModel.ts";

export const UserJourneyExperienceValidationIdentity = Object.freeze({
  id: "NEX-4:4/UserJourneyExperienceValidation",
  name: "Nexora User Journey & Experience Validation",
  domain: "NEX User Journey & Experience",
  phase: "NEX-4:4",
  namespace: "nexora.nex.user-journey-experience.validation",
  version: "1.0.0",
  status: "Validation",
  description: "Canonical immutable validation metadata for the User Journey & Experience domain.",
  validationVersion: "1.0.0",
  validationOwner: "Nexora Product",
  upstreamId: UserJourneyExperienceModel.identity.id,
  upstreamPhase: "NEX-4:3",
  modelOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
