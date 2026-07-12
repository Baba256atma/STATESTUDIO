export type * from "./financeValidationTypes.ts";
export {
  buildFinanceValidationRegistry,
  buildFinanceValidationSummary,
  hasDuplicateFinanceValidationIds,
} from "./financeValidationRegistry.ts";
export { FINANCE_VALIDATION_RULES, createFinanceValidationEntry } from "./financeValidationRules.ts";
export { runFinanceValidation, getFinanceValidation } from "./financeValidationRunner.ts";
export { getFinanceValidationManifest } from "./financeValidationManifest.ts";

import {
  buildFinanceValidationRegistry,
  buildFinanceValidationSummary,
  hasDuplicateFinanceValidationIds,
} from "./financeValidationRegistry.ts";
import { FINANCE_VALIDATION_RULES, createFinanceValidationEntry } from "./financeValidationRules.ts";
import { getFinanceValidationManifest } from "./financeValidationManifest.ts";
import { getFinanceValidation, runFinanceValidation } from "./financeValidationRunner.ts";

export const ExecutiveFinanceValidationFoundation = Object.freeze({
  FINANCE_VALIDATION_RULES,
  createFinanceValidationEntry,
  buildFinanceValidationRegistry,
  buildFinanceValidationSummary,
  hasDuplicateFinanceValidationIds,
  runFinanceValidation,
  getFinanceValidation,
  getFinanceValidationManifest,
  metadataOnly: true,
  immutable: true,
});
