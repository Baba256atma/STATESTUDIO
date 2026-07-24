/**
 * NEX-1:3 — Scope, Boundary, Constraint, and Assumption Models.
 */

import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";
import type { ProductStrategyDomainModel } from "./productVisionStrategyIdentityModels.ts";

const Registry = ProductVisionStrategyRegistry;

export const ProductScopeModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductScope", canonicalName: "Product Scope Model",
  description: "Structural representation of concerns owned by the NEX product reference.", category: "Scope",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "scope"]), relationships: Object.freeze(["NEX-1:3/Relationship/LifecycleGovernsEvolution"]),
  registryEntries: Registry.registries.scopes, metadataOnly: true, immutable: true,
});

export const ProductBoundaryModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductBoundary", canonicalName: "Product Boundary Model",
  description: "Structural representation of concerns excluded from NEX product-reference ownership.", category: "Boundary",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "boundaries"]), relationships: Object.freeze(["NEX-1:3/Relationship/BoundariesLimitScope"]),
  registryEntries: Registry.registries.boundaries, metadataOnly: true, immutable: true,
});

export const ProductConstraintModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductConstraint", canonicalName: "Product Constraint Model",
  description: "Structural representation of durable product constraints.", category: "ProductConstraint",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "constraints"]), relationships: Object.freeze(["NEX-1:3/Relationship/ConstraintsLimitCapabilities"]),
  registryEntries: Registry.registries.constraints, metadataOnly: true, immutable: true,
});

export const ProductAssumptionModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductAssumption", canonicalName: "Product Assumption Model",
  description: "Structural representation of declared product strategy assumptions.", category: "ProductAssumption",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "assumptions"]), relationships: Object.freeze(["NEX-1:3/Relationship/AssumptionsInfluenceStrategy"]),
  registryEntries: Registry.registries.assumptions, metadataOnly: true, immutable: true,
});

export const ProductVisionStrategyBoundaryModels = Object.freeze([
  ProductScopeModel,
  ProductBoundaryModel,
  ProductConstraintModel,
  ProductAssumptionModel,
] as const);
