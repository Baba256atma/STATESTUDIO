import { runExecutiveKpiPlatformCertification } from "./executiveKpiPlatformCertification.ts";
import { buildExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeManifest.ts";
import type { ExecutiveKpiPlatformFreezeState } from "./executiveKpiPlatformFreezeTypes.ts";
import { runExecutiveKpiPlatformRegression } from "./executiveKpiPlatformRegression.ts";

export function runExecutiveKpiPlatformFreeze(): ExecutiveKpiPlatformFreezeState {
  const manifest = buildExecutiveKpiPlatformFreezeManifest();
  const certification = runExecutiveKpiPlatformCertification();
  const regression = runExecutiveKpiPlatformRegression();
  const status = certification.status === "PASS" && regression.status === "PASS" ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    finalState: status === "PASS" ? "Certified Frozen Released" : "Certification Failed",
    manifest,
    certification,
    regression,
    frozenPhaseIds: Object.freeze(manifest.phaseRegistry.filter((phase) => phase.phaseId !== "BUS-12").map((phase) => phase.phaseId)),
    publicApis: Object.freeze(manifest.publicApiRegistry.map((api) => api.apiName)),
    metadataOnly: true,
    immutable: true,
  });
}

export function getExecutiveKpiPlatformFreezeState(): ExecutiveKpiPlatformFreezeState {
  return runExecutiveKpiPlatformFreeze();
}
