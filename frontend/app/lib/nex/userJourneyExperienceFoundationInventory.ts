/**
 * NEX-4:1 — Foundation inventory metadata.
 */

import { UserJourneyExperienceFoundationContracts } from "./userJourneyExperienceFoundationContracts.ts";
import { UserJourneyExperienceFoundationSections } from "./userJourneyExperienceFoundationMetadata.ts";
import { UserJourneyExperienceFoundationPublicApiRegistry } from "./userJourneyExperienceFoundationPublicApi.ts";
import { UserJourneyExperienceFoundationRules } from "./userJourneyExperienceFoundationRules.ts";

export const UserJourneyExperienceFoundationInventory = Object.freeze({
  id: "NEX-4:1/FoundationInventory",
  foundationContractCount: UserJourneyExperienceFoundationContracts.length,
  foundationRuleCount: UserJourneyExperienceFoundationRules.length,
  foundationSectionCount: UserJourneyExperienceFoundationSections.length,
  publicApiCount: UserJourneyExperienceFoundationPublicApiRegistry.length,
  foundationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);
