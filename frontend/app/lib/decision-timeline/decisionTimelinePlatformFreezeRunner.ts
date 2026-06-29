/**
 * APP-6:12 — Decision Timeline Platform Freeze runner.
 */

import { runDecisionTimelinePlatformCertification } from "./decisionTimelinePlatformCertification.ts";
import type { DecisionTimelinePlatformCertificationResult } from "./decisionTimelinePlatformCertification.ts";
import { buildDecisionTimelinePlatformFreezeManifest } from "./decisionTimelinePlatformFreezeManifest.ts";
import type { DecisionTimelinePlatformFreezeManifest } from "./decisionTimelinePlatformFreezeManifest.ts";
import {
  DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_RELEASE_TAG,
  registerDecisionTimelinePlatformFreezeManifest,
  resetDecisionTimelinePlatformFreezeRegistryForTests,
} from "./decisionTimelinePlatformFreezeRegistry.ts";
import { validateDecisionTimelinePlatformFreeze } from "./decisionTimelinePlatformFreezeValidation.ts";
import type { DecisionTimelinePlatformFreezeValidationResult } from "./decisionTimelinePlatformFreezeValidation.ts";

export type DecisionTimelinePlatformFreezeRunResult = Readonly<{
  freezeVersion: typeof DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  certified: boolean;
  frozen: boolean;
  released: boolean;
  productionReady: boolean;
  releaseReady: boolean;
  status: "PASS" | "FAIL";
  summary: string;
  releaseTag: typeof DECISION_TIMELINE_PLATFORM_RELEASE_TAG;
  manifest: DecisionTimelinePlatformFreezeManifest | null;
  certification: DecisionTimelinePlatformCertificationResult;
  validation: DecisionTimelinePlatformFreezeValidationResult;
  readOnly: true;
}>;

let lastFreezeResult: DecisionTimelinePlatformFreezeRunResult | null = null;

export function runDecisionTimelinePlatformFreeze(
  timestamp: string = new Date().toISOString()
): DecisionTimelinePlatformFreezeRunResult {
  const certification = runDecisionTimelinePlatformCertification(timestamp);

  if (!certification.readyForFreeze || !certification.certified) {
    const validation = validateDecisionTimelinePlatformFreeze(certification, null);
    const result = Object.freeze({
      freezeVersion: DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
      certified: false,
      frozen: false,
      released: false,
      productionReady: false,
      releaseReady: false,
      status: "FAIL" as const,
      summary: "Platform freeze rejected: APP-6:11 certification is not ready for freeze.",
      releaseTag: DECISION_TIMELINE_PLATFORM_RELEASE_TAG,
      manifest: null,
      certification,
      validation,
      readOnly: true as const,
    });
    lastFreezeResult = result;
    return result;
  }

  const manifest = buildDecisionTimelinePlatformFreezeManifest(certification, timestamp);
  registerDecisionTimelinePlatformFreezeManifest(manifest);
  const validation = validateDecisionTimelinePlatformFreeze(certification, manifest);
  const success = validation.valid;

  const result = Object.freeze({
    freezeVersion: DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: success,
    frozen: success,
    released: success,
    productionReady: success,
    releaseReady: success,
    status: success ? ("PASS" as const) : ("FAIL" as const),
    summary: success
      ? "APP-6 Decision Timeline Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-6:12 Platform freeze FAILED (${validation.checks.filter((entry) => !entry.passed).length} gate(s)).`,
    releaseTag: DECISION_TIMELINE_PLATFORM_RELEASE_TAG,
    manifest,
    certification,
    validation,
    readOnly: true as const,
  });

  lastFreezeResult = result;
  return result;
}

export function getDecisionTimelinePlatformFreezeReport(): DecisionTimelinePlatformFreezeRunResult | null {
  return lastFreezeResult;
}

export function resetDecisionTimelinePlatformFreezeForTests(): void {
  lastFreezeResult = null;
  resetDecisionTimelinePlatformFreezeRegistryForTests();
}

export const DecisionTimelinePlatformFreezeRunner = Object.freeze({
  runDecisionTimelinePlatformFreeze,
  getDecisionTimelinePlatformFreezeReport,
  resetDecisionTimelinePlatformFreezeForTests,
});
