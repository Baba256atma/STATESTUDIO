import {
  FINANCIAL_OBJECT_TYPES,
  FINANCIAL_STATUSES,
  FINANCIAL_VISIBILITIES,
} from "./financeIndex.ts";
import type {
  FinanceCategoryRegistry,
  FinanceObjectRegistry as FinanceObjectRegistryContract,
  FinanceRegistryCategory,
  FinanceRegistryObjectEntry,
} from "./financeRegistryTypes.ts";
import { getFinanceCategoryRegistry } from "./financeCategoryRegistry.ts";

function getCategoryForType(type: FinanceRegistryObjectEntry["type"]): FinanceRegistryCategory {
  switch (type) {
    case "Revenue":
      return "Income";
    case "Expense":
    case "Cost":
      return "ExpenseManagement";
    case "Budget":
    case "Forecast":
      return "Planning";
    case "CashFlow":
      return "Liquidity";
    case "Invoice":
    case "Payment":
      return "Transaction";
    case "Account":
    case "Currency":
      return "AccountingStructure";
    case "Profit":
    case "Asset":
    case "Liability":
    case "Equity":
      return "FinancialPosition";
    case "FinancialPeriod":
      return "ReportingPeriod";
    case "FinancialStatement":
      return "Statement";
  }
}

function buildObjectCode(type: FinanceRegistryObjectEntry["type"]): FinanceRegistryObjectEntry["code"] {
  return `FIN-${type.toUpperCase()}` as FinanceRegistryObjectEntry["code"];
}

function buildObjectId(type: FinanceRegistryObjectEntry["type"]): FinanceRegistryObjectEntry["id"] {
  return `finance-object-${type.toLowerCase()}` as FinanceRegistryObjectEntry["id"];
}

const DEFAULT_STATUS = FINANCIAL_STATUSES[1];
const DEFAULT_VISIBILITY = FINANCIAL_VISIBILITIES[0];

const FINANCE_OBJECT_REGISTRY_ENTRIES: readonly FinanceRegistryObjectEntry[] = Object.freeze(
  FINANCIAL_OBJECT_TYPES.map((type) =>
    Object.freeze({
      id: buildObjectId(type),
      code: buildObjectCode(type),
      name: type,
      type,
      category: getCategoryForType(type),
      description: `Canonical metadata registry entry for ${type}.`,
      status: DEFAULT_STATUS,
      visibility: DEFAULT_VISIBILITY,
      sourcePhase: "BUS-28:1",
      contractVersion: "1.0.0",
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const FinanceObjectRegistry: FinanceObjectRegistryContract = Object.freeze({
  registryId: "finance-object-registry",
  registryVersion: "1.0.0",
  objects: FINANCE_OBJECT_REGISTRY_ENTRIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceObjectRegistry(): FinanceObjectRegistryContract {
  return FinanceObjectRegistry;
}

export function findFinanceObjectByCode(code: FinanceRegistryObjectEntry["code"] | string): FinanceRegistryObjectEntry | undefined {
  return FinanceObjectRegistry.objects.find((entry) => entry.code === code);
}

export function findFinanceObjectsByCategory(
  category: FinanceRegistryCategory,
): readonly FinanceRegistryObjectEntry[] {
  return Object.freeze(FinanceObjectRegistry.objects.filter((entry) => entry.category === category));
}

export function getFinanceRegistryCategoriesUsed(): FinanceCategoryRegistry["categories"] {
  const registry = getFinanceCategoryRegistry();
  return registry.categories;
}
