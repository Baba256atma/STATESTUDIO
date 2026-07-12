import {
  CURRENCY_TYPES,
  FINANCIAL_OBJECT_TYPES,
  FINANCIAL_PERIOD_TYPES,
  FINANCIAL_STATUSES,
  FINANCIAL_VISIBILITIES,
} from "./financeEnums.ts";
import type { FinanceContractSummary } from "./financeTypes.ts";

export type * from "./financeTypes.ts";

export const FinanceContracts: FinanceContractSummary = Object.freeze({
  contractLayer: "BUS-28:1",
  objectTypes: FINANCIAL_OBJECT_TYPES,
  statuses: FINANCIAL_STATUSES,
  periodTypes: FINANCIAL_PERIOD_TYPES,
  currencyTypes: CURRENCY_TYPES,
  visibilities: FINANCIAL_VISIBILITIES,
  metadataOnly: true,
  immutable: true,
});

export function getFinanceContracts(): FinanceContractSummary {
  return FinanceContracts;
}
