import { ExecutiveFinancePlatformFreezeRegistry } from "./executiveFinancePlatformFreezeRegistry.ts";
import { ExecutiveFinancePlatformCompatibility } from "./executiveFinancePlatformCompatibility.ts";
import { ExecutiveFinancePlatformRegression } from "./executiveFinancePlatformRegression.ts";
import { getExecutiveFinancePlatformFreezeManifest } from "./executiveFinancePlatformFreezeManifest.ts";
import type { ExecutiveFinancePlatformFreezeResult } from "./executiveFinancePlatformFreezeTypes.ts";

export function buildExecutiveFinancePlatformFreeze(): ExecutiveFinancePlatformFreezeResult {
  return Object.freeze({
    registry: ExecutiveFinancePlatformFreezeRegistry,
    compatibility: ExecutiveFinancePlatformCompatibility,
    regression: ExecutiveFinancePlatformRegression,
    manifest: getExecutiveFinancePlatformFreezeManifest(),
    frozen: true,
    metadataOnly: true,
    immutable: true,
  });
}

export function runExecutiveFinancePlatformFreeze(): ExecutiveFinancePlatformFreezeResult {
  return buildExecutiveFinancePlatformFreeze();
}

export function getExecutiveFinancePlatformFreeze(): ExecutiveFinancePlatformFreezeResult {
  return buildExecutiveFinancePlatformFreeze();
}
