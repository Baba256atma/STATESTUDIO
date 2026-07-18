/**
 * DKL-8:7 — Knowledge Governance Certification.
 *
 * Canonical immutable Certification surface for Knowledge Governance through
 * DKL-8:6 Platform. Consumes only KnowledgeGovernancePlatform.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by DKL-8:7.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceCertificationId
 *   KnowledgeGovernanceCertificationVersion
 *   KnowledgeGovernanceCertificationName
 *   KnowledgeGovernanceCertificationNamespace
 *   KnowledgeGovernanceCertificationStatus
 *   KnowledgeGovernanceCertificationReadiness
 *   KnowledgeGovernanceCertificationPlatform
 *   getKnowledgeGovernanceCertificationSummary()
 */

import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";
import {
  KnowledgeGovernanceCertificationCompatibility,
  KnowledgeGovernanceCertificationGuarantees,
} from "./knowledgeGovernanceCertificationCompatibility.ts";
import {
  KnowledgeGovernanceCertificationAllCriteriaPass,
  KnowledgeGovernanceCertificationCategories,
  KnowledgeGovernanceCertificationCriteria,
  KnowledgeGovernanceCertificationCriterionCount,
  KnowledgeGovernanceCertificationOutcomes,
} from "./knowledgeGovernanceCertificationCriteria.ts";
import { KnowledgeGovernanceCertificationEvidence } from "./knowledgeGovernanceCertificationEvidence.ts";
import {
  KnowledgeGovernanceCertificationAllGatesPass,
  KnowledgeGovernanceCertificationFreezeReadinessGate,
  KnowledgeGovernanceCertificationGateCount,
  KnowledgeGovernanceCertificationGates,
} from "./knowledgeGovernanceCertificationGates.ts";
import { KnowledgeGovernanceCertificationReportRecord } from "./knowledgeGovernanceCertificationReport.ts";
import type { KnowledgeGovernanceCertificationSummary } from "./knowledgeGovernanceCertificationTypes.ts";

export const KnowledgeGovernanceCertificationId =
  "DKL-8:7/KnowledgeGovernanceCertification" as const;

export const KnowledgeGovernanceCertificationName =
  "Knowledge Governance Certification" as const;

export const KnowledgeGovernanceCertificationVersion = "1.0.0" as const;

export const KnowledgeGovernanceCertificationNamespace =
  "nexora.dkl.knowledge-governance.certification" as const;

export const KnowledgeGovernanceCertificationStatus = "Certified" as const;

export const KnowledgeGovernanceCertificationReadiness =
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

const platform = KnowledgeGovernancePlatform;

const certificationOutcome =
  KnowledgeGovernanceCertificationAllCriteriaPass &&
  KnowledgeGovernanceCertificationAllGatesPass
    ? ("Pass" as const)
    : ("Fail" as const);

const identity = Object.freeze({
  certificationId: KnowledgeGovernanceCertificationId,
  certificationName: KnowledgeGovernanceCertificationName,
  certificationVersion: KnowledgeGovernanceCertificationVersion,
  certificationNamespace: KnowledgeGovernanceCertificationNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Certification" as const,
  sourcePhase: "DKL-8:7" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceCertificationStatus,
  certificationOutcome,
  readiness: KnowledgeGovernanceCertificationReadiness,
  platformId: platform.identity.platformId,
  platformVersion: platform.identity.platformVersion,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:7/Dependency/DKL86Platform",
  directPreviousPhaseModule: "knowledgeGovernancePlatform.ts" as const,
  platformOnly: true as const,
  platformId: platform.identity.platformId,
  platformVersion: platform.identity.platformVersion,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  futurePhaseDependency: false as const,
  circularDependency: false as const,
  reconstructsPlatform: false as const,
  modifiesPlatform: false as const,
  canonicalPath:
    "DKL-8:7 → DKL-8:6 Platform → DKL-8:5 Manifest → DKL-8:4 Validation → DKL-8:3 Model → DKL-8:2 Registry → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const criteriaByCategory = Object.freeze(
  Object.fromEntries(
    KnowledgeGovernanceCertificationCategories.map((category) => [
      category.category,
      Object.freeze(
        KnowledgeGovernanceCertificationCriteria.filter(
          (item) => item.category === category.category,
        ),
      ),
    ]),
  ),
);

const helpers = Object.freeze({
  getCertificationCriterionById: (criterionId: string) =>
    KnowledgeGovernanceCertificationCriteria.find(
      (item) => item.id === criterionId || item.name === criterionId,
    ),
  getCertificationCriteriaByCategory: (category: string) =>
    Object.freeze([
      ...((criteriaByCategory as Record<string, readonly unknown[]>)[
        category
      ] ?? []),
    ]),
  getCertificationGateById: (gateId: string) =>
    KnowledgeGovernanceCertificationGates.find(
      (item) => item.id === gateId || item.name === gateId,
    ),
  getCertificationCriterionCount: () =>
    KnowledgeGovernanceCertificationCriterionCount,
  getCertificationGateCount: () => KnowledgeGovernanceCertificationGateCount,
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
    id: `DKL-8:7/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-8:7" as const,
    section: "Certification" as const,
    kind,
    version: KnowledgeGovernanceCertificationVersion,
    status: KnowledgeGovernanceCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "knowledgeGovernanceCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const KnowledgeGovernanceCertificationApiRegistry = Object.freeze([
  certificationApi("KnowledgeGovernanceCertificationId", "IdentityConstant"),
  certificationApi(
    "KnowledgeGovernanceCertificationVersion",
    "IdentityConstant",
  ),
  certificationApi("KnowledgeGovernanceCertificationName", "IdentityConstant"),
  certificationApi(
    "KnowledgeGovernanceCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi(
    "KnowledgeGovernanceCertificationStatus",
    "MetadataConstant",
  ),
  certificationApi(
    "KnowledgeGovernanceCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("KnowledgeGovernanceCertificationPlatform", "Aggregate"),
  certificationApi("getKnowledgeGovernanceCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Knowledge Governance Certification platform.
 */
export const KnowledgeGovernanceCertificationPlatform = Object.freeze({
  identity,
  dependency,
  platform,
  manifest: platform.manifest,
  validation: platform.validation,
  model: platform.model,
  registry: platform.registry,
  foundation: platform.foundation,
  categories: KnowledgeGovernanceCertificationCategories,
  outcomes: KnowledgeGovernanceCertificationOutcomes,
  criteria: KnowledgeGovernanceCertificationCriteria,
  criteriaByCategory,
  gates: KnowledgeGovernanceCertificationGates,
  report: KnowledgeGovernanceCertificationReportRecord,
  inventory: Object.freeze({
    inventoryId: "DKL-8:7/Inventory",
    criterionCount: KnowledgeGovernanceCertificationCriterionCount,
    gateCount: KnowledgeGovernanceCertificationGateCount,
    evidenceCount: KnowledgeGovernanceCertificationEvidence.length,
    categoryCount: KnowledgeGovernanceCertificationCategories.length,
    outcomeCount: KnowledgeGovernanceCertificationOutcomes.length,
    manifestTotalEntryCount: platform.inventory.manifestTotalEntryCount,
    registryEntryCount: platform.inventory.registryEntryCount,
    modelKindCount: platform.inventory.modelKindCount,
    relationshipKindCount: platform.inventory.relationshipKindCount,
    validationRuleCount: platform.inventory.validationRuleCount,
    validationCategoryCount: platform.inventory.validationCategoryCount,
    validationGateCount: platform.inventory.validationGateCount,
    platformApiCount: platform.counts.publicApiCount,
    platformGuaranteeCount: platform.guarantees.length,
    platformCompatibilityCount: platform.compatibility.length,
    platformTotalEntryCount: platform.inventory.totalEntryCount,
    sourcedThroughPlatform: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  ownership: platform.ownership,
  boundaries: platform.boundaries,
  compatibility: KnowledgeGovernanceCertificationCompatibility,
  guarantees: KnowledgeGovernanceCertificationGuarantees,
  platformGuarantees: platform.guarantees,
  platformCompatibility: platform.compatibility,
  evidence: KnowledgeGovernanceCertificationEvidence,
  helpers,
  certificationResult: Object.freeze({
    resultId: "DKL-8:7/Result/Canonical",
    outcome: certificationOutcome,
    criterionCount: KnowledgeGovernanceCertificationCriterionCount,
    passedCriterionCount:
      KnowledgeGovernanceCertificationReportRecord.passedCriterionCount,
    failedCriterionCount:
      KnowledgeGovernanceCertificationReportRecord.failedCriterionCount,
    gateCount: KnowledgeGovernanceCertificationGateCount,
    passedGateCount:
      KnowledgeGovernanceCertificationReportRecord.passedGateCount,
    failedGateCount:
      KnowledgeGovernanceCertificationReportRecord.failedGateCount,
    freezeReadinessGateOutcome:
      KnowledgeGovernanceCertificationFreezeReadinessGate?.outcome ?? "Fail",
    readyForFreeze:
      certificationOutcome === "Pass" &&
      KnowledgeGovernanceCertificationFreezeReadinessGate?.outcome === "Pass",
    reportReference: KnowledgeGovernanceCertificationReportRecord.reportId,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  readiness: KnowledgeGovernanceCertificationReadiness,
  apiRegistry: KnowledgeGovernanceCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernanceCertificationStatus,
  certificationOutcome,
  nextPhase: "DKL-8:8 — Knowledge Governance Freeze",
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
  enforcesGovernance: false as const,
  legalEvaluation: false as const,
  auditLogging: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Certification summary. */
export function getKnowledgeGovernanceCertificationSummary(): KnowledgeGovernanceCertificationSummary {
  return Object.freeze({
    id: KnowledgeGovernanceCertificationId,
    version: KnowledgeGovernanceCertificationVersion,
    namespace: KnowledgeGovernanceCertificationNamespace,
    status: KnowledgeGovernanceCertificationStatus,
    certificationOutcome:
      KnowledgeGovernanceCertificationPlatform.certificationOutcome,
    readiness: KnowledgeGovernanceCertificationReadiness,
    upstreamDependency: platform.identity.platformId,
    criterionCount: KnowledgeGovernanceCertificationCriterionCount,
    gateCount: KnowledgeGovernanceCertificationGateCount,
    passedCriterionCount:
      KnowledgeGovernanceCertificationReportRecord.passedCriterionCount,
    failedCriterionCount:
      KnowledgeGovernanceCertificationReportRecord.failedCriterionCount,
    registryEntryCount: platform.inventory.registryEntryCount,
    modelKindCount: platform.inventory.modelKindCount,
    validationRuleCount: platform.inventory.validationRuleCount,
    platformTotalEntryCount: platform.inventory.totalEntryCount,
    runtimeBehavior: "None",
    nextPhase: "DKL-8:8 — Knowledge Governance Freeze",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
