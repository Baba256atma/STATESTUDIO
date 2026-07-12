export type * from "./financeManifestTypes.ts";
export { FinanceCompatibility, getFinanceCompatibility } from "./financeCompatibility.ts";
export { FinanceDependencyMatrix, getFinanceDependencyMatrix } from "./financeDependencyMatrix.ts";
export { FinanceExtensionPolicy, getFinanceExtensionPolicy } from "./financeExtensionPolicy.ts";
export { FinanceManifest, buildFinanceManifest, getFinanceManifest } from "./financeManifest.ts";

import { FinanceCompatibility, getFinanceCompatibility } from "./financeCompatibility.ts";
import { FinanceDependencyMatrix, getFinanceDependencyMatrix } from "./financeDependencyMatrix.ts";
import { FinanceExtensionPolicy, getFinanceExtensionPolicy } from "./financeExtensionPolicy.ts";
import { FinanceManifest, buildFinanceManifest, getFinanceManifest } from "./financeManifest.ts";

export const ExecutiveFinanceManifestFoundation = Object.freeze({
  FinanceManifest,
  FinanceCompatibility,
  FinanceDependencyMatrix,
  FinanceExtensionPolicy,
  buildFinanceManifest,
  getFinanceManifest,
  getFinanceCompatibility,
  getFinanceDependencyMatrix,
  getFinanceExtensionPolicy,
  metadataOnly: true,
  immutable: true,
});
