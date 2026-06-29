/**
 * APP-1:10 — Executive Time Platform Certification Runner.
 * Orchestrates regression, final certification, and freeze manifest generation.
 */

import {
  buildExecutiveTimePlatformFreezeManifest,
  EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION,
} from "./executiveTimePlatformFreezeManifest.ts";
import {
  runExecutiveTimePlatformFinalCertification,
  EXECUTIVE_TIME_PLATFORM_FINAL_TAGS,
} from "./executiveTimePlatformFinalCertification.ts";
import { runExecutiveTimePlatformRegression } from "./executiveTimePlatformRegression.ts";

export type ExecutiveTimePlatformCertificationRunResult = Readonly<{
  freezeVersion: typeof EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION;
  certified: boolean;
  released: boolean;
  status: "PASS" | "FAIL";
  regressionStatus: "PASS" | "FAIL";
  summary: string;
  tags: readonly string[];
  freezeManifest: ReturnType<typeof buildExecutiveTimePlatformFreezeManifest>;
  finalCertification: ReturnType<typeof runExecutiveTimePlatformFinalCertification>;
}>;

export function runExecutiveTimePlatformCertificationSuite(): ExecutiveTimePlatformCertificationRunResult {
  const finalCertification = runExecutiveTimePlatformFinalCertification();
  return Object.freeze({
    freezeVersion: EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION,
    certified: finalCertification.certified,
    released: finalCertification.released,
    status: finalCertification.status,
    regressionStatus: finalCertification.regression.status,
    summary: finalCertification.summary,
    tags: EXECUTIVE_TIME_PLATFORM_FINAL_TAGS,
    freezeManifest: finalCertification.freezeManifest,
    finalCertification,
  });
}

export function runExecutiveTimePlatformRegressionOnly() {
  return runExecutiveTimePlatformRegression();
}

export const ExecutiveTimePlatformCertificationRunner = Object.freeze({
  runExecutiveTimePlatformCertificationSuite,
  runExecutiveTimePlatformFinalCertification,
  runExecutiveTimePlatformRegressionOnly,
  buildExecutiveTimePlatformFreezeManifest,
});

export {
  runExecutiveTimePlatformFinalCertification,
  runExecutiveTimePlatformRegression,
  buildExecutiveTimePlatformFreezeManifest,
};
