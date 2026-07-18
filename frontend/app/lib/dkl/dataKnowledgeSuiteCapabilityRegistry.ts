/**
 * DKL-9:2 — Data Knowledge Suite Capability Registry.
 *
 * Registers suite capabilities, references, public platforms, API registry
 * access metadata, API counts, versions, statuses, and readiness.
 * Derived exclusively from DataKnowledgeSuiteFoundationPlatform.
 *
 * Ownership: owned exclusively by DKL-9:2.
 */

import { DataKnowledgeSuiteFoundationPlatform } from "./dataKnowledgeSuiteFoundation.ts";
import type {
  DataKnowledgeSuiteCapabilityRegistration,
  DataKnowledgeSuiteCapabilityReferenceRegistration,
  DataKnowledgeSuitePublicApiCountRegistration,
  DataKnowledgeSuitePublicApiRegistryRegistration,
  DataKnowledgeSuitePublicPlatformRegistration,
  DataKnowledgeSuiteReadinessRegistration,
  DataKnowledgeSuiteStatusRegistration,
  DataKnowledgeSuiteVersionRegistration,
} from "./dataKnowledgeSuiteRegistryTypes.ts";

const foundation = DataKnowledgeSuiteFoundationPlatform;
const catalog = foundation.capabilityCatalog;

/** Canonical capability registrations — catalog entries preserved by reference. */
export const DataKnowledgeSuiteCapabilityRegistry: readonly DataKnowledgeSuiteCapabilityRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/Capability/${capability.capabilityId}`,
        name: capability.capabilityName,
        capabilityId: capability.capabilityId,
        capabilityName: capability.capabilityName,
        stageId: capability.stageId,
        publicIndexId: capability.publicIndexId,
        publicIndexVersion: capability.publicIndexVersion,
        publicIndexName: capability.publicIndexName,
        publicIndexNamespace: capability.publicIndexNamespace,
        publicApiCount: capability.publicApiCount,
        publicPlatform: capability.publicPlatform,
        capabilityReference: capability,
        registrationStatus: "Registered" as const,
        integrationMode: "PublicIndexOnly" as const,
        introducesNewKnowledgeCapability: false as const,
        reconstructsUpstream: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability references — preserve Foundation catalog entries by reference. */
export const DataKnowledgeSuiteCapabilityReferenceRegistry: readonly DataKnowledgeSuiteCapabilityReferenceRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/CapabilityReference/${capability.capabilityId}`,
        name: `${capability.capabilityName} Reference`,
        capabilityId: capability.capabilityId,
        capabilityReference: capability,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Public platform registrations — preserve platforms by reference. */
export const DataKnowledgeSuitePublicPlatformRegistry: readonly DataKnowledgeSuitePublicPlatformRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/PublicPlatform/${capability.capabilityId}`,
        name: `${capability.capabilityName} Public Platform`,
        capabilityId: capability.capabilityId,
        publicPlatform: capability.publicPlatform,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/**
 * Public API registry access metadata.
 * Does not reconstruct or duplicate upstream Public API registries.
 */
export const DataKnowledgeSuitePublicApiRegistryRefs: readonly DataKnowledgeSuitePublicApiRegistryRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/PublicApiRegistryRef/${capability.capabilityId}`,
        name: `${capability.capabilityName} Public API Registry Reference`,
        capabilityId: capability.capabilityId,
        publicPlatform: capability.publicPlatform,
        publicApiCount: capability.publicApiCount,
        registryAccess: "ThroughPublicPlatformOnly" as const,
        reconstructsUpstreamRegistry: false as const,
        duplicatesUpstreamRegistry: false as const,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Public API counts — derived from Foundation catalog / inventory only. */
export const DataKnowledgeSuitePublicApiCountRegistry: readonly DataKnowledgeSuitePublicApiCountRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/PublicApiCount/${capability.capabilityId}`,
        name: `${capability.capabilityName} Public API Count`,
        capabilityId: capability.capabilityId,
        publicApiCount: capability.publicApiCount,
        sourcedThroughFoundation: true as const,
        hardcoded: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability versions — from Foundation catalog publicIndexVersion. */
export const DataKnowledgeSuiteVersionRegistry: readonly DataKnowledgeSuiteVersionRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/Version/${capability.capabilityId}`,
        name: `${capability.capabilityName} Version`,
        capabilityId: capability.capabilityId,
        publicIndexVersion: capability.publicIndexVersion,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability status registrations — suite composition status via Foundation. */
export const DataKnowledgeSuiteStatusRegistry: readonly DataKnowledgeSuiteStatusRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/Status/${capability.capabilityId}`,
        name: `${capability.capabilityName} Status`,
        capabilityId: capability.capabilityId,
        capabilityStatus: "ComposedInSuite" as const,
        suiteFoundationStatus: foundation.status,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Capability readiness registrations — via Foundation readiness. */
export const DataKnowledgeSuiteReadinessRegistry: readonly DataKnowledgeSuiteReadinessRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/Readiness/${capability.capabilityId}`,
        name: `${capability.capabilityName} Readiness`,
        capabilityId: capability.capabilityId,
        capabilityReadiness: "AvailableThroughPublicIndex" as const,
        suiteFoundationReadiness: foundation.readiness,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Canonical capability order preserved from Foundation catalog. */
export const DataKnowledgeSuiteCapabilityOrder = Object.freeze(
  catalog.map((capability) => capability.capabilityId),
);
