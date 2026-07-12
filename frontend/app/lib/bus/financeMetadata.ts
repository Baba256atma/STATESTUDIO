import { FinanceApi } from "./financeApi.ts";
import type { FinanceMetadata as FinanceMetadataContract } from "./financeTypes.ts";

export const FinanceMetadata: FinanceMetadataContract = Object.freeze({
  moduleName: "finance-contracts",
  version: "1.0.0",
  contractVersion: "1.0.0",
  publicApis: Object.freeze(FinanceApi.map((api) => api.apiName)),
  supportedConsumers: Object.freeze([
    "BUS-28:2 Financial Registry",
    "BUS-28:3 Financial Model",
    "BUS-28:4 Financial Validation",
    "BUS-28:5 Financial Manifest",
    "BUS-28:6 Financial Platform",
    "BUS-28:7 Financial Certification",
    "BUS-28:8 Financial Freeze",
    "BUS-28:9 Financial Public Index",
  ] as const),
  architectureLayer: "BUS",
  certificationState: "BUS-28:1 Foundation",
  metadataOnly: true,
  immutable: true,
});

export function getFinanceMetadata(): FinanceMetadataContract {
  return FinanceMetadata;
}
