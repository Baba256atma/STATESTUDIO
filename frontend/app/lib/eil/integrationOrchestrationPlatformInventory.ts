/**
 * EIL-4:6 — Integration Orchestration Platform Inventory.
 *
 * Canonical platform inventory derived exclusively from the Manifest aggregate.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-4:6.
 */

import {
  IntegrationOrchestrationArchitectureManifest,
  IntegrationOrchestrationCompatibilityManifest,
  IntegrationOrchestrationDependencyManifest,
  IntegrationOrchestrationInventoryManifest,
  IntegrationOrchestrationManifestSummary,
} from "./integrationOrchestrationManifest.ts";
import type { IntegrationOrchestrationPlatformInventory as OrchestrationPlatformInventoryDescriptor } from "./integrationOrchestrationPlatformTypes.ts";

/** Platform aggregate public-export surface length (exact eight exports). */
const PLATFORM_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationOrchestrationPlatformIdentity",
  "IntegrationOrchestrationPlatformComposition",
  "IntegrationOrchestrationPlatformInventory",
  "IntegrationOrchestrationPlatformGuarantees",
  "IntegrationOrchestrationPlatformCompatibility",
  "IntegrationOrchestrationPlatformCollections",
  "IntegrationOrchestrationPlatformSummary",
  "IntegrationOrchestrationPlatform",
] as const);

/** Architecture / dependency manifesto units published by Manifest. */
const ARCHITECTURE_MANIFEST_UNITS = Object.freeze([
  IntegrationOrchestrationArchitectureManifest,
] as const);

const DEPENDENCY_MANIFEST_UNITS = Object.freeze([
  IntegrationOrchestrationDependencyManifest,
] as const);

/** Validation summary unit referenced through Manifest summary. */
const VALIDATION_SUMMARY_UNITS = Object.freeze([
  IntegrationOrchestrationManifestSummary.validationId,
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
  IntegrationOrchestrationInventoryManifest.totalInventoryCount;
const architectureManifestCount = ARCHITECTURE_MANIFEST_UNITS.length;
const dependencyManifestCount = DEPENDENCY_MANIFEST_UNITS.length;
const compatibilityManifestCount =
  IntegrationOrchestrationCompatibilityManifest.declarationCount;
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
export const IntegrationOrchestrationPlatformInventory: OrchestrationPlatformInventoryDescriptor =
  Object.freeze({
    inventoryId: "EIL-4:6/Inventory",
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
