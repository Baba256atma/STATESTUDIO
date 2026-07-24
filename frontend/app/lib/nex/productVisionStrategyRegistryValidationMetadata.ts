/**
 * NEX-1:2 — Registry validation declarations.
 *
 * Requirements only. No validation implementation.
 */

import type { ProductRegistryValidationDeclaration } from "./productVisionStrategyRegistryTypes.ts";

export const ProductVisionStrategyRegistryValidationMetadata: readonly ProductRegistryValidationDeclaration[] =
  Object.freeze([
    Object.freeze({ identifier: "NEX-1:2/Validation/UniqueIdentifiers", canonicalName: "Unique registry identifiers", requirement: "Registry identifiers must be unique.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/UniqueNames", canonicalName: "Unique registry names", requirement: "Registry names must be unique within each registry.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/VisionPresent", canonicalName: "Vision registry presence", requirement: "Vision registry cannot be empty.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/MissionPresent", canonicalName: "Mission registry presence", requirement: "Mission registry cannot be empty.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/GoalVisionReference", canonicalName: "Goal vision reference", requirement: "Every goal references one vision.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/ObjectiveGoalReference", canonicalName: "Objective goal reference", requirement: "Every strategic objective references at least one goal.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/CapabilityTheme", canonicalName: "Capability theme membership", requirement: "Every capability belongs to one strategic theme.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/AcyclicReferences", canonicalName: "Acyclic metadata references", requirement: "No circular metadata references are permitted.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/NoDuplicates", canonicalName: "No duplicate entries", requirement: "No duplicate registry entries are permitted.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
    Object.freeze({ identifier: "NEX-1:2/Validation/ImmutableMetadata", canonicalName: "Immutable metadata", requirement: "Registry metadata must be immutable.", status: "Declared", version: "1.0.0", executesValidation: false, metadataOnly: true, immutable: true }),
  ] as const);
