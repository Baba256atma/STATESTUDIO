/**
 * EIL-6:1 — Integration Observability Foundation.
 *
 * Immutable architectural foundation for the Integration Observability Platform.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 * Does not consume previous EIL platforms.
 *
 * Ownership: owned exclusively by EIL-6:1.
 *
 * Aggregate surfaces (consumed via index.ts):
 *   IntegrationObservabilityFoundationIdentity
 *   IntegrationObservabilityFoundationCollections
 *   IntegrationObservabilityFoundationSummary
 *   IntegrationObservabilityFoundationPlatform
 */

import {
  IntegrationObservabilityFoundationCapabilities,
  IntegrationObservabilityFoundationCapabilityCatalog,
} from "./integrationObservabilityCapabilities.ts";
import {
  IntegrationObservabilityFoundationContractNames,
  IntegrationObservabilityFoundationContracts,
} from "./integrationObservabilityContracts.ts";
import { IntegrationObservabilityFoundationDomains } from "./integrationObservabilityDomains.ts";
import { IntegrationObservabilityEventCategories } from "./integrationObservabilityEventCategories.ts";
import { IntegrationObservabilityFoundationLifecycle } from "./integrationObservabilityLifecycle.ts";
import { IntegrationObservabilityMetricCategories } from "./integrationObservabilityMetricCategories.ts";

/** Canonical phase ID. */
export const IntegrationObservabilityFoundationPhaseId = "EIL-6:1" as const;

/** Canonical foundation ID. */
export const IntegrationObservabilityFoundationId =
  "EIL-6:1/IntegrationObservabilityFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationObservabilityFoundationName =
  "Integration Observability Foundation" as const;

/** Semantic version. */
export const IntegrationObservabilityFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationObservabilityFoundationNamespace =
  "nexora.eil.integration-observability.foundation" as const;

/** Layer. */
export const IntegrationObservabilityFoundationLayer = "EIL" as const;

/** Platform. */
export const IntegrationObservabilityFoundationPlatformId = "EIL-6" as const;

/** Phase type. */
export const IntegrationObservabilityFoundationPhaseType =
  "Foundation" as const;

/** Foundation status. */
export const IntegrationObservabilityFoundationStatusValue =
  "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationObservabilityFoundationReadinessValue =
  "ReadyForRegistry" as const;

/**
 * Immutable identity object for EIL-6:1 Integration Observability Foundation.
 */
export const IntegrationObservabilityFoundationIdentity = Object.freeze({
  phaseId: IntegrationObservabilityFoundationPhaseId,
  foundationId: IntegrationObservabilityFoundationId,
  canonicalId: IntegrationObservabilityFoundationId,
  name: IntegrationObservabilityFoundationName,
  version: IntegrationObservabilityFoundationVersion,
  namespace: IntegrationObservabilityFoundationNamespace,
  foundationNamespace: IntegrationObservabilityFoundationNamespace,
  foundationVersion: IntegrationObservabilityFoundationVersion,
  layer: IntegrationObservabilityFoundationLayer,
  platform: IntegrationObservabilityFoundationPlatformId,
  phaseType: IntegrationObservabilityFoundationPhaseType,
  status: IntegrationObservabilityFoundationStatusValue,
  readiness: IntegrationObservabilityFoundationReadinessValue,
  description:
    "Canonical immutable architectural foundation for Integration Observability metadata across metrics, events, logs, traces, health, alerts, diagnostics, and visibility.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-6:1/Dependency/None",
  phaseDependencyCount: 0,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  eilSharedStandardsOnly: true as const,
  canonicalPath: "EIL-6:1 IntegrationObservabilityFoundation (root)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const owns = Object.freeze([
  "Integration Observability identity",
  "architectural contracts",
  "capability declarations",
  "observability domains",
  "lifecycle definitions",
  "metric categories",
  "event categories",
  "architectural boundaries",
] as const);

const doesNotOwn = Object.freeze([
  "monitoring engine",
  "telemetry pipeline",
  "logging framework",
  "tracing runtime",
  "metrics collector",
  "alert engine",
  "dashboards",
  "networking",
  "persistence",
  "execution logic",
] as const);

const ownership = Object.freeze({
  ownershipId: "EIL-6:1/Ownership",
  owns,
  doesNotOwn,
  ownsCount: owns.length,
  doesNotOwnCount: doesNotOwn.length,
  metadataOnly: true as const,
  immutable: true as const,
});

const boundaries = Object.freeze({
  boundariesId: "EIL-6:1/Boundaries",
  architecturalBoundaries: Object.freeze([
    "Foundation owns observability metadata only",
    "No runtime monitoring, tracing, or logging engines",
    "No OpenTelemetry, Prometheus, or Grafana integrations",
    "No later EIL-6 phase imports",
    "No previous EIL platform dependency",
    "Platform-independent metadata declarations",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const compatibility = Object.freeze({
  compatibilityId: "EIL-6:1/Compatibility",
  scopes: Object.freeze([
    "Namespace",
    "Version",
    "Architecture",
    "MetadataOnly",
  ]),
  runtimeValidated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const terminology = Object.freeze({
  terminologyId: "EIL-6:1/Terminology",
  terms: Object.freeze([
    "Observability",
    "Metric",
    "Event",
    "Log",
    "Trace",
    "Health",
    "Alert",
    "Diagnostic",
    "Visibility",
    "Status",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

const inventory = Object.freeze({
  inventoryId: "EIL-6:1/Inventory",
  domainCount: IntegrationObservabilityFoundationDomains.length,
  contractCount: IntegrationObservabilityFoundationContracts.length,
  capabilityCount: IntegrationObservabilityFoundationCapabilities.length,
  lifecycleStateCount: IntegrationObservabilityFoundationLifecycle.stateCount,
  metricCategoryCount: IntegrationObservabilityMetricCategories.length,
  eventCategoryCount: IntegrationObservabilityEventCategories.length,
  totalFoundationEntryCount:
    IntegrationObservabilityFoundationDomains.length +
    IntegrationObservabilityFoundationContracts.length +
    IntegrationObservabilityFoundationCapabilities.length +
    IntegrationObservabilityFoundationLifecycle.stateCount +
    IntegrationObservabilityMetricCategories.length +
    IntegrationObservabilityEventCategories.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable collections for Integration Observability Foundation.
 * Inventory counts are dynamically derived from collection lengths.
 */
export const IntegrationObservabilityFoundationCollections = Object.freeze({
  collectionsId: "EIL-6:1/Collections",
  sourcePhase: "EIL-6:1" as const,
  domains: IntegrationObservabilityFoundationDomains,
  contracts: IntegrationObservabilityFoundationContracts,
  capabilities: IntegrationObservabilityFoundationCapabilities,
  lifecycleStates: IntegrationObservabilityFoundationLifecycle.states,
  metricCategories: IntegrationObservabilityMetricCategories,
  eventCategories: IntegrationObservabilityEventCategories,
  domainCount: IntegrationObservabilityFoundationDomains.length,
  contractCount: IntegrationObservabilityFoundationContracts.length,
  capabilityCount: IntegrationObservabilityFoundationCapabilities.length,
  lifecycleStateCount: IntegrationObservabilityFoundationLifecycle.stateCount,
  metricCategoryCount: IntegrationObservabilityMetricCategories.length,
  eventCategoryCount: IntegrationObservabilityEventCategories.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Canonical immutable Integration Observability Foundation summary.
 */
export const IntegrationObservabilityFoundationSummary = Object.freeze({
  foundationId: IntegrationObservabilityFoundationId,
  version: IntegrationObservabilityFoundationVersion,
  name: IntegrationObservabilityFoundationName,
  namespace: IntegrationObservabilityFoundationNamespace,
  status: IntegrationObservabilityFoundationStatusValue,
  readiness: IntegrationObservabilityFoundationReadinessValue,
  domainCount: IntegrationObservabilityFoundationDomains.length,
  contractCount: IntegrationObservabilityFoundationContracts.length,
  capabilityCount: IntegrationObservabilityFoundationCapabilities.length,
  lifecycleStateCount: IntegrationObservabilityFoundationLifecycle.stateCount,
  metricCategoryCount: IntegrationObservabilityMetricCategories.length,
  eventCategoryCount: IntegrationObservabilityEventCategories.length,
  totalFoundationEntryCount: inventory.totalFoundationEntryCount,
  nextPhase: "EIL-6:2 — Integration Observability Registry",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domains",
  "contracts",
  "capabilities",
  "lifecycle",
  "metricCategories",
  "eventCategories",
  "ownership",
  "boundaries",
  "collections",
  "summary",
] as const);

const foundationApi = (
  exportName: string,
  kind: "Aggregate" | "IdentityConstant" | "MetadataConstant" | "Collection",
) =>
  Object.freeze({
    id: `EIL-6:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-6:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationObservabilityFoundationVersion,
    status: IntegrationObservabilityFoundationStatusValue,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationObservabilityFoundation.ts" as const,
  });

const IntegrationObservabilityFoundationApiRegistry = Object.freeze([
  foundationApi("IntegrationObservabilityFoundationIdentity", "IdentityConstant"),
  foundationApi("IntegrationObservabilityFoundationContracts", "MetadataConstant"),
  foundationApi(
    "IntegrationObservabilityFoundationCapabilities",
    "MetadataConstant",
  ),
  foundationApi("IntegrationObservabilityFoundationDomains", "MetadataConstant"),
  foundationApi("IntegrationObservabilityFoundationLifecycle", "MetadataConstant"),
  foundationApi("IntegrationObservabilityMetricCategories", "MetadataConstant"),
  foundationApi("IntegrationObservabilityEventCategories", "MetadataConstant"),
  foundationApi("IntegrationObservabilityFoundationPlatform", "Aggregate"),
]);

/**
 * Canonical immutable Integration Observability Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationObservabilityFoundationPlatform = Object.freeze({
  identity: IntegrationObservabilityFoundationIdentity,
  dependency,
  domains: IntegrationObservabilityFoundationDomains,
  contracts: IntegrationObservabilityFoundationContracts,
  capabilities: IntegrationObservabilityFoundationCapabilityCatalog,
  lifecycle: IntegrationObservabilityFoundationLifecycle,
  metricCategories: IntegrationObservabilityMetricCategories,
  eventCategories: IntegrationObservabilityEventCategories,
  ownership,
  boundaries,
  compatibility,
  terminology,
  readiness: IntegrationObservabilityFoundationReadinessValue,
  contractNames: IntegrationObservabilityFoundationContractNames,
  capabilityDeclarations: IntegrationObservabilityFoundationCapabilities,
  collections: IntegrationObservabilityFoundationCollections,
  inventory,
  apiRegistry: IntegrationObservabilityFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationObservabilityFoundationStatusValue,
  nextPhase: "EIL-6:2 — Integration Observability Registry",
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
  schedulingBehavior: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  graphqlBehavior: false as const,
  websocketBehavior: false as const,
  queueBehavior: false as const,
  connectorExecution: false as const,
  adapterBehavior: false as const,
  sdkRuntime: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  filesystemBehavior: false as const,
  serviceBehavior: false as const,
  dependencyInjection: false as const,
  loggingBehavior: false as const,
  monitoringBehavior: false as const,
  telemetryBehavior: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  businessLogicBehavior: false as const,
  stateMutation: false as const,
  consumesPreviousEilPlatforms: false as const,
  importsLaterEil6Phases: false as const,
  immutable: true as const,
  deterministic: true as const,
});
