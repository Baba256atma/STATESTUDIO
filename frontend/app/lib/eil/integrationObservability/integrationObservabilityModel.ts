/**
 * EIL-6:3 — Integration Observability Model.
 *
 * Canonical immutable architectural model for Integration Observability.
 * Consumes only the EIL-6:2 Integration Observability Registry aggregate.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by EIL-6:3.
 */

import { IntegrationObservabilityCapabilityModels } from "./integrationObservabilityCapabilityModels.ts";
import { IntegrationObservabilityContractModels } from "./integrationObservabilityContractModels.ts";
import { IntegrationObservabilityDomainModels } from "./integrationObservabilityDomainModels.ts";
import { IntegrationObservabilityEventModels } from "./integrationObservabilityEventModels.ts";
import { IntegrationObservabilityLifecycleModels } from "./integrationObservabilityLifecycleModels.ts";
import { IntegrationObservabilityMetricModels } from "./integrationObservabilityMetricModels.ts";
import {
  IntegrationObservabilityRegistry,
  IntegrationObservabilityRegistryCanonicalId,
  IntegrationObservabilityRegistryIdentity,
} from "./integrationObservabilityRegistry.ts";

/** Closed relationship-type vocabulary. */
export type ObservabilityRelationshipType =
  | "owns"
  | "references"
  | "contains"
  | "dependsOn"
  | "classifiedAs"
  | "progressesTo"
  | "groupedBy"
  | "validatedBy"
  | "publishedBy"
  | "sourcedFrom";

/** Immutable relationship descriptor. */
export interface IntegrationObservabilityRelationshipModel {
  readonly relationshipId: `EIL-6:3/Relationship/${string}`;
  readonly relationshipType: ObservabilityRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModelId: string;
  readonly targetModelId: string;
  readonly order: number;
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical phase ID. */
export const IntegrationObservabilityModelPhaseId = "EIL-6:3" as const;

/** Canonical model ID. */
export const IntegrationObservabilityModelCanonicalId =
  "EIL-6:3/IntegrationObservabilityModel" as const;

/** Human-readable model name. */
export const IntegrationObservabilityModelName =
  "Integration Observability Model" as const;

/** Semantic version. */
export const IntegrationObservabilityModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityModelNamespace =
  "nexora.eil.integration-observability.model" as const;

/** Model status. */
export const IntegrationObservabilityModelStatusValue = "Model" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityModelReadiness =
  "ReadyForValidation" as const;

/**
 * Immutable identity for EIL-6:3 Integration Observability Model.
 */
export const IntegrationObservabilityModelIdentity = Object.freeze({
  phaseId: IntegrationObservabilityModelPhaseId,
  canonicalId: IntegrationObservabilityModelCanonicalId,
  name: IntegrationObservabilityModelName,
  version: IntegrationObservabilityModelVersion,
  namespace: IntegrationObservabilityModelNamespace,
  layer: "EIL" as const,
  platform: "EIL-6" as const,
  phaseType: "Model" as const,
  status: IntegrationObservabilityModelStatusValue,
  readiness: IntegrationObservabilityModelReadiness,
  registryDependency: IntegrationObservabilityRegistryCanonicalId,
  registryEntryPoint: "integrationObservabilityRegistry.ts" as const,
  description:
    "Canonical immutable architectural model converting Integration Observability Registry vocabularies into typed domain, contract, capability, metric, event, and lifecycle models.",
  metadataOnly: true as const,
  immutable: true as const,
});

/** Deterministic Registry-derived model anchors (Foundation order). */
const domains = IntegrationObservabilityDomainModels;
const contracts = IntegrationObservabilityContractModels;
const capabilities = IntegrationObservabilityCapabilityModels;
const metrics = IntegrationObservabilityMetricModels;
const lifecycles = IntegrationObservabilityLifecycleModels;

const relationship = (
  key: string,
  relationshipType: ObservabilityRelationshipType,
  canonicalName: string,
  description: string,
  sourceModelId: string,
  targetModelId: string,
  order: number,
): IntegrationObservabilityRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-6:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModelId,
    targetModelId,
    order,
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten architectural relationships covering every relationship type.
 * Descriptive metadata only — not counted in the canonical model inventory of 55.
 */
export const IntegrationObservabilityRelationshipModels: readonly IntegrationObservabilityRelationshipModel[] =
  Object.freeze([
    relationship(
      "PoliciesOwnsMetrics",
      "owns",
      "Policies → Metrics",
      "Policies domain owns metrics domain architectural metadata.",
      domains[9]!.modelId,
      domains[0]!.modelId,
      1,
    ),
    relationship(
      "MetricsReferencesMetricsContract",
      "references",
      "Metrics → MetricsContract",
      "Metrics domain references metrics contract model metadata.",
      domains[0]!.modelId,
      contracts[1]!.modelId,
      2,
    ),
    relationship(
      "MetricsContainsAvailability",
      "contains",
      "Metrics → Availability",
      "Metrics domain contains availability metric model metadata.",
      domains[0]!.modelId,
      metrics[0]!.modelId,
      3,
    ),
    relationship(
      "HealthDependsOnDiagnostics",
      "dependsOn",
      "Health → Diagnostics",
      "Health domain depends on diagnostics domain metadata.",
      domains[4]!.modelId,
      domains[5]!.modelId,
      4,
    ),
    relationship(
      "AlertsClassifiedAsAlertCapability",
      "classifiedAs",
      "Alerts → AlertDefinition",
      "Alerts domain is classified as alert definition capability metadata.",
      domains[6]!.modelId,
      capabilities[5]!.modelId,
      5,
    ),
    relationship(
      "RegisteredProgressesToModeled",
      "progressesTo",
      "Registered → Modeled",
      "Registered lifecycle progresses to Modeled lifecycle metadata.",
      lifecycles[1]!.modelId,
      lifecycles[2]!.modelId,
      6,
    ),
    relationship(
      "EventsGroupedByEventsDomain",
      "groupedBy",
      "Events capability → Events domain",
      "Event definition capability is grouped by events domain metadata.",
      capabilities[1]!.modelId,
      domains[1]!.modelId,
      7,
    ),
    relationship(
      "ObservabilityValidatedByValidationLifecycle",
      "validatedBy",
      "ObservabilityContract → Validated",
      "Observability contract is validated by Validated lifecycle metadata.",
      contracts[0]!.modelId,
      lifecycles[3]!.modelId,
      8,
    ),
    relationship(
      "VisibilityPublishedByPublicIndex",
      "publishedBy",
      "Visibility → PublicIndex",
      "Visibility domain is published by PublicIndex lifecycle metadata.",
      domains[7]!.modelId,
      lifecycles[8]!.modelId,
      9,
    ),
    relationship(
      "ModelSourcedFromRegistry",
      "sourcedFrom",
      "Model → Registry",
      "Model aggregate is sourced from Registry aggregate metadata.",
      IntegrationObservabilityModelCanonicalId,
      IntegrationObservabilityRegistryIdentity.canonicalId,
      10,
    ),
  ]);

export const IntegrationObservabilityRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "contains",
  "dependsOn",
  "classifiedAs",
  "progressesTo",
  "groupedBy",
  "validatedBy",
  "publishedBy",
  "sourcedFrom",
] as const);

/**
 * Dynamically derived Model inventory (canonical model instances only).
 */
export const IntegrationObservabilityModelInventory = Object.freeze({
  inventoryId: "EIL-6:3/Inventory",
  domainCount: IntegrationObservabilityDomainModels.length,
  contractCount: IntegrationObservabilityContractModels.length,
  capabilityCount: IntegrationObservabilityCapabilityModels.length,
  metricCount: IntegrationObservabilityMetricModels.length,
  eventCount: IntegrationObservabilityEventModels.length,
  lifecycleCount: IntegrationObservabilityLifecycleModels.length,
  relationshipCount: IntegrationObservabilityRelationshipModels.length,
  totalModelInstanceCount:
    IntegrationObservabilityDomainModels.length +
    IntegrationObservabilityContractModels.length +
    IntegrationObservabilityCapabilityModels.length +
    IntegrationObservabilityMetricModels.length +
    IntegrationObservabilityEventModels.length +
    IntegrationObservabilityLifecycleModels.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-6:3/Dependency/EIL62Registry",
  upstreamPhase: "EIL-6:2" as const,
  upstreamCanonicalId: IntegrationObservabilityRegistryCanonicalId,
  registryOnly: true as const,
  registryPublicSurfaceOnly: true as const,
  registryInternalImport: false as const,
  foundationDirectImport: false as const,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityRegistry.ts" as const,
  canonicalPath:
    "EIL-6:3 → EIL-6:2 IntegrationObservabilityRegistry (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Observability Model aggregate.
 */
export const IntegrationObservabilityModel = Object.freeze({
  identity: IntegrationObservabilityModelIdentity,
  domains: IntegrationObservabilityDomainModels,
  contracts: IntegrationObservabilityContractModels,
  capabilities: IntegrationObservabilityCapabilityModels,
  metrics: IntegrationObservabilityMetricModels,
  events: IntegrationObservabilityEventModels,
  lifecycle: IntegrationObservabilityLifecycleModels,
  relationships: IntegrationObservabilityRelationshipModels,
  relationshipTypes: IntegrationObservabilityRelationshipTypes,
  inventory: IntegrationObservabilityModelInventory,
  readiness: IntegrationObservabilityModelReadiness,
  dependency,
  registryIdentity: IntegrationObservabilityRegistryIdentity,
  registry: IntegrationObservabilityRegistry,
  status: IntegrationObservabilityModelStatusValue,
  nextPhase: "EIL-6:4 — Integration Observability Validation",
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
  metricComputation: false as const,
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
