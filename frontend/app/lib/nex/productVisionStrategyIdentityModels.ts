/**
 * NEX-1:3 — Vision, Mission, and Principle Models.
 *
 * Structural metadata sourced only from the NEX-1:2 Registry aggregate.
 */

import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";

export interface ProductStrategyDomainModel {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: string;
  readonly version: "1.0.0";
  readonly status: "Modeled";
  readonly owner: "Nexora Product";
  readonly tags: readonly string[];
  readonly relationships: readonly string[];
  readonly registryEntries: readonly unknown[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

const Registry = ProductVisionStrategyRegistry;

export const ProductVisionModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductVision",
  canonicalName: "Product Vision Model",
  description: "Structural representation of the canonical Nexora product vision.",
  category: "Vision",
  version: "1.0.0",
  status: "Modeled",
  owner: "Nexora Product",
  tags: Object.freeze(["model", "vision"]),
  relationships: Object.freeze(["NEX-1:3/Relationship/VisionContainsMission"]),
  registryEntries: Registry.registries.visions,
  metadataOnly: true,
  immutable: true,
});

export const ProductMissionModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductMission",
  canonicalName: "Product Mission Model",
  description: "Structural representation of the canonical Nexora product mission.",
  category: "Mission",
  version: "1.0.0",
  status: "Modeled",
  owner: "Nexora Product",
  tags: Object.freeze(["model", "mission"]),
  relationships: Object.freeze(["NEX-1:3/Relationship/MissionDrivesGoals"]),
  registryEntries: Registry.registries.missions,
  metadataOnly: true,
  immutable: true,
});

export const ProductPrincipleModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductPrinciple",
  canonicalName: "Product Principle Model",
  description: "Structural representation of the principles guiding Nexora product judgment.",
  category: "Principle",
  version: "1.0.0",
  status: "Modeled",
  owner: "Nexora Product",
  tags: Object.freeze(["model", "principles"]),
  relationships: Object.freeze(["NEX-1:3/Relationship/PrinciplesGuideStrategy"]),
  registryEntries: Registry.registries.principles,
  metadataOnly: true,
  immutable: true,
});

export const ProductVisionStrategyIdentityModels = Object.freeze([
  ProductVisionModel,
  ProductMissionModel,
  ProductPrincipleModel,
] as const);
