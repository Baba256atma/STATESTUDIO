/**
 * NEX-2:4 — Declarative Roadmap validation rule metadata.
 *
 * Rules describe requirements and do not evaluate them.
 */

import { ProductRoadmapModel } from "./productRoadmapModel.ts";

export const ProductRoadmapValidationRules = Object.freeze([
  Object.freeze({ id: "NEX-2:4/Rule/VisionExists", requirement: "Roadmap Vision shall exist.", category: "Completeness", modelReference: ProductRoadmapModel.models[0].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/MissionExists", requirement: "Roadmap Mission shall exist.", category: "Completeness", modelReference: ProductRoadmapModel.models[1].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/MissionVision", requirement: "Every Mission references one Vision.", category: "Reference", modelReference: ProductRoadmapModel.models[1].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/InitiativeMission", requirement: "Every Strategic Initiative references one Mission.", category: "Reference", modelReference: ProductRoadmapModel.models[7].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/MilestoneRelease", requirement: "Every Product Milestone references one Release Strategy.", category: "Reference", modelReference: ProductRoadmapModel.models[6].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/PriorityTheme", requirement: "Every Product Priority belongs to one Product Theme.", category: "Relationship", modelReference: ProductRoadmapModel.models[9].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/OutcomeCriteria", requirement: "Every Product Outcome references one Success Criteria.", category: "Reference", modelReference: ProductRoadmapModel.models[10].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/UniqueAssumption", requirement: "Every Planning Assumption has a unique identifier.", category: "Uniqueness", modelReference: ProductRoadmapModel.models[12].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/UniqueConstraint", requirement: "Every Planning Constraint has a unique identifier.", category: "Uniqueness", modelReference: ProductRoadmapModel.models[13].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/GovernanceLifecycle", requirement: "Every Roadmap Governance references one Lifecycle.", category: "Relationship", modelReference: ProductRoadmapModel.models[15].identifier, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/NoDuplicateIdentifiers", requirement: "No duplicate identifiers are permitted.", category: "Uniqueness", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/NoDuplicateNames", requirement: "No duplicate canonical names are permitted.", category: "Uniqueness", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/AcyclicRelationships", requirement: "No circular roadmap relationships are permitted.", category: "Relationship", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/InventoryConsistency", requirement: "Model inventory shall be internally consistent.", category: "Consistency", modelReference: ProductRoadmapModel.inventory.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/PublicApiConsistency", requirement: "Public API Registry shall be internally consistent.", category: "Consistency", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/CanonicalIdentity", requirement: "Canonical identity shall be valid.", category: "Identity", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/ImmutableMetadata", requirement: "Metadata shall be immutable.", category: "Integrity", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/UniqueCategories", requirement: "Validation categories shall be unique.", category: "Uniqueness", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/UniqueGroups", requirement: "Validation groups shall be unique.", category: "Uniqueness", modelReference: ProductRoadmapModel.identity.id, executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:4/Rule/DependencyBoundary", requirement: "Dependency boundary shall remain intact.", category: "Dependency", modelReference: ProductRoadmapModel.dependency.id, executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
