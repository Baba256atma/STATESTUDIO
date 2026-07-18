/**
 * DKL-8:8 — Knowledge Governance Freeze.
 *
 * Canonical immutable Freeze surface for certified Knowledge Governance.
 * Consumes only KnowledgeGovernanceCertificationPlatform.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by DKL-8:8.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceFreezeId
 *   KnowledgeGovernanceFreezeVersion
 *   KnowledgeGovernanceFreezeName
 *   KnowledgeGovernanceFreezeNamespace
 *   KnowledgeGovernanceFreezeStatus
 *   KnowledgeGovernanceFreezeReadiness
 *   KnowledgeGovernanceFreezePlatform
 *   getKnowledgeGovernanceFreezeSummary()
 */

import { KnowledgeGovernanceCertificationPlatform } from "./knowledgeGovernanceCertification.ts";
import { KnowledgeGovernanceFreezeBaselines } from "./knowledgeGovernanceFreezeBaselines.ts";
import {
  KnowledgeGovernanceFreezeCompatibility,
  KnowledgeGovernanceFreezeGuarantees,
} from "./knowledgeGovernanceFreezeCompatibility.ts";
import { KnowledgeGovernanceFreezeExtensionLocks } from "./knowledgeGovernanceFreezeExtensions.ts";
import {
  KnowledgeGovernanceFreezeLockRecord,
  KnowledgeGovernanceFreezeProtectedCertificationExports,
  KnowledgeGovernanceFreezeProtectedFreezeExports,
} from "./knowledgeGovernanceFreezeLocks.ts";
import {
  KnowledgeGovernanceFreezeChainIds,
  KnowledgeGovernanceFreezeComponents,
  KnowledgeGovernanceFreezeUpstreamSurfaces,
} from "./knowledgeGovernanceFreezeRegistry.ts";
import type {
  KnowledgeGovernanceFreezeInventory,
  KnowledgeGovernanceFreezePublicApiDeclaration,
  KnowledgeGovernanceFreezeSummary,
} from "./knowledgeGovernanceFreezeTypes.ts";

export const KnowledgeGovernanceFreezeId =
  "DKL-8:8/KnowledgeGovernanceFreeze" as const;

export const KnowledgeGovernanceFreezeName =
  "Knowledge Governance Freeze" as const;

export const KnowledgeGovernanceFreezeVersion = "1.0.0" as const;

export const KnowledgeGovernanceFreezeNamespace =
  "nexora.dkl.knowledge-governance.freeze" as const;

export const KnowledgeGovernanceFreezeStatus = "Frozen" as const;

export const KnowledgeGovernanceFreezeReadiness =
  "ReadyForPublicIndex" as const;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "certification",
  "platform",
  "manifest",
  "validation",
  "model",
  "registry",
  "foundation",
  "components",
  "lock",
  "baselines",
  "compatibility",
  "extensionLocks",
  "ownership",
  "boundaries",
  "inventory",
  "apiRegistry",
  "guarantees",
  "runtimeProhibitions",
  "freezeResult",
  "readiness",
] as const);

/**
 * Counting rule for Freeze totalEntryCount:
 * frozenComponents + baselines + compatibility + extensionLocks +
 * guarantees + publicApis + platformTotalEntryCount(through Certification)
 */
const COUNTING_RULE =
  "frozenComponents + baselines + compatibility + extensionLocks + guarantees + publicApis + certification.inventory.platformTotalEntryCount";

const certification = KnowledgeGovernanceCertificationPlatform;
const upstream = KnowledgeGovernanceFreezeUpstreamSurfaces;

const api = (
  exportName: string,
  description: string,
  order: number,
): KnowledgeGovernanceFreezePublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-8:8/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

const apiRegistry: readonly KnowledgeGovernanceFreezePublicApiDeclaration[] =
  Object.freeze([
    api("KnowledgeGovernanceFreezeId", "Freeze identity constant.", 1),
    api("KnowledgeGovernanceFreezeVersion", "Freeze version constant.", 2),
    api("KnowledgeGovernanceFreezeName", "Freeze name constant.", 3),
    api("KnowledgeGovernanceFreezeNamespace", "Freeze namespace constant.", 4),
    api("KnowledgeGovernanceFreezeStatus", "Freeze status constant.", 5),
    api("KnowledgeGovernanceFreezeReadiness", "Freeze readiness constant.", 6),
    api("KnowledgeGovernanceFreezePlatform", "Canonical Freeze platform.", 7),
    api(
      "getKnowledgeGovernanceFreezeSummary",
      "Deterministic frozen Freeze summary helper.",
      8,
    ),
  ]);

const totalEntryCount =
  KnowledgeGovernanceFreezeComponents.length +
  KnowledgeGovernanceFreezeBaselines.length +
  KnowledgeGovernanceFreezeCompatibility.length +
  KnowledgeGovernanceFreezeExtensionLocks.length +
  KnowledgeGovernanceFreezeGuarantees.length +
  apiRegistry.length +
  certification.inventory.platformTotalEntryCount;

const inventory: KnowledgeGovernanceFreezeInventory = Object.freeze({
  inventoryId: "DKL-8:8/KnowledgeGovernanceFreezeInventory",
  upstreamCertificationInventory: Object.freeze({
    criterionCount: certification.inventory.criterionCount,
    gateCount: certification.inventory.gateCount,
    evidenceCount: certification.inventory.evidenceCount,
    categoryCount: certification.inventory.categoryCount,
    outcomeCount: certification.inventory.outcomeCount,
    manifestTotalEntryCount: certification.inventory.manifestTotalEntryCount,
    registryEntryCount: certification.inventory.registryEntryCount,
    modelKindCount: certification.inventory.modelKindCount,
    relationshipKindCount: certification.inventory.relationshipKindCount,
    validationRuleCount: certification.inventory.validationRuleCount,
    validationCategoryCount: certification.inventory.validationCategoryCount,
    validationGateCount: certification.inventory.validationGateCount,
    platformApiCount: certification.inventory.platformApiCount,
    platformGuaranteeCount: certification.inventory.platformGuaranteeCount,
    platformCompatibilityCount:
      certification.inventory.platformCompatibilityCount,
    platformTotalEntryCount: certification.inventory.platformTotalEntryCount,
    sourcedThroughPlatform: certification.inventory.sourcedThroughPlatform,
  }),
  frozenComponentCount: KnowledgeGovernanceFreezeComponents.length,
  baselineCount: KnowledgeGovernanceFreezeBaselines.length,
  compatibilityCount: KnowledgeGovernanceFreezeCompatibility.length,
  extensionLockCount: KnowledgeGovernanceFreezeExtensionLocks.length,
  guaranteeCount: KnowledgeGovernanceFreezeGuarantees.length,
  publicApiCount: apiRegistry.length,
  totalEntryCount,
  countingRule: COUNTING_RULE,
  sourcedThroughCertification: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const identity = Object.freeze({
  freezeId: KnowledgeGovernanceFreezeId,
  freezeName: KnowledgeGovernanceFreezeName,
  freezeVersion: KnowledgeGovernanceFreezeVersion,
  freezeNamespace: KnowledgeGovernanceFreezeNamespace,
  freezeLock: KnowledgeGovernanceFreezeLockRecord.id,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Freeze" as const,
  sourcePhase: "DKL-8:8" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceFreezeStatus,
  readiness: KnowledgeGovernanceFreezeReadiness,
  certificationId: certification.identity.certificationId,
  certificationVersion: certification.identity.certificationVersion,
  certificationOutcome: certification.certificationOutcome,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:8/Dependency/DKL87Certification",
  directPreviousPhaseModule: "knowledgeGovernanceCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: certification.identity.certificationId,
  certificationVersion: certification.identity.certificationVersion,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  futurePhaseDependency: false as const,
  circularDependency: false as const,
  reconstructsCertification: false as const,
  modifiesCertification: false as const,
  canonicalPath:
    "DKL-8:8 → DKL-8:7 Certification → DKL-8:6 Platform → DKL-8:5 Manifest → DKL-8:4 Validation → DKL-8:3 Model → DKL-8:2 Registry → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const runtimeProhibitions = Object.freeze({
  authentication: false as const,
  authorization: false as const,
  policyEnforcement: false as const,
  policyExecution: false as const,
  identityResolution: false as const,
  complianceExecution: false as const,
  legalInterpretation: false as const,
  auditLogging: false as const,
  repositoryReads: false as const,
  repositoryWrites: false as const,
  knowledgeRetrieval: false as const,
  knowledgeMutation: false as const,
  lifecycleExecution: false as const,
  exceptionWorkflows: false as const,
  retentionScheduling: false as const,
  dispositionExecution: false as const,
  notifications: false as const,
  tasks: false as const,
  queues: false as const,
  schedulers: false as const,
  http: false as const,
  webhooks: false as const,
  channelIntegrations: false as const,
  aiInference: false as const,
  llmCalls: false as const,
  engineReasoning: false as const,
  advisorResponses: false as const,
  directorComposition: false as const,
  sceneRendering: false as const,
  uiBehaviour: false as const,
  locked: true as const,
  metadataOnly: true as const,
});

const helpers = Object.freeze({
  getFrozenComponentById: (componentId: string) =>
    KnowledgeGovernanceFreezeComponents.find(
      (item) =>
        item.id === componentId ||
        item.name === componentId ||
        item.id.endsWith(`/${componentId}`),
    ),
  getFreezeBaselineById: (baselineId: string) =>
    KnowledgeGovernanceFreezeBaselines.find(
      (item) =>
        item.id === baselineId ||
        item.name === baselineId ||
        item.id.endsWith(`/${baselineId}`),
    ),
  getFreezeCompatibilityById: (compatibilityId: string) =>
    KnowledgeGovernanceFreezeCompatibility.find(
      (item) =>
        item.id === compatibilityId ||
        item.name === compatibilityId ||
        item.id.endsWith(`/${compatibilityId}`),
    ),
  getExtensionLockById: (lockId: string) =>
    KnowledgeGovernanceFreezeExtensionLocks.find(
      (item) =>
        item.id === lockId ||
        item.name === lockId ||
        item.id.endsWith(`/${lockId}`),
    ),
  getKnowledgeGovernanceFreezeEntryCount: () => totalEntryCount,
});

/**
 * Canonical immutable Knowledge Governance Freeze platform.
 */
export const KnowledgeGovernanceFreezePlatform = Object.freeze({
  identity,
  dependency,
  certification: upstream.certification,
  platform: upstream.platform,
  manifest: upstream.manifest,
  validation: upstream.validation,
  model: upstream.model,
  registry: upstream.registry,
  foundation: upstream.foundation,
  components: KnowledgeGovernanceFreezeComponents,
  lock: KnowledgeGovernanceFreezeLockRecord,
  baselines: KnowledgeGovernanceFreezeBaselines,
  compatibility: KnowledgeGovernanceFreezeCompatibility,
  extensionLocks: KnowledgeGovernanceFreezeExtensionLocks,
  ownership: upstream.ownership,
  boundaries: upstream.boundaries,
  inventory,
  apiRegistry,
  guarantees: KnowledgeGovernanceFreezeGuarantees,
  runtimeProhibitions,
  platformGuarantees: upstream.platformGuarantees,
  platformCompatibility: upstream.platformCompatibility,
  certificationCriteria: upstream.certificationCriteria,
  certificationGates: upstream.certificationGates,
  protectedCertificationExports:
    KnowledgeGovernanceFreezeProtectedCertificationExports,
  protectedFreezeExports: KnowledgeGovernanceFreezeProtectedFreezeExports,
  chainIds: KnowledgeGovernanceFreezeChainIds,
  helpers,
  freezeResult: Object.freeze({
    resultId: "DKL-8:8/Result/Canonical",
    status: KnowledgeGovernanceFreezeStatus,
    freezeLock: KnowledgeGovernanceFreezeLockRecord.id,
    locked: KnowledgeGovernanceFreezeLockRecord.locked,
    certificationOutcome: certification.certificationOutcome,
    frozenComponentCount: KnowledgeGovernanceFreezeComponents.length,
    baselineCount: KnowledgeGovernanceFreezeBaselines.length,
    compatibilityCount: KnowledgeGovernanceFreezeCompatibility.length,
    extensionLockCount: KnowledgeGovernanceFreezeExtensionLocks.length,
    readyForPublicIndex: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  readiness: KnowledgeGovernanceFreezeReadiness,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernanceFreezeStatus,
  nextPhase: "DKL-8:9 — Knowledge Governance Public Index",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  policyExecution: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  engineReasoning: false as const,
  advisorBehavior: false as const,
  directorBehavior: false as const,
  sceneBehavior: false as const,
  uiBehavior: false as const,
  persists: false as const,
  retrieves: false as const,
  reconstructs: false as const,
  enforcesGovernance: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Freeze summary. */
export function getKnowledgeGovernanceFreezeSummary(): KnowledgeGovernanceFreezeSummary {
  return Object.freeze({
    id: KnowledgeGovernanceFreezeId,
    version: KnowledgeGovernanceFreezeVersion,
    namespace: KnowledgeGovernanceFreezeNamespace,
    status: KnowledgeGovernanceFreezeStatus,
    freezeLock: KnowledgeGovernanceFreezeLockRecord.id,
    readiness: KnowledgeGovernanceFreezeReadiness,
    upstreamDependency: certification.identity.certificationId,
    certificationOutcome: certification.certificationOutcome,
    frozenComponentCount: KnowledgeGovernanceFreezeComponents.length,
    baselineCount: KnowledgeGovernanceFreezeBaselines.length,
    compatibilityCount: KnowledgeGovernanceFreezeCompatibility.length,
    extensionLockCount: KnowledgeGovernanceFreezeExtensionLocks.length,
    registryEntryCount: certification.inventory.registryEntryCount,
    modelKindCount: certification.inventory.modelKindCount,
    validationRuleCount: certification.inventory.validationRuleCount,
    platformTotalEntryCount: certification.inventory.platformTotalEntryCount,
    totalEntryCount,
    runtimeBehavior: "None",
    nextPhase: "DKL-8:9 — Knowledge Governance Public Index",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
