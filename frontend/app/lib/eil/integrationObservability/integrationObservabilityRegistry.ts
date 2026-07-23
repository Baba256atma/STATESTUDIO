/**
 * EIL-6:2 — Integration Observability Registry.
 *
 * Canonical immutable registry for Integration Observability Foundation vocabularies.
 * Consumes only the EIL-6:1 Foundation aggregate public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by EIL-6:2.
 */

import { IntegrationObservabilityCapabilityRegistry } from "./integrationObservabilityCapabilityRegistry.ts";
import { IntegrationObservabilityContractRegistry } from "./integrationObservabilityContractRegistry.ts";
import { IntegrationObservabilityDomainRegistry } from "./integrationObservabilityDomainRegistry.ts";
import { IntegrationObservabilityEventRegistry } from "./integrationObservabilityEventRegistry.ts";
import {
  IntegrationObservabilityFoundationId,
  IntegrationObservabilityFoundationIdentity,
  IntegrationObservabilityFoundationPlatform,
  IntegrationObservabilityFoundationSummary,
} from "./integrationObservabilityFoundation.ts";
import { IntegrationObservabilityLifecycleRegistry } from "./integrationObservabilityLifecycleRegistry.ts";
import { IntegrationObservabilityMetricRegistry } from "./integrationObservabilityMetricRegistry.ts";

/** Canonical phase ID. */
export const IntegrationObservabilityRegistryPhaseId = "EIL-6:2" as const;

/** Canonical registry ID. */
export const IntegrationObservabilityRegistryCanonicalId =
  "EIL-6:2/IntegrationObservabilityRegistry" as const;

/** Human-readable registry name. */
export const IntegrationObservabilityRegistryName =
  "Integration Observability Registry" as const;

/** Semantic version. */
export const IntegrationObservabilityRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityRegistryNamespace =
  "nexora.eil.integration-observability.registry" as const;

/** Registry status. */
export const IntegrationObservabilityRegistryStatusValue = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityRegistryReadiness =
  "ReadyForModel" as const;

/**
 * Immutable identity for EIL-6:2 Integration Observability Registry.
 */
export const IntegrationObservabilityRegistryIdentity = Object.freeze({
  phaseId: IntegrationObservabilityRegistryPhaseId,
  canonicalId: IntegrationObservabilityRegistryCanonicalId,
  name: IntegrationObservabilityRegistryName,
  version: IntegrationObservabilityRegistryVersion,
  namespace: IntegrationObservabilityRegistryNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Registry" as const,
  status: IntegrationObservabilityRegistryStatusValue,
  readiness: IntegrationObservabilityRegistryReadiness,
  upstreamPhase: "EIL-6:1" as const,
  upstreamCanonicalId: IntegrationObservabilityFoundationId,
  foundationEntryPoint: "integrationObservabilityFoundation.ts" as const,
  packageEntryPoint: "integrationObservability/index.ts" as const,
  description:
    "Canonical immutable registry registering Integration Observability Foundation domains, contracts, capabilities, metric categories, event categories, and lifecycle stages for Model consumption.",
  metadataOnly: true as const,
  immutable: true as const,
});

const foundation = IntegrationObservabilityFoundationPlatform;

/**
 * Dynamically derived Registry inventory.
 */
export const IntegrationObservabilityRegistryInventory = Object.freeze({
  inventoryId: "EIL-6:2/Inventory",
  domainCount: IntegrationObservabilityDomainRegistry.length,
  contractCount: IntegrationObservabilityContractRegistry.length,
  capabilityCount: IntegrationObservabilityCapabilityRegistry.length,
  metricCategoryCount: IntegrationObservabilityMetricRegistry.length,
  eventCategoryCount: IntegrationObservabilityEventRegistry.length,
  lifecycleCount: IntegrationObservabilityLifecycleRegistry.length,
  totalRegistryRecordCount:
    IntegrationObservabilityDomainRegistry.length +
    IntegrationObservabilityContractRegistry.length +
    IntegrationObservabilityCapabilityRegistry.length +
    IntegrationObservabilityMetricRegistry.length +
    IntegrationObservabilityEventRegistry.length +
    IntegrationObservabilityLifecycleRegistry.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-6:2/Dependency/EIL61Foundation",
  upstreamPhase: "EIL-6:1" as const,
  upstreamCanonicalId: IntegrationObservabilityFoundationId,
  foundationOnly: true as const,
  foundationPublicSurfaceOnly: true as const,
  foundationInternalImport: false as const,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityFoundation.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationObservability" as const,
  canonicalPath:
    "EIL-6:2 → EIL-6:1 IntegrationObservabilityFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Observability Registry aggregate.
 */
export const IntegrationObservabilityRegistry = Object.freeze({
  identity: IntegrationObservabilityRegistryIdentity,
  foundation: IntegrationObservabilityFoundationPlatform,
  foundationIdentity: IntegrationObservabilityFoundationIdentity,
  foundationSummary: IntegrationObservabilityFoundationSummary,
  domains: IntegrationObservabilityDomainRegistry,
  contracts: IntegrationObservabilityContractRegistry,
  capabilities: IntegrationObservabilityCapabilityRegistry,
  metricCategories: IntegrationObservabilityMetricRegistry,
  eventCategories: IntegrationObservabilityEventRegistry,
  lifecycle: IntegrationObservabilityLifecycleRegistry,
  inventory: IntegrationObservabilityRegistryInventory,
  readiness: IntegrationObservabilityRegistryReadiness,
  dependency,
  status: IntegrationObservabilityRegistryStatusValue,
  nextPhase: "EIL-6:3 — Integration Observability Model",
  foundationPlatform: foundation,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  monitoringEngine: false as const,
  telemetryPipeline: false as const,
  openTelemetry: false as const,
  prometheus: false as const,
  grafana: false as const,
  loggingFramework: false as const,
  tracingRuntime: false as const,
  metricsCollector: false as const,
  alertEngine: false as const,
  dashboard: false as const,
  healthCheckRuntime: false as const,
  eventEmission: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil6Phases: false as const,
  previousEilPlatformDependency: false as const,
  immutable: true as const,
  deterministic: true as const,
});
