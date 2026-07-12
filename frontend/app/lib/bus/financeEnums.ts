import type {
  CurrencyType,
  FinancialObjectType,
  FinancialPeriodType,
  FinancialStatus,
  FinancialVisibility,
} from "./financeTypes.ts";

export const FINANCIAL_OBJECT_TYPES: readonly FinancialObjectType[] = Object.freeze([
  "Revenue",
  "Expense",
  "Cost",
  "Profit",
  "Budget",
  "Forecast",
  "CashFlow",
  "Invoice",
  "Payment",
  "Account",
  "Currency",
  "Asset",
  "Liability",
  "Equity",
  "FinancialPeriod",
  "FinancialStatement",
] as const);

export const FINANCIAL_STATUSES: readonly FinancialStatus[] = Object.freeze([
  "Draft",
  "Active",
  "Frozen",
  "Archived",
] as const);

export const FINANCIAL_PERIOD_TYPES: readonly FinancialPeriodType[] = Object.freeze([
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const);

export const CURRENCY_TYPES: readonly CurrencyType[] = Object.freeze(["ISO4217"] as const);

export const FINANCIAL_VISIBILITIES: readonly FinancialVisibility[] = Object.freeze([
  "Internal",
  "Public",
  "Restricted",
] as const);

export const FinanceEnums = Object.freeze({
  FINANCIAL_OBJECT_TYPES,
  FINANCIAL_STATUSES,
  FINANCIAL_PERIOD_TYPES,
  CURRENCY_TYPES,
  FINANCIAL_VISIBILITIES,
  metadataOnly: true,
  immutable: true,
});
