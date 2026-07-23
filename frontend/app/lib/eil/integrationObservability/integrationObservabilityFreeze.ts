/**
 * EIL-6:8 — Integration Observability Freeze.
 *
 * Canonical immutable Freeze release baseline for Integration Observability.
 * Consumes only the EIL-6:7 Integration Observability Certification aggregate.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-6:8.
 */

import {
  IntegrationObservabilityCertification,
  IntegrationObservabilityCertificationCanonicalId,
  IntegrationObservabilityCertificationIdentity,
} from "./integrationObservabilityCertification.ts";
import { IntegrationObservabilityFreezeArchitecture } from "./integrationObservabilityFreezeArchitecture.ts";
import { IntegrationObservabilityFreezeBaselines } from "./integrationObservabilityFreezeBaselines.ts";
import { IntegrationObservabilityFreezeCompatibility } from "./integrationObservabilityFreezeCompatibility.ts";
import { IntegrationObservabilityFreezeExtensions } from "./integrationObservabilityFreezeExtensions.ts";
import {
  IntegrationObservabilityFreezeCanonicalId,
  IntegrationObservabilityFreezeIdentity,
  IntegrationObservabilityFreezeLockId,
  IntegrationObservabilityFreezeName,
  IntegrationObservabilityFreezeNamespace,
  IntegrationObservabilityFreezePhaseId,
  IntegrationObservabilityFreezeReadinessValue,
  IntegrationObservabilityFreezeStatusValue,
  IntegrationObservabilityFreezeVersion,
} from "./integrationObservabilityFreezeIdentity.ts";
import { IntegrationObservabilityFreezeLocks } from "./integrationObservabilityFreezeLocks.ts";

export {
  IntegrationObservabilityFreezeCanonicalId,
  IntegrationObservabilityFreezeIdentity,
  IntegrationObservabilityFreezeLockId,
  IntegrationObservabilityFreezeName,
  IntegrationObservabilityFreezeNamespace,
  IntegrationObservabilityFreezePhaseId,
  IntegrationObservabilityFreezeReadinessValue,
  IntegrationObservabilityFreezeStatusValue,
  IntegrationObservabilityFreezeVersion,
};

const dependency = Object.freeze({
  dependencyId: "EIL-6:8/Dependency/EIL67Certification",
  upstreamPhase: "EIL-6:7" as const,
  upstreamCanonicalId: IntegrationObservabilityCertificationCanonicalId,
  certificationOnly: true as const,
  certificationPublicSurfaceOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDependency: false as const,
  laterEil6PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationObservabilityCertification.ts" as const,
  canonicalPath:
    "EIL-6:8 → EIL-6:7 IntegrationObservabilityCertification (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Observability Freeze aggregate.
 */
export const IntegrationObservabilityFreeze = Object.freeze({
  identity: IntegrationObservabilityFreezeIdentity,
  lockId: IntegrationObservabilityFreezeLockId,
  architecturalLocks: IntegrationObservabilityFreezeLocks,
  frozenBaselines: IntegrationObservabilityFreezeBaselines,
  compatibility: IntegrationObservabilityFreezeCompatibility,
  extensions: IntegrationObservabilityFreezeExtensions,
  architecture: IntegrationObservabilityFreezeArchitecture,
  readiness: IntegrationObservabilityFreezeReadinessValue,
  dependency,
  certificationReference: Object.freeze({
    canonicalId: IntegrationObservabilityCertificationCanonicalId,
    identity: IntegrationObservabilityCertificationIdentity,
    aggregate: IntegrationObservabilityCertification,
    entryPoint: "integrationObservabilityCertification.ts" as const,
    exclusive: true as const,
  }),
  certificationDerivedInventory:
    IntegrationObservabilityFreezeArchitecture.certificationDerivedInventory,
  status: IntegrationObservabilityFreezeStatusValue,
  nextPhase: "EIL-6:9 — Integration Observability Public Index",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  monitoringEngine: false as const,
  telemetryPipeline: false as const,
  openTelemetry: false as const,
  prometheus: false as const,
  grafana: false as const,
  loggingFramework: false as const,
  tracingRuntime: false as const,
  metricsEngine: false as const,
  alertEngine: false as const,
  healthEngine: false as const,
  dashboard: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  serviceBehavior: false as const,
  schedulingBehavior: false as const,
  queueBehavior: false as const,
  workerBehavior: false as const,
  apiBehavior: false as const,
  aiBehavior: false as const,
  uiBehavior: false as const,
  reactBehavior: false as const,
  stateMutation: false as const,
  importsLaterEil6Phases: false as const,
  previousEilPlatformDependency: false as const,
  deeplyImmutable: true as const,
  immutable: true as const,
  deterministic: true as const,
});
