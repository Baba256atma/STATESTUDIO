/**
 * NEX-3:4 — Exactly twenty declarative validation rules.
 */

import { FeaturesModulesModel } from "./featuresModulesModel.ts";

export const FeaturesModulesValidationRules = Object.freeze([
  Object.freeze({ id: "NEX-3:4/Rule/VisionExists", requirement: "Product Feature Vision shall exist.", category: "Completeness", modelReference: FeaturesModulesModel.models[0].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/PrinciplesExist", requirement: "Feature Principles shall exist.", category: "Completeness", modelReference: FeaturesModulesModel.models[1].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/FeatureFamily", requirement: "Every Feature belongs to one Feature Family.", category: "Relationship", modelReference: FeaturesModulesModel.models[3].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/FamilyCategory", requirement: "Every Feature Family belongs to one Feature Category.", category: "Relationship", modelReference: FeaturesModulesModel.models[3].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/ModuleCategory", requirement: "Every Module belongs to one Module Category.", category: "Relationship", modelReference: FeaturesModulesModel.models[4].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/CapabilityGroup", requirement: "Every Capability belongs to one Capability Group.", category: "Relationship", modelReference: FeaturesModulesModel.models[7].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/FeatureDependencyTarget", requirement: "Every Feature Dependency references a valid Feature.", category: "Reference", modelReference: FeaturesModulesModel.models[10].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/ModuleDependencyTarget", requirement: "Every Module Dependency references a valid Module.", category: "Reference", modelReference: FeaturesModulesModel.models[11].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/UniqueFeatureBoundary", requirement: "Every Feature Boundary is uniquely identified.", category: "Uniqueness", modelReference: FeaturesModulesModel.models[8].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/UniqueModuleBoundary", requirement: "Every Module Boundary is uniquely identified.", category: "Uniqueness", modelReference: FeaturesModulesModel.models[9].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/FeatureLifecycleDefined", requirement: "Every Feature Lifecycle is defined.", category: "Completeness", modelReference: FeaturesModulesModel.models[12].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/ModuleLifecycleDefined", requirement: "Every Module Lifecycle is defined.", category: "Completeness", modelReference: FeaturesModulesModel.models[13].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/CompositionConsistency", requirement: "Product Composition is internally consistent.", category: "Consistency", modelReference: FeaturesModulesModel.models[14].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/GovernanceComplete", requirement: "Governance metadata is complete.", category: "Completeness", modelReference: FeaturesModulesModel.models[15].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/NoDuplicateIdentifiers", requirement: "No duplicate identifiers are permitted.", category: "Uniqueness", modelReference: FeaturesModulesModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/NoDuplicateNames", requirement: "No duplicate canonical names are permitted.", category: "Uniqueness", modelReference: FeaturesModulesModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/AcyclicRelationships", requirement: "No circular metadata relationships are permitted.", category: "Relationship", modelReference: FeaturesModulesModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/PublicApiConsistency", requirement: "Public API Registry is internally consistent.", category: "Consistency", modelReference: FeaturesModulesModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/CanonicalIdentity", requirement: "Canonical identity is valid.", category: "Identity", modelReference: FeaturesModulesModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Rule/ImmutableMetadata", requirement: "Metadata shall remain immutable.", category: "Integrity", modelReference: FeaturesModulesModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
