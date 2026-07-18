/**
 * DKL-9:4 — Data Knowledge Suite Validation.
 *
 * Canonical immutable deterministic validation for Suite composition.
 * Consumes only DataKnowledgeSuiteModelPlatform.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by DKL-9:4.
 *
 * Public exports (exactly 8):
 *   DataKnowledgeSuiteValidationId
 *   DataKnowledgeSuiteValidationVersion
 *   DataKnowledgeSuiteValidationName
 *   DataKnowledgeSuiteValidationNamespace
 *   DataKnowledgeSuiteValidationStatus
 *   DataKnowledgeSuiteValidationReadiness
 *   DataKnowledgeSuiteValidationPlatform
 *   getDataKnowledgeSuiteValidationSummary()
 */

import {
  DataKnowledgeSuiteModelId,
  DataKnowledgeSuiteModelPlatform,
  DataKnowledgeSuiteModelVersion,
} from "./dataKnowledgeSuiteModel.ts";
import {
  DataKnowledgeSuiteValidationCategories,
  DataKnowledgeSuiteValidationOutcomes,
  DataKnowledgeSuiteValidationSeverities,
} from "./dataKnowledgeSuiteValidationCategories.ts";
import {
  DataKnowledgeSuiteManifestReadinessGate,
  DataKnowledgeSuiteValidationAllGatesPass,
  DataKnowledgeSuiteValidationGates,
} from "./dataKnowledgeSuiteValidationGates.ts";
import { DataKnowledgeSuiteValidationInventory } from "./dataKnowledgeSuiteValidationInventory.ts";
import {
  DataKnowledgeSuiteValidationFindings,
  DataKnowledgeSuiteValidationReportRecord,
} from "./dataKnowledgeSuiteValidationReports.ts";
import {
  DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT,
  DataKnowledgeSuiteValidationRules,
} from "./dataKnowledgeSuiteValidationRules.ts";
import type {
  DataKnowledgeSuiteValidationOutcome,
  DataKnowledgeSuiteValidationSummary,
} from "./dataKnowledgeSuiteValidationTypes.ts";

export const DataKnowledgeSuiteValidationId =
  "DKL-9:4/DataKnowledgeSuiteValidation" as const;

export const DataKnowledgeSuiteValidationName =
  "Data Knowledge Suite Validation" as const;

export const DataKnowledgeSuiteValidationVersion = "1.0.0" as const;

export const DataKnowledgeSuiteValidationNamespace =
  "nexora.dkl.data-knowledge-suite.validation" as const;

export const DataKnowledgeSuiteValidationStatus =
  "ValidationDefined" as const;

export const DataKnowledgeSuiteValidationReadiness =
  "ReadyForManifest" as const;

const model = DataKnowledgeSuiteModelPlatform;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "severities",
  "outcomes",
  "rules",
  "rulesByCategory",
  "findings",
  "reports",
  "gates",
  "inventory",
  "validationResult",
  "readiness",
] as const);

const rulesByCategory = Object.freeze(
  Object.fromEntries(
    DataKnowledgeSuiteValidationCategories.map((category) => [
      category.category,
      Object.freeze(
        DataKnowledgeSuiteValidationRules.filter(
          (rule) => rule.category === category.category,
        ),
      ),
    ]),
  ),
);

const canonicalOutcome: DataKnowledgeSuiteValidationOutcome =
  DataKnowledgeSuiteValidationInventory.failedRuleCount === 0 &&
  DataKnowledgeSuiteValidationAllGatesPass &&
  DataKnowledgeSuiteValidationInventory.passedRuleCount ===
    DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT
    ? "Pass"
    : "Fail";

const identity = Object.freeze({
  validationId: DataKnowledgeSuiteValidationId,
  validationName: DataKnowledgeSuiteValidationName,
  validationVersion: DataKnowledgeSuiteValidationVersion,
  validationNamespace: DataKnowledgeSuiteValidationNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-9" as const,
  stage: "Validation" as const,
  sourcePhase: "DKL-9:4" as const,
  owner: "DKL-9 Data Knowledge Suite",
  status: DataKnowledgeSuiteValidationStatus,
  validationOutcome: canonicalOutcome,
  readiness: DataKnowledgeSuiteValidationReadiness,
  modelId: DataKnowledgeSuiteModelId,
  modelVersion: DataKnowledgeSuiteModelVersion,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-9:4/Dependency/DKL93Model",
  directPreviousPhaseModule: "dataKnowledgeSuiteModel.ts" as const,
  modelOnly: true as const,
  modelId: DataKnowledgeSuiteModelId,
  modelVersion: DataKnowledgeSuiteModelVersion,
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
  reconstructsModel: false as const,
  reconstructsRegistry: false as const,
  reconstructsFoundation: false as const,
  revalidatesUpstreamCapabilities: false as const,
  canonicalPath:
    "DKL-9:4 → DKL-9:3 Model → DKL-9:2 Registry → DKL-9:1 Foundation → DKL-1..DKL-8 Public Indexes",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-9:4/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-9:4" as const,
    section: "Validation" as const,
    kind,
    version: DataKnowledgeSuiteValidationVersion,
    status: DataKnowledgeSuiteValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "dataKnowledgeSuiteValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const DataKnowledgeSuiteValidationApiRegistry = Object.freeze([
  validationApi("DataKnowledgeSuiteValidationId", "IdentityConstant"),
  validationApi("DataKnowledgeSuiteValidationVersion", "IdentityConstant"),
  validationApi("DataKnowledgeSuiteValidationName", "IdentityConstant"),
  validationApi("DataKnowledgeSuiteValidationNamespace", "IdentityConstant"),
  validationApi("DataKnowledgeSuiteValidationStatus", "MetadataConstant"),
  validationApi("DataKnowledgeSuiteValidationReadiness", "MetadataConstant"),
  validationApi("DataKnowledgeSuiteValidationPlatform", "Aggregate"),
  validationApi("getDataKnowledgeSuiteValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Data Knowledge Suite Validation platform.
 */
export const DataKnowledgeSuiteValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: DataKnowledgeSuiteValidationCategories,
  severities: DataKnowledgeSuiteValidationSeverities,
  outcomes: DataKnowledgeSuiteValidationOutcomes,
  rules: DataKnowledgeSuiteValidationRules,
  rulesByCategory,
  findings: DataKnowledgeSuiteValidationFindings,
  reports: Object.freeze([DataKnowledgeSuiteValidationReportRecord]),
  gates: DataKnowledgeSuiteValidationGates,
  inventory: DataKnowledgeSuiteValidationInventory,
  validationResult: Object.freeze({
    resultId: "DKL-9:4/Result/Canonical",
    outcome: canonicalOutcome,
    ruleCount: DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT,
    passedRuleCount: DataKnowledgeSuiteValidationInventory.passedRuleCount,
    failedRuleCount: DataKnowledgeSuiteValidationInventory.failedRuleCount,
    gateCount: DataKnowledgeSuiteValidationGates.length,
    gatesPassed: DataKnowledgeSuiteValidationGates.filter(
      (item) => item.outcome === "Pass",
    ).length,
    readyForManifest:
      canonicalOutcome === "Pass" &&
      DataKnowledgeSuiteManifestReadinessGate?.outcome === "Pass" &&
      DataKnowledgeSuiteManifestReadinessGate.readinessResult ===
        "ReadyForManifest",
    reportReference: DataKnowledgeSuiteValidationReportRecord.reportId,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  readiness: DataKnowledgeSuiteValidationReadiness,
  apiRegistry: DataKnowledgeSuiteValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  ruleCount: DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT,
  gateCount: DataKnowledgeSuiteValidationGates.length,
  categoryCount: DataKnowledgeSuiteValidationCategories.length,
  status: DataKnowledgeSuiteValidationStatus,
  validationOutcome: canonicalOutcome,
  nextPhase: "DKL-9:5 — Data Knowledge Suite Manifest",
  model,
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
  sceneBehavior: false as const,
  uiBehavior: false as const,
  reconstructsUpstream: false as const,
  revalidatesUpstreamCapabilities: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Data Knowledge Suite Validation summary. */
export function getDataKnowledgeSuiteValidationSummary(): DataKnowledgeSuiteValidationSummary {
  return Object.freeze({
    id: DataKnowledgeSuiteValidationId,
    version: DataKnowledgeSuiteValidationVersion,
    namespace: DataKnowledgeSuiteValidationNamespace,
    status: DataKnowledgeSuiteValidationStatus,
    validationOutcome: canonicalOutcome,
    readiness: DataKnowledgeSuiteValidationReadiness,
    upstreamDependency: DataKnowledgeSuiteModelId,
    ruleCount: DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT,
    gateCount: DataKnowledgeSuiteValidationGates.length,
    categoryCount: DataKnowledgeSuiteValidationCategories.length,
    passedRuleCount: DataKnowledgeSuiteValidationInventory.passedRuleCount,
    failedRuleCount: DataKnowledgeSuiteValidationInventory.failedRuleCount,
    capabilityModelCount: model.inventory.capabilityModelCount,
    modelKindCount: model.inventory.modelKindCount,
    publicApiInventoryTotal: model.inventory.publicApiInventoryTotal,
    runtimeBehavior: "None" as const,
    nextPhase: "DKL-9:5 — Data Knowledge Suite Manifest",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
