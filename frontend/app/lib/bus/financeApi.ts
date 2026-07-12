import type { FinancialApiDescriptor } from "./financeTypes.ts";

export const FinanceApi = Object.freeze([
  Object.freeze({
    apiName: "getFinanceIdentity",
    returnType: "metadata",
    stable: true,
    runtimeBehavior: false,
  }),
  Object.freeze({
    apiName: "getFinanceMetadata",
    returnType: "metadata",
    stable: true,
    runtimeBehavior: false,
  }),
  Object.freeze({
    apiName: "getFinancePublicApi",
    returnType: "metadata",
    stable: true,
    runtimeBehavior: false,
  }),
  Object.freeze({
    apiName: "getFinanceContracts",
    returnType: "metadata",
    stable: true,
    runtimeBehavior: false,
  }),
] as const satisfies readonly FinancialApiDescriptor[]);

export function getFinancePublicApi(): readonly FinancialApiDescriptor[] {
  return FinanceApi;
}
