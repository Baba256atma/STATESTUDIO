/**
 * DKL-9:8 — Data Knowledge Suite Freeze.
 *
 * Canonical immutable Freeze surface for the certified Data Knowledge Suite.
 * Consumes only DataKnowledgeSuiteCertificationPlatform.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by DKL-9:8.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteFreezeId
 *   DataKnowledgeSuiteFreezeVersion
 *   DataKnowledgeSuiteFreezeName
 *   DataKnowledgeSuiteFreezeNamespace
 *   DataKnowledgeSuiteFreezeStatus
 *   DataKnowledgeSuiteFreezeReadiness
 *   DataKnowledgeSuiteFreezePlatform
 *   getDataKnowledgeSuiteFreezeSummary()
 */

import { DataKnowledgeSuiteCertificationPlatform } from "./dataKnowledgeSuiteCertification.ts";
import { DataKnowledgeSuiteFreezeBaselines } from "./dataKnowledgeSuiteFreezeBaselines.ts";
import {
  DataKnowledgeSuiteFreezeCompatibility,
  DataKnowledgeSuiteFreezeGuarantees,
} from "./dataKnowledgeSuiteFreezeCompatibility.ts";
import { DataKnowledgeSuiteFreezeExtensionLocks } from "./dataKnowledgeSuiteFreezeExtensions.ts";
import {
  DataKnowledgeSuiteFreezeLockRecord,
  DataKnowledgeSuiteFreezeProtectedCertificationExports,
  DataKnowledgeSuiteFreezeProtectedFreezeExports,
} from "./dataKnowledgeSuiteFreezeLocks.ts";
import {
  DataKnowledgeSuiteFreezeChainIds,
  DataKnowledgeSuiteFreezeComponents,
  DataKnowledgeSuiteFreezeUpstreamSurfaces,
} from "./dataKnowledgeSuiteFreezeRegistry.ts";
import type {
  DataKnowledgeSuiteFreezeInventory,
  DataKnowledgeSuiteFreezePublicApiDeclaration,
  DataKnowledgeSuiteFreezeSummary,
} from "./dataKnowledgeSuiteFreezeTypes.ts";

export const DataKnowledgeSuiteFreezeId =
  "DKL-9:8/DataKnowledgeSuiteFreeze" as const;

export const DataKnowledgeSuiteFreezeName =
  "Data Knowledge Suite Freeze" as const;

export const DataKnowledgeSuiteFreezeVersion = "1.0.0" as const;

export const DataKnowledgeSuiteFreezeNamespace =
  "nexora.dkl.data-knowledge-suite.freeze" as const;

export const DataKnowledgeSuiteFreezeStatus = "Frozen" as const;

export const DataKnowledgeSuiteFreezeReadiness =
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
  "guarantees",
  "readiness",
] as const);

/**
 * Counting rule for Freeze totalEntryCount:
 * frozenComponents + baselines + compatibility + extensionLocks +
 * guarantees + publicApis + platformTotalEntryCount(through Certification)
 */
const COUNTING_RULE =
  "frozenComponents + baselines + compatibility + extensionLocks + guarantees + publicApis + certification.inventory.platformTotalEntryCount";

const certification = DataKnowledgeSuiteCertificationPlatform;
const upstream = DataKnowledgeSuiteFreezeUpstreamSurfaces;

const api = (
  exportName: string,
  description: string,
  order: number,
): DataKnowledgeSuiteFreezePublicApiDeclaration =>
  Object.freeze({
    apiId: `DKL-9:8/PublicApi/${exportName}`,
    exportName,
    description,
    runtimeService: false as const,
    mutableCollection: false as const,
    deterministicOrder: order,
  });

const apiRegistry: readonly DataKnowledgeSuiteFreezePublicApiDeclaration[] =
  Object.freeze([
    api("DataKnowledgeSuiteFreezeId", "Freeze identity constant.", 1),
    api("DataKnowledgeSuiteFreezeVersion", "Freeze version constant.", 2),
    api("DataKnowledgeSuiteFreezeName", "Freeze name constant.", 3),
    api("DataKnowledgeSuiteFreezeNamespace", "Freeze namespace constant.", 4),
    api("DataKnowledgeSuiteFreezeStatus", "Freeze status constant.", 5),
    api("DataKnowledgeSuiteFreezeReadiness", "Freeze readiness constant.", 6),
    api("DataKnowledgeSuiteFreezePlatform", "Canonical Freeze platform.", 7),
    api(
      "getDataKnowledgeSuiteFreezeSummary",
      "Deterministic frozen Freeze summary helper.",
      8,
    ),
  ]);

const totalEntryCount =
  DataKnowledgeSuiteFreezeComponents.length +
  DataKnowledgeSuiteFreezeBaselines.length +
  DataKnowledgeSuiteFreezeCompatibility.length +
  DataKnowledgeSuiteFreezeExtensionLocks.length +
  DataKnowledgeSuiteFreezeGuarantees.length +
  apiRegistry.length +
  certification.inventory.platformTotalEntryCount;

const inventory: DataKnowledgeSuiteFreezeInventory = Object.freeze({
  inventoryId: "DKL-9:8/DataKnowledgeSuiteFreezeInventory",
  upstreamCertificationInventory: Object.freeze({
    criterionCount: certification.inventory.criterionCount,
    gateCount: certification.inventory.gateCount,
    evidenceCount: certification.inventory.evidenceCount,
    categoryCount: certification.inventory.categoryCount,
    outcomeCount: certification.inventory.outcomeCount,
    capabilityCount: certification.inventory.capabilityCount,
    publicApiInventoryTotal: certification.inventory.publicApiInventoryTotal,
    manifestTotalEntryCount: certification.inventory.manifestTotalEntryCount,
    validationRuleCount: certification.inventory.validationRuleCount,
    validationGateCount: certification.inventory.validationGateCount,
    validationCategoryCount: certification.inventory.validationCategoryCount,
    modelKindCount: certification.inventory.modelKindCount,
    registryTotalEntryCount: certification.inventory.registryTotalEntryCount,
    platformApiCount: certification.inventory.platformApiCount,
    platformGuaranteeCount: certification.inventory.platformGuaranteeCount,
    platformCompatibilityCount:
      certification.inventory.platformCompatibilityCount,
    platformTotalEntryCount: certification.inventory.platformTotalEntryCount,
    sourcedThroughPlatform: certification.inventory.sourcedThroughPlatform,
    reconstructed: certification.inventory.reconstructed,
    hardcoded: certification.inventory.hardcoded,
    duplicated: certification.inventory.duplicated,
  }),
  frozenComponentCount: DataKnowledgeSuiteFreezeComponents.length,
  baselineCount: DataKnowledgeSuiteFreezeBaselines.length,
  compatibilityCount: DataKnowledgeSuiteFreezeCompatibility.length,
  extensionLockCount: DataKnowledgeSuiteFreezeExtensionLocks.length,
  guaranteeCount: DataKnowledgeSuiteFreezeGuarantees.length,
  publicApiCount: apiRegistry.length,
  totalEntryCount,
  countingRule: COUNTING_RULE,
  sourcedThroughCertification: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  duplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const identity = Object.freeze({
  freezeId: DataKnowledgeSuiteFreezeId,
  freezeName: DataKnowledgeSuiteFreezeName,
  freezeVersion: DataKnowledgeSuiteFreezeVersion,
  freezeNamespace: DataKnowledgeSuiteFreezeNamespace,
  freezeLock: DataKnowledgeSuiteFreezeLockRecord.id,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Freeze" as const,
  sourcePhase: "DKL-9:8" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteFreezeStatus,
  readiness: DataKnowledgeSuiteFreezeReadiness,
  certificationId: certification.identity.certificationId,
  certificationVersion: certification.identity.certificationVersion,
  certificationOutcome: certification.certificationOutcome,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:8/Dependency/DKL97Certification",
  directPreviousPhaseModule: "dataKnowledgeSuiteCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: certification.identity.certificationId,
  certificationVersion: certification.identity.certificationVersion,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  dkl1DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl8DirectImport: false as const,
  futurePhaseDependency: false as const,
  circularDependency: false as const,
  reconstructsCertification: false as const,
  modifiesCertification: false as const,
  modifiesPlatform: false as const,
  recertifies: false as const,
  canonicalPath:
    "DKL-9:8 → DKL-9:7 Certification → DKL-9:6 Platform → DKL-9:5 Manifest → DKL-9:4 Validation → DKL-9:3 Model → DKL-9:2 Registry → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const runtimeProhibitions = Object.freeze({
  authentication: false as const,
  authorization: false as const,
  policyEnforcement: false as const,
  policyExecution: false as const,
  identityResolution: false as const,
  repositoryReads: false as const,
  repositoryWrites: false as const,
  knowledgeRetrieval: false as const,
  knowledgeMutation: false as const,
  suiteExecution: false as const,
  recertification: false as const,
  inventoryReconstruction: false as const,
  notifications: false as const,
  tasks: false as const,
  queues: false as const,
  schedulers: false as const,
  http: false as const,
  webhooks: false as const,
  aiInference: false as const,
  llmCalls: false as const,
  engineReasoning: false as const,
  advisorResponses: false as const,
  sceneRendering: false as const,
  uiBehaviour: false as const,
  locked: true as const,
  metadataOnly: true as const,
});

const helpers = Object.freeze({
  getFrozenComponentById: (componentId: string) =>
    DataKnowledgeSuiteFreezeComponents.find(
      (item) =>
        item.id === componentId ||
        item.name === componentId ||
        item.id.endsWith(`/${componentId}`),
    ),
  getFreezeBaselineById: (baselineId: string) =>
    DataKnowledgeSuiteFreezeBaselines.find(
      (item) =>
        item.id === baselineId ||
        item.name === baselineId ||
        item.id.endsWith(`/${baselineId}`),
    ),
  getFreezeCompatibilityById: (compatibilityId: string) =>
    DataKnowledgeSuiteFreezeCompatibility.find(
      (item) =>
        item.id === compatibilityId ||
        item.name === compatibilityId ||
        item.id.endsWith(`/${compatibilityId}`),
    ),
  getExtensionLockById: (lockId: string) =>
    DataKnowledgeSuiteFreezeExtensionLocks.find(
      (item) =>
        item.id === lockId ||
        item.name === lockId ||
        item.id.endsWith(`/${lockId}`),
    ),
  getDataKnowledgeSuiteFreezeEntryCount: () => totalEntryCount,
});

/**
 * Canonical immutable Data Knowledge Suite Freeze platform.
 */
export const DataKnowledgeSuiteFreezePlatform = Object.freeze({
  identity,
  dependency,
  certification: upstream.certification,
  platform: upstream.platform,
  manifest: upstream.manifest,
  validation: upstream.validation,
  model: upstream.model,
  registry: upstream.registry,
  foundation: upstream.foundation,
  components: DataKnowledgeSuiteFreezeComponents,
  lock: DataKnowledgeSuiteFreezeLockRecord,
  baselines: DataKnowledgeSuiteFreezeBaselines,
  compatibility: DataKnowledgeSuiteFreezeCompatibility,
  extensionLocks: DataKnowledgeSuiteFreezeExtensionLocks,
  ownership: upstream.ownership,
  boundaries: upstream.boundaries,
  capabilityCatalog: upstream.capabilityCatalog,
  inventory,
  apiRegistry,
  guarantees: DataKnowledgeSuiteFreezeGuarantees,
  runtimeProhibitions,
  platformGuarantees: upstream.platformGuarantees,
  platformCompatibility: upstream.platformCompatibility,
  certificationCriteria: upstream.certificationCriteria,
  certificationGates: upstream.certificationGates,
  protectedCertificationExports:
    DataKnowledgeSuiteFreezeProtectedCertificationExports,
  protectedFreezeExports: DataKnowledgeSuiteFreezeProtectedFreezeExports,
  chainIds: DataKnowledgeSuiteFreezeChainIds,
  helpers,
  freezeResult: Object.freeze({
    resultId: "DKL-9:8/Result/Canonical",
    status: DataKnowledgeSuiteFreezeStatus,
    freezeLock: DataKnowledgeSuiteFreezeLockRecord.id,
    locked: DataKnowledgeSuiteFreezeLockRecord.locked,
    certificationOutcome: certification.certificationOutcome,
    frozenComponentCount: DataKnowledgeSuiteFreezeComponents.length,
    baselineCount: DataKnowledgeSuiteFreezeBaselines.length,
    compatibilityCount: DataKnowledgeSuiteFreezeCompatibility.length,
    extensionLockCount: DataKnowledgeSuiteFreezeExtensionLocks.length,
    guaranteeCount: DataKnowledgeSuiteFreezeGuarantees.length,
    readyForPublicIndex: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  readiness: DataKnowledgeSuiteFreezeReadiness,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: DataKnowledgeSuiteFreezeStatus,
  nextPhase: "DKL-9:9 — Data Knowledge Suite Public Index",
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
  recertifies: false as const,
  modifiesPlatform: false as const,
  modifiesCertification: false as const,
  executesSuiteLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Freeze summary. */
export function getDataKnowledgeSuiteFreezeSummary(): DataKnowledgeSuiteFreezeSummary {
  return Object.freeze({
    id: DataKnowledgeSuiteFreezeId,
    version: DataKnowledgeSuiteFreezeVersion,
    namespace: DataKnowledgeSuiteFreezeNamespace,
    status: DataKnowledgeSuiteFreezeStatus,
    freezeLock: DataKnowledgeSuiteFreezeLockRecord.id,
    readiness: DataKnowledgeSuiteFreezeReadiness,
    upstreamDependency: certification.identity.certificationId,
    certificationOutcome: certification.certificationOutcome,
    frozenComponentCount: DataKnowledgeSuiteFreezeComponents.length,
    baselineCount: DataKnowledgeSuiteFreezeBaselines.length,
    compatibilityCount: DataKnowledgeSuiteFreezeCompatibility.length,
    extensionLockCount: DataKnowledgeSuiteFreezeExtensionLocks.length,
    capabilityCount: certification.inventory.capabilityCount,
    publicApiInventoryTotal: certification.inventory.publicApiInventoryTotal,
    validationRuleCount: certification.inventory.validationRuleCount,
    platformTotalEntryCount: certification.inventory.platformTotalEntryCount,
    totalEntryCount,
    runtimeBehavior: "None",
    nextPhase: "DKL-9:9 — Data Knowledge Suite Public Index",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
