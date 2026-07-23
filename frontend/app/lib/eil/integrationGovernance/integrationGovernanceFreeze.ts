/**
 * EIL-7:8 — Integration Governance Freeze.
 *
 * Canonical immutable Freeze release baseline for Integration Governance.
 * Consumes only the EIL-7:7 Integration Governance Certification aggregate.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import {
  IntegrationGovernanceCertification,
  IntegrationGovernanceCertificationCanonicalId,
  IntegrationGovernanceCertificationIdentity,
} from "./integrationGovernanceCertification.ts";
import { IntegrationGovernanceFreezeArchitecture } from "./integrationGovernanceFreezeArchitecture.ts";
import { IntegrationGovernanceFreezeBaselines } from "./integrationGovernanceFreezeBaselines.ts";
import { IntegrationGovernanceFreezeCompatibility } from "./integrationGovernanceFreezeCompatibility.ts";
import { IntegrationGovernanceFreezeExtensions } from "./integrationGovernanceFreezeExtensions.ts";
import {
  IntegrationGovernanceFreezeCanonicalId,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
  IntegrationGovernanceFreezeName,
  IntegrationGovernanceFreezeNamespace,
  IntegrationGovernanceFreezePhaseId,
  IntegrationGovernanceFreezeReadinessValue,
  IntegrationGovernanceFreezeStatusValue,
  IntegrationGovernanceFreezeVersion,
} from "./integrationGovernanceFreezeIdentity.ts";
import { IntegrationGovernanceFreezeLocks } from "./integrationGovernanceFreezeLocks.ts";

export {
  IntegrationGovernanceFreezeCanonicalId,
  IntegrationGovernanceFreezeIdentity,
  IntegrationGovernanceFreezeLockId,
  IntegrationGovernanceFreezeName,
  IntegrationGovernanceFreezeNamespace,
  IntegrationGovernanceFreezePhaseId,
  IntegrationGovernanceFreezeReadinessValue,
  IntegrationGovernanceFreezeStatusValue,
  IntegrationGovernanceFreezeVersion,
};

const dependency = Object.freeze({
  dependencyId: "EIL-7:8/Dependency/EIL77Certification",
  upstreamPhase: "EIL-7:7" as const,
  upstreamCanonicalId: IntegrationGovernanceCertificationCanonicalId,
  certificationOnly: true as const,
  certificationPublicSurfaceOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDependency: false as const,
  laterEil7PhaseImport: false as const,
  previousEilPlatformDependency: false as const,
  directPreviousPhaseModule: "integrationGovernanceCertification.ts" as const,
  packageEntry: "frontend/app/lib/eil/integrationGovernance" as const,
  canonicalPath:
    "EIL-7:8 → EIL-7:7 IntegrationGovernanceCertification (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Integration Governance Freeze aggregate.
 */
export const IntegrationGovernanceFreeze = Object.freeze({
  identity: IntegrationGovernanceFreezeIdentity,
  lockId: IntegrationGovernanceFreezeLockId,
  architecturalLocks: IntegrationGovernanceFreezeLocks,
  frozenBaselines: IntegrationGovernanceFreezeBaselines,
  compatibility: IntegrationGovernanceFreezeCompatibility,
  extensions: IntegrationGovernanceFreezeExtensions,
  architecture: IntegrationGovernanceFreezeArchitecture,
  readiness: IntegrationGovernanceFreezeReadinessValue,
  dependency,
  certificationReference: Object.freeze({
    canonicalId: IntegrationGovernanceCertificationCanonicalId,
    identity: IntegrationGovernanceCertificationIdentity,
    aggregate: IntegrationGovernanceCertification,
    entryPoint: "integrationGovernanceCertification.ts" as const,
    exclusive: true as const,
  }),
  certificationDerivedInventory:
    IntegrationGovernanceFreezeArchitecture.certificationDerivedInventory,
  status: IntegrationGovernanceFreezeStatusValue,
  nextPhase: "EIL-7:9 — Integration Governance Public Index",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  governanceEngine: false as const,
  policyEngine: false as const,
  complianceEngine: false as const,
  certificationEngine: false as const,
  approvalWorkflow: false as const,
  auditRuntime: false as const,
  riskRuntime: false as const,
  versionManager: false as const,
  compatibilityResolver: false as const,
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
  importsLaterEil7Phases: false as const,
  previousEilPlatformDependency: false as const,
  deeplyImmutable: true as const,
  immutable: true as const,
  deterministic: true as const,
});
