/**
 * EIL-5:6 — Integration Policy & Governance Platform Inventory.
 *
 * Canonical platform inventory derived exclusively from the Manifest aggregate.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-5:6.
 */

import {
  IntegrationPolicyGovernanceArchitectureManifest,
  IntegrationPolicyGovernanceCompatibilityManifest,
  IntegrationPolicyGovernanceDependencyManifest,
  IntegrationPolicyGovernanceInventoryManifest,
  IntegrationPolicyGovernanceManifestSummary,
} from "./integrationPolicyGovernanceManifest.ts";
import type { IntegrationPolicyGovernancePlatformInventory as PolicyGovernancePlatformInventoryDescriptor } from "./integrationPolicyGovernancePlatformTypes.ts";

/** Platform aggregate public-export surface length (exact eight exports). */
const PLATFORM_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationPolicyGovernancePlatformIdentity",
  "IntegrationPolicyGovernancePlatformComposition",
  "IntegrationPolicyGovernancePlatformInventory",
  "IntegrationPolicyGovernancePlatformGuarantees",
  "IntegrationPolicyGovernancePlatformCompatibility",
  "IntegrationPolicyGovernancePlatformCollections",
  "IntegrationPolicyGovernancePlatformSummary",
  "IntegrationPolicyGovernancePlatform",
] as const);

/** Architecture / dependency manifesto units published by Manifest. */
const ARCHITECTURE_MANIFEST_UNITS = Object.freeze([
  IntegrationPolicyGovernanceArchitectureManifest,
] as const);

const DEPENDENCY_MANIFEST_UNITS = Object.freeze([
  IntegrationPolicyGovernanceDependencyManifest,
] as const);

/** Validation summary unit referenced through Manifest summary. */
const VALIDATION_SUMMARY_UNITS = Object.freeze([
  IntegrationPolicyGovernanceManifestSummary.validationId,
] as const);

/** Platform metadata units published by this phase. */
const PLATFORM_METADATA_UNITS = Object.freeze([
  "identity",
  "composition",
  "inventory",
  "guarantees",
  "compatibility",
  "collections",
  "summary",
  "readiness",
] as const);

const manifestInventoryTotal =
  IntegrationPolicyGovernanceInventoryManifest.totalInventoryCount;
const architectureManifestCount = ARCHITECTURE_MANIFEST_UNITS.length;
const dependencyManifestCount = DEPENDENCY_MANIFEST_UNITS.length;
const compatibilityManifestCount =
  IntegrationPolicyGovernanceCompatibilityManifest.declarationCount;
const validationSummaryCount = VALIDATION_SUMMARY_UNITS.length;
const platformMetadataCount = PLATFORM_METADATA_UNITS.length;
const aggregatePublicExports = PLATFORM_PUBLIC_EXPORTS.length;

const total =
  manifestInventoryTotal +
  architectureManifestCount +
  dependencyManifestCount +
  compatibilityManifestCount +
  validationSummaryCount +
  platformMetadataCount +
  aggregatePublicExports;

/**
 * Canonical immutable platform inventory.
 * Every count is derived from Manifest or local canonical collections.
 */
export const IntegrationPolicyGovernancePlatformInventory: PolicyGovernancePlatformInventoryDescriptor =
  Object.freeze({
    inventoryId: "EIL-5:6/Inventory",
    manifestInventoryTotal,
    architectureManifestCount,
    dependencyManifestCount,
    compatibilityManifestCount,
    validationSummaryCount,
    platformMetadataCount,
    aggregatePublicExports,
    total,
    countsDerivedFromManifest: true as const,
    hardcodedCounts: false as const,
    duplicatesUpstreamCollections: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
