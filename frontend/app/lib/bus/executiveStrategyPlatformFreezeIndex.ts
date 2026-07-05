export type * from "./executiveStrategyPlatformFreezeTypes.ts";
export { getExecutiveStrategyPlatformCompatibilityMatrix } from "./executiveStrategyPlatformCompatibility.ts";
export {
  EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  EXECUTIVE_STRATEGY_PLATFORM_PHASES,
  EXECUTIVE_STRATEGY_PLATFORM_RELEASE_METADATA,
  EXECUTIVE_STRATEGY_PLATFORM_CONSUMERS,
  getExecutiveStrategyPlatformExtensionPolicy,
  listExecutiveStrategyPlatformDependencies,
  listExecutiveStrategyPlatformPhases,
  listExecutiveStrategyPlatformPublicApis,
} from "./executiveStrategyPlatformFreezeRegistry.ts";
export { buildExecutiveStrategyPlatformFreezeManifest } from "./executiveStrategyPlatformFreezeManifest.ts";
export { runExecutiveStrategyPlatformCertification } from "./executiveStrategyPlatformCertification.ts";
export { runExecutiveStrategyPlatformRegression } from "./executiveStrategyPlatformRegression.ts";
export { getExecutiveStrategyPlatformFreezeState, runExecutiveStrategyPlatformFreeze } from "./executiveStrategyPlatformFreezeRunner.ts";

import { buildExecutiveStrategyPlatformFreezeManifest } from "./executiveStrategyPlatformFreezeManifest.ts";
import { getExecutiveStrategyPlatformCompatibilityMatrix } from "./executiveStrategyPlatformCompatibility.ts";
import { runExecutiveStrategyPlatformCertification } from "./executiveStrategyPlatformCertification.ts";
import { getExecutiveStrategyPlatformExtensionPolicy, listExecutiveStrategyPlatformPhases, listExecutiveStrategyPlatformPublicApis } from "./executiveStrategyPlatformFreezeRegistry.ts";
import { getExecutiveStrategyPlatformFreezeState, runExecutiveStrategyPlatformFreeze } from "./executiveStrategyPlatformFreezeRunner.ts";
import { runExecutiveStrategyPlatformRegression } from "./executiveStrategyPlatformRegression.ts";

export const ExecutiveStrategyPlatformFreeze = Object.freeze({
  buildExecutiveStrategyPlatformFreezeManifest,
  runExecutiveStrategyPlatformCertification,
  runExecutiveStrategyPlatformRegression,
  runExecutiveStrategyPlatformFreeze,
  getExecutiveStrategyPlatformFreezeState,
  listExecutiveStrategyPlatformPhases,
  listExecutiveStrategyPlatformPublicApis,
  getExecutiveStrategyPlatformCompatibilityMatrix,
  getExecutiveStrategyPlatformExtensionPolicy,
});
