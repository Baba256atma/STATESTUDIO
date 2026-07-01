import { runIdentityPlatformCertification } from "./identityPlatformCertification.ts";
import type { IdentityPlatformFreezeState } from "./identityPlatformFreezeTypes.ts";

export function runIdentityPlatformFreeze(): IdentityPlatformFreezeState {
  const certification = runIdentityPlatformCertification();
  return Object.freeze({
    status: certification.status,
    frozen: true,
    released: true,
    manifest: certification.manifest,
    certification,
  });
}

export function getIdentityPlatformFreezeState(): IdentityPlatformFreezeState {
  return runIdentityPlatformFreeze();
}
