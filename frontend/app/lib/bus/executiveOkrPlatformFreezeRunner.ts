import { runExecutiveOkrPlatformCertification } from "./executiveOkrPlatformCertification.ts";
import { buildExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeManifest.ts";
import { runExecutiveOkrPlatformRegression } from "./executiveOkrPlatformRegression.ts";
import type { ExecutiveOkrPlatformFreezeState } from "./executiveOkrPlatformFreezeTypes.ts";

export function runExecutiveOkrPlatformFreeze(): ExecutiveOkrPlatformFreezeState {
  const manifest = buildExecutiveOkrPlatformFreezeManifest();
  const certification = runExecutiveOkrPlatformCertification();
  const regression = runExecutiveOkrPlatformRegression();
  const status = certification.status === "PASS" && regression.status === "PASS" ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    finalState: status === "PASS" ? "Certified Frozen Released" : "Certification Failed",
    manifest,
    certification,
    regression,
    frozenPhaseIds: Object.freeze(manifest.phaseRegistry.filter((phase) => phase.phaseId !== "BUS-16").map((phase) => phase.phaseId)),
    publicApis: Object.freeze(manifest.publicApiRegistry.map((api) => api.apiName)),
    metadataOnly: true,
    immutable: true,
  });
}

export function getExecutiveOkrPlatformFreezeState(): ExecutiveOkrPlatformFreezeState {
  return runExecutiveOkrPlatformFreeze();
}
