/**
 * APP-3.15.1 — Executive Intent Platform Refresh.
 * Administrative platform refresh orchestrator — no intelligence changes.
 */

import {
  buildExecutiveIntentPlatformRefreshManifest,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
  type ExecutiveIntentPlatformRefreshManifest,
} from "./executiveIntentPlatformRefreshManifest.ts";
import {
  runExecutiveIntentPlatformRefreshCertification,
  ExecutiveIntentPlatformRefreshCertification,
} from "./executiveIntentPlatformRefreshCertification.ts";
import {
  runExecutiveIntentPlatformRefreshRegression,
  ExecutiveIntentPlatformRefreshRegression,
} from "./executiveIntentPlatformRefreshRegression.ts";

export type PlatformRefreshSummary = Readonly<{
  summaryId: string;
  headline: string;
  passed: boolean;
  refreshVersion: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION;
  refreshStatus: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  regressionPassed: boolean;
  platformFreezePreserved: boolean;
  contextExtensionRegistered: boolean;
  timestamp: string;
  readOnly: true;
}>;

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

function deterministicId(prefix: string, payload: string): string {
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `${prefix}-${hash.toString(16).padStart(8, "0")}`;
}

export type ExecutiveIntentPlatformRefreshResult = Readonly<{
  refreshVersion: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION;
  certified: boolean;
  released: boolean;
  status: "PASS" | "FAIL";
  refreshStatus: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS;
  summary: PlatformRefreshSummary;
  tags: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS;
  refreshManifest: ExecutiveIntentPlatformRefreshManifest;
  certification: ReturnType<typeof runExecutiveIntentPlatformRefreshCertification>;
  readOnly: true;
}>;

export function getExecutiveIntentPlatformRefreshManifest(
  refreshDate: string = DEFAULT_TIME
): ExecutiveIntentPlatformRefreshManifest {
  return buildExecutiveIntentPlatformRefreshManifest(refreshDate);
}

export function buildPlatformRefreshSummary(input: Readonly<{
  certification: ReturnType<typeof runExecutiveIntentPlatformRefreshCertification>;
  timestamp: string;
}>): PlatformRefreshSummary {
  const passedChecks = input.certification.passedChecks.length;
  const failedChecks = input.certification.failedChecks.length;
  const passed = input.certification.certified;
  return Object.freeze({
    summaryId: deterministicId("platform-refresh-summary", input.timestamp),
    headline: passed
      ? "Executive Intent Platform refresh certified."
      : "Executive Intent Platform refresh failed.",
    passed,
    refreshVersion: EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
    refreshStatus: EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
    totalChecks: input.certification.checks.length,
    passedChecks,
    failedChecks,
    regressionPassed: input.certification.regression.certified,
    platformFreezePreserved: input.certification.platformFreeze.certified,
    contextExtensionRegistered:
      input.certification.refreshManifest.extensionRegistry.some(
        (entry) => entry.exportName === "ExecutiveIntentContextEngine" && entry.certified
      ),
    timestamp: input.timestamp,
    readOnly: true as const,
  });
}

export function runExecutiveIntentPlatformRefresh(
  timestamp: string = DEFAULT_TIME
): ExecutiveIntentPlatformRefreshResult {
  const certification = runExecutiveIntentPlatformRefreshCertification(timestamp);
  const summary = buildPlatformRefreshSummary({ certification, timestamp });
  return Object.freeze({
    refreshVersion: EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
    certified: certification.certified,
    released: certification.released,
    status: certification.status,
    refreshStatus: EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
    summary,
    tags: EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
    refreshManifest: certification.refreshManifest,
    certification,
    readOnly: true as const,
  });
}

export {
  runExecutiveIntentPlatformRefreshCertification,
  runExecutiveIntentPlatformRefreshRegression,
  buildExecutiveIntentPlatformRefreshManifest,
};

export const ExecutiveIntentPlatformRefresh = Object.freeze({
  runExecutiveIntentPlatformRefresh,
  runExecutiveIntentPlatformRefreshCertification,
  runExecutiveIntentPlatformRefreshRegression,
  buildPlatformRefreshSummary,
  getExecutiveIntentPlatformRefreshManifest,
  version: EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
  refreshStatus: EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
  tags: EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
  certification: ExecutiveIntentPlatformRefreshCertification,
  regression: ExecutiveIntentPlatformRefreshRegression,
});
