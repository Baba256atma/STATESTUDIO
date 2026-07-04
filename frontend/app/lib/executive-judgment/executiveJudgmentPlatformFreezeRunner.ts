import { buildExecutiveJudgmentPlatformFreezeManifest } from "./executiveJudgmentPlatformFreezeManifest.ts";
import { runExecutiveJudgmentPlatformCertification } from "./executiveJudgmentPlatformCertification.ts";
import { runExecutiveJudgmentPlatformRegression } from "./executiveJudgmentPlatformRegression.ts";
import type { ExecutiveJudgmentPlatformFreezeState } from "./executiveJudgmentPlatformFreezeTypes.ts";

export function runExecutiveJudgmentPlatformFreeze(): ExecutiveJudgmentPlatformFreezeState {
  const manifest = buildExecutiveJudgmentPlatformFreezeManifest();
  const certification = runExecutiveJudgmentPlatformCertification();
  const regression = runExecutiveJudgmentPlatformRegression();
  const status = certification.status === "PASS" && regression.status === "PASS" ? "PASS" : "FAIL";

  return Object.freeze({
    status,
    manifest,
    certification,
    regression,
    declaration: "CERTIFIED_FROZEN_RELEASED",
    metadataOnly: true,
  });
}

export function getExecutiveJudgmentPlatformFreezeState(): ExecutiveJudgmentPlatformFreezeState {
  return runExecutiveJudgmentPlatformFreeze();
}
