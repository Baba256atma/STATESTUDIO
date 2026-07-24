/**
 * NEX-1:3 — Target User and Stakeholder Models.
 */

import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";
import type { ProductStrategyDomainModel } from "./productVisionStrategyIdentityModels.ts";

const Registry = ProductVisionStrategyRegistry;

export const TargetUserModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/TargetUser", canonicalName: "Target User Model",
  description: "Structural representation of the people and teams Nexora is intended to serve.", category: "TargetUser",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "target-users"]), relationships: Object.freeze(["NEX-1:3/Relationship/UsersInformStrategy"]),
  registryEntries: Registry.registries.targetUsers, metadataOnly: true, immutable: true,
});

export const StakeholderModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/Stakeholder", canonicalName: "Stakeholder Model",
  description: "Structural representation of stakeholders participating in or affected by decisions.", category: "Stakeholder",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "stakeholders"]), relationships: Object.freeze(["NEX-1:3/Relationship/StakeholdersInformStrategy"]),
  registryEntries: Registry.registries.stakeholders, metadataOnly: true, immutable: true,
});

export const ProductVisionStrategyAudienceModels = Object.freeze([
  TargetUserModel,
  StakeholderModel,
] as const);
