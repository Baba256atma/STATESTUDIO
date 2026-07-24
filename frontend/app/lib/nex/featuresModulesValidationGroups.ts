/**
 * NEX-3:4 — Exactly sixteen immutable validation groups.
 */

import { FeaturesModulesModel } from "./featuresModulesModel.ts";

export const FeaturesModulesValidationGroups = Object.freeze([
  Object.freeze({ id: "NEX-3:4/Group/Identity", name: "Identity", domainCoverage: Object.freeze(["ProductFeatureVision"]), modelReference: FeaturesModulesModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Structure", name: "Structure", domainCoverage: Object.freeze(["FeatureCategory", "ModuleCategory"]), modelReference: FeaturesModulesModel.inventory.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Relationships", name: "Relationships", domainCoverage: Object.freeze(["FeatureFamily", "ProductModule"]), modelReference: FeaturesModulesModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Dependencies", name: "Dependencies", domainCoverage: Object.freeze(["FeatureDependency", "ModuleDependency"]), modelReference: FeaturesModulesModel.dependency.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Metadata", name: "Metadata", domainCoverage: Object.freeze(["FeaturePrinciple"]), modelReference: FeaturesModulesModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Compatibility", name: "Compatibility", domainCoverage: Object.freeze(["ProductComposition"]), modelReference: FeaturesModulesModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Readiness", name: "Readiness", domainCoverage: Object.freeze(["FeaturesModulesGovernance"]), modelReference: FeaturesModulesModel.identity.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Inventory", name: "Inventory", domainCoverage: Object.freeze(["ModelInventory"]), modelReference: FeaturesModulesModel.inventory.id, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Publication", name: "Publication", domainCoverage: Object.freeze(["ProductComposition"]), modelReference: FeaturesModulesModel.models[14].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Governance", name: "Governance", domainCoverage: Object.freeze(["FeaturesModulesGovernance"]), modelReference: FeaturesModulesModel.models[15].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Lifecycle", name: "Lifecycle", domainCoverage: Object.freeze(["FeatureLifecycle", "ModuleLifecycle"]), modelReference: FeaturesModulesModel.models[12].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Features", name: "Features", domainCoverage: Object.freeze(["FeatureVision", "FeaturePrinciple", "FeatureCategory", "FeatureFamily", "FeatureBoundary"]), modelReference: FeaturesModulesModel.models[0].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Modules", name: "Modules", domainCoverage: Object.freeze(["ProductModule", "ModuleCategory", "ModuleBoundary"]), modelReference: FeaturesModulesModel.models[4].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Capabilities", name: "Capabilities", domainCoverage: Object.freeze(["CapabilityGroup", "ProductCapability"]), modelReference: FeaturesModulesModel.models[6].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/Composition", name: "Composition", domainCoverage: Object.freeze(["ProductComposition"]), modelReference: FeaturesModulesModel.models[14].identifier, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Group/ApiRegistry", name: "API Registry", domainCoverage: Object.freeze(["PublicApiRegistry"]), modelReference: FeaturesModulesModel.identity.id, metadataOnly: true, immutable: true }),
] as const);
