import {
  buildExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreeze,
  runExecutiveFinancePlatformFreeze,
} from "./executiveFinancePlatformFreezeRunner.ts";
import { ExecutiveFinancePlatformFreezeRegistry } from "./executiveFinancePlatformFreezeRegistry.ts";
import { ExecutiveFinancePlatformCompatibility } from "./executiveFinancePlatformCompatibility.ts";
import { ExecutiveFinancePlatformRegression } from "./executiveFinancePlatformRegression.ts";
import { getExecutiveFinancePlatformFreezeManifest } from "./executiveFinancePlatformFreezeManifest.ts";

export const ExecutiveFinancePlatformFreeze = Object.freeze({
  ExecutiveFinancePlatformFreezeRegistry,
  ExecutiveFinancePlatformCompatibility,
  ExecutiveFinancePlatformRegression,
  getExecutiveFinancePlatformFreezeManifest,
  buildExecutiveFinancePlatformFreeze,
  runExecutiveFinancePlatformFreeze,
  getExecutiveFinancePlatformFreeze,
});
