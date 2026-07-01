import { getIdentityPlatformCompatibilityMatrix, getIdentityPlatformExtensionPolicy } from "./identityPlatformCompatibility.ts";
import { listIdentityPlatformPhases, listIdentityPlatformPublicApis } from "./identityPlatformFreezeRegistry.ts";
import { runIdentityPlatformRegression } from "./identityPlatformRegression.ts";
import {
  IDENTITY_PLATFORM_FREEZE_CONTRACT_VERSION,
  type IdentityPlatformFreezeManifest,
} from "./identityPlatformFreezeTypes.ts";

export function buildIdentityPlatformFreezeManifest(): IdentityPlatformFreezeManifest {
  const phases = listIdentityPlatformPhases();
  const publicApis = listIdentityPlatformPublicApis();
  const compatibilityMatrix = getIdentityPlatformCompatibilityMatrix();
  const extensionPolicy = getIdentityPlatformExtensionPolicy();
  const regression = runIdentityPlatformRegression();

  return Object.freeze({
    contractVersion: IDENTITY_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: "nexora-identity-platform",
    releaseId: "nexora-identity-platform-idn-10",
    declaration: "The Nexora Identity Platform is Certified, Frozen, and Released.",
    phases,
    publicApis,
    compatibilityMatrix,
    extensionPolicy,
    regression,
    frozen: true,
    consumerSafe:
      phases.every((phase) => phase.certified && phase.frozen) &&
      publicApis.every((api) => api.available) &&
      compatibilityMatrix.every((entry) => entry.compatible) &&
      regression.failed === 0,
  });
}
