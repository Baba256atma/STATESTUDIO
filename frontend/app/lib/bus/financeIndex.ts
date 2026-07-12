export {
  FinanceContracts,
  getFinanceContracts,
} from "./financeContracts.ts";
export {
  CURRENCY_TYPES,
  FINANCIAL_OBJECT_TYPES,
  FINANCIAL_PERIOD_TYPES,
  FINANCIAL_STATUSES,
  FINANCIAL_VISIBILITIES,
  FinanceEnums,
} from "./financeEnums.ts";
export { FinanceIdentity, getFinanceIdentity } from "./financeIdentity.ts";
export { FinanceMetadata, getFinanceMetadata } from "./financeMetadata.ts";
export { FinanceApi, getFinancePublicApi } from "./financeApi.ts";
export type {
  CurrencyType,
  FinanceContractSummary,
  FinanceIdentity as FinanceIdentityContract,
  FinanceMetadata as FinanceMetadataContract,
  FinancePlatformCode,
  FinancePlatformId,
  FinancePlatformName,
  FinancePlatformStage,
  FinancePlatformVersion,
  FinancialAccount,
  FinancialApiDescriptor,
  FinancialCurrency,
  FinancialObject,
  FinancialObjectType,
  FinancialPeriod,
  FinancialPeriodType,
  FinancialStatement,
  FinancialStatus,
  FinancialVisibility,
} from "./financeTypes.ts";

import { FinanceApi, getFinancePublicApi } from "./financeApi.ts";
import { FinanceContracts, getFinanceContracts } from "./financeContracts.ts";
import { FinanceEnums } from "./financeEnums.ts";
import { FinanceIdentity, getFinanceIdentity } from "./financeIdentity.ts";
import { FinanceMetadata, getFinanceMetadata } from "./financeMetadata.ts";

export const ExecutiveFinancePlatformFoundation = Object.freeze({
  FinanceContracts,
  FinanceIdentity,
  FinanceMetadata,
  FinanceEnums,
  FinanceApi,
  getFinanceContracts,
  getFinanceIdentity,
  getFinanceMetadata,
  getFinancePublicApi,
  metadataOnly: true,
  immutable: true,
});
