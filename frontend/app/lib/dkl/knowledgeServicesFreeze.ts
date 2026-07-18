/**
 * DKL-7:8 — Knowledge Services Freeze.
 *
 * Canonical immutable freeze architecture for certified Knowledge Services.
 * Consumes only the DKL-7:7 Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by DKL-7:8.
 *
 * Public exports (exactly 12):
 *   KnowledgeServicesFreeze
 *   KnowledgeServicesFreezeId
 *   KnowledgeServicesFreezeName
 *   KnowledgeServicesFreezeVersion
 *   KnowledgeServicesFreezeNamespace
 *   KnowledgeServicesFreezeStatus
 *   KnowledgeServicesFreezeLock
 *   KnowledgeServicesFreezeReadiness
 *   KnowledgeServicesFreezeRegistry
 *   KnowledgeServicesFreezeGuarantees
 *   getKnowledgeServicesFreezeSummary()
 *   getKnowledgeServicesFreezeInventoryCount()
 */

import {
  getKnowledgeServicesCertificationInventoryCount,
  KnowledgeServicesCertification,
  KnowledgeServicesCertificationId,
  KnowledgeServicesCertificationResult,
  KnowledgeServicesCertificationStatus,
  KnowledgeServicesCertificationVersion,
} from "./knowledgeServicesCertification.ts";
import {
  KnowledgeServicesFreezeBaselineMatches,
  KnowledgeServicesFreezeBaselines,
} from "./knowledgeServicesFreezeBaselines.ts";
import { KnowledgeServicesFreezeCompatibility } from "./knowledgeServicesFreezeCompatibility.ts";
import {
  KnowledgeServicesFreezeExtensions,
  KnowledgeServicesFreezePublicIndexPreparation,
} from "./knowledgeServicesFreezeExtensions.ts";
import {
  KnowledgeServicesFreezeAllLocksActive,
  KnowledgeServicesFreezeLocks,
} from "./knowledgeServicesFreezeLocks.ts";
import {
  KnowledgeServicesFreezeChainIds,
  KnowledgeServicesFreezeComponents,
  KnowledgeServicesFreezeRegistry,
} from "./knowledgeServicesFreezeRegistry.ts";
import type {
  KnowledgeServicesFreezeDependencyDeclaration,
  KnowledgeServicesFreezeGuarantee,
  KnowledgeServicesFreezeIdentity,
  KnowledgeServicesFreezeInventory as FreezeInventoryRecord,
  KnowledgeServicesFreezeMetadata,
  KnowledgeServicesFreezePublicApiDeclaration,
  KnowledgeServicesFreezeSummary,
} from "./knowledgeServicesFreezeTypes.ts";

export const KnowledgeServicesFreezeId =
  "DKL-7:8/KnowledgeServicesFreeze" as const;

export const KnowledgeServicesFreezeName = "Knowledge Services Freeze" as const;

export const KnowledgeServicesFreezeVersion = "1.0.0" as const;

export const KnowledgeServicesFreezeNamespace =
  "nexora.dkl.knowledge-services.freeze" as const;

export const KnowledgeServicesFreezeStatus = "Frozen" as const;

export const KnowledgeServicesFreezeLock =
  "DKL-7-KNOWLEDGE-SERVICES-LOCKED" as const;

export const KnowledgeServicesFreezeReadiness =
  "ReadyForPublicIndex" as const;

export { KnowledgeServicesFreezeRegistry };

const KnowledgeServicesFreezeArchitectureStatus =
  "StableAndFrozen" as const;

const certification = KnowledgeServicesCertification;
const platform = certification.platform;
const chain = KnowledgeServicesFreezeChainIds;

const dependency = (
  key: string,
  source: string,
  target: string,
  direction: string,
  dependencyType: string,
  canonicalPath: string,
  required: boolean,
  lockReference: string,
  ownershipRule: string,
  boundaryRule: string,
  order: number,
): KnowledgeServicesFreezeDependencyDeclaration =>
  Object.freeze({
    dependencyId: `DKL-7:8/Dependency/${key}`,
    source,
    target,
    direction,
    dependencyType,
    status: "Declared" as const,
    canonicalPath,
    required,
    lockReference,
    ownershipRule,
    boundaryRule,
    runtimeAuthorization: "None" as const,
    introducesFutureImport: false as const,
    deterministicOrder: order,
  });

const KnowledgeServicesFreezeDependencies: readonly KnowledgeServicesFreezeDependencyDeclaration[] =
  Object.freeze([
    dependency(
      "FreezeToCertification",
      KnowledgeServicesFreezeId,
      KnowledgeServicesCertificationId,
      "Consumes",
      "CanonicalChain",
      "Freeze → Certification",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Freeze owns freeze metadata only",
      "No lower-phase direct import",
      1,
    ),
    dependency(
      "CertificationToPlatform",
      KnowledgeServicesCertificationId,
      chain.platformId,
      "Consumes",
      "CanonicalChain",
      "Certification → Platform",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Certification preserves Platform by reference",
      "No Manifest bypass",
      2,
    ),
    dependency(
      "PlatformToManifest",
      chain.platformId,
      chain.manifestId,
      "Consumes",
      "CanonicalChain",
      "Platform → Manifest",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Platform preserves Manifest by reference",
      "No Validation bypass",
      3,
    ),
    dependency(
      "ManifestToValidation",
      chain.manifestId,
      chain.validationId,
      "Consumes",
      "CanonicalChain",
      "Manifest → Validation",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Manifest preserves Validation by reference",
      "No Model bypass",
      4,
    ),
    dependency(
      "ValidationToModel",
      chain.validationId,
      chain.modelId,
      "Consumes",
      "CanonicalChain",
      "Validation → Model",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Validation preserves Model by reference",
      "No Registry bypass",
      5,
    ),
    dependency(
      "ModelToRegistry",
      chain.modelId,
      chain.registryId,
      "Consumes",
      "CanonicalChain",
      "Model → Registry",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Model preserves Registry by reference",
      "No Foundation bypass",
      6,
    ),
    dependency(
      "RegistryToFoundation",
      chain.registryId,
      chain.foundationId,
      "Consumes",
      "CanonicalChain",
      "Registry → Foundation",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Registry preserves Foundation by reference",
      "No DKL-6 bypass",
      7,
    ),
    dependency(
      "FoundationToDKL6",
      chain.foundationId,
      chain.dkl6PublicIndexId,
      "Consumes",
      "CanonicalChain",
      "Foundation → DKL-6 Public Index",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Foundation depends on DKL-6 Public Index",
      "No DKL-6 reconstruction",
      8,
    ),
    dependency(
      "PublicIndexToFreeze",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      KnowledgeServicesFreezeId,
      "Consumes",
      "FuturePhase",
      "Public Index → Freeze",
      true,
      "LOCK-KS-DEPENDENCY-CHAIN",
      "Public Index consumes Freeze only",
      "No Certification bypass",
      9,
    ),
    dependency(
      "ExecutiveEngineToPublicIndex",
      "Executive Engine consumer",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "Consumes",
      "FutureConsumer",
      "Executive Engine → Public Index",
      true,
      "LOCK-KS-COMPATIBILITY",
      "Engine does not own Knowledge Services",
      "No direct Freeze import",
      10,
    ),
    dependency(
      "AdvisorToPublicIndex",
      "Advisor consumer",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "Consumes",
      "FutureConsumer",
      "Advisor → Public Index",
      true,
      "LOCK-KS-COMPATIBILITY",
      "Advisor does not own Knowledge Services",
      "No direct Freeze import",
      11,
    ),
    dependency(
      "ApprovedInternalToPublicIndex",
      "Approved internal consumer",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "Consumes",
      "FutureConsumer",
      "Approved internal consumer → Public Index",
      true,
      "LOCK-KS-COMPATIBILITY",
      "Internal consumers use Public Index only",
      "Runtime authorization None",
      12,
    ),
  ]);

const guarantee = (
  order: number,
  statement: string,
): KnowledgeServicesFreezeGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-7:8/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

export const KnowledgeServicesFreezeGuarantees: readonly KnowledgeServicesFreezeGuarantee[] =
  Object.freeze([
    guarantee(1, "Freeze consumes only Certification directly."),
    guarantee(2, "Platform is reached only through Certification."),
    guarantee(3, "Manifest is reached only through Platform."),
    guarantee(4, "Validation is reached only through Manifest."),
    guarantee(5, "Model is reached only through Validation."),
    guarantee(6, "Registry is reached only through Model."),
    guarantee(7, "Foundation is reached only through Registry."),
    guarantee(8, "DKL-6 is reached only through Foundation."),
    guarantee(9, "All prior phases remain preserved by canonical reference."),
    guarantee(10, "All 8 certified components are frozen."),
    guarantee(11, "All 18 certified baselines match."),
    guarantee(12, "All 12 architectural locks are active."),
    guarantee(13, "All 18 compatibility declarations are compatible."),
    guarantee(14, "All 8 extension policies preserve backward compatibility."),
    guarantee(15, "All 12 services remain protected."),
    guarantee(16, "All 12 capabilities remain protected."),
    guarantee(17, "All 11 contracts remain protected."),
    guarantee(18, "Model inventory remains 79."),
    guarantee(19, "Validation remains 48 Pass and 0 Fail."),
    guarantee(20, "Manifest inventory remains 447."),
    guarantee(21, "Platform inventory remains 527."),
    guarantee(22, "Certification inventory remains 137."),
    guarantee(
      23,
      "Mutation modes remain zero and runtime behavior remains absent.",
    ),
    guarantee(24, "Freeze is ready for Public Index."),
  ]);

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeServicesFreezePublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-7:8/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    runtimeLock: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

const KnowledgeServicesFreezePublicApis: readonly KnowledgeServicesFreezePublicApiDeclaration[] =
  Object.freeze([
    api("KnowledgeServicesFreeze", "Canonical Freeze aggregate.", 1),
    api("KnowledgeServicesFreezeId", "Freeze identity constant.", 2),
    api("KnowledgeServicesFreezeName", "Freeze name constant.", 3),
    api("KnowledgeServicesFreezeVersion", "Freeze version constant.", 4),
    api("KnowledgeServicesFreezeNamespace", "Freeze namespace constant.", 5),
    api("KnowledgeServicesFreezeStatus", "Freeze status constant.", 6),
    api("KnowledgeServicesFreezeLock", "Freeze lock identifier constant.", 7),
    api("KnowledgeServicesFreezeReadiness", "Freeze readiness constant.", 8),
    api("KnowledgeServicesFreezeRegistry", "Frozen component registry.", 9),
    api("KnowledgeServicesFreezeGuarantees", "Twenty-four Freeze guarantees.", 10),
    api(
      "getKnowledgeServicesFreezeSummary",
      "Deterministic frozen Freeze summary helper.",
      11,
    ),
    api(
      "getKnowledgeServicesFreezeInventoryCount",
      "Deterministic Freeze inventory count helper.",
      12,
    ),
  ]);

/**
 * Counting rule for getKnowledgeServicesFreezeInventoryCount():
 * completedPhases + futurePhases + frozenComponents + baselines + locks +
 * dependencies + compatibility + extensions + guarantees + publicApis
 *
 * Documented addends: 8+1+8+18+12+12+18+8+24+12 = 121
 */
const COUNTING_RULE = "8+1+8+18+12+12+18+8+24+12";

const totalEntryCount =
  8 +
  1 +
  KnowledgeServicesFreezeComponents.length +
  KnowledgeServicesFreezeBaselines.length +
  KnowledgeServicesFreezeLocks.length +
  KnowledgeServicesFreezeDependencies.length +
  KnowledgeServicesFreezeCompatibility.length +
  KnowledgeServicesFreezeExtensions.length +
  KnowledgeServicesFreezeGuarantees.length +
  KnowledgeServicesFreezePublicApis.length;

const KnowledgeServicesFreezeInventory: FreezeInventoryRecord = Object.freeze({
  inventoryId: "DKL-7:8/KnowledgeServicesFreezeInventory",
  completedPhaseCount: 8 as const,
  futurePhaseCount: 1 as const,
  totalPhaseCount: 9 as const,
  sectionCount: 18 as const,
  frozenComponentCount: 8 as const,
  certifiedComponentCount: 8 as const,
  protectedComponentCount: 8 as const,
  baselineCount: 18 as const,
  matchedBaselineCount: 18 as const,
  lockCount: 12 as const,
  activeLockCount: 12 as const,
  dependencyCount: 12 as const,
  compatibilityCount: 18 as const,
  extensionPolicyCount: 8 as const,
  guaranteeCount: 24 as const,
  publicApiCount: 12 as const,
  certificationGateGroupCount: 12 as const,
  certificationGateCount: 18 as const,
  certificationEvidenceCount: 18 as const,
  certificationResultCount: 18 as const,
  certificationPassedCount: 18 as const,
  certificationFailedCount: 0 as const,
  certificationCompatibilityCount: 16 as const,
  certificationRegressionCount: 12 as const,
  certificationGuaranteeCount: 22 as const,
  certificationInventoryCount:
    getKnowledgeServicesCertificationInventoryCount() as 137,
  serviceCount: 12 as const,
  capabilityCount: 12 as const,
  contractCount: 11 as const,
  modelInventoryCount: 79 as const,
  validationPassCount: 48 as const,
  manifestInventoryCount: 447 as const,
  platformInventoryCount: 527 as const,
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

const identity: KnowledgeServicesFreezeIdentity = Object.freeze({
  freezeId: KnowledgeServicesFreezeId,
  freezeName: KnowledgeServicesFreezeName,
  freezeVersion: KnowledgeServicesFreezeVersion,
  freezeNamespace: KnowledgeServicesFreezeNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Freeze",
  sourcePhase: "DKL-7:8",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesFreezeStatus,
  certificationStatus: KnowledgeServicesCertificationStatus,
  certificationResult: KnowledgeServicesCertificationResult,
  architectureStatus: KnowledgeServicesFreezeArchitectureStatus,
  freezeLock: KnowledgeServicesFreezeLock,
  readiness: KnowledgeServicesFreezeReadiness,
  certificationId: KnowledgeServicesCertificationId,
  certificationVersion: KnowledgeServicesCertificationVersion,
  platformId: chain.platformId,
  manifestId: chain.manifestId,
  validationId: chain.validationId,
  modelId: chain.modelId,
  registryId: chain.registryId,
  foundationId: chain.foundationId,
  dkl6PublicIndexId: chain.dkl6PublicIndexId,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesFreezeMetadata = Object.freeze({
  metadataId: "DKL-7:8/KnowledgeServicesFreezeMetadata",
  freezeId: KnowledgeServicesFreezeId,
  description:
    "Canonical immutable freeze of certified Knowledge Services through DKL-7:7 Certification.",
  metadataOnly: true,
  declarationOnly: true,
  runtimeBehavior: false,
  runtimeLocking: false,
  transportNeutral: true,
  persistenceNeutral: true,
  immutable: true,
  deterministic: true,
});

const dependencyDeclarations = Object.freeze({
  directPreviousPhaseModule: "knowledgeServicesCertification.ts" as const,
  certificationOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl6DirectImport: false as const,
  platformReachedThroughCertification: true as const,
  manifestReachedThroughPlatform: true as const,
  validationReachedThroughManifest: true as const,
  modelReachedThroughValidation: true as const,
  registryReachedThroughModel: true as const,
  foundationReachedThroughRegistry: true as const,
  dkl6ReachedThroughFoundation: true as const,
});

/** Canonical immutable Knowledge Services Freeze aggregate. */
export const KnowledgeServicesFreeze = Object.freeze({
  identity,
  metadata,
  certification: KnowledgeServicesCertification,
  architecture: Object.freeze({
    status: KnowledgeServicesFreezeArchitectureStatus,
    completedPhaseCount: 8 as const,
    futurePhaseCount: 1 as const,
    totalPhaseCount: 9 as const,
    components: KnowledgeServicesFreezeComponents,
  }),
  registry: KnowledgeServicesFreezeRegistry,
  components: KnowledgeServicesFreezeComponents,
  baselines: KnowledgeServicesFreezeBaselines,
  locks: KnowledgeServicesFreezeLocks,
  dependencies: KnowledgeServicesFreezeDependencies,
  ownership: platform.ownership,
  boundaries: platform.boundaries,
  compatibility: KnowledgeServicesFreezeCompatibility,
  extensions: KnowledgeServicesFreezeExtensions,
  publicIndexPreparation: KnowledgeServicesFreezePublicIndexPreparation,
  inventory: KnowledgeServicesFreezeInventory,
  guarantees: KnowledgeServicesFreezeGuarantees,
  status: KnowledgeServicesFreezeStatus,
  readiness: KnowledgeServicesFreezeReadiness,
  publicApi: KnowledgeServicesFreezePublicApis,
  freezeLock: KnowledgeServicesFreezeLock,
  dependencyDeclarations,
  architectureStatus: KnowledgeServicesFreezeArchitectureStatus,
  certificationStatus: KnowledgeServicesCertificationStatus,
  certificationResult: KnowledgeServicesCertificationResult,
  baselineMatches: KnowledgeServicesFreezeBaselineMatches,
  allLocksActive: KnowledgeServicesFreezeAllLocksActive,
  nextPhase: "DKL-7:9 — Knowledge Services Public Index",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeLocking: false as const,
  serviceExecution: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  mutationBehavior: false as const,
  publicIndexImplemented: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic Freeze inventory count from Freeze-level fields. */
export function getKnowledgeServicesFreezeInventoryCount(): number {
  return KnowledgeServicesFreezeInventory.totalEntryCount;
}

/** Deterministic frozen Freeze summary. */
export function getKnowledgeServicesFreezeSummary(): KnowledgeServicesFreezeSummary {
  return Object.freeze({
    freezeId: KnowledgeServicesFreezeId,
    version: KnowledgeServicesFreezeVersion,
    status: KnowledgeServicesFreezeStatus,
    lock: KnowledgeServicesFreezeLock,
    architectureStatus: KnowledgeServicesFreezeArchitectureStatus,
    readiness: KnowledgeServicesFreezeReadiness,
    certificationId: KnowledgeServicesCertificationId,
    platformId: chain.platformId,
    manifestId: chain.manifestId,
    validationId: chain.validationId,
    modelId: chain.modelId,
    registryId: chain.registryId,
    foundationId: chain.foundationId,
    dkl6PublicIndexId: chain.dkl6PublicIndexId,
    completedPhaseCount: 8,
    futurePhaseCount: 1,
    sectionCount: 18,
    frozenComponentCount: KnowledgeServicesFreezeComponents.length,
    certifiedComponentCount: KnowledgeServicesFreezeComponents.length,
    protectedComponentCount: KnowledgeServicesFreezeComponents.length,
    baselineCount: KnowledgeServicesFreezeBaselines.length,
    matchedBaselineCount: KnowledgeServicesFreezeBaselines.filter(
      (item) => item.status === "FrozenAndMatched",
    ).length,
    lockCount: KnowledgeServicesFreezeLocks.length,
    activeLockCount: KnowledgeServicesFreezeLocks.filter(
      (item) => item.lockStatus === "Locked",
    ).length,
    dependencyCount: KnowledgeServicesFreezeDependencies.length,
    compatibilityCount: KnowledgeServicesFreezeCompatibility.length,
    extensionPolicyCount: KnowledgeServicesFreezeExtensions.length,
    guaranteeCount: KnowledgeServicesFreezeGuarantees.length,
    publicApiCount: KnowledgeServicesFreezePublicApis.length,
    serviceCount: platform.services.length,
    capabilityCount: platform.capabilities.length,
    contractCount: platform.contracts.length,
    modelInventoryCount: platform.model.totalInventoryCount,
    validationPassCount: platform.validation.passCount,
    manifestInventoryCount: 447,
    platformInventoryCount: 527,
    certificationInventoryCount: 137,
    ownedResponsibilityCount: platform.ownership.ownedCount,
    nonOwnedResponsibilityCount: platform.ownership.nonOwnedCount,
    prohibitedSurfaceCount: platform.boundaries.prohibitedSurfaceCount,
    mutationModeCount: platform.inventory.mutationModeCount,
    runtimeBehaviorStatus: "Absent",
    freezeInventoryCount: KnowledgeServicesFreezeInventory.totalEntryCount as 121,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
