export type {
  TenantPlatformCertificationReference,
  TenantPlatformCompatibilityMatrix,
  TenantPlatformExtensionPolicy,
  TenantPlatformFreeze,
  TenantPlatformFreezeManifest,
  TenantPlatformFreezeState,
  TenantPlatformRegressionSummary,
  TenantPlatformRelease,
} from "./coreTenantPlatformFreezeTypes.ts";

export {
  CORE_TENANT_PLATFORM_DEPENDENCY_REGISTRY,
  CORE_TENANT_PLATFORM_PHASE_REGISTRY,
  CORE_TENANT_PLATFORM_PUBLIC_API_REGISTRY,
} from "./coreTenantPlatformFreezeRegistry.ts";
export {
  CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX,
  CORE_TENANT_PLATFORM_EXTENSION_POLICY,
  getExecutiveTenantCompatibilityMatrix,
  getExecutiveTenantExtensionPolicy,
} from "./coreTenantPlatformCompatibility.ts";
export { buildExecutiveTenantPlatformFreezeManifest } from "./coreTenantPlatformFreezeManifest.ts";
export { getExecutiveTenantPlatformState, runExecutiveTenantPlatformFreeze } from "./coreTenantPlatformFreezeRunner.ts";

import { buildExecutiveTenantPlatformFreezeManifest } from "./coreTenantPlatformFreezeManifest.ts";
import { getExecutiveTenantCompatibilityMatrix, getExecutiveTenantExtensionPolicy } from "./coreTenantPlatformCompatibility.ts";
import { getExecutiveTenantPlatformState, runExecutiveTenantPlatformFreeze } from "./coreTenantPlatformFreezeRunner.ts";

export const ExecutiveTenantPlatformFreeze = Object.freeze({
  buildExecutiveTenantPlatformFreezeManifest,
  runExecutiveTenantPlatformFreeze,
  getExecutiveTenantPlatformState,
  getExecutiveTenantCompatibilityMatrix,
  getExecutiveTenantExtensionPolicy,
});

