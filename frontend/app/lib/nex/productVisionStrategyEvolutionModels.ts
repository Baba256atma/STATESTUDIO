/**
 * NEX-1:3 — Lifecycle, Strategic Theme, and Product Capability Models.
 */

import { ProductVisionStrategyRegistry } from "./productVisionStrategyRegistry.ts";
import type { ProductStrategyDomainModel } from "./productVisionStrategyIdentityModels.ts";

const Registry = ProductVisionStrategyRegistry;

export const ProductLifecycleModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductLifecycle", canonicalName: "Product Lifecycle Model",
  description: "Structural representation of the declarative product-reference lifecycle.", category: "Lifecycle",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "lifecycle"]), relationships: Object.freeze(["NEX-1:3/Relationship/LifecycleGovernsEvolution"]),
  registryEntries: Registry.registries.lifecycleStages, metadataOnly: true, immutable: true,
});

export const StrategicThemeModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/StrategicTheme", canonicalName: "Strategic Theme Model",
  description: "Structural representation of themes organizing long-term product direction.", category: "StrategicTheme",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "strategic-themes"]), relationships: Object.freeze(["NEX-1:3/Relationship/ThemesOrganizeCapabilities"]),
  registryEntries: Registry.registries.strategicThemes, metadataOnly: true, immutable: true,
});

export const ProductCapabilityModel: ProductStrategyDomainModel = Object.freeze({
  identifier: "NEX-1:3/Model/ProductCapability", canonicalName: "Product Capability Model",
  description: "Structural representation of product capabilities supporting strategic goals.", category: "ProductCapability",
  version: "1.0.0", status: "Modeled", owner: "Nexora Product",
  tags: Object.freeze(["model", "capabilities"]), relationships: Object.freeze(["NEX-1:3/Relationship/CapabilitiesEnableGoals"]),
  registryEntries: Registry.registries.capabilities, metadataOnly: true, immutable: true,
});

export const ProductVisionStrategyEvolutionModels = Object.freeze([
  ProductLifecycleModel,
  StrategicThemeModel,
  ProductCapabilityModel,
] as const);
