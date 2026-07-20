/**
 * NEA-8:4 — Executive Gateway Suite Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-8:4.
 */

import type {
  ExecutiveGatewaySuiteValidationCategoryId,
  ExecutiveGatewaySuiteValidationRelationship,
} from "./executiveGatewaySuiteValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: ExecutiveGatewaySuiteValidationCategoryId,
  targetCategoryId: ExecutiveGatewaySuiteValidationCategoryId,
  description: string,
  order: number,
): ExecutiveGatewaySuiteValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-8:4/ValidationRelationship/${key}`,
    relationshipName,
    sourceCategoryId,
    targetCategoryId,
    description,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical validation category relationships — exactly twenty-four. */
export const ExecutiveGatewaySuiteValidationRelationships: readonly ExecutiveGatewaySuiteValidationRelationship[] =
  Object.freeze([
    relationship(
      "ExecutiveGatewaySuite-SuiteComposition",
      "Suite depends on Composition",
      "ExecutiveGatewaySuite",
      "SuiteComposition",
      "Suite validation requires composition validation.",
      1,
    ),
    relationship(
      "SuiteComposition-SuiteComponent",
      "Composition depends on Components",
      "SuiteComposition",
      "SuiteComponent",
      "Composition validation requires component validation.",
      2,
    ),
    relationship(
      "SuiteComponent-SuiteComponentIdentity",
      "Component depends on Identity",
      "SuiteComponent",
      "SuiteComponentIdentity",
      "Component validation requires component identity validation.",
      3,
    ),
    relationship(
      "SuiteComponent-SuitePlatformReference",
      "Component depends on Platform Reference",
      "SuiteComponent",
      "SuitePlatformReference",
      "Component validation requires platform reference validation.",
      4,
    ),
    relationship(
      "SuiteComponent-SuiteDependency",
      "Component depends on Dependency",
      "SuiteComponent",
      "SuiteDependency",
      "Component validation requires dependency validation.",
      5,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteIdentity",
      "Suite depends on Identity",
      "ExecutiveGatewaySuite",
      "SuiteIdentity",
      "Suite validation requires suite identity validation.",
      6,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteCapability",
      "Suite depends on Capabilities",
      "ExecutiveGatewaySuite",
      "SuiteCapability",
      "Suite validation requires capability validation.",
      7,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteContract",
      "Suite depends on Contracts",
      "ExecutiveGatewaySuite",
      "SuiteContract",
      "Suite validation requires contract validation.",
      8,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteLifecycle",
      "Suite depends on Lifecycle",
      "ExecutiveGatewaySuite",
      "SuiteLifecycle",
      "Suite validation requires lifecycle validation.",
      9,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuitePolicy",
      "Suite depends on Policies",
      "ExecutiveGatewaySuite",
      "SuitePolicy",
      "Suite validation requires policy validation.",
      10,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteInventory",
      "Suite depends on Inventory",
      "ExecutiveGatewaySuite",
      "SuiteInventory",
      "Suite validation requires inventory validation.",
      11,
    ),
    relationship(
      "SuiteInventory-SuiteComponent",
      "Inventory depends on Components",
      "SuiteInventory",
      "SuiteComponent",
      "Inventory validation requires component validation.",
      12,
    ),
    relationship(
      "SuiteInventory-SuitePublicApiInventory",
      "Inventory depends on Public API Inventory",
      "SuiteInventory",
      "SuitePublicApiInventory",
      "Inventory validation requires public API inventory validation.",
      13,
    ),
    relationship(
      "SuiteSummary-SuiteInventory",
      "Summary depends on Inventory",
      "SuiteSummary",
      "SuiteInventory",
      "Summary validation requires inventory validation.",
      14,
    ),
    relationship(
      "SuiteSummary-SuiteMetadata",
      "Summary depends on Metadata",
      "SuiteSummary",
      "SuiteMetadata",
      "Summary validation requires metadata validation.",
      15,
    ),
    relationship(
      "SuiteReadiness-SuiteStatus",
      "Readiness depends on Status",
      "SuiteReadiness",
      "SuiteStatus",
      "Readiness validation requires status validation.",
      16,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteVersion",
      "Suite depends on Version",
      "ExecutiveGatewaySuite",
      "SuiteVersion",
      "Suite validation requires version validation.",
      17,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteReadiness",
      "Suite depends on Readiness",
      "ExecutiveGatewaySuite",
      "SuiteReadiness",
      "Suite validation requires readiness validation.",
      18,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteRelationship",
      "Suite depends on Relationships",
      "ExecutiveGatewaySuite",
      "SuiteRelationship",
      "Suite validation requires relationship validation.",
      19,
    ),
    relationship(
      "ExecutiveGatewaySuite-SuiteValidationTarget",
      "Suite depends on Validation Target",
      "ExecutiveGatewaySuite",
      "SuiteValidationTarget",
      "Suite validation requires validation target validation.",
      20,
    ),
    relationship(
      "CrossModel-ExecutiveGatewaySuite",
      "Cross-Model covers Suite",
      "CrossModel",
      "ExecutiveGatewaySuite",
      "Cross-model validation includes suite aggregate relationships.",
      21,
    ),
    relationship(
      "CrossModel-SuiteSummary",
      "Cross-Model covers Summary",
      "CrossModel",
      "SuiteSummary",
      "Cross-model validation includes summary relationships.",
      22,
    ),
    relationship(
      "PlatformIntegrity-CrossModel",
      "Platform Integrity covers Cross-Model",
      "PlatformIntegrity",
      "CrossModel",
      "Platform integrity includes cross-model consistency.",
      23,
    ),
    relationship(
      "PlatformIntegrity-ExecutiveGatewaySuite",
      "Platform Integrity covers Suite Canonical References",
      "PlatformIntegrity",
      "ExecutiveGatewaySuite",
      "Platform integrity includes suite canonical reference consistency.",
      24,
    ),
  ]);

/** Canonical immutable validation relationship catalog. */
export const ExecutiveGatewaySuiteValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-8:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-8:4" as const,
  relationships: ExecutiveGatewaySuiteValidationRelationships,
  relationshipCount: ExecutiveGatewaySuiteValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
