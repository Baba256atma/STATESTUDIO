import {
  ExecutiveFinancePlatformFoundation,
  FINANCIAL_OBJECT_TYPES,
} from "./financeIndex.ts";
import {
  ExecutiveFinanceRegistryFoundation,
  FinanceApiRegistry,
  FinanceCategoryRegistry,
  FinanceObjectRegistry,
  getFinanceRegistryManifest,
} from "./financeRegistryIndex.ts";
import {
  ExecutiveFinanceModelFoundation,
  FinanceAggregationRegistry,
  FinanceDependencyRegistry,
  FinanceModelRegistry,
  FinanceOwnershipRegistry,
  FinanceRelationshipRegistry,
} from "./financeModelIndex.ts";
import {
  FINANCE_VALIDATION_RULES,
  createFinanceValidationEntry,
} from "./financeValidationRules.ts";
import {
  buildFinanceValidationRegistry,
  buildFinanceValidationSummary,
  hasDuplicateFinanceValidationIds,
} from "./financeValidationRegistry.ts";
import type { FinanceValidationResult } from "./financeValidationTypes.ts";

function isFrozenObject(value: object): boolean {
  return Object.isFrozen(value);
}

function createValidationEntries() {
  const registryManifest = getFinanceRegistryManifest();
  const rules = FINANCE_VALIDATION_RULES;

  const entries = [
    createFinanceValidationEntry(
      rules[0],
      ExecutiveFinancePlatformFoundation.FinanceContracts.objectTypes.length === FINANCIAL_OBJECT_TYPES.length &&
        ExecutiveFinancePlatformFoundation.FinanceIdentity.platformId === "BUS-28" &&
        ExecutiveFinancePlatformFoundation.FinanceMetadata.contractVersion === "1.0.0" &&
        ExecutiveFinancePlatformFoundation.FinanceEnums.FINANCIAL_OBJECT_TYPES.length === FINANCIAL_OBJECT_TYPES.length &&
        ExecutiveFinancePlatformFoundation.FinanceApi.length > 0
        ? "Passed"
        : "Failed",
    ),
    createFinanceValidationEntry(
      rules[1],
      FinanceObjectRegistry.objects.length === FINANCIAL_OBJECT_TYPES.length &&
        FinanceCategoryRegistry.categories.length > 0 &&
        FinanceApiRegistry.apis.length > 0 &&
        registryManifest.phaseId === "BUS-28:2" &&
        isFrozenObject(FinanceObjectRegistry) &&
        isFrozenObject(FinanceCategoryRegistry) &&
        isFrozenObject(FinanceApiRegistry)
        ? "Passed"
        : "Failed",
    ),
    createFinanceValidationEntry(
      rules[2],
      FinanceModelRegistry.entities.length === FINANCIAL_OBJECT_TYPES.length &&
        FinanceRelationshipRegistry.relationships.length > 0 &&
        FinanceOwnershipRegistry.ownership.length > 0 &&
        FinanceAggregationRegistry.aggregations.length > 0 &&
        FinanceDependencyRegistry.dependencies.length > 0
        ? "Passed"
        : "Failed",
    ),
    createFinanceValidationEntry(
      rules[3],
      ExecutiveFinanceRegistryFoundation.metadataOnly &&
        ExecutiveFinanceRegistryFoundation.immutable &&
        ExecutiveFinanceModelFoundation.metadataOnly &&
        ExecutiveFinanceModelFoundation.immutable &&
        FinanceModelRegistry.entities.every((entity) =>
          FinanceObjectRegistry.objects.some((objectEntry) => objectEntry.code === entity.objectCode),
        )
        ? "Passed"
        : "Failed",
    ),
    createFinanceValidationEntry(
      rules[4],
      isFrozenObject(ExecutiveFinancePlatformFoundation) &&
        isFrozenObject(ExecutiveFinanceRegistryFoundation) &&
        isFrozenObject(ExecutiveFinanceModelFoundation) &&
        !hasDuplicateFinanceValidationIds(
          rules.map((rule) => createFinanceValidationEntry(rule, "Passed")),
        ) &&
        new Set(FinanceObjectRegistry.objects.map((entry) => entry.id)).size ===
          FinanceObjectRegistry.objects.length
        ? "Passed"
        : "Failed",
    ),
    createFinanceValidationEntry(
      rules[5],
      typeof ExecutiveFinancePlatformFoundation.getFinanceContracts === "function" &&
        typeof ExecutiveFinanceRegistryFoundation.getFinanceObjectRegistry === "function" &&
        typeof ExecutiveFinanceModelFoundation.getFinanceModel === "function"
        ? "Passed"
        : "Failed",
    ),
  ] as const;

  return Object.freeze(entries);
}

export function runFinanceValidation(): FinanceValidationResult {
  const validations = createValidationEntries();
  const registry = buildFinanceValidationRegistry(validations);
  const summary = buildFinanceValidationSummary(validations);

  return Object.freeze({
    registry,
    summary,
    valid: summary.failedCount === 0,
    metadataOnly: true,
    immutable: true,
  });
}

export function getFinanceValidation(): FinanceValidationResult {
  return runFinanceValidation();
}
