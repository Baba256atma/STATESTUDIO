import type { TenantPlatformCompatibilityMatrix, TenantPlatformExtensionPolicy } from "./coreTenantPlatformFreezeTypes.ts";

export const CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX: readonly TenantPlatformCompatibilityMatrix[] = Object.freeze([
  Object.freeze({ platformId: "CORE", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "LAY", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "DS", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "INT", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "APP", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "BUS", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "OPS", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "EVE", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "STE", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "DOM", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "ASS", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "SMM", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "IDN", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
  Object.freeze({ platformId: "KNL", compatible: true, publicApiOnly: true, metadataOnly: true, immutable: true }),
] as const);

export const CORE_TENANT_PLATFORM_EXTENSION_POLICY: TenantPlatformExtensionPolicy = Object.freeze({
  policyId: "core-tenant-platform-extension-policy",
  publicApiConsumptionOnly: true,
  runtimeExecutionAllowed: false,
  runtimeIsolationAllowed: false,
  tenantSwitchingAllowed: false,
  authenticationAllowed: false,
  persistenceAllowed: false,
  metadataOnly: true,
  immutable: true,
});

export function getExecutiveTenantCompatibilityMatrix(): readonly TenantPlatformCompatibilityMatrix[] {
  return CORE_TENANT_PLATFORM_COMPATIBILITY_MATRIX;
}

export function getExecutiveTenantExtensionPolicy(): TenantPlatformExtensionPolicy {
  return CORE_TENANT_PLATFORM_EXTENSION_POLICY;
}

