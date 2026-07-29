/**
 * RTC-1:5 — Executive Context Manifest Metadata.
 *
 * Manifest metadata, public contracts, compatibility, extension points,
 * validation summary, principles, and prohibited surfaces.
 *
 * Ownership: owned exclusively by RTC-1:5.
 */

import {
  ExecutiveContextManifestIdentity,
  ExecutiveContextRuntimeManifestNamespace,
  ExecutiveContextRuntimeManifestReadiness,
  ExecutiveContextRuntimeManifestStatus,
  ExecutiveContextRuntimeManifestVersion,
} from "./executiveContextManifestIdentity.ts";
import { ExecutiveContextRuntimeValidation } from "./executiveContextRuntimeValidation.ts";

/** Public contract identities only. */
export const ExecutiveContextManifestPublicContracts = Object.freeze([
  Object.freeze({
    contractId: "RTC-1:5/Contract/01",
    name: "ExecutiveContext",
    description: "Root Executive Context contract identity.",
    order: 1,
  }),
  Object.freeze({
    contractId: "RTC-1:5/Contract/02",
    name: "RuntimeIdentity",
    description: "Runtime identity contract identity.",
    order: 2,
  }),
  Object.freeze({
    contractId: "RTC-1:5/Contract/03",
    name: "RuntimeLifecycle",
    description: "Runtime lifecycle contract identity.",
    order: 3,
  }),
  Object.freeze({
    contractId: "RTC-1:5/Contract/04",
    name: "RuntimeRegistry",
    description: "Runtime registry contract identity.",
    order: 4,
  }),
  Object.freeze({
    contractId: "RTC-1:5/Contract/05",
    name: "RuntimeValidation",
    description: "Runtime validation contract identity.",
    order: 5,
  }),
] as const);

/** Compatibility targets — compatibility does not imply dependency. */
export const ExecutiveContextManifestCompatibilityTargets = Object.freeze([
  Object.freeze({
    compatibilityId: "RTC-1:5/Compatibility/01",
    name: "RTC Platform",
    impliesDependency: false as const,
    order: 1,
  }),
  Object.freeze({
    compatibilityId: "RTC-1:5/Compatibility/02",
    name: "Executive Journal Runtime",
    impliesDependency: false as const,
    order: 2,
  }),
  Object.freeze({
    compatibilityId: "RTC-1:5/Compatibility/03",
    name: "Executive Timeline Runtime",
    impliesDependency: false as const,
    order: 3,
  }),
  Object.freeze({
    compatibilityId: "RTC-1:5/Compatibility/04",
    name: "Executive Stage Runtime",
    impliesDependency: false as const,
    order: 4,
  }),
  Object.freeze({
    compatibilityId: "RTC-1:5/Compatibility/05",
    name: "Executive Assistant Runtime",
    impliesDependency: false as const,
    order: 5,
  }),
] as const);

/** Approved Runtime extension areas. Existing identities remain stable. */
export const ExecutiveContextManifestExtensionPoints = Object.freeze([
  Object.freeze({
    extensionId: "RTC-1:5/Extension/01",
    name: "Workspace Types",
    existingIdentitiesRemainStable: true as const,
    order: 1,
  }),
  Object.freeze({
    extensionId: "RTC-1:5/Extension/02",
    name: "Pack Types",
    existingIdentitiesRemainStable: true as const,
    order: 2,
  }),
  Object.freeze({
    extensionId: "RTC-1:5/Extension/03",
    name: "Context Types",
    existingIdentitiesRemainStable: true as const,
    order: 3,
  }),
  Object.freeze({
    extensionId: "RTC-1:5/Extension/04",
    name: "Metadata Fields",
    existingIdentitiesRemainStable: true as const,
    order: 4,
  }),
  Object.freeze({
    extensionId: "RTC-1:5/Extension/05",
    name: "Runtime Consumers",
    existingIdentitiesRemainStable: true as const,
    order: 5,
  }),
  Object.freeze({
    extensionId: "RTC-1:5/Extension/06",
    name: "Validation Rules",
    existingIdentitiesRemainStable: true as const,
    order: 6,
  }),
] as const);

/**
 * Validation summary referenced by Manifest.
 * Individual rule execution is not stored here.
 */
export const ExecutiveContextManifestValidationSummary = Object.freeze({
  summaryId: "RTC-1:5/ValidationSummary",
  validationCategories: ExecutiveContextRuntimeValidation.statistics.categoryCount,
  validationRules: ExecutiveContextRuntimeValidation.statistics.ruleCount,
  validationStatus: "Complete" as const,
  storesIndividualRuleExecution: false as const,
  sourceValidation: ExecutiveContextManifestIdentity.sourceValidation,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Manifest principles. */
export const ExecutiveContextManifestPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-1:5/Principle/01",
    name: "Immutable Manifest",
    description: "The Manifest is immutable.",
  }),
  Object.freeze({
    principleId: "RTC-1:5/Principle/02",
    name: "No Executable Logic",
    description: "The Manifest contains no executable Runtime logic.",
  }),
  Object.freeze({
    principleId: "RTC-1:5/Principle/03",
    name: "Upstream Generated",
    description: "The Manifest is generated only from upstream phases.",
  }),
  Object.freeze({
    principleId: "RTC-1:5/Principle/04",
    name: "No Implementation Duplication",
    description: "The Manifest never duplicates implementation.",
  }),
  Object.freeze({
    principleId: "RTC-1:5/Principle/05",
    name: "Deterministic Manifest",
    description: "The Manifest is deterministic.",
  }),
] as const);

/** Manifest invariants. */
export const ExecutiveContextManifestInvariants = Object.freeze([
  "Complete upstream coverage",
  "Stable identity",
  "Immutable metadata",
  "Deterministic ordering",
  "One canonical manifest",
] as const);

/** Prohibited surfaces. */
export const ExecutiveContextManifestProhibitedSurfaces = Object.freeze([
  "execute Runtime code",
  "hold active state",
  "validate contexts",
  "perform lifecycle transitions",
  "render UI",
  "invoke AI",
  "persist data",
  "access external systems",
  "React",
  "Next.js",
] as const);

/**
 * Immutable Runtime Manifest metadata.
 * Generated timestamp is a declared constant — never wall-clock generation.
 */
export const ExecutiveContextManifestMetadata = Object.freeze({
  metadataId: "RTC-1:5/ManifestMetadata",
  namespace: ExecutiveContextRuntimeManifestNamespace,
  version: ExecutiveContextRuntimeManifestVersion,
  architecture: "NPA-T vNext" as const,
  releaseStage: ExecutiveContextRuntimeManifestStatus,
  readiness: ExecutiveContextRuntimeManifestReadiness,
  createdBy: "RTC-1:5 Executive Context Runtime Manifest" as const,
  generatedTimestamp: "2026-07-25T00:00:00.000Z" as const,
  identity: ExecutiveContextManifestIdentity,
  publicContracts: ExecutiveContextManifestPublicContracts,
  compatibility: ExecutiveContextManifestCompatibilityTargets,
  extensionPoints: ExecutiveContextManifestExtensionPoints,
  validationSummary: ExecutiveContextManifestValidationSummary,
  principles: ExecutiveContextManifestPrinciples,
  invariants: ExecutiveContextManifestInvariants,
  prohibitedSurfaces: ExecutiveContextManifestProhibitedSurfaces,
  referencesPlatform: false as const,
  referencesUi: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
