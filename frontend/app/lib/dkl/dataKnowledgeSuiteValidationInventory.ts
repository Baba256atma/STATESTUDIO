/**
 * DKL-9:4 — Data Knowledge Suite Validation Inventory.
 *
 * Inventory derived exclusively through DataKnowledgeSuiteModelPlatform.
 *
 * Ownership: owned exclusively by DKL-9:4.
 */

import { DataKnowledgeSuiteModelPlatform } from "./dataKnowledgeSuiteModel.ts";
import {
  DataKnowledgeSuiteValidationCategories,
  DataKnowledgeSuiteValidationOutcomes,
  DataKnowledgeSuiteValidationSeverities,
} from "./dataKnowledgeSuiteValidationCategories.ts";
import {
  DATA_KNOWLEDGE_SUITE_VALIDATION_GATE_COUNT,
  DataKnowledgeSuiteValidationGates,
} from "./dataKnowledgeSuiteValidationGates.ts";
import {
  DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT,
  DataKnowledgeSuiteValidationRules,
} from "./dataKnowledgeSuiteValidationRules.ts";

const model = DataKnowledgeSuiteModelPlatform;

const passedRuleCount = DataKnowledgeSuiteValidationRules.filter(
  (rule) => rule.outcome === "Pass",
).length;
const failedRuleCount = DataKnowledgeSuiteValidationRules.filter(
  (rule) => rule.outcome === "Fail",
).length;
const warningRuleCount = DataKnowledgeSuiteValidationRules.filter(
  (rule) => rule.outcome === "Warning",
).length;
const notApplicableRuleCount = DataKnowledgeSuiteValidationRules.filter(
  (rule) => rule.outcome === "NotApplicable",
).length;

/** Canonical validation inventory — Model-derived upstream counts. */
export const DataKnowledgeSuiteValidationInventory = Object.freeze({
  inventoryId: "DKL-9:4/DataKnowledgeSuiteValidationInventory",
  ruleCount: DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT,
  gateCount: DATA_KNOWLEDGE_SUITE_VALIDATION_GATE_COUNT,
  categoryCount: DataKnowledgeSuiteValidationCategories.length,
  severityCount: DataKnowledgeSuiteValidationSeverities.length,
  outcomeCount: DataKnowledgeSuiteValidationOutcomes.length,
  passedRuleCount,
  failedRuleCount,
  warningRuleCount,
  notApplicableRuleCount,
  passedGateCount: DataKnowledgeSuiteValidationGates.filter(
    (gate) => gate.outcome === "Pass",
  ).length,
  failedGateCount: DataKnowledgeSuiteValidationGates.filter(
    (gate) => gate.outcome === "Fail",
  ).length,
  modelKindCount: model.inventory.modelKindCount,
  relationshipKindCount: model.inventory.relationshipKindCount,
  suiteModelCount: model.inventory.suiteModelCount,
  capabilityModelCount: model.inventory.capabilityModelCount,
  totalModelInstanceCount: model.inventory.totalModelInstanceCount,
  publicApiInventoryTotal: model.inventory.publicApiInventoryTotal,
  registryTotalEntryCount: model.inventory.registryTotalEntryCount,
  modelInventory: model.inventory,
  sourcedThroughModel: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  duplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
