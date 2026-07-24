/**
 * NEX-3:1 — Foundation inventory metadata.
 */

import { FeaturesModulesFoundationContracts } from "./featuresModulesFoundationContracts.ts";
import { FeaturesModulesFoundationDomains } from "./featuresModulesFoundationMetadata.ts";
import { FeaturesModulesFoundationRules } from "./featuresModulesFoundationRules.ts";

export const FeaturesModulesFoundationInventory = Object.freeze({
  id: "NEX-3:1/FoundationInventory",
  foundationContractCount: FeaturesModulesFoundationContracts.length,
  foundationRuleCount: FeaturesModulesFoundationRules.length,
  foundationDomainCount: FeaturesModulesFoundationDomains.length,
  foundationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);
