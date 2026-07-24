/**
 * NEX-3:2 — Sixteen immutable Features & Modules registries.
 */

import { FeaturesModulesFoundation } from "./featuresModulesFoundation.ts";

const Foundation = FeaturesModulesFoundation;
const entry = (
  identifier: string,
  canonicalName: string,
  description: string,
  category: string,
  sourceIdentifier: string,
  tags: readonly string[],
) => Object.freeze({
  identifier,
  canonicalName,
  description,
  category,
  status: "Registered",
  version: "1.0.0",
  owner: "Nexora Product",
  tags: Object.freeze(tags),
  sourceIdentifier,
  metadataOnly: true,
  immutable: true,
} as const);

export const FeaturesModulesRegistryCollections = Object.freeze({
  productFeatureVision: Object.freeze([
    entry("NEX-3:2/Vision/CoherentComposition", "Coherent Product Composition Vision", Foundation.vocabulary.vision.statement, "ProductFeatureVision", Foundation.vocabulary.vision.id, ["feature", "vision"]),
  ]),
  featurePrinciples: Object.freeze(Foundation.vocabulary.principles.map((principle) =>
    entry(principle.id.replace("NEX-3:1", "NEX-3:2"), principle.name, principle.description, "FeaturePrinciple", principle.id, ["feature", "principle"]),
  )),
  featureCategories: Object.freeze([
    entry("NEX-3:2/FeatureCategory/CoreValue", "Core Value Feature", "Features expressing primary product value.", "FeatureCategory", Foundation.domains[4].id, ["feature", "category"]),
  ]),
  featureFamilies: Object.freeze([
    entry("NEX-3:2/FeatureFamily/CoherentValue", "Coherent Value Feature Family", "A canonical family of related product features.", "FeatureFamily", Foundation.domains[2].id, ["feature", "family", "category:core-value"]),
  ]),
  productModules: Object.freeze([
    entry("NEX-3:2/Module/ProductDomain", "Product Domain Module", "A bounded product-reference module.", "ProductModule", Foundation.domains[3].id, ["module", "category:product-domain"]),
  ]),
  moduleCategories: Object.freeze([
    entry("NEX-3:2/ModuleCategory/ProductDomain", "Product Domain Module Category", "Modules representing bounded product domains.", "ModuleCategory", Foundation.domains[5].id, ["module", "category"]),
  ]),
  capabilityGroups: Object.freeze([
    entry("NEX-3:2/CapabilityGroup/ProductComposition", "Product Composition Capabilities", "Capabilities supporting coherent product composition.", "CapabilityGroup", Foundation.domains[6].id, ["capability", "group"]),
  ]),
  productCapabilities: Object.freeze([
    entry("NEX-3:2/Capability/CanonicalComposition", "Canonical Composition", "Product capability to describe canonical feature and module composition.", "ProductCapability", Foundation.domains[6].id, ["capability", "group:product-composition"]),
  ]),
  featureBoundaries: Object.freeze([
    entry("NEX-3:2/FeatureBoundary/ProductValue", "Product Value Feature Boundary", "Limits feature scope to declared product value metadata.", "FeatureBoundary", Foundation.domains[7].id, ["feature", "boundary"]),
  ]),
  moduleBoundaries: Object.freeze([
    entry("NEX-3:2/ModuleBoundary/ProductReference", "Product Reference Module Boundary", "Limits modules to declared product-reference responsibility.", "ModuleBoundary", Foundation.domains[8].id, ["module", "boundary"]),
  ]),
  featureDependencies: Object.freeze([
    entry("NEX-3:2/FeatureDependency/DeclaredReference", "Declared Feature Reference", "A metadata-only reference between product features.", "FeatureDependency", Foundation.domains[11].id, ["feature", "dependency"]),
  ]),
  moduleDependencies: Object.freeze([
    entry("NEX-3:2/ModuleDependency/DeclaredReference", "Declared Module Reference", "A metadata-only reference between product modules.", "ModuleDependency", Foundation.domains[12].id, ["module", "dependency"]),
  ]),
  featureLifecycle: Object.freeze([
    entry("NEX-3:2/FeatureLifecycle/ProductFeature", "Product Feature Lifecycle", "Declarative lifecycle stages for product feature metadata.", "FeatureLifecycle", Foundation.domains[9].id, ["feature", "lifecycle"]),
  ]),
  moduleLifecycle: Object.freeze([
    entry("NEX-3:2/ModuleLifecycle/ProductModule", "Product Module Lifecycle", "Declarative lifecycle stages for product module metadata.", "ModuleLifecycle", Foundation.domains[10].id, ["module", "lifecycle"]),
  ]),
  productComposition: Object.freeze([
    entry("NEX-3:2/Composition/CanonicalProduct", "Canonical Product Composition", "Canonical metadata composition of features and modules.", "ProductComposition", Foundation.domains[13].id, ["product", "composition"]),
  ]),
  featuresModulesGovernance: Object.freeze([
    entry("NEX-3:2/Governance/ProductStewardship", "Features & Modules Product Stewardship", "Ownership and stewardship metadata for product composition.", "FeaturesModulesGovernance", Foundation.domains[15].id, ["governance", "stewardship"]),
  ]),
} as const);
