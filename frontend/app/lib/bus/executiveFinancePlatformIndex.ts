export type * from "./executiveFinancePlatformTypes.ts";
export { ExecutiveFinancePlatformRegistry } from "./executiveFinancePlatformRegistry.ts";
export {
  buildExecutiveFinancePlatform,
  getExecutiveFinancePlatform,
  runExecutiveFinancePlatform,
} from "./executiveFinancePlatformRunner.ts";
export { getExecutiveFinancePlatformManifest } from "./executiveFinancePlatformManifest.ts";
export { ExecutiveFinancePlatform } from "./executiveFinancePlatform.ts";

import { ExecutiveFinancePlatformFoundation as ExecutiveFinanceContractsFoundation } from "./financeIndex.ts";
import { ExecutiveFinanceRegistryFoundation } from "./financeRegistryIndex.ts";
import { ExecutiveFinanceManifestFoundation } from "./financeManifestIndex.ts";
import { ExecutiveFinanceModelFoundation } from "./financeModelIndex.ts";
import { ExecutiveFinanceValidationFoundation } from "./financeValidationIndex.ts";
import { ExecutiveFinancePlatform } from "./executiveFinancePlatform.ts";
import { ExecutiveFinancePlatformRegistry } from "./executiveFinancePlatformRegistry.ts";
import {
  buildExecutiveFinancePlatform,
  getExecutiveFinancePlatform,
  runExecutiveFinancePlatform,
} from "./executiveFinancePlatformRunner.ts";
import { getExecutiveFinancePlatformManifest } from "./executiveFinancePlatformManifest.ts";

export const ExecutiveFinancePlatformFoundation = Object.freeze({
  contracts: ExecutiveFinanceContractsFoundation,
  registry: ExecutiveFinanceRegistryFoundation,
  model: ExecutiveFinanceModelFoundation,
  validation: ExecutiveFinanceValidationFoundation,
  manifest: ExecutiveFinanceManifestFoundation,
  platform: ExecutiveFinancePlatform,
  ExecutiveFinancePlatformRegistry,
  buildExecutiveFinancePlatform,
  runExecutiveFinancePlatform,
  getExecutiveFinancePlatform,
  getExecutiveFinancePlatformManifest,
  metadataOnly: true,
  immutable: true,
});
