/**
 * EIL-9:3 — Executive Integration Layer Model.
 *
 * Canonical immutable architectural model for Executive Integration Layer.
 * Consumes only the EIL-9:2 Executive Integration Layer Registry aggregate.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-9:3.
 */

import { ExecutiveIntegrationLayerCapabilityModels } from "./executiveIntegrationLayerCapabilityModels.ts";
import { ExecutiveIntegrationLayerContractModels } from "./executiveIntegrationLayerContractModels.ts";
import { ExecutiveIntegrationLayerDomainModels } from "./executiveIntegrationLayerDomainModels.ts";
import { ExecutiveIntegrationLayerLifecycleModels } from "./executiveIntegrationLayerLifecycleModels.ts";
import { ExecutiveIntegrationLayerModuleModels } from "./executiveIntegrationLayerModuleModels.ts";
import {
  ExecutiveIntegrationLayerRelationshipModels,
  ExecutiveIntegrationLayerRelationshipTypes,
} from "./executiveIntegrationLayerRelationshipModels.ts";
import {
  ExecutiveIntegrationLayerRegistry,
  ExecutiveIntegrationLayerRegistryCanonicalId,
  ExecutiveIntegrationLayerRegistryIdentity,
} from "./executiveIntegrationLayerRegistry.ts";

/** Canonical phase ID. */
export const ExecutiveIntegrationLayerModelPhaseId = "EIL-9:3" as const;

/** Canonical model ID. */
export const ExecutiveIntegrationLayerModelCanonicalId =
  "EIL-9:3/ExecutiveIntegrationLayerModel" as const;

/** Human-readable model name. */
export const ExecutiveIntegrationLayerModelName =
  "Executive Integration Layer Model" as const;

/** Semantic version. */
export const ExecutiveIntegrationLayerModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveIntegrationLayerModelNamespace =
  "nexora.eil.executive-integration-layer.model" as const;

/** Model status. */
export const ExecutiveIntegrationLayerModelStatusValue = "Model" as const;

/** Immediate next-phase readiness. */
export const ExecutiveIntegrationLayerModelReadiness =
  "ReadyForValidation" as const;

/**
 * Immutable identity for EIL-9:3 Executive Integration Layer Model.
 */
export const ExecutiveIntegrationLayerModelIdentity = Object.freeze({
  phaseId: ExecutiveIntegrationLayerModelPhaseId,
  canonicalId: ExecutiveIntegrationLayerModelCanonicalId,
  name: ExecutiveIntegrationLayerModelName,
  version: ExecutiveIntegrationLayerModelVersion,
  namespace: ExecutiveIntegrationLayerModelNamespace,
  layer: "EIL" as const,
  platform: "EIL-9" as const,
  phaseType: "Model" as const,
  status: ExecutiveIntegrationLayerModelStatusValue,
  readiness: ExecutiveIntegrationLayerModelReadiness,
  registryDependency: ExecutiveIntegrationLayerRegistryCanonicalId,
  registryEntryPoint: "executiveIntegrationLayerRegistry.ts" as const,
  description:
    "Canonical immutable architectural model converting Executive Integration Layer Registry vocabularies into typed module, contract, capability, domain, lifecycle, and relationship models.",
  metadataOnly: true as const,
  immutable: true as const,
});

/**
 * Dynamically derived Model inventory (canonical model instances only).
 * Relationship models are excluded from the total.
 */
export const ExecutiveIntegrationLayerModelInventory = Object.freeze({
  inventoryId: "EIL-9:3/Inventory" as const,
  moduleCount: ExecutiveIntegrationLayerModuleModels.length,
  contractCount: ExecutiveIntegrationLayerContractModels.length,
  capabilityCount: ExecutiveIntegrationLayerCapabilityModels.length,
  domainCount: ExecutiveIntegrationLayerDomainModels.length,
  lifecycleCount: ExecutiveIntegrationLayerLifecycleModels.length,
  relationshipCount: ExecutiveIntegrationLayerRelationshipModels.length,
  totalModelInstanceCount:
    ExecutiveIntegrationLayerModuleModels.length +
    ExecutiveIntegrationLayerContractModels.length +
    ExecutiveIntegrationLayerCapabilityModels.length +
    ExecutiveIntegrationLayerDomainModels.length +
    ExecutiveIntegrationLayerLifecycleModels.length,
  countsDerivedFromCollections: true as const,
  hardcodedTotals: false as const,
  relationshipsExcludedFromInventory: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-9:3/Dependency/EIL92Registry" as const,
  upstreamPhase: "EIL-9:2" as const,
  upstreamCanonicalId: ExecutiveIntegrationLayerRegistryCanonicalId,
  registryOnly: true as const,
  registryPublicSurfaceOnly: true as const,
  registryInternalImport: false as const,
  foundationDirectImport: false as const,
  laterEil9PhaseImport: false as const,
  publicIndexDirectImport: false as const,
  eil8DirectImport: false as const,
  eil1ThroughEil7DirectImport: false as const,
  directPreviousPhaseModule: "executiveIntegrationLayerRegistry.ts" as const,
  packageEntry: "frontend/app/lib/eil/executiveIntegrationLayer" as const,
  canonicalPath:
    "EIL-9:3 → EIL-9:2 ExecutiveIntegrationLayerRegistry (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Executive Integration Layer Model aggregate.
 */
export const ExecutiveIntegrationLayerModel = Object.freeze({
  identity: ExecutiveIntegrationLayerModelIdentity,
  modules: ExecutiveIntegrationLayerModuleModels,
  contracts: ExecutiveIntegrationLayerContractModels,
  capabilities: ExecutiveIntegrationLayerCapabilityModels,
  domains: ExecutiveIntegrationLayerDomainModels,
  lifecycle: ExecutiveIntegrationLayerLifecycleModels,
  relationships: ExecutiveIntegrationLayerRelationshipModels,
  relationshipTypes: ExecutiveIntegrationLayerRelationshipTypes,
  inventory: ExecutiveIntegrationLayerModelInventory,
  readiness: ExecutiveIntegrationLayerModelReadiness,
  dependency,
  registryIdentity: ExecutiveIntegrationLayerRegistryIdentity,
  registry: ExecutiveIntegrationLayerRegistry,
  status: ExecutiveIntegrationLayerModelStatusValue,
  nextPhase: "EIL-9:4 — Executive Integration Layer Validation",
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
