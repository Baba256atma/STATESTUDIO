/**
 * DKL-6:4 — Knowledge Repository Model Validation.
 *
 * Exactly five Model integrity rules. Metadata evaluation only.
 *
 * Ownership: owned exclusively by DKL-6:4.
 */

import {
  getKnowledgeRepositoryModelCount,
  KnowledgeRepositoryModel,
  KnowledgeRepositoryModelId,
  KnowledgeRepositoryModelStatus,
} from "./knowledgeRepositoryModel.ts";
import type { KnowledgeRepositoryValidationRule } from "./knowledgeRepositoryValidationTypes.ts";

const rule = (
  id: string,
  name: string,
  description: string,
  subjectReference: string,
  expected: string,
  actual: string,
  status: KnowledgeRepositoryValidationRule["status"],
  severity: KnowledgeRepositoryValidationRule["severity"],
  deterministicOrder: number,
): KnowledgeRepositoryValidationRule =>
  Object.freeze({
    id,
    name,
    category: "Model" as const,
    description,
    subjectReference,
    expected,
    actual,
    status,
    severity,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

const modelCount = getKnowledgeRepositoryModelCount();

const identityPass =
  KnowledgeRepositoryModelId === "DKL-6:3/KnowledgeRepositoryModel" &&
  KnowledgeRepositoryModel.identity.modelId === KnowledgeRepositoryModelId;

const statusPass =
  KnowledgeRepositoryModelStatus === "Modeled" &&
  KnowledgeRepositoryModel.identity.status === "Modeled";

const countPass = modelCount === 52;

const relationshipPass = KnowledgeRepositoryModel.relationships.length === 13;

const inventoryPass =
  KnowledgeRepositoryModel.recordModels.length === 7 &&
  KnowledgeRepositoryModel.versionModels.length === 6 &&
  KnowledgeRepositoryModel.snapshotModels.length === 6 &&
  KnowledgeRepositoryModel.historyModels.length === 8 &&
  KnowledgeRepositoryModel.archiveModel.model.modelId.length > 0 &&
  KnowledgeRepositoryModel.retentionModels.length === 6 &&
  KnowledgeRepositoryModel.indexModels.length === 8 &&
  KnowledgeRepositoryModel.retrievalModels.length === 8;

const inventoryActual = [
  `records=${KnowledgeRepositoryModel.recordModels.length}`,
  `versions=${KnowledgeRepositoryModel.versionModels.length}`,
  `snapshots=${KnowledgeRepositoryModel.snapshotModels.length}`,
  `history=${KnowledgeRepositoryModel.historyModels.length}`,
  `archive=1`,
  `retention=${KnowledgeRepositoryModel.retentionModels.length}`,
  `indexes=${KnowledgeRepositoryModel.indexModels.length}`,
  `retrieval=${KnowledgeRepositoryModel.retrievalModels.length}`,
].join(";");

/** Exactly five Model validation rules. */
export const KnowledgeRepositoryModelValidationRules: readonly KnowledgeRepositoryValidationRule[] =
  Object.freeze([
    rule(
      "DKL6-VAL-MOD-001",
      "Model Identity",
      "Model identity equals DKL-6:3/KnowledgeRepositoryModel.",
      KnowledgeRepositoryModelId,
      "DKL-6:3/KnowledgeRepositoryModel",
      KnowledgeRepositoryModelId,
      identityPass ? "Pass" : "Fail",
      "Critical",
      1,
    ),
    rule(
      "DKL6-VAL-MOD-002",
      "Model Status",
      "Model status equals Modeled.",
      KnowledgeRepositoryModelId,
      "Modeled",
      KnowledgeRepositoryModel.identity.status,
      statusPass ? "Pass" : "Fail",
      "Critical",
      2,
    ),
    rule(
      "DKL6-VAL-MOD-003",
      "Model Count Completeness",
      "Model declares exactly 52 models.",
      KnowledgeRepositoryModelId,
      "52",
      String(modelCount),
      countPass ? "Pass" : "Fail",
      "Critical",
      3,
    ),
    rule(
      "DKL6-VAL-MOD-004",
      "Relationship Completeness",
      "Model declares exactly 13 relationships.",
      KnowledgeRepositoryModelId,
      "13",
      String(KnowledgeRepositoryModel.relationships.length),
      relationshipPass ? "Pass" : "Fail",
      "Critical",
      4,
    ),
    rule(
      "DKL6-VAL-MOD-005",
      "Model Inventory Completeness",
      "All required model inventories are complete.",
      KnowledgeRepositoryModelId,
      "records=7;versions=6;snapshots=6;history=8;archive=1;retention=6;indexes=8;retrieval=8",
      inventoryActual,
      inventoryPass ? "Pass" : "Fail",
      "Critical",
      5,
    ),
  ]);

/** Model validation section. */
export const KnowledgeRepositoryModelValidation = Object.freeze({
  category: "Model" as const,
  rules: KnowledgeRepositoryModelValidationRules,
  ruleCount: KnowledgeRepositoryModelValidationRules.length,
  passedRuleCount: KnowledgeRepositoryModelValidationRules.filter(
    (item) => item.status === "Pass",
  ).length,
  failedRuleCount: KnowledgeRepositoryModelValidationRules.filter(
    (item) => item.status === "Fail",
  ).length,
  modelCount,
  metadataOnly: true as const,
  immutable: true as const,
});
