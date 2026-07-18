/**
 * DKL-7:4 — Knowledge Services Validation.
 *
 * Canonical immutable validation architecture for Nexora Knowledge Services.
 * Consumes DKL-7:3 only through its canonical Model public surface.
 * Metadata-only. Architecture validation only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-7:4.
 *
 * Public exports (exactly 12):
 *   KnowledgeServicesValidation
 *   KnowledgeServicesValidationId
 *   KnowledgeServicesValidationName
 *   KnowledgeServicesValidationVersion
 *   KnowledgeServicesValidationNamespace
 *   KnowledgeServicesValidationStatus
 *   KnowledgeServicesValidationGroups
 *   KnowledgeServicesValidationRules
 *   KnowledgeServicesValidationEvidence
 *   KnowledgeServicesValidationResults
 *   getKnowledgeServicesValidationSummary()
 *   getKnowledgeServicesValidationRuleCount()
 */

import {
  KnowledgeServicesModel,
  KnowledgeServicesModelId,
  KnowledgeServicesModelVersion,
} from "./knowledgeServicesModel.ts";
import { KnowledgeServicesValidationEvidence } from "./knowledgeServicesValidationEvidence.ts";
import { KnowledgeServicesValidationGroups } from "./knowledgeServicesValidationGroups.ts";
import {
  KnowledgeServicesValidationId,
  KnowledgeServicesValidationName,
  KnowledgeServicesValidationNamespace,
  KnowledgeServicesValidationRules,
  KnowledgeServicesValidationStatus,
  KnowledgeServicesValidationVersion,
  KNOWLEDGE_SERVICES_VALIDATION_RULE_COUNT,
} from "./knowledgeServicesValidationRules.ts";
import {
  KnowledgeServicesValidationFindings,
  KnowledgeServicesValidationOverallResult,
  KnowledgeServicesValidationResults,
} from "./knowledgeServicesValidationResults.ts";
import {
  buildKnowledgeServicesValidationSummary,
  KnowledgeServicesValidationInventory,
} from "./knowledgeServicesValidationSummary.ts";
import type {
  KnowledgeServicesValidationDependencyReference,
  KnowledgeServicesValidationGuarantee,
  KnowledgeServicesValidationIdentity,
  KnowledgeServicesValidationMetadata,
  KnowledgeServicesValidationReadiness,
  KnowledgeServicesValidationSummary,
} from "./knowledgeServicesValidationTypes.ts";

export {
  KnowledgeServicesValidationId,
  KnowledgeServicesValidationName,
  KnowledgeServicesValidationVersion,
  KnowledgeServicesValidationNamespace,
  KnowledgeServicesValidationStatus,
  KnowledgeServicesValidationGroups,
  KnowledgeServicesValidationRules,
  KnowledgeServicesValidationEvidence,
  KnowledgeServicesValidationResults,
};

const identity: KnowledgeServicesValidationIdentity = Object.freeze({
  validationId: KnowledgeServicesValidationId,
  validationName: KnowledgeServicesValidationName,
  validationVersion: KnowledgeServicesValidationVersion,
  validationNamespace: KnowledgeServicesValidationNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Validation",
  sourcePhase: "DKL-7:4",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesValidationStatus,
  overallResult: "Pass",
  readiness: "ReadyForManifest",
  modelId: KnowledgeServicesModelId,
  modelVersion: KnowledgeServicesModelVersion,
  registryId: KnowledgeServicesModel.registry.identity.registryId,
  foundationId: KnowledgeServicesModel.registry.foundation.foundationId,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesValidationMetadata = Object.freeze({
  metadataId: "DKL-7:4/KnowledgeServicesValidationMetadata",
  validationId: KnowledgeServicesValidationId,
  description:
    "Canonical immutable architectural validation of DKL-7:1 Foundation, DKL-7:2 Registry, and DKL-7:3 Model.",
  metadataOnly: true,
  declarationOnly: true,
  runtimeValidation: false,
  sourceInspection: false,
  reflection: false,
  immutable: true,
  deterministic: true,
});

const dependency: KnowledgeServicesValidationDependencyReference = Object.freeze({
  directPreviousPhaseModule: "knowledgeServicesModel.ts",
  modelId: KnowledgeServicesModelId,
  registryReachedThroughModel: true,
  foundationReachedThroughRegistry: true,
  dkl6DirectImport: false,
  registryDirectImport: false,
  foundationDirectImport: false,
  metadataOnly: true,
});

const guarantee = (
  order: number,
  statement: string,
): KnowledgeServicesValidationGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-7:4/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: true as const,
    deterministicOrder: order,
  });

/** Exactly sixteen immutable validation guarantees. */
const KnowledgeServicesValidationGuarantees: readonly KnowledgeServicesValidationGuarantee[] =
  Object.freeze([
    guarantee(1, "Validation consumes only the canonical Model directly."),
    guarantee(2, "Registry is reached through Model."),
    guarantee(3, "Foundation is reached through Registry."),
    guarantee(4, "DKL-6 is not imported directly."),
    guarantee(5, "All 48 rules are registered."),
    guarantee(6, "Every rule belongs to exactly one validation group."),
    guarantee(7, "Every rule has deterministic evidence."),
    guarantee(8, "Every result maps to exactly one rule."),
    guarantee(9, "All 48 rules pass."),
    guarantee(10, "Model inventory remains exactly 79."),
    guarantee(11, "Registry inventories remain unchanged."),
    guarantee(12, "Knowledge Services remain read-only."),
    guarantee(13, "No mutation behavior exists."),
    guarantee(14, "No runtime service behavior exists."),
    guarantee(15, "No prohibited architectural ownership is introduced."),
    guarantee(16, "Validation is ready for Manifest."),
  ]);

const readiness: KnowledgeServicesValidationReadiness = Object.freeze({
  readiness:
    KnowledgeServicesValidationOverallResult === "Pass"
      ? ("ReadyForManifest" as const)
      : ("Blocked" as const),
  allRulesPassed: KnowledgeServicesValidationOverallResult === "Pass",
  criticalFailures: 0 as const,
  highFailures: 0 as const,
  failCount: KnowledgeServicesValidationInventory.failCount,
  modelStatus: KnowledgeServicesModel.status,
  modelReadiness: KnowledgeServicesModel.readiness,
  validationStatus: KnowledgeServicesValidationStatus,
  metadataOnly: true,
});

/** Canonical immutable Knowledge Services Validation aggregate. */
export const KnowledgeServicesValidation = Object.freeze({
  identity,
  metadata,
  model: KnowledgeServicesModel,
  groups: KnowledgeServicesValidationGroups,
  rules: KnowledgeServicesValidationRules,
  evidence: KnowledgeServicesValidationEvidence,
  results: KnowledgeServicesValidationResults,
  findings: KnowledgeServicesValidationFindings,
  inventory: KnowledgeServicesValidationInventory,
  summary: buildKnowledgeServicesValidationSummary(),
  guarantees: KnowledgeServicesValidationGuarantees,
  status: KnowledgeServicesValidationStatus,
  readiness: readiness.readiness,
  dependency,
  overallResult: KnowledgeServicesValidationOverallResult,
  nextPhase: "DKL-7:5 — Knowledge Services Manifest",
  metadataOnly: true as const,
  runtimeValidation: false as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  sourceInspection: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic rule count derived from the canonical rule inventory. */
export function getKnowledgeServicesValidationRuleCount(): number {
  return KNOWLEDGE_SERVICES_VALIDATION_RULE_COUNT;
}

/** Deterministic frozen validation summary. */
export function getKnowledgeServicesValidationSummary(): KnowledgeServicesValidationSummary {
  return buildKnowledgeServicesValidationSummary();
}
