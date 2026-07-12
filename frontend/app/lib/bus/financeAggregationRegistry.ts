import type {
  FinanceAggregationEntry,
  FinanceAggregationRegistry as FinanceAggregationRegistryContract,
} from "./financeModelTypes.ts";

const FINANCE_AGGREGATION_ENTRIES: readonly FinanceAggregationEntry[] = Object.freeze([
  Object.freeze({
    aggregationId: "finance-aggregation-profit",
    aggregate: "Profit",
    aggregates: Object.freeze(["Revenue", "Expense"] as const),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    aggregationId: "finance-aggregation-financialstatement",
    aggregate: "FinancialStatement",
    aggregates: Object.freeze(["Assets", "Liabilities", "Equity"] as const),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    aggregationId: "finance-aggregation-cashflow",
    aggregate: "CashFlow",
    aggregates: Object.freeze(["Payment"] as const),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const FinanceAggregationRegistry: FinanceAggregationRegistryContract = Object.freeze({
  registryId: "finance-aggregation-registry",
  version: "1.0.0",
  aggregations: FINANCE_AGGREGATION_ENTRIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceAggregations(): FinanceAggregationRegistryContract {
  return FinanceAggregationRegistry;
}
