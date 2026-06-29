/**
 * APP-3.15.1 — Executive Intent Platform Refresh Certification.
 * Administrative certification — no intelligence or engine behavior changes.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES } from "./executiveIntentContextEngine.ts";
import { EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION } from "./executiveIntentContextTypes.ts";
import {
  buildExecutiveIntentPlatformRefreshManifest,
  EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
  EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
} from "./executiveIntentPlatformRefreshManifest.ts";
import { runExecutiveIntentPlatformRefreshRegression } from "./executiveIntentPlatformRefreshRegression.ts";
import {
  EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES,
  EXECUTIVE_INTENT_PLATFORM_STATUS,
} from "./executiveIntentPlatformFreezeManifest.ts";
import { runExecutiveIntentPlatform } from "./executiveIntentPlatformRunner.ts";
import { ExecutiveIntentPlatformRunner } from "./executiveIntentPlatformRunner.ts";

const REPO_ROOT = join(process.cwd(), "..");
const REFRESH_REPORT_PATH = join(
  REPO_ROOT,
  "docs/app-3-15-1-executive-intent-platform-refresh-report.md"
);

export type ExecutiveIntentPlatformRefreshCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveIntentPlatformRefreshCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  released: boolean;
  checks: readonly ExecutiveIntentPlatformRefreshCertificationCheck[];
  passedChecks: readonly ExecutiveIntentPlatformRefreshCertificationCheck[];
  failedChecks: readonly ExecutiveIntentPlatformRefreshCertificationCheck[];
  tags: typeof EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS;
  summary: string;
  generatedAt: string;
  regression: ReturnType<typeof runExecutiveIntentPlatformRefreshRegression>;
  platformFreeze: ReturnType<typeof runExecutiveIntentPlatform>;
  refreshManifest: ReturnType<typeof buildExecutiveIntentPlatformRefreshManifest>;
  readOnly: true;
}>;

function nowIso(): string {
  return new Date().toISOString();
}

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveIntentPlatformRefreshCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

export function runExecutiveIntentPlatformRefreshCertification(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveIntentPlatformRefreshCertificationResult {
  const regression = runExecutiveIntentPlatformRefreshRegression(timestamp);
  const platformFreeze = runExecutiveIntentPlatform(timestamp);
  const generatedAt = nowIso();
  const refreshManifest = buildExecutiveIntentPlatformRefreshManifest(generatedAt);
  const contextExtension = EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY.find(
    (entry) => entry.exportName === "ExecutiveIntentContextEngine"
  );

  const checks: ExecutiveIntentPlatformRefreshCertificationCheck[] = [
    check(
      "A",
      "Platform Identity",
      refreshManifest.platformId === "executive-intent-platform" &&
        refreshManifest.platformStatus === EXECUTIVE_INTENT_PLATFORM_STATUS,
      refreshManifest.platformName
    ),
    check(
      "B",
      "Freeze Integrity",
      platformFreeze.certified &&
        platformFreeze.platformStatus === "FROZEN" &&
        EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.breakingChangesForbidden === true,
      platformFreeze.summary
    ),
    check(
      "C",
      "Context Extension Registration",
      contextExtension?.certified === true &&
        contextExtension?.version === EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION &&
        contextExtension?.status === "optional_extension",
      contextExtension?.extensionId ?? "missing"
    ),
    check(
      "D",
      "Platform Manifest",
      refreshManifest.refreshHash.startsWith("refresh-") &&
        refreshManifest.freezeManifest.platformStatus === EXECUTIVE_INTENT_PLATFORM_STATUS,
      refreshManifest.refreshHash
    ),
    check(
      "E",
      "Platform Runner Metadata",
      EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.runtimeBehaviorChanged === false &&
        EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.registeredExtensions.includes(
          "ExecutiveIntentContextEngine"
        ),
      EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.refreshVersion
    ),
    check(
      "F",
      "Compatibility Matrix",
      Object.values(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX).every(
        (entry) => "compatible" in entry && entry.compatible === true
      ),
      `${Object.keys(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX).length} entries`
    ),
    check(
      "G",
      "Extension Registry",
      EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY.length >= 1 &&
        EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY[0]?.nonBreaking === true,
      EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY.map((entry) => entry.exportName).join(", ")
    ),
    check(
      "H",
      "Consumer Rules",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES.primaryIntelligenceInterface ===
        "ExecutiveIntentReasoning" &&
        EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES.optionalExtensions.includes(
          "ExecutiveIntentContextEngine"
        ),
      "Reasoning primary; context optional."
    ),
    check(
      "I",
      "Regression",
      regression.certified && regression.architectureDriftDetected === false,
      regression.summary
    ),
    check(
      "J",
      "APP-3:15 Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.app315Freeze.compatible === true &&
        regression.phases.find((phase) => phase.phaseId === "APP-3/15")?.certified === true,
      "APP-3:15 freeze preserved."
    ),
    check(
      "K",
      "APP-3.3.1 Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.app331ContextEngine.compatible === true &&
        regression.phases.find((phase) => phase.phaseId === "APP-3.3.1")?.certified === true,
      EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION
    ),
    check(
      "L",
      "Assistant Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.assistant.compatible === true &&
        EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.assistant.runtimeBehaviorChanged === false,
      "Assistant unchanged."
    ),
    check(
      "M",
      "Dashboard Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.dashboard.compatible === true &&
        EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.dashboard.runtimeBehaviorChanged === false,
      "Dashboard unchanged."
    ),
    check(
      "N",
      "Architecture",
      EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES.noReasoning === true &&
        EXECUTIVE_INTENT_CONTEXT_ENGINE_RULES.readOnly === true &&
        refreshManifest.metadataOnly === true,
      "Administrative refresh only."
    ),
    check(
      "O",
      "Backward Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.backwardCompatible.compatible === true &&
        EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.frozenPublicApis.length >= 5,
      "Frozen public APIs preserved."
    ),
    check(
      "P",
      "Public API Stability",
      typeof ExecutiveIntentPlatformRunner.runExecutiveIntentPlatform === "function" &&
        ExecutiveIntentPlatformRunner.version === "APP-3/15",
      "Runner version unchanged."
    ),
    check(
      "Q",
      "Read-only Guarantees",
      contextExtension?.readOnly === true &&
        EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES.readOnly === true,
      "Refresh metadata read-only."
    ),
    check(
      "R",
      "Release Metadata",
      refreshManifest.releaseTags.includes("[RELEASE_READY]") &&
        refreshManifest.releaseTags.includes("[CONTEXT_EXTENSION_REGISTERED]"),
      refreshManifest.releaseTags.join(" ")
    ),
    check(
      "S",
      "Refresh Version",
      refreshManifest.refreshVersion === EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION &&
        refreshManifest.refreshStatus === EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
      EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION
    ),
    check(
      "T",
      "Platform Refresh Phase",
      regression.phases.find((phase) => phase.phaseId === "APP-3.15.1")?.certified === true,
      "APP-3.15.1 regression phase passed."
    ),
    check(
      "U",
      "Scenario Intelligence Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.scenarioIntelligence.compatible === true,
      "Scenario intelligence compatible."
    ),
    check(
      "V",
      "Executive Time Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.executiveTime.compatible === true,
      "Executive time compatible."
    ),
    check(
      "W",
      "Memory and Governance Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.executiveMemory.compatible === true &&
        EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.governance.compatible === true,
      "Memory and governance compatible."
    ),
    check(
      "X",
      "LAY Compatibility",
      EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.layArchitecture.compatible === true,
      "LAY architecture compatible."
    ),
    check(
      "Y",
      "Certification Drift",
      regression.certificationDriftDetected === false && regression.apiDriftDetected === false,
      "No certification drift detected."
    ),
    check(
      "Z",
      "Refresh Released",
      refreshManifest.refreshStatus === EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS &&
        regression.certified &&
        platformFreeze.certified &&
        existsSync(REFRESH_REPORT_PATH),
      EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION
    ),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-3.15.1 Executive Intent Platform Refresh",
    status: certified ? "PASS" : "FAIL",
    certified,
    released: certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    tags: EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
    summary: certified
      ? "APP-3.15.1 Executive Intent Platform Refresh CERTIFIED."
      : `APP-3.15.1 Executive Intent Platform Refresh FAILED (${failedChecks.length} gate(s)).`,
    generatedAt,
    regression,
    platformFreeze,
    refreshManifest,
    readOnly: true as const,
  });
}

export const ExecutiveIntentPlatformRefreshCertification = Object.freeze({
  runExecutiveIntentPlatformRefreshCertification,
});
