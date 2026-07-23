/**
 * EIL-9:2 — Executive Integration Layer Registry.
 *
 * Canonical immutable registry for Executive Integration Layer Foundation vocabularies.
 * Consumes only the EIL-9:1 Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-9:2.
 */

import { ExecutiveIntegrationLayerCapabilityRegistry } from "./executiveIntegrationLayerCapabilityRegistry.ts";
import { ExecutiveIntegrationLayerCompositionRegistry } from "./executiveIntegrationLayerCompositionRegistry.ts";
import { ExecutiveIntegrationLayerContractRegistry } from "./executiveIntegrationLayerContractRegistry.ts";
import { ExecutiveIntegrationLayerDomainRegistry } from "./executiveIntegrationLayerDomainRegistry.ts";
import {
  ExecutiveIntegrationLayerFoundation,
  ExecutiveIntegrationLayerFoundationId,
  ExecutiveIntegrationLayerFoundationIdentity,
  ExecutiveIntegrationLayerFoundationSummary,
} from "./executiveIntegrationLayerFoundation.ts";
import { ExecutiveIntegrationLayerLifecycleRegistry } from "./executiveIntegrationLayerLifecycleRegistry.ts";
import { ExecutiveIntegrationLayerModuleRegistry } from "./executiveIntegrationLayerModuleRegistry.ts";

/** Canonical phase ID. */
export const ExecutiveIntegrationLayerRegistryPhaseId = "EIL-9:2" as const;

/** Canonical registry ID. */
export const ExecutiveIntegrationLayerRegistryCanonicalId =
  "EIL-9:2/ExecutiveIntegrationLayerRegistry" as const;

/** Human-readable registry name. */
export const ExecutiveIntegrationLayerRegistryName =
  "Executive Integration Layer Registry" as const;

/** Semantic version. */
export const ExecutiveIntegrationLayerRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveIntegrationLayerRegistryNamespace =
  "nexora.eil.executive-integration-layer.registry" as const;

/** Registry status. */
export const ExecutiveIntegrationLayerRegistryStatusValue = "Registry" as const;

/** Immediate next-phase readiness. */
export const ExecutiveIntegrationLayerRegistryReadiness =
  "ReadyForModel" as const;

/**
 * Immutable identity for EIL-9:2 Executive Integration Layer Registry.
 */
export const ExecutiveIntegrationLayerRegistryIdentity = Object.freeze({
  phaseId: ExecutiveIntegrationLayerRegistryPhaseId,
  canonicalId: ExecutiveIntegrationLayerRegistryCanonicalId,
  name: ExecutiveIntegrationLayerRegistryName,
  version: ExecutiveIntegrationLayerRegistryVersion,
  namespace: ExecutiveIntegrationLayerRegistryNamespace,
  layer: "EIL" as const,
  platform: "EIL-9" as const,
  phaseType: "Registry" as const,
  status: ExecutiveIntegrationLayerRegistryStatusValue,
  readiness: ExecutiveIntegrationLayerRegistryReadiness,
  upstreamPhase: "EIL-9:1" as const,
  upstreamCanonicalId: ExecutiveIntegrationLayerFoundationId,
  foundationEntryPoint: "executiveIntegrationLayerFoundation.ts" as const,
  packageEntryPoint: "executiveIntegrationLayer/index.ts" as const,
  description:
    "Canonical immutable registry registering Executive Integration Layer Foundation modules, contracts, capabilities, domains, lifecycle stages, and composition for Model consumption.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Dynamically derived Registry inventory.
 */
export const ExecutiveIntegrationLayerRegistryInventory = Object.freeze({
  inventoryId: "EIL-9:2/Inventory" as const,
  moduleCount: ExecutiveIntegrationLayerModuleRegistry.length,
  contractCount: ExecutiveIntegrationLayerContractRegistry.length,
  capabilityCount: ExecutiveIntegrationLayerCapabilityRegistry.length,
  domainCount: ExecutiveIntegrationLayerDomainRegistry.length,
  lifecycleCount: ExecutiveIntegrationLayerLifecycleRegistry.length,
  totalRegistryRecordCount:
    ExecutiveIntegrationLayerModuleRegistry.length +
    ExecutiveIntegrationLayerContractRegistry.length +
    ExecutiveIntegrationLayerCapabilityRegistry.length +
    ExecutiveIntegrationLayerDomainRegistry.length +
    ExecutiveIntegrationLayerLifecycleRegistry.length,
  compositionExcludedFromInventory: true as const,
  countsDerivedFromCollections: true as const,
  independentInventory: false as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-9:2/Dependency/EIL91Foundation" as const,
  upstreamPhase: "EIL-9:1" as const,
  upstreamCanonicalId: ExecutiveIntegrationLayerFoundationId,
  foundationOnly: true as const,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  laterEil9PhaseImport: false as const,
  publicIndexDirectImport: false as const,
  directPreviousPhaseModule: "executiveIntegrationLayerFoundation.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationLayer" as const,
  canonicalPath:
    "EIL-9:2 → EIL-9:1 ExecutiveIntegrationLayerFoundation (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Executive Integration Layer Registry aggregate.
 */
export const ExecutiveIntegrationLayerRegistry = Object.freeze({
  identity: ExecutiveIntegrationLayerRegistryIdentity,
  foundation: ExecutiveIntegrationLayerFoundation,
  foundationIdentity: ExecutiveIntegrationLayerFoundationIdentity,
  foundationSummary: ExecutiveIntegrationLayerFoundationSummary,
  modules: ExecutiveIntegrationLayerModuleRegistry,
  contracts: ExecutiveIntegrationLayerContractRegistry,
  capabilities: ExecutiveIntegrationLayerCapabilityRegistry,
  domains: ExecutiveIntegrationLayerDomainRegistry,
  lifecycle: ExecutiveIntegrationLayerLifecycleRegistry,
  composition: ExecutiveIntegrationLayerCompositionRegistry,
  inventory: ExecutiveIntegrationLayerRegistryInventory,
  readiness: ExecutiveIntegrationLayerRegistryReadiness,
  dependency,
  status: ExecutiveIntegrationLayerRegistryStatusValue,
  nextPhase: "EIL-9:3 — Executive Integration Layer Model",
  compositionOnly: true as const,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  integrationRuntime: false as const,
  orchestration: false as const,
  routing: false as const,
  governance: false as const,
  observability: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  apiBehavior: false as const,
  serviceBehavior: false as const,
  workerBehavior: false as const,
  schedulingBehavior: false as const,
  dashboard: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil9Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
