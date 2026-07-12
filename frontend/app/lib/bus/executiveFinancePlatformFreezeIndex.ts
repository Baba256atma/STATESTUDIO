export type * from "./executiveFinancePlatformFreezeTypes.ts";
export { ExecutiveFinancePlatformFreezeRegistry } from "./executiveFinancePlatformFreezeRegistry.ts";
export { ExecutiveFinancePlatformCompatibility } from "./executiveFinancePlatformCompatibility.ts";
export { ExecutiveFinancePlatformRegression } from "./executiveFinancePlatformRegression.ts";
export { getExecutiveFinancePlatformFreezeManifest } from "./executiveFinancePlatformFreezeManifest.ts";
export {
  buildExecutiveFinancePlatformFreeze,
  runExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreeze,
} from "./executiveFinancePlatformFreezeRunner.ts";
export { ExecutiveFinancePlatformFreeze } from "./executiveFinancePlatformFreeze.ts";

import { ExecutiveFinancePlatformFreezeRegistry } from "./executiveFinancePlatformFreezeRegistry.ts";
import { ExecutiveFinancePlatformCompatibility } from "./executiveFinancePlatformCompatibility.ts";
import { ExecutiveFinancePlatformRegression } from "./executiveFinancePlatformRegression.ts";
import { getExecutiveFinancePlatformFreezeManifest } from "./executiveFinancePlatformFreezeManifest.ts";
import {
  buildExecutiveFinancePlatformFreeze,
  runExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreeze,
} from "./executiveFinancePlatformFreezeRunner.ts";
import { ExecutiveFinancePlatformFreeze } from "./executiveFinancePlatformFreeze.ts";

export const ExecutiveFinancePlatformFreezeFoundation = Object.freeze({
  registry: ExecutiveFinancePlatformFreezeRegistry,
  compatibility: ExecutiveFinancePlatformCompatibility,
  manifest: Object.freeze({
    getExecutiveFinancePlatformFreezeManifest,
  }),
  regression: ExecutiveFinancePlatformRegression,
  runner: Object.freeze({
    buildExecutiveFinancePlatformFreeze,
    runExecutiveFinancePlatformFreeze,
    getExecutiveFinancePlatformFreeze,
  }),
  freeze: ExecutiveFinancePlatformFreeze,
  metadataOnly: true,
  immutable: true,
});
