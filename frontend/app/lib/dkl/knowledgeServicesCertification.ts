/**
 * DKL-7:7 — Knowledge Services Certification.
 *
 * Canonical immutable certification architecture for Knowledge Services through
 * DKL-7:6 Platform. Consumes only the Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by DKL-7:7.
 *
 * Public exports (exactly 12):
 *   KnowledgeServicesCertification
 *   KnowledgeServicesCertificationId
 *   KnowledgeServicesCertificationName
 *   KnowledgeServicesCertificationVersion
 *   KnowledgeServicesCertificationNamespace
 *   KnowledgeServicesCertificationStatus
 *   KnowledgeServicesCertificationResult
 *   KnowledgeServicesCertificationReadiness
 *   KnowledgeServicesCertificationGates
 *   KnowledgeServicesCertificationGuarantees
 *   getKnowledgeServicesCertificationSummary()
 *   getKnowledgeServicesCertificationInventoryCount()
 */

import { KnowledgeServicesCertificationCompatibility } from "./knowledgeServicesCertificationCompatibility.ts";
import {
  KnowledgeServicesCertificationEvidence,
  KnowledgeServicesCertificationResults,
} from "./knowledgeServicesCertificationEvidence.ts";
import {
  KnowledgeServicesCertificationAllGatesPass,
  KnowledgeServicesCertificationDependencyDeclarations,
  KnowledgeServicesCertificationGateGroups,
  KnowledgeServicesCertificationGates,
} from "./knowledgeServicesCertificationGates.ts";
import { KnowledgeServicesCertificationGuarantees } from "./knowledgeServicesCertificationGuarantees.ts";
import { KnowledgeServicesCertificationRegressions } from "./knowledgeServicesCertificationRegressions.ts";
import type {
  KnowledgeServicesCertificationIdentity,
  KnowledgeServicesCertificationInventory as CertificationInventoryRecord,
  KnowledgeServicesCertificationMetadata,
  KnowledgeServicesCertificationPublicApiDeclaration,
  KnowledgeServicesCertificationSummary,
  KnowledgeServicesCertifiedPhaseReference,
} from "./knowledgeServicesCertificationTypes.ts";
import {
  getKnowledgeServicesPlatformInventoryCount,
  KnowledgeServicesPlatform,
  KnowledgeServicesPlatformId,
  KnowledgeServicesPlatformVersion,
} from "./knowledgeServicesPlatform.ts";

export const KnowledgeServicesCertificationId =
  "DKL-7:7/KnowledgeServicesCertification" as const;

export const KnowledgeServicesCertificationName =
  "Knowledge Services Certification" as const;

export const KnowledgeServicesCertificationVersion = "1.0.0" as const;

export const KnowledgeServicesCertificationNamespace =
  "nexora.dkl.knowledge-services.certification" as const;

export const KnowledgeServicesCertificationStatus = "Certified" as const;

export const KnowledgeServicesCertificationResult = "Pass" as const;

export const KnowledgeServicesCertificationReadiness = "ReadyForFreeze" as const;

const KnowledgeServicesCertificationArchitectureStatus =
  "CertifiedThroughPlatform" as const;

export {
  KnowledgeServicesCertificationGates,
  KnowledgeServicesCertificationGuarantees,
};

const platform = KnowledgeServicesPlatform;
const chain = Object.freeze({
  platformId: KnowledgeServicesPlatformId,
  platformVersion: KnowledgeServicesPlatformVersion,
  manifestId: platform.identity.manifestId,
  validationId: platform.identity.validationId,
  modelId: platform.identity.modelId,
  registryId: platform.identity.registryId,
  foundationId: platform.identity.foundationId,
  dkl6PublicIndexId: platform.identity.dkl6PublicIndexId,
});

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeServicesCertificationPublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-7:7/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

const KnowledgeServicesCertificationPublicApis: readonly KnowledgeServicesCertificationPublicApiDeclaration[] =
  Object.freeze([
    api("KnowledgeServicesCertification", "Canonical Certification aggregate.", 1),
    api("KnowledgeServicesCertificationId", "Certification identity constant.", 2),
    api("KnowledgeServicesCertificationName", "Certification name constant.", 3),
    api(
      "KnowledgeServicesCertificationVersion",
      "Certification version constant.",
      4,
    ),
    api(
      "KnowledgeServicesCertificationNamespace",
      "Certification namespace constant.",
      5,
    ),
    api(
      "KnowledgeServicesCertificationStatus",
      "Certification status constant.",
      6,
    ),
    api(
      "KnowledgeServicesCertificationResult",
      "Certification overall result constant.",
      7,
    ),
    api(
      "KnowledgeServicesCertificationReadiness",
      "Certification readiness constant.",
      8,
    ),
    api("KnowledgeServicesCertificationGates", "Eighteen certification gates.", 9),
    api(
      "KnowledgeServicesCertificationGuarantees",
      "Twenty-two certification guarantees.",
      10,
    ),
    api(
      "getKnowledgeServicesCertificationSummary",
      "Deterministic frozen Certification summary helper.",
      11,
    ),
    api(
      "getKnowledgeServicesCertificationInventoryCount",
      "Deterministic Certification inventory count helper.",
      12,
    ),
  ]);

/**
 * Counting rule for getKnowledgeServicesCertificationInventoryCount():
 * completedPhases + futurePhases + gateGroups + gates + evidence + results +
 * compatibility + regressions + guarantees + publicApis
 *
 * Documented addends: 7+2+12+18+18+18+16+12+22+12 = 137
 */
const COUNTING_RULE =
  "7+2+12+18+18+18+16+12+22+12";

const totalEntryCount =
  7 +
  2 +
  KnowledgeServicesCertificationGateGroups.length +
  KnowledgeServicesCertificationGates.length +
  KnowledgeServicesCertificationEvidence.length +
  KnowledgeServicesCertificationResults.length +
  KnowledgeServicesCertificationCompatibility.length +
  KnowledgeServicesCertificationRegressions.length +
  KnowledgeServicesCertificationGuarantees.length +
  KnowledgeServicesCertificationPublicApis.length;

const KnowledgeServicesCertificationInventory: CertificationInventoryRecord =
  Object.freeze({
    inventoryId: "DKL-7:7/KnowledgeServicesCertificationInventory",
    completedPhaseCount: 7 as const,
    futurePhaseCount: 2 as const,
    totalPhaseCount: 9 as const,
    sectionCount: 18 as const,
    gateGroupCount: 12 as const,
    gateCount: 18 as const,
    evidenceCount: 18 as const,
    resultCount: 18 as const,
    passedCount: 18 as const,
    failedCount: 0 as const,
    notApplicableCount: 0 as const,
    findingCount: 0 as const,
    compatibilityCount: 16 as const,
    regressionCount: 12 as const,
    guaranteeCount: 22 as const,
    publicApiCount: 12 as const,
    platformSectionCount: 20 as const,
    platformDependencyCount: 12 as const,
    platformConsumerCount: 4 as const,
    platformCompatibilityCount: 14 as const,
    platformGuaranteeCount: 20 as const,
    platformInventoryCount: getKnowledgeServicesPlatformInventoryCount() as 527,
    serviceCount: 12 as const,
    capabilityCount: 12 as const,
    contractCount: 11 as const,
    modelInventoryCount: 79 as const,
    validationPassCount: 48 as const,
    manifestInventoryCount: 447 as const,
    ownedResponsibilityCount: 6 as const,
    nonOwnedResponsibilityCount: 24 as const,
    prohibitedSurfaceCount: 29 as const,
    mutationModeCount: 0 as const,
    totalEntryCount,
    countingRule: COUNTING_RULE,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });

const identity: KnowledgeServicesCertificationIdentity = Object.freeze({
  certificationId: KnowledgeServicesCertificationId,
  certificationName: KnowledgeServicesCertificationName,
  certificationVersion: KnowledgeServicesCertificationVersion,
  certificationNamespace: KnowledgeServicesCertificationNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Certification",
  sourcePhase: "DKL-7:7",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesCertificationStatus,
  certificationResult: KnowledgeServicesCertificationResult,
  architectureStatus: KnowledgeServicesCertificationArchitectureStatus,
  readiness: KnowledgeServicesCertificationReadiness,
  platformId: chain.platformId,
  platformVersion: chain.platformVersion,
  manifestId: chain.manifestId,
  validationId: chain.validationId,
  modelId: chain.modelId,
  registryId: chain.registryId,
  foundationId: chain.foundationId,
  dkl6PublicIndexId: chain.dkl6PublicIndexId,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesCertificationMetadata = Object.freeze({
  metadataId: "DKL-7:7/KnowledgeServicesCertificationMetadata",
  certificationId: KnowledgeServicesCertificationId,
  description:
    "Canonical immutable certification of Knowledge Services through DKL-7:6 Platform.",
  metadataOnly: true,
  declarationOnly: true,
  runtimeBehavior: false,
  transportNeutral: true,
  persistenceNeutral: true,
  immutable: true,
  deterministic: true,
});

const certifiedPhases: readonly KnowledgeServicesCertifiedPhaseReference[] =
  Object.freeze([
    Object.freeze({
      phaseId: chain.foundationId,
      stage: "Foundation",
      version: "1.0.0",
      completionStatus: "FoundationComplete",
      certified: true,
      deterministicOrder: 1,
    }),
    Object.freeze({
      phaseId: chain.registryId,
      stage: "Registry",
      version: "1.0.0",
      completionStatus: "RegistryComplete",
      certified: true,
      deterministicOrder: 2,
    }),
    Object.freeze({
      phaseId: chain.modelId,
      stage: "Model",
      version: "1.0.0",
      completionStatus: "ModelComplete",
      certified: true,
      deterministicOrder: 3,
    }),
    Object.freeze({
      phaseId: chain.validationId,
      stage: "Validation",
      version: "1.0.0",
      completionStatus: "ValidationComplete",
      certified: true,
      deterministicOrder: 4,
    }),
    Object.freeze({
      phaseId: chain.manifestId,
      stage: "Manifest",
      version: "1.0.0",
      completionStatus: "ManifestComplete",
      certified: true,
      deterministicOrder: 5,
    }),
    Object.freeze({
      phaseId: chain.platformId,
      stage: "Platform",
      version: "1.0.0",
      completionStatus: "PlatformComplete",
      certified: true,
      deterministicOrder: 6,
    }),
    Object.freeze({
      phaseId: KnowledgeServicesCertificationId,
      stage: "Certification",
      version: KnowledgeServicesCertificationVersion,
      completionStatus: "Certified",
      certified: true,
      deterministicOrder: 7,
    }),
    Object.freeze({
      phaseId: "DKL-7:8/KnowledgeServicesFreeze",
      stage: "Freeze",
      version: "Future",
      completionStatus: "Declared",
      certified: false,
      deterministicOrder: 8,
    }),
    Object.freeze({
      phaseId: "DKL-7:9/KnowledgeServicesPublicIndex",
      stage: "PublicIndex",
      version: "Future",
      completionStatus: "Declared",
      certified: false,
      deterministicOrder: 9,
    }),
  ]);

const passedCount = KnowledgeServicesCertificationResults.filter(
  (item) => item.outcome === "Pass",
).length;
const failedCount = KnowledgeServicesCertificationResults.filter(
  (item) => item.outcome === "Fail",
).length;
const notApplicableCount = KnowledgeServicesCertificationResults.filter(
  (item) => item.outcome === "NotApplicable",
).length;
const criticalFailures = KnowledgeServicesCertificationGates.filter(
  (item) => item.severity === "Critical" && item.result === "Fail",
).length;
const highFailures = KnowledgeServicesCertificationGates.filter(
  (item) => item.severity === "High" && item.result === "Fail",
).length;

/** Canonical immutable Knowledge Services Certification aggregate. */
export const KnowledgeServicesCertification = Object.freeze({
  identity,
  metadata,
  platform: KnowledgeServicesPlatform,
  architecture: Object.freeze({
    status: KnowledgeServicesCertificationArchitectureStatus,
    phases: certifiedPhases,
    completedPhaseCount: 7 as const,
    futurePhaseCount: 2 as const,
    totalPhaseCount: 9 as const,
  }),
  groups: KnowledgeServicesCertificationGateGroups,
  gates: KnowledgeServicesCertificationGates,
  evidence: KnowledgeServicesCertificationEvidence,
  results: KnowledgeServicesCertificationResults,
  findings: Object.freeze([]) as readonly never[],
  compatibility: KnowledgeServicesCertificationCompatibility,
  regressions: KnowledgeServicesCertificationRegressions,
  ownership: platform.ownership,
  boundaries: platform.boundaries,
  inventory: KnowledgeServicesCertificationInventory,
  guarantees: KnowledgeServicesCertificationGuarantees,
  status: KnowledgeServicesCertificationStatus,
  result: KnowledgeServicesCertificationResult,
  readiness: KnowledgeServicesCertificationReadiness,
  publicApi: KnowledgeServicesCertificationPublicApis,
  dependencyDeclarations: KnowledgeServicesCertificationDependencyDeclarations,
  architectureStatus: KnowledgeServicesCertificationArchitectureStatus,
  certificationResult: KnowledgeServicesCertificationResult,
  resultInventory: Object.freeze({
    totalGates: KnowledgeServicesCertificationGates.length,
    passed: passedCount,
    failed: failedCount,
    notApplicable: notApplicableCount,
    criticalFailures,
    highFailures,
    overallResult: KnowledgeServicesCertificationResult,
    allGatesPass: KnowledgeServicesCertificationAllGatesPass,
  }),
  nextPhase: "DKL-7:8 — Knowledge Services Freeze",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  mutationBehavior: false as const,
  freezeLocks: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic Certification inventory count from Certification-level fields. */
export function getKnowledgeServicesCertificationInventoryCount(): number {
  return KnowledgeServicesCertificationInventory.totalEntryCount;
}

/** Deterministic frozen Certification summary. */
export function getKnowledgeServicesCertificationSummary(): KnowledgeServicesCertificationSummary {
  return Object.freeze({
    certificationId: KnowledgeServicesCertificationId,
    version: KnowledgeServicesCertificationVersion,
    status: KnowledgeServicesCertificationStatus,
    result: KnowledgeServicesCertificationResult,
    readiness: KnowledgeServicesCertificationReadiness,
    architectureStatus: KnowledgeServicesCertificationArchitectureStatus,
    platformId: chain.platformId,
    manifestId: chain.manifestId,
    validationId: chain.validationId,
    modelId: chain.modelId,
    registryId: chain.registryId,
    foundationId: chain.foundationId,
    dkl6PublicIndexId: chain.dkl6PublicIndexId,
    completedPhaseCount: 7,
    futurePhaseCount: 2,
    certificationSectionCount: 18,
    gateGroupCount: KnowledgeServicesCertificationGateGroups.length,
    gateCount: KnowledgeServicesCertificationGates.length,
    evidenceCount: KnowledgeServicesCertificationEvidence.length,
    resultCount: KnowledgeServicesCertificationResults.length,
    passCount: passedCount,
    failCount: failedCount,
    notApplicableCount,
    findingCount: 0,
    compatibilityCount: KnowledgeServicesCertificationCompatibility.length,
    regressionCount: KnowledgeServicesCertificationRegressions.length,
    guaranteeCount: KnowledgeServicesCertificationGuarantees.length,
    publicApiCount: KnowledgeServicesCertificationPublicApis.length,
    platformSectionCount: 20,
    platformInventoryCount: 527,
    manifestInventoryCount: 447,
    modelInventoryCount: 79,
    validationPassCount: 48,
    serviceCount: 12,
    capabilityCount: 12,
    contractCount: 11,
    ownedResponsibilityCount: 6,
    nonOwnedResponsibilityCount: 24,
    prohibitedSurfaceCount: 29,
    mutationModeCount: 0,
    certificationInventoryCount:
      KnowledgeServicesCertificationInventory.totalEntryCount as 137,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
