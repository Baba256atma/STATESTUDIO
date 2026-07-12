export type * from "./financeRegistryTypes.ts";
export {
  FinanceObjectRegistry,
  findFinanceObjectByCode,
  findFinanceObjectsByCategory,
  getFinanceObjectRegistry,
} from "./financeObjectRegistry.ts";
export {
  FinanceCategoryRegistry,
  getFinanceCategoryRegistry,
} from "./financeCategoryRegistry.ts";
export {
  FinanceApiRegistry,
  getFinanceApiRegistry,
} from "./financeApiRegistry.ts";
export { getFinanceRegistryManifest } from "./financeRegistryManifest.ts";

import { FinanceApiRegistry, getFinanceApiRegistry } from "./financeApiRegistry.ts";
import { FinanceCategoryRegistry, getFinanceCategoryRegistry } from "./financeCategoryRegistry.ts";
import {
  FinanceObjectRegistry,
  findFinanceObjectByCode,
  findFinanceObjectsByCategory,
  getFinanceObjectRegistry,
} from "./financeObjectRegistry.ts";
import { getFinanceRegistryManifest } from "./financeRegistryManifest.ts";

export const ExecutiveFinanceRegistryFoundation = Object.freeze({
  FinanceObjectRegistry,
  FinanceCategoryRegistry,
  FinanceApiRegistry,
  getFinanceObjectRegistry,
  getFinanceCategoryRegistry,
  getFinanceApiRegistry,
  getFinanceRegistryManifest,
  findFinanceObjectByCode,
  findFinanceObjectsByCategory,
  metadataOnly: true,
  immutable: true,
});
