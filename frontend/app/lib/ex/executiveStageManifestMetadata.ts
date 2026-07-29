/**
 * EX-1:5 — Executive Stage Manifest Metadata.
 *
 * Manifest metadata, public contracts, compatibility, extension points,
 * validation summary, principles, and prohibited surfaces.
 *
 * Ownership: owned exclusively by EX-1:5.
 */

import {
  ExecutiveStageManifestIdentity,
  ExecutiveStageManifestNamespace,
  ExecutiveStageManifestReadiness,
  ExecutiveStageManifestStatus,
  ExecutiveStageManifestVersion,
} from "./executiveStageManifestIdentity.ts";
import { ExecutiveStageValidation } from "./executiveStageValidation.ts";

/** Public contract identities only. */
export const ExecutiveStageManifestPublicContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-1:5/Contract/01",
    name: "ExecutiveStage",
    description: "Root Executive Stage contract identity.",
    order: 1,
  }),
  Object.freeze({
    contractId: "EX-1:5/Contract/02",
    name: "ExecutiveShell",
    description: "Executive Shell contract identity.",
    order: 2,
  }),
  Object.freeze({
    contractId: "EX-1:5/Contract/03",
    name: "StageSurface",
    description: "Stage surface contract identity.",
    order: 3,
  }),
  Object.freeze({
    contractId: "EX-1:5/Contract/04",
    name: "StageObject",
    description: "Stage object contract identity.",
    order: 4,
  }),
  Object.freeze({
    contractId: "EX-1:5/Contract/05",
    name: "StageFocus",
    description: "Stage focus contract identity.",
    order: 5,
  }),
  Object.freeze({
    contractId: "EX-1:5/Contract/06",
    name: "StageInteraction",
    description: "Stage interaction contract identity.",
    order: 6,
  }),
] as const);

/** Compatibility targets — architectural, not implementation dependencies. */
export const ExecutiveStageManifestCompatibilityTargets = Object.freeze([
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/01",
    name: "Executive Context Runtime",
    impliesDependency: false as const,
    order: 1,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/02",
    name: "Executive Journal",
    impliesDependency: false as const,
    order: 2,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/03",
    name: "Executive Timeline",
    impliesDependency: false as const,
    order: 3,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/04",
    name: "Executive Workspace",
    impliesDependency: false as const,
    order: 4,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/05",
    name: "Executive Assistant",
    impliesDependency: false as const,
    order: 5,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/06",
    name: "Director",
    impliesDependency: false as const,
    order: 6,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/07",
    name: "EVE Visualization Layer",
    impliesDependency: false as const,
    order: 7,
  }),
  Object.freeze({
    compatibilityId: "EX-1:5/Compatibility/08",
    name: "Future Executive Experience Modules",
    impliesDependency: false as const,
    order: 8,
  }),
] as const);

/** Approved Stage extension areas. Existing identities remain stable. */
export const ExecutiveStageManifestExtensionPoints = Object.freeze([
  Object.freeze({
    extensionId: "EX-1:5/Extension/01",
    name: "Stage Layers",
    existingIdentitiesRemainStable: true as const,
    order: 1,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/02",
    name: "Object Types",
    existingIdentitiesRemainStable: true as const,
    order: 2,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/03",
    name: "Relationship Types",
    existingIdentitiesRemainStable: true as const,
    order: 3,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/04",
    name: "Interaction Types",
    existingIdentitiesRemainStable: true as const,
    order: 4,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/05",
    name: "Overlay Types",
    existingIdentitiesRemainStable: true as const,
    order: 5,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/06",
    name: "Visual States",
    existingIdentitiesRemainStable: true as const,
    order: 6,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/07",
    name: "Viewport Features",
    existingIdentitiesRemainStable: true as const,
    order: 7,
  }),
  Object.freeze({
    extensionId: "EX-1:5/Extension/08",
    name: "Metadata Fields",
    existingIdentitiesRemainStable: true as const,
    order: 8,
  }),
] as const);

/**
 * Validation summary referenced by Manifest.
 * Individual rule execution is not stored here.
 */
export const ExecutiveStageManifestValidationSummary = Object.freeze({
  summaryId: "EX-1:5/ValidationSummary",
  validationCategories: ExecutiveStageValidation.statistics.categoryCount,
  validationRules: ExecutiveStageValidation.statistics.canonicalRuleCount,
  validationStatus: "Complete" as const,
  storesIndividualRuleExecution: false as const,
  sourceValidation: ExecutiveStageManifestIdentity.sourceValidation,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Manifest principles. */
export const ExecutiveStageManifestPrinciples = Object.freeze([
  Object.freeze({
    principleId: "EX-1:5/Principle/01",
    name: "Immutable Manifest",
    description: "The Manifest is immutable.",
  }),
  Object.freeze({
    principleId: "EX-1:5/Principle/02",
    name: "No Implementation",
    description: "The Manifest contains no implementation.",
  }),
  Object.freeze({
    principleId: "EX-1:5/Principle/03",
    name: "Upstream Derived",
    description: "Every declaration is derived from certified upstream phases.",
  }),
  Object.freeze({
    principleId: "EX-1:5/Principle/04",
    name: "Capabilities Not Behaviour",
    description: "The Manifest defines capabilities, not behaviour.",
  }),
  Object.freeze({
    principleId: "EX-1:5/Principle/05",
    name: "Deterministic And Reproducible",
    description: "The Manifest is deterministic and reproducible.",
  }),
] as const);

/** Manifest invariants. */
export const ExecutiveStageManifestInvariants = Object.freeze([
  "complete upstream coverage",
  "deterministic ordering",
  "immutable metadata",
  "stable capability declarations",
  "one canonical manifest",
] as const);

/** Prohibited surfaces. */
export const ExecutiveStageManifestProhibitedSurfaces = Object.freeze([
  "render the Stage",
  "create Runtime objects",
  "execute interactions",
  "component animation",
  "validate Stage instances",
  "manage Runtime state",
  "invoke AI",
  "communicate with external services",
  "React rendering",
  "Next.js rendering",
] as const);

/**
 * Immutable Stage Manifest metadata.
 * Generated timestamp is a declared constant — never wall-clock generation.
 */
export const ExecutiveStageManifestMetadata = Object.freeze({
  metadataId: "EX-1:5/ManifestMetadata",
  namespace: ExecutiveStageManifestNamespace,
  architectureVersion: "NPA-T vNext" as const,
  manifestVersion: ExecutiveStageManifestVersion,
  releaseStage: ExecutiveStageManifestStatus,
  readiness: ExecutiveStageManifestReadiness,
  generatedTimestamp: "2026-07-25T00:00:00.000Z" as const,
  compatibilityVersion: "1.0.0" as const,
  authoringStandard: "NPA-T vNext Executive Experience" as const,
  createdBy: "EX-1:5 Executive Stage Manifest" as const,
  identity: ExecutiveStageManifestIdentity,
  publicContracts: ExecutiveStageManifestPublicContracts,
  compatibility: ExecutiveStageManifestCompatibilityTargets,
  extensionPoints: ExecutiveStageManifestExtensionPoints,
  validationSummary: ExecutiveStageManifestValidationSummary,
  principles: ExecutiveStageManifestPrinciples,
  invariants: ExecutiveStageManifestInvariants,
  prohibitedSurfaces: ExecutiveStageManifestProhibitedSurfaces,
  referencesPlatform: false as const,
  referencesUi: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
