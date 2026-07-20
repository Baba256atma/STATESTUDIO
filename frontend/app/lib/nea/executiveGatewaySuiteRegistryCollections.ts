/**
 * NEA-8:2 — Executive Gateway Suite Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation composition, contracts, and lifecycle are referenced — not duplicated.
 * Suite component identities and statuses are derived through Foundation only.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:2.
 */

import {
  ExecutiveGatewaySuiteFoundationId,
  ExecutiveGatewaySuiteFoundationPlatform,
} from "./executiveGatewaySuiteFoundation.ts";
import type {
  ExecutiveGatewaySuiteComponentIdentity,
  ExecutiveGatewaySuiteComponentRegistration,
  ExecutiveGatewaySuiteDependencyDeclaration,
  ExecutiveGatewaySuiteRegistryEntry,
  ExecutiveGatewaySuiteStatusId,
  SuitePublicIndexStatusSurface,
} from "./executiveGatewaySuiteRegistryTypes.ts";

const foundation = ExecutiveGatewaySuiteFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-8:1" | "NEA-8:2",
  foundationReference: string | null,
  order: number,
): ExecutiveGatewaySuiteRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const readPublicIndexStatuses = (
  publicPlatform: unknown,
): SuitePublicIndexStatusSurface["publicIndex"] => {
  const surface = publicPlatform as SuitePublicIndexStatusSurface;
  return surface.publicIndex;
};

/** Contract registry — Foundation canonical references preserved. */
export const SuiteContractRegistry: readonly ExecutiveGatewaySuiteRegistryEntry[] =
  Object.freeze(
    foundation.contracts.contracts.map((item) =>
      entry(
        item.contractId.split("/").at(-1) ?? item.contractId,
        item.contractName,
        item.description,
        "NEA-8:1",
        `${ExecutiveGatewaySuiteFoundationId}/contracts/${item.contractId.split("/").at(-1)}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle registry — Foundation canonical references preserved. */
export const SuiteLifecycleRegistry: readonly ExecutiveGatewaySuiteRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation suite lifecycle state ${state}.`,
        "NEA-8:1",
        `${ExecutiveGatewaySuiteFoundationId}/lifecycle/${state}`,
        index + 1,
      ),
    ),
  );

/**
 * Suite Component Registry — exactly seven released platforms by Foundation reference.
 */
export const SuiteComponentRegistry: readonly ExecutiveGatewaySuiteComponentRegistration[] =
  Object.freeze(
    foundation.composition.components.map((component) =>
      Object.freeze({
        registrationId: `NEA-8:2/Component/${component.componentId}`,
        componentId: component.componentId,
        componentName: component.componentName,
        stageId: component.stageId,
        publicIndexId: component.publicIndexId,
        publicIndexVersion: component.publicIndexVersion,
        publicIndexName: component.publicIndexName,
        publicIndexNamespace: component.publicIndexNamespace,
        publicIndexModule: component.publicIndexModule,
        publicApiCount: component.publicApiCount,
        publicPlatform: component.publicPlatform,
        ownership: "Referenced" as const,
        registrationStatus: "Registered" as const,
        reconstructsUpstream: false as const,
        duplicatesArchitecture: false as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: component.deterministicOrder,
      }),
    ),
  );

/**
 * Suite Identity Registry — identity fields derived from Foundation → Public Index.
 */
export const SuiteComponentIdentityRegistry: readonly ExecutiveGatewaySuiteComponentIdentity[] =
  Object.freeze(
    foundation.composition.components.map((component) => {
      const publicIndex = readPublicIndexStatuses(component.publicPlatform);
      return Object.freeze({
        identityId: `NEA-8:2/ComponentIdentity/${component.componentId}`,
        componentId: component.componentId,
        componentName: component.componentName,
        namespace: component.publicIndexNamespace,
        version: component.publicIndexVersion,
        releaseStatus: publicIndex.releaseStatus,
        certificationStatus: publicIndex.certificationStatus,
        freezeStatus: publicIndex.freezeStatus,
        consumerReadiness: publicIndex.consumerReadiness,
        publicIndexId: component.publicIndexId,
        foundationReference: `${ExecutiveGatewaySuiteFoundationId}/composition/${component.componentId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: component.deterministicOrder,
      });
    }),
  );

/**
 * Suite Dependency Registry — declarative ordered dependencies between Suite components.
 * No runtime dependency resolution.
 */
export const SuiteDependencyRegistry: readonly ExecutiveGatewaySuiteDependencyDeclaration[] =
  Object.freeze(
    foundation.composition.components.map((component, index) => {
      const prior =
        index === 0 ? null : foundation.composition.components[index - 1]!;
      return Object.freeze({
        dependencyId: `NEA-8:2/Dependency/${component.componentId}`,
        componentId: component.componentId,
        componentName: component.componentName,
        dependsOnComponentId: prior?.componentId ?? null,
        dependsOnComponentName: prior?.componentName ?? null,
        dependencyMode: "DeclarativeOnly" as const,
        resolvesRuntime: false as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: component.deterministicOrder,
      });
    }),
  );

const status = (
  id: ExecutiveGatewaySuiteStatusId,
  description: string,
  order: number,
): ExecutiveGatewaySuiteRegistryEntry =>
  entry(id, id, description, "NEA-8:2", null, order);

/**
 * Suite Status Registry — immutable Suite statuses.
 * Registry-owned vocabulary. Declarations only.
 */
export const SuiteStatusRegistry: readonly ExecutiveGatewaySuiteRegistryEntry[] =
  Object.freeze([
    status("Registered", "Architecture registered suite status.", 1),
    status("Certified", "Architecture certified suite status.", 2),
    status("Frozen", "Architecture frozen suite status.", 3),
    status("Released", "Architecture released suite status.", 4),
    status("Deprecated", "Architecture deprecated suite status.", 5),
  ]);

/** Aggregate collections object for platform composition. */
export const ExecutiveGatewaySuiteRegistryCollections = Object.freeze({
  collectionsId: "NEA-8:2/RegistryCollections",
  sourcePhase: "NEA-8:2" as const,
  components: SuiteComponentRegistry,
  componentIdentities: SuiteComponentIdentityRegistry,
  dependencies: SuiteDependencyRegistry,
  statuses: SuiteStatusRegistry,
  contracts: SuiteContractRegistry,
  lifecycleEntries: SuiteLifecycleRegistry,
  componentCount: SuiteComponentRegistry.length,
  componentIdentityCount: SuiteComponentIdentityRegistry.length,
  dependencyCount: SuiteDependencyRegistry.length,
  statusCount: SuiteStatusRegistry.length,
  contractCount: SuiteContractRegistry.length,
  lifecycleEntryCount: SuiteLifecycleRegistry.length,
  publicApiInventoryTotal:
    foundation.inventory.publicApiInventoryTotal,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
