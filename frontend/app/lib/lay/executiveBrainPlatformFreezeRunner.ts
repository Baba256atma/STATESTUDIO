import { runExecutiveBrainPlatformCertification } from "./executiveBrainPlatformCertification.ts";
import type { ExecutiveBrainFreezeResult } from "./executiveBrainPlatformFreezeTypes.ts";

export function runExecutiveBrainPlatformFreeze(): ExecutiveBrainFreezeResult {
  const certification = runExecutiveBrainPlatformCertification();
  return Object.freeze({
    status: certification.status,
    frozen: true,
    released: true,
    manifest: certification.manifest,
    certification,
  });
}

export function getExecutiveBrainPlatformState(): ExecutiveBrainFreezeResult {
  return runExecutiveBrainPlatformFreeze();
}
