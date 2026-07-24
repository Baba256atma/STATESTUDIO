/**
 * NEX-2:1 — Foundation inventory metadata.
 */

import { ProductRoadmapFoundationContracts } from "./productRoadmapFoundationContracts.ts";
import { ProductRoadmapFoundationDomains } from "./productRoadmapFoundationMetadata.ts";
import { ProductRoadmapFoundationRules } from "./productRoadmapFoundationRules.ts";

export const ProductRoadmapFoundationInventory = Object.freeze({
  id: "NEX-2:1/FoundationInventory",
  foundationContractCount: ProductRoadmapFoundationContracts.length,
  foundationRuleCount: ProductRoadmapFoundationRules.length,
  foundationDomainCount: ProductRoadmapFoundationDomains.length,
  foundationVersion: "1.0.0",
  metadataOnly: true,
  immutable: true,
} as const);
