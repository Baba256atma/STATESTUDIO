/**
 * DKL-9:2 — Data Knowledge Suite Dependency Registry.
 *
 * Registers suite capability dependencies and compatibility.
 * Derived exclusively from DataKnowledgeSuiteFoundationPlatform.
 *
 * Ownership: owned exclusively by DKL-9:2.
 */

import { DataKnowledgeSuiteFoundationPlatform } from "./dataKnowledgeSuiteFoundation.ts";
import type {
  DataKnowledgeSuiteCapabilityId,
  DataKnowledgeSuiteCompatibilityRegistration,
  DataKnowledgeSuiteDependencyRegistration,
} from "./dataKnowledgeSuiteRegistryTypes.ts";

const foundation = DataKnowledgeSuiteFoundationPlatform;
const integrations = foundation.integrationContracts;
const catalog = foundation.capabilityCatalog;

/** Capability dependency registrations from Foundation integration contracts. */
export const DataKnowledgeSuiteDependencyRegistry: readonly DataKnowledgeSuiteDependencyRegistration[] =
  Object.freeze(
    integrations.map((integration, index) => {
      const prior =
        index === 0
          ? null
          : (catalog[index - 1]!.capabilityId as DataKnowledgeSuiteCapabilityId);
      return Object.freeze({
        id: `DKL-9:2/Dependency/${integration.capabilityId}`,
        name: `${integration.capabilityId} Suite Dependency`,
        capabilityId: integration.capabilityId,
        publicIndexModule: integration.publicIndexModule,
        dependsOnPriorSuiteCapability: index > 0,
        priorCapabilityId: prior,
        integrationMode: "PublicIndexOnly" as const,
        preservesCanonicalReferences: true as const,
        deterministicOrder: integration.deterministicOrder,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      });
    }),
  );

/** Suite composition compatibility — capabilities remain compatible via Public Indexes. */
export const DataKnowledgeSuiteCompatibilityRegistry: readonly DataKnowledgeSuiteCompatibilityRegistration[] =
  Object.freeze(
    catalog.map((capability, index) =>
      Object.freeze({
        id: `DKL-9:2/Compatibility/${capability.capabilityId}`,
        name: `${capability.capabilityName} Compatibility`,
        capabilityId: capability.capabilityId,
        compatibilityStatus: "CompatibleWithinSuite" as const,
        suiteCompositionCompatible: true as const,
        reconstructsCapability: false as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );
