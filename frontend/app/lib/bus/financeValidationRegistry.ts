import type {
  FinanceValidationEntry,
  FinanceValidationRegistry,
  FinanceValidationSummary,
} from "./financeValidationTypes.ts";

export function hasDuplicateFinanceValidationIds(entries: readonly FinanceValidationEntry[]): boolean {
  return new Set(entries.map((entry) => entry.id)).size !== entries.length;
}

export function buildFinanceValidationRegistry(
  entries: readonly FinanceValidationEntry[],
): FinanceValidationRegistry {
  const normalizedEntries = Object.freeze([...entries]);

  return Object.freeze({
    registryId: "finance-validation-registry",
    version: "1.0.0",
    validations: normalizedEntries,
    metadataOnly: true,
    immutable: true,
  });
}

export function buildFinanceValidationSummary(
  entries: readonly FinanceValidationEntry[],
): FinanceValidationSummary {
  const passedCount = entries.filter((entry) => entry.status === "Passed").length;
  const warningCount = entries.filter((entry) => entry.status === "Warning").length;
  const failedCount = entries.filter((entry) => entry.status === "Failed").length;

  return Object.freeze({
    validationCount: entries.length,
    passedCount,
    warningCount,
    failedCount,
    deterministic: true,
    metadataOnly: true,
    immutable: true,
  });
}
