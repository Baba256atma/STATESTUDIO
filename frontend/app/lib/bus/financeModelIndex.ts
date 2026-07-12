export type * from "./financeModelTypes.ts";
export { FinanceModelRegistry, getFinanceModel } from "./financeModelRegistry.ts";
export {
  FinanceRelationshipRegistry,
  getFinanceRelationships,
} from "./financeRelationshipRegistry.ts";
export { FinanceOwnershipRegistry, getFinanceOwnership } from "./financeOwnershipRegistry.ts";
export {
  FinanceAggregationRegistry,
  getFinanceAggregations,
} from "./financeAggregationRegistry.ts";
export {
  FinanceDependencyRegistry,
  getFinanceDependencies,
} from "./financeDependencyRegistry.ts";
export { getFinanceModelManifest } from "./financeModelManifest.ts";

import { FinanceAggregationRegistry, getFinanceAggregations } from "./financeAggregationRegistry.ts";
import { FinanceDependencyRegistry, getFinanceDependencies } from "./financeDependencyRegistry.ts";
import { FinanceModelRegistry, getFinanceModel } from "./financeModelRegistry.ts";
import { getFinanceModelManifest } from "./financeModelManifest.ts";
import { FinanceOwnershipRegistry, getFinanceOwnership } from "./financeOwnershipRegistry.ts";
import {
  FinanceRelationshipRegistry,
  getFinanceRelationships,
} from "./financeRelationshipRegistry.ts";

export const ExecutiveFinanceModelFoundation = Object.freeze({
  FinanceModelRegistry,
  FinanceRelationshipRegistry,
  FinanceOwnershipRegistry,
  FinanceAggregationRegistry,
  FinanceDependencyRegistry,
  getFinanceModel,
  getFinanceRelationships,
  getFinanceOwnership,
  getFinanceAggregations,
  getFinanceDependencies,
  getFinanceModelManifest,
  metadataOnly: true,
  immutable: true,
});
