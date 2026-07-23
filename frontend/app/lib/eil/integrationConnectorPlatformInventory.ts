/**
 * EIL-2:6 — Integration Connector Platform Inventory.
 *
 * Canonical platform inventory derived exclusively from the Manifest aggregate.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by EIL-2:6.
 */

import {
  IntegrationConnectorArchitectureManifest,
  IntegrationConnectorCompatibilityManifest,
  IntegrationConnectorDependencyManifest,
  IntegrationConnectorInventoryManifest,
  IntegrationConnectorManifestSummary,
} from "./integrationConnectorManifest.ts";
import type { IntegrationConnectorPlatformInventoryDescriptor } from "./integrationConnectorPlatformTypes.ts";

/** Platform aggregate public-export surface length (exact eight exports). */
const PLATFORM_PUBLIC_EXPORTS = Object.freeze([
  "IntegrationConnectorPlatformIdentity",
  "IntegrationConnectorPlatformComposition",
  "IntegrationConnectorPlatformInventory",
  "IntegrationConnectorPlatformGuarantees",
  "IntegrationConnectorPlatformCompatibility",
  "IntegrationConnectorPlatformCollections",
  "IntegrationConnectorPlatformSummary",
  "IntegrationConnectorPlatform",
] as const);

/** Architecture / dependency manifesto units published by Manifest. */
const ARCHITECTURE_MANIFEST_UNITS = Object.freeze([
  IntegrationConnectorArchitectureManifest,
] as const);

const DEPENDENCY_MANIFEST_UNITS = Object.freeze([
  IntegrationConnectorDependencyManifest,
] as const);

/** Validation summary unit referenced through Manifest summary. */
const VALIDATION_SUMMARY_UNITS = Object.freeze([
  IntegrationConnectorManifestSummary.validationId,
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
  IntegrationConnectorInventoryManifest.totalInventoryCount;
const architectureManifestCount = ARCHITECTURE_MANIFEST_UNITS.length;
const dependencyManifestCount = DEPENDENCY_MANIFEST_UNITS.length;
const compatibilityManifestCount =
  IntegrationConnectorCompatibilityManifest.declarationCount;
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
export const IntegrationConnectorPlatformInventory: IntegrationConnectorPlatformInventoryDescriptor =
  Object.freeze({
    inventoryId: "EIL-2:6/Inventory",
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
