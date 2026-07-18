/**
 * DKL-9:7 — Data Knowledge Suite Certification.
 *
 * Canonical immutable Certification surface for the Data Knowledge Suite through
 * DKL-9:6 Platform. Consumes only DataKnowledgeSuitePlatform.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by DKL-9:7.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteCertificationId
 *   DataKnowledgeSuiteCertificationVersion
 *   DataKnowledgeSuiteCertificationName
 *   DataKnowledgeSuiteCertificationNamespace
 *   DataKnowledgeSuiteCertificationStatus
 *   DataKnowledgeSuiteCertificationReadiness
 *   DataKnowledgeSuiteCertificationPlatform
 *   getDataKnowledgeSuiteCertificationSummary()
 */

import { DataKnowledgeSuitePlatform } from "./dataKnowledgeSuitePlatform.ts";
import {
  DataKnowledgeSuiteCertificationCompatibility,
  DataKnowledgeSuiteCertificationGuarantees,
} from "./dataKnowledgeSuiteCertificationCompatibility.ts";
import {
  DataKnowledgeSuiteCertificationAllCriteriaPass,
  DataKnowledgeSuiteCertificationCategories,
  DataKnowledgeSuiteCertificationCriteria,
  DataKnowledgeSuiteCertificationCriterionCount,
  DataKnowledgeSuiteCertificationOutcomes,
} from "./dataKnowledgeSuiteCertificationCriteria.ts";
import { DataKnowledgeSuiteCertificationEvidence } from "./dataKnowledgeSuiteCertificationEvidence.ts";
import {
  DataKnowledgeSuiteCertificationAllGatesPass,
  DataKnowledgeSuiteCertificationFreezeReadinessGate,
  DataKnowledgeSuiteCertificationGateCount,
  DataKnowledgeSuiteCertificationGates,
} from "./dataKnowledgeSuiteCertificationGates.ts";
import { DataKnowledgeSuiteCertificationReportRecord } from "./dataKnowledgeSuiteCertificationReport.ts";
import type { DataKnowledgeSuiteCertificationSummary } from "./dataKnowledgeSuiteCertificationTypes.ts";

export const DataKnowledgeSuiteCertificationId =
  "DKL-9:7/DataKnowledgeSuiteCertification" as const;

export const DataKnowledgeSuiteCertificationName =
  "Data Knowledge Suite Certification" as const;

export const DataKnowledgeSuiteCertificationVersion = "1.0.0" as const;

export const DataKnowledgeSuiteCertificationNamespace =
  "nexora.dkl.data-knowledge-suite.certification" as const;

export const DataKnowledgeSuiteCertificationStatus = "Certified" as const;

export const DataKnowledgeSuiteCertificationReadiness =
  "ReadyForFreeze" as const;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "platform",
  "manifest",
  "validation",
  "model",
  "registry",
  "foundation",
  "categories",
  "outcomes",
  "criteria",
  "criteriaByCategory",
  "gates",
  "report",
  "inventory",
  "ownership",
  "boundaries",
  "compatibility",
  "guarantees",
  "certificationResult",
  "readiness",
] as const);

const platform = DataKnowledgeSuitePlatform;

const certificationOutcome =
  DataKnowledgeSuiteCertificationAllCriteriaPass &&
  DataKnowledgeSuiteCertificationAllGatesPass
    ? ("Pass" as const)
    : ("Fail" as const);

const identity = Object.freeze({
  certificationId: DataKnowledgeSuiteCertificationId,
  certificationName: DataKnowledgeSuiteCertificationName,
  certificationVersion: DataKnowledgeSuiteCertificationVersion,
  certificationNamespace: DataKnowledgeSuiteCertificationNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Certification" as const,
  sourcePhase: "DKL-9:7" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteCertificationStatus,
  certificationOutcome,
  readiness: DataKnowledgeSuiteCertificationReadiness,
  platformId: platform.identity.platformId,
  platformVersion: platform.identity.platformVersion,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:7/Dependency/DKL96Platform",
  directPreviousPhaseModule: "dataKnowledgeSuitePlatform.ts" as const,
  platformOnly: true as const,
  platformId: platform.identity.platformId,
  platformVersion: platform.identity.platformVersion,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
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
  reconstructsPlatform: false as const,
  modifiesPlatform: false as const,
  canonicalPath:
    "DKL-9:7 → DKL-9:6 Platform → DKL-9:5 Manifest → DKL-9:4 Validation → DKL-9:3 Model → DKL-9:2 Registry → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const criteriaByCategory = Object.freeze(
  Object.fromEntries(
    DataKnowledgeSuiteCertificationCategories.map((category) => [
      category.category,
      Object.freeze(
        DataKnowledgeSuiteCertificationCriteria.filter(
          (item) => item.category === category.category,
        ),
      ),
    ]),
  ),
);

const helpers = Object.freeze({
  getCertificationCriterionById: (criterionId: string) =>
    DataKnowledgeSuiteCertificationCriteria.find(
      (item) => item.id === criterionId || item.name === criterionId,
    ),
  getCertificationCriteriaByCategory: (category: string) =>
    Object.freeze([
      ...((criteriaByCategory as Record<string, readonly unknown[]>)[
        category
      ] ?? []),
    ]),
  getCertificationGateById: (gateId: string) =>
    DataKnowledgeSuiteCertificationGates.find(
      (item) => item.id === gateId || item.name === gateId,
    ),
  getCertificationCriterionCount: () =>
    DataKnowledgeSuiteCertificationCriterionCount,
  getCertificationGateCount: () => DataKnowledgeSuiteCertificationGateCount,
});

const certificationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-9:7/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-9:7" as const,
    section: "Certification" as const,
    kind,
    version: DataKnowledgeSuiteCertificationVersion,
    status: DataKnowledgeSuiteCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "dataKnowledgeSuiteCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const DataKnowledgeSuiteCertificationApiRegistry = Object.freeze([
  certificationApi("DataKnowledgeSuiteCertificationId", "IdentityConstant"),
  certificationApi(
    "DataKnowledgeSuiteCertificationVersion",
    "IdentityConstant",
  ),
  certificationApi("DataKnowledgeSuiteCertificationName", "IdentityConstant"),
  certificationApi(
    "DataKnowledgeSuiteCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi(
    "DataKnowledgeSuiteCertificationStatus",
    "MetadataConstant",
  ),
  certificationApi(
    "DataKnowledgeSuiteCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("DataKnowledgeSuiteCertificationPlatform", "Aggregate"),
  certificationApi("getDataKnowledgeSuiteCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Data Knowledge Suite Certification platform.
 */
export const DataKnowledgeSuiteCertificationPlatform = Object.freeze({
  identity,
  dependency,
  platform,
  manifest: platform.manifest,
  validation: platform.validation,
  model: platform.model,
  registry: platform.registry,
  foundation: platform.foundation,
  categories: DataKnowledgeSuiteCertificationCategories,
  outcomes: DataKnowledgeSuiteCertificationOutcomes,
  criteria: DataKnowledgeSuiteCertificationCriteria,
  criteriaByCategory,
  gates: DataKnowledgeSuiteCertificationGates,
  report: DataKnowledgeSuiteCertificationReportRecord,
  inventory: Object.freeze({
    inventoryId: "DKL-9:7/Inventory",
    criterionCount: DataKnowledgeSuiteCertificationCriterionCount,
    gateCount: DataKnowledgeSuiteCertificationGateCount,
    evidenceCount: DataKnowledgeSuiteCertificationEvidence.length,
    categoryCount: DataKnowledgeSuiteCertificationCategories.length,
    outcomeCount: DataKnowledgeSuiteCertificationOutcomes.length,
    capabilityCount: platform.inventory.capabilityCount,
    publicApiInventoryTotal: platform.inventory.publicApiInventoryTotal,
    manifestTotalEntryCount: platform.inventory.manifestTotalEntryCount,
    validationRuleCount: platform.inventory.validationRuleCount,
    validationGateCount: platform.inventory.validationGateCount,
    validationCategoryCount: platform.inventory.validationCategoryCount,
    modelKindCount: platform.inventory.modelKindCount,
    registryTotalEntryCount: platform.inventory.registryTotalEntryCount,
    platformApiCount: platform.counts.publicApiCount,
    platformGuaranteeCount: platform.guarantees.length,
    platformCompatibilityCount: platform.compatibility.length,
    platformTotalEntryCount: platform.inventory.totalEntryCount,
    sourcedThroughPlatform: true as const,
    reconstructed: false as const,
    hardcoded: false as const,
    duplicated: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  ownership: platform.ownership,
  boundaries: platform.boundaries,
  capabilityCatalog: platform.capabilityCatalog,
  compatibility: DataKnowledgeSuiteCertificationCompatibility,
  guarantees: DataKnowledgeSuiteCertificationGuarantees,
  platformGuarantees: platform.guarantees,
  platformCompatibility: platform.compatibility,
  evidence: DataKnowledgeSuiteCertificationEvidence,
  helpers,
  certificationResult: Object.freeze({
    resultId: "DKL-9:7/Result/Canonical",
    outcome: certificationOutcome,
    criterionCount: DataKnowledgeSuiteCertificationCriterionCount,
    passedCriteria: DataKnowledgeSuiteCertificationReportRecord.passedCriteria,
    failedCriteria: DataKnowledgeSuiteCertificationReportRecord.failedCriteria,
    gateCount: DataKnowledgeSuiteCertificationGateCount,
    passedGates: DataKnowledgeSuiteCertificationReportRecord.passedGates,
    failedGates: DataKnowledgeSuiteCertificationReportRecord.failedGates,
    result: DataKnowledgeSuiteCertificationReportRecord.result,
    freezeReadinessGateOutcome:
      DataKnowledgeSuiteCertificationFreezeReadinessGate?.outcome ?? "Fail",
    freezeReadinessGateReadiness:
      DataKnowledgeSuiteCertificationFreezeReadinessGate?.readinessResult,
    readyForFreeze:
      certificationOutcome === "Pass" &&
      DataKnowledgeSuiteCertificationFreezeReadinessGate?.outcome === "Pass" &&
      DataKnowledgeSuiteCertificationFreezeReadinessGate?.readinessResult ===
        "ReadyForFreeze",
    reportReference: DataKnowledgeSuiteCertificationReportRecord.reportId,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  readiness: DataKnowledgeSuiteCertificationReadiness,
  apiRegistry: DataKnowledgeSuiteCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: DataKnowledgeSuiteCertificationStatus,
  certificationOutcome,
  nextPhase: "DKL-9:8 — Data Knowledge Suite Freeze",
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
  modifiesPlatform: false as const,
  rebuildsManifest: false as const,
  revalidatesModel: false as const,
  recomposesSuite: false as const,
  enforcesPolicies: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Certification summary. */
export function getDataKnowledgeSuiteCertificationSummary(): DataKnowledgeSuiteCertificationSummary {
  return Object.freeze({
    id: DataKnowledgeSuiteCertificationId,
    version: DataKnowledgeSuiteCertificationVersion,
    namespace: DataKnowledgeSuiteCertificationNamespace,
    status: DataKnowledgeSuiteCertificationStatus,
    certificationOutcome:
      DataKnowledgeSuiteCertificationPlatform.certificationOutcome,
    readiness: DataKnowledgeSuiteCertificationReadiness,
    upstreamDependency: platform.identity.platformId,
    criterionCount: DataKnowledgeSuiteCertificationCriterionCount,
    gateCount: DataKnowledgeSuiteCertificationGateCount,
    passedCriterionCount:
      DataKnowledgeSuiteCertificationReportRecord.passedCriteria,
    failedCriterionCount:
      DataKnowledgeSuiteCertificationReportRecord.failedCriteria,
    capabilityCount: platform.inventory.capabilityCount,
    publicApiInventoryTotal: platform.inventory.publicApiInventoryTotal,
    platformTotalEntryCount: platform.inventory.totalEntryCount,
    runtimeBehavior: "None",
    nextPhase: "DKL-9:8 — Data Knowledge Suite Freeze",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
