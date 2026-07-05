import { runExecutiveStrategyPlatformCertification } from "./executiveStrategyPlatformCertification.ts";
import { buildExecutiveStrategyPlatformFreezeManifest } from "./executiveStrategyPlatformFreezeManifest.ts";
import type { ExecutiveStrategyPlatformFreezeState } from "./executiveStrategyPlatformFreezeTypes.ts";
import { runExecutiveStrategyPlatformRegression } from "./executiveStrategyPlatformRegression.ts";

export function runExecutiveStrategyPlatformFreeze(): ExecutiveStrategyPlatformFreezeState {
  const manifest = buildExecutiveStrategyPlatformFreezeManifest();
  const certification = runExecutiveStrategyPlatformCertification();
  const regression = runExecutiveStrategyPlatformRegression();
  const status = certification.status === "PASS" && regression.status === "PASS" ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    finalState: status === "PASS" ? "Certified Frozen Released" : "Certification Failed",
    manifest,
    certification,
    regression,
    frozenPhaseIds: Object.freeze(manifest.phaseRegistry.filter((phase) => phase.phaseId !== "BUS-26").map((phase) => phase.phaseId)),
    publicApis: Object.freeze(manifest.publicApiRegistry.map((api) => api.apiName)),
    metadataOnly: true,
    immutable: true,
  });
}

export function getExecutiveStrategyPlatformFreezeState(): ExecutiveStrategyPlatformFreezeState {
  return runExecutiveStrategyPlatformFreeze();
}
