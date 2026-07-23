/**
 * EIL-8:2 — Executive Integration Suite Registry.
 *
 * Canonical immutable registry for Executive Integration Suite Foundation vocabularies.
 * Consumes only the EIL-8:1 Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-8:2.
 */

import { ExecutiveIntegrationSuiteCapabilityRegistry } from "./executiveIntegrationSuiteCapabilityRegistry.ts";
import { ExecutiveIntegrationSuiteCompositionRegistry } from "./executiveIntegrationSuiteCompositionRegistry.ts";
import { ExecutiveIntegrationSuiteContractRegistry } from "./executiveIntegrationSuiteContractRegistry.ts";
import { ExecutiveIntegrationSuiteDomainRegistry } from "./executiveIntegrationSuiteDomainRegistry.ts";
import {
  ExecutiveIntegrationSuiteFoundation,
  ExecutiveIntegrationSuiteFoundationId,
  ExecutiveIntegrationSuiteFoundationIdentity,
  ExecutiveIntegrationSuiteFoundationSummary,
} from "./executiveIntegrationSuiteFoundation.ts";
import { ExecutiveIntegrationSuiteLifecycleRegistry } from "./executiveIntegrationSuiteLifecycleRegistry.ts";
import { ExecutiveIntegrationSuiteModuleRegistry } from "./executiveIntegrationSuiteModuleRegistry.ts";

/** Canonical phase ID. */
export const ExecutiveIntegrationSuiteRegistryPhaseId = "EIL-8:2" as const;

/** Canonical registry ID. */
export const ExecutiveIntegrationSuiteRegistryCanonicalId =
  "EIL-8:2/ExecutiveIntegrationSuiteRegistry" as const;

/** Human-readable registry name. */
export const ExecutiveIntegrationSuiteRegistryName =
  "Executive Integration Suite Registry" as const;

/** Semantic version. */
export const ExecutiveIntegrationSuiteRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveIntegrationSuiteRegistryNamespace =
  "nexora.eil.executive-integration-suite.registry" as const;

/** Registry status. */
export const ExecutiveIntegrationSuiteRegistryStatusValue = "Registry" as const;

/** Immediate next-phase readiness. */
export const ExecutiveIntegrationSuiteRegistryReadiness =
  "ReadyForModel" as const;

/**
 * Immutable identity for EIL-8:2 Executive Integration Suite Registry.
 */
export const ExecutiveIntegrationSuiteRegistryIdentity = Object.freeze({
  phaseId: ExecutiveIntegrationSuiteRegistryPhaseId,
  canonicalId: ExecutiveIntegrationSuiteRegistryCanonicalId,
  name: ExecutiveIntegrationSuiteRegistryName,
  version: ExecutiveIntegrationSuiteRegistryVersion,
  namespace: ExecutiveIntegrationSuiteRegistryNamespace,
  layer: "EIL" as const,
  platform: "EIL-8" as const,
  phaseType: "Registry" as const,
  status: ExecutiveIntegrationSuiteRegistryStatusValue,
  readiness: ExecutiveIntegrationSuiteRegistryReadiness,
  upstreamPhase: "EIL-8:1" as const,
  upstreamCanonicalId: ExecutiveIntegrationSuiteFoundationId,
  foundationEntryPoint: "executiveIntegrationSuiteFoundation.ts" as const,
  packageEntryPoint: "executiveIntegrationSuite/index.ts" as const,
  description:
    "Canonical immutable registry registering Executive Integration Suite Foundation modules, contracts, capabilities, domains, lifecycle stages, and composition for Model consumption.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Dynamically derived Registry inventory.
 */
export const ExecutiveIntegrationSuiteRegistryInventory = Object.freeze({
  inventoryId: "EIL-8:2/Inventory" as const,
  moduleCount: ExecutiveIntegrationSuiteModuleRegistry.length,
  contractCount: ExecutiveIntegrationSuiteContractRegistry.length,
  capabilityCount: ExecutiveIntegrationSuiteCapabilityRegistry.length,
  domainCount: ExecutiveIntegrationSuiteDomainRegistry.length,
  lifecycleCount: ExecutiveIntegrationSuiteLifecycleRegistry.length,
  totalRegistryRecordCount:
    ExecutiveIntegrationSuiteModuleRegistry.length +
    ExecutiveIntegrationSuiteContractRegistry.length +
    ExecutiveIntegrationSuiteCapabilityRegistry.length +
    ExecutiveIntegrationSuiteDomainRegistry.length +
    ExecutiveIntegrationSuiteLifecycleRegistry.length,
  countsDerivedFromCollections: true as const,
  hardcodedTotals: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-8:2/Dependency/EIL81Foundation" as const,
  upstreamPhase: "EIL-8:1" as const,
  upstreamCanonicalId: ExecutiveIntegrationSuiteFoundationId,
  foundationOnly: true as const,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  laterEil8PhaseImport: false as const,
  publicIndexDirectImport: false as const,
  directPreviousPhaseModule: "executiveIntegrationSuiteFoundation.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationSuite" as const,
  canonicalPath:
    "EIL-8:2 → EIL-8:1 ExecutiveIntegrationSuiteFoundation (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Executive Integration Suite Registry aggregate.
 */
export const ExecutiveIntegrationSuiteRegistry = Object.freeze({
  identity: ExecutiveIntegrationSuiteRegistryIdentity,
  foundation: ExecutiveIntegrationSuiteFoundation,
  foundationIdentity: ExecutiveIntegrationSuiteFoundationIdentity,
  foundationSummary: ExecutiveIntegrationSuiteFoundationSummary,
  modules: ExecutiveIntegrationSuiteModuleRegistry,
  contracts: ExecutiveIntegrationSuiteContractRegistry,
  capabilities: ExecutiveIntegrationSuiteCapabilityRegistry,
  domains: ExecutiveIntegrationSuiteDomainRegistry,
  lifecycle: ExecutiveIntegrationSuiteLifecycleRegistry,
  composition: ExecutiveIntegrationSuiteCompositionRegistry,
  inventory: ExecutiveIntegrationSuiteRegistryInventory,
  readiness: ExecutiveIntegrationSuiteRegistryReadiness,
  dependency,
  status: ExecutiveIntegrationSuiteRegistryStatusValue,
  nextPhase: "EIL-8:3 — Executive Integration Suite Model",
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
  importsLaterEil8Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
