import { buildExecutiveTenantPlatformFreezeManifest } from "./coreTenantPlatformFreezeManifest.ts";
import type { TenantPlatformFreeze, TenantPlatformFreezeState } from "./coreTenantPlatformFreezeTypes.ts";

export function runExecutiveTenantPlatformFreeze(): TenantPlatformFreeze {
  return Object.freeze({
    manifest: buildExecutiveTenantPlatformFreezeManifest(),
    metadataOnly: true,
    immutable: true,
  });
}

export function getExecutiveTenantPlatformState(): TenantPlatformFreezeState {
  return runExecutiveTenantPlatformFreeze().manifest.freezeState;
}

