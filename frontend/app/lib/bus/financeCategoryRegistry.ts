import type {
  FinanceCategoryEntry,
  FinanceCategoryRegistry as FinanceCategoryRegistryContract,
} from "./financeRegistryTypes.ts";

export const FinanceCategoryRegistry: FinanceCategoryRegistryContract = Object.freeze({
  registryId: "finance-category-registry",
  registryVersion: "1.0.0",
  categories: Object.freeze<readonly FinanceCategoryEntry[]>([
    Object.freeze({
      id: "finance-category-income",
      code: "FCAT-INCOME",
      name: "Income",
      description: "Canonical category for revenue-oriented finance contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-expensemanagement",
      code: "FCAT-EXPENSEMANAGEMENT",
      name: "ExpenseManagement",
      description: "Canonical category for expense and cost finance contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-planning",
      code: "FCAT-PLANNING",
      name: "Planning",
      description: "Canonical category for budget and forecast finance contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-liquidity",
      code: "FCAT-LIQUIDITY",
      name: "Liquidity",
      description: "Canonical category for cash flow finance contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-transaction",
      code: "FCAT-TRANSACTION",
      name: "Transaction",
      description: "Canonical category for invoice and payment finance contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-accountingstructure",
      code: "FCAT-ACCOUNTINGSTRUCTURE",
      name: "AccountingStructure",
      description: "Canonical category for account and currency finance contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-financialposition",
      code: "FCAT-FINANCIALPOSITION",
      name: "FinancialPosition",
      description: "Canonical category for asset, liability, equity, and profit contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-reportingperiod",
      code: "FCAT-REPORTINGPERIOD",
      name: "ReportingPeriod",
      description: "Canonical category for financial period contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
    Object.freeze({
      id: "finance-category-statement",
      code: "FCAT-STATEMENT",
      name: "Statement",
      description: "Canonical category for financial statement contracts.",
      sourcePhase: "BUS-28:2",
      metadataOnly: true,
      immutable: true,
    }),
  ]),
  metadataOnly: true,
  immutable: true,
});

export function getFinanceCategoryRegistry(): FinanceCategoryRegistryContract {
  return FinanceCategoryRegistry;
}
